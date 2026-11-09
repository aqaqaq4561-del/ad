import fs from 'fs';
import path from 'path';

// CLI 실행 인자
// node log_result.mjs --brand virginroad --spend 50000 --leads 12 --notes "인피니티풀 반응 폭발"
const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue;
}

const brand = getArg('--brand', 'virginroad');
const spend = parseInt(getArg('--spend', '0'), 10);
const leads = parseInt(getArg('--leads', '0'), 10);
const notes = getArg('--notes', '');
const creative = getArg('--creative', '');

const logFile = path.resolve(`experiments/${brand}/performance_log.json`);
if (!fs.existsSync(logFile)) {
  console.error(`❌ 로그 파일이 없습니다: ${logFile}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
const cpl = leads > 0 ? Math.round(spend / leads) : spend;
const status = cpl <= data.benchmark_cpl ? 'WINNER' : (cpl > data.benchmark_cpl * 2 ? 'FAILED' : 'NEUTRAL');

const newEntry = {
  date: new Date().toISOString().slice(0, 10),
  creative_names: creative ? [creative] : ['최신 집행 소재'],
  spend,
  leads,
  cpl,
  status,
  notes
};

data.history.push(newEntry);
fs.writeFileSync(logFile, JSON.stringify(data, null, 2), 'utf-8');

console.log('='.repeat(65));
console.log(`✅ [${brand.toUpperCase()}] 광고 집행 성과 기록 완료!`);
console.log(`- 지출: ₩${spend.toLocaleString()} | 리드: ${leads}건 | CPL: ₩${cpl.toLocaleString()}`);
console.log(`- 판정: [${status}] (기준 CPL: ₩${data.benchmark_cpl.toLocaleString()})`);
if (notes) console.log(`- 메모: ${notes}`);
console.log('='.repeat(65));
