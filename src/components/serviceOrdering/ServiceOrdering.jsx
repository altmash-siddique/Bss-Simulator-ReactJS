import React, { useState } from "react";
import "./ServiceOrdering.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "./Card";
import axios from "axios";
import { Button } from "antd";
import ServiceOrderJson from "./ServiceOrderJson";

const ServiceOrdering = ({ data }) => {
  const [activeSections, setActiveSections] = useState([]);
  const [labelNamesBySection, setLabelNamesBySection] = useState([]);
  const [subSectionLabels, setSubSectionLabels] = useState([]);

  const [showJson, setShowJson] = useState(false);

  const handlePrepareClick = () => {
    setShowJson(!showJson);
  };

  const [inputValues, setInputValues] = useState({});

  const handleInputChange = (fieldName, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handleAccordionChange = (index, isSubSection = false) => {
    if (isSubSection) {
      const subSection = data.reduce(
        (acc, section) => acc.concat(section.subSections || []),
        []
      )[index];

      if (subSection && subSection.title) {
        axios
          .get(
            `https://haxuqnfbm6.execute-api.eu-central-1.amazonaws.com/development?Parameter=${subSection.title}`
          )
          .then((response) => {
            const fetchedLabelNames =
              response.data[0]?.versions[0]?.characteristics
                .filter((characteristic) =>
                  characteristic.versions.some(
                    (version) =>
                      version.properties &&
                      version.properties.some(
                        (prop) => prop.value === "bssOrderable"
                      )
                  )
                )
                .map((characteristic) => characteristic.id);

            setSubSectionLabels((prevLabels) => [
              ...prevLabels,
              fetchedLabelNames,
            ]);
          })
          .catch((error) => {
            console.error("Error fetching subSection data:", error);
          });
      }
    } else {
      if (activeSections.includes(index)) {
        setActiveSections(
          activeSections.filter((activeIndex) => activeIndex !== index)
        );
      } else {
        setActiveSections([...activeSections, index]);
        const section = data.find((_, idx) => idx === index);
        if (section && section.title) {
          axios
            .get(
              `https://haxuqnfbm6.execute-api.eu-central-1.amazonaws.com/development?Parameter=${section.title}`
            )
            .then((response) => {
              const fetchedLabelNames =
                response.data[0]?.versions[0]?.characteristics
                  .filter((characteristic) =>
                    characteristic.versions.some(
                      (version) =>
                        version.properties &&
                        version.properties.some(
                          (prop) => prop.value === "bssOrderable"
                        )
                    )
                  )
                  .map((characteristic) => characteristic.id);

              setLabelNamesBySection((prevLabels) => [
                ...prevLabels,
                fetchedLabelNames,
              ]);

              if (section.subSections) {
                section.subSections.forEach((subSection) => {
                  axios
                    .get(
                      `https://haxuqnfbm6.execute-api.eu-central-1.amazonaws.com/development?Parameter=${subSection.title}`
                    )
                    .then((subResponse) => {
                      const fetchedSubLabelNames =
                        subResponse.data[0]?.versions[0]?.characteristics
                          .filter((characteristic) =>
                            characteristic.versions.some(
                              (version) =>
                                version.properties &&
                                version.properties.some(
                                  (prop) => prop.value === "bssOrderable"
                                )
                            )
                          )
                          .map((characteristic) => characteristic.id);

                      setSubSectionLabels((prevLabels) => [
                        ...prevLabels,
                        fetchedSubLabelNames,
                      ]);
                    })
                    .catch((error) => {
                      console.error("Error fetching subSection data:", error);
                    });
                });
              }
            })
            .catch((error) => {
              console.error("Error fetching section data:", error);
            });
        }
      }
    }
  };

  console.log(data)
  
  return (
    <>
      <div className="container">
        <div className="left-section">
          {data.map((section, index) => (
            <Accordion
              key={index}
              expanded={activeSections.includes(index)}
              onChange={() => handleAccordionChange(index)}
              style={{
                backgroundColor: "#333",
                color: "white",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography>{section.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{section.content}</Typography>
                {section.subSections && (
                  <div>
                    {section.subSections.map((subSection, subIndex) => (
                      <Accordion
                        key={subIndex}
                        onChange={() => handleAccordionChange(subIndex, true)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${index}-${subIndex}-content`}
                          id={`panel${index}-${subIndex}-header`}
                        >
                          <Typography>{subSection.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{subSection.content}</Typography>
                          {subSection.subSubSections && (
                            <div>
                              {subSection.subSubSections.map(
                                (subSubSection, subSubIndex) => (
                                  <Accordion key={subSubIndex}>
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls={`panel${index}-${subIndex}-${subSubIndex}-content`}
                                      id={`panel${index}-${subIndex}-${subSubIndex}-header`}
                                    >
                                      <Typography>
                                        {subSubSection.title}
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Typography>
                                        {subSubSection.content}
                                      </Typography>
                                    </AccordionDetails>
                                  </Accordion>
                                )
                              )}
                            </div>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>

        <div className="right-section">
          <div className="customer-id">
            <label htmlFor="customerId">Customer ID: </label>
            <input type="text" id="customerId" name="customerId" />
          </div>

          <div className="main-card">
            <h2>Party Contact</h2>
            <Card
              title="Site Contact"
              fields={[
                { label: "Type", name: "site_type", type: "text" },
                { label: "First Name", name: "site_firstname", type: "text" },
                { label: "Last Name", name: "site_lastname", type: "text" },
                {
                  label: "Alternate Phone Number",
                  name: "site_altPhNum1",
                  type: "number",
                },
                { label: "Phone Number", name: "site_phNum", type: "number" },
                {
                  label: "Alternate Phone Number",
                  name: "site_altPhNum2",
                  type: "number",
                },
                { label: "Email", name: "site_email", type: "number" },
              ]}
              onInputChange={handleInputChange}
            />
            <Card
              title="Installation Address"
              fields={[
                { label: "Type", name: "install_type", type: "text" },
                { label: "street", name: "install_street", type: "text" },
                {
                  label: "houseNumber",
                  name: "install_houseNumber",
                  type: "number",
                },
                {
                  label: "houseNumberExtension",
                  name: "install_houseNumberExtension",
                  type: "number",
                },
                { label: "postcode", name: "install_postcode", type: "number" },
                { label: "city", name: "install_city", type: "text" },
                { label: "country", name: "install_country", type: "text" },
              ]}
              onInputChange={handleInputChange}
            />
            <Card
              title="Connection Point Address"
              fields={[
                { label: "Type", name: "connect_type", type: "text" },
                { label: "street", name: "connect_street", type: "text" },
                {
                  label: "houseNumber",
                  name: "connect_houseNumber",
                  type: "number",
                },
                {
                  label: "houseNumberExtension",
                  name: "connect_houseNumberExtension",
                  type: "number",
                },
                { label: "postcode", name: "connect_postcode", type: "number" },
                { label: "city", name: "connect_city", type: "text" },
                { label: "country", name: "connect_country", type: "text" },
                {
                  label: "connectionPointIdentifier",
                  name: "connect_connectionPointIdentifier",
                  type: "text",
                },
                { label: "nlType", name: "connect_nlType", type: "text" },
              ]}
              onInputChange={handleInputChange}
            />

            {data.map((section, index) =>
              section.displayAdditionalCard &&
              activeSections.includes(index) ? (
                <Card
                  key={`additionalCard-${index}`}
                  title={section.title}
                  fields={
                    labelNamesBySection[index]?.map((labelName) => ({
                      label: labelName,
                      name: labelName,
                      type: "text",
                    })) || []
                  }
                  onInputChange={handleInputChange}
                >
                  {section.subSections &&
                    section.subSections.map((subSection, subIndex) => (
                      <Card
                        key={`nestedCard-${subIndex}`}
                        title={subSection.title}
                        fields={
                          subSectionLabels[subIndex]?.map(
                            (labelName, labelIndex) => ({
                              label: labelName,
                              name: `field${labelIndex + 1}`,
                              type: "text",
                            })
                          ) || []
                        }
                        onInputChange={handleInputChange}
                      />
                    ))}
                </Card>
              ) : null
            )}

            <Button
              shape="round"
              className="prepare-button"
              onClick={handlePrepareClick}
            >
              Prepare Service Order
            </Button>
          </div>
        </div>
      </div>
      {showJson && (
        <ServiceOrderJson
          inputValues={inputValues} // Make sure inputValues are properly passed
          labelNamesBySection={labelNamesBySection}
          subSectionLabels={subSectionLabels}
          serviceSpecName={data.find((_, idx) => activeSections.includes(idx))?.title}
        />
      )}
    </>
  );
};

export default ServiceOrdering;
