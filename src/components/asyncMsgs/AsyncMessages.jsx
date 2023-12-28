import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Dropdown,
  Menu,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./AsyncMessages.css"; // Import your custom CSS file for component styling

const AsyncMessages = () => {
  
  const [selectedVersion, setSelectedVersion] = useState("Select Order Type");

  const handleMenuClick = (e) => {
    setSelectedVersion(e.item.props.children);
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">New line</Menu.Item>
      <Menu.Item key="2">Change</Menu.Item>
      <Menu.Item key="3">Disconnect</Menu.Item>
      <Menu.Item key="4">Cancel</Menu.Item>
      <Menu.Item key="5">Revise</Menu.Item>
      <Menu.Item key="6">Migrate out</Menu.Item>
      <Menu.Item key="7">New Delay</Menu.Item>
    </Menu>
  );
  return (
    <div className="background-container">
      <div className="orderid-custom-div">
        <Row gutter={[24, 24]} className="orderid-row">
          <Col xs={24} sm={12} md={8} lg={8} className="orderid-label">
            <h3>Order ID:</h3>
          </Col>
          <Col xs={24} sm={12} md={8} lg={16}>
            <Input className="orderid-textbox" />
          </Col>
        </Row>
      </div>
      <div className="container-async">
        <Row gutter={[16, 16]} className="custom-row">
          <Col xs={24} sm={24} md={24} lg={8} className="custom-col">
            <Card title="WBA Async Messages" bordered={false}>
              {/* Nested Card */}
              <Card bordered={false} className="async-inner-card">
                <Row>
                  <Col xs={24} sm={24} md={24} lg={8} className="col-item">
                    <h5>Error Code:</h5>
                    <Input placeholder="Error Code" />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={10}>
                    <h5>Order Note:</h5>
                    {/* Textarea */}
                    <Input.TextArea placeholder="Textarea" rows={4} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={8} className="col-item">
                    <h5>Comment Code:</h5>
                    <Input placeholder="Comment Code" />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={10}>
                    <h5>Service Group:</h5>
                    <Input placeholder="Service Group" />
                  </Col>
                </Row>
              </Card>
              <Card bordered={false} className="async-inner-card">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8} lg={5}>
                    <h5>Select Order Type:</h5>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Dropdown overlay={menu}>
                      <Button className="ordertype-dropdown">
                        {selectedVersion}
                        <DownOutlined />
                      </Button>
                    </Dropdown>
                  </Col>
                </Row>
                <Row gutter={[24, 24]} className="async-date-button-row">
                  <Col xs={24} sm={12} md={8} lg={6} className="async-col">
                    <DatePicker className="datefield" />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="async-col">
                    <Button type="primary" className="async-triggers-button">
                      NEW_SA
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="async-col">
                    <Button type="primary" className="async-triggers-button">
                      NEW_RFS
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="custom-row">
          <Col xs={24} sm={24} md={24} lg={8} className="custom-col">
            <Card title="BSS Async Triggers" bordered={false}>
              <Button type="primary" className="bss-async-triggers-button">
                Resume Pending
              </Button>
              <Button type="primary" className="bss-async-triggers-button">
                SIM Activation Successful
              </Button>
              <Button type="primary" className="bss-async-triggers-button">
                SIM Activation Failed
              </Button>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="custom-row">
          <Col xs={24} sm={24} md={24} lg={8} className="custom-col">
            <Card title="FC Async Triggers" bordered={false}>
              <Row>
                <Button type="primary" className="fc-async-triggers-button">
                  Order Creation
                </Button>
                <Button type="primary" className="fc-async-triggers-button">
                  Appointment Planner
                </Button>
                <Button type="primary" className="fc-async-triggers-button">
                  Order Completed
                </Button>
              </Row>
              <Row justify="center" align="middle" className="appointment-date">
                <Col span={8}>
                  <DatePicker />
                </Col>
              </Row>
              <Row>
                <Button type="primary" className="fc-async-triggers-button">
                  Order Creation
                </Button>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AsyncMessages;
