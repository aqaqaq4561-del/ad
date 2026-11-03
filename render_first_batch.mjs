import fs from "node:fs";
import { chromium } from "playwright";

const toBase64 = (filePath) => {
  const data = fs.readFileSync(filePath);
  return `data:image/jpeg;base64,${data.toString("base64")}`;
};

function makeHTML({
  eyebrow = "결혼 전제 프리미엄 매칭   |   버진로드",
  headline,
  facts,
  imgUri,
  topPct = 18,
  hlSize = 88,
  scrimOpacity = 0.36,
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
  background-position: center center;
}
.subtle-scrim {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 92% 36% at 50% ${topPct + 12}%,
    rgba(12, 9, 6, ${scrimOpacity}) 0%,
    rgba(12, 9, 6, ${scrimOpacity * 0.45}) 62%,
    rgba(12, 9, 6, 0) 100%
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
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0.14em;
  color: #F3ECE1;
  margin-bottom: 30px;
  filter: drop-shadow(0 2px 14px rgba(0, 0, 0, 0.82)) drop-shadow(0 1px 4px rgba(0, 0, 0, 0.65));
}
.pipe-sm {
  display: inline-block;
  margin: 0 20px;
  font-weight: 300;
  opacity: 0.75;
}
.headline-wrap {
  filter: drop-shadow(0 6px 26px rgba(0, 0, 0, 0.82)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.65));
  margin-bottom: 36px;
}
.headline {
  font-size: ${hlSize}px;
  font-weight: 600;
  line-height: 1.26;
  letter-spacing: -0.025em;
  background: linear-gradient(105deg, #FFFDF9 0%, #FDF2DF 48%, #F2CA92 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hl-line {
  display: block;
  white-space: nowrap;
}
.facts {
  font-size: 30px;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: #F6EFE4;
  filter: drop-shadow(0 3px 16px rgba(0, 0, 0, 0.85)) drop-shadow(0 1px 4px rgba(0, 0, 0, 0.7));
  white-space: nowrap;
}
.pipe {
  display: inline-block;
  margin: 0 20px;
  font-weight: 300;
  opacity: 0.75;
}
</style>
</head>
<body>
  <div class="bg-photo"></div>
  <div class="subtle-scrim"></div>
  <div class="text-block">
    <div class="eyebrow">${eyebrowHtml}</div>
    <div class="headline-wrap">
      <div class="headline">${hlHtml}</div>
    </div>
    <div class="facts">${factsHtml}</div>
  </div>
</body>
</html>`;
}

async function run() {
  const dir = "C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877";
  const imgA = toBase64(`${dir}/snipit_01_terrace_1793596384095.jpg`);
  const imgB = toBase64(`${dir}/snipit_02_lounge_1793596405370.jpg`);
  const imgC = toBase64(`${dir}/snipit_03_gathering_1793596431195.jpg`);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });

  const jobs = [
    {
      out: "snipit_A_12times_vs_1night.png",
      headline: "소개팅 12번보다 깊은\n풀빌라 1박 2일",
      facts: ["풀빌라 1박 2일", "남녀 6:6", "전원 사전 심사", "결혼 전제 매칭"],
      imgUri: imgA,
      topPct: 21,
      hlSize: 86,
      scrimOpacity: 0.42,
    },
    {
      out: "snipit_B_profile_vs_1night.png",
      headline: "프로필 백 장보다\n함께 보내는 1박 2일",
      facts: ["전원 사전 심사", "남녀 6:6", "풀빌라 1박 2일", "결혼 전제 매칭"],
      imgUri: imgB,
      topPct: 6.5,
      hlSize: 86,
      scrimOpacity: 0.28,
    },
    {
      out: "snipit_C_verified_6vs6.png",
      headline: "사전 심사 거친 남녀 6:6\n풀빌라 1박 2일 결혼 매칭",
      facts: ["전원 사전 심사", "결혼 전제 매칭", "깊은 대화와 식사"],
      imgUri: imgC,
      topPct: 20,
      hlSize: 82,
      scrimOpacity: 0.42,
    },
  ];

  for (const j of jobs) {
    await page.setContent(makeHTML(j), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `output/virginroad/first_batch/${j.out}`, type: "png" });
    await page.screenshot({ path: `${dir}/${j.out}`, type: "png" });
    console.log("Saved", j.out);
  }

  await browser.close();
}

run();
