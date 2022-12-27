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
  const [newLoan, setNewLoan] = useState<Loan>({
    amount: "",
    name: "",
    interest: "",
  });
  const [newLoanName, setNewLoanName] = useState<string>();
  const [newLoanAmount, setNewLoanAmount] = useState<string>();
  const [newLoanInterest, setNewLoanInterest] = useState<string>();

  const handleChangeNewLoanName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewLoan({ ...newLoan, name: event.target.value });
    // setNewLoanName(event.target.value);
  };

  const handleChangeNewLoanAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // setNewLoanAmount(event.target.value);
    setNewLoan({ ...newLoan, amount: event.target.value });
  };

  const handleChangeNewLoanInterest = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // setNewLoanInterest(event.target.value);
    setNewLoan({ ...newLoan, interest: event.target.value });
  };

  const wrapperBoxCss = {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "10px",
  };

  const onLoanUpdate = (index: number, key: string, value: string) => {
    if (key === "name") {
      props.setLoanList(
        props.loanList.map((loan, i) =>
          i === index ? { ...loan, name: value } : loan
        )
      );
    } else if (key === "amount") {
      props.setLoanList(
        props.loanList.map((loan, i) =>
          i === index ? { ...loan, amount: value } : loan
        )
      );
    } else if (key === "interest") {
      props.setLoanList(
        props.loanList.map((loan, i) =>
          i === index ? { ...loan, interest: value } : loan
        )
      );
    }
  };

  const onLoanAdd = () => {
    if (newLoan) {
      props.setLoanList([...props.loanList, newLoan]);
      setNewLoan({ name: "", amount: "", interest: "" });
    }
  };

  return (
    <>
      <div className="container">
        {props.loanList &&
          props.loanList.map((loan: Loan, index: number) => {
            return (
              <Box key={`loan${index}`} style={wrapperBoxCss}>
                <FormControl variant="standard">
                  <TextField
                    id="monthly-spending"
                    value={loan.name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onLoanUpdate(index, "name", event.target.value);
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
                      onLoanUpdate(index, "amount", event.target.value);
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
                    value={loan.interest}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onLoanUpdate(index, "interest", event.target.value);
                    }}
                  />
                </FormControl>
                <Button variant="text">삭제</Button>
              </Box>
            );
          })}
        {/* <Button variant="text" onClick={}>추가</Button> */}
        <Box style={wrapperBoxCss}>
          <FormControl variant="standard">
            <TextField
              id="monthly-spending"
              value={newLoan.name}
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
              value={newLoan.amount}
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
              value={newLoan.interest}
              onChange={handleChangeNewLoanInterest}
            />
          </FormControl>
          <Button
            disabled={
              newLoan.amount && newLoan.name && newLoan.interest ? false : true
            }
            variant="text"
            onClick={onLoanAdd}
          >
            추가
          </Button>
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
