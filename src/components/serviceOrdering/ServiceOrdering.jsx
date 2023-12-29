import React, { useState } from "react";
import "./ServiceOrdering.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "./Card";
import { Button, Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import ServiceOrderJson from "./ServiceOrderJson";
import { ECM_API_LAMBDA, SERVICE_ORDER } from "../../constants/apiEndpoints";
import ApiService from "../../services/apiService";
import { toast, Toaster } from "react-hot-toast";

const ServiceOrdering = ({ data, selectedEnvironment }) => {
  const [labelNamesBySection, setLabelNamesBySection] = useState([]);
  const [subSectionLabels, setSubSectionLabels] = useState([]);
  const [showJson, setShowJson] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [selectedAccordionIndexes, setSelectedAccordionIndexes] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState("v1");
  const [activeSections, setActiveSections] = useState(
    Array(data.length).fill(false)
  );
  const [activeSubSections, setActiveSubSections] = useState(
    Array(data.length).fill([])
  );

  const handleMenuClick = (e) => {
    const versionKey = e.key;
    setSelectedVersion(versionKey);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="v1">v1</Menu.Item>
      <Menu.Item key="v4">v4</Menu.Item>
    </Menu>
  );

  const getDisplayedCardsData = () => {
    const displayedCards = data.reduce((acc, section, index) => {
      if (section.displayAdditionalCard && activeSections.includes(index)) {
        const additionalCardData = {
          title: section.title,
          fields:
            labelNamesBySection[index]?.map((labelName) => ({
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

  console.log("Selected Accordion", selectedAccordionIndexes);

  const { displayedCards, totalDisplayedCount } = getDisplayedCardsData();

  const apiService = new ApiService(selectedEnvironment);

  const handlePrepareClick = () => {
    setShowJson(!showJson);
  };

  const handleJsonData = (data) => {
    setJsonData(data);
  };

  const handleSubmitClick = async () => {
    try {
      if (jsonData) {
        const useeocApi = true; // Adjust based on your conditions
        const endpoint = SERVICE_ORDER[selectedVersion];
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Basic c3ZjX2NvbXVzZXI6ZXFDU0NxPmU4Iw==",
        };

        const response = await apiService.post(
          endpoint,
          jsonData,
          headers,
          "",
          useeocApi
        );

        console.log(response);

        if (response.ok) {
          toast.success("Submitted Order Successfully", {
            style: {
              border: "2px solid black",
              padding: "16px",
              color: "green",
              backgroundColor: "#B6EACD",
              fontWeight: "bold",
            },
          });
        } else {
          toast.error("API call failed", {
            style: {
              border: "2px solid black",
              padding: "16px",
              color: "red",
              backgroundColor: "#FEE3E1",
              fontWeight: "bold",
            },
          });
        }
      } else {
        toast.error("No JSON data found", {
          style: {
            border: "2px solid black",
            padding: "16px",
            color: "red",
            backgroundColor: "#FEE3E1",
            fontWeight: "bold",
          },
        });
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`, {
        style: {
          border: "2px solid black",
          padding: "16px",
          color: "red",
          backgroundColor: "#FEE3E1",
          fontWeight: "bold",
        },
      });
    }
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
      const params = { Parameter: title }; // Handle subSection title
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
        const currentSubSection = data.find(
          (_, idx) => idx === activeSections[activeSections.length - 1]
        );
        if (currentSubSection && currentSubSection.subSections) {
          const subSectionTitle = currentSubSection.subSections.find(
            (sub) => sub.title === title
          )?.title;
          if (subSectionTitle) {
            setSubSectionLabels((prevLabels) => ({
              ...prevLabels,
              [subSectionTitle]: fetchedLabelNames,
            }));
          }
        }
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

  const handleAccordionChange = async (index, subSectionIndex = null) => {
    if (!activeSubSections[index]) {
      setActiveSubSections({ ...activeSubSections, [index]: [] });
    }

    if (subSectionIndex !== null) {
      const subSection = (data[index]?.subSections || [])[subSectionIndex]
        ?.title;
      if (subSection) {
        const isActive = activeSubSections[index]?.includes(subSectionIndex);
        const updatedSubSections = { ...activeSubSections };

        if (!isActive) {
          await fetchData(subSection, true);
          updatedSubSections[index] =
            updatedSubSections[index].concat(subSectionIndex);
          setActiveSubSections(updatedSubSections);
        } else {
          updatedSubSections[index] = updatedSubSections[index].filter(
            (item) => item !== subSectionIndex
          );
          setActiveSubSections(updatedSubSections);
        }
      }
    } else {
      const isExpanded = activeSections.includes(index);

      if (isExpanded) {
        setActiveSections(
          activeSections.filter((activeIndex) => activeIndex !== index)
        );
      } else {
        setActiveSections([...activeSections, index]);

        const section = data.find((_, idx) => idx === index);
        if (section && section.title) {
          await fetchData(section.title);
        }
      }
    }
  };

  console.log("Sub Section Label Names:", subSectionLabels);
  console.log("Label Names by section ", labelNamesBySection);
  console.log("selected index", selectedAccordionIndexes);

  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />

      <div className="container">
        <div className="version-dropdown-style-service">
          <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              {selectedVersion}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
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
              {activeSections.includes(index) &&
                section.subSections &&
                section.subSections.length > 0 && (
                  <AccordionDetails>
                    <div>
                      {section.subSections.map((subSection, subIndex) => (
                        <Accordion
                          key={subIndex}
                          onChange={() =>
                            handleAccordionChange(index, subIndex)
                          }
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index}-${subIndex}-content`}
                            id={`panel${index}-${subIndex}-header`}
                            onClick={() => {
                              if (
                                !selectedAccordionIndexes.includes(subIndex)
                              ) {
                                setSelectedAccordionIndexes([
                                  ...selectedAccordionIndexes,
                                  subIndex,
                                ]);
                              } else {
                                setSelectedAccordionIndexes(
                                  selectedAccordionIndexes.filter(
                                    (item) => item !== subIndex
                                  )
                                );
                              }
                            }}
                          >
                            <Typography>{subSection.title}</Typography>
                          </AccordionSummary>
                          {subSection.subSubSections &&
                            subSection.subSubSections.length > 0 && (
                              <AccordionDetails>
                                <Typography>{subSection.content}</Typography>
                                <div>
                                  {subSection.subSubSections.map(
                                    (subSubSection, subSubIndex) => (
                                      <Accordion key={subSubIndex}>
                                        <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                          aria-controls={`panel${index}-${subIndex}-${subSubIndex}-content`}
                                          id={`panel${index}-${subSubIndex}-${subSubIndex}-header`}
                                        >
                                          <Typography>
                                            {subSubSection.title}
                                          </Typography>
                                        </AccordionSummary>
                                      </Accordion>
                                    )
                                  )}
                                </div>
                              </AccordionDetails>
                            )}
                        </Accordion>
                      ))}
                    </div>
                  </AccordionDetails>
                )}
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
                      label: `${section.title}.${labelName}`,
                      name: `${section.title}.${labelName}`,
                      type: "text",
                    })) || []
                  }
                  onInputChange={handleInputChange}
                >
                  {section.subSections &&
                    section.subSections.map(
                      (subSection, subIndex) =>
                        activeSubSections[index]?.includes(subIndex) && ( // Check if this subsection is active
                          <Card
                            key={`nestedCard-${subIndex}`}
                            title={subSection.title}
                            fields={(
                              subSectionLabels[subSection.title] || []
                            ).map((labelName, labelIndex) => ({
                              label: `${subSection.title}.${labelName}`,
                              name: `field${labelIndex + 1}`,
                              type: "text",
                            }))}
                            onInputChange={handleInputChange}
                          />
                        )
                    )}
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
            <Button
              shape="round"
              className="prepare-button"
              onClick={handleSubmitClick}
            >
              Submit Service Order
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
          subsectionTitles={data.reduce((acc, section, index) => {
            if (section.subSections && activeSections.includes(index)) {
              section.subSections.forEach((subSection) => {
                acc.push(subSection.title);
              });
            }
            return acc;
          }, [])}
          selectedAccordionIndexes={selectedAccordionIndexes}
          handleJsonData={handleJsonData}
          selectedVersion={selectedVersion}
        />
      )}
    </>
  );
};

export default ServiceOrdering;
