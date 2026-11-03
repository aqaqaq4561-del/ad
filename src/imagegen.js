import fs from "node:fs";
import path from "node:path";
import { Type } from "@google/genai";
import { generateImage, generateJSON } from "./gemini.js";

export function buildImagePrompt(brand, scene, layout) {
  return [
    brand.image_style.base,
    `Scene: ${scene.prompt}`,
    `Emotion to convey: ${scene.emotion} — the viewer should feel "I could meet a sincere, good person there".`,
    `Composition: ${layout.composition}`,
    `Avoid: ${brand.image_style.avoid}.`,
  ].join("\n\n");
}

const qaSchema = {
  type: Type.OBJECT,
  properties: {
    people_are_main_subject: { type: Type.BOOLEAN },
    daylight: { type: Type.BOOLEAN },
    sunset_night_or_candles: { type: Type.BOOLEAN },
    plastic_or_airbrushed_skin: { type: Type.BOOLEAN },
    text_logo_or_watermark: { type: Type.BOOLEAN },
    anatomy_or_face_errors: { type: Type.BOOLEAN },
    looks_like_resort_ad: { type: Type.BOOLEAN },
    note: { type: Type.STRING },
  },
  required: ["people_are_main_subject", "daylight", "sunset_night_or_candles", "plastic_or_airbrushed_skin", "text_logo_or_watermark", "anatomy_or_face_errors", "looks_like_resort_ad", "note"],
};

async function qa(image) {
  const r = await generateJSON({
    model: process.env.QA_MODEL || "gemini-2.5-flash",
    temperature: 0,
    images: [image],
    schema: qaSchema,
    prompt: `You are a strict photo editor reviewing an image for a Korean matchmaking ad. Judge honestly.
- people_are_main_subject: people and their interaction dominate the frame (not the building/pool)
- daylight: lit by natural daytime light
- sunset_night_or_candles: any sunset/golden hour/night/candle/string-light mood
- plastic_or_airbrushed_skin: skin looks overly smooth, waxy, AI-generated
- text_logo_or_watermark: any letters, logos or watermarks
- anatomy_or_face_errors: distorted hands, fingers, faces, eyes, extra limbs
- looks_like_resort_ad: feels like a hotel/resort/travel ad rather than people getting to know each other
note: one short sentence in Korean.`,
  });
  const pass = r.people_are_main_subject && r.daylight && !r.sunset_night_or_candles && !r.plastic_or_airbrushed_skin
    && !r.text_logo_or_watermark && !r.anatomy_or_face_errors && !r.looks_like_resort_ad;
  return { pass, ...r };
}

/** 이미지 생성 + 자동 검수. 불합격이면 최대 maxTry 번까지 다시 생성 */
export async function generateWithQA(prompt, aspectRatio, maxTry = 3) {
  let last;
  for (let i = 1; i <= maxTry; i++) {
    const image = await generateImage({ prompt, aspectRatio });
    const report = await qa(image).catch((e) => ({ pass: true, note: `검수 생략(${e.message})` }));
    last = { image, report, tries: i };
    if (report.pass) return last;
    console.log(`    ↻ 검수 불합격(${i}/${maxTry}): ${report.note}`);
  }
  return last; // 끝까지 불합격이면 마지막 것 사용 + 경고
}

export function placeholderImage(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cdb79e"/><stop offset="1" stop-color="#7d8f86"/></linearGradient></defs><rect width="1200" height="1200" fill="url(#g)"/><text x="600" y="600" font-size="48" text-anchor="middle" fill="#fff" font-family="sans-serif">${label}</text></svg>`;
  return { mime: "image/svg+xml", data: Buffer.from(svg).toString("base64") };
}

const EXT = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
export function listScreenshots(brand) {
  const dir = brand.screenshot_dir;
  if (!dir || !fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => EXT[path.extname(f).toLowerCase()]).map((f) => ({
    id: path.parse(f).name,
    label: f,
    load: () => ({ mime: EXT[path.extname(f).toLowerCase()], data: fs.readFileSync(path.join(dir, f)).toString("base64") }),
  }));
}

