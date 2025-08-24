// Azure OpenAI REST API 직접 호출을 위한 타입 정의
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  max_tokens: number;
  temperature: number;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// 부동산 데이터 인터페이스
export interface RealEstateData {
  district: string;
  buildingName: string;
  area: number;
  price: number;
  contractDate: string;
  buildingType: string;
  floor: string;
  constructionYear: string;
  address: string;
  similarity?: number;
}

// Azure AI Search 결과 인터페이스
interface SearchResult {
  id: string;
  district?: string;
  buildingName?: string;
  area?: number;
  price?: number;
  contractDate?: string;
  buildingType?: string;
  floor?: string;
  constructionYear?: string;
  address?: string;
  metadata?: {
    district?: string;
    buildingName?: string;
    area?: number;
    price?: number;
    contractDate?: string;
    buildingType?: string;
    floor?: string;
    constructionYear?: string;
    address?: string;
  };
  content?: string;
  '@search.score'?: number;
}

// 벡터 검색 결과 인터페이스
interface VectorSearchResult {
  id: string;
  district: string;
  buildingName: string;
  area: number;
  price: number;
  contractDate: string;
  buildingType: string;
  floor: string;
  constructionYear: string;
  address: string;
  '@search.score': number;
  '@search.rerankerScore'?: number;
}

export class RAGSystem {
  private openaiEndpoint: string;
  private openaiApiKey: string;
  private openaiDeploymentName: string;
  private searchEndpoint: string;
  private searchKey: string;
  private searchIndex: string;

  constructor() {
    this.openaiEndpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
    this.openaiApiKey = process.env.AZURE_OPENAI_API_KEY || '';
    this.openaiDeploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || '';
    this.searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT || '';
    this.searchKey = process.env.AZURE_SEARCH_KEY || '';
    this.searchIndex = process.env.AZURE_SEARCH_INDEX || 'real-estate-index';
  }

  // Azure OpenAI REST API 직접 호출
  private async callOpenAI(messages: ChatMessage[], maxTokens: number = 1000, temperature: number = 0.1): Promise<string> {
    try {
      const requestBody: ChatCompletionRequest = {
        messages,
        max_tokens: maxTokens,
        temperature
      };

      const response = await fetch(
        `${this.openaiEndpoint}/openai/deployments/${this.openaiDeploymentName}/chat/completions?api-version=2024-04-01-preview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.openaiApiKey,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Azure OpenAI API 오류: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result: ChatCompletionResponse = await response.json();
      return result.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Azure OpenAI API 호출 실패:', error);
      throw error;
    }
  }

  // 벡터 검색을 위한 임베딩 생성 (REST API 직접 호출)
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const embeddingDeployment = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || 'text-embedding-ada-002';

      const response = await fetch(
        `${this.openaiEndpoint}/openai/deployments/${embeddingDeployment}/embeddings?api-version=2024-04-01-preview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.openaiApiKey,
          },
          body: JSON.stringify({
            input: text,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Embedding API 오류: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      return result.data[0].embedding;
    } catch (error) {
      console.error('Embedding 생성 실패:', error);
      // 오류 발생 시 빈 벡터 반환 (1536차원)
      return new Array(1536).fill(0);
    }
  }

  // 인덱스 정보 확인하여 벡터 검색 지원 여부 확인
  private async checkVectorSearchSupport(): Promise<boolean> {
    try {
      const response = await fetch(`${this.searchEndpoint}/indexes/${this.searchIndex}?api-version=2024-05-01-Preview`, {
        method: 'GET',
        headers: {
          'api-key': this.searchKey,
        },
      });

      if (response.ok) {
        const indexInfo = await response.json();
        // vectorSearch 객체가 있고, 그 안에 algorithms나 profiles 같은 정보가 있는지 확인
        return !!(indexInfo.vectorSearch && indexInfo.vectorSearch.algorithms && indexInfo.vectorSearch.profiles);
      }
      return false;
    } catch (error) {
      console.error('인덱스 정보 확인 실패:', error);
      return false;
    }
}

  // 벡터 검색으로 관련 데이터 검색
  private async searchRelevantData(
    district: string,
    area: number,
    maxPrice: number
  ): Promise<VectorSearchResult[]> {
    try {
      console.log('=== 검색 시작 ===');
      console.log('검색 조건:', { district, area, maxPrice });

      // 벡터 검색 지원 여부 확인
      const supportsVectorSearch = await this.checkVectorSearchSupport();
      console.log('벡터 검색 지원:', supportsVectorSearch ? '예' : '아니오');

      if (supportsVectorSearch) {
        // 벡터 검색 수행
        return await this.performVectorSearch(district, area, maxPrice);
      } else {
        // 기본 텍스트 검색 수행
        console.log('벡터 검색이 지원되지 않습니다. 기본 텍스트 검색을 사용합니다.');
        return await this.performTextSearch(district, area, maxPrice);
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      throw error;
    }
  }

  // 벡터 검색 수행
  private async performVectorSearch(
    district: string,
    area: number,
    maxPrice: number
  ): Promise<VectorSearchResult[]> {
    try {
      // 검색 쿼리 텍스트 생성
      const searchQuery = `${district} ${area}평 아파트 ${maxPrice}억원 이하`;
      // console.log('검색 쿼리:', searchQuery);

      // 검색 쿼리의 임베딩 생성
      const queryVector = await this.generateEmbedding(searchQuery);
      console.log('쿼리 벡터 생성 완료 (차원:', queryVector.length, ')');

      // Azure AI Search 벡터 검색 API 호출 (단순화된 스키마)
      const searchBody = {
        search: searchQuery,
        select: 'id,district,buildingName,area,price,contractDate,buildingType,floor,constructionYear,address',
        top: 20,
        orderby: 'price desc',
        vectorQueries: [
          {
            vector: queryVector,
            fields: 'contentVector',
            k: 20,
            kind: 'vector'
          }
        ],
        filter: `area ge ${area * 0.8} and area le ${area * 1.2} and price le ${maxPrice}`
      };

      // console.log('검색 요청 본문:', JSON.stringify(searchBody, null, 2));

      const response = await fetch(
        `${this.searchEndpoint}/indexes/${this.searchIndex}/docs/search?api-version=2024-05-01-Preview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.searchKey,
          },
          body: JSON.stringify(searchBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Azure AI Search 벡터 검색 오류:', response.status, response.statusText);
        console.error('오류 내용:', errorText);
        throw new Error(`Azure AI Search 벡터 검색 오류: ${response.status} ${response.statusText}`);
      }

      const searchResults = await response.json();
      console.log('벡터 검색 결과 수:', searchResults.value?.length || 0);

      // 검색 결과를 VectorSearchResult로 변환
      const results: VectorSearchResult[] = (searchResults.value || []).map((result: any) => ({
        id: result.id,
        district: result.district || '',
        buildingName: result.buildingName || '',
        area: result.area || 0,
        price: result.price || 0,
        contractDate: result.contractDate || '',
        buildingType: result.buildingType || '',
        floor: result.floor || '',
        constructionYear: result.constructionYear || '',
        address: result.address || '',
        '@search.score': result['@search.score'] || 0,
        '@search.rerankerScore': result['@search.rerankerScore']
      }));

      // 검색 점수로 정렬
      results.sort((a, b) => (b['@search.score'] || 0) - (a['@search.score'] || 0));

      console.log('=== 벡터 검색 완료 ===');
      console.log('반환된 결과 수:', results.length);
      
      return results;
    } catch (error) {
      console.error('벡터 검색 중 오류 발생:', error);
      throw error;
    }
  }

  // 기본 텍스트 검색 수행
  private async performTextSearch(
    district: string,
    area: number,
    maxPrice: number
  ): Promise<VectorSearchResult[]> {
    try {
      console.log('=== 기본 텍스트 검색 시작 ===');
      
      // 검색 쿼리 구성
      const searchQuery = `${district}`;
      const searchBody = {
        search: searchQuery,
        select: 'id,district,buildingName,area,price,contractDate,buildingType,floor,constructionYear,address',
        top: 20,
        orderby: 'price desc',
        filter: `area ge ${area * 0.8} and area le ${area * 1.2} and price le ${maxPrice}`
      };

      // console.log('텍스트 검색 요청 본문:', JSON.stringify(searchBody, null, 2));

      const response = await fetch(
        `${this.searchEndpoint}/indexes/${this.searchIndex}/docs/search?api-version=2024-05-01-Preview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.searchKey,
          },
          body: JSON.stringify(searchBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Azure AI Search 텍스트 검색 오류:', response.status, response.statusText);
        console.error('오류 내용:', errorText);
        throw new Error(`Azure AI Search 텍스트 검색 오류: ${response.status} ${response.statusText}`);
      }

      const searchResults = await response.json();
      console.log('텍스트 검색 결과 수:', searchResults.value?.length || 0);

      // 검색 결과를 VectorSearchResult로 변환
      const results: VectorSearchResult[] = (searchResults.value || []).map((result: any) => ({
        id: result.id,
        district: result.district || '',
        buildingName: result.buildingName || '',
        area: result.area || 0,
        price: result.price || 0,
        contractDate: result.contractDate || '',
        buildingType: result.buildingType || '',
        floor: result.floor || '',
        constructionYear: result.constructionYear || '',
        address: result.address || '',
        '@search.score': result['@search.score'] || 0,
        '@search.rerankerScore': result['@search.rerankerScore']
      }));

      // 검색 점수로 정렬
      results.sort((a, b) => (b['@search.score'] || 0) - (a['@search.score'] || 0));

      console.log('=== 텍스트 검색 완료 ===');
      console.log('반환된 결과 수:', results.length);
      
      return results;
    } catch (error) {
      console.error('텍스트 검색 중 오류 발생:', error);
      throw error;
    }
  }

  // RAG 시스템으로 부동산 데이터 생성
  async generateRealEstateData(
    district: string,
    area: number,
    maxPrice: number
  ): Promise<RealEstateData[]> {
    try {
      console.log(`RAG 시스템으로 부동산 데이터 생성 시작: ${district}, ${area}평, ${maxPrice}억원`);

      // 1. Azure AI Search에서 관련 데이터 검색
      const searchResults = await this.searchRelevantData(district, area, maxPrice);
      
      if (!searchResults || searchResults.length === 0) {
        throw new Error(`검색 결과가 없습니다. ${district} 지역에서 ${area}평, ${maxPrice}억원 이하의 매물을 찾을 수 없습니다.`);
      }

      console.log(`검색 결과 ${searchResults.length}건 발견`);

      // 2. 검색 결과를 OpenAI에 전달하여 구조화된 데이터 생성
      const context = this.createSearchContext(searchResults, district, area, maxPrice);
      const prompt = this.createRealEstatePrompt(district, area, maxPrice);
      
      console.log('OpenAI API 호출 중...');
      
      const content = await this.callOpenAIWithContext(context, prompt);
      
      if (!content) {
        throw new Error('OpenAI API 응답이 비어있습니다.');
      }

      try {
        // AI 응답에서 마크다운 코드 블록 제거
        let cleanedContent = content.trim();
        if (cleanedContent.startsWith('```json')) {
          cleanedContent = cleanedContent.replace(/^```json\s*/, '');
        }
        if (cleanedContent.startsWith('```')) {
          cleanedContent = cleanedContent.replace(/^```\s*/, '');
        }
        if (cleanedContent.endsWith('```')) {
          cleanedContent = cleanedContent.replace(/\s*```$/, '');
        }
        console.log('정리된 AI 응답:', cleanedContent);

        const data = JSON.parse(cleanedContent);
        if (Array.isArray(data) && data.length > 0) {
          // 검색 점수 정보 추가
          return data.map((item, index) => ({
            ...item,
            similarity: searchResults[index]?.['@search.score'] || 0
          }));
        } else {
          throw new Error('OpenAI 응답이 올바르지 않습니다. 배열 형태의 데이터가 필요합니다.');
        }
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        console.log('AI 원본 응답:', content);
        throw new Error(`AI 응답 파싱 실패: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('RAG 시스템 오류:', error);
      throw error;
    }
  }

  // RAG 시스템으로 실거래가 추세 분석 생성
  async generateTrendAnalysis(
    district: string,
    area: number,
    maxPrice: number
  ): Promise<any> {
    try {
      console.log(`RAG 시스템으로 추세 분석 시작: ${district}, ${area}평, ${maxPrice}억원`);

      // 1. Azure AI Search에서 해당 지역의 모든 데이터 검색 (가격 제한 없음)
      const searchResults = await this.searchRelevantDataForTrend(district, area);
      
      if (!searchResults || searchResults.length === 0) {
        throw new Error(`추세 분석을 위한 데이터가 없습니다. ${district} 지역에서 ${area}평 매물을 찾을 수 없습니다.`);
      }

      console.log(`추세 분석용 데이터 ${searchResults.length}건 발견`);

      // 2. 검색 결과를 OpenAI에 전달하여 추세 분석 데이터 생성
      const context = this.createTrendAnalysisContext(searchResults, district, area);
      const prompt = this.createTrendAnalysisPrompt(district, area);
      
      console.log('OpenAI 추세 분석 API 호출 중...');
      
      const content = await this.callOpenAIForTrendAnalysis(context, prompt);
      
      if (!content) {
        throw new Error('OpenAI API 응답이 비어있습니다.');
      }

      try {
        // AI 응답에서 마크다운 코드 블록 제거
        let cleanedContent = content.trim();
        if (cleanedContent.startsWith('```json')) {
          cleanedContent = cleanedContent.replace(/^```json\s*/, '');
        }
        if (cleanedContent.startsWith('```')) {
          cleanedContent = cleanedContent.replace(/^```\s*/, '');
        }
        if (cleanedContent.endsWith('```')) {
          cleanedContent = cleanedContent.replace(/\s*```$/, '');
        }
        console.log('정리된 AI 추세 분석 응답:', cleanedContent);

        const data = JSON.parse(cleanedContent);
        return data;
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        console.log('AI 원본 응답:', content);
        throw new Error(`AI 응답 파싱 실패: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('RAG 시스템 추세 분석 오류:', error);
      throw error;
    }
  }

  // Azure AI Search 설정 확인
  isConfigured(): boolean {
    return !!(this.searchEndpoint && this.searchKey && this.searchIndex);
  }

  // 검색 결과를 컨텍스트로 구성하는 메서드
  private createSearchContext(searchResults: VectorSearchResult[], district: string, area: number, maxPrice: number): string {
    return searchResults
      .map(result => {
        return `
          지역: ${result.district}
          건물명: ${result.buildingName}
          면적: ${result.area}평
          가격: ${result.price}억원
          계약일: ${result.contractDate}
          건물용도: ${result.buildingType}
          층수: ${result.floor}
          건축년도: ${result.constructionYear}
          주소: ${result.address}
          검색점수: ${result['@search.score']}
        `;
      })
      .join('\n');
  }

  // 부동산 데이터 생성을 위한 프롬프트 생성
  private createRealEstatePrompt(district: string, area: number, maxPrice: number): string {
    return `
      다음은 서울시 ${district}의 ${area}평 크기 아파트 실거래가 데이터입니다:
      
      위 데이터를 바탕으로 ${maxPrice}억원 이하의 최근 실거래가 정보를 정리해주세요.
      
      중요: 마크다운이나 코드 블록 없이 순수 JSON 배열만 응답해주세요.
      다음 형식으로만 응답해주세요:
      [
        {
          "district": "구 이름",
          "buildingName": "건물명",
          "area": 면적(평),
          "price": 가격(억원),
          "contractDate": "계약일",
          "buildingType": "건물용도",
          "floor": 층수,
          "constructionYear": "건축년도",
          "address": "주소"
        }
      ]
    `;
  }

  // OpenAI API 호출 메서드 (컨텍스트와 프롬프트를 받아서 처리)
  private async callOpenAIWithContext(context: string, prompt: string): Promise<string> {
    const fullPrompt = `${context}\n\n${prompt}`;
    
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant that provides real estate information. Always respond with pure JSON arrays only, no markdown formatting, no code blocks, no explanations. Just the JSON data.'
      },
      {
        role: 'user',
        content: fullPrompt,
      },
    ];

    return await this.callOpenAI(messages, 1000, 0.1);
  }

  // 추세 분석을 위한 OpenAI API 호출 메서드
  private async callOpenAIForTrendAnalysis(context: string, prompt: string): Promise<string> {
    const fullPrompt = `${context}\n\n${prompt}`;
    
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a professional real estate market analyst with expertise in trend analysis and market forecasting. Analyze the provided real estate transaction data thoroughly and provide concrete, data-driven insights. Calculate all numerical values from the actual data provided. Always respond with pure JSON format only, no markdown formatting, no code blocks, no explanations. Ensure your analysis is specific, actionable, and based on the actual data patterns you observe.'
      },
      {
        role: 'user',
        content: fullPrompt,
      },
    ];

    return await this.callOpenAI(messages, 1500, 0.1); // 더 긴 응답과 낮은 온도
  }

  // 추세 분석을 위한 데이터 검색 (가격 제한 없음)
  private async searchRelevantDataForTrend(
    district: string,
    area: number
  ): Promise<VectorSearchResult[]> {
    try {
      console.log('=== 추세 분석용 데이터 검색 시작 ===');
      console.log('검색 조건:', { district, area });

      // 벡터 검색 지원 여부 확인
      const supportsVectorSearch = await this.checkVectorSearchSupport();
      console.log('벡터 검색 지원:', supportsVectorSearch ? '예' : '아니오');

      if (supportsVectorSearch) {
        // 벡터 검색 수행 (가격 제한 없음)
        return await this.performVectorSearchForTrend(district, area);
      } else {
        // 기본 텍스트 검색 수행 (가격 제한 없음)
        console.log('벡터 검색이 지원되지 않습니다. 기본 텍스트 검색을 사용합니다.');
        return await this.performTextSearchForTrend(district, area);
      }
    } catch (error) {
      console.error('추세 분석용 데이터 검색 중 오류 발생:', error);
      throw error;
    }
  }

  // 추세 분석용 벡터 검색 수행 (가격 제한 없음)
  private async performVectorSearchForTrend(
    district: string,
    area: number
  ): Promise<VectorSearchResult[]> {
    try {
      // 검색 쿼리 텍스트 생성
      const searchQuery = `${district} ${area}평 아파트`;
      console.log('추세 분석 검색 쿼리:', searchQuery);

      // 검색 쿼리의 임베딩 생성
      const queryVector = await this.generateEmbedding(searchQuery);
      console.log('쿼리 벡터 생성 완료 (차원:', queryVector.length, ')');

      // Azure AI Search 벡터 검색 API 호출 (가격 제한 없음)
      const searchBody = {
        search: searchQuery,
        select: 'id,district,buildingName,area,price,contractDate,buildingType,floor,constructionYear,address',
        top: 100, // 더 많은 데이터 수집
        orderby: 'contractDate asc', // 과거부터 최신순
        vectorQueries: [
          {
            vector: queryVector,
            fields: 'contentVector',
            k: 100,
            kind: 'vector'
          }
        ],
        filter: `area ge ${area * 0.8} and area le ${area * 1.2}` // 면적만 필터링
      };

      console.log('추세 분석 검색 요청 본문:', JSON.stringify(searchBody, null, 2));

      const response = await fetch(
        `${this.searchEndpoint}/indexes/${this.searchIndex}/docs/search?api-version=2024-05-01-Preview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.searchKey,
          },
          body: JSON.stringify(searchBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Azure AI Search 벡터 검색 오류:', response.status, response.statusText);
        console.error('오류 내용:', errorText);
        throw new Error(`Azure AI Search 벡터 검색 오류: ${response.status} ${response.statusText}`);
      }

      const searchResults = await response.json();
      console.log('추세 분석 벡터 검색 결과 수:', searchResults.value?.length || 0);

      // 검색 결과를 VectorSearchResult로 변환
      const results: VectorSearchResult[] = (searchResults.value || []).map((result: any) => ({
        id: result.id,
        district: result.district || '',
        buildingName: result.buildingName || '',
        area: result.area || 0,
        price: result.price || 0,
        contractDate: result.contractDate || '',
        buildingType: result.buildingType || '',
        floor: result.floor || '',
        constructionYear: result.constructionYear || '',
        address: result.address || '',
        '@search.score': result['@search.score'] || 0,
        '@search.rerankerScore': result['@search.rerankerScore']
      }));

      // 계약일 기준으로 정렬 (과거순)
      results.sort((a, b) => new Date(a.contractDate).getTime() - new Date(b.contractDate).getTime());

      console.log('=== 추세 분석용 벡터 검색 완료 ===');
      console.log('반환된 결과 수:', results.length);
      
      return results;
    } catch (error) {
      console.error('추세 분석용 벡터 검색 중 오류 발생:', error);
      throw error;
    }
  }

  // 추세 분석용 텍스트 검색 수행 (가격 제한 없음)
  private async performTextSearchForTrend(
    district: string,
    area: number
  ): Promise<VectorSearchResult[]> {
    try {
      console.log('=== 추세 분석용 기본 텍스트 검색 시작 ===');
      
      // 검색 쿼리 구성
      const searchQuery = `${district}`;
      const searchBody = {
        search: searchQuery,
        select: 'id,district,buildingName,area,price,contractDate,buildingType,floor,constructionYear,address',
        top: 100, // 더 많은 데이터 수집
        orderby: 'contractDate asc', // 과거부터 최신순
        filter: `area ge ${area * 0.8} and area le ${area * 1.2}` // 면적만 필터링
      };

      console.log('추세 분석용 텍스트 검색 요청 본문:', JSON.stringify(searchBody, null, 2));

      const response = await fetch(
        `${this.searchEndpoint}/indexes/${this.searchIndex}/docs/search?api-version=2024-05-01-Preview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.searchKey,
          },
          body: JSON.stringify(searchBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Azure AI Search 텍스트 검색 오류:', response.status, response.statusText);
        console.error('오류 내용:', errorText);
        throw new Error(`Azure AI Search 텍스트 검색 오류: ${response.status} ${response.statusText}`);
      }

      const searchResults = await response.json();
      console.log('추세 분석용 텍스트 검색 결과 수:', searchResults.value?.length || 0);

      // 검색 결과를 VectorSearchResult로 변환
      const results: VectorSearchResult[] = (searchResults.value || []).map((result: any) => ({
        id: result.id,
        district: result.district || '',
        buildingName: result.buildingName || '',
        area: result.area || 0,
        price: result.price || 0,
        contractDate: result.contractDate || '',
        buildingType: result.buildingType || '',
        floor: result.floor || '',
        constructionYear: result.constructionYear || '',
        address: result.address || '',
        '@search.score': result['@search.score'] || 0,
        '@search.rerankerScore': result['@search.rerankerScore']
      }));

      // 계약일 기준으로 정렬 (과거순)
      results.sort((a, b) => new Date(a.contractDate).getTime() - new Date(b.contractDate).getTime());

      console.log('=== 추세 분석용 텍스트 검색 완료 ===');
      console.log('반환된 결과 수:', results.length);
      
      return results;
    } catch (error) {
      console.error('추세 분석용 텍스트 검색 중 오류 발생:', error);
      throw error;
    }
  }

  // 추세 분석용 컨텍스트 생성
  private createTrendAnalysisContext(searchResults: VectorSearchResult[], district: string, area: number): string {
    const recentResults = searchResults.slice(0, 50); // 최근 50건만 사용
    
    const contextData = recentResults.map((result, index) => {
      const contractDate = new Date(result.contractDate);
      const month = contractDate.getMonth() + 1;
      const year = contractDate.getFullYear();
      
      return `${index + 1}. ${result.buildingName} (${result.address})
         - 계약일: ${year}년 ${month}월
         - 가격: ${result.price}억원
         - 면적: ${result.area}평
         - 층수: ${result.floor}층
         - 건축년도: ${result.constructionYear}년`;
    }).join('\n\n');

    return `다음은 ${district} 지역의 ${area}평 아파트 실거래가 데이터입니다:

${contextData}

이 데이터를 바탕으로 월별 가격 추세, 평균가 변화, 시장 동향을 분석해주세요.`;
  }

  // 추세 분석용 프롬프트 생성
  private createTrendAnalysisPrompt(district: string, area: number): string {
    return `당신은 부동산 시장 분석 전문가입니다. ${district} 지역의 ${area}평 아파트 실거래가 데이터를 분석하여 다음 정보를 제공해주세요:

중요: 제공된 데이터는 2025년 실거래가 정보입니다. 계약일(ctrt_day)에서 연도를 정확히 파악하여 분석해주세요.

1. 월별 평균 실거래가 (최근 6개월)
2. 가격 변화율 및 추세 (상승/하락/안정)
3. 거래량 분석
4. 시장 동향 및 전망

위의 실제 데이터를 바탕으로 구체적인 분석을 수행하고, 다음 JSON 형식으로 응답해주세요:

{
  "trendData": [
    {
      "month": "2025-08",
      "averagePrice": 8.2,
      "transactionCount": 15,
      "priceChange": 2.1
    }
  ],
  "currentStats": {
    "currentAverage": 9.6,
    "priceChange": 3.2,
    "trend": "up",
    "totalTransactions": 127
  },
  "marketAnalysis": {
    "currentSituation": "${district} 지역 ${area}평 아파트 시장의 현재 상황을 구체적으로 분석한 내용",
    "investmentConsiderations": "실제 데이터를 바탕으로 한 구체적인 투자 고려사항",
    "futureOutlook": "데이터 분석을 통한 향후 전망 및 예측"
  }
}

중요사항:
- 가격은 억원 단위, 변화율은 퍼센트 단위로 표시
- trend는 "up", "down", "stable" 중 하나로 설정
- 모든 수치는 실제 데이터 분석을 통해 계산된 값이어야 함
- month는 "2025-XX" 형식으로 표시 (2025년 데이터임을 명시)
- marketAnalysis의 내용은 구체적이고 실용적이어야 함
- 예시 텍스트가 아닌 실제 분석 결과를 제공`;
  }
}

// 모의 부동산 데이터 생성 (fallback)
export function getMockRealEstateData(
  district: string,
  area: number,
  maxPrice: number
): RealEstateData[] {
  const mockData: RealEstateData[] = [
    {
      district: district,
      buildingName: `${district} 아파트`,
      area: area,
      price: Math.min(maxPrice * 0.8, 8),
      contractDate: '2024-12-01',
      buildingType: '아파트',
      floor: '15층',
      constructionYear: '2015',
      address: `${district} 중앙로 123`,
      similarity: 0.95
    },
    {
      district: district,
      buildingName: `${district} 푸르지오`,
      area: area,
      price: Math.min(maxPrice * 0.9, 9),
      contractDate: '2024-11-15',
      buildingType: '아파트',
      floor: '8층',
      constructionYear: '2018',
      address: `${district} 대로 456`,
      similarity: 0.92
    },
    {
      district: district,
      buildingName: `${district} 힐스테이트`,
      area: area,
      price: Math.min(maxPrice * 0.7, 7),
      contractDate: '2024-10-20',
      buildingType: '아파트',
      floor: '12층',
      constructionYear: '2012',
      address: `${district} 길 789`,
      similarity: 0.88
    }
  ];

  return mockData;
}
