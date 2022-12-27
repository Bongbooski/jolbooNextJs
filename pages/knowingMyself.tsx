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
import { useRecoilState } from "recoil";

interface Movie {
  id: string;
  original_title: string;
  poster_path: string;
}

const Home = () => {
  // const [birthday, setBirthday] = useState<Dayjs | null>(null);
  const [birthday, setBirthday] = useRecoilState<Dayjs | null>(
    SampleState.birthday
  );
  // const [isMarried, setIsMarried] = useState<string | null>(null);
  const [isMarried, setIsMarried] = useRecoilState<string | null>(
    SampleState.isMarried
  );
  // const [isNewCouple, setIsNewCouple] = useState<boolean | null>(null);
  const [isNewCouple, setIsNewCouple] = useRecoilState<boolean | null>(
    SampleState.isNewCouple
  );
  // const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [isFirstTime, setIsFirstTime] = useRecoilState<boolean>(
    SampleState.isFirstTime
  );
  const [showSecondSection, setShowSecondSection] = useState<boolean | null>(
    null
  );
  // const [yearIncome, setYearIncome] = useState<string>();
  const [yearIncome, setYearIncome] = useRecoilState<string>(
    SampleState.yearIncome
  );
  // const [supportAmount, setSupportAmount] = useState<string>();
  const [supportAmount, setSupportAmount] = useRecoilState<string>(
    SampleState.supportAmount
  );
  // const [depositAmount, setDepositAmount] = useState<string>();
  const [depositAmount, setDepositAmount] = useRecoilState<string>(
    SampleState.depositAmount
  );

  // const [isSingleParent, setIsSingleParent] = useState<boolean>(false);
  const [isSingleParent, setIsSingleParent] = useRecoilState<boolean>(
    SampleState.isSingleParent
  );
  // const [isManyKids, setIsManyKids] = useState<boolean>(false);
  const [isManyKids, setIsManyKids] = useRecoilState<boolean>(
    SampleState.isManyKids
  );
  // const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useRecoilState<boolean>(
    SampleState.isDisabled
  );
  // const [isMultiCultural, setIsMultiCultural] = useState<boolean>(false);
  const [isMultiCultural, setIsMultiCultural] = useRecoilState<boolean>(
    SampleState.isMultiCultural
  );
  // const [havingNoHouse, setHavingNoHouse] = useState<boolean>(true);
  const [havingNoHouse, setHavingNoHouse] = useRecoilState<boolean>(
    SampleState.havingNoHouse
  );
  // const [kidsCount, setKidsCount] = useState<string>();
  const [kidsCount, setKidsCount] = useRecoilState<string>(
    SampleState.kidsCount
  );

  useEffect(() => {
    if (
      birthday !== null &&
      isMarried !== null &&
      yearIncome &&
      supportAmount &&
      depositAmount
    ) {
      setShowSecondSection(true);
    } else {
      setShowSecondSection(false);
    }
  }, [birthday, isMarried, yearIncome, supportAmount, depositAmount]);

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
  const handleChangeIsManyKids = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsManyKids(event.target.checked);
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

  const handleChangeIsMarried = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsMarried((event.target as HTMLInputElement).value);
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
      {/* <Seo title="나에 대하여" /> */}

      <Box className="birthdayWrapper" style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          생년월일을 입력해주세요
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="생년월일"
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
          결혼, 신혼여부
        </Typography>
        <FormControl>
          <RadioGroup
            value={isMarried}
            name="radio-buttons-group"
            style={radioGroupCss}
            onChange={handleChangeIsMarried}
          >
            <FormControlLabel
              value="married"
              control={<Radio />}
              label="결혼했어요"
            />
            <FormControlLabel
              value="notMarried"
              control={<Radio />}
              label="결혼안했어요"
            />
          </RadioGroup>
        </FormControl>

        {isMarried === "married" && (
          <FormControlLabel
            control={
              <Switch
                checked={isNewCouple}
                onChange={handleChangeIsNewCouple}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={isNewCouple ? "신혼이에요" : "신혼은 아니에요"}
          />
        )}
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          생애 최초 여부
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isFirstTime}
              onChange={handleChangeIsFirstTime}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label={isFirstTime ? "집 처음 사요" : "집 사본적 있어요"}
        />
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          연소득
        </Typography>
        <FormControl variant="standard">
          <Input
            id="year-income-amount"
            startAdornment={<InputAdornment position="start">₩</InputAdornment>}
            endAdornment={
              <InputAdornment position="start">만원</InputAdornment>
            }
            value={yearIncome}
            onChange={handleChangeYearIncome}
          />
        </FormControl>
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          은인들의 지원금
        </Typography>
        <FormControl variant="standard">
          <Input
            id="support-amount"
            startAdornment={<InputAdornment position="start">₩</InputAdornment>}
            endAdornment={
              <InputAdornment position="start">만원</InputAdornment>
            }
            value={supportAmount}
            onChange={handleChangeSupportAmount}
          />
        </FormControl>
      </Box>

      <Box style={wrapperBoxCss}>
        <Typography variant="h5" gutterBottom>
          저축액
        </Typography>
        <FormControl variant="standard">
          <Input
            id="deposit-amount"
            startAdornment={<InputAdornment position="start">₩</InputAdornment>}
            endAdornment={
              <InputAdornment position="start">만원</InputAdornment>
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
              한부모 가정 여부
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isSingleParent}
                  onChange={handleChangeIsSingleParent}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={isSingleParent ? "맞아요" : "아니에요"}
            />
          </Box>

          <Box style={wrapperBoxCss}>
            <Typography variant="h5" gutterBottom>
              다자녀 가구 여부
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isManyKids}
                  onChange={handleChangeIsManyKids}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={isManyKids ? "다자녀 가구에요" : "아니에요"}
            />
          </Box>
          {isManyKids && (
            <Box style={wrapperBoxCss}>
              <Typography variant="h5" gutterBottom>
                미성년 자녀수
              </Typography>
              <FormControl variant="standard">
                <Input
                  id="kids"
                  endAdornment={
                    <InputAdornment position="start">명</InputAdornment>
                  }
                  value={kidsCount}
                  onChange={handleChangeKidsCount}
                />
              </FormControl>
            </Box>
          )}

          <Box style={wrapperBoxCss}>
            <Typography variant="h5" gutterBottom>
              장애인 가구 여부
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isDisabled}
                  onChange={handleChangeIsDisabled}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={isDisabled ? "맞아요" : "아니에요"}
            />
          </Box>

          <Box style={wrapperBoxCss}>
            <Typography variant="h5" gutterBottom>
              다문화 가구 여부
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isMultiCultural}
                  onChange={handleChangeIsMultiCultural}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={isMultiCultural ? "맞아요" : "아니에요"}
            />
          </Box>

          <Box style={wrapperBoxCss}>
            <Typography variant="h5" gutterBottom>
              무주택 여부
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={havingNoHouse}
                  onChange={handleChangeHavingNoHouse}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={havingNoHouse ? "무주택이에요" : "무주택이 아니에요"}
            />
          </Box>

          <Button variant="contained" disableElevation>
            <Link href={`/knowingSpending`}>
              <h4>소비를 알아보자</h4>
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

// server side에서만 실행된다
// async는 필요없으면 안써도 됨, export, 함수명이 중요
// export const getServerSideProps = async () => {
//   const { results } = await (await fetch('http://localhost:3000/api/movies')).json();
//   return {
//     props: {
//       results,
//     }
//   }
// }
