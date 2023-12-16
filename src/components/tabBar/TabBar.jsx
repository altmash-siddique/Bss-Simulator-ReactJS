import React, { useState } from "react";
import { Tabs, Menu } from "antd";
import Subheader from "../subHeader/SubHeader"; // Import the Subheader component
import ServiceOrdering from "../serviceOrdering/ServiceOrdering";
import Feasibility from "../feasibility/Feasibility";
import AsyncMessages from "../asyncMsgs/AsyncMessages";
import ChangeOrder from "../changeOrder/ChangeOrder";
import { ServiceCharacterstics } from "../serviceOrdering/serviceCharacterstics";
import "./TabBar.css";

const { TabPane } = Tabs;

const TabBar = () => {
  const [activeKey, setActiveKey] = useState("1");

  const handleChange = (key) => {
    setActiveKey(key);
  };

  return (
    <div>
      <Subheader />
      <div className="tabs-section">
        <Tabs
          type="card"
          activeKey={activeKey}
          onChange={handleChange}
          className="tabs-container"
        >
          <TabPane tab="Feasibility Check" key="1">
            <Feasibility />
          </TabPane>
          <TabPane tab="Service Ordering" key="2">
            <ServiceOrdering data={ServiceCharacterstics} />
          </TabPane>
          <TabPane tab="Async Messages" key="3">
            <AsyncMessages />
          </TabPane>
          <TabPane tab="Change/Disconnect Order" key="4">
            <ChangeOrder />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default TabBar;
