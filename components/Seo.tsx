import Head from "next/head";

interface SeoProps {
  title: string;
}
const Seo = ({ title }: SeoProps) => {
  const headTitle = `${title} | Soul Gathering`;
  return (
    <Head>
      <title>{headTitle}</title>
    </Head>
  );
};

export default Seo;
