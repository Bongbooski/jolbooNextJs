import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Rating
} from '@mui/material';
import type { RealEstateData as RealEstateDataType } from '../lib/rag-system';

interface RealEstateDataComponentProps {
  district: string;
  area: number;
  maxPrice: number;
}

export default function RealEstateDataComponent({ district, area, maxPrice }: RealEstateDataComponentProps) {
  const [data, setData] = useState<RealEstateDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // GET 요청으로 변경: 쿼리 파라미터 사용
        const queryParams = new URLSearchParams({
          district: district,
          area: area.toString(),
          maxPrice: maxPrice.toString(),
        });

        const response = await fetch(`/api/real-estate-search?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (district && area > 0 && maxPrice > 0) {
      fetchData();
    }
  }, [district, area, maxPrice]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
        <Typography variant="body2" ml={2}>
          부동산 데이터를 검색하고 있습니다...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        데이터를 불러오는 중 오류가 발생했습니다: {error}
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        해당 조건에 맞는 부동산 데이터가 없습니다.
      </Alert>
    );
  }

  // 유사도 점수를 별점으로 변환 (0-1 → 0-5)
  const getSimilarityRating = (similarity: number | undefined) => {
    if (similarity === undefined) return 0;
    return Math.round(similarity * 5);
  };

  // 유사도 점수를 퍼센트로 변환
  const getSimilarityPercentage = (similarity: number | undefined) => {
    if (similarity === undefined) return '0%';
    return `${Math.round(similarity * 100)}%`;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6" component="h3" sx={{ mr: 2 }}>
          구매 가능한 지역의 최근 실거래가 정보
        </Typography>
        <Chip
          label="AI 벡터 검색"
          color="primary"
          size="small"
        />
        <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
          (의미적 검색 기반)
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>지역</TableCell>
              <TableCell>건물명</TableCell>
              <TableCell>면적(평)</TableCell>
              <TableCell>가격(억원)</TableCell>
              <TableCell>계약일</TableCell>
              <TableCell>건물용도</TableCell>
              <TableCell>층수</TableCell>
              <TableCell>건축년도</TableCell>
              <TableCell>주소</TableCell>
              <TableCell>유사도</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} hover>
                <TableCell>{item.district}</TableCell>
                <TableCell>{item.buildingName}</TableCell>
                <TableCell>{item.area}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.contractDate}</TableCell>
                <TableCell>{item.buildingType}</TableCell>
                <TableCell>{item.floor}</TableCell>
                <TableCell>{item.constructionYear}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating
                        value={getSimilarityRating(item.similarity)}
                        readOnly
                        size="small"
                        max={5}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {getSimilarityPercentage(item.similarity)}
                      </Typography>
                    </Box>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Typography variant="caption" color="text.secondary">
          💡 AI 벡터 검색을 통해 의미적으로 유사한 매물을 찾았습니다. 
          유사도 점수가 높을수록 검색 조건과 더 잘 맞는 결과입니다.
        </Typography>
      </Box>
    </Box>
  );
}
