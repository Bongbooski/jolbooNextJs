import { ReactElement } from "react";
import AppLayout from "../components/layout/AppLayout";
import SymbolIcon from "../asset/svg/Symbol.svg";
import {
  Button,
  Link,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { PricePerSquareMeter } from "../constants/Common";
import { LoanResult } from "../constants/Loan";
import { useRecoilValue } from "recoil";
import { KnowingState } from "../state/KnowingState";
import { getCommaString } from "../utils/CommonUtils";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartBackgroundColor = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
];

const chartBorderColor = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

const Result = () => {
  const getFinalLoanResult = useRecoilValue<Array<LoanResult>>(
    KnowingState.getFinalLoanResult
  );

  const data = {
    labels: getFinalLoanResult.map((e) => e.name),
    datasets: [
      {
        label: "원금",
        data: getFinalLoanResult.map((e) => e.loanAmount),
        backgroundColor: chartBackgroundColor.slice(
          0,
          getFinalLoanResult.length
        ),
        borderColor: chartBorderColor.slice(0, getFinalLoanResult.length),
        borderWidth: 1,
      },
    ],
  };

  // const data = {
  //   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //   datasets: [
  //     {
  //       label: "# of Votes",
  //       data: [12, 19, 3, 5, 2, 3],
  //       backgroundColor: [
  //         "rgba(255, 99, 132, 0.2)",
  //         "rgba(54, 162, 235, 0.2)",
  //         "rgba(255, 206, 86, 0.2)",
  //         "rgba(75, 192, 192, 0.2)",
  //         "rgba(153, 102, 255, 0.2)",
  //         "rgba(255, 159, 64, 0.2)",
  //       ],
  //       borderColor: [
  //         "rgba(255, 99, 132, 1)",
  //         "rgba(54, 162, 235, 1)",
  //         "rgba(255, 206, 86, 1)",
  //         "rgba(75, 192, 192, 1)",
  //         "rgba(153, 102, 255, 1)",
  //         "rgba(255, 159, 64, 1)",
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const housePrice = 6.5;

  const districtName25 = PricePerSquareMeter.filter(
    (e) => e.price25 < housePrice * 10000
  ).pop()?.districtName;

  const districtName34 = PricePerSquareMeter.filter(
    (e) => e.price34 < housePrice * 10000
  ).pop()?.districtName;

  const totalLoanAmount = getFinalLoanResult.reduce((sum, currValue) => {
    return sum + Number(currValue.loanAmount);
  }, 0);

  return (
    <>
      <SymbolIcon />
      <Typography variant="h3" gutterBottom>
        영끌계산기
      </Typography>
      <Typography variant="h5" gutterBottom>
        내 연봉으로 어떤 집에 살 수 있을까?
      </Typography>
      <div className="verticalContainer">
        <Typography variant="h5" gutterBottom>
          내가 살 수 있는 주택 가격 최대 금액은{` `}
        </Typography>
        <Typography variant="h1" gutterBottom>
          {housePrice}억
        </Typography>
        <Typography variant="h5" gutterBottom>
          이예요
        </Typography>
      </div>
      <div className="districtContainer">
        <img src="/seoul_map.png" />
        <div className="districtDescription">
          <div className="verticalContainer">
            {districtName25 ? (
              <>
                <Typography variant="h5" gutterBottom>
                  25평은
                </Typography>
                <Typography variant="h2" gutterBottom>
                  {districtName25}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  에 집을 살 수 있어요 &#128516;
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  서울 25평은 살 수 없어요 &#128517;
                </Typography>
              </>
            )}
          </div>
          <div className="verticalContainer">
            {districtName34 ? (
              <>
                <Typography variant="h5" gutterBottom>
                  34평은
                </Typography>
                <Typography variant="h2" gutterBottom>
                  {districtName34}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  에 집을 살 수 있어요 &#128516;
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  서울 34평은 살 수 없어요 &#128517;
                </Typography>
              </>
            )}
          </div>
        </div>
      </div>
      <Typography variant="h5" gutterBottom>
        필요한 대출금은 총 {totalLoanAmount}
        억이예요
      </Typography>
      <div className="chartContainer">
        <Doughnut data={data} />
      </div>

      {getFinalLoanResult.map((e) => {
        return (
          <>
            <Typography variant="h5" gutterBottom>
              {e.name} 대출은 원금 {e.loanAmount}억에 이자 {e.interest}%로
            </Typography>
            <Typography variant="h5" gutterBottom>
              원금균등일 경우 첫달엔{" "}
              {getCommaString(e.fixedPaymentLoanAmountByMonth)}원을 갚아야 하고
            </Typography>
            <Typography variant="h5" gutterBottom>
              원리금균등으로는 매월{" "}
              {getCommaString(e.fixedPrincipalPaymentLoanAmountFirstMonth)}
              원을 갚아야 해요
            </Typography>
          </>
        );
      })}

      <div className="stepperContainer">
        <Stepper activeStep={0} alternativeLabel>
          <Step key={"영끌계산기"}>
            <StepLabel>{"영끌계산기"}</StepLabel>
          </Step>
          <Step key={"후보지역 추첨기(준비중)"}>
            <StepLabel>{"후보지역 추첨기(준비중)"}</StepLabel>
          </Step>
          <Step key={"매물확인 레이더(준비중)"}>
            <StepLabel>{"매물확인 레이더(준비중)"}</StepLabel>
          </Step>
          <Step key={"임장수첩(준비중)"}>
            <StepLabel>{"임장수첩(준비중)"}</StepLabel>
          </Step>
        </Stepper>
      </div>
      <Link href={`/`}>
        <Button variant="contained" size="large" disableElevation>
          <Typography variant="body1">다시하기</Typography>
        </Button>
      </Link>
      <style jsx>{`
        .districtContainer {
          display: flex;
          align-items: center;
        }
        .verticalContainer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 50px 0px 0px 0px;
        }
        .chartContainer {
          width: 500px;
          height: 500px;
        }
        .stepperContainer {
          width: 800px;
        }
      `}</style>
    </>
  );
};

Result.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Result;
