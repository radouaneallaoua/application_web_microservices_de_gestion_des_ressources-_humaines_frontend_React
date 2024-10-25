import React from "react";
import notFound from "../assets/notFound.png";
import "../App.css"
const NotFound = () => {
  return (
    <div className="min-vh-100 align-items-center justify-content-center">
      <p className="text-info fw-bold ops">OPPPPS</p>
      <center>
        <img
          src={notFound}
          loading="lazy"
          alt=""
          width={700}
          height={500}
          style={{ objectFit: "contain" }}
        />
      </center>
    </div>
  );
};
export default NotFound;
