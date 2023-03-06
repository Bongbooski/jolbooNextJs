import { Tooltip, Typography } from "@mui/material";
import { PricePerSquareMeterType } from "../constants/Common";
import SearchIcon from "../asset/svg/Search.svg";

interface DistrictDescriptionProps extends React.PropsWithChildren<object> {
  squareMeter: string;
  districts: PricePerSquareMeterType[];
}

const DistrictDescription = (props: DistrictDescriptionProps) => {
  return (
    <div className="container">
      {props.districts.length > 0 ? (
        <>
          <div className="verticalContainer">
            <Typography variant="h5" gutterBottom>
              {props.squareMeter}평은
            </Typography>
            <Typography variant="h2" gutterBottom>
              {props.districts.pop()?.districtName}
            </Typography>
            <Typography variant="h5" gutterBottom>
              에 집을 살 수 있어요 &#128516;
            </Typography>
          </div>
          {props.districts.length > 0 && (
            <div className="verticalContainer">
              <Typography>
                그 외에도 추가로 구매할 수 있는 지역이 있어요! 확인해보세요
                <Tooltip
                  title={props.districts.map((e) => e.districtName).join(", ")}
                  //   open={isOpen}
                  //   onOpen={() => setIsOpen(true)}
                >
                  <span>
                    <SearchIcon width="24" height="24" className="searchIcon" />
                  </span>
                </Tooltip>
              </Typography>
            </div>
          )}
        </>
      ) : (
        <Typography variant="h5" gutterBottom>
          서울 {props.squareMeter}평은 살 수 없어요 &#128517;
        </Typography>
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
        `}
      </style>
    </div>
  );
};

export default DistrictDescription;
