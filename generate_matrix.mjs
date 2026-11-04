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
const copyLimit = parseInt(getArg('--copy-limit', '30'), 10); // 기본 30개 전체
const bgLimit = parseInt(getArg('--bg-limit', '5'), 10);       // 배경 몇 장 쓸지

console.log('='.repeat(65));
console.log(`🚀 [${brand.toUpperCase()}] 매트릭스 광고 소재 대량 렌더러 시작`);
console.log(`- 카피 수: 최대 ${copyLimit}개`);
console.log(`- 카피당 배경 수: 최대 ${bgLimit}개`);
console.log('='.repeat(65));

// 1. 카피 뱅크 로드
const copyBankPath = path.resolve(`data/${brand}/copy_bank.json`);
if (!fs.existsSync(copyBankPath)) {
  console.error(`❌ 카피 뱅크 파일이 없습니다: ${copyBankPath}`);
  process.exit(1);
}
const copyBankData = JSON.parse(fs.readFileSync(copyBankPath, 'utf-8'));
const copies = copyBankData.copies.slice(0, copyLimit);

// 2. 배경 이미지 로드
const bgDir = path.resolve(`assets/${brand}/backgrounds`);
if (!fs.existsSync(bgDir)) {
  console.error(`❌ 배경 디렉터리가 없습니다: ${bgDir}`);
  process.exit(1);
}
const bgFiles = fs.readdirSync(bgDir)
  .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
  .slice(0, bgLimit);

if (bgFiles.length === 0) {
  console.error(`❌ 배경 이미지가 없습니다: ${bgDir}`);
  process.exit(1);
}

console.log(`\n총 카피: ${copies.length}개 | 배경 풀: ${bgFiles.length}장`);
console.log(`예상 총 생성물: ${copies.length * bgFiles.length}장\n`);

// HTML 템플릿 생성기 (버진로드 럭셔리 풀빌라 전용)
function renderHtml(copy, bgBase64) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Noto+Serif+KR:wght@300;400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1080px;
    height: 1350px;
    position: relative;
    overflow: hidden;
    background: #0d0d0f;
    font-family: 'Noto Serif KR', serif;
    -webkit-font-smoothing: antialiased;
  }

  .bg {
    position: absolute;
    inset: 0;
    width: 1080px;
    height: 1350px;
    object-fit: cover;
    object-position: center center;
  }

  .overlay-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 520px;
    background: linear-gradient(
      180deg,
      rgba(10, 8, 7, 0.88) 0%,
      rgba(15, 12, 10, 0.72) 35%,
      rgba(20, 16, 13, 0.40) 70%,
      rgba(0, 0, 0, 0) 100%
    );
    pointer-events: none;
  }

  .text-container {
    position: absolute;
    top: 92px;
    left: 0;
    right: 0;
    text-align: center;
    color: #FFFFFF;
    z-index: 10;
    padding: 0 40px;
  }

  .sub-title {
    font-size: 21px;
    font-weight: 400;
    letter-spacing: 0.28em;
    color: rgba(235, 228, 218, 0.82);
    text-transform: uppercase;
    margin-bottom: 24px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  }

  .sub-title .pipe {
    display: inline-block;
    margin: 0 14px;
    opacity: 0.45;
  }

  .main-copy {
    font-size: 58px;
    font-weight: 500;
    line-height: 1.34;
    letter-spacing: -0.02em;
    color: #F8F5F0;
    text-shadow: 0 3px 14px rgba(0, 0, 0, 0.75);
    margin-bottom: 30px;
  }

  .main-copy .gold {
    color: #D3A569;
    font-weight: 600;
    text-shadow: 0 0 20px rgba(211, 165, 105, 0.35);
  }

  .pills-container {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .pill {
    padding: 13px 26px;
    border-radius: 9999px;
    font-size: 21px;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: rgba(245, 238, 226, 0.95);
    background: rgba(38, 30, 23, 0.62);
    border: 1.3px solid rgba(211, 165, 105, 0.45);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.42);
  }
</style>
</head>
<body>
  <img class="bg" src="${bgBase64}" />
  <div class="overlay-top"></div>

  <div class="text-container">
    <div class="sub-title">
      ${copy.sub.replace(' | ', '<span class="pipe">|</span>')}
    </div>
    <div class="main-copy">
      ${copy.line1}<br>
      ${copy.line2}
    </div>
    <div class="pills-container">
      ${copy.pills.map(p => `<div class="pill">${p}</div>`).join('')}
    </div>
  </div>
</body>
</html>`;
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
  });

  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1
  });

  // 배경 이미지들을 Base64로 미리 캐싱
  const bgCache = bgFiles.map(file => {
    const filePath = path.join(bgDir, file);
    const ext = path.extname(file).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    const b64 = fs.readFileSync(filePath).toString('base64');
    return {
      name: path.parse(file).name,
      src: `data:${mime};base64,${b64}`
    };
  });

  let totalRendered = 0;

  for (const copy of copies) {
    const copyOutDir = path.resolve(`output/${brand}/matrix/${copy.id}`);
    if (!fs.existsSync(copyOutDir)) {
      fs.mkdirSync(copyOutDir, { recursive: true });
    }

    console.log(`\n▶ [${copy.id}] 처리 중: "${copy.line1.replace(/<[^>]+>/g, '')} ${copy.line2.replace(/<[^>]+>/g, '')}"`);

    for (let i = 0; i < bgCache.length; i++) {
      const bg = bgCache[i];
      const html = renderHtml(copy, bg.src);
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.evaluateHandle('document.fonts.ready');

      const outFileName = `${copy.id}_${bg.name}.png`;
      const outFilePath = path.join(copyOutDir, outFileName);

      await page.screenshot({ path: outFilePath, type: 'png' });
      totalRendered++;
      console.log(`   ✓ [${i + 1}/${bgCache.length}] ${outFileName}`);
    }
  }

  await browser.close();
  console.log('\n' + '='.repeat(65));
  console.log(`🎉 대량 렌더링 완료! 총 ${totalRendered}개 소재가 생성되었습니다.`);
  console.log(`📂 결과 저장 위치: output/${brand}/matrix/`);
  console.log('='.repeat(65));
}

run().catch(err => {
  console.error('실행 중 에러 발생:', err);
  process.exit(1);
});
