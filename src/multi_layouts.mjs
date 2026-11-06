/**
 * Multi-Layout HTML Template Generator
 * Exact 1:1 recreation of the 3 user-provided references:
 * 
 * 1. dark_glass_top: Upper third center + Deep frosted glassmorphism gold-rimmed pills
 * 2. light_minimal_center: Exact vertical center + Warm taupe serif + Translucent slim outline capsules
 * 3. bottom_left_box: Lower left layout + Upper VIRGIN ROAD logo + Gold-framed box title
 */

export function renderMultiLayoutHtml(layoutType, copy, bgBase64) {
  // 공통 폰트 임포트
  const fontImport = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Noto+Serif+KR:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px;
      height: 1350px;
      position: relative;
      overflow: hidden;
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
  `;

  // ============================================================
  // 타입 1: 다크 글래스모피즘 상단형 (첨부 1번 1:1 일치)
  // ============================================================
  if (layoutType === 'dark_glass_top') {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  ${fontImport}
  body { background: #0a0807; }

  .overlay-top {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 580px;
    background: linear-gradient(
      180deg,
      rgba(8, 6, 5, 0.92) 0%,
      rgba(12, 9, 8, 0.80) 35%,
      rgba(18, 14, 11, 0.45) 70%,
      rgba(0, 0, 0, 0) 100%
    );
    pointer-events: none;
  }

  .text-container {
    position: absolute;
    top: 96px;
    left: 0; right: 0;
    text-align: center;
    color: #FFFFFF;
    z-index: 10;
    padding: 0 40px;
  }

  .sub-title {
    font-size: 21px;
    font-weight: 400;
    letter-spacing: 0.32em;
    color: rgba(240, 233, 222, 0.88);
    margin-bottom: 24px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  }

  .sub-title .pipe {
    display: inline-block;
    margin: 0 16px;
    opacity: 0.4;
  }

  .main-copy {
    font-size: 58px;
    font-weight: 500;
    line-height: 1.34;
    letter-spacing: -0.02em;
    color: #F8F5F0;
    text-shadow: 0 3px 16px rgba(0, 0, 0, 0.85);
    margin-bottom: 34px;
  }

  .main-copy .gold {
    color: #D4A76A;
    font-weight: 600;
    text-shadow: 0 0 22px rgba(212, 167, 106, 0.45);
  }

  .pills-container {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .pill {
    padding: 14px 28px;
    border-radius: 9999px;
    font-size: 21px;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: rgba(248, 243, 235, 0.96);
    background: rgba(35, 27, 21, 0.68);
    border: 1.4px solid rgba(212, 167, 106, 0.52);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 6px 22px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
</style>
</head>
<body>
  <img class="bg" src="${bgBase64}" />
  <div class="overlay-top"></div>
  <div class="text-container">
    <div class="sub-title">${copy.sub.replace(' | ', '<span class="pipe">|</span>')}</div>
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

  // ============================================================
  // 타입 2: 라이트 미니멀 정중앙형 (첨부 2번 1:1 일치)
  // ============================================================
  if (layoutType === 'light_minimal_center') {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  ${fontImport}
  body { background: #F6F3EE; }

  /* 은은한 화이트/베이지 센터 그라데이션 */
  .overlay-center {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 50% 38%,
      rgba(250, 248, 245, 0.72) 0%,
      rgba(245, 240, 234, 0.45) 50%,
      rgba(240, 235, 227, 0.10) 100%
    );
    pointer-events: none;
  }

  .text-container {
    position: absolute;
    top: 140px;
    left: 0; right: 0;
    text-align: center;
    color: #42342B;
    z-index: 10;
    padding: 0 40px;
  }

  .sub-title-1 {
    font-size: 21px;
    font-weight: 400;
    letter-spacing: 0.18em;
    color: #6C5B50;
    margin-bottom: 8px;
  }

  .sub-title-2 {
    font-size: 25px;
    font-weight: 500;
    letter-spacing: 0.22em;
    color: #42342B;
    margin-bottom: 68px;
  }

  .main-copy {
    font-size: 58px;
    font-weight: 500;
    line-height: 1.42;
    letter-spacing: -0.01em;
    color: #382B23;
    margin-bottom: 58px;
  }

  .main-copy .gold {
    color: #9E743A;
    font-weight: 600;
  }

  .pills-container {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .pill {
    padding: 13px 30px;
    border-radius: 9999px;
    font-size: 21px;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: #554439;
    background: rgba(255, 255, 255, 0.55);
    border: 1.2px solid rgba(196, 178, 161, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 4px 14px rgba(66, 52, 43, 0.08);
  }
</style>
</head>
<body>
  <img class="bg" src="${bgBase64}" />
  <div class="overlay-center"></div>
  <div class="text-container">
    <div class="sub-title-1">상담부터 시작하는 프리미엄 결혼 매칭</div>
    <div class="sub-title-2">버진로드</div>
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

  // ============================================================
  // 타입 3: 하단 좌측 골드박스형 (첨부 3번 1:1 일치)
  // ============================================================
  if (layoutType === 'bottom_left_box') {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  ${fontImport}
  body { background: #0c0a09; }

  /* 상단 영문 로고 */
  .top-logo {
    position: absolute;
    top: 72px;
    left: 72px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 500;
    letter-spacing: 0.35em;
    color: #FFFFFF;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
    z-index: 10;
  }

  /* 하단 어두운 그라데이션 */
  .overlay-bottom {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 640px;
    background: linear-gradient(
      0deg,
      rgba(10, 8, 7, 0.95) 0%,
      rgba(12, 10, 8, 0.82) 40%,
      rgba(18, 14, 11, 0.35) 75%,
      rgba(0, 0, 0, 0) 100%
    );
    pointer-events: none;
  }

  .text-container {
    position: absolute;
    bottom: 96px;
    left: 72px;
    right: 72px;
    text-align: left;
    color: #FFFFFF;
    z-index: 10;
  }

  /* 골드 테두리 타이틀 박스 */
  .gold-box-badge {
    display: inline-block;
    padding: 12px 28px;
    border: 1.3px solid #C5A065;
    background: rgba(45, 34, 25, 0.55);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    font-size: 24px;
    font-weight: 400;
    letter-spacing: 0.12em;
    color: #EAD6BC;
    margin-bottom: 28px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }

  .main-copy {
    font-size: 54px;
    font-weight: 500;
    line-height: 1.36;
    letter-spacing: -0.02em;
    color: #F8F5F0;
    text-shadow: 0 3px 16px rgba(0, 0, 0, 0.85);
    margin-bottom: 30px;
  }

  .main-copy .gold {
    color: #D4A76A;
    font-weight: 600;
  }

  .bottom-sub {
    font-size: 21px;
    font-weight: 400;
    letter-spacing: 0.16em;
    color: rgba(225, 216, 204, 0.72);
  }
</style>
</head>
<body>
  <img class="bg" src="${bgBase64}" />
  <div class="top-logo">VIRGIN ROAD</div>
  <div class="overlay-bottom"></div>
  <div class="text-container">
    <div class="gold-box-badge">${copy.pills[0] || '프리미엄 숙박형 매칭'}</div>
    <div class="main-copy">
      ${copy.line1}<br>
      ${copy.line2}
    </div>
    <div class="bottom-sub">프리미엄 결혼 매칭, 버진로드</div>
  </div>
</body>
</html>`;
  }
}

