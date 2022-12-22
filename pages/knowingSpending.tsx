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
} from "@mui/material";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LoanInput from "../components/\bLoanInput";

interface Loan {
  name: string;
  amount: string;
  interest: string;
}

const Home = () => {
  const [monthlySpending, setMonthlySpending] = useState<string>();
  const [residualLoan, setResidualLoan] = useState<Loan[]>([
    {
      name: "신용대출",
      amount: "4000",
      interest: "3",
    },
  ]);

  useEffect(() => {
    setResidualLoan(residualLoan);
  }, [residualLoan]);

  const handleChangeMonthlySpending = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMonthlySpending(event.target.value);
  };

  const radioGroupCss = {
    display: "flex",
    flexDirection: "row",
  };

  const wrapperBoxCss = {
    display: "flex",
    justifyContent: "space-between",
  };

  //   월 소비금액
  // 기존 대출 잔액
  // 기존 대출 금리
  // 대출갚을 기간
  // 적격대출은행
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

      <LoanInput
        loanList={residualLoan}
        setLoanList={setResidualLoan}
      ></LoanInput>
      <style jsx>{`
        .birthdayWrapper {
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default Home;
