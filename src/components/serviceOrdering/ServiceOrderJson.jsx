import React, { useState } from "react";
import { DownCircleOutlined } from "@ant-design/icons";
import ReactJson from "react-json-view";

const ServiceOrderJson = ({
  inputValues,
  labelNamesBySection,
  subSectionLabels,
  serviceSpecName,
  displayedCards,
  totalDisplayedCount,
}) => {
  console.log("Display cards", displayedCards); // View the filtered card data
  console.log("Count", totalDisplayedCount);

  const generateServiceOrderData = () => {
    const orderItems = displayedCards.map((cardData, index) => {
      const serviceCharacteristic = labelNamesBySection[0]?.reduce(
        (acc, labelName, index) => {
          if (inputValues[labelName] !== "") {
            let valueType = "String";
            if (
              labelName === "deliveredNLType" ||
              labelName === "minimumBandwidthDown" ||
              labelName === "minimumBandwidthUp" ||
              labelName === "promisedBandwidthDown" ||
              labelName === "promisedBandwidthUp" ||
              labelName === "serviceBandwidthDown" ||
              labelName === "serviceBandwidthUp"
            ) {
              valueType = "Number";
            } else if (labelName === "firstPossibleDate") {
              valueType = "Date";
            }

            const value = inputValues[labelName] || "";
            if (value !== "") {
              acc.push({
                name: labelName,
                valueType: valueType,
                value: value,
              });
            }
          }
          return acc;
        },
        []
      );

      return {
        id: `${index + 1}`,
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
            name: serviceSpecName,
          },
        },
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
      orderItem: orderItems,
    };

    return updatedServiceOrderData;
  };

  console.log(inputValues);
  console.log(labelNamesBySection[0][0]);
  console.log(serviceSpecName);

  const [showJson, setShowJson] = useState(true);

  const handleShowJson = () => {
    setShowJson(!showJson);
  };

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
