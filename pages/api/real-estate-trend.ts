import { NextApiRequest, NextApiResponse } from 'next';
import { RAGSystem } from '../../lib/rag-system';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { district, area, maxPrice } = req.query;

    if (!district || !area || !maxPrice) {
      return res.status(400).json({
        message: 'district, area, maxPrice 파라미터가 필요합니다.'
      });
    }

    const districtStr = district as string;
    const areaNum = parseFloat(area as string);
    const maxPriceNum = parseFloat(maxPrice as string);

    if (isNaN(areaNum) || isNaN(maxPriceNum)) {
      return res.status(400).json({
        message: 'area와 maxPrice는 숫자여야 합니다.'
      });
    }

    // RAG 시스템 초기화
    const ragSystem = new RAGSystem();

    // Azure AI Search가 설정되어 있는지 확인
    const hasRAGConfig = ragSystem.isConfigured();

    if (!hasRAGConfig) {
      return res.status(500).json({
        success: false,
        message: 'Azure AI Search가 설정되지 않았습니다. 환경 변수를 확인해주세요.',
        error: 'AZURE_SEARCH_ENDPOINT, AZURE_SEARCH_KEY, AZURE_SEARCH_INDEX가 필요합니다.'
      });
    }

    try {
      // RAG 시스템을 통한 추세 분석 데이터 생성
      const trendData = await ragSystem.generateTrendAnalysis(districtStr, areaNum, maxPriceNum);

      res.status(200).json({
        success: true,
        data: trendData,
        source: 'rag-system',
        message: 'Azure AI Search RAG 시스템을 통해 생성된 추세 분석 데이터입니다.'
      });
    } catch (error) {
      console.error('RAG 시스템 추세 분석 오류:', error);
      res.status(500).json({
        success: false,
        message: 'RAG 시스템에서 추세 분석을 생성하는 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('API 오류:', error);
    res.status(500).json({
      message: '서버 내부 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
