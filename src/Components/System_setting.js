import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Tabs from "./cards/Tabs";
import Header from "./cards/header";
import Switch from "@mui/material/Switch";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import AddIPAddressToAnsible from "./Servers/AddIpAddress";

export default function SystemSetting() {

  const [subnet, setSubnet] = useState("");
  const [netmask, setNetmask] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [routers, setRouters] = useState("");
  const [domain, setDomain] = useState("");
  const [tftpServerName, setTftpServerName] = useState("");
  const [DhcpOn, setDhcpOn] = useState(false);
  const [TftpOn, setTftpOn] = useState(false);
  const navigate = useNavigate();
  const Token = Cookies.get(process.env.REACT_APP_COOKIENAME || "auto provision");
  const BaseUrlTr069 = window.location.host.split(":")[0] || "localhost";
  const PORTTr069 = "3000";
  const BaseUrlNode = window.location.host.split(":")[0] || "localhost";
  const PORTNode = process.env.REACT_APP_API_NODE_PORT || "4058";
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      if (!Token) navigate("/");
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
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status !== 1) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/");
    }
  };

  const fetchData2 = async () => {
    try {

      const TokenData = JSON.parse(Token);
      const DhcpStart = "2";
      const TftpStart = "2";
      const url = `http://${BaseUrlNode}:${PORTNode}/checkStatus`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + TokenData.AuthToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DhcpStart: DhcpStart,
          TftpStart: TftpStart,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 0) {
        setDhcpOn(data.data.Dhcp === 1);
        setTftpOn(data.data.Tfcp === 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData2();
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const dhcpConfig = {
      subnet: subnet,
      netmask: netmask,
      range: { start: rangeStart, end: rangeEnd },
      routers: routers,
      tftpServerName: tftpServerName,
      dns: domain,
    };
    try {
      const response = await fetch(
        `http://${BaseUrlNode}:${PORTNode}/submitDHCPConfig`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Token,
          },
          body: JSON.stringify(dhcpConfig),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 0) {
        alert("DHCP configuration set successfully.");
        window.location.reload();
      } else {
        alert("Failed to set DHCP configuration.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting DHCP configuration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange = async (event) => {
    try {
      setIsLoading(true);
      const TokenData = JSON.parse(Token);
      const DhcpStart = DhcpOn ? "0" : "1";
      const TftpStart = "2";
      const response = await fetch(
        `http://${BaseUrlNode}:${PORTNode}/checkStatus`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DhcpStart: DhcpStart,
            TftpStart: TftpStart,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 0) {
        (await data.data.Dhcp) === 1 ? setDhcpOn(true) : setDhcpOn(false);
        fetchData2();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange2 = async (event) => {
    try {
      setIsLoading(true);
      const TokenData = JSON.parse(Token);
      const TftpStart = TftpOn ? "0" : "1";
      console.log(TftpStart);
      const url = `http://${BaseUrlNode}:${PORTNode}/checkStatus`;
      const DhcpStart = "2";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + TokenData.AuthToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DhcpStart: DhcpStart,
          TftpStart: TftpStart,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 0) {
        (await data.data.Tfcp) === 1 ? setTftpOn(true) : setTftpOn(false);
        fetchData2();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatusSwitch = ({ DhcpOn, onSwitchChange }) => {
    const switchColor = DhcpOn ? "green" : "red";
    return (
      <Switch
        checked={DhcpOn}
        onChange={onSwitchChange}
        style={{ color: switchColor }}
        color="default"
      />
    );
  };

  const [activeTab, setActiveTab] = useState("Status");

  const renderTabContent = () => {
    switch (activeTab) {
      case "TFTP Configuration":
        return (
          <>
            <div
              style={{
                marginLeft: '250px',
                marginRight: '20px',
                width: 'calc(98% - 250px)',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                boxSizing: 'border-box',
                minHeight: '70vh'
              }}
            >
              <form onSubmit={handleSubmit}>
                {[
                  { label: 'Subnet:', id: 'subnet', value: subnet, setter: setSubnet },
                  { label: 'Netmask:', id: 'netmask', value: netmask, setter: setNetmask },
                  { label: 'Pool start:', id: 'rangeStart', value: rangeStart, setter: setRangeStart },
                  { label: 'Pool end:', id: 'rangeEnd', value: rangeEnd, setter: setRangeEnd },
                  { label: 'Option Routers:', id: 'routers', value: routers, setter: setRouters },
                  { label: 'Option Domain Name Servers:', id: 'domain', value: domain, setter: setDomain },
                  { label: 'Tftp server name:', id: 'DHCP', value: tftpServerName, setter: setTftpServerName },
                ].map((field) => (
                  <div key={field.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <label htmlFor={field.id} style={{ width: '180px', fontWeight: 'bold' }}>{field.label}</label>
                    <input
                      type="text"
                      id={field.id}
                      name={field.id}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#f8f9fa',
                        color: "black"
                      }}
                    />
                  </div>
                ))}

                <button type="submit" className="button21">
                  Submit
                </button>
              </form>
            </div>
          </>
        );
      case "Status":
        return (
          <>
          <div
            style={{
              marginLeft: '250px',
              marginRight: '20px',
              width: 'calc(100% - 270px)',
              backgroundColor: '#fefefe', 
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              boxSizing: 'border-box',
              minHeight: '30vh',
            }}
          >
            {(!DhcpOn && !TftpOn) && (
            <span style={{ color: "red", marginLeft: "250px", display: 'block', marginTop: "10px" }}>
              Ensure that DHCP and TFTP services are installed for this to work.
            </span>
          )}
            <div className="setting-item" style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '10px' }}>DHCP</h3>
              <StatusSwitch
                DhcpOn={DhcpOn}
                onSwitchChange={handleSwitchChange}
              />
            </div>
        
            <div className="setting-item">
              <h3 style={{ marginBottom: '10px' }}>TFTP</h3>
              <StatusSwitch
                DhcpOn={TftpOn}
                onSwitchChange={handleSwitchChange2}
              />
            </div>
          </div>
        </>
        
        );
      case "Add ipAddress to ansible":
        return (
          <>
            <AddIPAddressToAnsible/>
          </>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <>
      <Sidebar />
      <Header Title="System Settings" breadcrumb="/System Settings" />
      <div className="system-settings-tab">
        <Tabs
          tabs={["Status", "TFTP Configuration", "Add ipAddress to ansible"]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      {renderTabContent()}

      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ color: "white", fontSize: "30px", display: "flex", alignItems: "center" }}>
            <AiOutlineLoading3Quarters
              style={{
                animation: "spin 2s linear infinite",
                marginRight: "10px",
              }}
            />
            Please wait... while we are saveing the data.
          </div>
        </div>
      )}
    </>
  );
}
