import { chromium } from "playwright";

const norm = (s) => s.replace(/\s+/g, "");

export async function openRenderer() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  async function render({ html, W, H, out, expect }) {
    await page.setViewportSize({ width: W, height: H });
    await page.setContent(html, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
    await page.evaluate(() => document.fonts.ready);
    const fit = await page.evaluate(() => window.__fit());

    // 렌더된 글자가 선택한 문구와 정확히 같은지 확인
    const got = await page.evaluate(() => ({
      headline: document.querySelector('[data-copy="headline"]')?.innerText || "",
      sub: document.querySelector('[data-copy="sub"]')?.innerText || "",
      badges: [...document.querySelectorAll('[data-copy="badge"]')].map((e) => e.innerText),
    }));
    const problems = [];
    if (norm(got.headline) !== norm(expect.headline)) problems.push(`헤드라인 불일치: "${got.headline}"`);
    if (norm(got.sub) !== norm(expect.sub || "")) problems.push(`서브카피 불일치: "${got.sub}"`);
    for (const b of got.badges) if (!expect.badges.includes(b.trim())) problems.push(`뱃지 불일치: "${b}"`);
    if (fit.some((f) => f.overflow)) problems.push("문구가 길어서 최소 글자 크기로도 영역을 넘침 → 더 짧은 문구 또는 다른 레이아웃 권장");

    await page.screenshot({ path: out, type: "png" });
    return { fontSize: fit[0]?.size, problems };
  }

  return { render, close: () => browser.close() };
}

