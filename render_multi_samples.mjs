import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { renderMultiLayoutHtml } from './src/multi_layouts.mjs';

const artDir = 'C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877';
const bgDir = path.resolve('assets/virginroad/backgrounds');

const toBase64 = (fileName) => {
  const p = path.join(bgDir, fileName);
  const ext = path.extname(fileName).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
};

// 3개 스타일별 샘플 구성
const sampleConfigs = [
  {
    layout: 'dark_glass_top',
    name: 'sample_style_01_dark_glass_top.png',
    bg: 'villa_bg_01.jpg', // 석양 인피니티 풀
    copy: {
      sub: '결혼 전제 프리미엄 매칭 | 버진로드',
      line1: '풀빌라에서 <span class="gold">남녀 6:6</span>',
      line2: '<span class="gold">1박 2일</span> 결혼 매칭',
      pills: ['참가자 사전 심사', '결혼 전제 매칭', '후속 매칭 보장']
    }
  },
  {
    layout: 'light_minimal_center',
    name: 'sample_style_02_light_minimal_center.png',
    bg: 'villa_bg_08.jpg', // 안개 숲 아침 햇살 테라스
    copy: {
      sub: '상담부터 시작하는 프리미엄 결혼 매칭 | 버진로드',
      line1: '결혼할 사람,',
      line2: '오래 보고 <span class="gold">결정하세요</span>',
      pills: ['1박 2일', '심사제도 운영', '후속매칭 보장']
    }
  },
  {
    layout: 'bottom_left_box',
    name: 'sample_style_03_bottom_left_box.png',
    bg: 'person_bg_05.jpg', // 풀사이드 와인 토크 투샷
    copy: {
      sub: '프리미엄 결혼 매칭, 버진로드',
      line1: '만남을 주선하지 않습니다,',
      line2: '<span class="gold">사랑할 시간</span>을 드립니다',
      pills: ['프리미엄 숙박형 매칭', '남녀 6:6', '가평 풀빌라']
    }
  }
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1
  });

  for (const item of sampleConfigs) {
    const html = renderMultiLayoutHtml(item.layout, item.copy, toBase64(item.bg));
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    const outPath = path.join(artDir, item.name);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log('✓ Rendered sample:', item.name);
  }

  await browser.close();
}

run().catch(console.error);

