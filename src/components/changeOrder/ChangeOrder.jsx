import React, { useState } from "react";
import { Card, Row, Col, Input, Button, Radio } from "antd";
import "./ChangeOrder.css"; // Import your CSS file

const ChangeOrder = () => {
  const [selectedRadio, setSelectedRadio] = useState(null);

  const handleRadioChange = (e) => {
    setSelectedRadio(e.target.value);
  };

  return (
    <Card className="card-style">
      <div className="centered-container">
        <div className="service-row">
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={8} lg={6} className="serviceid-label">
              <h3>Service ID:</h3>
            </Col>
            <Col xs={24} sm={12} md={8} lg={11}>
              <Input className="service-textbox" />
            </Col>
            <Col xs={24} sm={12} md={8} lg={7}>
              <Button shape="round" className="submit-button" size="large">
                Submit
              </Button>
            </Col>
          </Row>
        </div>

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
    </Card>
  );
};

export default ChangeOrder;
