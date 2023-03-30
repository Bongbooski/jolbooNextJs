import { ReactElement, useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import PlaceBlack from "../../asset/svg/Place_black_24dp.svg";
import QuestionIcon from "../../asset/svg/Question.svg";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Popover,
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
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Image from "next/image";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  FinalLoanResult,
  PaymentType,
  PricePerSquareMeter,
} from "../../constants/Common";
import { useRecoilState, useRecoilValue } from "recoil";
import { KnowingState } from "../../state/KnowingState";
import DistrictDescription from "../../components/DistrictDescription";
import {
  calculateFixedPaymentLoanAmountByMonth,
  getCommaString,
  getFixedPrincipalInterest,
} from "../../utils/CommonUtils";
import SymbolSmall from "../../components/SymbolSmall";
import Router from "next/router";
import emailjs from "emailjs-com";
import { Dayjs } from "dayjs";
import SearchIcon from "../../asset/svg/Search.svg";
import AntSwitch from "../../components/AntSwitch";
import { LoanResult, LoanType } from "../../constants/Loan";
import Seo from "../../components/Seo";

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
  // const [includeDidimdol, setIncludeDidimdol] = useState<boolean>(false);
  // const [includeSpecialHome, setIncludeSpecialHome] = useState<boolean>(false);
  const getFinalLoanResult = useRecoilValue<FinalLoanResult>(
    KnowingState.getFinalLoanResult
  );
  const getDsrLoanResult = useRecoilValue<Array<LoanResult>>(
    KnowingState.getDsrLoanResult
  );
  const getMyAsset = useRecoilValue<number>(KnowingState.getMyAsset);
  const getLtv = useRecoilValue<number>(KnowingState.getLtv);
  const yearIncome = useRecoilValue<string>(KnowingState.yearIncome);
  const depositAmount = useRecoilValue<string>(KnowingState.depositAmount);
  const supportAmount = useRecoilValue<string>(KnowingState.supportAmount);
  const saveAmount = useRecoilValue<string>(KnowingState.saveAmount);

  const isAbleDidimdol = useRecoilValue<boolean>(KnowingState.isAbleDidimdol);
  const [useDidimdol, setUseDidimdol] = useRecoilState<boolean>(
    KnowingState.useDidimdol
  );
  const isAbleSpecialHomeLoan = useRecoilValue<boolean>(
    KnowingState.isAbleSpecialHomeLoan
  );
  const [useSpecialHome, setUseSpecialHome] = useRecoilState<boolean>(
    KnowingState.useSpecialHome
  );
  const [useOnlyExtraMoney, setUseOnlyExtraMoney] = useRecoilState<boolean>(
    KnowingState.useOnlyExtraMoney
  );

  const getSoulGatheringAmount = useRecoilValue<number>(
    KnowingState.getSoulGatheringAmount
  );
  const birthday = useRecoilValue<Dayjs | null>(KnowingState.birthday);
  const getMaxPropertyPriceByLTV = useRecoilValue<string>(
    KnowingState.getMaxPropertyPriceByLTV
  );
  const borrowingYear = Number.parseInt(
    useRecoilValue<string>(KnowingState.borrowingYear)
  );
  const paymentType = useRecoilValue<PaymentType>(KnowingState.paymentType);

  const [userEmail, setUserEmail] = useState<string>("");
  const [showEmailSentInfo, setShowEmailSentInfo] = useState<boolean>(false);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const calculateDSRPercentage = () => {
    let paymentForYear = 0;
    let sumDsr = 0;

    getFinalLoanResult.finalLoanResult.forEach((value) => {
      if (paymentType === PaymentType.FIXED_PRINCIPAL) {
        sumDsr +=
          (Number(
            getFixedPrincipalInterest(
              Number(value.loanAmount),
              borrowingYear,
              value.interest,
              1
            ).totalPayment.toFixed(2)
          ) /
            (Number(yearIncome) * 10000)) *
          100;
        paymentForYear += Number(
          getFixedPrincipalInterest(
            Number(value.loanAmount),
            borrowingYear,
            value.interest,
            1
          ).totalPayment.toFixed(2)
        );
      } else if (paymentType === PaymentType.FIXED) {
        sumDsr +=
          ((calculateFixedPaymentLoanAmountByMonth(
            borrowingYear,
            Number(value.loanAmount),
            value.interest
          ) *
            12) /
            (Number(yearIncome) * 10000)) *
          100;
        paymentForYear +=
          calculateFixedPaymentLoanAmountByMonth(
            borrowingYear,
            Number(value.loanAmount),
            value.interest
          ) * 12;
      }
    });

    return {
      averageDsr: (sumDsr / getFinalLoanResult.finalLoanResult.length).toFixed(
        2
      ),
      paymentForYear: getCommaString(Math.round(paymentForYear)),
    };
  };

  const sendEmail = (e: any) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_7tlrb3l",
        "template_ug88foh",
        e.target,
        "K0NWGAFo_98PZcIO9"
      )
      .then(
        (result) => {
          console.log(result.text);
          if (result.text === "OK") {
            setIsEmailSent(true);
            setShowEmailSentInfo(true);
          }
        },
        (error) => {
          console.log(error.text);
          setIsEmailSent(false);
          setShowEmailSentInfo(true);
        }
      );
  };

  useEffect(() => {
    if (!yearIncome) {
      Router.push("/");
    }
  }, [yearIncome]);

  useEffect(() => {
    if (getMyAsset > 5) {
      setUseDidimdol(false);
    } else if (getMyAsset > 9) {
      setUseSpecialHome(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = {
    labels: getFinalLoanResult.finalLoanResult.map((e) => e.name),
    datasets: [
      {
        label: "원금",
        data: getFinalLoanResult.finalLoanResult.map((e) => e.loanAmount),
        backgroundColor: chartBackgroundColor.slice(
          0,
          getFinalLoanResult.finalLoanResult.length
        ),
        borderColor: chartBorderColor.slice(
          0,
          getFinalLoanResult.finalLoanResult.length
        ),
        borderWidth: 1,
      },
    ],
  };

  const districtName25 = PricePerSquareMeter.filter(
    (e) => e.price25 < getFinalLoanResult.finalPropertyPrice * 10000
  );

  const districtName34 = PricePerSquareMeter.filter(
    (e) => e.price34 < getFinalLoanResult.finalPropertyPrice * 10000
  );

  const totalLoanAmount = getFinalLoanResult.finalLoanResult.reduce(
    (sum, currValue) => {
      return sum + Number(currValue.loanAmount);
    },
    0
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedSquareMeter(event.target.value);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getTotalPayment = () => {
    return paymentType === PaymentType.FIXED
      ? getFinalLoanResult.finalLoanResult.reduce(function (prev, next) {
          return prev + Number(next.fixedPaymentLoanAmountByMonth);
        }, 0)
      : getFinalLoanResult.finalLoanResult.reduce(function (prev, next) {
          return prev + Number(next.fixedPrincipalPaymentLoanAmountFirstMonth);
        }, 0);
  };

  return (
    <div className={"resultContainer"}>
      <Seo title="결과보기" />
      <SymbolSmall />
      <div className="firstArea contentsArea">
        <div className="verticalContainer">
          <Typography variant="h5" gutterBottom>
            내가 살 수 있는 주택 가격 최대 금액은{` `}
          </Typography>
          <Typography variant="h1" gutterBottom>
            {Number(getFinalLoanResult.finalPropertyPrice.toFixed(2))}억
          </Typography>
          <Typography variant="h5" gutterBottom>
            이예요
          </Typography>
        </div>

        {/* {getFinalLoanResult.additionalMessage && (
          <div className="verticalContainer">
            <div>
              <QuestionIcon fill="#6e6d6d" />{" "}
            </div>
            <Typography variant="h6" gutterBottom>
              {getFinalLoanResult.additionalMessage}
            </Typography>
          </div>
        )} */}
        {isAbleDidimdol && (
          <div className="verticalContainer">
            <div>
              <QuestionIcon fill="#6e6d6d" />{" "}
            </div>
            <Typography variant="h6" gutterBottom>
              {
                "디딤돌대출을 사용하실 건가요?(사용하면 주택가격이 5억까지로 제한돼요)"
              }
            </Typography>

            <div className="toggleButtonWrapper">
              <ToggleButtonGroup
                color="primary"
                value={useDidimdol.toString()}
                size="small"
                exclusive
                onChange={(
                  event: React.MouseEvent<HTMLElement>,
                  newSelection: string
                ) => {
                  if (newSelection !== null)
                    setUseDidimdol(JSON.parse(newSelection));
                }}
                aria-label="Platform"
              >
                <ToggleButton value="true">사용</ToggleButton>
                <ToggleButton value="false">제외</ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
        )}
        {isAbleSpecialHomeLoan && (
          <div className="verticalContainer">
            <div>
              <QuestionIcon fill="#6e6d6d" />{" "}
            </div>
            <Typography variant="h6" gutterBottom>
              {
                "특례보금자리론을 사용하실 건가요?(사용하면 주택가격이 5억까지로 제한돼요)"
              }
            </Typography>
            <div className="toggleButtonWrapper">
              <ToggleButtonGroup
                color="primary"
                value={useSpecialHome.toString()}
                size="small"
                exclusive
                onChange={(
                  event: React.MouseEvent<HTMLElement>,
                  newSelection: string
                ) => {
                  if (newSelection !== null)
                    setUseSpecialHome(JSON.parse(newSelection));
                }}
                aria-label="Platform"
              >
                <ToggleButton value="true">사용</ToggleButton>
                <ToggleButton value="false">제외</ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
        )}
      </div>
      <div className="seoulArea contentsArea">
        <div className="districtContainer">
          <div className="districtContents">
            <div className="mapArea">
              <img
                width={480}
                height={394}
                alt={"seoulMap"}
                src={"/seoul_map.png"}
              />
              {selectedSquareMeter === "25" && districtName25.length > 0 ? (
                districtName25.map((e, i) => {
                  return (
                    <div
                      key={`pinIcon25_${i}`}
                      className={`pinArea${e.districtEngName}`}
                    >
                      <PlaceBlack className="pinIcon" />
                    </div>
                  );
                })
              ) : selectedSquareMeter === "34" && districtName34.length > 0 ? (
                districtName34.map((e, i) => {
                  return (
                    <div
                      key={`pinIcon34_${i}`}
                      className={`pinArea${e.districtEngName}`}
                    >
                      <PlaceBlack className="pinIcon" />
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>
            <div className="descriptionArea">
              <FormControl style={{ width: "fit-content" }}>
                <InputLabel id="demo-simple-select-label">면적</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedSquareMeter}
                  label="면적"
                  onChange={handleChange}
                >
                  <MenuItem value={"25"}>
                    59m<sup>2</sup>(25평)
                  </MenuItem>
                  <MenuItem value={"34"}>
                    84m<sup>2</sup>(34평)
                  </MenuItem>
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
          <div className="topMargin10 verticalContainer">
            <QuestionIcon />
            <Typography>
              {"  "}위 데이터는 KB부동산에서 제공한 아파트 ㎡당 매매평균가격
              기준입니다. 자세한 수치는{" "}
              <a
                target="_blank"
                href="https://data.kbland.kr/kbstats/wmh?tIdx=HT07&tsIdx=aptM2SaleAvgPrice"
                className="link"
                rel="noreferrer"
              >
                여기
              </a>
              를 확인해보세요
            </Typography>
          </div>
        </div>
      </div>
      <div className="contentsArea">
        <div className="flexableArea">
          <div className="verticalContainer">
            <Typography variant="h5" gutterBottom>
              현재 내가 가진돈은{" "}
            </Typography>
            <Typography variant="h2" gutterBottom>
              {getMyAsset}억
            </Typography>
            <Typography variant="h5" gutterBottom>
              원이고,{" "}
            </Typography>
          </div>
          <div className="verticalContainer">
            <Typography variant="h5" gutterBottom>
              필요한 대출금은 총
            </Typography>
            <Typography variant="h2" gutterBottom>
              {totalLoanAmount}억
            </Typography>
            <Typography variant="h5" gutterBottom>
              원이예요
            </Typography>
          </div>
        </div>
        {totalLoanAmount === 0 ? (
          <>
            <Typography variant="h4">
              {" "}
              대출 받을 필요가 없거나, 받을 수 있는 대출이 없네요&#128517;
            </Typography>
          </>
        ) : (
          <>
            <div className="verticalContainer">
              <Typography variant="h4" gutterBottom>
                LTV
              </Typography>
              <Typography variant="h5" gutterBottom>
                는{" "}
              </Typography>
              <Typography variant="h4" gutterBottom>
                {Number(
                  (
                    (totalLoanAmount /
                      Number(
                        getFinalLoanResult.finalPropertyPrice.toFixed(2)
                      )) *
                    100
                  ).toFixed(2)
                )}
                %
              </Typography>
              <Typography variant="h5" gutterBottom>
                이네요
              </Typography>
            </div>
            <div className="verticalContainer">
              <Typography variant="h6">
                (주택가격{" "}
                {Number(getFinalLoanResult.finalPropertyPrice.toFixed(2))}
                억, 대출금 {totalLoanAmount}억)
              </Typography>
              {/* <Typography variant="h5" gutterBottom>
            주택가격{" "}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {Number(getFinalLoanResult.finalPropertyPrice.toFixed(2))}억
          </Typography>
          <Typography variant="h5" gutterBottom>
            에 대출금{" "}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {totalLoanAmount}억
          </Typography> */}
            </div>
            <div className="verticalContainer">
              <Typography variant="h4" gutterBottom>
                DSR
              </Typography>
              <Typography variant="h5" gutterBottom>
                은{" "}
              </Typography>
              <Typography variant="h4" gutterBottom>
                {Number(calculateDSRPercentage().averageDsr)}%
              </Typography>
              <Typography variant="h5" gutterBottom>
                이구요
              </Typography>
            </div>
            <div className="verticalContainer">
              <Typography variant="h6">
                (나의 1년 상환 총 원리금은{" "}
                {calculateDSRPercentage().paymentForYear}
                원){" "}
              </Typography>
              {/* <Typography variant="h5" gutterBottom>
            연봉{" "}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {getCommaString(yearIncome)}만원
          </Typography>
          <Typography variant="h5" gutterBottom>
            에 1년 상환 총 원리금은{" "}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {calculateDSRPercentage().paymentForYear}원
          </Typography>
          <Typography variant="h5" gutterBottom>
            이므로 DSR은{" "}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {Number(calculateDSRPercentage().averageDsr)}%
          </Typography>
          <Typography variant="h5" gutterBottom>
            이구요
          </Typography> */}
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
                      <TableCell align="right">이자율</TableCell>
                      <TableCell align="right">
                        {paymentType === PaymentType.FIXED
                          ? "원리금균등(매월)"
                          : "원금균등(첫달)"}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFinalLoanResult.finalLoanResult.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                          <IconButton
                            aria-describedby={id}
                            onClick={handleClick}
                          >
                            <SearchIcon
                              width="24"
                              height="24"
                              className="searchIcon"
                            />
                          </IconButton>
                          <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                          >
                            asdfadsfadsfdsf
                          </Popover>
                        </TableCell>
                        <TableCell align="right">
                          {Number(row.loanAmount)}억
                        </TableCell>
                        <TableCell align="right">{row.interest}%</TableCell>
                        <TableCell align="right">
                          {paymentType === PaymentType.FIXED
                            ? getCommaString(row.fixedPaymentLoanAmountByMonth)
                            : getCommaString(
                                row.fixedPrincipalPaymentLoanAmountFirstMonth
                              )}
                          원
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow
                      key={"합계"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {"합계"}
                      </TableCell>
                      <TableCell align="right">
                        {getFinalLoanResult.finalLoanResult.reduce(function (
                          prev,
                          next
                        ) {
                          return prev + Number(next.loanAmount);
                        },
                        0)}
                        억
                      </TableCell>
                      <TableCell align="right">{""}</TableCell>
                      <TableCell align="right">
                        {paymentType === PaymentType.FIXED
                          ? getCommaString(
                              getFinalLoanResult.finalLoanResult.reduce(
                                function (prev, next) {
                                  return (
                                    prev +
                                    Number(next.fixedPaymentLoanAmountByMonth)
                                  );
                                },
                                0
                              )
                            )
                          : getCommaString(
                              getFinalLoanResult.finalLoanResult.reduce(
                                function (prev, next) {
                                  return (
                                    prev +
                                    Number(
                                      next.fixedPrincipalPaymentLoanAmountFirstMonth
                                    )
                                  );
                                },
                                0
                              )
                            )}
                        원
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="verticalContainer">
              <Typography variant="h6">
                <QuestionIcon fill="#6e6d6d" />
                {"  "}위 계산된 데이터는 참고용입니다. 정확한 수치는 은행에 가서
                확인하셔야 해요
              </Typography>
            </div>
          </>
        )}
      </div>
      <div className="contentsArea">
        {totalLoanAmount !== 0 &&
          (Number(saveAmount) * 10000 - Number(getTotalPayment()) <= 0 ? (
            <>
              <Typography variant="h5" gutterBottom>
                현재 매월 {saveAmount}만원의 여유가 있어요.
              </Typography>
              <Typography variant="h5" gutterBottom>
                매월 {getCommaString(getTotalPayment())}원을 원리금으로 내기엔
                부족하네요 &#128517;
              </Typography>
              <div className="verticalContainer">
                <div>
                  <QuestionIcon fill="#6e6d6d" />{" "}
                </div>
                <Typography variant="h6" gutterBottom>
                  {"여윳돈으로 감당 가능한 대출금을 계산해볼까요?!"}
                </Typography>
                <div className="toggleButtonWrapper">
                  <ToggleButtonGroup
                    color="primary"
                    value={useOnlyExtraMoney.toString()}
                    size="small"
                    exclusive
                    onChange={(
                      event: React.MouseEvent<HTMLElement>,
                      newSelection: string
                    ) => {
                      if (newSelection !== null)
                        setUseOnlyExtraMoney(JSON.parse(newSelection));
                    }}
                    aria-label="Platform"
                  >
                    <ToggleButton value="true">적용</ToggleButton>
                    <ToggleButton value="false">미적용</ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </div>
            </>
          ) : (
            <>
              <Typography variant="h5" gutterBottom>
                현재 매월 {saveAmount}만원의 여유가 있어요.
              </Typography>
              <Typography variant="h5" gutterBottom>
                매월 {getCommaString(getTotalPayment())}원을 원리금으로 내고
                나면{" "}
                {getCommaString(
                  Number(saveAmount) * 10000 - Number(getTotalPayment())
                )}
                원이 남아요
              </Typography>
              <Typography variant="h5" gutterBottom>
                월 여유자금 중{" "}
                {(
                  (Number(getTotalPayment()) / (Number(saveAmount) * 10000)) *
                  100
                ).toFixed(2)}
                %를 원리금 상환에 사용하겠네요
              </Typography>
            </>
          ))}
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
        <form className="contact-form" onSubmit={sendEmail}>
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
              name="userEmail"
              value={userEmail}
              onChange={(e: any) => setUserEmail(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              size="small"
              sx={{ height: 40, ml: 1 }}
            >
              <input type={"hidden"} name="yearIncome" value={yearIncome} />
              <input
                type={"hidden"}
                name="birthday"
                value={birthday!.toString()}
              />
              <input
                type={"hidden"}
                name="supportAmount"
                value={supportAmount}
              />
              <input
                type={"hidden"}
                name="depositAmount"
                value={depositAmount}
              />

              <input
                type={"hidden"}
                name="getSoulGatheringAmount"
                value={getSoulGatheringAmount}
              />
              <input
                type={"hidden"}
                name="maxLoanAmountByLTV"
                value={(getMyAsset * getLtv) / (100 - getLtv)}
              />
              <input
                type={"hidden"}
                name="getMaxPropertyPriceByLTV"
                value={getMaxPropertyPriceByLTV}
              />

              <Typography variant="body1">등록</Typography>
            </Button>
          </div>
        </form>
        {showEmailSentInfo &&
          (isEmailSent ? (
            <div className="verticalContainer">
              <Typography gutterBottom>
                등록에 성공했습니다, 완성되는대로 메일드릴게요!
              </Typography>
            </div>
          ) : (
            <Typography gutterBottom>
              등록에 실패했습니다, 아래 메일로 문의 남겨주세요
            </Typography>
          ))}

        <div className="verticalContainer">
          <Typography gutterBottom>
            제안 또는 문의 사항이 있으시면 p9346420@gmail.com으로 메일 주세요!
          </Typography>
        </div>
      </div>
      <div className="contentsArea">
        <div className="linkContainer">
          <Link href={`/soulGatheringCalculator/knowingMyself`}>
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
        .descriptionArea {
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 480px;
        }
        .flexableArea {
          flex-wrap: wrap;
          flex-direction: row;
          max-width: 960px;
          display: flex;
        }
        .firstArea {
          padding: 0px;
          padding-top: 10px;
        }
        .seoulArea {
          padding-top: 0px;
        }
        .districtContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .districtContents {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .districtDescription {
          margin: 10px;
        }
        .topMargin10 {
          margin-top: 10px;
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
        .toggleButtonWrapper {
          margin: 5px 0px 5px 10px;
        }
      `}</style>
    </div>
  );
};

Result.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Result;
