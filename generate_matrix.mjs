import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

// CLI 인자 파싱
const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue;
}

const brand = getArg('--brand', 'virginroad');
const copyLimit = parseInt(getArg('--copy-limit', '30'), 10);

console.log('='.repeat(65));
console.log(`🚀 [${brand.toUpperCase()}] 황금비율 6종 멀티 레이아웃 대량 렌더러 (총 180장)`);
console.log(`- 카피 수: 최대 ${copyLimit}개`);
console.log(`- 카피 1개당 6종 베리에이션:`);
console.log(`  1. 검증 상단형 (풀빌라 건축)`);
console.log(`  2. 검증 상단형 (인물 화보)`);
console.log(`  3. 네오 글래스 카드형 (하단 플로팅)`);
console.log(`  4. 매거진 에디토리얼 커버형`);
console.log(`  5. 럭셔리 프라이빗 초대장 프레임형`);
console.log(`  6. 라이트 미니멀 센터 / 하단 골드박스형`);
console.log('='.repeat(65));

// 1. 카피 뱅크 로드
const copyBankPath = path.resolve(`data/${brand}/copy_bank.json`);
const copyBankData = JSON.parse(fs.readFileSync(copyBankPath, 'utf-8'));
const copies = copyBankData.copies.slice(0, copyLimit);

// 2. 배경 이미지 분리 로드
const bgDir = path.resolve(`assets/${brand}/backgrounds`);
const allBgFiles = fs.readdirSync(bgDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
const personBgs = allBgFiles.filter(f => f.startsWith('person_bg_'));
const villaBgs = allBgFiles.filter(f => f.startsWith('villa_bg_'));

const fontCss = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Noto+Serif+KR:wght@300;400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1080px;
    height: 1350px;
    position: relative;
    overflow: hidden;
    font-family: 'Noto Serif KR', serif;
    -webkit-font-smoothing: antialiased;
    background: #0B0908;
  }
  .bg {
    position: absolute;
    inset: 0;
    width: 1080px;
    height: 1350px;
    object-fit: cover;
    object-position: center center;
  }
`;

// 6가지 멀티 레이아웃 템플릿 엔진
function renderLayout(type, copy, bgBase64) {
  // 1 & 2: 검증 상단형 (다크 글래스모피즘 상단 텍스트 + 골드 림 캡슐)
  if (type === 'verified_top') {
    return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
      ${fontCss}
      .overlay-top {
        position: absolute; top: 0; left: 0; right: 0; height: 560px;
        background: linear-gradient(180deg, rgba(8,6,5,0.92) 0%, rgba(12,9,8,0.78) 35%, rgba(18,14,11,0.42) 70%, rgba(0,0,0,0) 100%);
        pointer-events: none;
      }
      .text-container {
        position: absolute; top: 96px; left: 0; right: 0;
        text-align: center; color: #FFFFFF; z-index: 10; padding: 0 40px;
      }
      .sub-title {
        font-size: 21px; font-weight: 400; letter-spacing: 0.3em;
        color: rgba(240, 233, 222, 0.88); margin-bottom: 24px;
        text-shadow: 0 2px 8px rgba(0,0,0,0.7);
      }
      .sub-title .pipe { display: inline-block; margin: 0 16px; opacity: 0.45; }
      .main-copy {
        font-size: 58px; font-weight: 500; line-height: 1.34; letter-spacing: -0.02em;
        color: #F8F5F0; text-shadow: 0 3px 16px rgba(0,0,0,0.85); margin-bottom: 34px;
      }
      .main-copy .gold {
        color: #D4A76A; font-weight: 600; text-shadow: 0 0 22px rgba(212,167,106,0.4);
      }
      .pills-container { display: flex; justify-content: center; gap: 16px; }
      .pill {
        padding: 14px 28px; border-radius: 9999px; font-size: 21px; font-weight: 400;
        letter-spacing: 0.02em; color: rgba(248,243,235,0.96);
        background: rgba(35,27,21,0.68); border: 1.4px solid rgba(212,167,106,0.52);
        backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
        box-shadow: 0 6px 22px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.15);
      }
    </style></head><body>
      <img class="bg" src="${bgBase64}" />
      <div class="overlay-top"></div>
      <div class="text-container">
        <div class="sub-title">${copy.sub.replace(' | ', '<span class="pipe">|</span>')}</div>
        <div class="main-copy">${copy.line1}<br>${copy.line2}</div>
        <div class="pills-container">
          ${copy.pills.map(p => `<div class="pill">${p}</div>`).join('')}
        </div>
      </div>
    </body></html>`;
  }

  // 3: 네오 글래스 카드형 (하단 플로팅)
  if (type === 'glass_card') {
    return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
      ${fontCss}
      .glass-card {
        position: absolute; bottom: 80px; left: 60px; right: 60px; padding: 56px 48px;
        background: rgba(22, 17, 14, 0.65); backdrop-filter: blur(28px) saturate(140%);
        -webkit-backdrop-filter: blur(28px) saturate(140%);
        border: 1.5px solid rgba(212, 167, 106, 0.45); border-radius: 28px;
        box-shadow: 0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.15);
        color: #F8F5F0; text-align: left;
      }
      .card-tag {
        display: inline-flex; align-items: center; gap: 8px; font-size: 19px;
        letter-spacing: 0.24em; color: #D4A76A; margin-bottom: 22px;
      }
      .card-tag::before {
        content: ''; display: inline-block; width: 8px; height: 8px;
        background: #D4A76A; border-radius: 50%;
      }
      .main-copy {
        font-size: 52px; font-weight: 500; line-height: 1.34; letter-spacing: -0.02em;
        color: #FFFFFF; margin-bottom: 34px;
      }
      .main-copy .gold { color: #D4A76A; font-weight: 600; }
      .card-footer {
        display: flex; justify-content: space-between; align-items: center;
        padding-top: 24px; border-top: 1px solid rgba(212,167,106,0.2);
      }
      .pill-group { display: flex; gap: 12px; }
      .pill {
        padding: 8px 18px; border-radius: 9999px; font-size: 18px;
        color: rgba(245,238,226,0.9); background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
      }
      .brand-logo { font-family: 'Cinzel', serif; font-size: 20px; letter-spacing: 0.25em; color: rgba(212,167,106,0.85); }
    </style></head><body>
      <img class="bg" src="${bgBase64}" />
      <div class="glass-card">
        <div class="card-tag">Private Matchmaking Programme</div>
        <div class="main-copy">${copy.line1}<br>${copy.line2}</div>
        <div class="card-footer">
          <div class="pill-group">${copy.pills.map(p => `<span class="pill">${p}</span>`).join('')}</div>
          <div class="brand-logo">VIRGIN ROAD</div>
        </div>
      </div>
    </body></html>`;
  }

  // 4: 매거진 에디토리얼 커버형
  if (type === 'magazine_cover') {
    return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
      ${fontCss}
      .overlay {
        position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(12,10,9,0.85) 0%, rgba(12,10,9,0.2) 30%, rgba(12,10,9,0.8) 100%);
      }
      .header {
        position: absolute; top: 60px; left: 60px; right: 60px;
        display: flex; justify-content: space-between; align-items: flex-start;
        border-bottom: 1.5px solid rgba(212,167,106,0.4); padding-bottom: 20px;
        color: #FFFFFF; z-index: 10;
      }
      .mag-title { font-family: 'Cinzel', serif; font-size: 44px; letter-spacing: 0.25em; font-weight: 600; color: #F8F5F0; }
      .mag-meta { text-align: right; font-size: 16px; letter-spacing: 0.2em; color: #D4A76A; line-height: 1.5; }
      .hero-text-block { position: absolute; bottom: 120px; left: 60px; right: 60px; z-index: 10; text-align: left; }
      .cross-accent { font-size: 24px; color: #D4A76A; margin-bottom: 18px; font-family: monospace; }
      .main-copy {
        font-size: 56px; font-weight: 500; line-height: 1.32; letter-spacing: -0.02em;
        color: #F8F5F0; margin-bottom: 30px;
      }
      .main-copy .gold { color: #D4A76A; font-weight: 600; }
      .editorial-spec-row { display: flex; gap: 28px; font-size: 20px; color: rgba(235,228,218,0.85); letter-spacing: 0.08em; }
      .editorial-spec-row span::before { content: '/ '; color: #D4A76A; }
    </style></head><body>
      <img class="bg" src="${bgBase64}" />
      <div class="overlay"></div>
      <div class="header">
        <div class="mag-title">VIRGIN ROAD</div>
        <div class="mag-meta">VOL. 06 / PRIVATE ISSUE<br>AUTUMN & WINTER</div>
      </div>
      <div class="hero-text-block">
        <div class="cross-accent">+ + +</div>
        <div class="main-copy">${copy.line1}<br>${copy.line2}</div>
        <div class="editorial-spec-row">${copy.pills.map(p => `<span>${p}</span>`).join('')}</div>
      </div>
    </body></html>`;
  }

  // 5: 럭셔리 프라이빗 초대장 프레임형
  if (type === 'invitation_frame') {
    return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
      ${fontCss}
      body { background: #14110E; display: flex; align-items: center; justify-content: center; }
      .outer-frame {
        width: 980px; height: 1250px; position: relative;
        border: 1px solid rgba(212,167,106,0.45); padding: 16px;
      }
      .inner-frame { width: 100%; height: 100%; position: relative; overflow: hidden; border: 1px solid rgba(212,167,106,0.25); }
      .inner-frame .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .overlay-vignette { position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(15,12,10,0.15) 0%, rgba(10,8,7,0.75) 100%); }
      .content-wrap {
        position: absolute; inset: 0; padding: 70px 50px;
        display: flex; flex-direction: column; justify-content: space-between; text-align: center; color: #F8F5F0; z-index: 10;
      }
      .invite-header { font-family: 'Cinzel', serif; font-size: 24px; letter-spacing: 0.35em; color: #D4A76A; }
      .invite-body { margin: auto 0; }
      .divider-diamond {
        display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 30px; color: #D4A76A; font-size: 14px;
      }
      .divider-diamond::before, .divider-diamond::after { content: ''; width: 80px; height: 1px; background: rgba(212,167,106,0.45); }
      .main-copy { font-size: 56px; font-weight: 500; line-height: 1.38; color: #FFFFFF; text-shadow: 0 4px 18px rgba(0,0,0,0.8); margin-bottom: 36px; }
      .main-copy .gold { color: #D4A76A; font-weight: 600; }
      .invite-pills { display: inline-flex; gap: 16px; }
      .invite-pill {
        padding: 10px 24px; border: 1px solid rgba(212,167,106,0.5); background: rgba(20,16,13,0.65);
        backdrop-filter: blur(10px); font-size: 19px; color: #E6DCCE; border-radius: 4px;
      }
      .invite-footer { font-size: 18px; letter-spacing: 0.28em; color: rgba(212,167,106,0.7); text-transform: uppercase; }
    </style></head><body>
      <div class="outer-frame">
        <div class="inner-frame">
          <img class="bg" src="${bgBase64}" />
          <div class="overlay-vignette"></div>
          <div class="content-wrap">
            <div class="invite-header">PRIVATE INVITATION</div>
            <div class="invite-body">
              <div class="divider-diamond">✦ ✦ ✦</div>
              <div class="main-copy">${copy.line1}<br>${copy.line2}</div>
              <div class="invite-pills">${copy.pills.map(p => `<div class="invite-pill">${p}</div>`).join('')}</div>
            </div>
            <div class="invite-footer">VIRGIN ROAD · EXCLUSIVE MATCHMAKING</div>
          </div>
        </div>
      </div>
    </body></html>`;
  }

  // 6: 하단 좌측 골드박스형
  if (type === 'bottom_gold_box') {
    return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
      ${fontCss}
      .top-logo {
        position: absolute; top: 72px; left: 72px; font-family: 'Cormorant Garamond', serif;
        font-size: 32px; font-weight: 500; letter-spacing: 0.35em; color: #FFFFFF; text-shadow: 0 2px 10px rgba(0,0,0,0.7); z-index: 10;
      }
      .overlay-bottom {
        position: absolute; bottom: 0; left: 0; right: 0; height: 640px;
        background: linear-gradient(0deg, rgba(10,8,7,0.95) 0%, rgba(12,10,8,0.82) 40%, rgba(18,14,11,0.35) 75%, rgba(0,0,0,0) 100%);
        pointer-events: none;
      }
      .text-container { position: absolute; bottom: 96px; left: 72px; right: 72px; text-align: left; color: #FFFFFF; z-index: 10; }
      .gold-box-badge {
        display: inline-block; padding: 12px 28px; border: 1.3px solid #C5A065;
        background: rgba(45,34,25,0.55); backdrop-filter: blur(10px); font-size: 24px; font-weight: 400;
        letter-spacing: 0.12em; color: #EAD6BC; margin-bottom: 28px; box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      }
      .main-copy { font-size: 54px; font-weight: 500; line-height: 1.36; letter-spacing: -0.02em; color: #F8F5F0; margin-bottom: 30px; }
      .main-copy .gold { color: #D4A76A; font-weight: 600; }
      .bottom-sub { font-size: 21px; font-weight: 400; letter-spacing: 0.16em; color: rgba(225,216,204,0.72); }
    </style></head><body>
      <img class="bg" src="${bgBase64}" />
      <div class="top-logo">VIRGIN ROAD</div>
      <div class="overlay-bottom"></div>
      <div class="text-container">
        <div class="gold-box-badge">${copy.pills[0] || '프리미엄 숙박형 매칭'}</div>
        <div class="main-copy">${copy.line1}<br>${copy.line2}</div>
        <div class="bottom-sub">프리미엄 결혼 매칭, 버진로드</div>
      </div>
    </body></html>`;
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1
  });

  const toBase64 = (fileName) => {
    const filePath = path.join(bgDir, fileName);
    const ext = path.extname(fileName).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
  };

  const personBgCache = personBgs.map(f => ({ name: path.parse(f).name, src: toBase64(f) }));
  const villaBgCache = villaBgs.map(f => ({ name: path.parse(f).name, src: toBase64(f) }));

  let totalRendered = 0;

  for (let cIdx = 0; cIdx < copies.length; cIdx++) {
    const copy = copies[cIdx];
    const copyOutDir = path.resolve(`output/${brand}/matrix/${copy.id}`);
    if (!fs.existsSync(copyOutDir)) {
      fs.mkdirSync(copyOutDir, { recursive: true });
    }

    // 6가지 베리에이션 세팅 (스타일 + 배경 조합)
    const variations = [
      {
        style: 'verified_top',
        suffix: '01_verified_top_villa',
        bg: villaBgCache[cIdx % villaBgCache.length]
      },
      {
        style: 'verified_top',
        suffix: '02_verified_top_person',
        bg: personBgCache[cIdx % personBgCache.length]
      },
      {
        style: 'glass_card',
        suffix: '03_glass_card_plate',
        bg: villaBgCache[(cIdx + 2) % villaBgCache.length]
      },
      {
        style: 'magazine_cover',
        suffix: '04_magazine_cover',
        bg: personBgCache[(cIdx + 2) % personBgCache.length]
      },
      {
        style: 'invitation_frame',
        suffix: '05_invitation_frame',
        bg: villaBgCache[(cIdx + 4) % villaBgCache.length]
      },
      {
        style: 'bottom_gold_box',
        suffix: '06_bottom_gold_box',
        bg: personBgCache[(cIdx + 4) % personBgCache.length]
      }
    ];

    console.log(`\n▶ [${cIdx + 1}/${copies.length}] ${copy.id}: "${copy.line1.replace(/<[^>]+>/g, '')} ${copy.line2.replace(/<[^>]+>/g, '')}"`);

    for (const v of variations) {
      const html = renderLayout(v.style, copy, v.bg.src);
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.evaluateHandle('document.fonts.ready');

      const outFileName = `${copy.id}_${v.suffix}.png`;
      const outFilePath = path.join(copyOutDir, outFileName);

      await page.screenshot({ path: outFilePath, type: 'png' });
      totalRendered++;
      console.log(`   ✓ ${outFileName} (${v.style})`);
    }
  }

  await browser.close();
  console.log('\n' + '='.repeat(65));
  console.log(`🎉 180장 황금비율 멀티 레이아웃 렌더링 완료! 총 ${totalRendered}개 파일 저장.`);
  console.log(`📂 위치: output/${brand}/matrix/ (VR_01 ~ VR_30 각 6장씩)`);
  console.log('='.repeat(65));
}

run().catch(err => {
  console.error('실행 중 에러 발생:', err);
  process.exit(1);
});
