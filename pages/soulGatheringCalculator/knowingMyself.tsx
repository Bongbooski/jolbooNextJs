import { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import QuestionIcon from "../asset/svg/Question.svg";
import {
  FormControl,
  Typography,
  TextField,
  Input,
  InputAdornment,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  SelectChangeEvent,
  Modal,
  Box,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { KnowingState } from "../../state/KnowingState";
import { useRecoilState, useRecoilValue } from "recoil";
import type { NextPageWithLayout } from "./../_app";
import HeaderLayout from "../../components/layout/HeaderLayout";
import SurveyContents from "../../components/SurveyContents";
import { convertPriceToKorean, getCommaString } from "../../utils/CommonUtils";
import { FamilyType } from "../../constants/Loan";
import { PaymentType } from "../../constants/Common";
import Seo from "../../components/Seo";
import KakaoAdFit from "../../components/KakaoAdFit";
import GoogleAd from "../../components/GoogleAd";

interface Movie {
  id: string;
  original_title: string;
  poster_path: string;
}

const Home: NextPageWithLayout = () => {
  const [birthday, setBirthday] = useRecoilState<Dayjs | null>(
    KnowingState.birthday
  );
  const [isMarriedValue, setisMarriedValue] = useRecoilState<string | null>(
    KnowingState.isMarriedValue
  );
  const [isNewCouple, setIsNewCouple] = useRecoilState<boolean | null>(
    KnowingState.isNewCouple
  );
  const [isFirstTime, setIsFirstTime] = useRecoilState<boolean>(
    KnowingState.isFirstTime
  );

  const [showSecondSection, setShowSecondSection] = useState<boolean | null>(
    null
  );
  const [yearIncome, setYearIncome] = useRecoilState<string>(
    KnowingState.yearIncome
  );
  const [supportAmount, setSupportAmount] = useRecoilState<string>(
    KnowingState.supportAmount
  );
  const [depositAmount, setDepositAmount] = useRecoilState<string>(
    KnowingState.depositAmount
  );
  const [saveAmount, setSaveAmount] = useRecoilState<string>(
    KnowingState.saveAmount
  );
  const [showSingleParentInfo, setShowSingleParentInfo] =
    useState<boolean>(false);
  const [isSingleParent, setIsSingleParent] = useRecoilState<boolean>(
    KnowingState.isSingleParent
  );
  const [isHavingKids, setisHavingKids] = useRecoilState<boolean>(
    KnowingState.isHavingKids
  );
  const [showDisabledInfo, setShowDisabledInfo] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useRecoilState<boolean>(
    KnowingState.isDisabled
  );
  const [showMultiCulturalInfo, setShowMultiCulturalInfo] =
    useState<boolean>(false);
  const [isMultiCultural, setIsMultiCultural] = useRecoilState<boolean>(
    KnowingState.isMultiCultural
  );

  const [havingNoHouse, setHavingNoHouse] = useRecoilState<boolean>(
    KnowingState.havingNoHouse
  );
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

  const handleChangeYearIncome = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number.parseInt(event.target.value.replaceAll(",", ""));

    setYearIncome(value ? value.toString() : "0");
  };

  const handleChangeSupportAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number.parseInt(event.target.value.replaceAll(",", ""));

    setSupportAmount(value ? value.toString() : "0");
  };

  const handleChangeDepositAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number.parseInt(event.target.value.replaceAll(",", ""));

    setDepositAmount(value ? value.toString() : "0");
  };

  const handleChangeSaveAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number.parseInt(event.target.value.replaceAll(",", ""));

    setSaveAmount(value ? value.toString() : "0");
  };

  const handleChangeBorrowingYear = (event: SelectChangeEvent) => {
    setBorrowingYear(event.target.value);
  };

  const checkValidation = () => {
    if (
      !textfieldNumberValidation(yearIncome) ||
      yearIncome === "0" ||
      !textfieldNumberValidation(supportAmount) ||
      !textfieldNumberValidation(depositAmount) ||
      birthday === null ||
      Number.parseInt(depositAmount) < 100
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleResult = (event: React.MouseEvent<HTMLElement>) => {
    if (!checkValidation()) {
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
    <div className="knowingMyselfContainer">
      {/* <iframe className='sideBanner' src="https://ads-partners.coupang.com/widgets.html?id=667633&template=carousel&trackingCode=AF6703910&subId=&width=140&height=680&tsource=" width="140" height="680" frameBorder="0" scrolling="no" referrerPolicy="unsafe-url"></iframe> */}
      <div className="contentArea">
        <Seo title="정보입력" />
        <SurveyContents title={"생년월일이 어떻게 되나요?"}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="생년월일"
              value={birthday}
              onChange={(newValue) => {
                setBirthday(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={birthday === null ? true : false}
                  helperText={
                    birthday === null ? "생년월일을 입력해주세요" : ""
                  }
                />
              )}
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
            description={"부동산에서는 혼인신고한지 7년 이내일 경우 신혼이에요"}
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
              <ToggleButton value="true">신혼이에요</ToggleButton>
              <ToggleButton value="false">신혼은 아니에요</ToggleButton>
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
              if (newSelection !== null)
                setIsFirstTime(JSON.parse(newSelection));
            }}
            aria-label="Platform"
          >
            <ToggleButton value="true">집 처음사요</ToggleButton>
            <ToggleButton value="false">집 사본적 있어요</ToggleButton>
          </ToggleButtonGroup>
        </SurveyContents>

        <SurveyContents
          title={"현재 무주택인가요?"}
          description={"다주택자(2주택 이상)시면 결과가 부정확할 수 있어요"}
        >
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
            <ToggleButton value="true">무주택이에요</ToggleButton>
            <ToggleButton value="false">무주택 아니에요</ToggleButton>
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
              startAdornment: (
                <InputAdornment position="start">₩</InputAdornment>
              ),
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
                : convertPriceToKorean(yearIncome)
            }
          />
        </SurveyContents>

        <SurveyContents
          title={"은인들의 지원금이 있으신가요?"}
          description="여기 입력된 금액은 내 자금에 더해질거에요"
        >
          <TextField
            value={getCommaString(supportAmount)}
            onChange={handleChangeSupportAmount}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₩</InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">만원</InputAdornment>
              ),
            }}
            variant="standard"
            error={!textfieldNumberValidation(supportAmount)}
            helperText={
              !textfieldNumberValidation(supportAmount)
                ? "숫자만 입력해주세요"
                : convertPriceToKorean(supportAmount)
            }
          />
        </SurveyContents>

        <SurveyContents
          title={"지금까지 모은 돈은 얼마인가요?"}
          description="가용 할 수 있는 금액을 입력해주세요. 전세에 묶여있는 내 돈 모두 포함해서요"
        >
          <TextField
            value={getCommaString(depositAmount)}
            onChange={handleChangeDepositAmount}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₩</InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">만원</InputAdornment>
              ),
            }}
            variant="standard"
            error={
              !textfieldNumberValidation(depositAmount) ||
              Number.parseInt(depositAmount) < 100
            }
            helperText={
              !textfieldNumberValidation(depositAmount)
                ? "숫자만 입력해주세요"
                : Number.parseInt(depositAmount) < 100
                ? "최소 금액은 100만원입니다"
                : convertPriceToKorean(depositAmount)
            }
          />
        </SurveyContents>
        <SurveyContents
          title={"한 달 여윳돈은 얼마나 되나요?"}
          description="월급에서 고정비, 생활비, 용돈 등을 제외하고 남는(저축하시는) 금액을 입력해주세요"
        >
          <TextField
            value={getCommaString(saveAmount)}
            onChange={handleChangeSaveAmount}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₩</InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">만원</InputAdornment>
              ),
            }}
            variant="standard"
            error={!textfieldNumberValidation(saveAmount)}
            helperText={
              !textfieldNumberValidation(saveAmount)
                ? "숫자만 입력해주세요"
                : convertPriceToKorean(saveAmount)
            }
          />
        </SurveyContents>
        <SurveyContents
          title={"다자녀 가구인가요?"}
          description="성년이 되지 않은 자녀가 2명 이상이면 다자녀가구에요. 뱃속에 태아도 포함됩니다"
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
            <ToggleButton value="true">다자녀가구에요</ToggleButton>
            <ToggleButton value="false">다자녀가구는 아니에요</ToggleButton>
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
          description={[
            FamilyType.SINGLE_PARENT,
            FamilyType.MULTI_CULTURAL,
            FamilyType.DISABLED,
          ]}
        >
          <div className="minWidthWrapper">
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
                  setShowSingleParentInfo(true);
                }

                if (newSelections.includes("multiCultural")) {
                  setIsMultiCultural(true);
                  setShowMultiCulturalInfo(true);
                }

                if (newSelections.includes("disabled")) {
                  setIsDisabled(true);
                  setShowDisabledInfo(true);
                }
              }}
              aria-label="Platform"
            >
              <ToggleButton value="singleParent">한부모 가정</ToggleButton>
              <ToggleButton value="multiCultural">다문화 가구</ToggleButton>
              <ToggleButton value="disabled">장애인 가구</ToggleButton>
            </ToggleButtonGroup>
          </div>
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
          title={"대출 상환은 어떤 방식으로 하실 예정인가요?"}
          description={[
            "원리금균등은 원금, 이자를 더해 매달 동일한 금액을 갚는 방식이에요",
            "원금균등은 매달 동일한 원금에 변경되는 이자가 더해지는 방식이에요",
            "체증식은 처음에는 조금만 갚다가 점점 갚는 금액을 늘려가는 방식이에요(대출 종류에 따라 없을 수도 있어요)",
          ]}
        >
          <div className="minWidthWrapper">
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
          </div>
        </SurveyContents>
        <div className="nextButtonContainer">
          <Link href={`/soulGatheringCalculator/result`} onClick={handleResult}>
            <Button
              id="nextButton"
              variant="contained"
              size="large"
              disableElevation
              disabled={checkValidation() ? false : true}
            >
              <h4>결과보기</h4>
            </Button>
          </Link>
        </div>
        {!checkValidation() && (
          <div className="errorArea">
            <Typography color={"error"}>
              입력되지 않거나 올바르지 않은 형식으로 입력된 항목이 있어요!
            </Typography>
          </div>
        )}
        {/* <span className="coupangNotice">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다</span> */}
        {/* <KakaoAdFit /> */}
        <GoogleAd />
      </div>
      {/* <iframe className='sideBanner' src="https://ads-partners.coupang.com/widgets.html?id=677067&template=carousel&trackingCode=AF6703910&subId=&width=140&height=680&tsource=" width="140" height="680" frameborder="0" scrolling="no" referrerpolicy="unsafe-url"></iframe> */}
      <style jsx>{`
        .sideBanner {
          position: sticky;
          top: 200px;
        }
        .nextButtonContainer {
          display: flex;
          justify-content: center;
        }
        .birthdayWrapper {
          display: flex;
        }
        .knowingMyselfContainer {
          display: flex;
          flex-direction: row;
          padding-bottom: 60px;
        }
        .descriptionContainer {
          padding: 0px 50px;
          display: flex;
          justify-content: space-between;
          min-height: 55px;
          white-space: break-spaces;
          flex-direction: column;
        }

        .description {
          display: flex;
        }
        .minWidthWrapper {
          min-width: 260px;
          text-align: end;
        }
        .errorArea {
          display: flex;
          justify-content: center;
        }
        .coupangNotice {
          font-size: 10px;
          opacity: 0.5;
        }
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
