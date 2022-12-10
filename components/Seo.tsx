import Head from "next/head";

interface SeoProps {
    title: string;
}
const Seo = ({ title }: SeoProps) => {
    const headTitle = `${title} | Next Movies`;
    return (
        <Head>
            <title>{headTitle}</title>
        </Head>)
}

export default Seo;