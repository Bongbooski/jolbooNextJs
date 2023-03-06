import { ReactElement, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import SymbolIcon from "../asset/svg/Symbol.svg";
import PlaceBlack from "../asset/svg/Place_black_24dp.svg";
import SearchIcon from "../asset/svg/Search.svg";
import QuestionIcon from "../asset/svg/Question.svg";
import {
  Button,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MuiTooltip from "@mui/material/Tooltip";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { PricePerSquareMeter } from "../constants/Common";
import { LoanResult } from "../constants/Loan";
import { useRecoilValue } from "recoil";
import { KnowingState } from "../state/KnowingState";
import DistrictDescription from "../components/DistrictDescription";
import { getCommaString } from "../utils/CommonUtils";
import Symbol from "../components/Symbol";

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
  const [selectedSquareMeter, setSelectedSquareMeter] = useState<string>("25");
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

  const housePrice = 7.7;
  const myAsset = 3;

  // const districtName25 = PricePerSquareMeter.filter(
  //   (e) => e.price25 < housePrice * 10000
  // ).pop()?.districtName;

  const districtName25 = PricePerSquareMeter.filter(
    (e) => e.price25 < housePrice * 10000
  );

  const districtName34 = PricePerSquareMeter.filter(
    (e) => e.price34 < housePrice * 10000
  );

  const totalLoanAmount = getFinalLoanResult.reduce((sum, currValue) => {
    return sum + Number(currValue.loanAmount);
  }, 0);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedSquareMeter(event.target.value);
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Symbol />
      <div className="contentsArea">
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
      </div>
      <div className="contentsArea">
        <div className="districtContainer">
          <div className="districtContents">
            <div className="mapArea">
              <img src="/seoul_map.png" />
              {selectedSquareMeter === "25" && districtName25.length > 0 ? (
                districtName25.map((e) => {
                  return (
                    <div className={`pinArea${e.districtEngName}`}>
                      <PlaceBlack className="pinIcon" />
                    </div>
                  );
                })
              ) : selectedSquareMeter === "34" && districtName34.length > 0 ? (
                districtName34.map((e) => {
                  return (
                    <div className={`pinArea${e.districtEngName}`}>
                      <PlaceBlack className="pinIcon" />
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>
            <div>
              <FormControl>
                <InputLabel id="demo-simple-select-label">평수</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedSquareMeter}
                  label="평수"
                  onChange={handleChange}
                >
                  <MenuItem value={"25"}>25평</MenuItem>
                  <MenuItem value={"34"}>34평</MenuItem>
                </Select>
              </FormControl>
              {selectedSquareMeter === "25" ? (
                <DistrictDescription
                  squareMeter="25"
                  districts={districtName25}
                />
              ) : (
                <DistrictDescription
                  squareMeter="34"
                  districts={districtName34}
                />
              )}
            </div>
          </div>
          <div className="verticalContainer">
            <QuestionIcon />
            <Typography>
              {"  "}위 데이터는 KB부동산에서 제공한 아파트 ㎡당 매매평균가격
              기준입니다. 자세한 수치는{" "}
              <a
                target="_blank"
                href="https://data.kbland.kr/kbstats/wmh?tIdx=HT07&tsIdx=aptM2SaleAvgPrice"
                className="link"
              >
                여기
              </a>
              를 확인해보세요
            </Typography>
          </div>
        </div>
      </div>
      <div className="contentsArea">
        <div className="verticalContainer">
          <Typography variant="h5" gutterBottom>
            현재 내가 가진돈은{" "}
          </Typography>
          <Typography variant="h1" gutterBottom>
            {myAsset}억
          </Typography>
          <Typography variant="h5" gutterBottom>
            원이고, 필요한 대출금은 총
          </Typography>
          <Typography variant="h1" gutterBottom>
            {totalLoanAmount}억
          </Typography>
          <Typography variant="h5" gutterBottom>
            원이예요
          </Typography>
        </div>
        <div className="chartContainer">
          <Doughnut data={data} />
        </div>
        <div className="tableContainer">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>대출명</TableCell>
                  <TableCell align="right">원금</TableCell>
                  <TableCell align="right">이자</TableCell>
                  <TableCell align="right">원금균등(매월)</TableCell>
                  <TableCell align="right">원리금균등(첫달)</TableCell>
                  <TableCell align="right">거치식(첫달)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFinalLoanResult.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.loanAmount}억</TableCell>
                    <TableCell align="right">{row.interest}%</TableCell>
                    <TableCell align="right">
                      {getCommaString(row.fixedPaymentLoanAmountByMonth)}
                    </TableCell>
                    <TableCell align="right">
                      {getCommaString(
                        row.fixedPrincipalPaymentLoanAmountFirstMonth
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="verticalContainer">
          <QuestionIcon />
          <Typography>
            {"  "}위 계산된 데이터는 참고용입니다. 정확한 수치는 은행에 가서
            확인하셔야 해요
          </Typography>
        </div>
      </div>
      <div className="contentsArea">
        <Typography gutterBottom>
          내가 살 수 있는 아파트 가격을 확인했으면 이제 후보 지역을 선정해야
          합니다. 아래 내용은 아직 준비중이예요
        </Typography>
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
        <div className="verticalContainer">
          <Typography gutterBottom>
            관심있으시면 이메일을 남겨주세요. 준비가 되면 제일 먼저
            알려드릴게요.
            {"   "}
          </Typography>
          <TextField
            id="outlined-basic"
            label="email"
            variant="outlined"
            size="small"
          />
          <Button variant="contained" size="small" sx={{ height: 40, ml: 1 }}>
            <Typography variant="body1">메일보내기</Typography>
          </Button>
        </div>
      </div>
      <div className="contentsArea">
        <div className="linkContainer">
          <Link href={`/`}>
            <Button variant="contained" size="large" disableElevation>
              <Typography variant="body1">다시하기</Typography>
            </Button>
          </Link>
        </div>
      </div>
      <style jsx>{`
        .contentsArea {
          padding: 30px 0px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .districtContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .districtContents {
          display: flex;
        }
        .districtDescription {
          margin: 10px;
        }
        .verticalContainer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .chartContainer {
          padding: 50px;
          width: 500px;
          height: 500px;
        }
        .stepperContainer {
          padding: 20px 0px;
          width: 800px;
        }
        .mapArea {
          position: relative;
        }
        .tableContainer {
          padding-bottom: 10px;
        }
        .pinAreaDoBong {
          position: absolute;
          top: 28px;
          left: 289px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaGangBuk {
          position: absolute;
          top: 59px;
          left: 254px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaGeumCheon {
          position: absolute;
          top: 309px;
          left: 150px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaJungNang {
          position: absolute;
          top: 114px;
          left: 350px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaGuRo {
          position: absolute;
          top: 248px;
          left: 90px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaGwanAk {
          position: absolute;
          top: 278px;
          left: 194px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaNoWon {
          position: absolute;
          top: 45px;
          left: 334px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaSeongBuk {
          position: absolute;
          top: 106px;
          left: 268px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaEunPyeong {
          position: absolute;
          top: 81px;
          left: 176px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaDongDaeMun {
          position: absolute;
          top: 134px;
          left: 308px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaSeoDaeMun {
          position: absolute;
          top: 139px;
          left: 183px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaGangSeo {
          position: absolute;
          top: 155px;
          left: 62px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaJung {
          position: absolute;
          top: 161px;
          left: 247px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaYeongDeungPo {
          position: absolute;
          top: 208px;
          left: 158px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaGangDong {
          position: absolute;
          top: 171px;
          left: 400px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaJongNo {
          position: absolute;
          top: 133px;
          left: 233px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaDongJak {
          position: absolute;
          top: 230px;
          left: 195px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaYangCheon {
          position: absolute;
          top: 210px;
          left: 102px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaGwangJin {
          position: absolute;
          top: 181px;
          left: 343px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaMaPo {
          position: absolute;
          top: 163px;
          left: 157px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaSeongDong {
          position: absolute;
          top: 171px;
          left: 295px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaSongPa {
          position: absolute;
          top: 223px;
          left: 365px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaYongSan {
          position: absolute;
          top: 198px;
          left: 232px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaSeoCho {
          position: absolute;
          top: 250px;
          left: 259px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        .pinAreaGangNam {
          position: absolute;
          top: 236px;
          left: 302px;
          margin-top: 0;
          animation: motion 0.3s linear 0s infinite alternate;
          -webkit-animation: motion 0.3s linear 0s infinite alternate;
        }
        @keyframes motion {
          0% {
            margin-top: 0px;
          }
          100% {
            margin-top: 10px;
          }
        }
        -webkit-@keyframes motion {
          0% {
            margin-top: 0px;
          }
          100% {
            margin-top: 10px;
          }
        }
        .link {
          color: #367cff;
          font-size: 20px;
        }
      `}</style>
    </>
  );
};

Result.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Result;