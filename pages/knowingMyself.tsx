import { ReactElement, useEffect, useState } from "react";
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
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { KnowingState } from "../state/KnowingState";
import { useRecoilState, useRecoilValue } from "recoil";
import type { NextPageWithLayout } from "./_app";
import HeaderLayout from "../components/layout/HeaderLayout";
import SurveyContents from "../components/SurveyContents";
import SurveyContentsGroup from "../components/SurveyContentsGroup";
import { getCommaString } from "../utils/CommonUtils";
import { PaymentType } from "../constants/Common";

interface Movie {
  id: string;
  original_title: string;
  poster_path: string;
}

const Home: NextPageWithLayout = () => {
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

  const [borrowingYear, setBorrowingYear] = useRecoilState<string>(
    KnowingState.borrowingYear
  );

  const isMarried = useRecoilValue<boolean>(KnowingState.isMarried);

  const [paymentType, setPaymentType] = useRecoilState<PaymentType>(
    KnowingState.paymentType
  );

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
    setYearIncome(event.target.value.replaceAll(",", ""));
  };

  const handleChangeSupportAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSupportAmount(event.target.value.replaceAll(",", ""));
  };

  const handleChangeDepositAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepositAmount(event.target.value.replaceAll(",", ""));
  };

  const handleChangeBorrowingYear = (event: SelectChangeEvent) => {
    setBorrowingYear(event.target.value);
  };

  const handleResult = (event: React.MouseEvent<HTMLElement>) => {
    if (
      !textfieldNumberValidation(yearIncome) ||
      yearIncome === "0" ||
      !textfieldNumberValidation(supportAmount) ||
      !textfieldNumberValidation(depositAmount)
    ) {
      event.preventDefault();
    }
  };

  const textfieldNumberValidation = (value: string) => {
    const reg = /^[0-9]+$/;
    return reg.test(value);
  };

  const singleParentMultiCultureDisabled: string[] = [];

  if (isSingleParent) singleParentMultiCultureDisabled.push("singleParent");
  if (isMultiCultural) singleParentMultiCultureDisabled.push("multiCultural");
  if (isDisabled) singleParentMultiCultureDisabled.push("disabled");

  return (
    <div className="container">
      <SurveyContents title={"생년월일이 어떻게 되나요?"}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="생년월일"
            value={birthday}
            onChange={(newValue) => {
              setBirthday(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
            inputFormat="YYYY/MM/DD"
          />
        </LocalizationProvider>
      </SurveyContents>

      <SurveyContents
        title={"결혼 하셨나요?"}
        description="집을 구매 할 때는 혼인신고를 한 경우에만 결혼으로 판단해요"
      >
        <ToggleButtonGroup
          color="primary"
          value={isMarriedValue}
          exclusive
          onChange={(
            event: React.MouseEvent<HTMLElement>,
            newSelection: string
          ) => {
            if (newSelection !== null) setisMarriedValue(newSelection);
          }}
          aria-label="Platform"
        >
          <ToggleButton value="married">결혼했어요</ToggleButton>
          <ToggleButton value="notMarried">결혼안했어요</ToggleButton>
        </ToggleButtonGroup>
      </SurveyContents>
      {isMarried && (
        <SurveyContents
          title={"신혼인가요?"}
          description={"부동산에서는 혼인신고한지 7년 이내일 경우 신혼이예요"}
        >
          <ToggleButtonGroup
            color="primary"
            value={isNewCouple!.toString()}
            exclusive
            onChange={(
              event: React.MouseEvent<HTMLElement>,
              newSelection: string
            ) => {
              if (newSelection !== null)
                setIsNewCouple(JSON.parse(newSelection));
            }}
            aria-label="Platform"
          >
            <ToggleButton value="true">신혼이예요</ToggleButton>
            <ToggleButton value="false">신혼은 아니예요</ToggleButton>
          </ToggleButtonGroup>
        </SurveyContents>
      )}

      <SurveyContents title={"생애 최초로 주택을 구매하시나요?"}>
        <ToggleButtonGroup
          color="primary"
          value={isFirstTime.toString()}
          exclusive
          onChange={(
            event: React.MouseEvent<HTMLElement>,
            newSelection: string
          ) => {
            if (newSelection !== null) setIsFirstTime(JSON.parse(newSelection));
          }}
          aria-label="Platform"
        >
          <ToggleButton value="true">집 처음사요</ToggleButton>
          <ToggleButton value="false">집 사본적 있어요</ToggleButton>
        </ToggleButtonGroup>
      </SurveyContents>

      <SurveyContents title={"현재 무주택인가요?"}>
        <ToggleButtonGroup
          color="primary"
          value={havingNoHouse.toString()}
          exclusive
          onChange={(
            event: React.MouseEvent<HTMLElement>,
            newSelection: string
          ) => {
            if (newSelection !== null)
              setHavingNoHouse(JSON.parse(newSelection));
          }}
          aria-label="Platform"
        >
          <ToggleButton value="true">무주택이예요</ToggleButton>
          <ToggleButton value="false">무주택 아니예요</ToggleButton>
        </ToggleButtonGroup>
      </SurveyContents>

      <SurveyContents
        title={"연소득은 얼마인가요?"}
        description="세전 소득을 입력해주세요. 맞벌이일경우 합친 소득을 입력해주세요"
      >
        <TextField
          value={getCommaString(yearIncome)}
          onChange={handleChangeYearIncome}
          InputProps={{
            startAdornment: <InputAdornment position="start">₩</InputAdornment>,
            endAdornment: (
              <InputAdornment position="start">만원</InputAdornment>
            ),
          }}
          variant="standard"
          error={!textfieldNumberValidation(yearIncome) || yearIncome === "0"}
          helperText={
            !textfieldNumberValidation(yearIncome)
              ? "숫자만 입력해주세요"
              : yearIncome === "0"
              ? "0보다 커야합니다"
              : ""
          }
        />
      </SurveyContents>

      <SurveyContents title={"은인들의 지원금"}>
        <TextField
          value={getCommaString(supportAmount)}
          onChange={handleChangeSupportAmount}
          InputProps={{
            startAdornment: <InputAdornment position="start">₩</InputAdornment>,
            endAdornment: (
              <InputAdornment position="start">만원</InputAdornment>
            ),
          }}
          variant="standard"
          error={!textfieldNumberValidation(supportAmount)}
          helperText={
            !textfieldNumberValidation(supportAmount)
              ? "숫자만 입력해주세요"
              : ""
          }
        />
      </SurveyContents>

      <SurveyContents
        title={"지금까지 모은돈은 얼마인가요?"}
        description="가용 할 수 있는 금액을 입력해주세요. 전세에 묶여있는 내 돈 모두 포함해서요"
      >
        <TextField
          value={getCommaString(depositAmount)}
          onChange={handleChangeDepositAmount}
          InputProps={{
            startAdornment: <InputAdornment position="start">₩</InputAdornment>,
            endAdornment: (
              <InputAdornment position="start">만원</InputAdornment>
            ),
          }}
          variant="standard"
          error={!textfieldNumberValidation(depositAmount)}
          helperText={
            !textfieldNumberValidation(depositAmount)
              ? "숫자만 입력해주세요"
              : ""
          }
        />
      </SurveyContents>
      <SurveyContents
        title={"다자녀 가구인가요?"}
        description="성년이 되지 않은 자녀가 3명 이상이면 다자녀가구예요. 뱃속에 태아도 포함됩니다"
      >
        <ToggleButtonGroup
          color="primary"
          value={isHavingKids.toString()}
          exclusive
          onChange={(
            event: React.MouseEvent<HTMLElement>,
            newSelection: string
          ) => {
            if (newSelection !== null)
              setisHavingKids(JSON.parse(newSelection));
          }}
          aria-label="Platform"
        >
          <ToggleButton value="true">다자녀가구예요</ToggleButton>
          <ToggleButton value="false">다자녀가구는 아니예요</ToggleButton>
        </ToggleButtonGroup>
      </SurveyContents>
      {isHavingKids && (
        <SurveyContents title={"자녀수는 몇 명인가요?"}>
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
        </SurveyContents>
      )}
      <SurveyContents
        title={"해당되는 항목을 선택해주세요. 여러개 선택 가능해요."}
      >
        <ToggleButtonGroup
          color="primary"
          value={singleParentMultiCultureDisabled}
          onChange={(
            event: React.MouseEvent<HTMLElement>,
            newSelections: string
          ) => {
            setIsSingleParent(false);
            setIsDisabled(false);
            setIsMultiCultural(false);

            if (newSelections.includes("singleParent")) {
              setIsSingleParent(true);
            }

            if (newSelections.includes("multiCultural")) {
              setIsMultiCultural(true);
            }

            if (newSelections.includes("disabled")) {
              setIsDisabled(true);
            }
          }}
          aria-label="Platform"
        >
          <ToggleButton value="singleParent">한부모 가정</ToggleButton>
          <ToggleButton value="multiCultural">다문화 가구</ToggleButton>
          <ToggleButton value="disabled">장애인 가구</ToggleButton>
        </ToggleButtonGroup>
      </SurveyContents>

      <SurveyContents title={"대출은 몇 년에 걸쳐 갚을 예정이신가요?"}>
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
            <MenuItem value={"40"}>40년간</MenuItem>
          </Select>
        </FormControl>
      </SurveyContents>
      <SurveyContents
        title={
          "대출 상환 방식은 3가지가 있어요? 어떤 방식으로 갚을 예정이신가요?"
        }
        description={[
          "원리금균등은 매달 동일한 금액을 갚는 방식이예요",
          "원금균등은 매달 갚는 원금이 같아요",
          "체증식은 처음에는 조금만 갚다가 점점 갚는 금액을 늘려가는 방식이예요",
        ]}
      >
        <ToggleButtonGroup
          color="primary"
          value={paymentType}
          exclusive
          onChange={(
            event: React.MouseEvent<HTMLElement>,
            newSelection: string
          ) => {
            if (newSelection !== null)
              setPaymentType(newSelection as PaymentType);
          }}
          aria-label="Platform"
        >
          <ToggleButton value={PaymentType.FIXED}>원리금균등</ToggleButton>
          <ToggleButton value={PaymentType.FIXED_PRINCIPAL}>
            원금균등
          </ToggleButton>
          <ToggleButton value={PaymentType.GRADUAL_INCREASE}>
            체증식
          </ToggleButton>
        </ToggleButtonGroup>
      </SurveyContents>
      <div className="nextButtonContainer">
        <Link href={`/result`} onClick={handleResult}>
          <Button
            id="nextButton"
            variant="contained"
            size="large"
            disableElevation
          >
            <h4>결과보기</h4>
          </Button>
        </Link>
      </div>
      {/* </> */}
      {/* )} */}
      <style jsx>{`
        .nextButtonContainer {
          display: flex;
          justify-content: center;
        }
        .birthdayWrapper {
          display: flex;
        }
        .container {
          display: flex;
          flex-direction: column;
          padding-bottom: 60px;
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

Home.getLayout = function getLayout(page: ReactElement) {
  return <HeaderLayout>{page}</HeaderLayout>;
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
