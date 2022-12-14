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

  // ????????? ?????? ??? ?????? ??????
  const calculateFixedPaymentLoanAmountByMonth = (): number => {
    const loanYear = Number.parseInt(borrowingYear);
    const totalLoanAmount = getSoulGatheringAmount * 10000 * loanYear;
    const loanRate = 2.5;

    // AB(1 + B)^n / (1 + B)^n - 1
    // A: ???????????? ??????
    // B: ????????? ?????? ?????????(???????????? / 12)
    // n: ?????? ?????? ?????? ???
    const A = totalLoanAmount;
    const B = loanRate / 100 / 12;
    const n = loanYear * 12;

    return Math.ceil((A * B * (1 + B) ** n) / ((1 + B) ** n - 1));
  };

  // ?????? ?????? ??? ??? ?????? ??????
  const calculateFixedPrincipalPaymentLoanAmountFirstMonth = (): number => {
    const loanYear = Number.parseInt(borrowingYear);
    const loanMonth = Number.parseInt(borrowingYear) * 12;
    const totalLoanAmount = getSoulGatheringAmount * 10000 * loanYear;
    const loanRate = 2.5;

    // ?????? ?????? ?????? : ????????? / ??????
    // ?????? ?????? ?????? : ????????? * (???????????? / 100 / 12)

    return Math.ceil(
      totalLoanAmount / loanMonth + totalLoanAmount * (loanRate / 100 / 12)
    );
  };

  return (
    <div className="container">
      <Seo title="????????? ?????????" />

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          ??? ????????????
        </Typography>
        <FormControl variant="standard">
          <Input
            id="monthly-spending"
            startAdornment={<InputAdornment position="start">???</InputAdornment>}
            endAdornment={
              <InputAdornment position="start">??????</InputAdornment>
            }
            value={monthlySpending}
            onChange={handleChangeMonthlySpending}
          />
        </FormControl>
      </Box>

      <LoanInput loanList={residualLoan} setLoanList={setResidualLoan} />

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          ?????? ?????? ?????????
        </Typography>
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={borrowingYear}
            onChange={handleChangeBorrowingYear}
          >
            <MenuItem value={"10"}>10??????</MenuItem>
            <MenuItem value={"15"}>15??????</MenuItem>
            <MenuItem value={"20"}>20??????</MenuItem>
            <MenuItem value={"30"}>30??????</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          ???????????? ?????? ?????????
        </Typography>
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={confirmingLoanBank}
            onChange={handleChangeConfirmingLoanBank}
          >
            {/* <MenuItem value={ConfirmingLoanBank.BUSAN}>????????????</MenuItem> */}
            <MenuItem value={ConfirmingLoanBank.GYEONG_NAM}>????????????</MenuItem>
            <MenuItem value={ConfirmingLoanBank.NONGHYUP}>??????</MenuItem>
            <MenuItem value={ConfirmingLoanBank.HANA}>????????????</MenuItem>
            <MenuItem value={ConfirmingLoanBank.JEJU}>????????????</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          ?????????
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleDidimdol ? "??????" : "?????????"}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {getDidimdolInterest}%
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleDidimdol ? `${getDidimdolLimit}???` : "0???"}
          {internationalAge}???
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          ????????????
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleHomeLoan ? "??????" : "?????????"}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleHomeLoan ? `${getHomeLoanInterest}%` : ""}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleHomeLoan ? `${getHomeLoanLimit}???` : "0???"}
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          ??????
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleConfirmingLoan ? "??????" : "?????????"}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {getConfirmingLoanInterest}%
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {isAbleConfirmingLoan ? `${getConfirmingLoanLimit}???` : "0???"}
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          ???????????????
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          ??????
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
          ????????????????????? ????????????:
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {getSoulGatheringAmount}??????
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          ?????????????????? ????????????:
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {(getSoulGatheringAmount * Number.parseInt(borrowingYear)) / 10000}
          ??????
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          ??? ?????? ??????(???????????????)
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {calculateFixedPaymentLoanAmountByMonth()}???
        </Typography>
      </Box>
      <Box style={wrapperBoxCss}>
        <Typography variant="subtitle2" gutterBottom>
          ??? ?????? ??????(????????????)
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {calculateFixedPrincipalPaymentLoanAmountFirstMonth()}???
        </Typography>
      </Box>
      <Button variant="contained" disableElevation>
        <Link href={`/knowingMyself`}>
          <h4>????????????(?????? ?????? ????????????)</h4>
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
