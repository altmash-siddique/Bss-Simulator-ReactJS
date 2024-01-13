// TabBar.js
import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Subheader from "../subHeader/SubHeader";
import RouteConfig from "../../routes/Route"; // Import the Routes component
import { getAppConfig } from "../../constants/apiConfig";
import "./TabBar.css";

const { TabPane } = Tabs;

const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedEnvironment, setSelectedEnvironment] = useState("INT");
  const [activeKey, setActiveKey] = useState(location.pathname);

  const handleEnvironmentChange = (newEnvironment) => {
    setSelectedEnvironment(newEnvironment);
  };

  const handleChange = (key) => {
    if (key !== "/") {
      setActiveKey(key);
      navigate(key);
    }
  };

  console.log("Active: ", activeKey);

  useEffect(() => {
    const currentPathname = location.pathname;
    if (activeKey !== currentPathname) {
      setActiveKey(currentPathname);
    }

    const updateActiveKey = () => {
      const newPathname = window.location.pathname;
      if (activeKey !== newPathname) {
        setActiveKey(newPathname);
      }
    };

    window.addEventListener("popstate", updateActiveKey);

    return () => {
      window.removeEventListener("popstate", updateActiveKey);
    };
  }, [activeKey, location.pathname]);

  return (
    <div>
      <Subheader
        selectedEnvironment={selectedEnvironment}
        onEnvironmentChange={handleEnvironmentChange}
      />
      <div className="tabs-section">
        <Tabs
          type="card"
          onChange={handleChange}
          activeKey={activeKey}
          className="tabs-container"
        >
          <TabPane
            tab="Feasibility Check"
            key="/feasibility"
            className={`${
              activeKey === "/feasibility" ? "default-tab" : "white-tab"
            }`}
            onClick={() => handleChange("/feasibility")}
          />

          <TabPane
            tab="Service Ordering"
            key="/service-ordering"
            className={`${
              activeKey === "/service-ordering" ? "default-tab" : "white-tab"
            }`}
            onClick={() => handleChange("/service-ordering")}
          />

          <TabPane
            tab="Async Messages"
            key="/async-messages"
            className={`${
              activeKey === "/async-messages" ? "default-tab" : "white-tab"
            }`}
            onClick={() => handleChange("/async-messages")}
          />

          <TabPane
            tab="Change/Disconnect Order"
            key="/change-order"
            className={`${
              activeKey === "/change-order" ? "default-tab" : "white-tab"
            }`}
            onClick={() => handleChange("/change-order")}
          />
        </Tabs>

        {/* Use the Routes component for rendering content based on routes */}
        <RouteConfig selectedEnvironment={selectedEnvironment} />
      </div>
    </div>
  );
};

export default TabBar;
