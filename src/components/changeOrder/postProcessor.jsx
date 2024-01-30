import { Card, Row, Col, Input, Button, Select, Spin } from "antd";
import { DownCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { json } from "./changeOrderJsons";
import ReactJson from "react-json-view";
import ApiService from "../../services/apiService";
import { ECM_API_LAMBDA, SERVICE_ORDER } from "../../constants/apiEndpoints";
const PostProcessor = ({ selectedEnvironment, srApiRes }) => {
  const [serviceBandwidthDown, setServiceBandwidthDown] = useState(srApiRes);
  const [serviceBandwidthUp, setServiceBandwidthUp] = useState();
  const [promisedBandwidthDown, setPromisedBandwidthDown] = useState();
  const [promisedBandwidthUp, setPromisedBandwidthUp] = useState();
  const [minimumBandwidthDown, setMinimumBandwidthDown] = useState();
  const [minimumBandwidthUp, setMimumBandwidthUp] = useState();
  const [showJson, setShowJson] = useState(false);
  const [jsonDiv, setJsonDiv] = useState(false);
  const [jsonData, setJsonData] = useState({});
  const [submitOrder, setSubmitOrder] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [changeOrderRes, setChangeOrderRes] = useState({});
  const apiService = new ApiService(selectedEnvironment);

  const selectOptions = [
    { value: 100, label: "100" },
    { value: 5000, label: "50000" },
    { value: 100000, label: "100000" },
    { value: 200000, label: "200000" },
    { value: 500000, label: "500000" },
    { value: 1000000, label: "1000000" },
  ];
  const handleShowJson = () => {
    setShowJson(!showJson);
  };
  const handleserviceBandwidthDownChange = (e) => {
    setServiceBandwidthDown(e.target.value);
  };
  const handleserviceBandwidthDownChangeSelect = (value) => {
    setServiceBandwidthDown(value);
  };
  const handlePromisedBandwidthDownChange = (e) => {
    setPromisedBandwidthDown(e.target.value);
  };
  const handlePromisedBandwidthDownChangeSelect = (value) => {
    setPromisedBandwidthDown(value);
  };
  const handlePromisedBandwidthUpChange = (e) => {
    setPromisedBandwidthUp(e.target.value);
  };
  const handlePromisedBandwidthUpChangeSelect = (value) => {
    setPromisedBandwidthUp(value);
  };
  const handleMinimumBandwidthDownChange = (e) => {
    setMinimumBandwidthDown(e.target.value);
  };
  const handleMinimumBandwidthDownChangeSelect = (value) => {
    setMinimumBandwidthDown(value);
  };
  const handleMinimumBandwidthUpChange = (e) => {
    setMimumBandwidthUp(e.target.value);
  };
  const handleMinimumBandwidthUpChangeSelect = (value) => {
    setMimumBandwidthUp(value);
  };
  const handleserviceBandwidthUpChange = (e) => {
    setServiceBandwidthUp(e.target.value);
  };
  const handleserviceBandwidthUpChangeSelect = (value) => {
    setServiceBandwidthUp(value);
  };

  const handlePrepareClick = () => {
    let jsonStruc = json;
    jsonStruc.orderItem[0].service.serviceCharacteristic = [];
    setChangeOrderRes(null);
    //serviceId
    jsonStruc.orderItem[0].service.id = srApiRes.id;
    //serviceCharacteristics
    const serviceData = srApiRes.serviceCharacteristics;
    const serviceCharacteristisLength = serviceData.length;
    for (let x = 0; x < serviceCharacteristisLength; x++) {
      if (
        serviceData[x].name === "minimumBandwidthDown" &&
        serviceData[x].value !== minimumBandwidthDown
      ) {
        jsonStruc.orderItem[0].service.serviceCharacteristic.push({
          name: "minimumBandwidthDown",
          value: minimumBandwidthDown,
          valueType: "number",
        });
      } else if (
        serviceData[x].name === "minimumBandwidthUp" &&
        serviceData[x].value !== minimumBandwidthUp
      ) {
        jsonStruc.orderItem[0].service.serviceCharacteristic.push({
          name: "minimumBandwidthUp",
          value: minimumBandwidthUp,
          valueType: "number",
        });
      } else if (
        serviceData[x].name === "promisedBandwidthDown" &&
        serviceData[x].value !== promisedBandwidthDown
      ) {
        jsonStruc.orderItem[0].service.serviceCharacteristic.push({
          name: "promisedBandwidthDown",
          value: promisedBandwidthDown,
          valueType: "number",
        });
      } else if (
        serviceData[x].name === "promisedBandwidthUp" &&
        serviceData[x].value !== promisedBandwidthUp
      ) {
        jsonStruc.orderItem[0].service.serviceCharacteristic.push({
          name: "promisedBandwidthUp",
          value: promisedBandwidthUp,
          valueType: "number",
        });
      } else if (
        serviceData[x].name === "serviceBandwidthDown" &&
        serviceData[x].value !== serviceBandwidthDown
      ) {
        jsonStruc.orderItem[0].service.serviceCharacteristic.push({
          name: "serviceBandwidthDown",
          value: serviceBandwidthDown,
          valueType: "number",
        });
      } else if (
        serviceData[x].name === "serviceBandwidthUp" &&
        serviceData[x].value !== serviceBandwidthUp
      ) {
        jsonStruc.orderItem[0].service.serviceCharacteristic.push({
          name: "serviceBandwidthUp",
          value: serviceBandwidthUp,
          valueType: "number",
        });
      }
    }
    //serviceSpecification
    jsonStruc.orderItem[0].service.serviceSpecification.id = srApiRes.name;
    jsonStruc.orderItem[0].service.serviceSpecification.name = srApiRes.name;
    //requestID
    let randomNumber =
      Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;
    jsonStruc.requestId = randomNumber.toString();
    //requestedCompletionDate
    const currentDate = new Date();
    const tenDaysAhead = new Date(currentDate);
    tenDaysAhead.setDate(currentDate.getDate() + 10);
    jsonStruc.requestedCompletionDate = tenDaysAhead;
    setJsonData({ jsonStruc });
    setJsonDiv(true);
    setSubmitOrder(true);
  };

  const handleSubmitClick = async () => {
    setLoadingVerify(true);
    // const useeocApi = true; // Adjust based on your conditions
    const endpoint = SERVICE_ORDER["v1"];
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Basic c3ZjX2NvbXVzZXI6ZXFDU0NxPmU4Iw==",
    };

    await apiService
      .post(endpoint, jsonData.jsonStruc, headers, "")
      .then((response) => {
        setJsonData({ response });
        setChangeOrderRes(response);
        setLoadingVerify(false);
      })
      .catch((error) => {
        setJsonData({ error });
        setChangeOrderRes(error);
        setLoadingVerify(false);
      });
  };

  useEffect(() => {
    console.log(srApiRes);
    if (srApiRes.serviceCharacteristics) {
      const serviceData = srApiRes.serviceCharacteristics;
      const serviceCharacteristisLength = serviceData.length;
      for (let x = 0; x < serviceCharacteristisLength; x++) {
        if (serviceData[x].name === "minimumBandwidthDown") {
          setMinimumBandwidthDown(serviceData[x].value);
        } else if (serviceData[x].name === "minimumBandwidthUp") {
          setMimumBandwidthUp(serviceData[x].value);
        } else if (serviceData[x].name === "promisedBandwidthDown") {
          setPromisedBandwidthDown(serviceData[x].value);
        } else if (serviceData[x].name === "promisedBandwidthUp") {
          setPromisedBandwidthUp(serviceData[x].value);
        } else if (serviceData[x].name === "serviceBandwidthDown") {
          setServiceBandwidthDown(serviceData[x].value);
        } else if (serviceData[x].name === "serviceBandwidthUp") {
          setServiceBandwidthUp(serviceData[x].value);
        }
      }
    }
  }, [srApiRes]);
  return (
    <div>
      <Card bordered={false} className="async-inner-card">
        <div
          style={{
            display:
              srApiRes.name === "CFS_IP_ACCESS_GOP_FTTH"
                ? "block"
                : srApiRes.name === "CFS_IP_ACCESS_WBA_FTTH"
                ? "block"
                : srApiRes.name === "CFS_IP_ACCESS_WBA_VDSL"
                ? "block"
                : "none",
          }}
        >
          <Row className="alignItems-Center">
            <Col className="marginLeft-3" span={8}>
              <h4>promisedBandwidthDown</h4>
            </Col>
            <Col span={4}>
              <Input
                type="number"
                value={promisedBandwidthDown}
                onChange={handlePromisedBandwidthDownChange}
                // className="service-textbox"
              ></Input>
            </Col>
            <Col className="paddingLeft-2" span={8}>
              <Select
                className="width-80"
                value={promisedBandwidthDown}
                onChange={handlePromisedBandwidthDownChangeSelect}
                options={selectOptions}
              ></Select>
            </Col>
          </Row>
          <Row className="alignItems-Center">
            <Col className="marginLeft-3" span={8}>
              <h4>promisedBandwidthUp</h4>
            </Col>
            <Col span={4}>
              <Input
                type="number"
                value={promisedBandwidthUp}
                onChange={handlePromisedBandwidthUpChange}
                // className="service-textbox"
              ></Input>
            </Col>
            <Col className="paddingLeft-2" span={8}>
              <Select
                className="width-80"
                value={promisedBandwidthUp}
                onChange={handlePromisedBandwidthUpChangeSelect}
                options={selectOptions}
              ></Select>
            </Col>
          </Row>
          <Row className="alignItems-Center">
            <Col className="marginLeft-3" span={8}>
              <h4>minimumBandwidthDown</h4>
            </Col>
            <Col span={4}>
              <Input
                type="number"
                value={minimumBandwidthDown}
                onChange={handleMinimumBandwidthDownChange}
                // className="service-textbox"
              ></Input>
            </Col>
            <Col className="paddingLeft-2" span={8}>
              <Select
                className="width-80"
                value={minimumBandwidthDown}
                onChange={handleMinimumBandwidthDownChangeSelect}
                options={selectOptions}
              ></Select>
            </Col>
          </Row>
          <Row className="alignItems-Center">
            <Col className="marginLeft-3" span={8}>
              <h4>minimumBandwidthUp</h4>
            </Col>
            <Col span={4}>
              <Input
                type="number"
                value={minimumBandwidthUp}
                onChange={handleMinimumBandwidthUpChange}
                // className="service-textbox"
              ></Input>
            </Col>
            <Col className="paddingLeft-2" span={8}>
              <Select
                className="width-80"
                value={minimumBandwidthUp}
                onChange={handleMinimumBandwidthUpChangeSelect}
                options={selectOptions}
              ></Select>
            </Col>
          </Row>
          <Row className="alignItems-Center">
            <Col className="marginLeft-3" span={8}>
              <h4>serviceBandwidthDown</h4>
            </Col>
            <Col span={4}>
              <Input
                type="number"
                value={serviceBandwidthDown}
                onChange={handleserviceBandwidthDownChange}
                // className="service-textbox"
              ></Input>
            </Col>
            <Col className="paddingLeft-2" span={8}>
              <Select
                className="width-80"
                value={serviceBandwidthDown}
                onChange={handleserviceBandwidthDownChangeSelect}
                options={selectOptions}
              ></Select>
            </Col>
          </Row>
          <Row className="alignItems-Center">
            <Col className="marginLeft-3" span={8}>
              <h4>serviceBandwidthUp</h4>
            </Col>
            <Col span={4}>
              <Input
                type="number"
                value={serviceBandwidthUp}
                onChange={handleserviceBandwidthUpChange}
                // className="service-textbox"
              ></Input>
            </Col>
            <Col className="paddingLeft-2" span={8}>
              <Select
                className="width-80"
                value={serviceBandwidthUp}
                onChange={handleserviceBandwidthUpChangeSelect}
                options={selectOptions}
              ></Select>
            </Col>
          </Row>
          <Row
            style={{
              marginTop: "3vh",
              marginLeft: "3vw",
              justifyContent: "flex-start",
            }}
          >
            <Col>
              <Button
                shape="round"
                className="prepare-button-change"
                onClick={handlePrepareClick}
              >
                Prepare Service Order
              </Button>
            </Col>

            <Col
              style={{
                display: submitOrder ? "block" : "none",
                marginLeft: "2vw",
              }}
            >
              <Button
                shape="round"
                className="prepare-button-change"
                onClick={handleSubmitClick}
              >
                Submit Service Order
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
      <Spin
        style={{ display: loadingVerify ? "flex" : "none" }}
        fullscreen
        size="large"
      />
      <Card
        style={{ display: jsonDiv ? "block" : "none" }}
        bordered={true}
        className="async-inner-card"
      >
        <div>
          <div className="card-json">
            <h2 style={{ alignItems: "end" }}>
              {!changeOrderRes ? (
                <p>
                  {" "}
                  Generated Change Order JSON{" "}
                  <DownCircleOutlined onClick={handleShowJson} />
                </p>
              ) : (
                "Change Order Placed"
              )}
            </h2>
            {showJson && (
              <ReactJson
                src={JSON.parse(JSON.stringify(jsonData, null, 4))}
                theme="monokai-light"
                style={{
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  letterSpacing: "1px",
                  wordBreak: "break-word",
                  padding: 24,
                  width: "80%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
export default PostProcessor;
