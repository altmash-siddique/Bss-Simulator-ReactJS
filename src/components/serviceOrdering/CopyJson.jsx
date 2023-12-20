import React, { useState, useEffect, useRef } from "react";
import { CopyOutlined } from "@ant-design/icons";
import ReactJson from 'react-json-view'


const CopyJson = ({ code }) => {

  return (
    <>
    <ReactJson src={JSON.parse(code)} theme="monokai-light" style={{
                fontWeight: "bold",
                fontFamily: "monospace",
                letterSpacing: "1px",
                padding: 24,
                minHeight: 280,
                width: "80%",
                marginLeft: "auto",
                marginRight: "auto",
              }}/>
    
    </>
  );
};

export default CopyJson;
