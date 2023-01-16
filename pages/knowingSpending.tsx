import { useState } from "react";
import Seo from "../components/Seo";
import Link from "next/link";
import {
  FormControlLabel,
  FormControl,
  Typography,
  TextField,
  Box,
  RadioGroup,
  Radio,
  Switch,
  InputLabel,
  Input,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LoanInput from "../components/LoanInput";
import { useRecoilState, useRecoilValue } from "recoil";
import { KnowingState } from "../state/KnowingState";
import { ConfirmingLoanBank } from "../constants/Common";
import { LoanResult } from "../constants/Loan";

interface Loan {
  name: string;
  amount: string;
  interest: string;
}

const Home = () => {
  // const [monthlySpending, setMonthlySpending] = useState<string>();
  const [monthlySpending, setMonthlySpending] = useRecoilState<string>(
    KnowingState.monthlySpending
  );

  // const [residualLoan, setResidualLoan] = useState<Loan[]>([]);
  const [residualLoan, setResidualLoan] = useRecoilState<Loan[]>(
    KnowingState.residualLoan
  );

  // const [borrowingYear, setBorrowingYear] = useState<string>("10");
  const [borrowingYear, setBorrowingYear] = useRecoilState<string>(
    KnowingState.borrowingYear
  );

  //  const [confirmingLoanBank, setConfirmingLoanBank] =
  //   useState<ConfirmingLoanBank>(ConfirmingLoanBank.BUSAN);
  const [confirmingLoanBank, setConfirmingLoanBank] =
    useRecoilState<ConfirmingLoanBank>(KnowingState.confirmingLoanBank);

  const isAbleDidimdol = useRecoilValue<boolean>(KnowingState.isAbleDidimdol);
  const getDidimdolInterest = useRecoilValue<boolean>(
    KnowingState.getDidimdolInterest
  );

  const isAbleHomeLoan = useRecoilValue<boolean>(KnowingState.isAbleHomeLoan);
  const getHomeLoanInterest = useRecoilValue<boolean>(
    KnowingState.getHomeLoanInterest
  );
  const getHomeLoanLimit = useRecoilValue<number>(
    KnowingState.getHomeLoanLimit
  );

  const getConfirmingLoanInterest = useRecoilValue<boolean>(
    KnowingState.getConfirmingLoanInterest
  );

  const isAbleConfirmingLoan = useRecoilValue<boolean>(
    KnowingState.isAbleConfirmingLoan
  );
  const getDidimdolLimit = useRecoilValue<number>(
    KnowingState.getDidimdolLimit
  );
  const internationalAge = useRecoilValue<number>(
    KnowingState.internationalAge
  );
  const getConfirmingLoanLimit = useRecoilValue<number>(
    KnowingState.getConfirmingLoanLimit
  );

  const getSoulGatheringAmount = useRecoilValue<number>(
    KnowingState.getSoulGatheringAmount
  );

  const getMaxPropertyPriceByLTV = useRecoilValue<number>(
    KnowingState.getMaxPropertyPriceByLTV
  );

  const getLoanResult = useRecoilValue<Array<LoanResult>>(
    KnowingState.getLoanResult
  );

  const handleChangeMonthlySpending = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMonthlySpending(event.target.value);
  };

  const handleChangeBorrowingYear = (event: SelectChangeEvent) => {
    setBorrowingYear(event.target.value);
  };

  const handleChangeConfirmingLoanBank = (event: SelectChangeEvent) => {
    setConfirmingLoanBank(event.target.value as ConfirmingLoanBank);
  };

  const radioGroupCss = {
    display: "flex",
    flexDirection: "row",
  };

  const wrapperBoxCss = {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "10px",
  };

  // 원리금 균등 월 상환 금액
  const calculateFixedPaymentLoanAmountByMonth = (): number => {
    const loanYear = Number.parseInt(borrowingYear);
    const totalLoanAmount = getSoulGatheringAmount * 10000 * loanYear;
    const loanRate = 2.5;

    // AB(1 + B)^n / (1 + B)^n - 1
    // A: 대출받은 원금
    // B: 대출에 대한 이자율(연이자율 / 12)
    // n: 대출 상환 개월 수
    const A = totalLoanAmount;
    const B = loanRate / 100 / 12;
    const n = loanYear * 12;

    return Math.ceil((A * B * (1 + B) ** n) / ((1 + B) ** n - 1));
  };

  // 원금 균등 첫 달 상환 금액
  const calculateFixedPrincipalPaymentLoanAmountFirstMonth = (): number => {
    const loanYear = Number.parseInt(borrowingYear);
    const loanMonth = Number.parseInt(borrowingYear) * 12;
    const totalLoanAmount = getSoulGatheringAmount * 10000 * loanYear;
    const loanRate = 2.5;

    // 첫달 갚을 원금 : 대출금 / 개월
    // 첫달 갚을 이자 : 대출금 * (연이자율 / 100 / 12)

    return Math.ceil(
      totalLoanAmount / loanMonth + totalLoanAmount * (loanRate / 100 / 12)
    );
  };

  return (
    <div className="container">
      <Seo title="소비에 대하여" />

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          월 소비금액
        </Typography>
        <FormControl variant="standard">
          <Input
            id="monthly-spending"
            startAdornment={<InputAdornment position="start">₩</InputAdornment>}
            endAdornment={
              <InputAdornment position="start">만원</InputAdornment>
            }
            value={monthlySpending}
            onChange={handleChangeMonthlySpending}
          />
        </FormControl>
      </Box>

      <LoanInput loanList={residualLoan} setLoanList={setResidualLoan} />

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          대출 갚을 기간은
        </Typography>
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={borrowingYear}
            onChange={handleChangeBorrowingYear}
          >
            <MenuItem value={"10"}>10년간</MenuItem>
            <MenuItem value={"15"}>15년간</MenuItem>
            <MenuItem value={"20"}>20년간</MenuItem>
            <MenuItem value={"30"}>30년간</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          적격대출 받게 된다면
        </Typography>
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={confirmingLoanBank}
            onChange={handleChangeConfirmingLoanBank}
          >
            {/* <MenuItem value={ConfirmingLoanBank.BUSAN}>부산은행</MenuItem> */}
            <MenuItem value={ConfirmingLoanBank.GYEONG_NAM}>경남은행</MenuItem>
            <MenuItem value={ConfirmingLoanBank.NONGHYUP}>농협</MenuItem>
            <MenuItem value={ConfirmingLoanBank.HANA}>하나은행</MenuItem>
            <MenuItem value={ConfirmingLoanBank.JEJU}>제주은행</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          디딤돌
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleDidimdol ? "가능" : "불가능"}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {getDidimdolInterest}%
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleDidimdol ? `${getDidimdolLimit}억` : "0원"}
          {internationalAge}세
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          보금자리
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleHomeLoan ? "가능" : "불가능"}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleHomeLoan ? `${getHomeLoanInterest}%` : ""}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleHomeLoan ? `${getHomeLoanLimit}억` : "0원"}
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          적격
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleConfirmingLoan ? "가능" : "불가능"}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {getConfirmingLoanInterest}%
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleConfirmingLoan ? `${getConfirmingLoanLimit}억` : "0원"}
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          일반주담대
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          가능
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          2.75
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          2.5
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          연간원리금상환 가능금액:
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {getSoulGatheringAmount}만원
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          총원리금상환 가능금액:
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {(getSoulGatheringAmount * Number.parseInt(borrowingYear)) / 10000}
          억원
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          월 상환 금액(원리금균등)
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {calculateFixedPaymentLoanAmountByMonth()}원
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          월 상환 금액(원금균등)
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {calculateFixedPrincipalPaymentLoanAmountFirstMonth()}원
        </Typography>
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          LTV 80기준 최대 주택 가격
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {getMaxPropertyPriceByLTV / 10000}억원
        </Typography>
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        대출 구성
      </Typography>
      {getLoanResult.map((result) => (
        <Box key={`loan_${result.name}`} style={wrapperBoxCss}>
          <Typography variant="subtitle2" gutterBottom>
            {result.name}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            {result.interest}%
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            대출금: {result.loanAmount}억원
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            대출이자: {result.interestAmount}억원
          </Typography>
        </Box>
      ))}

      <Button variant="contained" disableElevation>
        <Link href={`/knowingMyself`}>
          <h4>뒤로가기(나를 좀더 알아보기)</h4>
        </Link>
      </Button>
      <style jsx>{`
        .birthdayWrapper {
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default Home;
