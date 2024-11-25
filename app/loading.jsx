"use client";
import React from "react";
import { Oval } from "react-loader-spinner";
const Loading = ({ height, bg }) => {
  return (
    <div
      className={`w-full h-${height || "screen"} flex justify-center bg-${
        bg || "white"
      } items-center`}
    >
      <Oval
        visible={true}
        height="80"
        width="80"
        color="#374D68"
        ariaLabel="oval-loading"
        secondaryColor="#D3D3D3"
      />
    </div>
  );
};

export default Loading;
