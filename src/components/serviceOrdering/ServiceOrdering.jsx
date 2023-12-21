import React, { useState } from "react";
import "./ServiceOrdering.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "./Card";
import { Button } from "antd";
import ServiceOrderJson from "./ServiceOrderJson";
import { ECM_API_LAMBDA } from "../../constants/apiEndpoints";
import ApiService from "../../services/apiService";

const ServiceOrdering = ({ data, selectedEnvironment }) => {
  const [activeSections, setActiveSections] = useState([]);
  const [labelNamesBySection, setLabelNamesBySection] = useState([]);
  const [subSectionLabels, setSubSectionLabels] = useState([]);
  const [showJson, setShowJson] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [selectedAccordionIndexes, setSelectedAccordionIndexes] = useState([]);

  const getDisplayedCardsData = () => {
    const displayedCards = data.reduce((acc, section, index) => {
      if (section.displayAdditionalCard && activeSections.includes(index)) {
        const additionalCardData = {
          title: section.title,
          fields: labelNamesBySection[index]?.map((labelName) => ({
            label: labelName,
            name: labelName,
            type: "text",
          })) || [],
        };
  
        const nestedCardCount = selectedAccordionIndexes.reduce(
          (nestedAcc, selectedIndex) => {
            if (
              section &&
              Array.isArray(section.subSections) &&
              section.subSections.length > selectedIndex
            ) {
              const subSection = section.subSections[selectedIndex];
              if (subSection) {
                nestedAcc += subSectionLabels[selectedIndex]?.length || 0;
              }
            }
            return nestedAcc;
          },
          0
        );
  
        acc.push({ ...additionalCardData, nestedCardCount });
      }
      return acc;
    }, []);
  
    return { displayedCards, totalDisplayedCount: displayedCards.length };
  };

  const { displayedCards, totalDisplayedCount } = getDisplayedCardsData();

  const apiService = new ApiService(selectedEnvironment);

  const handlePrepareClick = () => {
    setShowJson(!showJson);
  };

  const handleInputChange = (fieldName, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const fetchData = async (title, isSubSection = false) => {
    try {
      const useeocApi = false;
      const endpoint = ECM_API_LAMBDA.PATH;
      console.log(endpoint);
      console.log(title);
      const params = { Parameter: title };
      const headers = {
        "Content-Type": "application/json",
        Authorization: "",
      };
      const response = await apiService.get(
        endpoint,
        headers,
        params,
        useeocApi
      );
      console.log(response[0]);

      const fetchedLabelNames = response[0]?.versions[0]?.characteristics
        .filter((characteristic) =>
          characteristic.versions.some(
            (version) =>
              version.properties &&
              version.properties.some((prop) => prop.value === "bssOrderable")
          )
        )
        .map((characteristic) => characteristic.id);

      if (isSubSection) {
        setSubSectionLabels((prevLabels) => [...prevLabels, fetchedLabelNames]);
      } else {
        setLabelNamesBySection((prevLabels) => [
          ...prevLabels,
          fetchedLabelNames,
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAccordionChange = async (index, isSubSection = false) => {
    if (isSubSection) {
      const subSection = (
        data.reduce(
          (acc, section) => acc.concat(section.subSections || []),
          []
        )[index] || {}
      ).title;

      if (subSection) {
        await fetchData(subSection, true);
      }
    } else {
      // Logic for handling section accordion clicks
      if (activeSections.includes(index)) {
        setActiveSections(
          activeSections.filter((activeIndex) => activeIndex !== index)
        );
      } else {
        setActiveSections([...activeSections, index]);
        
        // Fetch section labels only when its accordion is expanded
        const section = data.find((_, idx) => idx === index);
        if (section && section.title) {
          await fetchData(section.title);
        }
      }
    }
    
  };

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
                        expandIcon={<ExpandMoreIcon style={{ color: "red" }} />}
                        aria-controls={`panel${index}-${subIndex}-content`}
                        id={`panel${index}-${subIndex}-header`}
                        onClick={() => {
                          if (!selectedAccordionIndexes.includes(subIndex)) {
                            setSelectedAccordionIndexes([...selectedAccordionIndexes, subIndex]);
                          } else {
                            setSelectedAccordionIndexes(selectedAccordionIndexes.filter(item => item !== subIndex));
                          }
                        }}
                      >
                        <Typography>{subSection.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{subSection.content}</Typography>
                        {subSection.subSubSections && (
                          <div>
                            {subSection.subSubSections.map((subSubSection, subSubIndex) => (
                              <Accordion key={subSubIndex}>
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon style={{ color: "green" }} />}
                                  aria-controls={`panel${index}-${subIndex}-${subSubIndex}-content`}
                                  id={`panel${index}-${subSubIndex}-${subSubIndex}-header`}
                                >
                                  <Typography>{subSubSection.title}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Typography>{subSubSection.content}</Typography>
                                </AccordionDetails>
                              </Accordion>
                            ))}
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
                  {selectedAccordionIndexes.map((selectedIndex) => {
                    if (section && Array.isArray(section.subSections) && section.subSections.length > selectedIndex) {
                      const subSection = section.subSections[selectedIndex];
                      if (subSection) {
                        return (
                          <Card
                            key={`nestedCard-${selectedIndex}`}
                            title={subSection.title}
                            fields={
                              subSectionLabels[selectedIndex]?.map((labelName, labelIndex) => ({
                                label: labelName,
                                name: `field${labelIndex + 1}`,
                                type: "text",
                              })) || []
                            }
                            onInputChange={handleInputChange}
                          />
                        );
                      }
                    }
                    return null;
                  })}


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
          serviceSpecName={
            data.find((_, idx) => activeSections.includes(idx))?.title
          }
          displayedCards={displayedCards} // Pass the filtered card data
          totalDisplayedCount={totalDisplayedCount}
        />
      )}
    </>
  );
};

export default ServiceOrdering;
