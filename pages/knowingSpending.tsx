import { useEffect, useState } from "react";
import Seo from "../components/Seo";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
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

interface Loan {
  name: string;
  amount: string;
  interest: string;
}

enum ConfirmingLoanBank {
  BUSAN = "부산",
  GYEONG_NAM = "경남",
  NONGHYUP = "농협",
  HANA = "하나",
  JEJU = "제주",
}

const Home = () => {
  const [monthlySpending, setMonthlySpending] = useState<string>();
  const [residualLoan, setResidualLoan] = useState<Loan[]>([]);
  const [borrowingYear, setBorrowingYear] = useState<string>("10");
  const [confirmingLoanBank, setConfirmingLoanBank] =
    useState<ConfirmingLoanBank>(ConfirmingLoanBank.BUSAN);

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
            <MenuItem value={ConfirmingLoanBank.BUSAN}>부산은행</MenuItem>
            <MenuItem value={ConfirmingLoanBank.GYEONG_NAM}>경남은행</MenuItem>
            <MenuItem value={ConfirmingLoanBank.NONGHYUP}>농협</MenuItem>
            <MenuItem value={ConfirmingLoanBank.HANA}>하나은행</MenuItem>
            <MenuItem value={ConfirmingLoanBank.JEJU}>제주은행</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <style jsx>{`
        .birthdayWrapper {
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default Home;
