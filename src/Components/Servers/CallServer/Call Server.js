import React, { useEffect, useState } from "react";
import Navbar from "../../Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "../../cards/header";
import Shell from "../../terminal";
import Core from "../../Image/callserver.png";

export default function CallServer() {

  const navigate = useNavigate();
  const [shellData, setShellData] = useState(
    "Welcome to linux Shell! This is a read-only shell."
  );
  const [ipAddresses, setIpAddresses] = useState([]);
  const BaseUrlTr069 = window.location.host.split(":")[0] || "localhost";
  const PORTTr069 = "3000";
  const BaseUrlNode = window.location.host.split(":")[0] || "localhost";
  const PORTNode = process.env.REACT_APP_API_NODE_PORT || "4058";
  const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
  const Token = Cookies.get(CookieName);

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

  const handleFileUpload = async (provision) => {
    if (provision === 1) {
      const confirmSubmit = window.confirm("Are you sure you want to submit to all ansible IP addresses?");
      if (!confirmSubmit) {
        return;
      }
    }
    if (provision === 0 && ipAddresses.length === 0) {
      alert("Enter at least one IP Address.");
      return;
    }
    try {
      setShellData("Loading...");
      const TokenData = JSON.parse(Token);
      const response = await fetch(
        `http://${BaseUrlNode}:${PORTNode}/sendFile`,
        {
          method: "post",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
            provision: provision,
            devices: JSON.stringify(ipAddresses),
          },
        }
      );
      const data = await response.json();
      if (data.status === 0) {
        const formattedResponses = data.responses.map(item => ({
          ipAddress: item.IpAddress.ipAddress,
          result: item.result.responce
        }));
        setShellData(JSON.stringify(formattedResponses, null, 2));
      }
    } catch (error) {
      console.error("Error fetching data.");
      setShellData("Internal server error.");
    }
  };

  const addIpAddress = () => {
    setIpAddresses([...ipAddresses, { ipAddress: "" }]);
  };

  const handleInputChange = (index, value) => {
    const newIpAddresses = [...ipAddresses];
    newIpAddresses[index] = { ipAddress: value };
    setIpAddresses(newIpAddresses);
  };

  const removeIpAddress = (index) => {
    const newIpAddresses = ipAddresses.filter((_, i) => i !== index);
    setIpAddresses(newIpAddresses);
  };

  const handleSubmit = (e, provision) => {
    e.preventDefault();
    handleFileUpload(provision);
  };

  return (
    <>
      <Navbar />
      <Header Title="Call Server" breadcrumb="/Servers/CallServer" />

      <div
        style={{
          marginLeft: '250px',
          marginRight: '20px',
          marginTop: '20px',
          width: 'calc(98% - 250px)',
          backgroundColor: 'white',
          borderRadius: '1px',
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
            Call server
          </p>
          <img src={Core} alt="Loading..." style={{ maxWidth: '20%', height: '25%' }} />

          <form
            onSubmit={(e) => handleSubmit(e, 0)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {ipAddresses.map((item, index) => (
              <div key={index} >
                <label htmlFor={`ipAddress-${index}`} style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>
                  Enter IP Address {index + 1}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    id={`ipAddress-${index}`}
                    value={item.ipAddress}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Enter IP address"
                    required
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
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
                        width: "90px",
                        height: "40px"
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
                Add IP Address +
              </button>

              <button
                type="submit"
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
                Single action
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, 1)}
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
                Action to All
              </button>
            </div>
          </form>
        </div>

        <Shell shellOutput={shellData} />

      </div>
    </>

  );
}
