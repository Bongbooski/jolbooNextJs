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
import { ConfirmingLoanBank, FinalLoanResult } from "../constants/Common";
import { LoanResult } from "../constants/Loan";
import { getCommaString } from "../utils/CommonUtils";
import { NormalLoanInterest } from "../constants/Interests";

interface Loan {
  name: string;
  amount: string;
  interest: string;
}

const Home = () => {
  const [monthlySpending, setMonthlySpending] = useRecoilState<string>(
    KnowingState.monthlySpending
  );

  const [residualLoan, setResidualLoan] = useRecoilState<Loan[]>(
    KnowingState.residualLoan
  );

  const [borrowingYear, setBorrowingYear] = useRecoilState<string>(
    KnowingState.borrowingYear
  );

  const [confirmingLoanBank, setConfirmingLoanBank] =
    useRecoilState<ConfirmingLoanBank>(KnowingState.confirmingLoanBank);

  const isAbleDidimdol = useRecoilValue<boolean>(KnowingState.isAbleDidimdol);
  const getDidimdolInterest = useRecoilValue<string | undefined>(
    KnowingState.getDidimdolInterest
  );

  // const isAbleHomeLoan = useRecoilValue<boolean>(KnowingState.isAbleHomeLoan);
  // const getHomeLoanInterest = useRecoilValue<boolean>(
  //   KnowingState.getHomeLoanInterest
  // );
  // const getHomeLoanLimit = useRecoilValue<number>(
  //   KnowingState.getHomeLoanLimit
  // );

  const isAbleSpecialHomeLoan = useRecoilValue<boolean>(
    KnowingState.isAbleSpecialHomeLoan
  );

  const getSpecialHomeLoanInterest = useRecoilValue<string | undefined>(
    KnowingState.getSpecialHomeLoanInterest
  );

  const getSpecialHomeLoanLimit = useRecoilValue<number>(
    KnowingState.getSpecialHomeLoanLimit
  );

  const getConfirmingLoanInterest = useRecoilValue<number | undefined>(
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

  const getMaxPropertyPriceByLTV = useRecoilValue<string>(
    KnowingState.getMaxPropertyPriceByLTV
  );

  const getLtv = useRecoilValue<number>(KnowingState.getLtv);
  const getMyAsset = useRecoilValue<number>(KnowingState.getMyAsset);

  const getFinalLoanResult = useRecoilValue<FinalLoanResult>(
    KnowingState.getFinalLoanResult
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
          특례보금자리
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleSpecialHomeLoan ? "가능" : "불가능"}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleSpecialHomeLoan ? `${getSpecialHomeLoanInterest}%` : ""}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleSpecialHomeLoan ? `${getSpecialHomeLoanLimit}억` : "0원"}
        </Typography>
      </Box>
      {/* <Box style={wrapperBoxCss}>
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
      </Box> */}
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          일반주담대
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          가능
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {NormalLoanInterest}%
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          없음
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
          LTV {getLtv}% 기준 최대 주택 가격
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {getMaxPropertyPriceByLTV}억원
        </Typography>
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          LTV {getLtv}% 기준 최대 대출원금
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {((getMyAsset * getLtv) / (100 - getLtv)).toFixed(2)}억원
        </Typography>
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        대출 구성
      </Typography>
      {getFinalLoanResult.finalLoanResult.map((result) => (
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
          <Typography variant="subtitle2" gutterBottom>
            월상환액(원금균등):{" "}
            {getCommaString(result.fixedPaymentLoanAmountByMonth)}원
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            월상환액(원금리균등):{" "}
            {getCommaString(result.fixedPrincipalPaymentLoanAmountFirstMonth)}원
          </Typography>
        </Box>
      ))}

      <Button variant="contained" disableElevation>
        <Link href={`/knowingMyself`}>
          <h4>뒤로가기(나를 좀더 알아보기)</h4>
        </Link>
      </Button>
      <Button variant="contained" disableElevation>
        <Link href={`/result`}>
          <h4>결과보기</h4>
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
