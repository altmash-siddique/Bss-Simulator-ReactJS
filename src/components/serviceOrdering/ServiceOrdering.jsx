import React, { useState, useEffect } from "react";
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
import Modal from "antd/lib/modal/Modal";
import { useLocation} from 'react-router-dom';
import { Formik, Form, Field, FieldArray } from 'formik';
const ServiceOrdering = ({ data, selectedEnvironment }) => {
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

  const [modalVisible, setModalVisible] = useState(false);
  const [modalCount, setModalCount] = useState(1);
  const [sectionData, setSectionData] = useState({});
  const location = useLocation();
  const {feasibilityPlaceData} = location.state || {};
  const [localInitialValues, setLocalInitialValues] = useState({});
  const openModal = () => {
    setModalVisible(true);
  };

 

  useEffect(() => {
    if (feasibilityPlaceData && feasibilityPlaceData.installation) {
      setLocalInitialValues(() => ({
       ...generateFieldInitialValues('install', feasibilityPlaceData.installation),
      }));
    }

    if (feasibilityPlaceData && feasibilityPlaceData.connectionPoint) {
      setLocalInitialValues(() => ({
        ...generateFieldInitialValues('connect', feasibilityPlaceData.connectionPoint),
      }));
    }
    console.log('localInitialValues:', localInitialValues);
  }, [feasibilityPlaceData]);

  const generateFieldInitialValues = (prefix, data) => {
    if (!data) {
      return {};
    }

    return Object.keys(data).reduce((acc, key) => {
      acc[`${prefix}_${key}`] = data[key];
      return acc;
    }, {});
  };


  

 
 


  const handleModalConfirm = async (index) => {
    try {
      await fetchData("CFS_P2MP_ETH");

      setModalVisible(false);

      setActiveSections((prevActiveSections) => {
        const updatedSections = [...prevActiveSections];
        for (let i = 0; i < modalCount; i++) {
          if (!updatedSections.includes(index)) {
            updatedSections.push(index);
          }
        }
        return updatedSections;
      });

      await Promise.all(Array(modalCount).fill(fetchData("CFS_P2MP_ETH")));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const modalContent = (
    <Modal
      title="Specify Count"
      open={modalVisible}
      onOk={handleModalConfirm}
      onCancel={() => setModalVisible(false)}
    >
      <p>Specify the count for CFS_P2MP_ETH:</p>
      <input
        type="number"
        value={modalCount}
        onChange={(e) => setModalCount(parseInt(e.target.value, 10))}
      />
    </Modal>
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
            sectionData[section.title]?.map((labelName) => ({
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
        setSectionData((prevData) => ({
          ...prevData,
          [title]: fetchedLabelNames,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAccordionChange = async (index, subSectionIndex = null) => {
    if (!activeSubSections[index]) {
      setActiveSubSections((prevActiveSubSections) => ({
        ...prevActiveSubSections,
        [index]: [],
      }));
    }

    const isCfsP2mpEth = data[index]?.title === "CFS_P2MP_ETH";

    if (isCfsP2mpEth && !modalVisible) {
      openModal(index);
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
        setActiveSections((prevActiveSections) =>
          prevActiveSections.filter((activeIndex) => activeIndex !== index)
        );
      } else {
        setActiveSections((prevActiveSections) => [
          ...prevActiveSections,
          index,
        ]);

        const section = data.find((_, idx) => idx === index);
        if (section && section.title) {
          await fetchData(section.title);
        }
      }
    }
  };

  console.log("Sub Section Label Names:", subSectionLabels);
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

        <Formik initialValues={localInitialValues}>
      {({ values }) => (
              
                  <Form>
                  <div className="right-section">
                    <div className="customer-id">
                      <label htmlFor="customerId">Customer ID: </label>
                      {/* Use Field component for Formik-managed fields */}
                      <Field type="text" id="customerId" name="customerId" />
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
                 <FieldArray name="installationAddress">
                 {(arrayHelpers) => (
                        <div>
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
                    />
                      </div>
                )}
              </FieldArray>
                    <FieldArray name="connectionPointAddresses">
                    {(arrayHelpers) => (
                  <div>
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
                          />
                        </div>
                      )}
                    </FieldArray>
                    {console.log('Formik values:', values)}

            
                  {data.map((section, index) =>
                    section.displayAdditionalCard &&
                    activeSections.includes(index) ? (
                      <React.Fragment key={`additionalCard-${index}`}>
                        {section.title === "CFS_P2MP_ETH" ? (
                          // Handle "CFS_P2MP_ETH" differently
                          Array.from({ length: modalCount }, (_, i) => (
                            <Card
                              key={`additionalCard-${index}-${i}`}
                              title={section.title}
                              fields={
                                sectionData[section.title]?.map((labelName) => ({
                                  label: `${section.title}.${labelName}`,
                                  name: `${section.title}.${labelName}`,
                                  type: "text",
                                })) || []
                              }
                              onInputChange={handleInputChange}
                            />
                          ))
                        ) : (
                          // Keep the existing logic for other sections
                          <Card
                            title={section.title}
                            fields={
                              sectionData[section.title]?.map((labelName) => ({
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
                                  activeSubSections[index]?.includes(subIndex) && (
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
                        )}
                      </React.Fragment>
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
              </Form>
                )
              }
           </Formik>

       
      </div>
      {showJson && (
        <ServiceOrderJson
          inputValues={inputValues} // Make sure inputValues are properly passed
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
          feasibilityPlaceData = {feasibilityPlaceData}
        />
      )}
      {modalContent}
    </>
  );
};

export default ServiceOrdering;
