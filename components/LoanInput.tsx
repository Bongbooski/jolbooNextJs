import { useState } from "react";
import Seo from "./Seo";
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
  OutlinedInput,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export interface Loan {
  name: string;
  amount: string;
  interest: string;
}

export interface LoanInputProps {
  loanList: Loan[];
  setLoanList: Function;
}

const LoanInput = (props: LoanInputProps) => {
  const [newLoan, setNewLoan] = useState<Loan>();
  const [newLoanName, setNewLoanName] = useState<string>();
  const [newLoanAmount, setNewLoanAmount] = useState<string>();
  const [newLoanInterest, setNewLoanInterest] = useState<string>();

  const handleChangeNewLoanName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewLoanName(event.target.value);
  };

  const handleChangeNewLoanAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewLoanAmount(event.target.value);
  };

  const handleChangeNewLoanInterest = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewLoanInterest(event.target.value);
  };

  return (
    <>
      <div className="container">
        {props.loanList.map((loan: Loan, index: number) => {
          return (
            <Box key={`loan${index}`}>
              <FormControl variant="standard">
                <TextField
                  id="monthly-spending"
                  value={loan.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.loanList[index].name = event.target.value;
                    // loan.name = event.target.value;
                    // console.log("loan:", loan);
                    // console.log("props.loanList:", props.loanList);
                    // props.setLoanList(props.loanList);
                  }}
                  label="대출이름"
                />
              </FormControl>
              <FormControl variant="standard">
                <InputLabel htmlFor="outlined-adornment-amount">
                  대출금액
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">₩</InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="start">만원</InputAdornment>
                  }
                  label="Amount"
                  value={loan.amount}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    loan.amount = event.target.value;
                  }}
                />
              </FormControl>
              <FormControl variant="standard">
                <InputLabel htmlFor="outlined-adornment-amount">
                  대출금리
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  endAdornment={
                    <InputAdornment position="start">%</InputAdornment>
                  }
                  label="Amount"
                  value={newLoanInterest}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    loan.interest = event.target.value;
                  }}
                />
              </FormControl>
              <Button variant="text">삭제</Button>
            </Box>
          );
        })}
        {/* <Button variant="text" onClick={}>추가</Button> */}
        <Box>
          <FormControl variant="standard">
            <TextField
              id="monthly-spending"
              value={newLoanName}
              onChange={handleChangeNewLoanName}
              label="대출이름"
            />
          </FormControl>
          <FormControl variant="standard">
            <InputLabel htmlFor="outlined-adornment-amount">
              대출금액
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">₩</InputAdornment>
              }
              endAdornment={
                <InputAdornment position="start">만원</InputAdornment>
              }
              label="Amount"
              value={newLoanAmount}
              onChange={handleChangeNewLoanAmount}
            />
          </FormControl>
          <FormControl variant="standard">
            <InputLabel htmlFor="outlined-adornment-amount">
              대출금리
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              endAdornment={<InputAdornment position="start">%</InputAdornment>}
              label="Amount"
              value={newLoanInterest}
              onChange={handleChangeNewLoanInterest}
            />
          </FormControl>
        </Box>
        <style jsx>{`
          .birthdayWrapper {
            display: flex;
          }
        `}</style>
      </div>
    </>
  );
};

export default LoanInput;
