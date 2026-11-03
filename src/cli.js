#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { recommendCopy, findBanned } from "./copywriter.js";
import { LAYOUTS, FORMATS, nearestAspect } from "./layouts.js";
import { buildImagePrompt, generateWithQA, placeholderImage, listScreenshots } from "./imagegen.js";
import { openRenderer } from "./render.js";

if (fs.existsSync(".env")) process.loadEnvFile(".env");

const HELP = `
광고소재 제작기

  1) 문구 추천
     npm run copy -- virginroad [--n 12] [--angle "추가 지시"]

  2) 고른 문구로 소재 제작
     npm run make -- virginroad --pick 1,4 [--variants 3] [--format feed|square|story]
     npm run make -- virginroad --text "직접 쓴 헤드라인" [--sub "서브"] [--highlight "강조부분"]

  옵션
     --no-image     AI 이미지 대신 회색 자리표시자 사용 (레이아웃만 빠르게 확인, API 비용 없음)
     --layouts a,b  특정 레이아웃만 사용 (${Object.keys(LAYOUTS).join(", ")})
`;

const stamp = () => {
  const d = new Date(), p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
};
const readJSON = (f, def) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : def);
const writeJSON = (f, v) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(v, null, 2), "utf8"); };

function loadBrand(id) {
  const f = path.join("brands", `${id}.json`);
  if (!fs.existsSync(f)) throw new Error(`브랜드 설정이 없습니다: ${f}`);
  return JSON.parse(fs.readFileSync(f, "utf8"));
}

// ───────────────────────── 1) 문구 추천 ─────────────────────────
async function cmdCopy(brand, v) {
  console.log(`\n[${brand.name}] 문구 후보 생성 중...`);
  const { candidates, rejected, usedWinners } = await recommendCopy(brand, { n: +(v.n || 12), angle: v.angle || "" });
  if (!usedWinners) console.log(`  (참고: data/${brand.id}/ 에 성과 좋은 소재 자료가 아직 없어 일반 원칙으로만 추천합니다)`);

  const dir = path.join("output", brand.id, "copy");
  const ts = stamp();
  writeJSON(path.join(dir, `${ts}.json`), candidates);
  writeJSON(path.join(dir, "latest.json"), candidates);

  const lines = [`# ${brand.name} 문구 후보 (${ts})`, ""];
  console.log("");
  candidates.forEach((c, i) => {
    const n = i + 1;
    const head = c.headline.replace(/\n/g, " / ");
    console.log(`[${n}] ${c.approved ? "★확정 " : ""}(${c.hook_type}) ${head}`);
    if (c.sub) console.log(`     └ ${c.sub}`);
    if (!c.approved) console.log(`     · ${c.why}`);
    lines.push(`## [${n}] ${head}`, c.sub ? `- 서브: ${c.sub}` : "", `- 유형: ${c.hook_type}`, `- 강조: ${c.highlight || "-"}`, `- 이유: ${c.why}`, c.scene_ids?.length ? `- 추천 장면: ${c.scene_ids.join(", ")}` : "", "");
  });
  if (rejected.length) {
    lines.push("## 금지어로 자동 제외된 후보", ...rejected.map((r) => `- ${r.headline.replace(/\n/g, " ")} (${r.reason})`));
  }
  fs.writeFileSync(path.join(dir, `${ts}.md`), lines.filter((l) => l !== "").join("\n").replace(/\n## /g, "\n\n## "), "utf8");
  console.log(`\n저장: ${path.join(dir, ts + ".md")}`);
  console.log(`\n마음에 드는 번호를 골라 실행하세요 →  npm run make -- ${brand.id} --pick 1,3\n`);
}

// 덜 쓴 것부터, 직전과 겹치지 않게 고르기
function makePicker(items, counts) {
  let last = null;
  return (prefer = []) => {
    const pool = items.filter((x) => x.id !== last);
    const pref = pool.filter((x) => prefer.includes(x.id));
    const src = pref.length ? pref : pool.length ? pool : items;
    const min = Math.min(...src.map((x) => counts[x.id] || 0));
    const least = src.filter((x) => (counts[x.id] || 0) === min);
    const pick = least[Math.floor(Math.random() * least.length)];
    counts[pick.id] = (counts[pick.id] || 0) + 1;
    last = pick.id;
    return pick;
  };
}

// ───────────────────────── 2) 소재 제작 ─────────────────────────
async function cmdMake(brand, v) {
  // 선택 문구 확정 (선택한 문구는 글자 그대로 사용)
  let picks = [];
  if (v.text) {
    picks = [{ headline: v.text.replace(/\\n/g, "\n"), sub: v.sub || "", highlight: v.highlight || "", hook_type: "직접 입력", scene_ids: [] }];
  } else if (v.pick) {
    const src = v.from || path.join("output", brand.id, "copy", "latest.json");
    const list = readJSON(src, null);
    if (!list) throw new Error(`문구 후보가 없습니다. 먼저 npm run copy -- ${brand.id} 를 실행하세요.`);
    picks = v.pick.split(",").map((s) => {
      const c = list[+s.trim() - 1];
      if (!c) throw new Error(`${s}번 문구가 없습니다 (1~${list.length})`);
      return c;
    });
  } else throw new Error("--pick 또는 --text 가 필요합니다.");

  for (const p of picks) {
    const bad = findBanned(`${p.headline} ${p.sub}`, brand);
    if (bad.length) console.log(`  ⚠ "${p.headline.replace(/\n/g, " ")}" 에 금지어 포함: ${bad.join(", ")} (선택하신 문구이므로 그대로 진행)`);
  }

  const fmt = FORMATS[v.format || "feed"];
  if (!fmt) throw new Error(`format 은 ${Object.keys(FORMATS).join("/")} 중 하나`);
  const variants = +(v.variants || 3);
  const layoutIds = (v.layouts ? v.layouts.split(",") : brand.layouts).filter((id) => LAYOUTS[id]);
  const layouts = layoutIds.map((id) => ({ id, ...LAYOUTS[id] }));

  const histFile = path.join("output", brand.id, "history.json");
  const hist = readJSON(histFile, { layouts: {}, scenes: {} });
  const nextLayout = makePicker(layouts, hist.layouts);

  const screenshot = brand.image_mode === "screenshot";
  const scenes = screenshot ? listScreenshots(brand) : brand.scenes;
  if (screenshot && !scenes.length && !v["no-image"]) throw new Error(`${brand.screenshot_dir} 폴더에 제품 화면 캡처를 넣어 주세요.`);
  const nextScene = scenes.length ? makePicker(scenes, hist.scenes) : () => ({ id: "none", label: "-", emotion: "-" });

  const outDir = path.join("output", brand.id, stamp());
  fs.mkdirSync(path.join(outDir, "photos"), { recursive: true });
  const renderer = await openRenderer();
  const manifest = [];
  let idx = 0;

  try {
    for (const [pi, copy] of picks.entries()) {
      const usedLayouts = new Set();
      console.log(`\n▶ 문구 ${pi + 1}: ${copy.headline.replace(/\n/g, " / ")}`);
      for (let k = 0; k < variants; k++) {
        let layout = nextLayout();
        for (let g = 0; usedLayouts.has(layout.id) && g < 10 && usedLayouts.size < layouts.length; g++) layout = nextLayout();
        usedLayouts.add(layout.id);
        const scene = nextScene(k === 0 ? copy.scene_ids || [] : []);
        idx++;
        const name = `${String(idx).padStart(2, "0")}_${layout.id}_${scene.id}`;
        console.log(`  · ${name}  (${scene.label})`);

        const box = layout.photoBox(fmt.W, fmt.H);
        const aspect = nearestAspect(box.w, box.h);
        let image, report = null, prompt = null;
        if (v["no-image"]) image = placeholderImage(`${scene.label} · ${aspect}`);
        else if (screenshot) image = scene.load();
        else {
          prompt = buildImagePrompt(brand, scene, layout);
          const r = await generateWithQA(prompt, aspect);
          image = r.image; report = r.report;
          if (!report.pass) console.log(`    ⚠ 검수 미통과 이미지 사용: ${report.note}`);
          const ext = image.mime.includes("jpeg") ? "jpg" : "png";
          fs.writeFileSync(path.join(outDir, "photos", `${name}.${ext}`), Buffer.from(image.data, "base64"));
        }

        const ctx = {
          ...fmt, brand, copy, badges: brand.badges,
          img: `data:${image.mime};base64,${image.data}`,
          fit: screenshot ? brand.photo_fit || "contain" : "cover",
        };
        const file = path.join(outDir, `${name}.png`);
        const res = await renderer.render({ html: layout.html(ctx), W: fmt.W, H: fmt.H, out: file, expect: { ...copy, badges: brand.badges } });
        res.problems.forEach((p) => console.log(`    ⚠ ${p}`));

        manifest.push({
          file: path.basename(file), format: v.format || "feed",
          copy: { headline: copy.headline, sub: copy.sub, highlight: copy.highlight },
          tags: { hook_type: copy.hook_type, layout: layout.id, scene: scene.id, emotion: scene.emotion },
          headline_px: res.fontSize, problems: res.problems, image_qa: report, image_prompt: prompt,
        });
      }
    }
  } finally {
    await renderer.close();
    writeJSON(histFile, hist);
    writeJSON(path.join(outDir, "manifest.json"), manifest);
  }

  // 한눈에 보는 검토 페이지
  const cards = manifest.map((m) => `<figure><img src="${m.file}"><figcaption><b>${m.file}</b><br>${m.tags.hook_type} · ${m.tags.layout} · ${m.tags.scene}${m.problems.length ? `<br><span style="color:#c00">${m.problems.join("<br>")}</span>` : ""}</figcaption></figure>`).join("");
  fs.writeFileSync(path.join(outDir, "index.html"), `<!doctype html><meta charset="utf-8"><title>${brand.name} 소재</title><style>body{font-family:sans-serif;background:#eee;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}figure{margin:0;background:#fff;padding:10px;border-radius:8px}img{width:100%}figcaption{font-size:13px;margin-top:6px;color:#444}</style><main>${cards}</main>`, "utf8");
  console.log(`\n완료: ${manifest.length}개 → ${outDir}\\index.html 을 열어 한 번에 확인하세요.\n`);
}

// ───────────────────────── main ─────────────────────────
const [cmd, brandId, ...rest] = process.argv.slice(2);
const { values } = parseArgs({
  args: rest, allowPositionals: true,
  options: {
    n: { type: "string" }, angle: { type: "string" }, pick: { type: "string" }, from: { type: "string" },
    text: { type: "string" }, sub: { type: "string" }, highlight: { type: "string" },
    variants: { type: "string" }, format: { type: "string" }, layouts: { type: "string" }, "no-image": { type: "boolean" },
  },
});

try {
  if (!cmd || !brandId) { console.log(HELP); process.exit(0); }
  const brand = loadBrand(brandId);
  if (cmd === "copy") await cmdCopy(brand, values);
  else if (cmd === "make") await cmdMake(brand, values);
  else console.log(HELP);
} catch (e) {
  console.error(`\n오류: ${e.message}\n`);
  process.exit(1);
}

