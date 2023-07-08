import React, { useState } from "react";
import {
  FormControl,
  TextField,
  Box,
  InputLabel,
  InputAdornment,
  Button,
  OutlinedInput,
} from "@mui/material";
import { getNumericString, getCommaString } from '../utils/CommonUtils';
import { NumericFormat } from 'react-number-format';

export interface Loan {
  name: string;
  amount: string;
  interest: string;
  // TODO: 상환방식, 전체 기간, 남은 개월수
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

  const handleChangeNewLoanName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewLoan({ ...newLoan, name: event.target.value });
  };

  const handleChangeNewLoanAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const numericString = getNumericString(event.target.value)
    if (numericString !== "") {
      setNewLoan({ ...newLoan, amount: numericString });
    }
  };

  const handleChangeNewLoanInterest = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const numericString = getNumericString(event.target.value)
    if (numericString !== "") {
      setNewLoan({ ...newLoan, interest: numericString });
    }
  };

  const wrapperBoxCss = {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "10px",
  };

  const onDeleteLoan = (index: number) => {
    props.setLoanList(props.loanList.filter((loan, i) => i !== index));
  };

  const onLoanUpdate = (index: number, key: string, value: string) => {
    if (key === "name") {
      props.setLoanList(
        props.loanList.map((loan, i) =>
          i === index ? { ...loan, name: value } : loan
        )
      );
    }

    const numericString = getNumericString(value)
    if (numericString !== "") {
      if (key === "amount") {
        props.setLoanList(
          props.loanList.map((loan, i) =>
            i === index ? { ...loan, amount: numericString } : loan
          )
        );
      } else if (key === "interest") {
        props.setLoanList(
          props.loanList.map((loan, i) =>
            i === index ? { ...loan, interest: numericString } : loan
          )
        );
      }
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
                      console.log("triggered")
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
                    value={getCommaString(loan.amount)}
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
                    value={getCommaString(loan.interest)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onLoanUpdate(index, "interest", event.target.value);
                    }}
                  />
                </FormControl>
                <Button variant="text" onClick={() => { onDeleteLoan(index) }}>삭제</Button>
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
              value={getCommaString(newLoan.amount)}
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
              value={getCommaString(newLoan.interest)}
              onChange={handleChangeNewLoanInterest}
            />
          </FormControl>
          <FormControl variant="standard">
            {/* <InputLabel htmlFor="outlined-adornment-amount">
              reactNumberFormat
            </InputLabel> */}
            <NumericFormat
              label="보유 평단"
              customInput={TextField}
              style={{ margin: "5px" }}
              thousandSeparator={true}
              type="text"
              decimalSeparator="."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <div className="text-primary fw-700">원</div>
                  </InputAdornment>
                )
              }}
              onValueChange={
                (values: any) => {
                  const { formattedValue, value } = values;
                  console.log(value);
                  // setAvg(value);
                }
              }
            />
            <OutlinedInput
              id="outlined-adornment-amount"
              endAdornment={<InputAdornment position="start">%</InputAdornment>}
              label="Amount"
              value={getCommaString(newLoan.interest)}
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
