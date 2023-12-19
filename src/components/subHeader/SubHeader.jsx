// Subheader.js
import React from "react";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import logo from "../../assets/images/odido-logo.svg";
import "./SubHeader.css";

const Subheader = ({ selectedEnvironment, onEnvironmentChange }) => {
    const handleEnvironmentSelect = (e) => {
      const newEnvironment = e.key;
     console.log(newEnvironment);
      onEnvironmentChange(newEnvironment);
    };

 
  
  const environmentMenu = (
    <Menu onClick={handleEnvironmentSelect}>
      <Menu.Item key="INT">INT</Menu.Item>
      <Menu.Item key="UAT">UAT</Menu.Item>
      <Menu.Item key="PROD">PROD</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div>
        <img src={logo} alt="Logo" className="odido-logo" />
      </div>

      <div className="env-subheader">
        <Dropdown overlay={environmentMenu} placement="bottomLeft">
          <Button>
            {selectedEnvironment} <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default Subheader;
