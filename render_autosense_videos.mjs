import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { chromium } from 'playwright';

const uploadDir = 'C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877/.user_uploaded/';
const artDir = 'C:/Users/user/.gemini/antigravity/brain/858a307d-9cb5-4df7-8200-958580a03877/';
const outputDir = path.resolve('output/autosense/videos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const v1 = path.join(uploadDir, 'media_1793941362486_e40066dd.mp4'); // 4초 루프
const v2 = path.join(uploadDir, 'media_1793941362959_bab1d4c1.mp4'); // 15초 에디토리얼

const overlays = [
  {
    name: 'overlay_top_bar.png',
    html: `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
      @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@700;800;900&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1920px; height: 1080px; position: relative; overflow: hidden;
        font-family: 'Pretendard', sans-serif; background: transparent;
        -webkit-font-smoothing: antialiased;
      }
      .overlay-top {
        position: absolute; top: 0; left: 0; right: 0; height: 320px;
        background: linear-gradient(180deg, rgba(10, 12, 18, 0.94) 0%, rgba(10, 12, 18, 0.82) 65%, rgba(10, 12, 18, 0) 100%);
      }
      .header-bar {
        position: absolute; top: 38px; left: 80px; right: 80px;
        display: flex; justify-content: space-between; align-items: center;
      }
      .brand-badge {
        display: inline-flex; align-items: center; gap: 10px;
        background: rgba(37, 99, 235, 0.35); border: 1.5px solid #3B82F6;
        padding: 8px 20px; border-radius: 9999px; font-size: 20px; font-weight: 800;
        color: #60A5FA; letter-spacing: 0.05em; box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
      }
      .brand-badge::before {
        content: ''; width: 9px; height: 9px; background: #60A5FA; border-radius: 50%;
        box-shadow: 0 0 10px #60A5FA;
      }
      .pill-group { display: flex; gap: 12px; }
      .pill {
        background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px);
        border: 1.2px solid rgba(255, 255, 255, 0.25); padding: 7px 18px;
        border-radius: 9999px; font-size: 18px; font-weight: 600; color: #F1F5F9;
      }
      .hook-title-box {
        position: absolute; top: 105px; left: 80px; right: 80px;
        text-align: left;
      }
      .main-copy {
        font-size: 52px; font-weight: 900; line-height: 1.25; letter-spacing: -0.03em;
        color: #FFFFFF; text-shadow: 0 4px 20px rgba(0,0,0,0.85);
      }
      .main-copy .yellow { color: #FACC15; text-shadow: 0 0 25px rgba(250, 204, 21, 0.5); }
      .main-copy .blue { color: #38BDF8; text-shadow: 0 0 25px rgba(56, 189, 248, 0.5); }
      .sub-desc {
        margin-top: 12px; font-size: 22px; font-weight: 600; color: #94A3B8;
        text-shadow: 0 2px 10px rgba(0,0,0,0.8);
      }
    </style></head><body>
      <div class="overlay-top"></div>
      <div class="header-bar">
        <div class="brand-badge">AutoSense AI</div>
        <div class="pill-group">
          <span class="pill">네이버 블로그</span>
          <span class="pill">인스타그램</span>
          <span class="pill">스레드</span>
          <span class="pill">워드프레스</span>
        </div>
      </div>
      <div class="hook-title-box">
        <div class="main-copy">블로그 글 <span class="yellow">1개 2시간</span> 쓰던 분들 주목,<br>오토센스는 <span class="blue">30초</span>면 4개 채널 동시 발행됩니다.</div>
        <div class="sub-desc">주제 1개 입력으로 네이버 블로그 + 인스타 카드뉴스 6장 뚝딱 완성</div>
      </div>
    </body></html>`
  },
  {
    name: 'overlay_bottom_plate.png',
    html: `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
      @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@700;800;900&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1920px; height: 1080px; position: relative; overflow: hidden;
        font-family: 'Pretendard', sans-serif; background: transparent;
        -webkit-font-smoothing: antialiased;
      }
      .bottom-card {
        position: absolute; bottom: 44px; left: 60px; right: 60px;
        padding: 34px 48px;
        background: rgba(10, 15, 29, 0.86);
        backdrop-filter: blur(28px) saturate(160%);
        border: 1.5px solid rgba(56, 189, 248, 0.45);
        border-radius: 24px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.25);
        display: flex; justify-content: space-between; align-items: center;
      }
      .text-area { text-align: left; }
      .tag-row {
        display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
      }
      .tag {
        font-size: 18px; font-weight: 800; color: #38BDF8; letter-spacing: 0.08em;
      }
      .main-copy {
        font-size: 46px; font-weight: 900; line-height: 1.25; letter-spacing: -0.02em;
        color: #FFFFFF;
      }
      .main-copy .blue { color: #38BDF8; }
      .main-copy .yellow { color: #FACC15; }
      .cta-area {
        display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
      }
      .badge-row { display: flex; gap: 10px; }
      .sub-badge {
        background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.22);
        padding: 8px 18px; border-radius: 10px; font-size: 17px; font-weight: 700; color: #F8FAFC;
      }
      .brand-title {
        font-size: 24px; font-weight: 900; letter-spacing: 0.12em; color: #94A3B8;
      }
    </style></head><body>
      <div class="bottom-card">
        <div class="text-area">
          <div class="tag-row"><span class="tag">⚡ AUTOSENSE CONTENT AUTOMATION</span></div>
          <div class="main-copy">주제 <span class="blue">1줄</span> 쳤더니 <span class="yellow">플랫폼 4개</span> 동시 완성<br>퇴근 후 2시간씩 글 쓰지 마세요.</div>
        </div>
        <div class="cta-area">
          <div class="brand-title">AUTOSENSE.AI</div>
          <div class="badge-row">
            <div class="sub-badge">SEO 자동 최적화</div>
            <div class="sub-badge">A/B안 비교</div>
            <div class="sub-badge">원클릭 발행</div>
          </div>
        </div>
      </div>
    </body></html>`
  }
];

async function run() {
  console.log('1. Rendering transparent PNG overlays via Playwright...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  const overlayFiles = [];
  for (const item of overlays) {
    await page.setContent(item.html, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    const outPng = path.join(outputDir, item.name);
    await page.screenshot({ path: outPng, type: 'png', omitBackground: true });
    overlayFiles.push(outPng);
    console.log('✓ Created transparent overlay:', item.name);
  }
  await browser.close();

  console.log('\n2. Merging video and overlay using ffmpeg...');

  // Video 1: 4초 루프 영상 + 상단 볼드 후킹 바 (autosense_video_01_top_hook.mp4)
  const outMp4_1 = path.join(outputDir, 'autosense_video_01_top_hook.mp4');
  const artMp4_1 = path.join(artDir, 'autosense_video_01_top_hook.mp4');
  const cmd1 = `ffmpeg -y -i "${v1}" -i "${overlayFiles[0]}" -filter_complex "[0:v][1:v]overlay=0:0" -c:v libx264 -pix_fmt yuv420p -c:a copy "${outMp4_1}"`;
  execSync(cmd1);
  fs.copyFileSync(outMp4_1, artMp4_1);
  console.log('🎉 Generated Video 1 (4s Loop):', outMp4_1);

  // Video 2: 15초 에디토리얼 영상 + 하단 네온 플레이트 (autosense_video_02_bottom_plate.mp4)
  const outMp4_2 = path.join(outputDir, 'autosense_video_02_bottom_plate.mp4');
  const artMp4_2 = path.join(artDir, 'autosense_video_02_bottom_plate.mp4');
  const cmd2 = `ffmpeg -y -i "${v2}" -i "${overlayFiles[1]}" -filter_complex "[0:v][1:v]overlay=0:0" -c:v libx264 -pix_fmt yuv420p -c:a copy "${outMp4_2}"`;
  execSync(cmd2);
  fs.copyFileSync(outMp4_2, artMp4_2);
  console.log('🎉 Generated Video 2 (15s Editorial):', outMp4_2);

  console.log('\nAll video ad creatives generated successfully!');
}

run().catch(console.error);
