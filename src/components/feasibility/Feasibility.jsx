import React, { useState } from "react";
import { Card, Row, Col, Input, Button, Checkbox, Dropdown, Menu } from "antd";
import "./Feasibility.css"; // Import your CSS file
import { RightOutlined } from "@ant-design/icons"; // Import an icon from Ant Design

import { DownOutlined } from "@ant-design/icons";

const Feasibility = () => {
  const [selectedVersion, setSelectedVersion] = useState("Select Version");

  const handleMenuClick = (e) => {
    setSelectedVersion(e.item.props.children);
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">v1</Menu.Item>
      <Menu.Item key="2">v2</Menu.Item>
      <Menu.Item key="3">v3</Menu.Item>
      <Menu.Item key="4">v4</Menu.Item>
      <Menu.Item key="5">v5</Menu.Item>
    </Menu>
  );

  return (
    <Card className="card-style">
      <div className="version-dropdown-style">
        <span className="version-label">Version:</span>
        <Dropdown overlay={menu} placement="bottomRight">
          <Button>
            {selectedVersion}
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      <h1 className="card-label">What is your address?</h1>
      <h3 className="subheader-label">
        Enter the Postcode check and immediately see if Internet and various
        other services.
      </h3>
      <Row gutter={[24, 24]}>
        {" "}
        {/* Adjust gutter as needed */}
        <Col xs={24} sm={12} md={8} lg={5} className="postcode-textbox-row">
          <Input placeholder="Postal Code" className="textbox-style" />
        </Col>
        <Col xs={24} sm={12} md={8} lg={5}>
          <Input placeholder="House #" className="textbox-style" />
        </Col>
        <Col xs={24} sm={12} md={8} lg={5}>
          <Input placeholder="Add." className="textbox-style" />
        </Col>
        <Col xs={24} sm={12} md={8} lg={5}>
          <Button
            shape="round"
            className="proceed-button"
            size="large"
            icon={<RightOutlined />}
          >
            Proceed
          </Button>
        </Col>
      </Row>
      <Row gutter={[15, 15]}>
        <Col xs={24} sm={12} md={8} lg={10}>
          <div>
            <Checkbox className="fetch-checkbox" defaultChecked>
              Fetch Connection Point Details
            </Checkbox>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default Feasibility;
