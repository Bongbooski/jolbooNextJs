const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// .env 파일 로드
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
const searchKey = process.env.AZURE_SEARCH_KEY;
const searchIndex = process.env.AZURE_SEARCH_INDEX || 'real-estate-index';

if (!searchEndpoint || !searchKey) {
  console.error('Azure Search 환경변수가 설정되지 않았습니다.');
  console.error('AZURE_SEARCH_ENDPOINT와 AZURE_SEARCH_KEY를 확인해주세요.');
  process.exit(1);
}

// ㎡를 평으로 변환하는 함수
function convertSquareMetersToPyeong(squareMeters) {
  return Math.round((squareMeters / 3.3058) * 100) / 100;
}

// 만원을 억원으로 변환하는 함수
function convertWonToBillion(won) {
  return Math.round((won / 10000) * 100) / 100;
}

// 텍스트를 벡터로 변환하는 함수 (Azure OpenAI REST API 직접 호출)
async function generateEmbedding(text) {
  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deploymentName = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || 'text-embedding-ada-002';

    console.log(`임베딩 생성 중: "${text.substring(0, 50)}..."`);

    const response = await fetch(`${endpoint}/openai/deployments/${deploymentName}/embeddings?api-version=2024-02-15-preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        input: text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Embedding API 오류: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    const embedding = result.data[0].embedding;
    console.log(`임베딩 생성 완료 (차원: ${embedding.length})`);
    return embedding;
  } catch (error) {
    console.error('Embedding 생성 실패:', error);
    // 오류 발생 시 빈 벡터 반환 (1536차원)
    return new Array(1536).fill(0);
  }
}

// 기존 인덱스 삭제
async function deleteSearchIndex() {
  try {
    console.log('기존 인덱스 삭제 중...');
    
    const response = await fetch(`${searchEndpoint}/indexes/${searchIndex}?api-version=2023-11-01`, {
      method: 'DELETE',
      headers: {
        'api-key': searchKey,
      },
    });

    if (response.status === 204) {
      console.log(`✅ 인덱스 '${searchIndex}' 삭제 완료!`);
    } else if (response.status === 404) {
      console.log(`ℹ️ 인덱스 '${searchIndex}'가 존재하지 않습니다.`);
    } else {
      const errorText = await response.text();
      console.error(`❌ 인덱스 삭제 실패: ${response.status} ${response.statusText}`);
      console.error('오류 내용:', errorText);
    }
  } catch (error) {
    console.error('인덱스 삭제 중 오류 발생:', error);
  }
}

// 검색 인덱스 생성
async function createSearchIndex() {
  try {
    console.log('Azure AI Search 인덱스 생성 중...');

    // 2023-11-01 API 버전에 맞는 벡터 검색 스키마
    const indexSchema = {
        name: searchIndex,
        fields: [
          { name: 'id', type: 'Edm.String', key: true, filterable: true },
          { name: 'district', type: 'Edm.String', searchable: true },
          { name: 'buildingName', type: 'Edm.String', searchable: true },
          { name: 'area', type: 'Edm.Double', filterable: true, sortable: true },
          { name: 'price', type: 'Edm.Double', filterable: true, sortable: true },
          { name: 'contractDate', type: 'Edm.String', filterable: true, sortable: true },
          { name: 'buildingType', type: 'Edm.String', searchable: true },
          { name: 'floor', type: 'Edm.String', filterable: true },
          { name: 'constructionYear', type: 'Edm.String', filterable: true },
          { name: 'address', type: 'Edm.String', searchable: true },
      
          {
            name: 'contentVector',
            type: 'Collection(Edm.Single)',
            searchable: true,
            dimensions: 1536,         // ✅ vectorSearchDimensions → dimensions로 변경
            vectorSearchProfile: 'myHnswProfile'  // ✅ 연결할 프로필 이름
          }
        ],
        vectorSearch: {
          algorithms: [
            {
              name: 'myHnsw',
              kind: 'hnsw'
            }
          ],
          profiles: [
            {
              name: 'myHnswProfile',
              algorithm: 'myHnsw',
              vectorizer: null                    // ✅ dimensions는 제거
            }
          ]
        }
      };

    const response = await fetch(`${searchEndpoint}/indexes?api-version=2024-05-01-Preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': searchKey,
      },
      body: JSON.stringify(indexSchema),
    });

    if (response.status === 201) {
      console.log(`✅ 벡터 검색 인덱스 '${searchIndex}' 생성 완료!`);
      return true;
    } else if (response.status === 409) {
      console.log(`ℹ️ 인덱스 '${searchIndex}'가 이미 존재합니다.`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`❌ 인덱스 생성 실패: ${response.status} ${response.statusText}`);
      console.error('오류 내용:', errorText);
      
      // 벡터 검색이 실패하면 기본 인덱스 생성 시도
      console.log('벡터 검색이 지원되지 않습니다. 기본 인덱스를 생성합니다...');
      return await createBasicIndex();
    }
  } catch (error) {
    console.error('인덱스 생성 중 오류 발생:', error);
    console.log('기본 검색 인덱스를 생성합니다...');
    return await createBasicIndex();
  }
}

// 기본 인덱스 생성 (벡터 검색 없음)
async function createBasicIndex() {
  try {
    console.log('기본 검색 인덱스 생성 중...');
    
    const basicIndexSchema = {
      name: searchIndex,
      fields: [
        { name: 'id', type: 'Edm.String', key: true, searchable: false },
        { name: 'district', type: 'Edm.String', searchable: true, filterable: true, sortable: true, facetable: true },
        { name: 'buildingName', type: 'Edm.String', searchable: true },
        { name: 'area', type: 'Edm.Double', filterable: true, sortable: true, facetable: true },
        { name: 'price', type: 'Edm.Double', filterable: true, sortable: true, facetable: true },
        { name: 'contractDate', type: 'Edm.String', filterable: true, sortable: true },
        { name: 'buildingType', type: 'Edm.String', searchable: true, filterable: true, facetable: true },
        { name: 'floor', type: 'Edm.String', filterable: true },
        { name: 'constructionYear', type: 'Edm.String', filterable: true },
        { name: 'address', type: 'Edm.String', searchable: true }
      ]
    };

    const response = await fetch(`${searchEndpoint}/indexes?api-version=2023-11-01`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': searchKey,
      },
      body: JSON.stringify(basicIndexSchema),
    });

    if (response.status === 201) {
      console.log(`✅ 기본 인덱스 '${searchIndex}' 생성 완료! (벡터 검색 없음)`);
      return false;
    } else if (response.status === 409) {
      console.log(`ℹ️ 인덱스 '${searchIndex}'가 이미 존재합니다.`);
      return false;
    } else {
      const errorText = await response.text();
      console.error(`❌ 기본 인덱스 생성 실패: ${response.status} ${response.statusText}`);
      console.error('오류 내용:', errorText);
      return false;
    }
  } catch (error) {
    console.error('기본 인덱스 생성 중 오류 발생:', error);
    return false;
  }
}

// 데이터 업로드
async function uploadData() {
  try {
    console.log('데이터 업로드 중...');
    
    const jsonFilePath = path.join(__dirname, '../서울시 부동산 실거래가 정보_2025.json');
    
    if (!fs.existsSync(jsonFilePath)) {
      console.error('JSON 파일을 찾을 수 없습니다:', jsonFilePath);
      return;
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
    // JSON 구조 확인 및 데이터 추출
    let dataArray = [];
    if (jsonData.DATA && Array.isArray(jsonData.DATA)) {
      dataArray = jsonData.DATA;
      console.log(`✅ JSON 구조 확인: DATA 배열에서 ${dataArray.length}개 발견`);
    } else if (Array.isArray(jsonData)) {
      dataArray = jsonData;
      console.log(`✅ JSON 구조 확인: 루트 배열에서 ${dataArray.length}개 발견`);
    } else {
      console.error('❌ JSON 구조 오류: DATA 배열을 찾을 수 없습니다.');
      console.log('JSON 구조:', Object.keys(jsonData));
      return;
    }

    console.log(`총 ${dataArray.length}개의 데이터를 처리합니다.`);

    // 인덱스 정보 확인하여 벡터 검색 지원 여부 확인
    const indexInfo = await getIndexInfo();
    const supportsVectorSearch = indexInfo && indexInfo.vectorSearch;

    console.log(`벡터 검색 지원: ${supportsVectorSearch ? '예' : '아니오'}`);

    // 배치 크기 설정
    const batchSize = 100;
    let processedCount = 0;

    for (let i = 0; i < dataArray.length; i += batchSize) {
      const batch = dataArray.slice(i, i + batchSize);
      const documents = [];

      for (const item of batch) {
        try {
          // 실제 JSON 필드명에 맞게 수정
          const areaInPyeong = convertSquareMetersToPyeong(parseFloat(item.arch_area) || 0);
          const priceInBillion = convertWonToBillion(parseFloat(item.thing_amt) || 0);
          
          const document = {
            id: `${item.cgg_nm || 'unknown'}_${item.bldg_nm || 'unknown'}_${item.ctrt_day || 'unknown'}_${Math.random().toString(36).substr(2, 9)}`,
            district: item.cgg_nm || '',
            buildingName: item.bldg_nm || '',
            area: areaInPyeong,
            price: priceInBillion,
            contractDate: item.ctrt_day || '',
            buildingType: item.bldg_usg || '',
            floor: item.flr || '',
            constructionYear: item.arch_yr || '',
            address: `${item.cgg_nm || ''} ${item.stdg_nm || ''} ${item.bldg_nm || ''}`
          };

          // 벡터 검색이 지원되는 경우에만 벡터 추가
          if (supportsVectorSearch) {
            try {
              // 벡터 생성
              const searchText = `${item.cgg_nm || ''} ${item.stdg_nm || ''} ${item.bldg_nm || ''} ${item.bldg_usg || ''}`;
              const contentVector = await generateEmbedding(searchText);
              document.contentVector = contentVector;
            } catch (vectorError) {
              console.error(`벡터 생성 실패 (${item.cgg_nm}):`, vectorError);
              // 벡터 생성 실패 시 빈 벡터로 설정
              document.contentVector = new Array(1536).fill(0);
            }
          }

          documents.push(document);
        } catch (error) {
          console.error(`데이터 처리 중 오류 (${item.cgg_nm || 'unknown'}):`, error);
        }
      }

      if (documents.length > 0) {
        try {
          const response = await fetch(`${searchEndpoint}/indexes/${searchIndex}/docs/index?api-version=2023-11-01`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': searchKey,
            },
            body: JSON.stringify({ value: documents }),
          });

          if (response.ok) {
            processedCount += documents.length;
            console.log(`✅ 배치 ${Math.floor(i / batchSize) + 1} 업로드 완료: ${documents.length}개 (총 ${processedCount}/${dataArray.length})`);
          } else {
            const errorText = await response.text();
            console.error(`❌ 배치 ${Math.floor(i / batchSize) + 1} 업로드 실패: ${response.status} ${response.statusText}`);
            console.error('오류 내용:', errorText);
          }
        } catch (error) {
          console.error(`배치 ${Math.floor(i / batchSize) + 1} 업로드 중 오류:`, error);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 100)); // API 제한 회피
    }

    console.log(`🎉 데이터 업로드 완료! 총 ${processedCount}개 처리됨`);
    if (supportsVectorSearch) {
      console.log('✅ 벡터 검색이 활성화되어 있습니다.');
    } else {
      console.log('ℹ️ 기본 텍스트 검색만 사용 가능합니다.');
    }
  } catch (error) {
    console.error('데이터 업로드 중 오류 발생:', error);
  }
}

// 인덱스 정보 조회
async function getIndexInfo() {
  try {
    const response = await fetch(`${searchEndpoint}/indexes/${searchIndex}?api-version=2023-11-01`, {
      method: 'GET',
      headers: {
        'api-key': searchKey,
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('인덱스 정보 조회 실패:', error);
    return null;
  }
}

// 메인 실행
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'delete-index':
      await deleteSearchIndex();
      break;
    case 'create-index':
      await createSearchIndex();
      break;
    case 'upload-data':
      await uploadData();
      break;
    case 'check-index':
      const indexInfo = await getIndexInfo();
      if (indexInfo) {
        console.log('인덱스 정보:', JSON.stringify(indexInfo, null, 2));
      } else {
        console.log('인덱스를 찾을 수 없습니다.');
      }
      break;
    case 'reset':
      console.log('인덱스 초기화 중...');
      await deleteSearchIndex();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await createSearchIndex();
      break;
    default:
      console.log('사용법:');
      console.log('  node create-search-index.js delete-index  # 기존 인덱스 삭제');
      console.log('  node create-search-index.js create-index  # 인덱스 생성');
      console.log('  node create-search-index.js upload-data   # 데이터 업로드');
      console.log('  node create-search-index.js check-index   # 인덱스 정보 확인');
      console.log('  node create-search-index.js reset         # 인덱스 초기화 (삭제 후 재생성)');
      break;
  }
}

main().catch(console.error);
