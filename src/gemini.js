import { GoogleGenAI } from "@google/genai";

let client;
function ai() {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("여기에")) {
    throw new Error("GEMINI_API_KEY가 없습니다. .env.example 을 .env 로 복사하고 키를 넣어 주세요.");
  }
  return (client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }));
}

const toParts = (text, images = []) => [
  { text },
  ...images.map((im) => ({ inlineData: { mimeType: im.mime, data: im.data } })),
];

/** 텍스트(+이미지) → JSON 응답 */
export async function generateJSON({ prompt, schema, images = [], model, temperature = 1 }) {
  const res = await ai().models.generateContent({
    model: model || process.env.TEXT_MODEL || "gemini-2.5-pro",
    contents: [{ role: "user", parts: toParts(prompt, images) }],
    config: { responseMimeType: "application/json", responseSchema: schema, temperature },
  });
  return JSON.parse(res.text);
}

/** 프롬프트 → 이미지 1장 ({mime, data(base64)}) */
export async function generateImage({ prompt, aspectRatio = "4:5", refImages = [] }) {
  const res = await ai().models.generateContent({
    model: process.env.IMAGE_MODEL || "gemini-2.5-flash-image",
    contents: [{ role: "user", parts: toParts(prompt, refImages) }],
    config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio } },
  });
  const part = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part) throw new Error("이미지 생성 실패: " + (res.text || JSON.stringify(res.promptFeedback || {})));
  return { mime: part.inlineData.mimeType || "image/png", data: part.inlineData.data };
}

