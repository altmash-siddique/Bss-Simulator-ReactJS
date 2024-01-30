import { Card, Row, Col, Input, Button, Select, Spin, Tree } from "antd";

import { DownCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { json } from "./deleteOrderJson";
import ReactJson from "react-json-view";
import ApiService from "../../services/apiService";
import { ECM_API_LAMBDA, SERVICE_ORDER } from "../../constants/apiEndpoints";
const PostProcessorDel = ({ selectedEnvironment, srApiRes }) => {
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
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [treeChildren, setTreeChildren] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const apiService = new ApiService(selectedEnvironment);

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };
  const handleShowJson = () => {
    setShowJson(!showJson);
  };
  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };
  const handlePrepareClick = () => {
    if (checkedKeys === undefined) {
      console.log("asdasd");
    } else {
      setJsonData({});
      let jsonStruc = json;
      jsonStruc.orderItem = [];
      console.log(json, "JSON");
      setChangeOrderRes(null);
      //requestID
      let randomNumber =
        Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;
      jsonStruc.requestId = randomNumber.toString();
      //requestedCompletionDate
      const currentDate = new Date();
      const tenDaysAhead = new Date(currentDate);
      tenDaysAhead.setDate(currentDate.getDate() + 10);
      jsonStruc.requestedCompletionDate = tenDaysAhead;
      //orderItems
      console.log(srApiRes);
      for (let x = 0; x < srApiRes.serviceRelationships.length + 1; x++) {
        if (x === 0) {
          jsonStruc.orderItem.push({
            id: x + 1,
            action: "Delete",
            service: {
              id: srApiRes.id,
            },
          });
        } else {
          jsonStruc.orderItem.push({
            id: x + 1,
            action: "Delete",
            service: {
              id: srApiRes.serviceRelationships[x - 1].service.id,
            },
          });
        }
      }
      console.log(jsonStruc);
      setJsonData({ jsonStruc });
      setShowJson(true);
      setJsonDiv(true);
      setSubmitOrder(true);
    }
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
    if (srApiRes.serviceCharacteristics) {
      let serviceTreeChars = [];
      for (let x = 0; x < srApiRes.serviceRelationships.length; x++) {
        console.log(srApiRes.serviceRelationships[x].service);
        serviceTreeChars.push({
          title:
            srApiRes.serviceRelationships[x].service.name +
            " - " +
            srApiRes.serviceRelationships[x].service.id,
          key: srApiRes.serviceRelationships[x].service.name,
          isLeaf: true,
          checkable: false,
        });
      }
      setTreeData([
        {
          title: srApiRes.name + " - " + srApiRes.id,
          key: srApiRes.name,
          children: serviceTreeChars,
        },
      ]);
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
                : srApiRes.name === "CFS_VOICE_GROUP"
                ? "block"
                : "none",
          }}
        >
          <Row className="alignItems-Center">
            <Col className="marginLeft-3" span={16}>
              <Tree
                multiple
                defaultExpandAll
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                onSelect={onSelect}
                defaultCheckedKeys={srApiRes.name}
                selectedKeys={selectedKeys}
                treeData={treeData}
                className="treeData"
              />
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
        bordered={false}
        className="async-inner-card "
      >
        <div>
          <div className="card-json">
            <h2 style={{ alignItems: "end" }}>
              {!changeOrderRes ? (
                <p>
                  {" "}
                  Generated Delete Order JSON{" "}
                  <DownCircleOutlined onClick={handleShowJson} />
                </p>
              ) : (
                <p>
                  {" "}
                  Delete Order Placed{" "}
                  <DownCircleOutlined onClick={handleShowJson} />
                </p>
              )}
            </h2>
            {showJson && (
              <Card bordered={false}>
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
              </Card>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
export default PostProcessorDel;
