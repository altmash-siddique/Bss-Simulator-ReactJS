import React, { useState, useEffect } from "react";
import { DownCircleOutlined } from "@ant-design/icons";
import ReactJson from "react-json-view";
import { v4 as uuidv4 } from "uuid";

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
  console.log("displayedCards", displayedCards);
  console.log("subsectionTitles", subsectionTitles);

  useEffect(() => {
    const requestId = generateRandomRequestId();
  }, []);

  const generateRandomRequestId = () => {
    return uuidv4().replace(/-/g, "").substr(0, 32); // Generate a UUID and remove hyphens, then limit to 32 characters
  };

  let title = "";

  // console.log("displayed cards", displayedCards)
  // console.log("input values", inputValues)
  const [jsonData, setJsonData] = useState(null);

  const commonPlace = [
    {
      "@type": "GeaographicAddress",
      role: "InstallationAddress",
      id:
        localInitialValues?.["connect_postcode"] +
          "-" +
          localInitialValues?.["connect_houseNumber"] ||
        localInitialValues?.["install_id"] ||
        inputValues.install_id ||
        "",
      street:
        "Jan van Galenstraat" ||
        localInitialValues?.["install_street"] ||
        inputValues.install_street ||
        "",
      houseNumber:
        localInitialValues?.["connect_houseNumber"] ||
        localInitialValues?.["install_houseNumber"] ||
        inputValues.install_houseNumber ||
        "",
      houseNumberExtension:
        localInitialValues?.["install_houseNumberExtension"] ||
        inputValues.install_houseNumberExtension ||
        "",
      postcode:
        localInitialValues?.["connect_postcode"] ||
        localInitialValues?.["install_postcode"] ||
        inputValues.install_postcode ||
        "",
      city:
        "Haarlem" ||
        localInitialValues?.["install_city"] ||
        inputValues.install_city ||
        "",
      country:
        "Netherlands" ||
        localInitialValues?.["install_country"] ||
        inputValues.install_country ||
        "",
    },
    {
      "@type":
        localInitialValues?.["connect_@type"] || inputValues.connect_type || "",
      role: "ConnectionPoint",
      id:
        localInitialValues?.["connect_postcode"] +
          "-" +
          localInitialValues?.["connect_houseNumber"] +
          ":" +
          localInitialValues?.["connect_connectionPointIdentifier"] ||
        localInitialValues?.["connect_id"] ||
        inputValues.connect_id ||
        "",
      street:
        "Jan van Galenstraat" ||
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
        "Haarlem" ||
        localInitialValues?.["connect_city"] ||
        inputValues.connect_city ||
        "",
      country:
        "Netherlands" ||
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
  ];

  const commonRelatedParty = [
    {
      "@type":
        "ContactParty" ||
        localInitialValues?.["site_type"] ||
        inputValues.site_type ||
        "",
      role:
        "SiteContact" ||
        localInitialValues?.["site_role"] ||
        inputValues.site_role ||
        "",
      id:
        "C_1625644024615" ||
        localInitialValues?.["site_id"] ||
        inputValues.site_id ||
        "",
      firstName:
        "Harald" ||
        localInitialValues?.["site_firstName"] ||
        inputValues.site_firstName ||
        "",
      lastName:
        "Van Kampen" ||
        localInitialValues?.["site_lastName"] ||
        inputValues.site_lastName ||
        "",
      phoneNumber:
        "0611459399" ||
        localInitialValues?.["site_phNum"] ||
        inputValues.site_phNum ||
        "",
      alternatePhoneNumber:
        "0201201201" ||
        localInitialValues?.["site_altPhNum1"] ||
        inputValues.site_altPhNum1 ||
        "",
      mobileNumber:
        "0201201202" ||
        localInitialValues?.["site_altPhNum2"] ||
        inputValues.site_altPhNum2 ||
        "",
      email:
        "harald.van.kampen@tele2.com" ||
        localInitialValues?.["site_email"] ||
        inputValues.site_email ||
        "",
    },
  ];

  const generateServiceOrderData = () => {
    let mainLineId = ""; // Variable to store the main ID for specific titles
    let multiRoomLocationId = ""; // Variable to store the ID for CFS_MULTI_ROOM_WIFI_CUSTOMER
    let cgwId = "";
    const requestId = generateRandomRequestId(); // Generate a random requestId
    const orderIds = displayedCards.map((_, index) => `${index + 1}`);
    const mainSectionIds = {};

    const orderItems = displayedCards.map((cardData, index) => {
      const id = orderIds[index]; // Get the current order ID
      mainSectionIds[cardData.title] = id;
      title = cardData.title;
      const fields = cardData.fields;
      if (
        cardData.title === "CFS_IP_ACCESS_WBA_FTTH" ||
        cardData.title === "CFS_IP_ACCESS_WBA_VDSL" ||
        cardData.title === "CFS_IP_ACCESS_GOP_FTTH"
      ) {
        mainLineId = id;
        console.log("mainLineId", mainLineId);
      }

      if (cardData.title === "CFS_MULTI_ROOM_WIFI_CUSTOMER") {
        multiRoomLocationId = id;
        console.log("multiRoomLocationId", multiRoomLocationId);
      }

      if (cardData.title === "CFS_VOICE_GROUP") {
        return {
          id,
          action: "Add",
          service: {
            serviceCharacteristic: [
              {
                name: "name",
                valueType: "String",
                value: "123 B.V. IT Support",
              },
              {
                name: "serviceProviderId",
                valueType: "CodeTable",
                value: "HV01",
              },
            ],
            serviceSpecification: {
              name: cardData.title,
            },
          },
        };
      }
      if (cardData.title === "CFS_MULTI_ROOM_WIFI_LOCATION") {
        let orderItemRelationship = [];
        console.log("first cgwid", cgwId);
        console.log("first multiRoomLocationId", multiRoomLocationId);
        if (cgwId) {
          orderItemRelationship.push({
            type: "ReliesOn",
            id: cgwId,
          });
        }

        if (multiRoomLocationId) {
          orderItemRelationship.push({
            type: "ReliesOn",
            id: multiRoomLocationId,
          });
        }
        return {
          id,
          action: "Add",
          service: {
            serviceCharacteristic: [
              {
                name: "installationType",
                valueType: "String",
                value: "Engineer",
              },
              {
                name: "numberOfPods",
                valueType: "Number",
                value: "5",
              },
            ],
            place: commonPlace,
            serviceSpecification: {
              name: cardData.title,
            },
          },
          orderItemRelationship: orderItemRelationship,
        };
      }
      if (cardData.title === "CFS_MULTI_ROOM_WIFI_CUSTOMER") {
        return {
          id,
          action: "Add",
          service: {
            serviceCharacteristic: [
              {
                name: "name",
                valueType: "String",
                value: "UserName",
              },
            ],
            serviceSpecification: {
              name: cardData.title,
            },
          },
        };
      }
      if (cardData.title === "CFS_IP_ACCESS_MOBILE_BACKUP") {
        return {
          id,
          action: "Add",
          service: {
            serviceCharacteristic: [],
            relatedParty: commonRelatedParty,
            place: commonPlace,
            serviceSpecification: {
              name: cardData.title,
            },
          },
          orderItemRelationship: [
            {
              type: "ReliesOn",
              id: mainLineId,
            },
          ],
        };
      }
      if (cardData.title === "CFS_PIN") {
        return {
          id,
          action: "Add",
          service: {
            serviceCharacteristic: [],
            serviceSpecification: {
              name: cardData.title,
            },
          },
          orderItemRelationship: [
            {
              type: "ReliesOn",
              id: mainLineId,
            },
          ],
        };
      }
      const serviceCharacteristic = fields.reduce((acc, field) => {
        const labelName = field.label;
        const fullName = `${title}.${field.name}`;

        let value = inputValues[fullName] || "";

        // Set default values based on field names
        switch (field.name) {
          case "sla":
            value = value || "Standard";
            break;
          case "installationType":
            value = value || "Engineer";
            break;
          case "minimumBandwidthDown":
          case "minimumBandwidthUp":
          case "promisedBandwidthDown":
          case "promisedBandwidthUp":
          case "serviceBandwidthDown":
          case "serviceBandwidthUp":
            value = value || "1000000";
            break;
          // case "firstPossibleDate":
          //   // Set default value to current date in dd-mm-yy format
          //   const currentDate = new Date();
          //   const day = currentDate.getDate();
          //   const month = currentDate.getMonth() + 1;
          //   const year = currentDate.getFullYear().toString().slice(-2);
          //   value = value || `${day}-${month}-${year}`;
          //   break;
          default:
            break;
        }

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

        if (value !== "") {
          acc.push({
            name: labelName,
            valueType: valueType,
            value: value,
          });
        }
        return acc;
      }, []);

      return {
        id,
        action: "Add",
        service: {
          serviceCharacteristic,
          relatedParty: commonRelatedParty,
          place: commonPlace,
          serviceSpecification: {
            name: title,
          },
        },
      };
    });

    const selectedSubsections = selectedAccordionIndexes.map(
      (index) => subsectionTitles[index]
    );

    // console.log("selectedAccordionIndexes", selectedAccordionIndexes)

    let orderKey = "orderItem";
    let orderItemRelationshipKey = "orderItemRelationship";

    if (selectedVersion === "v4") {
      orderKey = "serviceOrderItem";
      orderItemRelationshipKey = "serviceOrderItemRelationship";
    }

    const subServiceOrderItems = selectedSubsections.map((subtitle, index) => {
      const subtitleFields = displayedCards
        .flatMap((card) =>
          card.fields.filter((field) => field.name.includes("."))
        )
        .filter((field) => field.name.split(".")[0] === subtitle);
      // console.log("subtitlefields", subtitleFields);
      // console.log("subtitle", subtitle)
      // console.log("selectedSubsections", selectedSubsections)

      const subServiceCharacteristic = subtitleFields.map((field) => {
        const fullName = `${field.name}`;
        const value = inputValues[fullName] || "";
        let valueType = "String";
        const labelParts = field.label.split(".");
        const displayName = labelParts.length > 1 ? labelParts[1] : field.label;

        return {
          name: displayName,
          valueType: valueType,
          value: value,
        };
      });

      selectedSubsections.forEach((subtitle) => {
        if (subtitle === "CFS_IP_ACCESS_CGW") {
          // Store the ID for CFS_IP_ACCESS_CGW
          cgwId = `${index + orderItems.length + 1}`;
          console.log("cgwid", cgwId);
        }
      });

      return {
        id: `${index + orderItems.length + 1}`,
        action: "Add",
        service: {
          serviceCharacteristic: subServiceCharacteristic,
          serviceSpecification: {
            name: subtitle,
          },
        },
        [orderItemRelationshipKey]: [
          {
            type: "ReliesOn",
            id: mainLineId,
          },
        ],
      };
    });

    const updatedServiceOrderData = {
      requestId: requestId, // Set the randomly generated requestId
      externalId: requestId, // Set the same requestId as externalId
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
