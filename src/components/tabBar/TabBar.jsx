import React, { useState, useEffect } from "react";
import { Tabs, Menu } from "antd";
import Subheader from "../subHeader/SubHeader"; // Import the Subheader component
import ServiceOrdering from "../serviceOrdering/ServiceOrdering";
import Feasibility from "../feasibility/Feasibility";
import AsyncMessages from "../asyncMsgs/AsyncMessages";
import ChangeOrder from "../changeOrder/ChangeOrder";
import { ServiceCharacterstics } from "../serviceOrdering/serviceCharacterstics";
import "./TabBar.css";
import { getAppConfig } from '../../constants/apiConfig';

const { TabPane } = Tabs;

const TabBar = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [selectedEnvironment, setSelectedEnvironment] = useState('INT');
  const [selectedEnvironmentName, setSelectedEnvironmentName] = useState('INT');
  
  const handleChange = (key) => {
    setActiveKey(key);
  };
  
  const handleEnvironmentChange = (newEnvironment) => {
    setSelectedEnvironment(newEnvironment);
  };

  useEffect(() => {
    // Update selectedEnvironmentName when selectedEnvironment changes
    const config = getAppConfig(selectedEnvironment);
    setSelectedEnvironmentName(config.tykApi ? 'TYK_API' : 'EOC_BASE_URL');
  }, [selectedEnvironment]);


  return (
    <div>
      <Subheader selectedEnvironment={selectedEnvironment} onEnvironmentChange={handleEnvironmentChange}/>
      <div className="tabs-section">
        <Tabs
          type="card"
          activeKey={activeKey}
          onChange={handleChange}
          className="tabs-container"
        >
          <TabPane tab="Feasibility Check" key="1">
            <Feasibility selectedEnvironment={selectedEnvironment} />
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
