import { useEffect, useState } from "react";
import Seo from "../components/Seo";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";


interface Movie {
  id: string;
  original_title: string;
  poster_path: string;
}

const Home = ({ results }: InferGetServerSidePropsType<GetServerSideProps>) => {
  // FE에서 기다리면서 화면은 로딩을 보여주는 방식
  // const [movies, setMovies] = useState<Movie[]>();
  // useEffect(() => {
  //   (async () => {
  //     const { results } = await (
  //       await fetch(
  //         `/api/movies`
  //       )
  //     ).json();
  //     setMovies(results);
  //   })();
  // }, []);

  const router = useRouter()
  const onMovieClick = (movie: Movie) => {
    // option, 뒤에는 마스킹
    // router.push({
    //   pathname: `/movies/${movie.id}`,
    //   query: {
    //     title: movie.original_title
    //   }
    // }, `/movies/${movie.id}`)

    router.push(`/movies/${movie.original_title}/${movie.id}`)
  }

  return (
    <div className="container">
      <Seo title="Home" />
      {!results && <h4>Loading...</h4>}
      {results?.map((movie: Movie) => (
        <div className="movie" key={movie.id} onClick={() => onMovieClick(movie)}>
          <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
          {/* <Link href={{
            pathname: `/movies/${movie.id}`,
            query: {
              title: movie.original_title
            }
          }} as={`/movies/${movie.id}`}> */}
          <Link href={`/movies/${movie.original_title}/${movie.id}`}>
            <h4>{movie.original_title}</h4>
          </Link>
        </div>
      ))}
      <style jsx>{`
        .container {
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
        }
      `}</style>
    </div>
  );
}

export default Home;

// server side에서만 실행된다
// async는 필요없으면 안써도 됨, export, 함수명이 중요
export const getServerSideProps = async () => {
  const { results } = await (await fetch('http://localhost:3000/api/movies')).json();
  return {
    props: {
      results,
    }
  }
}