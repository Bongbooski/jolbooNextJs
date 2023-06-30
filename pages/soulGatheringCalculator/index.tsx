import Seo from "../../components/Seo";
import Link from "next/link";
import { Typography, Button } from "@mui/material";
import MainIcon from "../../asset/svg/Main.svg";
import { ReactElement } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Symbol from "../../components/Symbol";
import KakaoAdFit from "../../components/KakaoAdFit";

const Home = () => {
  return (
    <>
      <Seo title="" />
      <Symbol />
      <Typography variant="h6" gutterBottom>
        집을 사기로 마음 먹으셨나요?
      </Typography>
      <Typography variant="h6" gutterBottom>
        첫번째로 할 일은 내가 살 수 있는 아파트 금액을 정하는 일이에요.
      </Typography>
      <p></p>
      <Typography variant="h6" gutterBottom>
        내 소득과 현재 가진 금액, 상황 등을 고려하여
      </Typography>
      <Typography variant="h6" gutterBottom>
        얼마짜리 집을 살 수 있는지 알려드릴게요!
      </Typography>
      <div className="iconArea">
        <MainIcon />
      </div>
      <Link href={`/soulGatheringCalculator/knowingMyself`}>
        <Button variant="contained" size="large" disableElevation>
          <Typography variant="body1">시작하기</Typography>
        </Button>
      </Link>
      <KakaoAdFit />
      <style jsx>{`
        .iconArea {
          padding: 20px 0px 0px 0px;
        }
      `}</style>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
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
