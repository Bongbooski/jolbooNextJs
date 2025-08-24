import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  AttachMoney,
  Home,
  Timeline
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RealEstateTrendProps {
  district: string;
  area: number;
  maxPrice: number;
}

interface TrendData {
  month: string;
  averagePrice: number;
  transactionCount: number;
  priceChange: number;
}

export default function RealEstateTrend({ district, area, maxPrice }: RealEstateTrendProps) {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    currentAverage: 0,
    priceChange: 0,
    trend: 'stable' as 'up' | 'down' | 'stable',
    totalTransactions: 0
  });

  const [marketAnalysis, setMarketAnalysis] = useState({
    currentSituation: '',
    investmentConsiderations: '',
    futureOutlook: ''
  });

  // 차트 옵션을 위한 ref
  const chartOptionsRef = useRef<any>(null);

  // 차트 데이터
  const chartData = useMemo(() => {
    if (!trendData || trendData.length === 0) return { labels: [], datasets: [] };

    const labels = trendData.map(item => item.month);
    const prices = trendData.map(item => item.averagePrice);

    return {
      labels,
      datasets: [
        {
          label: '평균 실거래가 (억원)',
          data: prices,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  }, [trendData]);

  // 차트 옵션을 동적으로 생성
  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' as const },
        title: {
          display: true,
          text: `${district} ${area}평 아파트 실거래가 추이`,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 12,
          max: 18,
          ticks: {
            stepSize: 1,
            callback: function(value: any) {
              return value + '억';
            }
          },
          title: {
            display: true,
            text: '가격 (억원)'
          },
          grid: { color: 'rgba(0,0,0,0.1)' }
        },
        x: {
          title: { display: true, text: '월' },
          grid: { color: 'rgba(0,0,0,0.1)' }
        }
      },
      layout: {
        padding: { top: 10, right: 10, bottom: 10, left: 10 }
      }
    };
  }, [district, area]);

  // chartOptionsRef에 옵션 할당
  chartOptionsRef.current = chartOptions;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" />;
      case 'down':
        return <TrendingDown color="error" />;
      default:
        return <TrendingFlat color="action" />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'up':
        return '상승';
      case 'down':
        return '하락';
      default:
        return '안정';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true);
        setError(null);

        // RAG API 호출
        const queryParams = new URLSearchParams({
          district: district,
          area: area.toString(),
          maxPrice: maxPrice.toString(),
        });

        const response = await fetch(`/api/real-estate-trend?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          const data = result.data;
          
          // RAG 응답 데이터를 컴포넌트 상태에 맞게 변환
          if (data.trendData && Array.isArray(data.trendData)) {
            setTrendData(data.trendData);
          }
          
          if (data.currentStats) {
            setStats({
              currentAverage: data.currentStats.currentAverage || 0,
              priceChange: data.currentStats.priceChange || 0,
              trend: data.currentStats.trend || 'stable',
              totalTransactions: data.currentStats.totalTransactions || 0
            });
          }
          
          if (data.marketAnalysis) {
            setMarketAnalysis({
              currentSituation: data.marketAnalysis.currentSituation || '',
              investmentConsiderations: data.marketAnalysis.investmentConsiderations || '',
              futureOutlook: data.marketAnalysis.futureOutlook || ''
            });
          }
        } else {
          throw new Error(result.message || '데이터를 불러올 수 없습니다.');
        }

      } catch (err) {
        console.error('추세 데이터 로딩 오류:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        // 오류 발생 시 데이터 초기화
        setTrendData([]);
        setStats({
          currentAverage: 0,
          priceChange: 0,
          trend: 'stable',
          totalTransactions: 0
        });
        setMarketAnalysis({
          currentSituation: '',
          investmentConsiderations: '',
          futureOutlook: ''
        });
      } finally {
        setLoading(false);
      }
    };

    if (district && area > 0 && maxPrice > 0) {
      fetchTrendData();
    }
  }, [district, area, maxPrice]);

  return (
    <Box sx={{ mt: 3, maxWidth: 1200, mx: 'auto', px: 2 }}>
      {/* 로딩 상태 */}
      {loading && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            실거래가 추세 정보를 분석하고 있습니다...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            AI가 최근 거래 데이터를 분석하여 시장 동향을 파악하고 있습니다.
          </Typography>
        </Paper>
      )}

      {/* 오류 상태 */}
      {error && (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light' }}>
          <Typography variant="h6" color="error.main" gutterBottom>
            추세 정보 로딩 실패
          </Typography>
          <Typography variant="body2" color="error.main" paragraph>
            {error}
          </Typography>
          <Typography variant="body2" color="error.main" sx={{ fontSize: '0.875rem' }}>
            요청 파라미터: {district}, {area}평, {maxPrice}억원
          </Typography>
          <Typography variant="body2" color="error.main" sx={{ fontSize: '0.75rem', mt: 1 }}>
            개발자: RAG 시스템 연결 상태를 확인해주세요.
          </Typography>
        </Paper>
      )}

      {/* 데이터가 없는 경우 */}
      {!loading && !error && (!trendData || trendData.length === 0) && (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light' }}>
          <Typography variant="h6" color="warning.main" gutterBottom>
            추세 정보 없음
          </Typography>
          <Typography variant="body2" color="warning.main" paragraph>
            {district} 지역의 {area}평 아파트 실거래가 추세 데이터를 찾을 수 없습니다.
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ fontSize: '0.875rem' }}>
            가능한 원인: 해당 지역의 최근 거래 데이터 부족, RAG 시스템 연결 문제
          </Typography>
        </Paper>
      )}

      {/* 추세 데이터가 있는 경우 */}
      {!loading && !error && trendData && trendData.length > 0 && (
        <>
          {/* 통계 카드들 */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: 160, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h4" component="div" color="primary.main" gutterBottom>
                    {stats.currentAverage.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    현재 평균가 (억원)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: 160, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h4" component="div" color={stats.priceChange >= 0 ? 'success.main' : 'error.main'} gutterBottom>
                    {stats.priceChange >= 0 ? '+' : ''}{stats.priceChange.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    전월 대비 변화율
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: 160, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h4" component="div" color="info.main" gutterBottom>
                    {stats.totalTransactions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    총 거래 건수
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: 160, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h4" component="div" color={stats.trend === 'up' ? 'success.main' : stats.trend === 'down' ? 'error.main' : 'warning.main'} gutterBottom>
                    {stats.trend === 'up' ? '↗' : stats.trend === 'down' ? '↘' : '→'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    시장 추세
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 추세 차트 */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              월별 실거래가 추이
            </Typography>
            <Box sx={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ width: '100%', height: 400, maxWidth: 800 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            </Box>
          </Paper>

          {/* 시장 분석 */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              시장 분석 및 전망
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    📈 현재 시장 상황
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {marketAnalysis.currentSituation || 
                      `${district} 지역의 ${area}평 아파트 시장은 현재 ${getTrendText(stats.trend)} 추세를 보이고 있습니다. 
                      최근 6개월간 평균 실거래가는 ${stats.currentAverage.toFixed(1)}억원으로, 
                      전월 대비 ${stats.priceChange.toFixed(1)}% ${getTrendText(stats.trend)}했습니다.`
                    }
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    💡 투자 고려사항
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {marketAnalysis.investmentConsiderations || 
                      (stats.trend === 'up' ? 
                        '가격 상승 추세로 인해 조기 매수 시 이익 실현 가능성이 높습니다.' :
                        stats.trend === 'down' ? 
                        '가격 하락 추세로 인해 추가 하락 가능성을 고려해야 합니다.' :
                        '가격이 안정적으로 유지되고 있어 안전한 투자 환경입니다.'
                      )
                    }
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                     🔮 향후 전망
                   </Typography>
                   <Typography variant="body2" color="text.secondary" paragraph>
                     {marketAnalysis.futureOutlook || 
                       `${district} 지역의 ${area}평 아파트 시장은 현재 ${getTrendText(stats.trend)} 추세를 보이고 있어, 
                       단기적으로는 ${stats.trend === 'up' ? '가격 상승이 지속될 것으로 예상' : 
                       stats.trend === 'down' ? '가격 하락이 지속될 것으로 예상' : 
                       '가격 안정이 유지될 것으로 예상'}됩니다. 
                       장기적인 관점에서는 지역 개발 계획과 인프라 개선에 따라 시장 동향이 변화할 수 있습니다.`
                     }
                   </Typography>
                 </Box>
               </Grid>
             </Grid>
           </Paper>
         </>
       )}
     </Box>
   );
}
