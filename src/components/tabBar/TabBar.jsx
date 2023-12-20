// TabBar.js
import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Subheader from '../subHeader/SubHeader';
import RouteConfig from '../../routes/Route'; // Import the Routes component
import { getAppConfig } from '../../constants/apiConfig';
import './TabBar.css';

const { TabPane } = Tabs;

const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedEnvironment, setSelectedEnvironment] = useState('INT');
  const [activeKey, setActiveKey] = useState(location.pathname);

  const handleEnvironmentChange = (newEnvironment) => {
    setSelectedEnvironment(newEnvironment);
  };

  const handleChange = (key) => {
    setActiveKey(key);
    navigate(key); // Update the URL when the tab changes
  };

  useEffect(() => {
    setActiveKey(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // Update selectedEnvironmentName when selectedEnvironment changes
    const config = getAppConfig(selectedEnvironment);

  }, [selectedEnvironment]);

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
            onClick={() => handleChange('/feasibility')}
          />
          <TabPane
            tab="Service Ordering"
            key="/service-ordering"
            onClick={() => handleChange('/service-ordering')}
          />
          <TabPane
            tab="Async Messages"
            key="/async-messages"
            onClick={() => handleChange('/async-messages')}
          />
          <TabPane
            tab="Change/Disconnect Order"
            key="/change-order"
            onClick={() => handleChange('/change-order')}
          />
        </Tabs>

        {/* Use the Routes component for rendering content based on routes */}
        <RouteConfig selectedEnvironment={selectedEnvironment} />
      </div>
    </div>
  );
};

export default TabBar;
