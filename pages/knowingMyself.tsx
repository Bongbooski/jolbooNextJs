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
import { SampleState } from "../state/SampleState";
import { KnowingState } from "../state/KnowingState";
import { useRecoilState, useRecoilValue } from "recoil";

interface Movie {
  id: string;
  original_title: string;
  poster_path: string;
}

const Home = () => {
  // const [birthday, setBirthday] = useState<Dayjs | null>(null);
  const [birthday, setBirthday] = useRecoilState<Dayjs | null>(
    KnowingState.birthday
  );
  // const [isMarriedValue, setisMarriedValue] = useState<string | null>(null);
  const [isMarriedValue, setisMarriedValue] = useRecoilState<string | null>(
    KnowingState.isMarriedValue
  );
  // const [isNewCouple, setIsNewCouple] = useState<boolean | null>(null);
  const [isNewCouple, setIsNewCouple] = useRecoilState<boolean | null>(
    KnowingState.isNewCouple
  );
  // const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [isFirstTime, setIsFirstTime] = useRecoilState<boolean>(
    KnowingState.isFirstTime
  );
  const [showSecondSection, setShowSecondSection] = useState<boolean | null>(
    null
  );
  // const [yearIncome, setYearIncome] = useState<string>();
  const [yearIncome, setYearIncome] = useRecoilState<string>(
    KnowingState.yearIncome
  );
  // const [supportAmount, setSupportAmount] = useState<string>();
  const [supportAmount, setSupportAmount] = useRecoilState<string>(
    KnowingState.supportAmount
  );
  // const [depositAmount, setDepositAmount] = useState<string>();
  const [depositAmount, setDepositAmount] = useRecoilState<string>(
    KnowingState.depositAmount
  );

  // const [isSingleParent, setIsSingleParent] = useState<boolean>(false);
  const [isSingleParent, setIsSingleParent] = useRecoilState<boolean>(
    KnowingState.isSingleParent
  );
  // const [isHavingKids, setisHavingKids] = useState<boolean>(false);
  const [isHavingKids, setisHavingKids] = useRecoilState<boolean>(
    KnowingState.isHavingKids
  );
  // const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useRecoilState<boolean>(
    KnowingState.isDisabled
  );
  // const [isMultiCultural, setIsMultiCultural] = useState<boolean>(false);
  const [isMultiCultural, setIsMultiCultural] = useRecoilState<boolean>(
    KnowingState.isMultiCultural
  );
  // const [havingNoHouse, setHavingNoHouse] = useState<boolean>(true);
  const [havingNoHouse, setHavingNoHouse] = useRecoilState<boolean>(
    KnowingState.havingNoHouse
  );
  // const [kidsCount, setKidsCount] = useState<string>();
  const [kidsCount, setKidsCount] = useRecoilState<string>(
    KnowingState.kidsCount
  );

  const isMarried = useRecoilValue<boolean>(KnowingState.isMarried);

  useEffect(() => {
    if (
      birthday !== null &&
      isMarriedValue !== null &&
      yearIncome &&
      supportAmount &&
      depositAmount
    ) {
      setShowSecondSection(true);
    } else {
      setShowSecondSection(false);
    }
  }, [birthday, isMarriedValue, yearIncome, supportAmount, depositAmount]);

  const handleChangeKidsCount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKidsCount(event.target.value);
  };

  const handleChangeIsSingleParent = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsSingleParent(event.target.checked);
  };
  const handleChangeisHavingKids = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setisHavingKids(event.target.checked);
  };
  const handleChangeIsDisabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsDisabled(event.target.checked);
  };
  const handleChangeIsMultiCultural = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsMultiCultural(event.target.checked);
  };
  const handleChangeHavingNoHouse = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHavingNoHouse(event.target.checked);
  };

  const handleChangeisMarriedValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setisMarriedValue((event.target as HTMLInputElement).value);
    setIsNewCouple(false);
  };

  const handleChangeIsNewCouple = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsNewCouple(event.target.checked);
  };

  const handleChangeIsFirstTime = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsFirstTime(event.target.checked);
  };

  const handleChangeYearIncome = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setYearIncome(event.target.value);
  };

  const handleChangeSupportAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSupportAmount(event.target.value);
  };

  const handleChangeDepositAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepositAmount(event.target.value);
  };

  const radioGroupCss = {
    display: "flex",
    flexDirection: "row",
  };

  const wrapperBoxCss = {
    display: "flex",
    justifyContent: "space-between",
  };

  return (
    <div className="container">
      {/* <Seo title="?????? ?????????" /> */}

      <Box className="birthdayWrapper" style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          ??????????????? ??????????????????
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="????????????"
            value={birthday}
            onChange={(newValue) => {
              setBirthday(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          ??????, ????????????
        </Typography>
        <FormControl>
          <RadioGroup
            value={isMarriedValue}
            name="radio-buttons-group"
            style={radioGroupCss}
            onChange={handleChangeisMarriedValue}
          >
            <FormControlLabel
              value="married"
              control={<Radio />}
              label="???????????????"
            />
            <FormControlLabel
              value="notMarried"
              control={<Radio />}
              label="??????????????????"
            />
          </RadioGroup>
        </FormControl>

        {isMarried && (
          <FormControlLabel
            control={
              <Switch
                checked={isNewCouple}
                onChange={handleChangeIsNewCouple}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={isNewCouple ? "???????????????" : "????????? ????????????"}
          />
        )}
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          ?????? ?????? ??????
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isFirstTime}
              onChange={handleChangeIsFirstTime}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label={isFirstTime ? "??? ?????? ??????" : "??? ????????? ?????????"}
        />
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          ?????????
        </Typography>
        <FormControl variant="standard">
          <Input
            id="year-income-amount"
            startAdornment={<InputAdornment position="start">???</InputAdornment>}
            endAdornment={
              <InputAdornment position="start">??????</InputAdornment>
            }
            value={yearIncome}
            onChange={handleChangeYearIncome}
          />
        </FormControl>
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          ???????????? ?????????
        </Typography>
        <FormControl variant="standard">
          <Input
            id="support-amount"
            startAdornment={<InputAdornment position="start">???</InputAdornment>}
            endAdornment={
              <InputAdornment position="start">??????</InputAdornment>
            }
            value={supportAmount}
            onChange={handleChangeSupportAmount}
          />
        </FormControl>
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          ?????????
        </Typography>
        <FormControl variant="standard">
          <Input
            id="deposit-amount"
            startAdornment={<InputAdornment position="start">???</InputAdornment>}
            endAdornment={
              <InputAdornment position="start">??????</InputAdornment>
            }
            value={depositAmount}
            onChange={handleChangeDepositAmount}
          />
        </FormControl>
      </Box>
      {showSecondSection && (
        <>
          <Box style={wrapperBoxCss}>
            <Typography variant="h5" gutterBottom>
              ????????? ?????? ??????
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isSingleParent}
                  onChange={handleChangeIsSingleParent}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={isSingleParent ? "?????????" : "????????????"}
            />
          </Box>

          <Box style={wrapperBoxCss}>
            <Typography variant="h5" gutterBottom>
              ?????? ?????? ??????
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isHavingKids}
                  onChange={handleChangeisHavingKids}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={isHavingKids ? "????????? ????????????" : "????????????"}
            />
          </Box>
          {isHavingKids && (
            <Box style={wrapperBoxCss}>
              <Typography variant="h5" gutterBottom>
                ?????????
              </Typography>
              <FormControl variant="standard">
                <Input
                  id="kids"
                  endAdornment={
                    <InputAdornment position="start">???</InputAdornment>
                  }
                  value={kidsCount}
                  onChange={handleChangeKidsCount}
                />
              </FormControl>
            </Box>
          )}

          <Box style={wrapperBoxCss}>
            <Typography variant="h5" gutterBottom>
              ????????? ?????? ??????
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isDisabled}
                  onChange={handleChangeIsDisabled}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={isDisabled ? "?????????" : "????????????"}
            />
          </Box>

          <Box style={wrapperBoxCss}>
            <Typography variant="h5" gutterBottom>
              ????????? ?????? ??????
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isMultiCultural}
                  onChange={handleChangeIsMultiCultural}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={isMultiCultural ? "?????????" : "????????????"}
            />
          </Box>

          <Box style={wrapperBoxCss}>
            <Typography variant="h5" gutterBottom>
              ????????? ??????
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={havingNoHouse}
                  onChange={handleChangeHavingNoHouse}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={havingNoHouse ? "??????????????????" : "???????????? ????????????"}
            />
          </Box>

          <Button variant="contained" disableElevation>
            <Link href={`/knowingSpending`}>
              <h4>????????? ????????????</h4>
            </Link>
          </Button>
        </>
      )}
      <style jsx>{`
        .birthdayWrapper {
          display: flex;
        }
        /* .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 20px;
          gap: 20px;
        }
        .movie{
          cursor: pointer
        }
        .movie img {
          max-width: 100%;
          border-radius: 12px;
          transition: transform 0.2s ease-in-out;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        }
        .movie:hover img {
          transform: scale(1.05) translateY(-10px);
        }
        .movie h4 {
          font-size: 18px;
          text-align: center;
        } */
      `}</style>
    </div>
  );
};

export default Home;

// server side????????? ????????????
// async??? ??????????????? ????????? ???, export, ???????????? ??????
// export const getServerSideProps = async () => {
//   const { results } = await (await fetch('http://localhost:3000/api/movies')).json();
//   return {
//     props: {
//       results,
//     }
//   }
// }
