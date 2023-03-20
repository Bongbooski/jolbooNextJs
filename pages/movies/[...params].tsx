import { useRouter } from "next/router";
// import { GetServerSideProps, InferGetServerSidePropsType } from "next";
// import Seo from "../../components/Seo";

// const Movie = ({ params }: InferGetServerSidePropsType<GetServerSideProps>) => {
const Movie = () => {
  const router = useRouter();
  //   const [title, id] = params || [];

  //   console.log("params:", params);
  return (
    <div>
      {/* <Seo title={title} /> */}
      {/* <h4>{title}</h4> */}
    </div>
  );
};

export default Movie;

// export const getServerSideProps = async ({
//   params: { params },
// }: InferGetServerSidePropsType<GetServerSideProps>) => {
//   // server context에서 params를 가져다가 화면에 전달하는 과정
//   return {
//     props: {
//       params,
//     },
//   };
// };
