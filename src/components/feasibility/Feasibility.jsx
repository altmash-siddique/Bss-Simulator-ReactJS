import React, { useState, useEffect } from "react";
import { Card, Row, Col, Input, Button, Checkbox, Dropdown, Menu } from "antd";
import "./Feasibility.css"; // Import your CSS file
import { RightOutlined } from "@ant-design/icons"; // Import an icon from Ant Design

import { DownOutlined } from "@ant-design/icons";
import { SERVICE_QUALIFICATION } from "../../constants/apiEndpoints";
import ApiService from "../../services/apiService";

const Feasibility = ({ selectedEnvironment }) => {
  const apiService = new ApiService(selectedEnvironment);

  const [selectedVersion, setSelectedVersion] = useState("Select Version");
  const [feasibilityData, setFeasibilityData] = useState({});
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [feasibilityError, setFeasibilityError] = useState("");
  const [hideProceedButton, setHideProceedButton] = useState(true);
  const [responseID, setResponseID] = useState("");
  const [postcode, setPostcode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [houseNumberExtension, setHouseNumberExtension] = useState("");
  const [isFetchConnectionPoint, setIsFetchConnectionPoint] = useState(false);

  const handleFeasibilityCheck = async () => {
    try {
      // Set your placeData and addressDetails based on your logic
      setLoadingVerify(true);

      const endpoint = SERVICE_QUALIFICATION[selectedVersion];
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Basic c3ZjX2NvbXVzZXI6ZXFDU0NxPmU4Iw==",
      };

      const placeData = houseNumberExtension
        ? [
            {
              role: "installationAddress",
              "@baseType": "Place",
              "@type": "GeographicAddress",
              postcode,
              houseNumber,
              houseNumberExtension,
              country: "Netherlands",
            },
          ]
        : [
            {
              role: "installationAddress",
              "@baseType": "Place",
              "@type": "GeographicAddress",
              postcode,
              houseNumber,
              country: "Netherlands",
            },
          ];

      const addressDetails = {
        description: "Service Feasibility Check",
        externalId: "FB100",
        serviceQualificationItem: [
          {
            id: "1",
            service: {
              serviceSpecification: {
                name: selectedVersion === "v5" ? "CFS_ACCESS" : "CFS_IP_ACCESS",
              },
              serviceCharacteristic: [
                {
                  name: "fetchConnectionPointInfo",
                  valueType: "Boolean",
                  value: isFetchConnectionPoint.toString(),
                },
              ],
              place: placeData,
            },
          },
        ],
      };

      const response = await apiService.post(endpoint, addressDetails, headers);

      setHideProceedButton(false);
      setLoadingVerify(false);
      setResponseID("Order Submitted Successfully id:-");
      setFeasibilityData(response);
      // Add additional processing logic or call other functions as needed
    } catch (error) {
      setHideProceedButton(false);
      setLoadingVerify(false);
      setResponseID("Error Code:-");
      setFeasibilityError(
        JSON.stringify(error.response?.data || error.message)
      );
    }
  };

  useEffect(() => {
    handleFeasibilityCheck();
  }, [
    selectedVersion,
    postcode,
    houseNumber,
    houseNumberExtension,
    isFetchConnectionPoint,
  ]);

  const handleMenuClick = (e) => {
    setSelectedVersion(e.item.props.children);
  };

  const handleProceedButtonClick = () => {
    handleFeasibilityCheck();
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
            onClick={handleProceedButtonClick}
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
