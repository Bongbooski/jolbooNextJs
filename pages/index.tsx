import { useEffect, useState } from "react";
import Seo from "../components/Seo";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FormControlLabel,
  FormControl,
  Typography,
  TextField,
  Box,
  RadioGroup,
  Radio,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CSSProperties } from "@emotion/serialize";

interface Movie {
  id: string;
  original_title: string;
  poster_path: string;
}

const Home = () => {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [isMarried, setIsMarried] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMarried((event.target as HTMLInputElement).value);
  };

  const radioGroupCss = {
    display: "flex",
    flexDirection: "row",
  };

  return (
    <div className="container">
      <Seo title="Home" />

      <Box className="birthdayWrapper" style={{ display: "flex" }}>
        <Typography variant="h5" gutterBottom>
          생년월일을 입력해주세요
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Basic example"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>

      <Box style={{ display: "flex" }}>
        <Typography variant="h5" gutterBottom>
          결혼, 신혼여부
        </Typography>
        <FormControl>
          <RadioGroup
            // defaultValue="female"
            value={isMarried}
            name="radio-buttons-group"
            style={radioGroupCss}
            onChange={handleChange}
          >
            <FormControlLabel
              value="married"
              control={<Radio />}
              label="결혼했어요"
            />
            <FormControlLabel
              value="notMarried"
              control={<Radio />}
              label="결혼안했어요"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      <style jsx>{`
        .birthdayWrapper {
          display: flex;
        }
        /* .container {
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
        } */
      `}</style>
    </div>
  );
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
