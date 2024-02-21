import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Dropdown,
  Menu,
  notification,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./AsyncMessages.css"; // Import your custom CSS file for component styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { ORDER } from "../../constants/apiEndpoints";
import { WORKORDER_EVENT, SERVICE_ORDER} from "../../constants/apiEndpoints";
import { APPOINTMENTMANAGEMENT_EVENT } from "../../constants/apiEndpoints";
import ApiService from "../../services/apiService";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
const AsyncMessages = ({ selectedEnvironment }) => {
  const apiService = new ApiService(selectedEnvironment);
  const [selectedVersion, setSelectedVersion] = useState("Select Order Type");
  const [activationOrderCreation, setActivationOrderCreation] = useState(false);
  const [activationOrderCompleted, setActivationOrderCompleted] =
    useState(false);
  const [activationOrderCancelled, setActivationOrderCancelled] =
    useState(false);
    const [activationAppointmentPlanning, setActivationAppointmentPlanning] =
    useState(false);
    const [sentResumePending, setSentResumePending] =
    useState(false);
  const [exclamationErrorCreation, setExclamationErrorCreation] =
    useState(false);
  const [exclamationErrorCompleted, setExclamationErrorCompleted] =
    useState(false);
  const [exclamationAppointmentPlanning, setExclamationAppointmentPlanning] =
    useState(false);
    const [exclamationErrorCancelled, setExclamationErrorCancelled] =
    useState(false);
    const [exclamationResumePending, setExclamationResumePending] =
    useState(false);
  const [orderId, setOrderId] = useState("");
  const [api, contextHolder] = notification.useNotification();

  const [selectedDate, setSelectedDate] = useState(null);
  

  const [activationTriggerSent, setActivationTriggerSent] = useState(false);
    const [externalOrderId, setExternalOrderId] = useState('');
    const [cfsMobileBackupDetails, setCfsMobileBackupDetails] = useState({
        id: '',
        serviceId: '',
        msisdn: ''
    });
  const CFS_IP_ACCESS_MOBILE_BACKUP = "CFS_IP_ACCESS_MOBILE_BACKUP"

  const notificationAction = (message) => {
   // Show notification here
   notification.open({
    message: (
      <span style={{ color: "white", fontWeight: "bold" }}>
        <CloseCircleOutlined style={{ marginRight: "8px" }} />
        Error
      </span>
    ),
    description: (
      <span style={{ color: "white", fontWeight: "bold" }}>
        {message}
      </span>
    ),
    duration: 5,
    style: {
      backgroundColor: "#e0243a",
    },
    placement: "topRight",
  });

  return (
    <div>
      <FontAwesomeIcon
        icon={faExclamationCircle}
        className="fa-exclamation-circle"
        size="lg"
      />
    </div>
  );
  }

  const appointmentPlannerFC = async () => {
    if (orderId == null || orderId == undefined || orderId === "") {
      notificationAction('Order ID is missing');
      setExclamationAppointmentPlanning(true);
    }
    if (!selectedDate) {
      notificationAction('Appointment Date is missing');
      setExclamationAppointmentPlanning(true);
    }
    console.log(moment(selectedDate.$d));
    const appointmentDate = moment(selectedDate.$d).format('YYYY-MM-DD');

    if(appointmentDate != "Invalid date"){
    setActivationAppointmentPlanning(false);
    // Construct the payload with the selected date
    const appointmentPlannerJSONData = {
      eventType: 'AppointmentAttributeValueChangeEvent',
      eventId: '2104',
      eventDescription: 'Appointmentupdate',
      eventTime: '',
      event: {
        appointment: {
          id: '',
          href: '',
          description: '',
          externalId: orderId,
          status: 'accepted',
          creationDate: new Date(),
          lastUpdate: new Date(),
          validFor: {
            startDateTime: `${appointmentDate}T08:00:00.000Z`,
            endDateTime: `${appointmentDate}T12:00:00.000Z`,
          },
        },
      },
    };

    // Perform API call with appointmentPlannerJSONData
    try {
      const useeocApi = true;
      const apiendpoint = APPOINTMENTMANAGEMENT_EVENT.PATH;
      const headerData =  {
        'Content-Type': 'application/json',
        'x-api-version': '1.0',
        Authorization: "Basic c3ZjX2NvbXVzZXI6ZXFDU0NxPmU4Iw==",
      };

      const response = await apiService.post(
        apiendpoint,
        appointmentPlannerJSONData,
        headerData,
        "",
        useeocApi
      );
     
      if(response){
        setExclamationAppointmentPlanning(false);
        setActivationAppointmentPlanning(true);
      }
      else {
        setExclamationAppointmentPlanning(true);
      }
    
     
    } catch (error) {
      console.error('Error making API request:', error);
      notificationAction(error.message);
      setExclamationAppointmentPlanning(true);
    }
  }
  else {
    notificationAction("Invalid Date");
  }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
   
  };

  const handleInputChange = (e) => {
    setOrderId(e.target.value);
  };

  const getOrderData = async () => {
    var endpoint;
    const useeocApi = true; // Adjust based on your conditions
    // Simulating condition when orderId is not available
    if (orderId == null || orderId == undefined || orderId === "") {
      notificationAction('Order ID is missing');
    }
    if (orderId) {
      endpoint = `${ORDER.PATH}/${orderId}/`;
    }

    const headers = {
      "Content-Type": "application/json",
    };
    const params = { expand: "orderItems" }; // Pass params as an object
    const response = await apiService.get(endpoint, headers, params, useeocApi);

    return response;
  };
  const sendOrderCreationFC = async () => {
    try {
      setActivationOrderCreation(false);
      const response = await getOrderData(); // Get order data
      if (response) {
        await orderCreationFC(response);
      }
    } catch (error) {
      console.error("Error:", error);
      notificationAction(error.message);
      setExclamationErrorCreation(true); // Set exclamation error if there's an error
    }
  };

  const orderCreationFC = async (data) => {
    try {
      const todaysDate = new Date();
      const yearValue = todaysDate.getFullYear();
      const monthValue = todaysDate.getMonth();
      const dayValue = todaysDate.getDate();
      const yearPlusDate = new Date(yearValue + 1, monthValue, dayValue);
      const timeInMilliseconds = todaysDate.getTime();
      const useeocApi = true;
      const apiendpoint = WORKORDER_EVENT.PATH;
      const headerData = {
        "Content-Type": "application/json",
        "x-api-version": "1.0",
        Authorization: "Basic c3ZjX2NvbXVzZXI6ZXFDU0NxPmU4Iw==",
      };

      const FCOrderCreationJSONData = {
        eventType: "ServiceOrderCreateNotification",
        eventId: "2001",
        eventDescription: "Order creation",
        eventTime: "2022-12-13T09:48:40.000Z",
        event: {
          serviceOrder: {
            requestId: timeInMilliseconds,
            externalId: orderId,
            description: "Service order for IP Access",
            category: "Install New",
            requestedStartDate: todaysDate.toISOString(),
            requestedCompletionDate: yearPlusDate.toISOString(),
            relatedParty: [
              {
                id: "0016N00000ULjtVQAT",
                role: "Customer",
              },
            ],
            state: "Created",
            serviceOrderItem: data.orderItems,
          },
        },
      };

      const response = await apiService.post(
        apiendpoint,
        FCOrderCreationJSONData,
        headerData,
        "",
        useeocApi
      );
      if (response) {
        setExclamationErrorCreation(false);
        setActivationOrderCreation(true);
      } else {
        setExclamationErrorCreation(true);
      }
    } catch (error) {
      console.error("Error:", error);
      notificationAction(error.message);
      setExclamationErrorCreation(true); // Set exclamation error if there's an error
    }
  };

  const sendOrderCompletedFC = async () => {
    try {
      setActivationOrderCompleted(false);
      const response = await getOrderData(); // Get order data
      if (response) {
        await orderCompletedFC(response);
      }
    } catch (error) {
      console.error("Error:", error);
      notificationAction(error.message);
      setExclamationErrorCompleted(true);
    }
  };
  const orderCompletedFC = async (data) => {
    try {
      const todaysDate = new Date();
      const yearValue = todaysDate.getFullYear();
      const monthValue = todaysDate.getMonth();
      const dayValue = todaysDate.getDate();
      const yearPlusDate = new Date(yearValue + 1, monthValue, dayValue);
      const timeInMilliseconds = todaysDate.getTime();
      const apiendpoint = WORKORDER_EVENT.PATH;
      const useeocApi = true;
      const headerData = {
        "Content-Type": "application/json",
        "x-api-version": "1.0",
        Authorization: "Basic c3ZjX2NvbXVzZXI6ZXFDU0NxPmU4Iw==",
      };

      const FCOrderCompletedJSONData = {
        eventType: "ServiceOrderUpdatedNotification",
        eventId: "2002",
        eventDescription: "Order completed",
        eventTime: "2022-12-13T09:48:40.000Z",
        event: {
          serviceOrder: {
            requestId: timeInMilliseconds,
            externalId: orderId,
            description: "Service order for IP Access",
            category: "Install New",
            requestedStartDate: todaysDate.toISOString(),
            requestedCompletionDate: yearPlusDate.toISOString(),
            relatedParty: [
              {
                id: "0016N00000ULjtVQAT",
                role: "Customer",
              },
            ],
            state: "Completed",
            serviceOrderItem: data.orderItems,
          },
        },
      };

      const response = await apiService.post(
        apiendpoint,
        FCOrderCompletedJSONData,
        headerData,
        "",
        useeocApi
      );
      if (response) {
        setExclamationErrorCompleted(false);
        setActivationOrderCompleted(true);
      } else {
        setExclamationErrorCompleted(true);
      }
    } catch (error) {
      console.error("Error:", error);
      notificationAction(error.message);
      setExclamationErrorCompleted(true);
    }
  };

  const sendOrderCancelledFC = async () => {
    try {
      setActivationOrderCancelled(false);
      const response = await getOrderData(); 
      if(response){
        await orderCancelledFC(response); 
      }
      
    } catch (error) {
      console.error("Error making API request:", error);
      notificationAction(error.message);
      setExclamationErrorCancelled(true);
    }
  };

  const orderCancelledFC = async (data) => {
    try {
      const todaysDateValue = new Date();
      const yearValue = todaysDateValue.getFullYear();
      const monthValue = todaysDateValue.getMonth();
      const dayValue = todaysDateValue.getDate();
      const yearPlusDate = new Date(yearValue + 1, monthValue, dayValue);
      const todaysDate = new Date();
      const timeInMilliSeconds = "" + todaysDate.getTime();

      const apiendpoint = WORKORDER_EVENT.PATH;
      const useeocApi = true;
      const headerData = {
        "Content-Type": "application/json",
        "x-api-version": "1.0",
        Authorization: "Basic c3ZjX2NvbXVzZXI6ZXFDU0NxPmU4Iw==",
      };

      const fcOrderCancelledJSONData = {
        eventType: "ServiceOrderUpdatedNotification",
        eventId: "2003",
        eventDescription: "Order cancelled",
        eventTime: "2022-12-13T09:48:40.000Z",
        event: {
          serviceOrder: {
            requestId: timeInMilliSeconds,
            externalId: orderId,
            description: "Service order for IP Access",
            category: "Install New",
            requestedStartDate: todaysDate.toISOString(),
            requestedCompletionDate: yearPlusDate.toISOString(),
            relatedParty: [
              {
                id: "0016N00000ULjtVQAT",
                role: "Customer",
              },
            ],
            state: "Cancelled",
            serviceOrderItem: data.orderItems,
          },
        },
      };

      const response = await apiService.post(
        apiendpoint,
        fcOrderCancelledJSONData,
        headerData,
        "",
        useeocApi
      );
      if (response) {
        setExclamationErrorCancelled(false);
        setActivationOrderCancelled(true);
      }
      else {
        setExclamationErrorCancelled(true);
      }
    } catch (error) {
      console.error("Error making API request:", error);
      notificationAction(error.message);
      setExclamationErrorCancelled(true);
    }
  };

  const handleMenuClick = (e) => {
    setSelectedVersion(e.item.props.children);
  };

  const sentResumePendingBSS = async () => {
    try {
      const useeocApi = true;
      let apiendpoint;
      if (orderId == null || orderId == undefined || orderId === "") {
        notificationAction("Order ID is missing");
        return;
      }
      if (orderId) {
        apiendpoint = `${SERVICE_ORDER.v1}/${orderId}/resumePending`;
      }

      let headerData = {
        "Content-Type": "application/json",
        Authorization: "Basic c3ZjX2NvbXVzZXI6ZXFDU0NxPmU4Iw==",
      };
      setSentResumePending(false);
      const response = await apiService.post(
        apiendpoint,
        "",
        headerData,
        "",
        useeocApi
      );
      if (response) {
        setExclamationResumePending(false);
        setSentResumePending(true);
      } else {
        setExclamationResumePending(true);
      }
    } catch (error) {
      console.error("Error from Resume Pending", error);
      notificationAction(error.message);
      setExclamationResumePending(true);
    }
  };
 
  const getMobileBackupData = async() => {
    try {

      const useeocApi = true;
      let apiendpoint;
      if (orderId == null || orderId == undefined || orderId === "") {
        notificationAction("Order ID is missing");
        return;
      }
      if (orderId) {
        apiendpoint = `${ORDER.PATH}/${orderId}/`;
      }

      const headers = {
        "Content-Type": "application/json",
      };
      const params = { expand: "orderItems" }; // Pass params as an object
      const response = await apiService.get(apiendpoint, headers, params, useeocApi);
      
    return response;

    

  } catch (error) {
      console.error('Error from Activation Trigger', error);
  }
  };

  const sendActivationTrigger = async (activationType) => {
    try {

      const response = await getMobileBackupData(); // Get order data
      if(response){
        const data = response;
        console.log('Response from Activation Trigger', data);
        console.log('Order items:', data.orderItems);
        console.log("apiService", apiService)
      setExternalOrderId(data.externalID);
      const mobileBackupItem = data.orderItems.find(items => items.item.cfs === CFS_IP_ACCESS_MOBILE_BACKUP);
      if (mobileBackupItem) {
          setCfsMobileBackupDetails({
              id: mobileBackupItem.item.id,
              serviceId: mobileBackupItem.item.serviceId,
              msisdn: mobileBackupItem.item.serviceCharacteristics.find(sc => sc.name === 'msisdn').value
          });
      }
     
        let activationTriger = '';
        if (activationType === 'success') {
            activationTriger = JSON.stringify({
                resourceType: 'order',
                eventId: '1110',
                eventDescription: 'MobileServiceActivationRequest',
                eventType: 'ServiceOrderStateChangeNotification',
                eventTime: new Date(),
                event: {
                    serviceOrder: {
                        id: orderId,
                       // href: `${selectedURL.urlLink}/eoc/serviceOrderingManagement/v1/serviceOrder/${orderId}`,
                        externalId: externalOrderId,
                        state: 'InProgress',
                        orderItem: [{
                            id: cfsMobileBackupDetails.id,
                            state: 'Completed',
                            service: {
                                id: cfsMobileBackupDetails.serviceId,
                                serviceSpecification: {
                                    id: cfsMobileBackupDetails.serviceId,
                                   // href: `${selectedURL.urlLink}/serviceOrderingManagement/v1/serviceOrder/${orderId}/serviceOrderingOrderItem/${cfsMobileBackupDetails.serviceId}`,
                                    baseType: 'ServiceSpecification'
                                },
                                serviceCharacteristic: [{ name: 'msisdn', value: cfsMobileBackupDetails.msisdn }]
                            }
                        }]
                    }
                }
            });
        } else if (activationType === 'failed') {
            activationTriger = JSON.stringify({
                resourceType: 'order',
                eventId: '1110',
                eventDescription: 'MobileServiceActivationRequest',
                eventType: 'ServiceOrderStateChangeNotification',
                eventTime: new Date(),
                event: {
                    serviceOrder: {
                        id: orderId,
                       // href: `${selectedURL.urlLink}/eoc/serviceOrderingManagement/v1/serviceOrder/${orderId}`,
                        externalId: externalOrderId,
                        state: 'Held',
                        orderItem: [{
                            id: cfsMobileBackupDetails.id,
                            state: 'Held',
                            service: {
                                id: cfsMobileBackupDetails.serviceId,
                                serviceSpecification: {
                                    id: cfsMobileBackupDetails.serviceId,
                                   // href: `${selectedURL.urlLink}/serviceOrderingManagement/v1/serviceOrder/${orderId}/serviceOrderingOrderItem/${cfsMobileBackupDetails.serviceId}`,
                                    baseType: 'ServiceSpecification'
                                },
                                serviceCharacteristic: [{ name: 'msisdn', value: cfsMobileBackupDetails.msisdn }]
                            },
                            errorMessage: [{ code: '0', message: 'MobileActivationFailed' }]
                        }]
                    }
                }
            });
        }
        console.log('1001EventJsonBody : ' + activationTriger);

        const useeocApi = true;
        let apiendpoint;
        if (orderId == null || orderId == undefined || orderId === "") {
          notificationAction("Order ID is missing");
          return;
        }
        if (orderId) {
          apiendpoint = `${SERVICE_ORDER.v1}/${orderId}/event`;
        }

      const headers = {
        "Content-Type": "application/json",
        "Authorization": 'Basic c3ZjX2NvbXVzZXI6ZXFDU0NxPmU4Iw=='
      };
    
      const responseData = await apiService.post(
        apiendpoint,
        activationTriger,
        headers,
        "",
        useeocApi
      );
      if(responseData){
        setActivationTriggerSent(true);
       // notificationAction('Activation Trigger sent successfully with action' + activationType);
      }
      else {
      //  notificationAction('Activation Trigger is  with action' + activationType);
      }
      
        
      }
    } catch (error) {
        console.error('Error from Activation Trigger', error);
    }
};

  const renderIcon = (actionType) => {
    if (actionType === "activationOrderCreation") {
      if (exclamationErrorCreation) {
        return (
          <div>
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="fa-exclamation-circle"
              size="lg"
            />
          </div>
        );
      } else if (activationOrderCreation) {
        return (
          <div>
            <FontAwesomeIcon
              className="fa-check-circle"
              icon={faCheckCircle}
              size="lg"
            />
          </div>
        );
      }
    }
    if (actionType === "activationOrderCompleted") {
      if (exclamationErrorCompleted) {
        return (
          <div>
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="fa-exclamation-circle"
              size="lg"
            />
          </div>
        );
      } else if (activationOrderCompleted) {
        return (
          <div>
            <FontAwesomeIcon
              className="fa-check-circle"
              icon={faCheckCircle}
              size="lg"
            />
          </div>
        );
      }
    }

    if (actionType === "activationOrderCancelled") {
      if (exclamationErrorCancelled) {
        return (
          <div>
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="fa-exclamation-circle"
              size="lg"
            />
          </div>
        );
      } else if (activationOrderCancelled) {
        return (
          <div>
            <FontAwesomeIcon
              className="fa-check-circle"
              icon={faCheckCircle}
              size="lg"
            />
          </div>
        );
      }
    }
    if (actionType === "activationAppointmentPlanning") {
      if (exclamationAppointmentPlanning) {
        return (
          <div>
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="fa-exclamation-circle"
              size="lg"
            />
          </div>
        );
      } else if (activationAppointmentPlanning) {
        return (
          <div>
            <FontAwesomeIcon
              className="fa-check-circle"
              icon={faCheckCircle}
              size="lg"
            />
          </div>
        );
      }
    }
    if (actionType === "sentResumePending") {
      if (exclamationResumePending) {
        return (
          <div>
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="fa-exclamation-circle"
              size="lg"
            />
          </div>
        );
      } else if (sentResumePending) {
        return (
          <div>
            <FontAwesomeIcon
              className="fa-check-circle"
              icon={faCheckCircle}
              size="lg"
            />
          </div>
        );
      }
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">New line</Menu.Item>
      <Menu.Item key="2">Change</Menu.Item>
      <Menu.Item key="3">Disconnect</Menu.Item>
      <Menu.Item key="4">Cancel</Menu.Item>
      <Menu.Item key="5">Revise</Menu.Item>
      <Menu.Item key="6">Migrate out</Menu.Item>
      <Menu.Item key="7">New Delay</Menu.Item>
    </Menu>
  );
  return (
    <div className="background-container">
      <div className="orderid-custom-div">
        <Row gutter={[24, 24]} className="orderid-row">
          <Col xs={24} sm={12} md={8} lg={8} className="orderid-label">
            <h3>Order ID:</h3>
          </Col>
          <Col xs={24} sm={12} md={8} lg={16}>
            <Input
              className="orderid-textbox"
              value={orderId}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
      </div>
      <div className="container-async">
        <Row gutter={[16, 16]} className="custom-row">
          <Col xs={24} sm={24} md={24} lg={8} className="custom-col">
            <Card title="WBA Async Messages" bordered={false}>
              {/* Nested Card */}
              <Card bordered={false} className="async-inner-card">
                <Row>
                  <Col xs={24} sm={24} md={24} lg={8} className="col-item">
                    <h5>Error Code:</h5>
                    <Input placeholder="Error Code" />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={10}>
                    <h5>Order Note:</h5>
                    {/* Textarea */}
                    <Input.TextArea placeholder="Textarea" rows={4} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={8} className="col-item">
                    <h5>Comment Code:</h5>
                    <Input placeholder="Comment Code" />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={10}>
                    <h5>Service Group:</h5>
                    <Input placeholder="Service Group" />
                  </Col>
                </Row>
              </Card>
              <Card bordered={false} className="async-inner-card">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8} lg={5}>
                    <h5>Select Order Type:</h5>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Dropdown overlay={menu}>
                      <Button className="ordertype-dropdown">
                        {selectedVersion}
                        <DownOutlined />
                      </Button>
                    </Dropdown>
                  </Col>
                </Row>
                <Row gutter={[24, 24]} className="async-date-button-row">
                  <Col xs={24} sm={12} md={8} lg={6} className="async-col">
                    <DatePicker className="datefield" />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="async-col">
                    <Button type="primary" className="async-triggers-button">
                      NEW_SA
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6} className="async-col">
                    <Button type="primary" className="async-triggers-button">
                      NEW_RFS
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="custom-row">
          <Col xs={24} sm={24} md={24} lg={8} className="custom-col">
            <Card title="BSS Async Triggers" bordered={false}>
              <Button type="primary" className="bss-async-triggers-button" onClick={sentResumePendingBSS}>
              {renderIcon("sentResumePending")}
                Resume Pending
              </Button>
              <Button type="primary" className="bss-async-triggers-button"
              onClick={() => sendActivationTrigger("success")}>
                SIM Activation Successful
              </Button>
              <Button type="primary" className="bss-async-triggers-button"  onClick={() => sendActivationTrigger("failed")}>
                SIM Activation Failed
              </Button>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="custom-row">
          <Col xs={24} sm={24} md={24} lg={8} className="custom-col">
            <Card title="FC Async Triggers" bordered={false}>
              <Row>
                <Button
                  type="primary"
                  className="fc-async-triggers-button"
                  onClick={sendOrderCreationFC}
                >
                  {renderIcon("activationOrderCreation")}
                  Order Creation
                </Button>

                <Button type="primary" className="fc-async-triggers-button"
                onClick={appointmentPlannerFC}>
                  {renderIcon("activationAppointmentPlanning")}
                 &nbsp; &nbsp;Appointment Planner
                </Button>
                <Button
                  type="primary"
                  className="fc-async-triggers-button"
                  onClick={sendOrderCompletedFC}
                >
                  {renderIcon("activationOrderCompleted")}
                  Order Completed
                </Button>
              </Row>
              <Row justify="center" align="middle" className="appointment-date">
                <Col span={8}>
                <DatePicker onChange={handleDateChange} />
                </Col>
              </Row>
              <Row>
                <Button
                  type="primary"
                  className="fc-async-triggers-button"
                  onClick={sendOrderCancelledFC}
                >
                  {renderIcon("activationOrderCancelled")}
                  Order Cancel
                  
                
                </Button>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AsyncMessages;
