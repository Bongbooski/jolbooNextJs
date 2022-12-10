import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Seo from '../components/Seo';
import styles from '../styles/Home.module.css'



const About = () => {
  const [counter, setCounter] = useState(0);
  return (
    <div>
      <Seo title="About" />
      <p>About Page {counter}</p>
      <button onClick={() => setCounter(counter + 1)}>+</button>
      <button onClick={() => setCounter((prev) => prev - 1)}>-</button>
    </div>
  )
}

export default About;