import React , { useState, useEffect } from 'react';
import { Card, Spin } from 'antd';
import { useLocation } from 'react-router-dom';
import './FeasibilityInnerInsertData.css'

const FeasibilityInnerInsertData = () => {
    const [feasibilitylineDataShow, setFeasibilityLineDataShow] = useState(true);
    const [result, setAppendFeasibilityData] = useState('');
    const [loading, setLoading] = useState(true);
 
  const location = useLocation();
  const { feasibilityInnerData, name, itemdata } = location.state || {};
  const feasibilitylineData = feasibilityInnerData;
  

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

    return (
        <div>
          {feasibilitylineDataShow && (
            <div className="background-inner-wrapper">
              <Card
                title={place['@type']}
                className="feasibility-inner-card"
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
            feasibilityDataArray.push(renderFeasibilityData(place).toString());
        } else if (
          (place['@type'] === 'ExistingFiberLine' ||
            place['@type'] === 'PlannedFiberLine') &&
          name !== 'CFS_IP_ACCESS_WBA_VDSL'
        ) {
            feasibilityDataArray.push(renderFeasibilityData(place).toString());
        } else if (
          place['@type'] === 'ExistingCopperLine' ||
          place['@type'] === 'PlannedCopperLine'
        ) {
            feasibilityDataArray.push(renderFeasibilityData(place).toString());
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
            feasibilityDataArray.push(renderFeasibilityData(place).toString());
        } else if (
          place['@type'] === 'ExistingCopperLine' ||
          place['@type'] === 'PlannedCopperLine'
        ) {
            feasibilityDataArray.push(renderFeasibilityData(place).toString());
        }
      }
    );
    }
  }

    // Join the array into a string before returning
    return feasibilityDataArray.join('');
}

useEffect(() => {
    // Simulate an API call or any asynchronous operation
    setTimeout(() => {
      setLoading(false);
      setAppendFeasibilityData(generateFeasibilityData());
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
