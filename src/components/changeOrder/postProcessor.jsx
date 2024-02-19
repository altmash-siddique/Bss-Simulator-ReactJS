import { Card, Row, Col, Input, Button, Select, Spin, Tooltip } from "antd";
import { DownCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { json } from "./changeOrderJsons";
import { wholeSaleJson } from "./addIConExistingAccess";
import ReactJson from "react-json-view";
import ApiService from "../../services/apiService";
import { PlusCircleOutlined } from "@ant-design/icons";
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
  const [mainDivDisp, setMainDivDisp] = useState();
  // const [ipEncapsulationType, setIpEncapsulationType] = useState([]);
  // const [qualityClass, setQualityClass] = useState([]);
  // const [endUserAccessVlan, setEndUserACcessVlan] = useState([]);
  // const [region, setRegion] = useState([]);
  // const [bandwidthUp, setBandwidthUp] = useState([]);
  // const [bandwidthDown, setBandwidthDown] = useState([]);
  // const [interconnectVlan, setInterconnectVlan] = useState([]);

  const [transportInstance, setTransportInstance] = useState([]);
  const apiService = new ApiService(selectedEnvironment);

  const selectOptions = [
    { value: 100, label: "100" },
    { value: 5000, label: "50000" },
    { value: 100000, label: "100000" },
    { value: 200000, label: "200000" },
    { value: 500000, label: "500000" },
    { value: 1000000, label: "1000000" },
  ];

  const ipEncapsulationTypeOptions = [
    { value: "IPoE", label: "IPoE" },
    { value: "PPPoE", label: "PPPoE" },
  ];
  const regionOptions = [{ value: "national", label: "national" }];
  const qualityClassOptions = [{ value: "Standard", label: "Standard" }];

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
    if (mainDivDisp === "IPACCESS") {
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
    } else {
      setChangeOrderRes(null);
      let jsonStruc = wholeSaleJson;
      jsonStruc.serviceOrderItem = [];
      let randomNumber =
        Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;
      jsonStruc.requestId = randomNumber.toString();
      let instances = [...transportInstance];
      for (let x = 0; x < instances.length; x++) {
        jsonStruc.serviceOrderItem.push(
          {
            id:
              jsonStruc.serviceOrderItem.length > 0
                ? jsonStruc.serviceOrderItem[
                    jsonStruc.serviceOrderItem.length - 1
                  ].id + 1
                : x,
            action: "Add",
            service: {
              serviceCharacteristic: [
                {
                  name: "qualityClass",
                  valueType: "String",
                  value: instances[x].qualityClass,
                },
                {
                  name: "ipEncapsulationType",
                  valueType: "String",
                  value: instances[x].ipEncapsulationType,
                },
                {
                  name: "endUserAccessVlan",
                  valueType: "String",
                  value: instances[x].endUserAccessVlan,
                },
              ],
              serviceSpecification: {
                name: "CFS_P2MP_ETH",
              },
            },
          },
          {
            id:
              jsonStruc.serviceOrderItem.length > 0
                ? jsonStruc.serviceOrderItem[
                    jsonStruc.serviceOrderItem.length - 1
                  ].id + 2
                : x + 1,
            action: "Add",
            serviceOrderItemRelationship: [
              {
                relationshipType: "ReliesOn",
                orderItem: {
                  itemId:
                    jsonStruc.serviceOrderItem.length > 0
                      ? jsonStruc.serviceOrderItem[
                          jsonStruc.serviceOrderItem.length - 1
                        ].id + 1
                      : x,
                },
              },
            ],
            service: {
              serviceRelationship: [
                {
                  relationshipType: "reliesOn",
                  service: {
                    id: srApiRes.id,
                  },
                },
              ],
              serviceSpecification: {
                name: "CFS_P2MP_ETH_SAC_IC",
              },
              serviceCharacteristic: [
                {
                  name: "interconnectVlan",
                  valueType: "String",
                  value: instances[x].interconnectVlan,
                },
                {
                  name: "region",
                  valueType: "String",
                  value: instances[x].region,
                },
                {
                  name: "bandwidthDown",
                  valueType: "String",
                  value: instances[x].bandwidthDown,
                },
                {
                  name: "bandwidthUp",
                  valueType: "String",
                  value: instances[x].bandwidthUp,
                },
              ],
            },
          }
        );
      }
      setJsonData({ jsonStruc });
      setJsonDiv(true);
      setSubmitOrder(true);
    }
  };

  const handleSubmitClick = async () => {
    setLoadingVerify(true);
    // const useeocApi = true; // Adjust based on your conditions
    let endpoint;
    if (mainDivDisp === "IPACCESS") {
      endpoint = SERVICE_ORDER["v1"];
    } else {
      endpoint = SERVICE_ORDER["v4"];
    }
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
  const handleAdditionOfTi = () => {
    if (
      transportInstance.length !== undefined &&
      transportInstance.length <= 3
    ) {
      let instance = {
        ipEncapsulationType: "PPPoE",
        qualityClass: "Standard",
        endUserAccessVlan: "50",
        region: "national",
        bandwidthUp: "500000",
        bandwidthDown: "500000",
        interconnectVlan: "3501",
      };

      setTransportInstance([...transportInstance, instance]);
    } else {
      console.log(transportInstance.length);
      alert("4 is the lmi");
    }
  };
  const handleRemoveTi = (id) => {
    let instances = transportInstance;
    const newArr = [...instances.slice(0, id), ...instances.slice(id + 1)];

    setTransportInstance(newArr);
  };
  const handleIpEncapChange = (value, index) => {
    let instances = [...transportInstance];
    instances[index].ipEncapsulationType = value;
    setTransportInstance(instances);
  };
  const handleQualityClassChange = (value, index) => {
    let instances = [...transportInstance];
    instances[index].qualityClass = value;
    setTransportInstance(instances);
  };
  const handleEndUserAccessVlan = (e) => {
    let instances = [...transportInstance];
    instances[e.target.dataset.index].endUserAccessVlan = e.target.value;
    setTransportInstance(instances);
  };
  const handleRegionChange = (value, index) => {
    let instances = [...transportInstance];
    instances[index].region = value;
    setTransportInstance(instances);
  };
  const handleBandwidthDownChange = (e) => {
    let instances = [...transportInstance];
    instances[e.target.dataset.index].bandwidthDown = e.target.value;
    setTransportInstance(instances);
  };
  const handleBandwidthUpChange = (e) => {
    let instances = [...transportInstance];
    instances[e.target.dataset.index].bandwidthUp = e.target.value;
    setTransportInstance(instances);
  };
  const handleInterConnectVlanChange = (e) => {
    let instances = [...transportInstance];
    instances[e.target.dataset.index].interconnectVlan = e.target.value;
    setTransportInstance(instances);
  };
  useEffect(() => {
    setShowJson(false);
    setJsonDiv(false);
    if (
      srApiRes.serviceCharacteristics &&
      (srApiRes.name === "CFS_IP_ACCESS_GOP_FTTH" ||
        srApiRes.name === "CFS_IP_ACCESS_WBA_FTTH" ||
        srApiRes.name === "CFS_IP_ACCESS_WBA_VDSL")
    ) {
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
    if (
      srApiRes.name === "CFS_IP_ACCESS_GOP_FTTH" ||
      srApiRes.name === "CFS_IP_ACCESS_WBA_FTTH" ||
      srApiRes.name === "CFS_IP_ACCESS_WBA_VDSL"
    ) {
      setMainDivDisp("IPACCESS");
    } else if (srApiRes.name === "CFS_ACCESS") {
      setMainDivDisp("WS");
    } else {
      setMainDivDisp("OTHER");
    }
  }, [srApiRes]);
  return (
    <div>
      <Card bordered={false} className="async-inner-card">
        <div
          style={{
            display: mainDivDisp === "IPACCESS" ? "block" : "none",
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
        <div
          style={{
            display: mainDivDisp === "OTHER" ? "block" : "none",
          }}
        >
          <h2>{srApiRes.name} cannot be modified</h2>
        </div>
        <div
          style={{
            display: mainDivDisp === "WS" ? "block" : "none",
          }}
        >
          <div>
            {transportInstance.length >= 0 ? (
              transportInstance.map((data, index) => {
                return (
                  <Card
                    key={index}
                    bordered={true}
                    // style={{ border: "1px solid blue" }}
                    className="async-inner-card"
                  >
                    <Row className="tiCard">
                      <Tooltip
                        title="Click to remove this TI"
                        color="blue"
                        key="blue"
                      >
                        <button
                          type=""
                          onClick={() => {
                            handleRemoveTi(index);
                          }}
                          className="removeTiButton"
                        >
                          {" "}
                          <MinusCircleOutlined />
                        </button>
                      </Tooltip>
                    </Row>
                    <Card bordered={true} className="async-inner-card">
                      <h2>CFS_P2MP_ETH - {index + 1}</h2>

                      <Row className="alignItems-Center">
                        <Col className="marginLeft-3" span={8}>
                          <h4>ipEncapsulationType</h4>
                        </Col>
                        <Col className="paddingLeft" span={8}>
                          <Select
                            data-index={index}
                            className="width-80"
                            value={data.ipEncapsulationType}
                            onChange={(value) => {
                              handleIpEncapChange(value, index);
                            }}
                            options={ipEncapsulationTypeOptions}
                          ></Select>
                        </Col>
                        <Col className="marginLeft-3" span={8}>
                          <h4>qualityClass</h4>
                        </Col>
                        <Col span={8}>
                          <Select
                            className="width-80"
                            value={data.qualityClass}
                            onChange={(value) => {
                              handleQualityClassChange(value, index);
                            }}
                            options={qualityClassOptions}
                          ></Select>
                        </Col>
                        <Col className="marginLeft-3" span={8}>
                          <h4>endUserAccessVlan</h4>
                        </Col>
                        <Col span={8}>
                          <Input
                            data-index={index}
                            className="width-80"
                            type="text"
                            value={data.endUserAccessVlan}
                            onChange={handleEndUserAccessVlan}
                            // className="service-textbox"
                          ></Input>
                        </Col>
                      </Row>
                    </Card>
                    <Card bordered={true} className="async-inner-card">
                      <h2>CFS_P2MP_ETH_SAC_IC - {index + 1}</h2>

                      <Row className="alignItems-Center">
                        <Col className="marginLeft-3" span={8}>
                          <h4>region</h4>
                        </Col>
                        <Col className="paddingLeft" span={8}>
                          <Select
                            className="width-80"
                            value={data.region}
                            onChange={(value) => {
                              handleRegionChange(value, index);
                            }}
                            options={regionOptions}
                          ></Select>
                        </Col>

                        <Col className="marginLeft-3" span={8}>
                          <h4>bandwidthUp</h4>
                        </Col>
                        <Col span={8}>
                          <Input
                            data-index={index}
                            type="text"
                            value={data.bandwidthUp}
                            onChange={handleBandwidthUpChange}
                            // className="service-textbox"
                            className="width-80"
                          ></Input>
                        </Col>

                        <Col className="marginLeft-3" span={8}>
                          <h4>bandwidthDown</h4>
                        </Col>
                        <Col span={8}>
                          <Input
                            data-index={index}
                            type="text"
                            value={data.bandwidthDown}
                            onChange={handleBandwidthDownChange}
                            // className="service-textbox"
                            className="width-80"
                          ></Input>
                        </Col>

                        <Col className="marginLeft-3" span={8}>
                          <h4>interconnectVlan</h4>
                        </Col>
                        <Col span={8}>
                          <Input
                            data-index={index}
                            className="width-80"
                            type="text"
                            value={data.interconnectVlan}
                            onChange={handleInterConnectVlanChange}
                            // className="service-textbox"
                          ></Input>
                        </Col>
                      </Row>
                    </Card>
                  </Card>
                );
              })
            ) : (
              <p></p>
            )}
            <Row className="alignItems-Center j-center w-100">
              <Tooltip title="Click to add a TI" color="blue" key="blue">
                <Button onClick={handleAdditionOfTi} className="addTIButton">
                  {" "}
                  <PlusCircleOutlined />
                </Button>
              </Tooltip>
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
