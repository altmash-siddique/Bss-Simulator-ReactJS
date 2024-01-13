import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Radio,
  DatePicker,
  Alert,
  Dropdown,
  Spin,
  Menu,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./ChangeOrder.css"; // Import your CSS file
import { SERVICE } from "../../constants/apiEndpoints";
import ApiService from "../../services/apiService";
import PostProcessor from "./postProcessor";

const ChangeOrder = ({ selectedEnvironment }) => {
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [display, setDisplay] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [srApiRes, setSrApiRes] = useState({});
  const apiService = new ApiService(selectedEnvironment);

  const handleChangeOrder = async () => {};
  const handleDisconnectOrder = async () => {};
  const onClose = (e) => {
    setErrorMsg("");
  };
  const handleRadioChange = (e) => {
    setSelectedRadio(e.target.value);
  };
  const handleServiceIdChange = (e) => {
    setServiceId(e.target.value);
  };
  const handleSubmitButtonClick = async (e) => {
    if (selectedRadio === null) {
      setErrorMsg("Invalid Inputs");
    } else {
      setLoadingVerify(true);
      const useeocApi = true; // Adjust based on your conditions
      const baseEndpoint = SERVICE.PATH;
      const endpoint = baseEndpoint + "/" + serviceId;
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Basic c3ZjX2NvbXVzZXI6ZXFDU0NxPmU4Iw==",
      };

      await apiService
        .get(endpoint, headers, { expand: true }, useeocApi)
        .then((response) => {
          setSrApiRes(response);
          setLoadingVerify(false);
          setDisplay(true);
        })
        .catch((error) => {
          setErrorMsg(error.message);
          setLoadingVerify(false);
        });
    }
  };
  const menu = (
    <Menu>
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
    <Card className="change-card-style">
      <div className="centered-container">
        <div className="service-row">
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={8} lg={6} className="serviceid-label">
              <h3>Service ID:</h3>
            </Col>
            <Col xs={24} sm={12} md={8} lg={11}>
              <Input
                required
                value={serviceId}
                onChange={handleServiceIdChange}
                className="service-textbox"
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={7}>
              <Button
                disabled={
                  selectedRadio === null
                    ? serviceId === null
                      ? true
                      : false
                    : false
                }
                onClick={handleSubmitButtonClick}
                shape="round"
                className="submit-button"
                size="large"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </div>

        <Spin
          style={{ display: loadingVerify ? "flex" : "none" }}
          fullscreen
          size="large"
        />
        <Row gutter={[24, 24]}>
          <Radio.Group
            onChange={handleRadioChange}
            value={selectedRadio}
            className="action-radio-group"
          >
            <Col xs={24} sm={12} md={8} lg={8}>
              <Radio value={1} className="action-option">
                Change Order
              </Radio>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Radio value={2} className="action-option">
                Disconnect Order
              </Radio>
            </Col>
          </Radio.Group>
        </Row>
      </div>
      <Alert
        style={{ display: errorMsg != "" ? "flex" : "none", marginTop: "30px" }}
        message="Error"
        description={errorMsg}
        type="error"
        closable
        onClose={onClose}
      />
      <Col
        style={{
          display: display ? (selectedRadio === 1 ? "flex" : "none") : "none",
        }}
      >
        <div className="centered-container">
          <Row gutter={[16, 16]} className="centered-container">
            <Col xs={24} sm={24} md={24} lg={24} className="custom-col-cha">
              <Card
                title={
                  srApiRes.name ? (
                    <h3>
                      {srApiRes.name} -{" "}
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://eoc.${selectedEnvironment}.itservices.lan/sr/#/service/${srApiRes.id}`}
                      >
                        {srApiRes.id}
                      </a>
                    </h3>
                  ) : (
                    ""
                  )
                }
                bordered={false}
              >
                {/* Nested Card */}

                {srApiRes.name !== null ? (
                  <PostProcessor
                    selectedEnvironment={selectedEnvironment}
                    srApiRes={srApiRes}
                  ></PostProcessor>
                ) : (
                  ""
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Col>
      <Col
        style={{
          display: display ? (selectedRadio === 2 ? "flex" : "none") : "none",
        }}
      >
        <div className="centered-container">
          <Row gutter={[16, 16]} className="centered-container">
            <Col xs={24} sm={24} md={24} lg={24} className="custom-col-cha">
              <Card title="DISCONNECT" bordered={false}>
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
              </Card>
            </Col>
          </Row>
        </div>
      </Col>
    </Card>
  );
};

export default ChangeOrder;
