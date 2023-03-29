import Head from "next/head";

interface SeoProps {
  title: string;
}
const Seo = ({ title }: SeoProps) => {
  const headTitle = `${title} | 영끌계산기`;
  return (
    <Head>
      <title>{headTitle}</title>
    </Head>
  );
};

export default Seo;
