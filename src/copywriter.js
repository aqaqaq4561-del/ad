import fs from "node:fs";
import path from "node:path";
import { Type } from "@google/genai";
import { generateJSON } from "./gemini.js";

const IMG_EXT = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

// AI 티 나는 표현 (모든 브랜드 공통 금지)
const AI_CLICHES = [
  "특별한", "완벽한", "새로운 시작", "여정", "경험하세요", "만나보세요", "해보세요!", "당신만을 위한",
  "프리미엄한", "설렘 가득", "인연을 찾아", "놓치지 마세요", "지금 바로", "혁신적인", "차원이 다른",
];

/** data/<brand>/ 의 성과 좋은 소재 자료 읽기 (winners.md + 이미지) */
export function loadWinners(brandId) {
  const dir = path.join("data", brandId);
  const out = { text: "", images: [] };
  if (!fs.existsSync(dir)) return out;
  const md = path.join(dir, "winners.md");
  if (fs.existsSync(md)) out.text = fs.readFileSync(md, "utf8");
  const imgDir = path.join(dir, "winners");
  if (fs.existsSync(imgDir)) {
    for (const f of fs.readdirSync(imgDir).sort()) {
      const mime = IMG_EXT[path.extname(f).toLowerCase()];
      if (mime && out.images.length < 12) {
        out.images.push({ name: f, mime, data: fs.readFileSync(path.join(imgDir, f)).toString("base64") });
      }
    }
  }
  return out;
}

export function findBanned(text, brand) {
  const t = text.replace(/\s+/g, " ");
  return [...brand.banned_phrases, ...AI_CLICHES].filter((b) => t.includes(b));
}

const schema = (sceneIds) => ({
  type: Type.OBJECT,
  properties: {
    candidates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          sub: { type: Type.STRING },
          highlight: { type: Type.STRING },
          hook_type: { type: Type.STRING },
          why: { type: Type.STRING },
          scene_ids: sceneIds.length
            ? { type: Type.ARRAY, items: { type: Type.STRING, enum: sceneIds } }
            : { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["headline", "sub", "highlight", "hook_type", "why", "scene_ids"],
      },
    },
  },
  required: ["candidates"],
});

function buildPrompt(brand, winners, n, angle) {
  const list = (a) => a.map((x) => `- ${x}`).join("\n");
  const scenes = brand.scenes.map((s) => `- ${s.id}: ${s.label} (${s.emotion})`).join("\n");
  return `너는 한국 퍼포먼스 마케팅 카피라이터다. 메타(인스타그램·페이스북) 피드 광고 이미지에 크게 들어갈 헤드라인과 서브카피를 쓴다.
목표는 스크롤을 멈추게 하고 클릭을 부르는 것. 예쁜 말이 아니라 '어, 이거 뭐지?' 하게 만드는 구체적인 한 줄이 필요하다.

[브랜드] ${brand.name}
[한 줄 정의] ${brand.one_liner}
[서비스 사실 — 이 범위를 벗어난 주장 금지]
${list(brand.facts)}
[광고에서 전달할 핵심]
${list(brand.must_show)}
[타깃] ${brand.target}
[톤] ${brand.tone}

[이미 확정된 문구 — 이런 수준과 결을 목표로 하되, 그대로 반복하지 말 것]
${brand.approved_copy.map((c) => `- ${c.headline.replace(/\n/g, " ")}`).join("\n") || "- (없음)"}

[성과가 좋았던 기존 소재 자료]
${winners.text || "(텍스트 자료 없음)"}
${winners.images.length ? `(첨부 이미지 ${winners.images.length}장: ${winners.images.map((i) => i.name).join(", ")} — 문구 구조·길이·후킹 방식을 분석해서 반영할 것)` : ""}

${angle ? `[이번 추가 지시]\n${angle}\n` : ""}
[작성 규칙]
1. 헤드라인은 공백 포함 24자 이내. 서브카피는 32자 이내이며 헤드라인을 서비스 사실로 받쳐 준다. 서브카피가 필요 없으면 빈 문자열.
2. 추상어 금지. 숫자·상황·비교처럼 구체적인 것으로 말한다.
3. 번역투·AI 말투 금지: "~를 경험하세요", "~의 여정", "~해보세요!", 느낌표 남발, 이모지.
4. 확인되지 않은 성과 수치, 상대방 스펙, 결과 보장, 지어낸 후기·인용 금지.
5. 실제 타깃이 피드에서 보고 자기 얘기라고 느낄, 말하듯 자연스러운 한국어.
6. 후킹 유형을 골고루 섞는다: 등식·숫자형, 비교형, 상황공감형, 질문형, 장면묘사형, 반전형, 기준제시형.
7. highlight: 헤드라인 안에서 색으로 강조할 부분. 반드시 헤드라인의 정확한 부분 문자열이어야 하며, 없으면 빈 문자열.
8. 헤드라인 줄바꿈 위치가 의미상 중요하면 \\n 으로 표시한다(단어를 바꾸지 말 것).
9. why: 이 문구가 왜 멈추게/클릭하게 만드는지 한 문장 + 어울리는 장면.
10. 금지어: ${[...brand.banned_phrases, ...AI_CLICHES].join(", ")}
${scenes ? `11. scene_ids: 아래 장면 중 이 문구와 가장 어울리는 것 1~2개.\n${scenes}` : "11. scene_ids: 빈 배열."}

서로 결이 확실히 다른 후보 ${n}개를 작성하라.`;
}

export async function recommendCopy(brand, { n = 12, angle = "" } = {}) {
  const winners = loadWinners(brand.id);
  const prompt = buildPrompt(brand, winners, n + 4, angle); // 금지어 필터 대비 여유분
  const res = await generateJSON({ prompt, schema: schema(brand.scenes.map((s) => s.id)), images: winners.images });

  const rejected = [];
  const ok = [];
  for (const c of res.candidates) {
    c.headline = c.headline.trim();
    c.sub = (c.sub || "").trim();
    if (c.highlight && !c.headline.includes(c.highlight)) c.highlight = "";
    const bad = findBanned(`${c.headline} ${c.sub}`, brand);
    if (bad.length) rejected.push({ ...c, reason: bad.join(", ") });
    else ok.push(c);
  }
  const approved = brand.approved_copy.map((c) => ({ ...c, why: "직접 확정한 문구", scene_ids: [], approved: true }));
  return { candidates: [...approved, ...ok.slice(0, n)], rejected, usedWinners: winners.images.length > 0 || !!winners.text };
}

