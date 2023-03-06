import Seo from "../components/Seo";
import Link from "next/link";
import { Typography, Button } from "@mui/material";
import MainIcon from "../asset/svg/Main.svg";
import SymbolIcon from "../asset/svg/Symbol.svg";
import { ReactElement } from "react";
import AppLayout from "../components/layout/AppLayout";
import Symbol from "../components/Symbol";
const Home = () => {
  return (
    <>
      <Seo title="메인" />
      <Symbol />
      <Typography variant="h5" gutterBottom>
        소득에 따른 대출 금액 계산부터 지역 선택까지 실거주를 위해 필요한 모든
        것을 알려드려요!
      </Typography>
      <div className="iconArea">
        <MainIcon />
      </div>
      <Link href={`/knowingMyself`}>
        <Button variant="contained" size="large" disableElevation>
          <Typography variant="body1">시작하기</Typography>
        </Button>
      </Link>
      <style jsx>{`
        .iconArea {
          padding: 30px 0px;
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
