import { COPY_DATABASE, generateHookCopies } from './src/copy_generator.mjs';

console.log('='.repeat(65));
console.log('💍 버진로드(Virgin Road) 고전환 후킹 카피 생성기');
console.log('='.repeat(65));

const categories = [
  { key: 'COMPRESSION', label: '1. 압축 비교형 (1초 컷 효율 극대화)' },
  { key: 'MARRIAGE_DIRECT', label: '2. 결혼 확신 직구형 (호기심 차단 / 진성 타겟)' },
  { key: 'PRE_SCREENED_LUXURY', label: '3. 12명 사전 심사 & 프라이빗 (100만원+ 결제 저항 제거)' }
];

for (const cat of categories) {
  console.log(`\n📌 [${cat.label}]`);
  const items = COPY_DATABASE[cat.key];
  items.forEach((item, idx) => {
    const rawLine1 = item.line1.replace(/<[^>]+>/g, '');
    const rawLine2 = item.line2.replace(/<[^>]+>/g, '');
    console.log(`  ${idx + 1}. "${rawLine1} ${rawLine2}"`);
    console.log(`     - 상단: ${item.sub}`);
    console.log(`     - 배지: [${item.pills.join('] [')}]`);
  });
}

console.log('\n' + '='.repeat(65));
console.log('✅ 총 15개 엄선 세트 로드 완료 (언제든 렌더러에 즉시 주입 가능)');
console.log('='.repeat(65));

