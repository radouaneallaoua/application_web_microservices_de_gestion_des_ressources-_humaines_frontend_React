import { Skeleton } from "@mui/material";
import React from "react";

const EmployeSkeleton = () => {
  return (
    <div className={`col-md mb-3 rounded-4 border border-1 p-3 `}>
      <div className="row ">
        <div className="col-md-5 ">
          <div className="row">
            <center>
              <Skeleton
                variant="circular"
                width={120}
                height={120}
                animation="wave"
              />
            </center>
          </div>
          <div className="row mt-2 fw-bold text-secondary">
            <center>
              <Skeleton variant="text" height={30} animation="wave" />
            </center>
          </div>
          <span>
            <center>
              <Skeleton variant="text" height={30} animation="wave" />
            </center>
          </span>
          <div className="row mt-2">
            <div className="col-md">
              <Skeleton variant="text" height={30} animation="wave" />
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="row">
            <div className="col-md ">
              <Skeleton
                variant="text"
                width={120}
                height={30}
                animation="wave"
              />
            </div>
            <div className="col-md">
              <Skeleton
                variant="text"
                width={120}
                height={30}
                animation="wave"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-3  mt-2">
              <Skeleton
                variant="text"
                width={60}
                height={30}
                animation="wave"
              />
            </div>
            <div className="col-md-9 mt-2">
              <center>
                <Skeleton
                  variant="text"
                  width={180}
                  height={30}
                  animation="wave"
                />
              </center>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3  mt-2">
              <Skeleton
                variant="text"
                width={60}
                height={30}
                animation="wave"
              />
            </div>
            <div className="col-md-9 mt-2">
              <center>
                <Skeleton
                  variant="text"
                  width={180}
                  height={30}
                  animation="wave"
                />
              </center>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3  mt-2">
              <Skeleton
                variant="text"
                width={60}
                height={30}
                animation="wave"
              />
            </div>
            <div className="col-md-9 mt-2">
              <center>
                <Skeleton
                  variant="text"
                  width={180}
                  height={30}
                  animation="wave"
                />
              </center>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3  mt-2">
              <Skeleton
                variant="text"
                width={60}
                height={30}
                animation="wave"
              />
            </div>
            <div className="col-md-9 mt-2">
              <center>
                <Skeleton
                  variant="text"
                  width={180}
                  height={30}
                  animation="wave"
                />
              </center>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3  mt-2">
              <Skeleton
                variant="text"
                width={60}
                height={30}
                animation="wave"
              />
            </div>
            <div className="col-md-9 mt-2">
              <center>
                <Skeleton
                  variant="text"
                  width={180}
                  height={30}
                  animation="wave"
                />
              </center>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-10 ">
          <Skeleton variant="text" width={120} height={30} animation="wave" />
        </div>
        <div className="col-1">
          <Skeleton variant="text" width={40} height={30} animation="wave" />
        </div>
      </div>
    </div>
  );
};
export default EmployeSkeleton;
