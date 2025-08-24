const fs = require('fs');
const path = require('path');

// 환경 변수 로드
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Azure AI Search 설정
const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
const searchKey = process.env.AZURE_SEARCH_KEY;
const searchIndex = process.env.AZURE_SEARCH_INDEX || 'real-estate-index';

// Azure OpenAI 설정
const openaiEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const openaiApiKey = process.env.AZURE_OPENAI_API_KEY;
const embeddingDeployment = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || 'text-embedding-ada-002';

// 환경 변수 검증
console.log('🔍 환경 변수 확인:');
console.log('AZURE_OPENAI_ENDPOINT:', openaiEndpoint ? '✅ 설정됨' : '❌ 설정되지 않음');
console.log('AZURE_OPENAI_API_KEY:', openaiApiKey ? `✅ 설정됨 (${openaiApiKey.length}자)` : '❌ 설정되지 않음');
console.log('AZURE_OPENAI_EMBEDDING_DEPLOYMENT:', embeddingDeployment);
console.log('AZURE_SEARCH_ENDPOINT:', searchEndpoint ? '✅ 설정됨' : '❌ 설정되지 않음');
console.log('AZURE_SEARCH_KEY:', searchKey ? '✅ 설정됨' : '❌ 설정되지 않음');
console.log('AZURE_SEARCH_INDEX:', searchIndex);
console.log('---');

// 환경 변수 검증
if (!openaiEndpoint || !openaiApiKey || !searchEndpoint || !searchKey) {
  console.error('❌ 필수 환경 변수가 설정되지 않았습니다.');
  console.error('AZURE_OPENAI_ENDPOINT:', openaiEndpoint);
  console.error('AZURE_OPENAI_API_KEY:', openaiApiKey ? '설정됨' : '설정되지 않음');
  console.error('AZURE_SEARCH_ENDPOINT:', searchEndpoint);
  console.error('AZURE_SEARCH_KEY:', searchKey ? '설정됨' : '설정되지 않음');
  process.exit(1);
}

// 최적화 설정
const BATCH_SIZE = 100; // 배치 크기 감소 (500 → 100)
const CONCURRENT_BATCHES = 3; // 동시 처리 배치 수 감소 (10 → 3)
const MAX_RETRIES = 3; // 최대 재시도 횟수
const RETRY_DELAY = 2000; // 재시도 간격 증가 (1000 → 2000ms)
const EMBEDDING_DELAY = 100; // 임베딩 생성 간 지연 (100ms)

// 유틸리티 함수
function convertSquareMetersToPyeong(sqm) {
  return Math.round((sqm / 3.3058) * 10) / 10;
}

function convertWonToBillion(won) {
  return Math.round((won / 10000) * 100) / 100;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 임베딩 생성 (재시도 로직 포함)
async function generateEmbedding(text, retryCount = 0) {
  try {
    // 임베딩 생성 간 지연
    if (retryCount === 0) {
      await sleep(EMBEDDING_DELAY);
    }
    
    const response = await fetch(`${openaiEndpoint}/openai/deployments/${embeddingDeployment}/embeddings?api-version=2024-02-15-preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': openaiApiKey,
      },
      body: JSON.stringify({ input: text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Embedding API 오류: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.data || !result.data[0] || !result.data[0].embedding) {
      throw new Error('응답에 임베딩 데이터가 없습니다');
    }
    
    return result.data[0].embedding;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`⚠️ 임베딩 생성 실패, ${retryCount + 1}번째 재시도 중... (${text.substring(0, 30)}...)`);
      console.log(`   오류: ${error.message}`);
      await sleep(RETRY_DELAY * (retryCount + 1)); // 지수 백오프
      return generateEmbedding(text, retryCount + 1);
    } else {
      console.error(`❌ 임베딩 생성 최종 실패: ${text.substring(0, 30)}...`);
      console.error(`   최종 오류: ${error.message}`);
      throw error;
    }
  }
}

// 배치 데이터 처리 (병렬 처리)
async function processBatch(batch, batchIndex, totalBatches) {
  const startTime = Date.now();
  console.log(`🔄 배치 ${batchIndex + 1}/${totalBatches} 처리 시작 (${batch.length}건)`);
  
  try {
    const documents = [];
    
    // 배치 내 데이터를 병렬로 처리
    const documentPromises = batch.map(async (item, itemIndex) => {
      try {
        const areaInPyeong = convertSquareMetersToPyeong(parseFloat(item.arch_area) || 0);
        const priceInBillion = convertWonToBillion(parseFloat(item.thing_amt) || 0);
        
        const document = {
          id: Buffer.from(`${item.cgg_nm || 'unknown'}_${item.bldg_nm || 'unknown'}_${item.ctrt_day || 'unknown'}_${Math.random().toString(36).substr(2, 9)}`).toString('base64').replace(/[^a-zA-Z0-9_-]/g, '_'),
          district: item.cgg_nm || '',
          buildingName: item.bldg_nm || '',
          area: Number(areaInPyeong), // 숫자 타입으로 확실히 변환
          price: Number(priceInBillion), // 숫자 타입으로 확실히 변환
          contractDate: item.ctrt_day || '',
          buildingType: item.bldg_usg || '',
          floor: String(item.flr || ''), // 숫자를 문자열로 변환
          constructionYear: String(item.arch_yr || ''), // 숫자를 문자열로 변환
          address: `${item.cgg_nm || ''} ${item.stdg_nm || ''} ${item.bldg_nm || ''}`
        };

        // 임베딩 생성
        const searchText = `${item.cgg_nm || ''} ${item.stdg_nm || ''} ${item.bldg_nm || ''} ${item.bldg_usg || ''}`;
        const contentVector = await generateEmbedding(searchText);
        document.contentVector = contentVector;
        
        return document;
      } catch (error) {
        console.error(`❌ 데이터 처리 실패 (${item.cgg_nm}):`, error.message);
        return null; // 실패한 항목은 null로 반환
      }
    });

    // 모든 문서 처리 완료 대기
    const results = await Promise.all(documentPromises);
    const validDocuments = results.filter(doc => doc !== null);
    
    if (validDocuments.length === 0) {
      throw new Error('배치 내 모든 문서 처리 실패');
    }

    // Azure AI Search에 업로드
    const response = await fetch(`${searchEndpoint}/indexes/${searchIndex}/docs/index?api-version=2023-11-01`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': searchKey,
      },
      body: JSON.stringify({ value: validDocuments }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`업로드 실패: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`✅ 배치 ${batchIndex + 1}/${totalBatches} 완료: ${validDocuments.length}건 (${duration.toFixed(1)}초)`);
    
    return {
      success: true,
      count: validDocuments.length,
      duration: duration,
      failed: batch.length - validDocuments.length
    };
    
  } catch (error) {
    console.error(`❌ 배치 ${batchIndex + 1}/${totalBatches} 실패:`, error.message);
    return {
      success: false,
      count: 0,
      duration: 0,
      failed: batch.length,
      error: error.message
    };
  }
}

// 메인 업로드 함수
async function uploadDataOptimized() {
  try {
    console.log('🚀 최적화된 데이터 업로드 시작...');
    console.log(`⚙️ 설정: 배치 크기 ${BATCH_SIZE}, 동시 처리 ${CONCURRENT_BATCHES}배치`);
    
    const jsonFilePath = path.join(__dirname, '../서울시 부동산 실거래가 정보_2025.json');
    
    if (!fs.existsSync(jsonFilePath)) {
      console.error('❌ JSON 파일을 찾을 수 없습니다:', jsonFilePath);
      return;
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
    if (!jsonData.DATA || !Array.isArray(jsonData.DATA)) {
      console.error('❌ JSON 구조 오류: DATA 배열을 찾을 수 없습니다.');
      return;
    }

    const totalRecords = jsonData.DATA.length;
    console.log(`📊 전체 데이터: ${totalRecords.toLocaleString()}건`);
    
    // 배치로 분할
    const batches = [];
    for (let i = 0; i < totalRecords; i += BATCH_SIZE) {
      batches.push(jsonData.DATA.slice(i, i + BATCH_SIZE));
    }
    
    console.log(`📦 총 ${batches.length}개 배치로 분할됨`);
    
    // 진행 상황 추적
    let processedCount = 0;
    let successCount = 0;
    let failedCount = 0;
    let totalDuration = 0;
    
    const startTime = Date.now();
    
    // 배치를 CONCURRENT_BATCHES 개씩 병렬 처리
    for (let i = 0; i < batches.length; i += CONCURRENT_BATCHES) {
      const currentBatches = batches.slice(i, i + CONCURRENT_BATCHES);
      const batchPromises = currentBatches.map((batch, index) => 
        processBatch(batch, i + index, batches.length)
      );
      
      // 현재 배치 그룹 완료 대기
      const results = await Promise.all(batchPromises);
      
      // 결과 집계
      results.forEach(result => {
        processedCount += result.count;
        totalDuration += result.duration;
        
        if (result.success) {
          successCount += result.count;
        } else {
          failedCount += result.count;
        }
      });
      
      // 진행 상황 출력
      const progress = ((i + currentBatches.length) / batches.length * 100).toFixed(1);
      const elapsed = (Date.now() - startTime) / 1000;
      const estimatedTotal = (elapsed / (i + currentBatches.length)) * batches.length;
      const remaining = estimatedTotal - elapsed;
      
      console.log(`📈 진행률: ${progress}% (${i + currentBatches.length}/${batches.length} 배치)`);
      console.log(`⏱️ 경과: ${elapsed.toFixed(0)}초, 예상 남은 시간: ${remaining.toFixed(0)}초`);
      console.log(`✅ 성공: ${successCount.toLocaleString()}건, ❌ 실패: ${failedCount.toLocaleString()}건`);
      console.log('---');
    }
    
    const totalTime = (Date.now() - startTime) / 1000;
    
    console.log('🎉 업로드 완료!');
    console.log(`📊 최종 결과:`);
    console.log(`   - 총 처리: ${processedCount.toLocaleString()}건`);
    console.log(`   - 성공: ${successCount.toLocaleString()}건`);
    console.log(`   - 실패: ${failedCount.toLocaleString()}건`);
    console.log(`   - 총 소요 시간: ${(totalTime / 60).toFixed(1)}분`);
    console.log(`   - 평균 처리 속도: ${(processedCount / totalTime).toFixed(1)}건/초`);
    
  } catch (error) {
    console.error('❌ 업로드 중 오류 발생:', error);
  }
}

// 명령어 처리
const command = process.argv[2];

switch (command) {
  case 'upload-data':
    uploadDataOptimized();
    break;
  default:
    console.log('사용법: node scripts/create-search-index-optimized.js upload-data');
    console.log('최적화된 데이터 업로드를 실행합니다.');
    break;
}
