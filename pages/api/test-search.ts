import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
    const searchKey = process.env.AZURE_SEARCH_KEY;
    const searchIndex = process.env.AZURE_SEARCH_INDEX || 'real-estate-index';

    if (!searchEndpoint || !searchKey) {
      return res.status(400).json({
        success: false,
        error: "Azure Search 환경변수가 설정되지 않았습니다.",
        required: ["AZURE_SEARCH_ENDPOINT", "AZURE_SEARCH_KEY"]
      });
    }

    console.log("=== Azure AI Search 연결 테스트 ===");
    console.log("Search Endpoint:", searchEndpoint);
    console.log("Search Index:", searchIndex);
    console.log("=====================================");

    // 1. 인덱스 정보 조회 (API 버전 2023-11-01)
    console.log("1. 인덱스 정보 조회 중...");
    const indexResponse = await fetch(
      `${searchEndpoint}/indexes/${searchIndex}?api-version=2023-11-01`,
      {
        method: "GET",
        headers: {
          "api-key": searchKey,
        },
      }
    );

    let indexInfo = null;
    let vectorSearchSupported = false;
    
    if (indexResponse.ok) {
      indexInfo = await indexResponse.json();
      vectorSearchSupported = !!(indexInfo.vectorSearch && indexInfo.vectorSearch.algorithmConfigurations);
      console.log("✅ 인덱스 정보 조회 성공");
      console.log("벡터 검색 지원:", vectorSearchSupported ? "예" : "아니오");
    } else {
      console.log("❌ 인덱스 정보 조회 실패:", indexResponse.status, indexResponse.statusText);
    }

    // 2. 간단한 검색 테스트
    console.log("2. 검색 테스트 중...");
    const searchBody = {
      search: "district:광진구",
      select: "district,buildingName,area,price",
      top: 5,
    };

    const searchResponse = await fetch(
      `${searchEndpoint}/indexes/${searchIndex}/docs/search?api-version=2023-11-01`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": searchKey,
        },
        body: JSON.stringify(searchBody),
      }
    );

    let searchResults = [];
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      searchResults = searchData.value || [];
      console.log("✅ 검색 테스트 성공");
      console.log("검색 결과 수:", searchResults.length);
    } else {
      console.log("❌ 검색 테스트 실패:", searchResponse.status, searchResponse.statusText);
    }

    // 3. 문서 수 확인
    console.log("3. 문서 수 확인 중...");
    const countResponse = await fetch(
      `${searchEndpoint}/indexes/${searchIndex}/docs/$count?api-version=2023-11-01`,
      {
        method: "GET",
        headers: {
          "api-key": searchKey,
        },
      }
    );

    let totalDocs: string = '0';
    if (countResponse.ok) {
      totalDocs = await countResponse.text();
      console.log("✅ 문서 수 확인 성공");
    } else {
      console.log("❌ 문서 수 확인 실패:", countResponse.status, countResponse.statusText);
    }

    // 4. 벡터 검색 테스트 (지원되는 경우)
    let vectorSearchResults = [];
    if (vectorSearchSupported) {
      console.log("4. 벡터 검색 테스트 중...");
      try {
        const vectorSearchBody = {
          search: "광진구",
          select: "district,buildingName,area,price",
          top: 5,
          vectorQueries: [
            {
              vector: new Array(1536).fill(0.1), // 테스트용 벡터
              fields: "contentVector",
              k: 5,
              kind: "vector"
            }
          ]
        };

        const vectorResponse = await fetch(
          `${searchEndpoint}/indexes/${searchIndex}/docs/search?api-version=2023-07-01-Preview`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": searchKey,
            },
            body: JSON.stringify(vectorSearchBody),
          }
        );

        if (vectorResponse.ok) {
          const vectorData = await vectorResponse.json();
          vectorSearchResults = vectorData.value || [];
          console.log("✅ 벡터 검색 테스트 성공");
          console.log("벡터 검색 결과 수:", vectorSearchResults.length);
        } else {
          console.log("❌ 벡터 검색 테스트 실패:", vectorResponse.status, vectorResponse.statusText);
        }
      } catch (error) {
        console.log("❌ 벡터 검색 테스트 중 오류:", error);
      }
    }

    // 5. 응답 구성
    const response = {
      success: true,
      message: "Azure AI Search 연결 테스트 완료",
      searchEndpoint,
      searchIndex,
      indexInfo: {
        name: indexInfo?.name,
        fields: indexInfo?.fields?.length || 0,
        vectorSearch: vectorSearchSupported,
        vectorSearchConfig: indexInfo?.vectorSearch || null
      },
      searchTest: {
        success: searchResponse.ok,
        resultsCount: searchResults.length,
        sampleResults: searchResults.slice(0, 3)
      },
      totalDocuments: totalDocs,
      vectorSearchTest: vectorSearchSupported ? {
        success: vectorSearchResults.length > 0,
        resultsCount: vectorSearchResults.length,
        sampleResults: vectorSearchResults.slice(0, 3)
      } : null,
      recommendations: [] as string[]
    };

    // 권장사항 추가
    if (!indexInfo) {
      response.recommendations.push("인덱스를 생성해야 합니다: node scripts/create-search-index.js create-index");
    }
    
    if (searchResults.length === 0) {
      response.recommendations.push("데이터를 업로드해야 합니다: node scripts/create-search-index.js upload-data");
    }
    
    if (!vectorSearchSupported) {
      response.recommendations.push("벡터 검색을 위해 API 버전 2023-07-01-Preview 사용을 고려하세요");
    }

    console.log("=== 테스트 완료 ===");
    res.status(200).json(response);

  } catch (err) {
    console.error("Azure AI Search 테스트 실패:", err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
      message: "Azure AI Search 연결 테스트 중 오류가 발생했습니다."
    });
  }
}
