import { IconButton, Popover, Typography } from "@mui/material";

import {
  PricePerSquareMeterType,
  PricePerSquareMeter,
} from "../constants/Common";

import SearchIcon from "../asset/svg/Search.svg";
import { useState } from "react";

interface DistrictDescriptionProps extends React.PropsWithChildren<object> {
  squareMeter: string;
  districts: PricePerSquareMeterType[];
}

const DistrictDescription = (props: DistrictDescriptionProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  console.log(props.districts);
  console.log(props.districts.filter((e, i) => i < props.districts.length - 1));
  console.log(
    props.districts
      .filter((e, i) => i < props.districts.length - 1)
      .map((e) => e.districtName)
  );
  return (
    <div className="container">
      {props.districts.length > 0 ? (
        <>
          <div className="verticalContainer">
            <Typography variant="h5" gutterBottom>
              {props.squareMeter}평은
            </Typography>
            <Typography variant="h2" gutterBottom>
              {props.districts[props.districts.length - 1].districtName}
            </Typography>
            <Typography variant="h5" gutterBottom>
              에 집을 살 수 있어요 &#128516;
            </Typography>
          </div>
          {props.districts.length > 0 && (
            <div className="verticalContainer">
              <Typography>
                그 외에도 추가로 구매할 수 있는 지역이 있어요! 확인해보세요
                <IconButton aria-describedby={id} onClick={handleClick}>
                  <SearchIcon width="24" height="24" className="searchIcon" />
                </IconButton>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    {props.districts
                      .filter((e, i) => i < props.districts.length - 1)
                      .map((e) => e.districtName)
                      .join(", ")}
                  </Typography>
                </Popover>
              </Typography>
            </div>
          )}
        </>
      ) : (
        <>
          <div>
            <Typography variant="h5" gutterBottom>
              안타깝지만 서울 {props.squareMeter}평은 살 수 없어요 &#128517;
            </Typography>
          </div>
          <div className="wrapper">
            <Typography>
              서울 {props.squareMeter}평 평균가격 최저는{" "}
              {props.squareMeter === "25"
                ? (PricePerSquareMeter[0].price25 / 10000).toFixed(2)
                : (PricePerSquareMeter[0].price34 / 10000).toFixed(2)}
              억 이네요
            </Typography>
          </div>
        </>
      )}
      <style jsx>
        {`
          .container {
            padding-top: 20px;
            min-width: 500px;
          }
          .verticalContainer {
            display: flex;
            align-items: center;
          }
          .wrapper {
            padding-top: 10px;
          }
        `}
      </style>
    </div>
  );
};

export default DistrictDescription;
