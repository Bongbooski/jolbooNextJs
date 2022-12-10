import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout >
      <Component {...pageProps} />
      <style jsx global>{`
      a{
        color: green;
      }
    `}</style>
    </Layout>
  )
}

export default App;