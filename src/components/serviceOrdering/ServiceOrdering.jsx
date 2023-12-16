import React, { useState, useEffect } from "react";
import "./Accordion.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "./Card";
import axios from "axios";

const ServiceOrdering = ({ data }) => {
  const [expandedIndex, setExpandedIndex] = useState(-1); // Initialize with -1 or any value that won't be an index

  const [activeSections, setActiveSections] = useState([]);
  const [labelNames, setLabelNames] = useState([]);

  const handleAccordionChange = (index) => {
    if (activeSections.includes(index)) {
      setActiveSections(
        activeSections.filter((activeIndex) => activeIndex !== index)
      );
    } else {
      setActiveSections([...activeSections, index]);
    }
  };

  const [labelNamesBySection, setLabelNamesBySection] = useState([]);

  useEffect(() => {
    // Fetch data from the API for the active sections
    if (activeSections.length > 0) {
      activeSections.forEach((index) => {
        const sectionTitle = data[index].title;
        axios
          .get(
            `https://haxuqnfbm6.execute-api.eu-central-1.amazonaws.com/development?Parameter=${sectionTitle}`
          )
          .then((response) => {
            const fetchedLabelNames =
              response.data[0].versions[0].characteristics
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

            // Update the label names for each section separately
            setLabelNamesBySection((prevLabelNames) => {
              const updatedLabelNames = [...prevLabelNames];
              updatedLabelNames[index] = fetchedLabelNames;
              return updatedLabelNames;
            });
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      });
    }
  }, [activeSections, data]);

  const selectedSection = data.find(
    (section, index) => expandedIndex === index
  );

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
                      <Accordion key={subIndex}>
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

          <div className="card">
            <h2>Party Contact</h2>
            <Card
              title="Site Contact"
              fields={[
                { label: "Type", name: "type", type: "text" },
                { label: "First Name", name: "firstname", type: "text" },
                { label: "Last Name", name: "lastname", type: "text" },
                {
                  label: "Alternate Phone Number",
                  name: "altPhNum1",
                  type: "text",
                },
                { label: "Phone Number", name: "phNum", type: "text" },
                {
                  label: "Alternate Phone Number",
                  name: "altPhNum2",
                  type: "text",
                },
                { label: "Email", name: "email", type: "text" },
              ]}
            />
            <Card
              title="Installation Address"
              fields={[
                { label: "Type", name: "type", type: "text" },
                { label: "street", name: "street", type: "text" },
                { label: "houseNumber", name: "houseNumber", type: "text" },
                {
                  label: "houseNumberExtension",
                  name: "houseNumberExtension",
                  type: "text",
                },
                { label: "postcode", name: "postcode", type: "text" },
                { label: "city", name: "city", type: "text" },
                { label: "country", name: "country", type: "text" },
              ]}
            />
            <Card
              title="Connection Point Address"
              fields={[
                { label: "Type", name: "type", type: "text" },
                { label: "street", name: "street", type: "text" },
                { label: "houseNumber", name: "houseNumber", type: "text" },
                {
                  label: "houseNumberExtension",
                  name: "houseNumberExtension",
                  type: "text",
                },
                { label: "postcode", name: "postcode", type: "text" },
                { label: "city", name: "city", type: "text" },
                { label: "country", name: "country", type: "text" },
                {
                  label: "connectionPointIdentifier",
                  name: "connectionPointIdentifier",
                  type: "text",
                },
                { label: "nlType", name: "nlType", type: "text" },
              ]}
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
                />
              ) : null
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceOrdering;
