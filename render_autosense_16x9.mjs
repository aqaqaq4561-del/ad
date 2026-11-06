import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const artDir = 'C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877';
const bgDir = path.resolve('assets/autosense/backgrounds');

const toBase64 = (fileName) => {
  const p = path.join(bgDir, fileName);
  const ext = path.extname(fileName).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
};

// 16:9 가로형 (1920x1080) 스레드 맞춤형 3가지 레이아웃
function renderAutosenseHtml(type, copy, bgBase64) {
  const commonFont = `
    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      position: relative;
      overflow: hidden;
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
      background: #0F1117;
      color: #FFFFFF;
      -webkit-font-smoothing: antialiased;
    }
    .bg {
      position: absolute;
      inset: 0;
      width: 1920px;
      height: 1080px;
      object-fit: cover;
      object-position: center center;
    }
  `;

  // 타입 1: 상단 볼드 치트키 자막바 (스레드 무음 자동재생 1초 컷)
  if (type === 'top_hook_bar') {
    return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
      ${commonFont}
      .overlay-top {
        position: absolute; top: 0; left: 0; right: 0; height: 380px;
        background: linear-gradient(180deg, rgba(10, 12, 18, 0.96) 0%, rgba(10, 12, 18, 0.85) 60%, rgba(10, 12, 18, 0) 100%);
        pointer-events: none;
      }
      .header-bar {
        position: absolute; top: 48px; left: 80px; right: 80px;
        display: flex; justify-content: space-between; align-items: center;
        z-index: 10;
      }
      .brand-badge {
        display: inline-flex; align-items: center; gap: 10px;
        background: rgba(37, 99, 235, 0.2); border: 1.2px solid rgba(59, 130, 246, 0.6);
        padding: 8px 18px; border-radius: 9999px; font-size: 19px; font-weight: 700;
        color: #60A5FA; letter-spacing: 0.05em;
      }
      .brand-badge::before {
        content: ''; width: 8px; height: 8px; background: #3B82F6; border-radius: 50%;
        box-shadow: 0 0 10px #3B82F6;
      }
      .pill-group { display: flex; gap: 12px; }
      .pill {
        background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2); padding: 7px 16px;
        border-radius: 9999px; font-size: 17px; font-weight: 500; color: #E2E8F0;
      }
      .hook-title-box {
        position: absolute; top: 110px; left: 80px; right: 80px;
        text-align: left; z-index: 10;
      }
      .main-copy {
        font-size: 54px; font-weight: 800; line-height: 1.25; letter-spacing: -0.03em;
        color: #FFFFFF; text-shadow: 0 4px 20px rgba(0,0,0,0.8);
      }
      .main-copy .blue {
        color: #38BDF8; text-shadow: 0 0 30px rgba(56, 189, 248, 0.5);
      }
      .main-copy .yellow {
        color: #FACC15;
      }
      .sub-desc {
        margin-top: 14px; font-size: 22px; font-weight: 500; color: #94A3B8;
        letter-spacing: -0.01em;
      }
    </style></head><body>
      <img class="bg" src="${bgBase64}" />
      <div class="overlay-top"></div>
      <div class="header-bar">
        <div class="brand-badge">AutoSense AI</div>
        <div class="pill-group">
          ${copy.pills.map(p => `<span class="pill">${p}</span>`).join('')}
        </div>
      </div>
      <div class="hook-title-box">
        <div class="main-copy">${copy.headline}</div>
        <div class="sub-desc">${copy.sub}</div>
      </div>
    </body></html>`;
  }

  // 타입 2: 좌측 스플릿 스펙 & 다크 글래스 카드 (SaaS 프로덕트 데모형)
  if (type === 'split_left_card') {
    return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
      ${commonFont}
      .overlay-left {
        position: absolute; top: 0; bottom: 0; left: 0; width: 920px;
        background: linear-gradient(90deg, rgba(11, 14, 23, 0.98) 0%, rgba(11, 14, 23, 0.90) 70%, rgba(11, 14, 23, 0) 100%);
        pointer-events: none;
      }
      .left-content {
        position: absolute; top: 120px; left: 80px; width: 760px;
        z-index: 10; text-align: left;
      }
      .kicker {
        display: inline-flex; align-items: center; gap: 8px;
        background: rgba(168, 85, 247, 0.15); border: 1.2px solid rgba(168, 85, 247, 0.5);
        color: #C084FC; padding: 6px 16px; border-radius: 8px; font-size: 18px;
        font-weight: 700; margin-bottom: 24px;
      }
      .main-copy {
        font-size: 58px; font-weight: 900; line-height: 1.22; letter-spacing: -0.03em;
        color: #FFFFFF; margin-bottom: 28px;
      }
      .main-copy .blue { color: #38BDF8; }
      .main-copy .yellow { color: #FACC15; }
      .sub-desc {
        font-size: 23px; font-weight: 500; line-height: 1.5; color: #94A3B8;
        margin-bottom: 38px;
      }
      .feature-box {
        background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px;
        padding: 22px 28px; display: flex; flex-direction: column; gap: 12px;
      }
      .feature-item {
        display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 600; color: #E2E8F0;
      }
      .check-icon {
        width: 24px; height: 24px; background: #3B82F6; border-radius: 50%;
        display: flex; align-items: center; justify-content: center; font-size: 14px; color: white;
      }
    </style></head><body>
      <img class="bg" src="${bgBase64}" />
      <div class="overlay-left"></div>
      <div class="left-content">
        <div class="kicker">⚡ 블로그 & SNS 1타 4피 자동화</div>
        <div class="main-copy">${copy.headline}</div>
        <div class="sub-desc">${copy.sub}</div>
        <div class="feature-box">
          ${copy.pills.map(p => `
            <div class="feature-item">
              <div class="check-icon">✓</div>
              <div>${p}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </body></html>`;
  }

  // 타입 3: 하단 와이드 티커 & 네온 글래스모피즘
  if (type === 'bottom_neon_plate') {
    return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
      ${commonFont}
      .bottom-card {
        position: absolute; bottom: 44px; left: 60px; right: 60px;
        padding: 38px 48px;
        background: rgba(15, 23, 42, 0.82);
        backdrop-filter: blur(28px) saturate(160%);
        -webkit-backdrop-filter: blur(28px) saturate(160%);
        border: 1.5px solid rgba(56, 189, 248, 0.35);
        border-radius: 24px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.15);
        display: flex; justify-content: space-between; align-items: center;
        z-index: 10;
      }
      .text-area { text-align: left; }
      .tag-row {
        display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
      }
      .tag {
        font-size: 17px; font-weight: 700; color: #38BDF8; letter-spacing: 0.08em;
      }
      .main-copy {
        font-size: 46px; font-weight: 800; line-height: 1.25; letter-spacing: -0.02em;
        color: #FFFFFF;
      }
      .main-copy .blue { color: #38BDF8; }
      .main-copy .yellow { color: #FACC15; }
      .cta-area {
        display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
      }
      .badge-row { display: flex; gap: 10px; }
      .sub-badge {
        background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.18);
        padding: 8px 16px; border-radius: 8px; font-size: 16px; font-weight: 600; color: #E2E8F0;
      }
      .brand-title {
        font-size: 22px; font-weight: 900; letter-spacing: 0.12em; color: #94A3B8;
      }
    </style></head><body>
      <img class="bg" src="${bgBase64}" />
      <div class="bottom-card">
        <div class="text-area">
          <div class="tag-row">
            <span class="tag">AUTOSENSE CONTENT AUTOMATION</span>
          </div>
          <div class="main-copy">${copy.headline}</div>
        </div>
        <div class="cta-area">
          <div class="brand-title">AUTOSENSE.AI</div>
          <div class="badge-row">
            ${copy.pills.map(p => `<div class="sub-badge">${p}</div>`).join('')}
          </div>
        </div>
      </div>
    </body></html>`;
  }
}

// 3가지 샘플 데이터
const samples = [
  {
    type: 'top_hook_bar',
    name: 'sample_autosense_01_top_bar.png',
    bg: 'autosense_multi_phones.jpg', // 5개 폰 화면 펼쳐지는 뷰
    copy: {
      headline: '블로그 글 <span class="yellow">1개 2시간</span> 쓰던 분들 주목,<br>오토센스는 <span class="blue">30초</span>면 4개 채널 동시 발행됩니다.',
      sub: '주제 1개 입력으로 네이버 블로그 + 인스타 카드뉴스 6장 뚝딱 완성',
      pills: ['네이버 블로그', '인스타그램', '스레드', '워드프레스']
    }
  },
  {
    type: 'split_left_card',
    name: 'sample_autosense_02_split_left.png',
    bg: 'autosense_chat_ui.jpg', // 대화형 UI
    copy: {
      headline: '주제 <span class="blue">1줄</span> 쳤더니,<br>플랫폼 <span class="yellow">4개</span> 자동 완성',
      sub: '퇴근 후 2시간씩 글 쓰지 마세요. A/B안 비교부터 SEO 최적화까지 알아서 다 해줍니다.',
      pills: ['A안/B안 구성 비교 추출', '네이버·인스타·스레드 일괄 변환', '클릭 한 번으로 발행 준비 끝']
    }
  },
  {
    type: 'bottom_neon_plate',
    name: 'sample_autosense_03_bottom_neon.png',
    bg: 'autosense_web_home.png', // 웹 홈 UI
    copy: {
      headline: '글쓰기 지옥 끝, <span class="blue">30초 자동화</span>로<br><span class="yellow">월 100만원</span> 부업 파이프라인 만들기',
      sub: '지치지 않고 매일 발행하는 사람들의 치트키',
      pills: ['SEO 자동 최적화', '다채널 동시 발행', '제휴마케팅 링크 연동']
    }
  }
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  for (const item of samples) {
    const html = renderAutosenseHtml(item.type, item.copy, toBase64(item.bg));
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    const outPath = path.join(artDir, item.name);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log('✓ Rendered 16:9 Autosense sample:', item.name);
  }

  await browser.close();
}

run().catch(console.error);
