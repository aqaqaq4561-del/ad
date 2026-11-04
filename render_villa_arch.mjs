import fs from "node:fs";
import { chromium } from "playwright";

const artifactDir = "C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877";

const toBase64 = (filePath) => {
  const mime = filePath.endsWith(".png") ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
};

// Dark Architectural Pool Villa + Gold Highlight Serif + Smoked Glass Gold-Rimmed Pills (Exact match to 06_villa_arch_gold_pills.jpg)
export function makeDarkVillaGlassPillsHTML({
  eyebrow = "결혼 전제 프리미엄 매칭   |   버진로드",
  headlineHTML,
  pills = ["참가자 사전 심사", "결혼 전제 매칭", "후속 매칭 보장"],
  imgUri,
  topPct = 6.8,
  hlSize = 84,
  bgPosY = "center",
}) {
  const eyebrowFormatted = eyebrow
    .split("|")
    .map((s) => s.trim())
    .join(`<span class="pipe">|</span>`);

  const pillsHTML = pills
    .map((p) => `<div class="glass-pill">${p}</div>`)
    .join("");

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
  background-color: #12100E;
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
/* 상단 좌측~중앙 어두운 처마/하늘 그라데이션 보강 */
.top-vignette {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    170deg,
    rgba(10, 10, 12, 0.84) 0%,
    rgba(14, 12, 10, 0.56) 24%,
    rgba(14, 12, 10, 0.18) 42%,
    rgba(14, 12, 10, 0) 56%
  );
}
.text-block {
  position: absolute;
  top: ${topPct}%;
  left: 48px;
  right: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 10;
}
.eyebrow {
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 0.24em;
  color: rgba(236, 229, 218, 0.88);
  margin-bottom: 36px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.75);
}
.eyebrow .pipe {
  display: inline-block;
  margin: 0 22px;
  font-weight: 300;
  opacity: 0.7;
}
.headline {
  font-size: ${hlSize}px;
  font-weight: 600;
  line-height: 1.32;
  letter-spacing: -0.02em;
  color: #F6F2EB;
  text-shadow: 0 6px 26px rgba(0, 0, 0, 0.75), 0 2px 8px rgba(0, 0, 0, 0.55);
  margin-bottom: 44px;
}
.headline .gold {
  color: #C89D62;
}
.pills-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
}
.glass-pill {
  padding: 17px 38px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(44, 36, 28, 0.62) 0%, rgba(26, 21, 16, 0.74) 100%);
  border: 1.3px solid rgba(198, 156, 102, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.32);
  color: #EDE3D4;
  font-size: 31px;
  font-weight: 400;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
</style>
</head>
<body>
  <div class="bg-photo"></div>
  <div class="top-vignette"></div>
  <div class="text-block">
    <div class="eyebrow">${eyebrowFormatted}</div>
    <div class="headline">${headlineHTML}</div>
    <div class="pills-row">${pillsHTML}</div>
  </div>
</body>
</html>`;
}

// Bright Sunlit Pine Villa Lounge + Outlined Gold-Bronze Pills (Exact match to 03_12_vs_1night.jpg)
export function makeBrightVillaOutlinedPillsHTML({
  eyebrow = "결혼 전제 프리미엄 매칭   |   버진로드",
  headlineHTML,
  pills = ["풀빌라 1박 2일", "남녀 6:6", "결혼 전제", "사전 심사"],
  imgUri,
  topPct = 5.5,
  hlSize = 84,
  bgPosY = "center",
}) {
  const eyebrowFormatted = eyebrow
    .split("|")
    .map((s) => s.trim())
    .join(`<span class="pipe">|</span>`);

  const pillsHTML = pills
    .map((p) => `<div class="outline-pill">${p}</div>`)
    .join("");

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
  background-color: #EFEAE1;
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
.top-cream-mist {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(244, 239, 230, 0.92) 0%,
    rgba(244, 239, 230, 0.82) 26%,
    rgba(244, 239, 230, 0.35) 42%,
    rgba(244, 239, 230, 0) 54%
  );
}
.text-block {
  position: absolute;
  top: ${topPct}%;
  left: 48px;
  right: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 10;
}
.eyebrow {
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 0.2em;
  color: #6E6254;
  margin-bottom: 38px;
}
.eyebrow .pipe {
  display: inline-block;
  margin: 0 18px;
  font-weight: 300;
  opacity: 0.65;
}
.headline {
  font-size: ${hlSize}px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.025em;
  color: #3D332A;
  margin-bottom: 40px;
}
.headline .gold {
  color: #B68B52;
}
.pills-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
}
.outline-pill {
  padding: 13px 32px;
  border-radius: 999px;
  background: rgba(250, 246, 239, 0.62);
  border: 1.3px solid rgba(120, 102, 82, 0.55);
  backdrop-filter: blur(6px);
  color: #4A3E33;
  font-size: 28px;
  font-weight: 400;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
</style>
</head>
<body>
  <div class="bg-photo"></div>
  <div class="top-cream-mist"></div>
  <div class="text-block">
    <div class="eyebrow">${eyebrowFormatted}</div>
    <div class="headline">${headlineHTML}</div>
    <div class="pills-row">${pillsHTML}</div>
  </div>
</body>
</html>`;
}



// Copy raw villa images and render all 4 creatives
const rawVilla = [
  ["nb_villa_01_overhang_infinity_1793760157050.jpg", "nb_villa_01_overhang_infinity.jpg"],
  ["nb_villa_02_poolside_table12_1793760178650.jpg", "nb_villa_02_poolside_table12.jpg"],
  ["nb_villa_03_sunlit_pine_lounge_1793760198607.jpg", "nb_villa_03_sunlit_pine_lounge.jpg"],
  ["nb_villa_04_sunken_lounge_dusk_1793760218954.jpg", "nb_villa_04_sunken_lounge_dusk.jpg"],
];

for (const [src, dst] of rawVilla) {
  fs.copyFileSync(`${artifactDir}/${src}`, `assets/virginroad/${dst}`);
}

const v1 = toBase64("assets/virginroad/nb_villa_01_overhang_infinity.jpg");
const v2 = toBase64("assets/virginroad/nb_villa_02_poolside_table12.jpg");
const v3 = toBase64("assets/virginroad/nb_villa_03_sunlit_pine_lounge.jpg");
const v4 = toBase64("assets/virginroad/nb_villa_04_sunken_lounge_dusk.jpg");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });

const jobs = [
  {
    out: "villa_01_48h_infinity.png",
    html: makeDarkVillaGlassPillsHTML({
      headlineHTML: `<span class="gold">48시간</span> 안에<br>내 결혼상대 찾기`,
      pills: ["풀빌라 1박 2일", "남녀 6:6", "전원 사전 심사"],
      imgUri: v1,
      topPct: 6.8,
      hlSize: 84,
    }),
  },
  {
    out: "villa_02_6vs6_poolside_table.png",
    html: makeDarkVillaGlassPillsHTML({
      headlineHTML: `풀빌라에서 <span class="gold">남녀 6:6</span><br><span class="gold">1박 2일</span> 결혼 매칭`,
      pills: ["참가자 사전 심사", "결혼 전제 매칭", "풀빌라 1박 2일"],
      imgUri: v2,
      topPct: 6.8,
      hlSize: 82,
    }),
  },
  {
    out: "villa_03_2days_100times_pine_lounge.png",
    html: makeBrightVillaOutlinedPillsHTML({
      headlineHTML: `함께 지낸 <span class="gold">2일</span> =<br>소개팅 <span class="gold">100번</span>`,
      pills: ["20 · 30대", "남녀 6:6", "결혼 전제", "사전 심사"],
      imgUri: v3,
      topPct: 5.5,
      hlSize: 84,
    }),
  },
  {
    out: "villa_04_48h_sunken_firepit.png",
    html: makeDarkVillaGlassPillsHTML({
      headlineHTML: `어색한 <span class="gold">2시간</span> 대신<br>결혼할 사람 알아보는 <span class="gold">48시간</span>`,
      pills: ["풀빌라 1박 2일", "남녀 6:6", "전원 사전 심사"],
      imgUri: v4,
      topPct: 6.8,
      hlSize: 76,
    }),
  },
];

for (const j of jobs) {
  await page.setContent(j.html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `output/virginroad/first_batch/${j.out}`, type: "png" });
  await page.screenshot({ path: `${artifactDir}/${j.out}`, type: "png" });
  console.log("Rendered", j.out);
}

await browser.close();
