# Jolboo Next.js 프로젝트

## 🏠 부동산 실거래가 정보 RAG 시스템

이 프로젝트는 Azure OpenAI와 Azure AI Search를 활용한 **벡터 검색 기반 RAG(Retrieval-Augmented Generation) 시스템**을 구현합니다.

## ✨ 주요 기능

- **AI 벡터 검색**: 의미적 유사도 기반 부동산 매물 검색
- **실시간 데이터**: 서울시 부동산 실거래가 정보 실시간 조회
- **스마트 매칭**: 지역, 면적, 가격 조건에 맞는 최적 매물 추천
- **유사도 점수**: 검색 결과의 정확도를 별점과 퍼센트로 표시

## 🚀 기술 스택

- **Frontend**: Next.js 13, React 18, TypeScript
- **UI**: Material-UI (MUI)
- **AI**: Azure OpenAI (GPT-4, Embeddings)
- **Search**: Azure AI Search (벡터 검색)
- **State Management**: Recoil

## 🔧 설치 및 설정

### 1. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Azure OpenAI 설정
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your_openai_api_key
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-ada-002

# Azure AI Search 설정
AZURE_SEARCH_ENDPOINT=https://your-service.search.windows.net
AZURE_SEARCH_KEY=your_search_key
AZURE_SEARCH_INDEX=real-estate-index
```

### 3. Azure 서비스 설정

#### Azure OpenAI 설정
1. Azure Portal에서 **Azure OpenAI** 리소스 생성
2. **모델 배포** 생성 (GPT-4 또는 GPT-35-Turbo)
3. **Embeddings 모델** 배포 (text-embedding-ada-002)
4. **엔드포인트**와 **API 키** 복사

#### Azure AI Search 설정
1. Azure Portal에서 **Azure AI Search** 리소스 생성
2. **검색 서비스** 생성 (Standard 또는 Premium 계층)
3. **관리 키** 복사
4. **엔드포인트 URL** 복사

### 4. 벡터 검색 인덱스 생성

```bash
# 1. 벡터 검색 인덱스 생성
node scripts/create-search-index.js create-index

# 2. 부동산 데이터 업로드 (벡터 포함)
node scripts/create-search-index.js upload-data
```

## 📊 데이터 구조

### 벡터 검색 인덱스 스키마

```typescript
{
  name: 'real-estate-index',
  fields: [
    // 기본 필드
    { name: 'id', type: 'Edm.String', key: true },
    { name: 'district', type: 'Edm.String', searchable: true, filterable: true },
    { name: 'buildingName', type: 'Edm.String', searchable: true },
    { name: 'area', type: 'Edm.Double', filterable: true, sortable: true },
    { name: 'price', type: 'Edm.Double', filterable: true, sortable: true },
    { name: 'contractDate', type: 'Edm.String', filterable: true },
    { name: 'buildingType', type: 'Edm.String', searchable: true, filterable: true },
    { name: 'floor', type: 'Edm.String', filterable: true },
    { name: 'constructionYear', type: 'Edm.String', filterable: true },
    { name: 'address', type: 'Edm.String', searchable: true },
    
    // 벡터 필드 (1536차원)
    { name: 'contentVector', type: 'Collection(Edm.Single)', dimensions: 1536 },
    { name: 'districtVector', type: 'Collection(Edm.Single)', dimensions: 1536 },
    { name: 'buildingNameVector', type: 'Collection(Edm.Single)', dimensions: 1536 }
  ],
  vectorSearch: {
    algorithmConfigurations: [
      {
        name: 'my-vector-config',
        kind: 'hnsw',
        parameters: {
          m: 4,
          efConstruction: 400,
          efSearch: 500,
          metric: 'cosine'
        }
      }
    ]
  }
}
```

## 🔍 벡터 검색 작동 원리

### 1. 쿼리 임베딩 생성
```typescript
// 검색 쿼리: "광진구 25평 아파트 8억원 이하"
const searchQuery = `${district} ${area}평 아파트 ${maxPrice}억원 이하`;
const queryVector = await generateEmbedding(searchQuery);
```

### 2. 벡터 유사도 검색
```typescript
const searchBody = {
  search: searchQuery,
  vectorQueries: [
    {
      vector: queryVector,
      fields: 'contentVector',
      k: 20,
      kind: 'vector'
    },
    {
      vector: queryVector,
      fields: 'districtVector',
      k: 20,
      kind: 'vector'
    }
  ],
  vectorFilter: `area ge ${area * 0.8} and area le ${area * 1.2} and price le ${maxPrice * 10000}`,
  semanticConfiguration: 'my-semantic-config'
};
```

### 3. 하이브리드 검색 결과
- **텍스트 검색**: 키워드 매칭
- **벡터 검색**: 의미적 유사도
- **필터링**: 면적, 가격 범위 제한
- **시맨틱 검색**: 컨텍스트 기반 재순위화

## 🎯 사용법

### 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

### API 엔드포인트 테스트

#### 1. OpenAI 연결 테스트
```bash
curl "http://localhost:3000/api/test-openai"
```

#### 2. Azure AI Search 테스트
```bash
curl "http://localhost:3000/api/test-search"
```

#### 3. 부동산 검색 API
```bash
curl -X POST "http://localhost:3000/api/real-estate-search" \
  -H "Content-Type: application/json" \
  -d '{
    "district": "광진구",
    "area": 25,
    "maxPrice": 8
  }'
```

## 🔧 문제 해결

### 일반적인 오류

#### 1. "Cannot find module 'react'"
```bash
# TypeScript 설정 확인
npx tsc --noEmit
```

#### 2. Azure OpenAI 404 오류
- **엔드포인트 형식**: `https://your-resource.openai.azure.com` (끝에 `/openai/deployments/...` 제거)
- **배포 이름**: Azure OpenAI에서 실제 배포된 모델 이름 사용
- **API 버전**: `2024-10-21` 사용

#### 3. 벡터 검색 결과 부정확
- **임베딩 모델**: `text-embedding-ada-002` 사용 확인
- **벡터 차원**: 1536차원 벡터 생성 확인
- **인덱스 재생성**: 데이터 업로드 후 인덱스 재생성

### 로그 확인

개발자 도구 콘솔에서 다음 로그들을 확인하세요:

```
=== 벡터 검색 시작 ===
검색 조건: { district: "광진구", area: 25, maxPrice: 8 }
검색 쿼리: 광진구 25평 아파트 8억원 이하
쿼리 벡터 생성 완료 (차원: 1536)
=== 벡터 검색 완료 ===
반환된 결과 수: 15
```

## 📈 성능 최적화

### 1. 배치 처리
- 데이터 업로드: 100개씩 배치 처리
- API 호출 제한: 100ms 지연

### 2. 벡터 검색 최적화
- **HNSW 알고리즘**: 빠른 근사 최근접 이웃 검색
- **코사인 유사도**: 벡터 간 각도 기반 유사도 계산
- **시맨틱 검색**: 컨텍스트 기반 결과 재순위화

### 3. 캐싱 전략
- 임베딩 벡터: 동일 쿼리 재사용
- 검색 결과: Redis 캐싱 고려

## 🚀 배포

### Vercel 배포
```bash
npm run build
vercel --prod
```

### 환경 변수 설정
배포 플랫폼에서 `.env.local`의 환경 변수들을 설정하세요.

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해주세요.

---

**💡 팁**: 벡터 검색을 통해 "광진구 근처"로 검색하면 강남구, 서초구 등 인접 지역의 매물도 찾을 수 있습니다!
