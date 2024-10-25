import dayjs from "dayjs";
import React from "react";

const Notification = ({ notification }) => {
  return (
    <div
      className={`row mt-4 mx-2  rounded-3 border ${
        notification["etatNotification"] === "NONLUE"
          ? "border-2 border-primary"
          : "border-1"
      }`}
    >
      <div className="row">
        <div className="col">
          <span
            className="formation-dashboard fw-bold py-2 px-3 bg-info rounded-pill w-auto"
            style={{ position: "relative", top: -10 }}
          >
            {notification.titre}
          </span>
        </div>
      </div>
      <div className="row px-4 py-3">{notification.contenu}</div>
      <div className="row justify-content-end ">
        <span
          className="text-secondary py-2 px-3  w-auto"
          style={{ fontStyle: "italic" }}
        >
          {dayjs(notification["date"]).format("YYYY-MM-DD HH:mm:ss")}
        </span>
      </div>
    </div>
  );
};


export default React.memo(Notification, (prevProps, nextProps) => Object.is(prevProps, nextProps));

