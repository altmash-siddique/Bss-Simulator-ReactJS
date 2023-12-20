import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography } from "antd";
import { useLocation } from 'react-router-dom';
import './FeasibilityInsertData.css'

const { Text } = Typography;
const FeasibilityInsertData = () => {
  const [feasibilityDataShow, setFeasibilityDataShow] = useState(true);
  const location = useLocation();
  const feasibilityData = location.state?.feasibilityData;

  useEffect(() => {
    // Check if the current route is '/feasibility-results'
    setFeasibilityDataShow(location.pathname === '/feasibility-results');
  }, [location.pathname, feasibilityData]);

  const InsertInnerFeasibilityData = (itemName, itemId) => {
    // Handle click logic here
    console.log("Item clicked:", itemName, itemId);
  };

  if (!feasibilityDataShow || !feasibilityData || !feasibilityData.serviceQualificationItem) {
    // Handle the case where feasibilityData or serviceQualificationItem is undefined
    return <div>No data available</div>;
  }

  return (
    <div className="feasibility-insert-data-container">
      {feasibilityDataShow && (
         <div className="background-wrapper">
          <Row>
        <Card
          id="FeasibilityDataQualificationItemData"
          className="feasibilityDataCardAlignment shadow bg-white rounded"
        >
          <div className="feasibilityDataHeaderText">
            The following internet speeds are available at your address. We like
            to be honest about speeds, so we expect to be able to actually
            deliver the stated speeds.
          </div>
          <Row gutter={[16, 16]}>
            {feasibilityData.serviceQualificationItem &&
              feasibilityData.serviceQualificationItem.map(
                (item) =>
                  item.service && (
                    <Col key={item.id} span={12}>
                      <Card
                        onClick={() =>
                          InsertInnerFeasibilityData(item.service.name, item.id)
                        }
                        className="feasibilityDataserviceQualificationItem"
                      >
                        <div>
                          <div className="feasibilityServiceName">
                            {item.service.name === "CFS_IP_ACCESS"
                              ? "Alternate Installation Address"
                              : item.service.name}
                            {item.service.serviceCharacteristic &&
                              item.service.serviceCharacteristic.map(
                                (characteristic) => (
                                  <div
                                    key={characteristic.name}
                                    className="feasibilityDataInnerDataAlignmentHeader"
                                  >
                                    {characteristic.name}
                                  </div>
                                )
                              )}
                            {item.service.serviceCharacteristic &&
                              item.service.serviceCharacteristic.map(
                                (characteristic) => (
                                  <div
                                    key={characteristic.name}
                                    className="feasibilityDataInnerDataAlignment"
                                  >
                                    {characteristic.name === "bandwidthDown" ||
                                    characteristic.name === "bandwidthUp"
                                      ? `up to ${Number(
                                          characteristic.value
                                        )} kb/s`
                                      : characteristic.value}
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                      </Card>
                    </Col>
                  )
              )}
          </Row>
        </Card>
        </Row>
        </div>
      )}
    </div>
  );
};

export default FeasibilityInsertData;
