import fs from "node:fs";
import { chromium } from "playwright";

process.loadEnvFile(".env");
const KEY = process.env.OPENAI_API_KEY;

async function generateWithReference(name, refFilePaths, prompt) {
  console.log(`Generating ${name} via /v1/images/edits with reference image(s)...`);
  const form = new FormData();
  form.append("model", "gpt-image-1.5");
  form.append("prompt", prompt);
  form.append("size", "1024x1536");
  form.append("quality", "high");

  for (const p of refFilePaths) {
    const blob = new Blob([fs.readFileSync(p)], { type: "image/jpeg" });
    form.append("image[]", blob, p.split(/[\\/]/).pop());
  }

  const r = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}` },
    body: form,
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Edits error (${r.status}): ${JSON.stringify(j)}`);
  const buf = Buffer.from(j.data[0].b64_json, "base64");
  const outPath = `assets/virginroad/${name}.png`;
  fs.writeFileSync(outPath, buf);
  console.log(`Saved ${outPath} (${Math.round(buf.length / 1024)} KB)`);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

// Layout 1: Minimal Sunlit Villa Room Editorial (Ref 1: VIRGIN ROAD + thin vertical line + warm bronze serif)
function makeMinimalEditorialHTML({ headline, sub, imgUri, bgPosY = "center" }) {
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
  /* GPT 특유의 쨍한 디지털 채도와 과한 샤프니스를 눌러 필름 화보 톤으로 보정 */
  filter: saturate(0.84) contrast(0.94) brightness(1.02);
}
.warm-mist {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(223, 211, 193, 0.32) 0%,
    rgba(223, 211, 193, 0.12) 38%,
    rgba(223, 211, 193, 0) 52%
  );
}
.text-block {
  position: absolute;
  top: 9.5%;
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
  font-size: 56px;
  font-weight: 500;
  letter-spacing: 0.24em;
  color: #6E5233;
  padding-left: 0.24em;
  margin-bottom: 24px;
}
.v-line {
  width: 1.5px;
  height: 46px;
  background-color: rgba(110, 82, 51, 0.55);
  margin-bottom: 26px;
}
.headline {
  font-family: 'Noto Serif KR', serif;
  font-size: 74px;
  font-weight: 500;
  line-height: 1.32;
  letter-spacing: -0.02em;
  color: #3E2B19;
  margin-bottom: 24px;
}
.sub {
  font-family: 'Noto Serif KR', serif;
  font-size: 27px;
  font-weight: 400;
  line-height: 1.55;
  letter-spacing: 0.02em;
  color: #5C4733;
}
.pipe {
  display: inline-block;
  margin: 0 16px;
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

// Layout 2: Backlit Soft-Focus Frame Editorial (Ref 2: ornamental horizontal rule frame + bottom VIRGIN ROAD)
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
  background-color: #EAE2D6;
  position: relative;
  -webkit-font-smoothing: antialiased;
}
.bg-photo {
  position: absolute;
  inset: 0;
  background-image: url('${imgUri}');
  background-size: cover;
  background-position: center ${bgPosY};
  filter: saturate(0.82) contrast(0.93) brightness(1.03);
}
.soft-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(242, 235, 224, 0) 35%,
    rgba(242, 235, 224, 0.52) 55%,
    rgba(235, 226, 212, 0.78) 78%,
    rgba(228, 218, 202, 0.85) 100%
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
  margin-bottom: 42px;
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
  line-height: 1.34;
  letter-spacing: -0.025em;
  color: #3B2818;
  margin-bottom: 24px;
}
.sub {
  font-family: 'Noto Serif KR', serif;
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: #5A4330;
  margin-bottom: 38px;
}
.pipe {
  display: inline-block;
  margin: 0 16px;
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

// 1) Ref 1 스타일: 여백과 빛이 살아있는 미니멀 하이엔드 공간 + 우아한 중장거리 인물 구도 (과장된 AI 미소 절대 금지)
const uri1 = await generateWithReference(
  "lux_01_minimal_villa",
  ["data/virginroad/winners/04_luxury_minimal_room.jpg"],
  `Replicate the exact muted warm-ivory color grading, soft diagonal morning sunlight shadows, medium-wide architectural framing, foreground plant blur, and quiet-luxury Kinfolk magazine atmosphere of this reference image, WITHOUT any text or letters anywhere in the image.
- Scene: Inside a minimalist high-end modern Korean pool villa living room with warm beige plaster walls, travertine coffee table in the soft-focus foreground, and a huge floor-to-ceiling window showing sunlit green trees and a glimpse of the pool outside.
- People: Placed in the lower half of the frame at a natural medium-wide distance (NOT a close-up). A graceful late-20s Korean woman with a neat low bun wearing an understated black or deep espresso sleeveless dress sits poised in a designer lounge armchair holding a ceramic cup, looking warmly toward a tall, refined early-30s Korean man in a cream knit sweater and beige trousers who is standing near the window holding a cup and smiling gently back at her.
- Crucial anti-AI rules: Restrained, natural, calm expressions (NO exaggerated toothy grins), desaturated warm cream/sand palette, soft film halation, spacious uncluttered warm plaster ceiling in the upper 45% of the frame. No text.`
);

// 2) Ref 2 스타일: 따스한 역광 소프트 포커스 + 우아한 로우번/아이보리 톤 인물 화보 (과장된 표정 배제)
const uri2 = await generateWithReference(
  "lux_02_backlit_grace",
  ["data/virginroad/winners/05_luxury_bridal_portrait.jpg"],
  `Replicate the exact dreamy backlit warm-cream sunlight, soft optical diffusion, muted ivory-champagne palette, delicate floral foreground blur, and poised Korean luxury bridal/editorial mood of this reference image, WITHOUT any text or letters anywhere in the image.
- Scene: At a sunlit garden terrace table of a luxury villa in late morning. Warm golden-white backlight filters through soft greenery and white/blush flowers on the table.
- People: In the upper-middle frame, a poised, effortlessly elegant late-20s Korean woman with a soft low-bun hairstyle, pearl earrings, and a minimal cream boat-neck dress sits at a white-draped table, gazing with a calm, fluttering, thoughtful half-smile toward a refined early-30s Korean man (seen softly in three-quarter profile across the table in a cream linen jacket) as they converse quietly.
- Crucial anti-AI rules: Soft low-contrast film look, desaturated warm ivory & champagne tones, serene and dignified expression (NO big toothy AI grin), soft bright cream area in the lower 42% of the frame for editorial typography. No text.`
);

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
      bgPosY: "center",
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

