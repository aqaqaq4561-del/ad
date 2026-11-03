import fs from "node:fs";
import { chromium } from "playwright";

process.loadEnvFile(".env");
const KEY = process.env.OPENAI_API_KEY;

async function pickModel() {
  const r = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${KEY}` },
  });
  const j = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(j));
  const ids = j.data.map((m) => m.id);
  const imgModels = ids.filter((id) => id.includes("image") || id.includes("dall"));
  console.log("Available OpenAI image models:", imgModels.join(", "));
  for (const pref of ["gpt-image-1.5", "chatgpt-image-latest", "gpt-image-1"]) {
    if (ids.includes(pref)) return pref;
  }
  return "gpt-image-1";
}

async function generateGPTImage(model, name, prompt) {
  console.log(`Generating ${name} using ${model} (1024x1536, quality: high)...`);
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
  if (!r.ok) throw new Error(`OpenAI Error (${r.status}): ${JSON.stringify(j)}`);
  const b64 = j.data?.[0]?.b64_json;
  let buf;
  if (b64) {
    buf = Buffer.from(b64, "base64");
  } else if (j.data?.[0]?.url) {
    const imgRes = await fetch(j.data[0].url);
    buf = Buffer.from(await imgRes.arrayBuffer());
  } else {
    throw new Error("Unexpected response: " + JSON.stringify(j));
  }
  const outPath = `assets/virginroad/${name}.png`;
  fs.writeFileSync(outPath, buf);
  console.log(`Saved ${outPath} (${Math.round(buf.length / 1024)} KB)`);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

function makeHTML({
  eyebrow = "결혼 전제 프리미엄 매칭   |   버진로드",
  headline,
  facts,
  imgUri,
  topPct = 15,
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
  margin-bottom: 28px;
  filter: drop-shadow(0 2px 14px rgba(0, 0, 0, 0.85)) drop-shadow(0 1px 4px rgba(0, 0, 0, 0.65));
}
.pipe-sm {
  display: inline-block;
  margin: 0 20px;
  font-weight: 300;
  opacity: 0.75;
}
.headline-wrap {
  filter: drop-shadow(0 6px 26px rgba(0, 0, 0, 0.85)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.65));
  margin-bottom: 34px;
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
  filter: drop-shadow(0 3px 16px rgba(0, 0, 0, 0.88)) drop-shadow(0 1px 4px rgba(0, 0, 0, 0.7));
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

const model = await pickModel();

const uri1 = await generateGPTImage(
  model,
  "gpt_01_evening_terrace",
  `Real photography shot on Leica SL2 50mm f/1.4 lens, editorial Korean lifestyle campaign for a luxury pool villa matchmaking retreat.
Medium waist-up portrait of a genuinely handsome late-20s to early-30s Korean man (natural modern Korean dandy hairstyle, wearing a well-fitted dark charcoal knit sweater) and a genuinely beautiful late-20s Korean woman (soft natural dark wavy hair, wearing an elegant cream knit dress) sitting close together at a wooden poolside table on an architectural luxury pool villa terrace at blue-hour dusk.
They are leaning slightly toward each other, making warm, fluttering eye contact with natural, sincere smiles.
Realistic skin texture with natural pores and subtle film grain, NOT plastic or airbrushed.
In the upper third of the vertical frame, the diagonal dark teak wood architectural roof overhang of the villa and deep twilight sky create a calm, darker area suitable for magazine cover text. Softly glowing infinity pool and Korean pine hills behind them. No text or watermarks in the image.`
);

const uri2 = await generateGPTImage(
  model,
  "gpt_02_daylight_lounge",
  `Real photography shot on Hasselblad 50mm f/1.4 lens, Korean luxury editorial lifestyle campaign.
Medium waist-up portrait of a handsome early-30s Korean man (clean ivory linen shirt over white tee, natural Korean hairstyle) and a beautiful late-20s Korean woman (soft beige cardigan, natural glowing skin with real texture, warm eye smile) sitting comfortably together on a wide outdoor lounge sofa under a shaded dark walnut wood overhang terrace at a modern luxury pool villa in Korea during warm late-afternoon sunlight.
They are turned toward each other holding ceramic coffee cups, laughing and talking deeply with genuine romantic chemistry.
Behind them, the calm infinity pool water and green Korean pine forest hills are softly blurred in warm afternoon light.
The diagonal dark walnut wood roof overhang occupies the top third of the vertical frame, providing a rich dark-warm backdrop at the top. No text or watermarks in the image.`
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
const artifactDir = "C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877";

const jobs = [
  {
    out: "gpt_01_2days_100times.png",
    headline: "함께 지낸 2일 =\n소개팅 100번",
    facts: ["풀빌라 1박 2일", "남녀 6:6", "전원 사전 심사", "결혼 전제 매칭"],
    imgUri: uri1,
    topPct: 12,
    hlSize: 90,
    scrimOpacity: 0.35,
  },
  {
    out: "gpt_02_6vs6_match.png",
    headline: "풀빌라에서 남녀 6:6\n1박 2일 결혼 매칭",
    facts: ["전원 사전 심사", "결혼 전제 매칭", "깊은 대화와 식사"],
    imgUri: uri2,
    topPct: 12,
    hlSize: 88,
    scrimOpacity: 0.35,
  },
];

for (const j of jobs) {
  await page.setContent(makeHTML(j), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `output/virginroad/first_batch/${j.out}`, type: "png" });
  await page.screenshot({ path: `${artifactDir}/${j.out}`, type: "png" });
  console.log("Rendered", j.out);
}

await browser.close();

