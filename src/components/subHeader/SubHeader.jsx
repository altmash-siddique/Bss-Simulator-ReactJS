// Subheader.js
import React, { useState } from "react";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import logo from '../../assets/images/odido-logo.svg';
import "./SubHeader.css";

const Subheader = () => {
  const [selectedEnvironment, setSelectedEnvironment] =
    useState("Select Environment");
 // const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleEnvironmentSelect = (e) => {
    setSelectedEnvironment(e.item.props.children);
    //setDropdownVisible(false); // Close the dropdown after selecting an option
  };

  const environmentMenu = (
    <Menu onClick={handleEnvironmentSelect}>
      <Menu.Item key="1.0">INT</Menu.Item>
      <Menu.Item key="2.0">UAT</Menu.Item>
      <Menu.Item key="3.0">PROD</Menu.Item>
    </Menu>
  );

  return (
    <div>
        <div>
        <img src={logo} alt="Logo" className="odido-logo"/>
        </div>
      
      <div className="env-subheader">
        <Dropdown
          overlay={environmentMenu}
       
          placement="bottomLeft"
        >
          <Button>
            {selectedEnvironment} <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default Subheader;
