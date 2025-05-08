import React, { useEffect, useState } from "react";
import Navbar from "../../Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Shell from "../../terminal";
import Header from "../../cards/header";
import Core from "../../Image/linuxprovisioning.jpeg";

const LinuxProvisioning = () => {
  const navigate = useNavigate();
  const [shellData, setShellData] = useState(
    "Welcome to linux Shell! This is a read-only shell."
  );
  const BaseUrlTr069 = window.location.host.split(":")[0] || "localhost";
  const PORTTr069 = "3000";
  const BaseUrlNode = window.location.host.split(":")[0] || "localhost";
  const PORTNode = process.env.REACT_APP_API_NODE_PORT || "4058";
  const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
  const Token = Cookies.get(CookieName);
  const [ipAddresses, setIpAddresses] = useState([""]);

  useEffect(() => {
    if (!Token) navigate("/");
    const fetchData = async () => {
      try {
        const TokenData = JSON.parse(Token);
        const response = await fetch(
          `http://${BaseUrlTr069}:${PORTTr069}/checkAuth`,
          {
            method: "post",
            headers: {
              Authorization: "Bearer " + TokenData.AuthToken,
            },
          }
        );
        const data = await response.json();
        if (data.status !== 1) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = async (index, value) => {
    const updatedIpAddresses = [...ipAddresses];
    updatedIpAddresses[index] = value;
    await setIpAddresses(updatedIpAddresses);
  };

  const addIpAddress = async () => {
    await setIpAddresses([...ipAddresses, ""]);
  };

  const removeIpAddress = async (index) => {
    const updatedIpAddresses = [...ipAddresses];
    updatedIpAddresses.splice(index, 1);
    await setIpAddresses(updatedIpAddresses);
  };

  const RebootCall = async () => {
    try {
      const TokenData = JSON.parse(Token);
      const maxRetries = 3;
      let retryCount = 0;
      let devices = [];
      while (devices.length === 0 && retryCount < maxRetries) {
        devices = await ipAddresses;
        if (devices.length === 0) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          retryCount++;
        }
      }

      if (devices.length === 0) {
        alert("No devices found after multiple attempts.");
        return;
      }

      console.log("Devices:", devices);

      // Perform the POST request
      let response = await fetch(`http://${BaseUrlNode}:${PORTNode}/linuxReboot`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TokenData.AuthToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ devices }),
      });

      response = await response.json();

      // Handle the response
      if (response.status === 0) {
        setShellData(response.responce);
        alert(`Success: ${response.message}`);
      } else {
        setShellData(response.responce);
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Error during RebootCall:", error);
      alert("Server Error. Please try again later.");
    }
  };


  const LinuxConfig = async () => {
    try {
      const TokenData = JSON.parse(Token);
      const maxRetries = 3; // Maximum retry attempts
      let retryCount = 0;
      let devices = [];

      // Retry mechanism for fetching devices
      while (devices.length === 0 && retryCount < maxRetries) {
        devices = await ipAddresses; // Fetch devices
        if (devices.length === 0) {
          console.log("Devices list is empty. Retrying in 5 seconds...");
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
          retryCount++;
        }
      }

      // If devices are still empty after retries
      if (devices.length === 0) {
        alert("No devices found after multiple attempts.");
        return;
      }

      console.log("Devices:", devices);

      // Perform the POST request
      let response = await fetch(`http://${BaseUrlNode}:${PORTNode}/linuxConfig`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TokenData.AuthToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ devices }),
      });

      response = await response.json();

      // Handle the response
      if (response.status === 0) {
        setShellData(response.responce);
        alert(`Success: ${response.message}`);
      } else {
        setShellData(response.responce);
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Error during LinuxConfig:", error);
      alert("Server Error. Please try again later.");
    }
  };


  return (
    <>
      <Navbar />
      <Header Title="Linux Provisioning" breadcrumb="/Server/5G core" />

      <div
        style={{
          marginLeft: '250px',
          marginRight: '20px',
          marginTop: '20px',
          width: 'calc(100% - 270px)',
          backgroundColor: 'white',
          borderRadius: '6px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          boxSizing: 'border-box',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '40px',
        }}
      >
        <div
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '40px',
          }}
        >
          <p style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '10px' }}>
            Linux Provisioning
          </p>
          <img src={Core} alt="Loading..." style={{ maxWidth: '100%', height: 'auto' }} />

          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {ipAddresses.map((ipAddress, index) => (
              <div key={index}>
                <label
                  htmlFor={`ipAddress-${index}`}
                  style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}
                >
                  IP Address <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    id={`ipAddress-${index}`}
                    value={ipAddress}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Enter IP address"
                    required
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeIpAddress(index)}
                      style={{
                        padding: '10px 15px',
                        backgroundColor: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        width: '90px',
                        height: '40px',
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={addIpAddress}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                + Add IP Address
              </button>

              <button
                type="button"
                onClick={RebootCall}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Reboot
              </button>

              <button
                type="button"
                onClick={LinuxConfig}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Configure Machine
              </button>
            </div>
          </form>
        </div>
        <Shell shellOutput={shellData} />
      </div>
    </>



  );
};

export default LinuxProvisioning;
