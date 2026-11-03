import fs from "node:fs";
import { GoogleGenAI } from "@google/genai";

process.loadEnvFile(".env");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const refVilla = {
  inlineData: {
    mimeType: "image/jpeg",
    data: fs
      .readFileSync(
        "C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877/.user_uploaded/media_1793594101112_bb6ad4de.jpg"
      )
      .toString("base64"),
  },
};

const refCouple = {
  inlineData: {
    mimeType: "image/jpeg",
    data: fs
      .readFileSync("data/virginroad/winners/01_love_time.jpg")
      .toString("base64"),
  },
};

async function generateOne(name, parts, aspectRatio = "3:4") {
  console.log(`Generating ${name} with gemini-3-pro-image (2K)...`);
  const res = await ai.models.generateContent({
    model: "gemini-3-pro-image",
    contents: [{ role: "user", parts }],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio,
        imageSize: "2K",
      },
    },
  });
  const part = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part) throw new Error(`Failed ${name}: ${JSON.stringify(res.promptFeedback || res.text)}`);
  const buf = Buffer.from(part.inlineData.data, "base64");
  const outPath = `assets/virginroad/${name}.png`;
  fs.writeFileSync(outPath, buf);
  console.log(`Saved ${outPath} (${Math.round(buf.length / 1024)} KB)`);
  return outPath;
}

await generateOne("pro_01_couple_terrace", [
  refVilla,
  refCouple,
  {
    text: `Using the architectural luxury color grading, warm wood overhang, and infinity pool atmosphere of the first reference image, and the romantic 20s-30s Korean couple appeal of the second reference image:
Generate a ultra-high-resolution, photorealistic editorial photograph (NO text, NO letters, NO watermark anywhere in the image).
- Subject: A genuinely handsome Korean man (late 20s to early 30s, modern natural Korean dandy hairstyle, wearing a well-fitted dark charcoal knit sweater) and a genuinely beautiful Korean woman (late 20s, natural soft wavy dark hair, wearing an elegant cream silk/knit blouse) sitting close together at a warm teak wood lounge table on a private luxury pool villa terrace at golden dusk.
- Expression & Pose: Waist-up medium shot in the lower 58% of the frame. They are leaning slightly toward each other, making fluttering, warm eye contact with natural, sincere smiles — evoking the exact feeling of falling in love during a 2-day stay. Natural, realistic skin texture (shot on Hasselblad / Leica 50mm f/1.4, subtle film grain, NOT plastic skin).
- Composition for Typography: Like the first reference image, the diagonal dark teak wood roof overhang of the villa and warm twilight sky occupy the upper-middle area (top 18% to 50%) so bright serif text placed there later will read cleanly.`,
  },
]);

await generateOne("pro_02_daylight_villa_couple", [
  refVilla,
  {
    text: `Match the exact camera lens quality, diagonal architectural wood overhang perspective, and luxury pool villa mood of this reference image, but set in warm late-afternoon sunlight with an attractive 20s-30s Korean couple (NO text, NO letters, NO watermark anywhere in the image).
- Subject: In the lower half of the frame, an attractive late-20s/early-30s Korean man (clean ivory/beige linen shirt over tee, modern Korean hair) and a beautiful late-20s Korean woman (soft cream dress/cardigan, natural hair) sit comfortably together on the wide wooden poolside lounge sofa/daybed, turned toward each other with coffee cups, laughing and talking deeply with warm, genuine expressions.
- Background: Through the floor-to-ceiling glass of the modern luxury pool villa and beside the infinity pool, Korean green pine forest hills are softly visible in warm afternoon light.
- Composition for Typography: Just like the reference image, the dark architectural wood overhang ceiling extends diagonally across the upper half of the frame, creating a rich dark-warm backdrop in the upper-middle area (top 18% to 50%) for bright cream-gold typography.`,
  },
]);

