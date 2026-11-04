import fs from 'fs';
import path from 'path';

export function renderCreativeVariationHtml(styleType, copy, bgBase64) {
  const commonFont = `
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

  // 1. 네오 글래스 카드형 (Glass Card Plate)
  if (styleType === 'glass_card_plate') {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  ${commonFont}
  .glass-card {
    position: absolute;
    bottom: 80px;
    left: 60px;
    right: 60px;
    padding: 56px 48px;
    background: rgba(22, 17, 14, 0.65);
    backdrop-filter: blur(28px) saturate(140%);
    -webkit-backdrop-filter: blur(28px) saturate(140%);
    border: 1.5px solid rgba(212, 167, 106, 0.45);
    border-radius: 28px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    color: #F8F5F0;
    text-align: left;
  }
  .card-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 19px;
    letter-spacing: 0.24em;
    color: #D4A76A;
    text-transform: uppercase;
    margin-bottom: 22px;
  }
  .card-tag::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #D4A76A;
    border-radius: 50%;
  }
  .main-copy {
    font-size: 52px;
    font-weight: 500;
    line-height: 1.34;
    letter-spacing: -0.02em;
    color: #FFFFFF;
    margin-bottom: 34px;
  }
  .main-copy .gold {
    color: #D4A76A;
    font-weight: 600;
  }
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 1px solid rgba(212, 167, 106, 0.2);
  }
  .pill-group {
    display: flex;
    gap: 12px;
  }
  .pill {
    padding: 8px 18px;
    border-radius: 9999px;
    font-size: 18px;
    color: rgba(245, 238, 226, 0.9);
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
  .brand-logo {
    font-family: 'Cinzel', serif;
    font-size: 20px;
    letter-spacing: 0.25em;
    color: rgba(212, 167, 106, 0.85);
  }
</style>
</head>
<body>
  <img class="bg" src="${bgBase64}" />
  <div class="glass-card">
    <div class="card-tag">Private Matchmaking Programme</div>
    <div class="main-copy">
      ${copy.line1}<br>
      ${copy.line2}
    </div>
    <div class="card-footer">
      <div class="pill-group">
        ${copy.pills.map(p => `<span class="pill">${p}</span>`).join('')}
      </div>
      <div class="brand-logo">VIRGIN ROAD</div>
    </div>
  </div>
</body>
</html>`;
  }

  // 2. 매거진 에디토리얼 커버형 (Magazine Editorial Cover)
  if (styleType === 'magazine_cover') {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  ${commonFont}
  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(12,10,9,0.85) 0%, rgba(12,10,9,0.2) 30%, rgba(12,10,9,0.8) 100%);
  }
  .header {
    position: absolute;
    top: 60px;
    left: 60px;
    right: 60px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1.5px solid rgba(212, 167, 106, 0.4);
    padding-bottom: 20px;
    color: #FFFFFF;
    z-index: 10;
  }
  .mag-title {
    font-family: 'Cinzel', serif;
    font-size: 44px;
    letter-spacing: 0.25em;
    font-weight: 600;
    color: #F8F5F0;
  }
  .mag-meta {
    text-align: right;
    font-size: 16px;
    letter-spacing: 0.2em;
    color: #D4A76A;
    line-height: 1.5;
  }
  .hero-text-block {
    position: absolute;
    bottom: 120px;
    left: 60px;
    right: 60px;
    z-index: 10;
    text-align: left;
  }
  .cross-accent {
    font-size: 24px;
    color: #D4A76A;
    margin-bottom: 18px;
    font-family: monospace;
  }
  .main-copy {
    font-size: 56px;
    font-weight: 500;
    line-height: 1.32;
    letter-spacing: -0.02em;
    color: #F8F5F0;
    margin-bottom: 30px;
  }
  .main-copy .gold {
    color: #D4A76A;
    font-weight: 600;
  }
  .editorial-spec-row {
    display: flex;
    gap: 28px;
    font-size: 20px;
    color: rgba(235, 228, 218, 0.85);
    letter-spacing: 0.08em;
  }
  .editorial-spec-row span::before {
    content: '/ ';
    color: #D4A76A;
  }
</style>
</head>
<body>
  <img class="bg" src="${bgBase64}" />
  <div class="overlay"></div>
  <div class="header">
    <div class="mag-title">VIRGIN ROAD</div>
    <div class="mag-meta">VOL. 06 / PRIVATE ISSUE<br>AUTUMN & WINTER</div>
  </div>
  <div class="hero-text-block">
    <div class="cross-accent">+ + +</div>
    <div class="main-copy">
      ${copy.line1}<br>
      ${copy.line2}
    </div>
    <div class="editorial-spec-row">
      ${copy.pills.map(p => `<span>${p}</span>`).join('')}
    </div>
  </div>
</body>
</html>`;
  }

  // 3. 럭셔리 프레임 초대장형 (Luxury Invitation Frame)
  if (styleType === 'luxury_invitation_frame') {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  ${commonFont}
  body {
    background: #14110E;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .outer-frame {
    width: 980px;
    height: 1250px;
    position: relative;
    border: 1px solid rgba(212, 167, 106, 0.45);
    padding: 16px;
  }
  .inner-frame {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(212, 167, 106, 0.25);
  }
  .inner-frame .bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .overlay-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(15,12,10,0.15) 0%, rgba(10,8,7,0.75) 100%);
  }
  .content-wrap {
    position: absolute;
    inset: 0;
    padding: 70px 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    color: #F8F5F0;
    z-index: 10;
  }
  .invite-header {
    font-family: 'Cinzel', serif;
    font-size: 24px;
    letter-spacing: 0.35em;
    color: #D4A76A;
  }
  .invite-body {
    margin: auto 0;
  }
  .divider-diamond {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 30px;
    color: #D4A76A;
    font-size: 14px;
  }
  .divider-diamond::before, .divider-diamond::after {
    content: '';
    width: 80px;
    height: 1px;
    background: rgba(212, 167, 106, 0.45);
  }
  .main-copy {
    font-size: 56px;
    font-weight: 500;
    line-height: 1.38;
    color: #FFFFFF;
    text-shadow: 0 4px 18px rgba(0,0,0,0.8);
    margin-bottom: 36px;
  }
  .main-copy .gold {
    color: #D4A76A;
    font-weight: 600;
  }
  .invite-pills {
    display: inline-flex;
    gap: 16px;
  }
  .invite-pill {
    padding: 10px 24px;
    border: 1px solid rgba(212, 167, 106, 0.5);
    background: rgba(20, 16, 13, 0.65);
    backdrop-filter: blur(10px);
    font-size: 19px;
    color: #E6DCce;
    border-radius: 4px;
  }
  .invite-footer {
    font-size: 18px;
    letter-spacing: 0.28em;
    color: rgba(212, 167, 106, 0.7);
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <div class="outer-frame">
    <div class="inner-frame">
      <img class="bg" src="${bgBase64}" />
      <div class="overlay-vignette"></div>
      <div class="content-wrap">
        <div class="invite-header">PRIVATE INVITATION</div>
        <div class="invite-body">
          <div class="divider-diamond">✦ ✦ ✦</div>
          <div class="main-copy">
            ${copy.line1}<br>
            ${copy.line2}
          </div>
          <div class="invite-pills">
            ${copy.pills.map(p => `<div class="invite-pill">${p}</div>`).join('')}
          </div>
        </div>
        <div class="invite-footer">VIRGIN ROAD · EXCLUSIVE MATCHMAKING</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  // 4. 왁스 실 골드 인장 스탬프형 (Wax Seal & Bold Statement)
  if (styleType === 'wax_seal_stamp') {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  ${commonFont}
  .overlay-top {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 600px;
    background: linear-gradient(180deg, rgba(8,6,5,0.92) 0%, rgba(12,9,8,0.7) 40%, rgba(0,0,0,0) 100%);
  }
  /* 골드 왁스 실 인장 스탬프 */
  .wax-seal {
    position: absolute;
    top: 60px;
    right: 60px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #F0CE97 0%, #C99B5E 55%, #8A5F28 100%);
    box-shadow: 0 10px 28px rgba(0,0,0,0.65), inset 0 2px 4px rgba(255,255,255,0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed rgba(255,255,255,0.4);
    z-index: 20;
    transform: rotate(-10deg);
  }
  .seal-text-top {
    font-size: 13px;
    letter-spacing: 0.15em;
    color: #4A2E0F;
    font-weight: 700;
  }
  .seal-number {
    font-family: 'Cinzel', serif;
    font-size: 32px;
    font-weight: 700;
    color: #2F1B05;
    line-height: 1;
    margin: 3px 0;
  }
  .seal-text-bot {
    font-size: 12px;
    letter-spacing: 0.12em;
    color: #4A2E0F;
    font-weight: 600;
  }
  .content-box {
    position: absolute;
    top: 140px;
    left: 60px;
    right: 220px;
    z-index: 10;
    text-align: left;
  }
  .kicker {
    font-size: 20px;
    letter-spacing: 0.24em;
    color: #D4A76A;
    margin-bottom: 20px;
  }
  .main-copy {
    font-size: 58px;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.02em;
    color: #FFFFFF;
    text-shadow: 0 4px 16px rgba(0,0,0,0.85);
    margin-bottom: 30px;
  }
  .main-copy .gold {
    color: #F0CE97;
  }
  .pill-row {
    display: flex;
    gap: 12px;
  }
  .tag {
    padding: 10px 22px;
    background: rgba(30, 24, 20, 0.7);
    border: 1.2px solid rgba(212, 167, 106, 0.5);
    backdrop-filter: blur(12px);
    border-radius: 9999px;
    font-size: 20px;
    color: #F4EBE0;
  }
</style>
</head>
<body>
  <img class="bg" src="${bgBase64}" />
  <div class="overlay-top"></div>
  
  <div class="wax-seal">
    <div class="seal-text-top">VIRGIN ROAD</div>
    <div class="seal-number">심사필</div>
    <div class="seal-text-bot">CVI 120+</div>
  </div>

  <div class="content-box">
    <div class="kicker">결혼 전제 프리미엄 매칭</div>
    <div class="main-copy">
      ${copy.line1}<br>
      ${copy.line2}
    </div>
    <div class="pill-row">
      ${copy.pills.map(p => `<div class="tag">${p}</div>`).join('')}
    </div>
  </div>
</body>
</html>`;
  }
}

