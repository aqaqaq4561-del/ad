import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { chromium } from 'playwright';

const uploadDir = 'C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877/.user_uploaded/';
const artDir = 'C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877/';
const scratchDir = path.join(artDir, 'scratch/factory_render');
const outDir = path.resolve('output/autosense/factory');
const quickDir = path.resolve('오토센스_공장처럼찍어줌_소재모음');

[scratchDir, outDir, quickDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

const v1Path = path.join(uploadDir, 'media_1793941362486_e40066dd.mp4'); // 3.87s jumpcut loop
const v2Path = path.join(uploadDir, 'media_1793941362959_bab1d4c1.mp4'); // 15.77s editorial

// Helper to convert image file to base64 data URI
function toBase64(filePath) {
  const mime = filePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

// Helper to generate high-quality GIF from MP4 using ffmpeg palettegen
function mp4ToGif(mp4Path, gifPath, fps = 15, width = 960) {
  const palettePath = mp4Path.replace('.mp4', '_palette.png');
  execSync(`ffmpeg -y -i "${mp4Path}" -vf "fps=${fps},scale=${width}:-1:flags=lanczos,palettegen=stats_mode=diff" "${palettePath}"`, { stdio: 'ignore' });
  execSync(`ffmpeg -y -i "${mp4Path}" -i "${palettePath}" -lavfi "fps=${fps},scale=${width}:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" "${gifPath}"`, { stdio: 'ignore' });
  if (fs.existsSync(palettePath)) fs.unlinkSync(palettePath);
}

async function run() {
  console.log('1. Extracting 30fps frames from v1 and key frames from v2...');
  const v1FramesDir = path.join(scratchDir, 'v1_30fps');
  fs.mkdirSync(v1FramesDir, { recursive: true });
  execSync(`ffmpeg -y -i "${v1Path}" -vf "fps=30" "${v1FramesDir}/f_%03d.jpg"`, { stdio: 'ignore' });

  const v1FrameFiles = fs.readdirSync(v1FramesDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`   Extracted ${v1FrameFiles.length} frames from v1 (30fps)`);

  // Also extract high-res frames from v2 for Version 2 & 3
  const v2FramesDir = path.join(scratchDir, 'v2_frames');
  fs.mkdirSync(v2FramesDir, { recursive: true });
  execSync(`ffmpeg -y -i "${v2Path}" -vf "fps=10" "${v2FramesDir}/f_%03d.jpg"`, { stdio: 'ignore' });
  const v2FrameFiles = fs.readdirSync(v2FramesDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`   Extracted ${v2FrameFiles.length} frames from v2 (10fps)`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  // =========================================================================
  // VERSION 1: 01_공장출고_실시간카운터 (Real UI + Zoom + Live Counter & Badges)
  // =========================================================================
  console.log('\n2. Rendering Version 1: 01_공장출고_실시간카운터...');
  const v1OutFramesDir = path.join(scratchDir, 'out_v1');
  fs.mkdirSync(v1OutFramesDir, { recursive: true });

  await page.setContent(`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px; height: 1080px; overflow: hidden; position: relative;
      font-family: 'Pretendard', sans-serif; background: #F1F5F9;
    }
    .bg-wrap {
      position: absolute; inset: 0; width: 1920px; height: 1080px;
      overflow: hidden; display: flex; align-items: center; justify-content: center;
    }
    .bg-img {
      width: 1920px; height: 1080px; object-fit: cover;
      transform-origin: center center;
    }
    /* Top Floating Header Bar */
    .top-bar {
      position: absolute; top: 28px; left: 50%; transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.94);
      border: 2px solid rgba(56, 189, 248, 0.55);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35), 0 0 25px rgba(56, 189, 248, 0.25);
      padding: 16px 42px; border-radius: 999px;
      display: flex; align-items: center; gap: 20px; z-index: 20;
      white-space: nowrap;
    }
    .step-pill {
      background: #2563EB; color: #FFFFFF; font-weight: 800; font-size: 22px;
      padding: 8px 20px; border-radius: 999px; letter-spacing: 0.02em;
    }
    .step-pill.factory {
      background: linear-gradient(135deg, #F59E0B, #EF4444);
    }
    .top-title {
      font-size: 36px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.02em;
    }
    .top-title .hl-yellow { color: #FACC15; }
    .top-title .hl-cyan { color: #38BDF8; }

    /* Highlight Box for Platform Selection (Phase 1: frames 1..60) */
    .platform-focus {
      position: absolute; left: 515px; top: 710px; width: 420px; height: 155px;
      border: 3.5px solid #2563EB; border-radius: 20px;
      box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.18), 0 0 30px rgba(37, 99, 235, 0.5);
      pointer-events: none; z-index: 10; display: none;
    }
    .platform-callout {
      position: absolute; left: 955px; top: 742px;
      background: #2563EB; color: #FFFFFF; font-size: 26px; font-weight: 800;
      padding: 14px 26px; border-radius: 16px;
      box-shadow: 0 12px 28px rgba(37, 99, 235, 0.45);
      z-index: 15; display: none; white-space: nowrap;
    }
    .platform-callout::before {
      content: '◀ '; color: #FACC15;
    }

    /* Phase 2: Factory Output Counter & Column Badges (frames 61..116) */
    .counter-box {
      position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.95);
      border: 2px solid #FACC15;
      padding: 16px 44px; border-radius: 22px;
      display: none; align-items: center; gap: 28px;
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45); z-index: 25;
    }
    .counter-label {
      font-size: 26px; font-weight: 800; color: #E2E8F0;
    }
    .counter-num {
      font-size: 44px; font-weight: 900; color: #FACC15;
      font-variant-numeric: tabular-nums;
    }
    .channel-tags {
      display: flex; gap: 12px;
    }
    .ch-tag {
      padding: 8px 18px; border-radius: 10px; font-size: 20px; font-weight: 800;
      opacity: 0.25; transform: scale(0.92); transition: none;
    }
    .ch-tag.active {
      opacity: 1; transform: scale(1);
    }
    .ch-naver { background: #03C75A; color: #FFFFFF; }
    .ch-insta { background: linear-gradient(45deg, #F58529, #DD2A7B, #8134AF); color: #FFFFFF; }
    .ch-threads { background: #000000; color: #FFFFFF; border: 1.5px solid #64748B; }
  </style></head><body>
    <div class="bg-wrap"><img id="bg" class="bg-img" /></div>
    <div class="top-bar">
      <div id="pill" class="step-pill">STEP 1</div>
      <div id="title" class="top-title">키워드 딱 <span class="hl-yellow">1줄</span> 넣고 플랫폼만 고르면...</div>
    </div>
    <div id="pFocus" class="platform-focus"></div>
    <div id="pCallout" class="platform-callout">블로그·인스타·스레드 동시 선택!</div>

    <div id="counterBox" class="counter-box">
      <div class="counter-label">⚡ 실시간 공장 출고</div>
      <div id="counterNum" class="counter-num">1 / 6개 완료</div>
      <div class="channel-tags">
        <div id="tagNaver" class="ch-tag ch-naver">N 네이버 블로그 ✓</div>
        <div id="tagInsta" class="ch-tag ch-insta">IG 인스타 카드뉴스 ✓</div>
        <div id="tagThreads" class="ch-tag ch-threads">@ 스레드 배포본 ✓</div>
      </div>
    </div>
  </body></html>`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  for (let i = 0; i < v1FrameFiles.length; i++) {
    const b64 = toBase64(path.join(v1FramesDir, v1FrameFiles[i]));
    const isFactoryPhase = i >= 59; // Frame 60+ is where the 6 cards pop in!

    let count = 1;
    if (i >= 62) count = 2;
    if (i >= 66) count = 3;
    if (i >= 71) count = 4;
    if (i >= 76) count = 5;
    if (i >= 82) count = 6;

    await page.evaluate(({ b64, isFactoryPhase, count, i }) => {
      const bg = document.getElementById('bg');
      bg.src = b64;
      // Slight zoom for readability!
      if (!isFactoryPhase) {
        bg.style.transform = 'scale(1.06) translateY(-15px)';
      } else {
        bg.style.transform = 'scale(1.16) translateY(8px)';
      }

      const pill = document.getElementById('pill');
      const title = document.getElementById('title');
      const pFocus = document.getElementById('pFocus');
      const pCallout = document.getElementById('pCallout');
      const counterBox = document.getElementById('counterBox');
      const counterNum = document.getElementById('counterNum');
      const tagNaver = document.getElementById('tagNaver');
      const tagInsta = document.getElementById('tagInsta');
      const tagThreads = document.getElementById('tagThreads');

      if (!isFactoryPhase) {
        pill.className = 'step-pill';
        pill.textContent = '키워드 입력';
        title.innerHTML = '키워드 <span class="hl-yellow">1줄</span> 넣고 플랫폼만 체크하면...';
        // Show focus box when platform icons are visible (around frame 20..58)
        if (i >= 18) {
          pFocus.style.display = 'block';
          pCallout.style.display = 'block';
        } else {
          pFocus.style.display = 'none';
          pCallout.style.display = 'none';
        }
        counterBox.style.display = 'none';
      } else {
        pill.className = 'step-pill factory';
        pill.textContent = '🏭 공장 가동';
        title.innerHTML = '블로그·인스타·스레드 <span class="hl-yellow">공장처럼 찍어줌ㄷㄷ</span>';
        pFocus.style.display = 'none';
        pCallout.style.display = 'none';
        counterBox.style.display = 'flex';
        counterNum.textContent = `${count} / 6개 출고 완료!`;

        tagNaver.className = count >= 1 ? 'ch-tag ch-naver active' : 'ch-tag ch-naver';
        tagInsta.className = count >= 2 ? 'ch-tag ch-insta active' : 'ch-tag ch-insta';
        tagThreads.className = count >= 3 ? 'ch-tag ch-threads active' : 'ch-tag ch-threads';
      }
    }, { b64, isFactoryPhase, count, i });

    const outFrame = path.join(v1OutFramesDir, `f_${String(i).padStart(3, '0')}.jpg`);
    await page.screenshot({ path: outFrame, type: 'jpeg', quality: 95 });
  }

  const mp4_1 = path.join(outDir, '01_공장출고_실시간카운터.mp4');
  const gif_1 = path.join(outDir, '01_공장출고_실시간카운터.gif');
  execSync(`ffmpeg -y -framerate 30 -i "${v1OutFramesDir}/f_%03d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 18 "${mp4_1}"`, { stdio: 'ignore' });
  mp4ToGif(mp4_1, gif_1, 15, 960);
  fs.copyFileSync(mp4_1, path.join(quickDir, '01_공장출고_실시간카운터.mp4'));
  fs.copyFileSync(gif_1, path.join(quickDir, '01_공장출고_실시간카운터.gif'));
  fs.copyFileSync(gif_1, path.join(artDir, 'factory_01_live_counter.gif'));
  console.log('✓ Completed Version 1 (MP4 + GIF)');

  // =========================================================================
  // VERSION 2: 02_초대형카드_컨베이어_스탬프 (High-Readability Conveyor Belt)
  // =========================================================================
  console.log('\n3. Rendering Version 2: 02_초대형카드_컨베이어_스탬프...');
  const v2OutFramesDir = path.join(scratchDir, 'out_v2');
  fs.mkdirSync(v2OutFramesDir, { recursive: true });

  // Crop the 6 cards cleanly from v1_30fps/f_110.jpg (where all 6 cards are fully rendered)
  const fullGridB64 = toBase64(path.join(v1FramesDir, v1FrameFiles[v1FrameFiles.length - 2]));
  // Also get the large scrolling cards from v2_frames (frames 75 to 155)
  // Let's build a super crisp 4.0s (120 frames at 30fps) animation:
  // Frame 0..32 (1.1s): Giant magnified keyword input bar typing "작은 집 창가 독서 공간" & "15분 새우 오일 파스타" -> Click [⚡ 공장 가동]
  // Frame 33..85 (1.7s): Large close-up cards from v2 scrolling rapidly like a high-speed factory conveyor belt!
  // Frame 86..119 (1.1s): All 6 cards locked in + giant glowing stamp "키워드 하나로 6개 동시 출고 완료!"

  await page.setContent(`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px; height: 1080px; overflow: hidden; position: relative;
      font-family: 'Pretendard', sans-serif; background: #0B0F19;
    }
    /* Scene 1: Giant Search Bar */
    #scene1 {
      position: absolute; inset: 0;
      background: radial-gradient(circle at 50% 40%, #1E293B 0%, #090D16 100%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      z-index: 30;
    }
    .s1-badge {
      background: rgba(56, 189, 248, 0.15); border: 1.5px solid #38BDF8;
      color: #38BDF8; font-size: 26px; font-weight: 800; padding: 10px 28px;
      border-radius: 999px; margin-bottom: 28px;
    }
    .s1-title {
      font-size: 64px; font-weight: 900; color: #FFFFFF; margin-bottom: 48px;
      letter-spacing: -0.03em; text-align: center;
    }
    .s1-title span { color: #FACC15; }
    .search-box {
      width: 1280px; height: 130px; background: #FFFFFF; border-radius: 999px;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px 0 52px;
      box-shadow: 0 0 60px rgba(56, 189, 248, 0.4);
      border: 4px solid #38BDF8;
    }
    .search-text {
      font-size: 42px; font-weight: 800; color: #0F172A;
      display: flex; align-items: center;
    }
    .cursor {
      display: inline-block; width: 4px; height: 46px; background: #2563EB; margin-left: 6px;
    }
    .send-btn {
      background: linear-gradient(135deg, #2563EB, #1D4ED8);
      color: #FFFFFF; font-size: 32px; font-weight: 900;
      padding: 26px 48px; border-radius: 999px;
      display: flex; align-items: center; gap: 12px;
      box-shadow: 0 10px 25px rgba(37, 99, 235, 0.5);
    }
    .send-btn.clicked {
      transform: scale(0.92);
      background: linear-gradient(135deg, #F59E0B, #EF4444);
    }
    .platform-row {
      margin-top: 38px; display: flex; gap: 20px;
    }
    .p-chip {
      background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.25);
      color: #F8FAFC; font-size: 26px; font-weight: 700; padding: 14px 30px; border-radius: 16px;
    }
    .p-chip.on {
      background: rgba(37, 99, 235, 0.35); border-color: #60A5FA; color: #FFFFFF;
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
    }

    /* Scene 2: High-Speed Conveyor Belt + Final 6-Card Grid */
    #scene2 {
      position: absolute; inset: 0; display: none; background: #F1F5F9;
    }
    #s2Bg {
      width: 1920px; height: 1080px; object-fit: cover;
      transform-origin: center center;
    }
    .s2-header {
      position: absolute; top: 0; left: 0; right: 0; height: 115px;
      background: rgba(15, 23, 42, 0.96);
      border-bottom: 3px solid #FACC15;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 64px; z-index: 20;
    }
    .s2-h-left {
      display: flex; align-items: center; gap: 18px;
      font-size: 40px; font-weight: 900; color: #FFFFFF;
    }
    .s2-h-left span { color: #FACC15; }
    .s2-h-right {
      display: flex; gap: 14px;
    }
    .s2-pill {
      background: #2563EB; color: #FFFFFF; font-size: 24px; font-weight: 800;
      padding: 10px 24px; border-radius: 12px;
    }
    .final-stamp {
      position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
      background: linear-gradient(135deg, #0F172A, #1E293B);
      border: 3px solid #38BDF8;
      box-shadow: 0 20px 50px rgba(0,0,0,0.55), 0 0 35px rgba(56, 189, 248, 0.4);
      padding: 20px 52px; border-radius: 999px;
      color: #FFFFFF; font-size: 34px; font-weight: 900;
      z-index: 30; display: none; white-space: nowrap;
    }
    .final-stamp span { color: #38BDF8; }
  </style></head><body>
    <div id="scene1">
      <div class="s1-badge">⚡ AutoSense AI 콘텐츠 공장</div>
      <div class="s1-title">키워드 딱 <span>1줄</span>만 입력하면?</div>
      <div class="search-box">
        <div class="search-text"><span id="typedText"></span><span class="cursor"></span></div>
        <div id="sendBtn" class="send-btn">⚡ 공장 가동</div>
      </div>
      <div class="platform-row">
        <div class="p-chip on">✓ 네이버 블로그</div>
        <div class="p-chip on">✓ 인스타 카드뉴스</div>
        <div class="p-chip on">✓ 스레드</div>
        <div class="p-chip on">✓ 티스토리·X</div>
      </div>
    </div>

    <div id="scene2">
      <div class="s2-header">
        <div class="s2-h-left">🏭 키워드만 넣으면 <span>블로그·인스타·스레드</span> 공장처럼 찍어줌ㄷㄷ</div>
        <div class="s2-h-right">
          <div class="s2-pill" id="s2Status">고속 생성 중...</div>
        </div>
      </div>
      <img id="s2Bg" />
      <div id="finalStamp" class="final-stamp">✓ 블로그 원고 + 인스타 카드뉴스 + 스레드 <span>총 6개 동시 출고 완료!</span></div>
    </div>
  </body></html>`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const promptStr = '작은 집 창가 독서 공간 꾸미기 + 원팬 파스타 레시피';
  const totalV2Frames = 114; // 3.8s at 30fps

  for (let f = 0; f < totalV2Frames; f++) {
    if (f < 34) {
      // Scene 1: Typing & clicking
      const charCount = Math.min(promptStr.length, Math.floor((f / 22) * promptStr.length));
      const text = promptStr.slice(0, charCount);
      const clicked = f >= 26;
      await page.evaluate(({ text, clicked }) => {
        document.getElementById('scene1').style.display = 'flex';
        document.getElementById('scene2').style.display = 'none';
        document.getElementById('typedText').textContent = text;
        const btn = document.getElementById('sendBtn');
        btn.className = clicked ? 'send-btn clicked' : 'send-btn';
      }, { text, clicked });
    } else if (f < 78) {
      // Scene 2A: High-res close-up cards conveyor scroll from v2 (frames 80..125 of v2_frames)
      const v2Idx = Math.min(v2FrameFiles.length - 1, 75 + Math.floor(((f - 34) / 44) * 50));
      const b64 = toBase64(path.join(v2FramesDir, v2FrameFiles[v2Idx]));
      await page.evaluate(({ b64 }) => {
        document.getElementById('scene1').style.display = 'none';
        document.getElementById('scene2').style.display = 'block';
        const img = document.getElementById('s2Bg');
        img.src = b64;
        img.style.transform = 'scale(1.04) translateY(35px)';
        document.getElementById('s2Status').textContent = '⚡ 포맷별 자동 변환 출고 중...';
        document.getElementById('finalStamp').style.display = 'none';
      }, { b64 });
    } else {
      // Scene 2B: Final 6-card grid zoom-out lock!
      await page.evaluate(({ b64 }) => {
        document.getElementById('scene1').style.display = 'none';
        document.getElementById('scene2').style.display = 'block';
        const img = document.getElementById('s2Bg');
        img.src = b64;
        img.style.transform = 'scale(1.18) translateY(30px)';
        document.getElementById('s2Status').textContent = '🎉 6개 전체 출고 완료!';
        document.getElementById('s2Status').style.background = '#10B981';
        document.getElementById('finalStamp').style.display = 'block';
      }, { b64: fullGridB64 });
    }

    const outFrame = path.join(v2OutFramesDir, `f_${String(f).padStart(3, '0')}.jpg`);
    await page.screenshot({ path: outFrame, type: 'jpeg', quality: 95 });
  }

  const mp4_2 = path.join(outDir, '02_초대형카드_컨베이어_스탬프.mp4');
  const gif_2 = path.join(outDir, '02_초대형카드_컨베이어_스탬프.gif');
  execSync(`ffmpeg -y -framerate 30 -i "${v2OutFramesDir}/f_%03d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 18 "${mp4_2}"`, { stdio: 'ignore' });
  mp4ToGif(mp4_2, gif_2, 15, 960);
  fs.copyFileSync(mp4_2, path.join(quickDir, '02_초대형카드_컨베이어_스탬프.mp4'));
  fs.copyFileSync(gif_2, path.join(quickDir, '02_초대형카드_컨베이어_스탬프.gif'));
  fs.copyFileSync(gif_2, path.join(artDir, 'factory_02_conveyor_stamp.gif'));
  console.log('✓ Completed Version 2 (MP4 + GIF)');

  // =========================================================================
  // VERSION 3: 03_스레드_네이티브_미니멀루프 (Clean Native Viral Style)
  // =========================================================================
  console.log('\n4. Rendering Version 3: 03_스레드_네이티브_미니멀루프...');
  const v3OutFramesDir = path.join(scratchDir, 'out_v3');
  fs.mkdirSync(v3OutFramesDir, { recursive: true });

  await page.setContent(`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px; height: 1080px; overflow: hidden; position: relative;
      font-family: 'Pretendard', sans-serif; background: #F8FAFC;
    }
    #bg {
      width: 1920px; height: 1080px; object-fit: cover;
      transform-origin: center center;
    }
    /* Minimal viral pill at top-left or bottom-center */
    .viral-pill {
      position: absolute; bottom: 42px; left: 50%; transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(12px);
      padding: 18px 42px; border-radius: 999px;
      font-size: 36px; font-weight: 900; color: #FFFFFF;
      box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.02em; white-space: nowrap;
      border: 2px solid rgba(255, 255, 255, 0.15);
    }
    .viral-pill .yellow { color: #FACC15; }
    .viral-pill .green { color: #4ADE80; }
  </style></head><body>
    <img id="bg" />
    <div id="caption" class="viral-pill"></div>
  </body></html>`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  for (let i = 0; i < v1FrameFiles.length; i++) {
    const b64 = toBase64(path.join(v1FramesDir, v1FrameFiles[i]));
    const isSecondHalf = i >= 59;
    await page.evaluate(({ b64, isSecondHalf }) => {
      const bg = document.getElementById('bg');
      bg.src = b64;
      bg.style.transform = isSecondHalf ? 'scale(1.18) translateY(-10px)' : 'scale(1.05)';
      const cap = document.getElementById('caption');
      if (!isSecondHalf) {
        cap.innerHTML = '💬 키워드 넣고 <span class="yellow">블로그·인스타·스레드</span> 체크하면';
      } else {
        cap.innerHTML = '⚡ 원고+카드뉴스 <span class="green">6개씩 공장처럼 찍어줌ㄷㄷ</span>';
      }
    }, { b64, isSecondHalf });

    const outFrame = path.join(v3OutFramesDir, `f_${String(i).padStart(3, '0')}.jpg`);
    await page.screenshot({ path: outFrame, type: 'jpeg', quality: 95 });
  }

  const mp4_3 = path.join(outDir, '03_스레드_네이티브_미니멀루프.mp4');
  const gif_3 = path.join(outDir, '03_스레드_네이티브_미니멀루프.gif');
  execSync(`ffmpeg -y -framerate 30 -i "${v3OutFramesDir}/f_%03d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 18 "${mp4_3}"`, { stdio: 'ignore' });
  mp4ToGif(mp4_3, gif_3, 15, 960);
  fs.copyFileSync(mp4_3, path.join(quickDir, '03_스레드_네이티브_미니멀루프.mp4'));
  fs.copyFileSync(gif_3, path.join(quickDir, '03_스레드_네이티브_미니멀루프.gif'));
  fs.copyFileSync(gif_3, path.join(artDir, 'factory_03_native_minimal.gif'));
  console.log('✓ Completed Version 3 (MP4 + GIF)');

  await browser.close();
  console.log('\n🎉 All 3 Factory MP4 + GIF sets created in:', quickDir);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

