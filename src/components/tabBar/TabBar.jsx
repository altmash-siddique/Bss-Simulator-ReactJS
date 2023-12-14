import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ServiceOrdering from '../serviceOrdering/ServiceOrdering';
import Feasibility from '../feasibility/Feasibility';
import AsyncMessages from '../asyncMsgs/AsyncMessages';
import ChangeOrder from '../changeOrder/ChangeOrder';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TabBar = () => {
    const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Feasibility Check" {...a11yProps(0)} />
          <Tab label="Service Ordering" {...a11yProps(1)} />
          <Tab label="Async Messages" {...a11yProps(2)} />
          <Tab label="Change/Disconnect Order" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Feasibility></Feasibility>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ServiceOrdering></ServiceOrdering>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <AsyncMessages></AsyncMessages>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ChangeOrder></ChangeOrder>
      </CustomTabPanel>
    </Box>
  );
}

export default TabBar