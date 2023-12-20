// Route.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Feasibility from '../components/feasibility/Feasibility';
import ServiceOrdering from '../components/serviceOrdering/ServiceOrdering';
import AsyncMessages from '../components/asyncMsgs/AsyncMessages';
import ChangeOrder from '../components/changeOrder/ChangeOrder';
import { ServiceCharacterstics } from '../components/serviceOrdering/serviceCharacterstics';
import FeasibilityInsertData from '../components/feasibilityInsertData/FeasibilityInsertData';

const RouteConfig = ({ selectedEnvironment }) => (
  <Routes>
    <Route
      path="/"
      element={<Feasibility selectedEnvironment={selectedEnvironment} />}
    />
    <Route
      path="/feasibility"
      element={<Feasibility selectedEnvironment={selectedEnvironment} />}
    />
    <Route
      path="/service-ordering"
      element={
        <ServiceOrdering
          data={ServiceCharacterstics}
          selectedEnvironment={selectedEnvironment}
        />
      }
    />
    <Route
      path="/async-messages"
      element={<AsyncMessages selectedEnvironment={selectedEnvironment} />}
    />
    <Route
      path="/change-order"
      element={<ChangeOrder selectedEnvironment={selectedEnvironment} />}
    />
     <Route
      path="/feasibility-results"
      element={<FeasibilityInsertData />}
    />
  </Routes>
);

export default RouteConfig;
