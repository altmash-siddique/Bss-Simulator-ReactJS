import React, { useState, useEffect } from "react";
import { DownCircleOutlined } from "@ant-design/icons";
import ReactJson from "react-json-view";

const ServiceOrderJson = ({
  inputValues,
  subSectionLabels,
  serviceSpecName,
  displayedCards,
  totalDisplayedCount,
  subsectionTitles,
  selectedAccordionIndexes,
  handleJsonData,
  selectedVersion,
  localInitialValues,
}) => {
  let title = "";

  const [jsonData, setJsonData] = useState(null);

  const generateServiceOrderData = () => {
    const orderIds = displayedCards.map((_, index) => `${index + 1}`);
    const mainSectionIds = {};

    const orderItems = displayedCards.map((cardData, index) => {
      const id = orderIds[index]; // Get the current order ID
      mainSectionIds[cardData.title] = id;
      title = cardData.title;
      const fields = cardData.fields;
      const serviceCharacteristic = fields.reduce((acc, field) => {
        const labelName = field.label;
        const fullName = `${title}.${field.name}`;

        if (inputValues[fullName] !== "") {
          let valueType = "String";

          if (
            field.name === "deliveredNLType" ||
            field.name === "minimumBandwidthDown" ||
            field.name === "minimumBandwidthUp" ||
            field.name === "promisedBandwidthDown" ||
            field.name === "promisedBandwidthUp" ||
            field.name === "serviceBandwidthDown" ||
            field.name === "serviceBandwidthUp"
          ) {
            valueType = "Number";
          } else if (field.name === "firstPossibleDate") {
            valueType = "Date";
          }

          const value = inputValues[fullName] || "";
          if (value !== "") {
            acc.push({
              name: labelName,
              valueType: valueType,
              value: value,
            });
          }
        }
        return acc;
      }, []);

      return {
        id,
        action: "Add",
        service: {
          serviceCharacteristic,
          relatedParty: [
            {
              "@type":
                localInitialValues?.["site_type"] ||
                inputValues.site_type ||
                "",
              role:
                localInitialValues?.["site_role"] ||
                inputValues.site_role ||
                "",
              id: localInitialValues?.["site_id"] || inputValues.site_id || "",
              firstName:
                localInitialValues?.["site_firstName"] ||
                inputValues.site_firstName ||
                "",
              lastName:
                localInitialValues?.["site_lastName"] ||
                inputValues.site_lastName ||
                "",
              phoneNumber:
                localInitialValues?.["site_phNum"] ||
                inputValues.site_phNum ||
                "",
              alternatePhoneNumber:
                localInitialValues?.["site_altPhNum1"] ||
                inputValues.site_altPhNum1 ||
                "",
              mobileNumber:
                localInitialValues?.["site_altPhNum2"] ||
                inputValues.site_altPhNum2 ||
                "",
              email:
                localInitialValues?.["site_email"] ||
                inputValues.site_email ||
                "",
            },
          ],
          place: [
            {
              "@type":
                localInitialValues?.["install_type"] ||
                inputValues.install_type ||
                "",
              role:
                localInitialValues?.["install_role"] ||
                inputValues.install_role ||
                "",
              id:
                localInitialValues?.["install_id"] ||
                inputValues.install_id ||
                "",
              street:
                localInitialValues?.["install_street"] ||
                inputValues.install_street ||
                "",
              houseNumber:
                localInitialValues?.["install_houseNumber"] ||
                inputValues.install_houseNumber ||
                "",
              houseNumberExtension:
                localInitialValues?.["install_houseNumberExtension"] ||
                inputValues.install_houseNumberExtension ||
                "",
              postcode:
                localInitialValues?.["install_postcode"] ||
                inputValues.install_postcode ||
                "",
              city:
                localInitialValues?.["install_city"] ||
                inputValues.install_city ||
                "",
              country:
                localInitialValues?.["install_country"] ||
                inputValues.install_country ||
                "",
            },
            {
              "@type":
                localInitialValues?.["connect_@type"] ||
                inputValues.connect_type ||
                "",
              role:
                localInitialValues?.["connect_role"] ||
                inputValues.connect_role ||
                "",
              id:
                localInitialValues?.["connect_id"] ||
                inputValues.connect_id ||
                "",
              street:
                localInitialValues?.["connect_street"] ||
                inputValues.connect_street ||
                "",
              houseNumber:
                localInitialValues?.["connect_houseNumber"] ||
                inputValues.connect_houseNumber ||
                "",
              houseNumberExtension:
                localInitialValues?.["connect_houseNumberExtension"] ||
                inputValues.connect_houseNumberExtension ||
                "",
              postcode:
                localInitialValues?.["connect_postcode"] ||
                inputValues.connect_postcode ||
                "",
              city:
                localInitialValues?.["connect_city"] ||
                inputValues.connect_city ||
                "",
              country:
                localInitialValues?.["connect_country"] ||
                inputValues.connect_country ||
                "",
              connectionPointIdentifier:
                localInitialValues?.["connect_connectionPointIdentifier"] ||
                inputValues.connect_connectionPointIdentifier ||
                "",
              nlType:
                localInitialValues?.["connect_nlType"] ||
                inputValues.connect_nlType ||
                "",
            },
          ],
          serviceSpecification: {
            name: title,
          },
        },
      };
    });

    const selectedSubsections = selectedAccordionIndexes.map(
      (index) => subsectionTitles[index]
    );

    let orderKey = "orderItem";
    let orderItemRelationshipKey = "orderItemRelationship";

    if (selectedVersion === "v4") {
      orderKey = "serviceOrderItem";
      orderItemRelationshipKey = "serviceOrderItemRelationship";
    }

    const subServiceOrderItems = selectedSubsections.map((subtitle, index) => {
      return {
        id: `${index + orderItems.length + 1}`,
        action: "Add",
        service: {
          serviceCharacteristic: [],
          serviceSpecification: {
            name: subtitle,
          },
        },
        [orderItemRelationshipKey]: [
          {
            type: "ReliesOn",
            id: mainSectionIds[title],
          },
        ],
      };
    });

    const updatedServiceOrderData = {
      requestId: "1702883952244",
      externalId: "1702883952244",
      description: "Service order for IP Access",
      requestedCompletionDate: "2024-12-17T18:30:00.000Z",
      relatedParty: [
        {
          id: "C_1702883888043",
          role: "Customer",
          name: "Wesley B V",
        },
        {
          id: "BSS-Simulator",
          role: "Requester",
          name: "BSS Simulator Integration Environment",
        },
      ],
      [orderKey]: [...orderItems, ...subServiceOrderItems],
    };

    return updatedServiceOrderData;
  };
  const [showJson, setShowJson] = useState(true);

  const handleShowJson = () => {
    setShowJson(!showJson);
  };

  useEffect(() => {
    const updatedJsonData = generateServiceOrderData();
    setJsonData(updatedJsonData);
  }, [inputValues]);

  useEffect(() => {
    if (jsonData) {
      handleJsonData(jsonData);
    }
  }, [jsonData, handleJsonData]);

  return (
    <div>
      <div className="card-json">
        <h2>
          Generated Service Order JSON{" "}
          <DownCircleOutlined onClick={handleShowJson} />
        </h2>
        {showJson && (
          <ReactJson
            src={JSON.parse(
              JSON.stringify(generateServiceOrderData(), null, 2)
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
  );
};

export default ServiceOrderJson;
