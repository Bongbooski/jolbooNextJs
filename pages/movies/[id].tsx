import { useRouter } from "next/router";

const Movie = () => {
  const router = useRouter();
  return (
    <div>
      <h4>{router.query.title || "Loading..."}</h4>
    </div>
  );
};

export default Movie;

export const getServerSideProps = async () => {
  const { results } = await (
    await fetch("http://localhost:3000/api/movies")
  ).json();
  return {
    props: {
      results,
    },
  };
};
