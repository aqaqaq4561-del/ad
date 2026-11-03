import fs from "node:fs";
import { chromium } from "playwright";

const toBase64 = (filePath) =>
  `data:image/png;base64,${fs.readFileSync(filePath).toString("base64")}`;

function makeTopHTML({
  eyebrow = "결혼 전제 프리미엄 매칭   |   버진로드",
  headline,
  facts,
  imgUri,
  topPct = 5.5,
  hlSize = 82,
  bgPosY = "88%",
  scrimOpacity = 0.38,
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
.subtle-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 8, 6, ${scrimOpacity}) 0%,
    rgba(10, 8, 6, ${scrimOpacity * 0.7}) 24%,
    rgba(10, 8, 6, 0) 44%
  );
}
.text-block {
  position: absolute;
  top: ${topPct}%;
  left: 56px;
  right: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 10;
}
.eyebrow {
  font-size: 26px;
  font-weight: 400;
  letter-spacing: 0.14em;
  color: #F3ECE1;
  margin-bottom: 18px;
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.85)) drop-shadow(0 1px 4px rgba(0, 0, 0, 0.65));
}
.pipe-sm { display: inline-block; margin: 0 18px; font-weight: 300; opacity: 0.75; }
.headline-wrap {
  filter: drop-shadow(0 6px 24px rgba(0, 0, 0, 0.85)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.65));
  margin-bottom: 22px;
}
.headline {
  font-size: ${hlSize}px;
  font-weight: 600;
  line-height: 1.22;
  letter-spacing: -0.025em;
  background: linear-gradient(105deg, #FFFDF9 0%, #FDF2DF 48%, #F2CA92 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hl-line { display: block; white-space: nowrap; }
.facts {
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: #F6EFE4;
  filter: drop-shadow(0 3px 14px rgba(0, 0, 0, 0.88)) drop-shadow(0 1px 4px rgba(0, 0, 0, 0.7));
  white-space: nowrap;
}
.pipe { display: inline-block; margin: 0 18px; font-weight: 300; opacity: 0.75; }
</style>
</head>
<body>
  <div class="bg-photo"></div>
  <div class="subtle-scrim"></div>
  <div class="text-block">
    <div class="eyebrow">${eyebrowHtml}</div>
    <div class="headline-wrap"><div class="headline">${hlHtml}</div></div>
    <div class="facts">${factsHtml}</div>
  </div>
</body>
</html>`;
}

function makeBottomHTML({
  eyebrow = "결혼 전제 프리미엄 매칭   |   버진로드",
  headline,
  facts,
  imgUri,
  bottomPct = 6.5,
  hlSize = 84,
  bgPosY = "20%",
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
.bottom-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 8, 6, 0.88) 0%,
    rgba(10, 8, 6, 0.62) 24%,
    rgba(10, 8, 6, 0.18) 38%,
    rgba(10, 8, 6, 0) 50%
  );
}
.text-block {
  position: absolute;
  bottom: ${bottomPct}%;
  left: 56px;
  right: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 10;
}
.eyebrow {
  font-size: 26px;
  font-weight: 400;
  letter-spacing: 0.14em;
  color: #F3ECE1;
  margin-bottom: 18px;
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.85));
}
.pipe-sm { display: inline-block; margin: 0 18px; font-weight: 300; opacity: 0.75; }
.headline-wrap {
  filter: drop-shadow(0 6px 24px rgba(0, 0, 0, 0.85));
  margin-bottom: 24px;
}
.headline {
  font-size: ${hlSize}px;
  font-weight: 600;
  line-height: 1.24;
  letter-spacing: -0.025em;
  background: linear-gradient(105deg, #FFFDF9 0%, #FDF2DF 48%, #F2CA92 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hl-line { display: block; white-space: nowrap; }
.facts {
  font-size: 28px;
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
  <div class="bottom-scrim"></div>
  <div class="text-block">
    <div class="eyebrow">${eyebrowHtml}</div>
    <div class="headline-wrap"><div class="headline">${hlHtml}</div></div>
    <div class="facts">${factsHtml}</div>
  </div>
</body>
</html>`;
}

const uri1 = toBase64("assets/virginroad/gpt_01_evening_terrace.png");
const uri2 = toBase64("assets/virginroad/gpt_02_daylight_lounge.png");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
const artifactDir = "C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877";

const renders = [
  {
    out: "gpt_01_top_2days_100times.png",
    html: makeTopHTML({
      headline: "함께 지낸 2일 =\n소개팅 100번",
      facts: ["풀빌라 1박 2일", "남녀 6:6", "전원 사전 심사", "결혼 전제 매칭"],
      imgUri: uri1,
      topPct: 4.8,
      hlSize: 80,
      bgPosY: "15%",
    }),
  },
  {
    out: "gpt_01_bottom_2days_100times.png",
    html: makeBottomHTML({
      headline: "함께 지낸 2일 =\n소개팅 100번",
      facts: ["풀빌라 1박 2일", "남녀 6:6", "전원 사전 심사", "결혼 전제 매칭"],
      imgUri: uri1,
      bottomPct: 5.5,
      hlSize: 86,
      bgPosY: "25%",
    }),
  },
  {
    out: "gpt_02_bottom_6vs6_match.png",
    html: makeBottomHTML({
      headline: "풀빌라에서 남녀 6:6\n1박 2일 결혼 매칭",
      facts: ["전원 사전 심사", "결혼 전제 매칭", "깊은 대화와 식사"],
      imgUri: uri2,
      bottomPct: 5.5,
      hlSize: 86,
      bgPosY: "22%",
    }),
  },
];

for (const r of renders) {
  await page.setContent(r.html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `output/virginroad/first_batch/${r.out}`, type: "png" });
  await page.screenshot({ path: `${artifactDir}/${r.out}`, type: "png" });
  console.log("Rendered", r.out);
}

await browser.close();

