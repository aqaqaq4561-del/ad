import fs from "node:fs";
import { chromium } from "playwright";

process.loadEnvFile(".env");
const KEY = process.env.OPENAI_API_KEY;

async function generateGPTImage(name, prompt) {
  for (const model of ["gpt-image-1.5", "gpt-image-1"]) {
    try {
      console.log(`Generating ${name} with ${model}...`);
      const r = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          n: 1,
          size: "1024x1536",
          quality: "high",
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(`${r.status}: ${JSON.stringify(j)}`);
      const buf = Buffer.from(j.data[0].b64_json, "base64");
      const outPath = `assets/virginroad/${name}.png`;
      fs.writeFileSync(outPath, buf);
      console.log(`Saved ${outPath} (${Math.round(buf.length / 1024)} KB)`);
      return `data:image/png;base64,${buf.toString("base64")}`;
    } catch (e) {
      console.log(`Model ${model} error:`, e.message);
    }
  }
  throw new Error(`All models failed for ${name}`);
}

function renderCard({
  eyebrow = "결혼 전제 프리미엄 매칭   |   버진로드",
  headline,
  facts,
  imgUri,
  pos = "top", // "top" | "center" | "bottom"
  topPct = 5.5,
  bottomPct = 6,
  hlSize = 88,
  bgPosY = "center",
}) {
  const hlHtml = headline
    .split("\n")
    .map((line) => `<span class="hl-line">${line}</span>`)
    .join("");
  const factsHtml = facts
    .map((f) => `<span class="fact-item">${f}</span>`)
    .join(`<span class="pipe">|</span>`);
  const eyebrowHtml = eyebrow
    .split("|")
    .map((s) => s.trim())
    .join(`<span class="pipe-sm">|</span>`);

  const scrimCSS =
    pos === "bottom"
      ? `background: linear-gradient(to top, rgba(8,6,4,0.9) 0%, rgba(8,6,4,0.65) 24%, rgba(8,6,4,0.18) 40%, rgba(8,6,4,0) 52%);`
      : pos === "center"
      ? `background: radial-gradient(ellipse 95% 42% at 50% 34%, rgba(8,6,4,0.58) 0%, rgba(8,6,4,0.28) 60%, rgba(8,6,4,0) 100%);`
      : `background: linear-gradient(to bottom, rgba(8,6,4,0.72) 0%, rgba(8,6,4,0.48) 26%, rgba(8,6,4,0) 44%);`;

  const posCSS =
    pos === "bottom"
      ? `bottom: ${bottomPct}%;`
      : pos === "center"
      ? `top: 21%;`
      : `top: ${topPct}%;`;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&display=swap">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  width: 1080px;
  height: 1350px;
  overflow: hidden;
  font-family: 'Noto Serif KR', serif;
  background-color: #14110E;
  position: relative;
  -webkit-font-smoothing: antialiased;
}
.bg-photo {
  position: absolute;
  inset: 0;
  background-image: url('${imgUri}');
  background-size: cover;
  background-position: center ${bgPosY};
}
.scrim {
  position: absolute;
  inset: 0;
  ${scrimCSS}
}
.text-block {
  position: absolute;
  ${posCSS}
  left: 52px;
  right: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 10;
}
.eyebrow {
  font-size: 27px;
  font-weight: 400;
  letter-spacing: 0.14em;
  color: #F3ECE1;
  margin-bottom: 22px;
  filter: drop-shadow(0 2px 14px rgba(0, 0, 0, 0.85));
}
.pipe-sm { display: inline-block; margin: 0 18px; font-weight: 300; opacity: 0.75; }
.headline-wrap {
  filter: drop-shadow(0 6px 26px rgba(0, 0, 0, 0.88)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.7));
  margin-bottom: 28px;
}
.headline {
  font-size: ${hlSize}px;
  font-weight: 600;
  line-height: 1.24;
  letter-spacing: -0.025em;
  background: linear-gradient(105deg, #FFFDF9 0%, #FDF2DF 46%, #F2C88E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hl-line { display: block; white-space: nowrap; }
.facts {
  font-size: 29px;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: #F6EFE4;
  filter: drop-shadow(0 3px 14px rgba(0, 0, 0, 0.88));
  white-space: nowrap;
}
.pipe { display: inline-block; margin: 0 18px; font-weight: 300; opacity: 0.75; }
</style>
</head>
<body>
  <div class="bg-photo"></div>
  <div class="scrim"></div>
  <div class="text-block">
    <div class="eyebrow">${eyebrowHtml}</div>
    <div class="headline-wrap"><div class="headline">${hlHtml}</div></div>
    <div class="facts">${factsHtml}</div>
  </div>
</body>
</html>`;
}

// 1) 설레는 첫 대면 순간 (현실판 하트시그널 1일차 저녁 다이닝 설렘)
const uriA = await generateGPTImage(
  "hook48_01_first_glance",
  `Real photography shot on Leica Noctilux 50mm f/1.2 lens, cinematic Korean romantic reality show ('Heart Signal' luxury mood) still frame.
Scene: The fluttering first evening dinner at a modern luxury pool villa in Korea. Across a warm wooden dining table, a genuinely handsome early-30s Korean man (clean dark tailored jacket over knit, modern Korean dandy hairstyle) and a genuinely beautiful late-20s Korean woman (elegant ivory silk blouse, natural wavy dark hair, glowing natural skin texture) catch each other's eyes and share a shy, heart-fluttering smile as he pours water into her glass.
Softly out of focus in the warm background are the glowing infinity pool and hints of a 6:6 gathering.
Framing: Subjects are in the upper-middle frame so the lower third is warm dark wooden table shadow suitable for clean bottom typography. No text or watermarks.`
);

// 2) 1인칭 시점(POV) + 시선 강탈 아이컨택 & 대각선 풀빌라 테라스
const uriB = await generateGPTImage(
  "hook48_02_terrace_spark",
  `Real photography shot on Hasselblad 85mm f/1.4 portrait lens, high-end Korean editorial campaign.
Scene: At a luxury architectural pool villa in Korea during golden twilight. A genuinely attractive early-30s Korean man (cream cashmere knit sweater, warm reliable impression) and a beautiful late-20s Korean woman (soft beige dress, radiant natural smile) are standing close together by the glass railing of an infinity pool terrace, turned toward each other, laughing candidly while holding warm tea mugs.
Above them in the top 35% of the vertical frame, the diagonal dark teak wood roof overhang and deep twilight sky create a clean, dark area for magazine headline typography.
Natural skin pores and subtle film grain, zero plastic AI look. No text or watermarks.`
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
const artifactDir = "C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877";
const uriExisting1 = `data:image/png;base64,${fs.readFileSync("assets/virginroad/gpt_01_evening_terrace.png").toString("base64")}`;

const jobs = [
  {
    out: "48h_01_first_glance_bottom.png",
    imgUri: uriA,
    pos: "bottom",
    bottomPct: 6,
    hlSize: 90,
    bgPosY: "20%",
  },
  {
    out: "48h_02_terrace_spark_top.png",
    imgUri: uriB,
    pos: "top",
    topPct: 5.2,
    hlSize: 88,
    bgPosY: "15%",
  },
  {
    out: "48h_03_evening_couple_top.png",
    imgUri: uriExisting1,
    pos: "top",
    topPct: 4.8,
    hlSize: 88,
    bgPosY: "15%",
  },
];

for (const j of jobs) {
  const html = renderCard({
    headline: "48시간 안에\n내 결혼상대 찾기",
    facts: ["풀빌라 1박 2일", "남녀 6:6", "전원 사전 심사", "결혼 전제 매칭"],
    ...j,
  });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `output/virginroad/first_batch/${j.out}`, type: "png" });
  await page.screenshot({ path: `${artifactDir}/${j.out}`, type: "png" });
  console.log("Rendered", j.out);
}

await browser.close();

