import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { renderCreativeVariationHtml } from './src/creative_variations.mjs';

const artDir = 'C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877';
const bgDir = path.resolve('assets/virginroad/backgrounds');

const toBase64 = (fileName) => {
  const p = path.join(bgDir, fileName);
  const ext = path.extname(fileName).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
};

const items = [
  {
    style: 'glass_card_plate',
    file: 'creative_01_glass_card.png',
    bg: 'villa_bg_01.jpg',
    copy: {
      line1: '소개팅 <span class="gold">100번</span> =',
      line2: '풀빌라 <span class="gold">1박 2일</span>',
      pills: ['남녀 6:6', '풀빌라 1박 2일', '전원 사전 심사']
    }
  },
  {
    style: 'magazine_cover',
    file: 'creative_02_magazine_cover.png',
    bg: 'person_bg_05.jpg',
    copy: {
      line1: '만남을 주선하지 않습니다,',
      line2: '<span class="gold">사랑할 시간</span>을 드립니다',
      pills: ['가치관 매칭', '남녀 6:6', '가평 풀빌라']
    }
  },
  {
    style: 'luxury_invitation_frame',
    file: 'creative_03_invitation_frame.png',
    bg: 'villa_bg_06.jpg',
    copy: {
      line1: '사전 심사 통과한',
      line2: '<span class="gold">12명</span>의 풀빌라',
      pills: ['스펙·진정성 심사', '남녀 6:6', '결혼 전제']
    }
  },
  {
    style: 'wax_seal_stamp',
    file: 'creative_04_wax_seal_stamp.png',
    bg: 'villa_bg_03.jpg',
    copy: {
      line1: '<span class="gold">48시간</span> 안에',
      line2: '내 결혼상대 찾기',
      pills: ['남녀 6:6', '전원 사전 심사', '후속 매칭 보장']
    }
  }
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1
  });

  for (const it of items) {
    const html = renderCreativeVariationHtml(it.style, it.copy, toBase64(it.bg));
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    const outPath = path.join(artDir, it.file);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log('✓ Rendered creative variation:', it.file);
  }

  await browser.close();
}

run().catch(console.error);

