import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Sidebar";
import Cookies from "js-cookie";
import Header from "../cards/header";
import { useNavigate } from "react-router-dom";
import Cisco from "../Image/cisco.png";
import Tabs from "../cards/Tabs";
import { BiArrowFromLeft } from "react-icons/bi";
import Server from "../Image/Server.png";
import Folder from "../Image/Folder.png";
import { ImCross } from "react-icons/im";
import { SiTicktick } from "react-icons/si";
import { FaCircle } from "react-icons/fa6";
import { FaLongArrowAltRight } from "react-icons/fa";

const Cisco_phone = () => {
  const [progressOpen, setProgressOpen] = useState(false);
  const [dhcp, setDhcp] = useState(true);
  const [defaultFile, setDefaultFile] = useState(true);
  const [tftp, setTftp] = useState(true);
  const [path, setPath] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [securePort, setSecurePort] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [account1_Extension, setAccount1_Extension] = useState("");
  const [account1_AuthenticateID, setAccount1_AuthenticateID] = useState("");
  const [account1_LocalSipPort, setAccount1_LocalSipPort] = useState("");
  const [sipServer, setSipServer] = useState("");
  const [activeTab, setActiveTab] = useState("Provisioning");
  const [macAddresses, setMacAddresses] = useState([
    { macAddress: "", Extension: "" },
  ]);
  const [showCross, setShowCross] = useState(false);
  const [allConditionsMet, setAllConditionsMet] = useState(true);

  const progressSidebarRef = useRef(null);
  const navigate = useNavigate();
  const Token = Cookies.get(
    process.env.REACT_APP_COOKIENAME || "auto provision"
  );
  const BaseUrlTr069 = "192.168.100.190" || "localhost";
  const PORTTr069 = "3000";
  const BaseUrlSpring = "192.168.100.190" || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";

  useEffect(() => {
    if (!Token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const TokenData = JSON.parse(Token);
        const response = await fetch(
          `http://${BaseUrlTr069}:${PORTTr069}/checkAuth`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + TokenData.AuthToken,
            },
          }
        );
        const data = await response.json();
        if (data.status !== 1) navigate("/");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchData2 = async () => {
      try {
        const TokenData = JSON.parse(Token);
        const response = await fetch(
          `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerCiscoHistory/alldata`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + TokenData.AuthToken,
            },
          }
        );
        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval1 = setInterval(() => {
      fetchData2();
      fetchData();
    }, 5000);

    const interval2 = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % 4);
    }, 2000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [navigate, PORTTr069, BaseUrlTr069, Token, BaseUrlSpring, PORTSpring]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        progressSidebarRef.current &&
        !progressSidebarRef.current.contains(event.target)
      ) {
        setProgressOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const conditions = { dhcp, tftp, path, defaultFile };
    const areAllConditionsMet = Object.values(conditions).every(Boolean);

    setAllConditionsMet(areAllConditionsMet);
    if (!areAllConditionsMet) {
      const timer = setTimeout(() => setShowCross(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [dhcp, tftp, path, defaultFile]);

  const conditions = {
    0: dhcp ? "Dhcp on" : "Dhcp off",
    1: tftp ? "Tftp on" : "Tftp off",
    2: path ? "File present" : "File not present",
    3: defaultFile ? "Default file present" : "Default file not present",
  };

  const getDiagnosis = async (itemData) => {
    setDhcp(itemData.dhcp);
    setTftp(itemData.tftp);
    setPath(itemData.filePresent);
    setDefaultFile(itemData.defaultFile);
    setProgressOpen(true);
  };

  const CallSubmit = async (event) => {
    event.preventDefault();
    try {
      const TokenData = JSON.parse(Token);
      const postData = {
        sipServer,
        macAddress,
        AuthenticateID: account1_AuthenticateID,
        port: account1_LocalSipPort,
        extension: account1_Extension,
        securePort,
        macAddressBulk: macAddresses.map((item) => item.macAddress),
        macExtensionBulk: macAddresses.map((item) => item.Extension),
      };

      const response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerCiscoHistory/ciscoConfig`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TokenData.AuthToken}`,
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) alert("Failed to create account.");
    } catch (error) {
      console.error("Error creating account.");
      alert("Failed to create account. Please try again.");
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedMacAddresses = [...macAddresses];
    updatedMacAddresses[index] = {
      ...updatedMacAddresses[index],
      [field]: value,
    };
    setMacAddresses(updatedMacAddresses);
  };

  const removeMacAddress = (index) => {
    const updatedMacAddresses = macAddresses.filter((_, i) => i !== index);
    setMacAddresses(updatedMacAddresses);
  };

  const addMacAddress = () => {
    setMacAddresses([...macAddresses, { macAddress: "", Extension: "" }]);
  };

  const conditionColor = (index) => {
    if (index === "Dhcp on") return "green";
    else if (index === "Tftp on") return "green";
    else if (index === "Default file present") return "green";
    else if (index === "File present") return "green";
    return "red";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Diagnosis":
        return (
          <>
            <div>
              <form
                className="history-list"
                style={{ marginLeft: "240px", marginRight: "40px" }}
              >
                <div className="form-group902232">
                  <table className="styled-table2232">
                    <thead>
                      <tr>
                        <th>Serial no.</th>
                        <th>MAC address</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{item.macAddress}</td>
                          <td>{item.date}</td>
                          <td>{item.time}</td>
                          <td>
                            <BiArrowFromLeft
                              style={{
                                cursor: "pointer",
                                color: "blue",
                                marginLeft: "10px",
                              }}
                              onClick={() => getDiagnosis(item)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </form>
            </div>
            <div>
              {progressOpen && (
                <div
                  className={`progress-popup ${progressOpen ? "active" : ""}`}
                  ref={progressSidebarRef}
                  onClick={(e) => {
                    if (e.target === progressSidebarRef.current) {
                      setProgressOpen(false);
                    }
                  }}
                >
                  <div className="progress-container">
                    <div className="final-icon">
                      {allConditionsMet ? (
                        <SiTicktick style={{ color: "green" }} />
                      ) : showCross ? (
                        <ImCross style={{ color: "red" }} />
                      ) : null}
                    </div>
                    <div className="progress-content">
                      <div className="steps-container">
                        {Object.keys(conditions).map((index, idx) => {
                          return (
                            <div className="step " key={index}>
                              <div
                                className={`step-card ${index <= currentStep
                                    ? "completed"
                                    : "incomplete"
                                  }`}
                              >
                                <span
                                  style={{
                                    color: conditionColor(conditions[index]),
                                  }}
                                  className={`step-label fa ${index <= currentStep
                                      ? "fa-circle"
                                      : "fa-circle"
                                    }`}
                                >
                                  {conditions[index]}
                                </span>

                                <img
                                  src={
                                    index === "0" || index === "1"
                                      ? Server
                                      : index === "2"
                                        ? Folder
                                        : index === "3"
                                          ? Cisco
                                          : null
                                  }
                                  style={{ width: "80px", height: "80px" }}
                                  className={
                                    index <= currentStep
                                      ? "icon-completed"
                                      : "icon-incomplete"
                                  }
                                  alt="icon"
                                />
                                <div className="fa-circle">
                                  <FaCircle
                                    style={{
                                      color: conditionColor(conditions[index]),
                                    }}
                                    className={`fa ${index <= currentStep
                                        ? "fa-circle"
                                        : "fa-circle"
                                      }`}
                                  />
                                </div>
                              </div>
                              {idx < 3 && (
                                <FaLongArrowAltRight className="arrow-icon " />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        );
      case "Provisioning":
        return (
          <div>
            <form
              className="SipServerForm"
              style={{ marginBottom: "50px" }}
              onSubmit={CallSubmit}
            >
              <div style={{ display: "flex" }} className="form-partition">
                <div className="form-group90">
                  <img
                    style={{ height: "250px", width: "240px" }}
                    src={Cisco}
                    alt="Cisco Phone"
                  />
                </div>
                <div className="form-group90">
                  <label htmlFor="macAddress">
                    Mac Address<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="macAddress"
                    value={macAddress}
                    onChange={(e) => setMacAddress(e.target.value)}
                    placeholder="Enter MAC address"
                    required
                  />
                  <div className="form-group90">
                    <label htmlFor="Sip_server_ip">
                      SIP Server IP<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="Sip_server_ip"
                      value={sipServer}
                      onChange={(e) => setSipServer(e.target.value)}
                      placeholder="Enter SIP server IP"
                      required
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginRight: '20px',
                  width: 'calc(100%)',
                  backgroundColor: '#f9f9f9',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  boxSizing: 'border-box',
                  minHeight: '70vh'
                }}
              >
                {[
                  {
                    label: "SIP Port:",
                    id: "account1_LocalSipPort",
                    value: account1_LocalSipPort,
                    onChange: (e) => setAccount1_LocalSipPort(e.target.value),
                    type: "number",
                    placeholder: "Enter SIP port"
                  },
                  {
                    label: "Secure SIP Port:",
                    id: "securePort",
                    value: securePort,
                    onChange: (e) => setSecurePort(e.target.value),
                    type: "number",
                    placeholder: "Enter secure SIP port"
                  },
                  {
                    label: "Extension Number:",
                    id: "account1_Extension",
                    value: account1_Extension,
                    onChange: (e) => setAccount1_Extension(e.target.value),
                    type: "number",
                    placeholder: "Enter Extension Number"
                  },
                  {
                    label: "Password:",
                    id: "account1_AuthenticateID",
                    value: account1_AuthenticateID,
                    onChange: (e) => setAccount1_AuthenticateID(e.target.value),
                    type: "password",
                    placeholder: "Enter Password"
                  }
                ].map((field) => (
                  <div
                    key={field.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px',
                      gap: '10px'
                    }}
                  >
                    <label htmlFor={field.id} style={{ width: '180px', fontWeight: 'bold' }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={field.placeholder}
                      required
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#f8f9fa',
                        color: 'black',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Provision
                  </button>
                  <button
                    type="button"
                    onClick={addMacAddress}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Add +
                  </button>
                </div>
                {macAddresses.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '16px'
                    }}
                  >
                    <label
                      htmlFor={`macAddress-${index}`}
                      style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}
                    >
                      Enter MAC Address and Extension of Device {index + 1}
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        id={`macAddress-${index}`}
                        value={item.macAddress}
                        onChange={(e) =>
                          handleInputChange(index, 'macAddress', e.target.value)
                        }
                        placeholder="Enter MAC address"
                        required
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          backgroundColor: '#f8f9fa',
                          color: 'black',
                          outline: 'none'
                        }}
                      />
                      <input
                        type="number"
                        id={`Extension-${index}`}
                        value={item.Extension}
                        onChange={(e) =>
                          handleInputChange(index, 'Extension', e.target.value)
                        }
                        placeholder="Enter extension"
                        required
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          backgroundColor: '#f8f9fa',
                          color: 'black',
                          outline: 'none'
                        }}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeMacAddress(index)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <>
      <Navbar />
      <Header Title="Cisco cp-3905" breadcrumb="/IP phone/Cisco cp-3905" />
      <div className="tabs-container">
        <Tabs
          tabs={["Provisioning", "Diagnosis"]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      {renderTabContent()}
    </>
  );
};

export default Cisco_phone;
