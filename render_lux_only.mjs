import fs from "node:fs";
import { chromium } from "playwright";

const toBase64 = (filePath) =>
  `data:image/png;base64,${fs.readFileSync(filePath).toString("base64")}`;

function makeMinimalEditorialHTML({ headline, sub, imgUri, bgPosY = "65%" }) {
  const hlHtml = headline.replace(/\n/g, "<br>");
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Noto+Serif+KR:wght@300;400;500;600&display=swap">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  width: 1080px;
  height: 1350px;
  overflow: hidden;
  background-color: #DFD5C5;
  position: relative;
  -webkit-font-smoothing: antialiased;
}
.bg-photo {
  position: absolute;
  inset: 0;
  background-image: url('${imgUri}');
  background-size: cover;
  background-position: center ${bgPosY};
  filter: saturate(0.92) contrast(0.96) brightness(1.02) sepia(0.04);
}
.warm-mist {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(224, 212, 194, 0.35) 0%,
    rgba(224, 212, 194, 0.14) 34%,
    rgba(224, 212, 194, 0) 46%
  );
}
.text-block {
  position: absolute;
  top: 5.8%;
  left: 72px;
  right: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 10;
}
.brand-en {
  font-family: 'Cormorant Garamond', 'Noto Serif KR', serif;
  font-size: 54px;
  font-weight: 500;
  letter-spacing: 0.24em;
  color: #6E5233;
  padding-left: 0.24em;
  margin-bottom: 16px;
}
.v-line {
  width: 1.5px;
  height: 36px;
  background-color: rgba(110, 82, 51, 0.55);
  margin-bottom: 18px;
}
.headline {
  font-family: 'Noto Serif KR', serif;
  font-size: 70px;
  font-weight: 500;
  line-height: 1.28;
  letter-spacing: -0.02em;
  color: #3E2B19;
  margin-bottom: 18px;
}
.sub {
  font-family: 'Noto Serif KR', serif;
  font-size: 26px;
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: 0.01em;
  color: #55402C;
}
.pipe {
  display: inline-block;
  margin: 0 14px;
  opacity: 0.55;
  font-weight: 300;
}
</style>
</head>
<body>
  <div class="bg-photo"></div>
  <div class="warm-mist"></div>
  <div class="text-block">
    <div class="brand-en">VIRGIN ROAD</div>
    <div class="v-line"></div>
    <div class="headline">${hlHtml}</div>
    <div class="sub">${sub}</div>
  </div>
</body>
</html>`;
}

function makeFramedPortraitHTML({ headline, sub, imgUri, bgPosY = "top" }) {
  const hlHtml = headline.replace(/\n/g, "<br>");
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Noto+Serif+KR:wght@400;500;600&display=swap">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  width: 1080px;
  height: 1350px;
  overflow: hidden;
  background-color: #EFE7DA;
  position: relative;
  -webkit-font-smoothing: antialiased;
}
.bg-photo {
  position: absolute;
  inset: 0;
  background-image: url('${imgUri}');
  background-size: cover;
  background-position: center ${bgPosY};
  filter: saturate(0.96) contrast(0.97) brightness(1.03) sepia(0.05);
}
.soft-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(246, 239, 228, 0) 38%,
    rgba(246, 239, 228, 0.48) 56%,
    rgba(242, 233, 219, 0.76) 78%,
    rgba(238, 228, 212, 0.84) 100%
  );
}
.frame-box {
  position: absolute;
  bottom: 13.5%;
  left: 76px;
  right: 76px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 10;
}
.top-rule {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 38px;
}
.top-rule .line {
  flex: 1;
  height: 1.2px;
  background-color: rgba(88, 66, 48, 0.55);
}
.top-rule .ornament {
  margin: 0 18px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  color: #584230;
  opacity: 0.85;
}
.headline {
  font-family: 'Noto Serif KR', serif;
  font-size: 74px;
  font-weight: 500;
  line-height: 1.32;
  letter-spacing: -0.025em;
  color: #3B2818;
  margin-bottom: 24px;
}
.sub {
  font-family: 'Noto Serif KR', serif;
  font-size: 27px;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: #5A4330;
  margin-bottom: 36px;
}
.pipe {
  display: inline-block;
  margin: 0 14px;
  opacity: 0.55;
  font-weight: 300;
}
.bottom-rule {
  width: 100%;
  height: 1.2px;
  background-color: rgba(88, 66, 48, 0.55);
}
.brand-bottom {
  position: absolute;
  bottom: 5.2%;
  left: 0;
  right: 0;
  text-align: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 34px;
  font-weight: 600;
  letter-spacing: 0.34em;
  padding-left: 0.34em;
  color: #4A3522;
  z-index: 10;
}
</style>
</head>
<body>
  <div class="bg-photo"></div>
  <div class="soft-glow"></div>
  <div class="frame-box">
    <div class="top-rule">
      <div class="line"></div>
      <div class="ornament">❖</div>
      <div class="line"></div>
    </div>
    <div class="headline">${hlHtml}</div>
    <div class="sub">${sub}</div>
    <div class="bottom-rule"></div>
  </div>
  <div class="brand-bottom">VIRGIN ROAD</div>
</body>
</html>`;
}

const uri1 = toBase64("assets/virginroad/lux_01_minimal_villa.png");
const uri2 = toBase64("assets/virginroad/lux_02_backlit_grace.png");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
const artifactDir = "C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877";

const renders = [
  {
    out: "lux_01_48h_minimal_villa.png",
    html: makeMinimalEditorialHTML({
      headline: "48시간 안에\n내 결혼상대 찾기",
      sub: `풀빌라 1박 2일<span class="pipe">|</span>남녀 6:6<span class="pipe">|</span>전원 사전 심사<span class="pipe">|</span>결혼 전제 매칭`,
      imgUri: uri1,
      bgPosY: "35%",
    }),
  },
  {
    out: "lux_02_48h_backlit_portrait.png",
    html: makeFramedPortraitHTML({
      headline: "48시간 안에,\n내 결혼상대 찾기",
      sub: `풀빌라 1박 2일<span class="pipe">|</span>남녀 6:6<span class="pipe">|</span>전원 사전 심사<span class="pipe">|</span>결혼 전제 매칭`,
      imgUri: uri2,
      bgPosY: "top",
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

