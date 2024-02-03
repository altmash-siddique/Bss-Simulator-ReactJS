import React , { useState, useEffect } from 'react';
import { Card, Spin, Row, Button} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import './FeasibilityInnerInsertData.css'
import ReactJson from "react-json-view";
import { toast, Toaster } from "react-hot-toast";
import { DownCircleOutlined } from "@ant-design/icons";

const FeasibilityInnerInsertData = () => {
    const [feasibilitylineDataShow, setFeasibilityLineDataShow] = useState(true);
    const [result, setAppendFeasibilityData] = useState('');
    const [loading, setLoading] = useState(true);
 
  const location = useLocation();
  const navigate = useNavigate();
  const { feasibilityInnerData, name, itemdata } = location.state || {};
  const feasibilitylineData = feasibilityInnerData;

  const [accessServiceId, setAccessServiceId] = useState('');
  const [showJson, setShowJson] = useState(true);
  const [connectionPointAddressJsonData, setConnectionPointAddressJsonData] = useState({});
  const [installationAddressJsonData, setInstallationAddressJsonData] = useState({
   
  });
  const [combinedAddressJsonData, setCombinedAddressJsonData] = useState({
    connectionPoint: {},
    installation: {},
  });
 
  const [orderType, setOrderType] = useState({
    type: '',
    Message: '',
  });

  const [showCFSName, setShowCFSName] = useState({
    VDSL: false,
    Fiber: false,
  });

 
  useEffect(() => {
    // Check if both connectionPointAddressJsonData and installationAddressJsonData have values
    if ((Object.keys(connectionPointAddressJsonData).length > 0) && (Object.keys(installationAddressJsonData).length > 0)) {
      setCombinedAddressJsonData(() => ({
        connectionPoint: { ...connectionPointAddressJsonData },
        installation: { ...installationAddressJsonData },
      }));
   }
  }, [connectionPointAddressJsonData, installationAddressJsonData]);

  useEffect(() => {
    if((Object.keys(combinedAddressJsonData.connectionPoint).length > 0) && (Object.keys(combinedAddressJsonData.installation).length > 0)){
      console.log(combinedAddressJsonData);
      navigate('/service-ordering', { state: { feasibilityPlaceData: combinedAddressJsonData } });
    }
   
  }, [combinedAddressJsonData]);

  const handleProceedClick = () => {
    if (orderType.type === '') {
      setOrderType({
        ...orderType,
        Message: 'Select Existing or Available Line',
      });
      toast.error('Select Existing or Available Line', {
        style: {
          border: '2px solid black',
          padding: '16px',
          color: 'red',
          backgroundColor: '#FEE3E1',
          fontWeight: 'bold',
        },
      });
      return;
    }
  
    // Rest of your logic...
    setShowCFSName({
      ...showCFSName,
      VDSL: orderType.type.includes('Copper'),
      Fiber: orderType.type.includes('Fiber'),
    });
    setAccessServiceId(accessServiceId);
  
    if (feasibilitylineData) {
      feasibilitylineData?.serviceQualificationItem.forEach((item) => {
        var servicequalificationname = item?.service.name;
        var place = item?.service['place'];
  
        if (servicequalificationname === 'CFS_IP_ACCESS' || servicequalificationname === 'CFS_ACCESS') {
          place?.forEach((placeDataforServiceOrder) => {
            if (placeDataforServiceOrder.role === 'alternateInstallationAddress') {
              setInstallationAddressJsonData(() => ({
                ...placeDataforServiceOrder
              }));
            }
          });
        } else {
          place?.forEach((placeDataConnforServiceOrder) => {
            if (placeDataConnforServiceOrder.role === 'connectionPointOption') {
              setConnectionPointAddressJsonData(() => ({
                ...placeDataConnforServiceOrder
               }));
            }
          });
        }
       
      });
      
    } else {
      toast.error("Can't move to Service Order as no place Data", {
        style: {
          border: '2px solid black',
          padding: '16px',
          color: 'red',
          backgroundColor: '#FEE3E1',
          fontWeight: 'bold',
        },
      });
    }
  };
  

  const handleSelectedFeasibilityLineType = (type, id, accessId) => {
    if (type !== orderType.type) {
      setOrderType({ type });
    } else {
      setOrderType({ type: '' });
    }

    if (accessId) {
      setAccessServiceId(accessId);
    }
  };

  const handleShowJson = () => {
    setShowJson(!showJson);
  };
  


  


useEffect(() => {
    // Check if feasibilityData exists and has serviceQualificationItem
    const shouldShowLine = itemdata && itemdata.service;
  
    setFeasibilityLineDataShow(shouldShowLine);
  
    return () => {
        setFeasibilityLineDataShow(false); // Reset state when unmounted
    };
  }, [feasibilitylineData, name, itemdata]);

  const renderFeasibilityData = (place) => {
    if (!feasibilitylineDataShow || !itemdata || !itemdata.service) {
        // Handle the case where feasibilityData or serviceQualificationItem is undefined
        return <div>No itemdata available</div>;
    }

    if (!place || typeof place !== 'object') {
        console.error('Invalid place object:', place);
        return <div>Invalid place data</div>;
    }

    let accessServiceId = place['accessServiceId'] || null;
    let type = place['@type'];
    let id = itemdata.id;
    return (
        <div>
          {feasibilitylineDataShow && (
            <div className="background-inner-wrapper">
          
          <Row className="feasibility-row">
          <Card className="outer-card">
            <Card
                title={place['@type']}
                className={`feasibility-inner-card ${orderType.type === type ? 'selected' : ''}`}
                onClick={() =>
                  handleSelectedFeasibilityLineType(
                    type,
                    id,
                    accessServiceId
                  )
                }
              >
                {place['ISRASpec'] && (
                  <p>
                    <span className="feasibilityDataInnerDataSideHeader">ISRASpec:</span>{' '}
                    {place['ISRASpec']}
                  </p>
                )}
                {place['mdfAccessServiceId'] && (
                  <p>
                    <span className="feasibilityDataInnerDataSideHeader">mdfAccessServiceId:</span>{' '}
                    {place['mdfAccessServiceId']}
                  </p>
                )}
                {place['telephonyType'] && (
                  <p>
                    <span className="feasibilityDataInnerDataSideHeader">telephonyType:</span>{' '}
                    {place['telephonyType']}
                  </p>
                )}
                {place['phoneNumber'] && (
                  <p>
                    <span className="feasibilityDataInnerDataSideHeader">phoneNumber:</span>{' '}
                    {place['phoneNumber']}
                  </p>
                )}
                {place['nlType'] && (
                  <p>
                    <span className="feasibilityDataInnerDataSideHeader">nlType:</span>{' '}
                    {place['nlType']}
                  </p>
                )}
                {place['expectedDeliveryDays'] && (
                  <p>
                    <span className="feasibilityDataInnerDataSideHeader">expectedDeliveryDays:</span>{' '}
                    {place['expectedDeliveryDays']}
                  </p>
                )}
            </Card>
            </Card>
            </Row>
            <Row className="feasibility-row">
              <Card  className="outer-card">
              <Button
              shape="round"
              className="proceed-button-inner"
              onClick={handleProceedClick}
            >
              Proceed Service Order
            </Button>
              </Card>
            </Row>
        </div>
          )}
        
        {/* {showJson && ( */}
          <div>
            <Row className="feasibility-row">
            <div>
              <div className="card-json">
                <h2>
                  Generated Feasibility JSON{" "}
                  <DownCircleOutlined onClick={handleShowJson} />
                </h2>
                {showJson && (
                  <ReactJson
                    src={JSON.parse(
                      JSON.stringify(feasibilitylineData)
                    )}
                    theme="monokai-light"
                    style={{
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      letterSpacing: "1px",
                      padding: 24,
                      minHeight: 280,
                      width: "80%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  />
                )}
              </div>
           </div>

            </Row>
        
           </div> 
           
         
                  
        </div>
      );
    };

  const generateFeasibilityData = () => {
    let appendFeasibilityData = '';
    let feasibilityDataArray = [];
    if (name === 'CFS_IP_ACCESS_WBA_FTTH' || name === 'CFS_IP_ACCESS_GOP_FTTH' || name === 'CFS_ACCESS') {
        const targetService = itemdata && itemdata.service;
        const places = targetService?.place;
        if (places) {
        places.forEach((place) => {
        if (
          place['@type'] === 'AvailableFiberLine' ||
          place['@type'] === 'AvailableCopperLine'
        ) {
            feasibilityDataArray.push(renderFeasibilityData(place));
        } else if (
          (place['@type'] === 'ExistingFiberLine' ||
            place['@type'] === 'PlannedFiberLine') &&
          name !== 'CFS_IP_ACCESS_WBA_VDSL'
        ) {
            feasibilityDataArray.push(renderFeasibilityData(place));
        } else if (
          place['@type'] === 'ExistingCopperLine' ||
          place['@type'] === 'PlannedCopperLine'
        ) {
            feasibilityDataArray.push(renderFeasibilityData(place));
        }
      }
    );
   }
  } else if (name === 'CFS_IP_ACCESS_WBA_VDSL') {
    const targetService = itemdata && itemdata.service;
    const places = targetService?.place;
    if (places) {
        places.forEach((place) => {
        if (place['@type'] === 'AvailableCopperLine') {
          feasibilityDataArray.push(renderFeasibilityData(place));
        } else if (
          place['@type'] === 'ExistingCopperLine' ||
          place['@type'] === 'PlannedCopperLine'
        ) {
          feasibilityDataArray.push(renderFeasibilityData(place));
        }
      }
    );
    }
  }

    // Join the array into a string before returning
    return feasibilityDataArray;
}



useEffect(() => {
  // Simulate an API call or any asynchronous operation
  setTimeout(() => {
      setLoading(false);
      const feasibilityDataArray = generateFeasibilityData();
      setAppendFeasibilityData(feasibilityDataArray);
  }, 2000); // Adjust the timeout duration as needed
}, [feasibilitylineData, name, itemdata]);

return (
    <div>
    {loading && <Spin />}
    {!loading && itemdata && (
      <div>{generateFeasibilityData()}</div>
    )}
  </div>
  );
  
};

export default FeasibilityInnerInsertData;
