import OpenAI from 'openai';

// OpenAI 클라이언트 설정 (Azure OpenAI 엔드포인트 사용)
const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY || '',
  baseURL: process.env.AZURE_OPENAI_ENDPOINT || '',
  defaultQuery: { 'api-version': '2024-04-01-preview' },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY || '' },
});

export interface RealEstateData {
  district: string;
  buildingName: string;
  area: number;
  price: number;
  contractDate: string;
  buildingType: string;
  floor: number;
  constructionYear: number;
}

export async function searchRealEstateData(
  district: string,
  area: number,
  maxPrice: number
): Promise<RealEstateData[]> {
  try {
    const prompt = `
    서울시 ${district}에서 ${area}평(약 ${(area * 3.3058).toFixed(1)}㎡) 크기의 아파트 중 
    ${maxPrice}억원 이하의 최근 실거래가 정보를 찾아주세요.
    
    다음 형식으로 JSON 배열로 응답해주세요:
    [
      {
        "district": "구 이름",
        "buildingName": "건물명",
        "area": 면적(평),
        "price": 가격(억원),
        "contractDate": "계약일",
        "buildingType": "건물용도",
        "floor": 층수,
        "constructionYear": 건축년도
      }
    ]
    
    실제 데이터가 없다면 빈 배열 []을 반환해주세요.
    `;

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-35-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return [];
    }

    try {
      const data = JSON.parse(content);
      return Array.isArray(data) ? data : [];
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      return [];
    }
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    return [];
  }
}

// 모의 데이터 (OpenAI API가 설정되지 않은 경우 사용)
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
      price: Math.floor(maxPrice * 0.8 * 10) / 10,
      contractDate: "2025-01-15",
      buildingType: "아파트",
      floor: Math.floor(Math.random() * 20) + 1,
      constructionYear: 2010 + Math.floor(Math.random() * 15),
    },
    {
      district: district,
      buildingName: `${district} 신축아파트`,
      area: area,
      price: Math.floor(maxPrice * 0.9 * 10) / 10,
      contractDate: "2025-01-10",
      buildingType: "아파트",
      floor: Math.floor(Math.random() * 25) + 1,
      constructionYear: 2015 + Math.floor(Math.random() * 10),
    },
  ];

  return mockData.filter(item => item.price <= maxPrice);
}
