import { useRouter } from "next/router";

const movie = () => {
    const router = useRouter()
    return (
        <div>
            <h4>{router.query.title || "Loading..."}</h4>
        </div>
    );
}

export default movie;

export const getServerSideProps = async () => {
    const { results } = await (await fetch('http://localhost:3000/api/movies')).json();
    return {
        props: {
            results,
        }
    }
}