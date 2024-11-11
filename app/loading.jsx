"use client";
import React from "react";
import { Oval } from "react-loader-spinner";
const Loading = ({ height }) => {
  return (
    <div
      className={`w-full h-${
        height || "screen"
      } bg-white flex justify-center items-center`}
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
