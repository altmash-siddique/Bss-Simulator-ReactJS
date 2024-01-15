import React , { useState, useEffect } from 'react';
import { Card, Spin, Row } from 'antd';
import { useLocation } from 'react-router-dom';
import './FeasibilityInnerInsertData.css'

const FeasibilityInnerInsertData = () => {
    const [feasibilitylineDataShow, setFeasibilityLineDataShow] = useState(true);
    const [result, setAppendFeasibilityData] = useState('');
    const [loading, setLoading] = useState(true);
 
  const location = useLocation();
  const { feasibilityInnerData, name, itemdata } = location.state || {};
  const feasibilitylineData = feasibilityInnerData;

  const [orderType, setOrderType] = useState({ type: '' });
  const [accessServiceId, setAccessServiceId] = useState('');

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
            </Row>
              
            </div>
          )}
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
