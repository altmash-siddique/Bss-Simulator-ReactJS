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
}) => {
  console.log("Display cards", displayedCards); // View the filtered card data
  console.log("Count", totalDisplayedCount);
  console.log("Sub sections: ", subsectionTitles);
  console.log("Selected INdex", selectedAccordionIndexes);
  console.log("Selected Version: ", selectedVersion);

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
              "@type": inputValues.site_type || "",
              role: "SiteContact",
              id: "C_1702883888043",
              firstName: inputValues.site_firstName || "",
              lastName: inputValues.site_lastName || "",
              phoneNumber: inputValues.site_phNum || "",
              alternatePhoneNumber: inputValues.site_altPhNum1 || "",
              mobileNumber: inputValues.site_altPhNum2 || "",
              email: inputValues.site_email || "",
            },
          ],
          place: [
            {
              "@type": inputValues.install_type || "",
              role: "InstallationAddress",
              id: "",
              street: inputValues.install_street || "",
              houseNumber: inputValues.install_houseNumber || "",
              houseNumberExtension:
                inputValues.install_houseNumberExtension || "",
              postcode: inputValues.install_postcode || "",
              city: inputValues.install_city || "",
              country: inputValues.install_country || "",
            },
            {
              "@type": inputValues.connect_type || "",
              role: "ConnectionPoint",
              id: "",
              street: inputValues.connect_street || "",
              houseNumber: inputValues.connect_houseNumber || "",
              houseNumberExtension:
                inputValues.connect_houseNumberExtension || "",
              postcode: inputValues.connect_postcode || "",
              city: inputValues.connect_city || "",
              country: inputValues.connect_country || "",
              connectionPointIdentifier:
                inputValues.connect_connectionPointIdentifier || "",
              nlType: inputValues.connect_nlType || "",
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

  console.log(inputValues);
  console.log(serviceSpecName);

  const [showJson, setShowJson] = useState(true);

  const handleShowJson = () => {
    setShowJson(!showJson);
  };

  useEffect(() => {
    const updatedJsonData = generateServiceOrderData();
    setJsonData(updatedJsonData);
    console.log("Json Data: ", jsonData);
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
