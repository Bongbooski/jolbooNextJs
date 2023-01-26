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

ChartJS.register(ArcElement, Tooltip, Legend);

const Result = () => {
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
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
          6.5억
        </Typography>
        <Typography variant="h5" gutterBottom>
          이예요
        </Typography>
      </div>
      <div className="verticalContainer">
        <img src="https://www.seoul.go.kr/res_newseoul/images/seoul/seoul_map.gif" />
        <Typography variant="h2" gutterBottom>
          영등포구
        </Typography>
        <Typography variant="h5" gutterBottom>
          에 집을 살 수 있어요
        </Typography>
      </div>

      <Typography variant="h5" gutterBottom>
        총 4억을 대출했어요
      </Typography>
      <Doughnut data={data} />
      <Typography variant="h5" gutterBottom>
        매월 200만원을 갚아야 해요
      </Typography>
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
      <Link href={`/`}>
        <Button variant="contained" size="large" disableElevation>
          <Typography variant="body1">다시하기</Typography>
        </Button>
      </Link>
      <style jsx>{`
        .verticalContainer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 50px 0px 0px 0px;
        }
      `}</style>
    </>
  );
};

Result.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Result;
