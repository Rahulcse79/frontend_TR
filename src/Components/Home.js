import React, { useEffect, useState } from "react";
import DashboardCard from "./cards/index";
import { FaMobileAlt, FaClock, FaHistory } from "react-icons/fa";
import Navbar from "./Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PieChartComponent from "./cards/Piechart";
import Header from "./cards/header";
import OnlinePie from "./cards/onlinePie";
import Loader from "./cards/Loader";

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeschedule, setTimeschedule] = useState(0);
  const [countHistory, setCountHistory] = useState(0);
  const [systemHealth, setSystemHealth] = useState(null);
  const [onlineDevices, setOnlineDevices] = useState(0);
  const BaseUrlSpring = window.location.host.split(":")[0] || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";
  const BaseUrlTr069 = window.location.host.split(":")[0] || "localhost";
  const PORTTr069 = "3000";
  const BaseUrlNode = window.location.host.split(":")[0] || "localhost";
  const PORTNode = process.env.REACT_APP_API_NODE_PORT || "4058";
  const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
  const Token = Cookies.get(CookieName);

  useEffect(() => {
    if (!Token) navigate("/");
    const TokenData = JSON.parse(Token);
    const fetchData = async () => {
      try {
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

    const fetchData2 = async () => {
      try {
        let response = await fetch(
          `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerInfo/allData`,
          {
            method: "GET",
            headers: {
              Authorization: TokenData.AuthToken,
            },
          }
        );
        response = await response.json();
        if (response) {
          let count = 0;
          response.forEach((item) => {
            if (item.active) {
              count++;
            }
          });
          setOnlineDevices(count);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchData3 = async () => {
      try {
        const response = await fetch(
          `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerAutoDeploy/allAutoDeployData`,
          {
            method: "GET",
            headers: {
              Authorization: TokenData.AuthToken,
            },
          }
        );
        const data = await response.json();
        setTimeschedule(data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchData4 = async () => {
      try {
        const response = await fetch(
          `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerHistory/historys`,
          {
            method: "GET",
            headers: {
              Authorization: TokenData.AuthToken,
            },
          }
        );
        const data = await response.json();
        setCountHistory(data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchData5 = async () => {
      try {
        const response = await fetch(
          `http://${BaseUrlNode}:${PORTNode}/systemHealth`,
          {
            method: "GET",
            headers: {
              Authorization: TokenData.AuthToken,
            },
          }
        );
        const data = await response.json();

        if (data.status === 0) {
          setSystemHealth(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData2();
    fetchData4();
    fetchData3();

    const intervalId = setInterval(() => {
      fetchData5();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [BaseUrlNode, PORTNode]);

  // if (systemHealth === null) {
  //   // While data is loading, show the loader
  //   return <Loader />;
  // }
  return (
    <>
      <Navbar />
      <Header Title="Auto Provisioning Dashboard" breadcrumb="/dashboard" />

      <div
        style={{
          backgroundColor: "#121212",
          minHeight: "100vh",
          padding: "30px",
          marginLeft: "240px",
          color: "white",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {/* Dashboard Metric Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {[
            // wrapping all 3 cards for uniformity
            {
              title: "Online devices",
              value: onlineDevices,
              icon: <FaMobileAlt />,
            },
            { title: "Time schedule", value: timeschedule, icon: <FaClock /> },
            {
              title: "Total histories",
              value: countHistory,
              icon: <FaHistory />,
            },
          ].map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              value={card.value || ""}
              icon={card.icon}
              color="#3b57e3"
              style={{
                padding: "24px",
                borderRadius: "16px",
                backgroundColor: "#1c1c1c",
                boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
                transition: "transform 0.3s ease",
                height: "100%",
                color: "white",
              }}
            />
          ))}
        </div>

        {/* Second Row: System Usage + Online Pie */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
        {/* Device Status Card */}
        <div
            style={{
              backgroundColor: "#1c1c1c",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            <h2
              style={{
                marginBottom: "10px",
                fontSize: "22px",
                color: "#ffffff",
              }}
            >
              Device Status
            </h2>
            <p
              style={{ marginBottom: "20px", fontSize: "14px", color: "#aaa" }}
            >
              Device availability in real-time
            </p>
            <OnlinePie />
          </div>

          {/* CPU Usage Card */}
          <div
            style={{
              backgroundColor: "#1c1c1c",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            <h2
              style={{
                marginBottom: "10px",
                fontSize: "22px",
                color: "#ffffff",
              }}
            >
              CPU Usage
            </h2>
            <p
              style={{ marginBottom: "20px", fontSize: "14px", color: "#aaa" }}
            >
              Real-time CPU utilization
            </p>
            {systemHealth ? (
              <PieChartComponent
                memUsage={systemHealth.data.totalCpu}
                title={<span style={{ color: "white" }}>CPU Usage</span>}
                used="CPU Used"
                unused="CPU Unused"
              />
            ) : (
              <div style={{display:"flex", alignContent:"center",justifyContent:"center"}}>
              <Loader />
              </div>
            )}
          </div>

          {/* Disk Usage Card */}
          <div
            style={{
              backgroundColor: "#1c1c1c",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            <h2
              style={{
                marginBottom: "10px",
                fontSize: "22px",
                color: "#ffffff",
              }}
            >
              Disk Usage
            </h2>
            <p
              style={{ marginBottom: "20px", fontSize: "14px", color: "#aaa" }}
            >
              Real-time disk space utilization
            </p>
            {systemHealth ? (
              <PieChartComponent
                memUsage={systemHealth.data.diskUsage.diskUsage}
                title={<span style={{ color: "white" }}>Disk Usage</span>}
                used="Disk Used"
                unused="Disk Unused"
              />
            ) : (
              <div style={{display:"flex", alignContent:"center",justifyContent:"center"}}>
              <Loader />
              </div>
            )}
          </div>

          {/* RAM Usage Card */}
          <div
            style={{
              backgroundColor: "#1c1c1c",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            <h2
              style={{
                marginBottom: "10px",
                fontSize: "22px",
                color: "#ffffff",
              }}
            >
              RAM Usage
            </h2>
            <p
              style={{ marginBottom: "20px", fontSize: "14px", color: "#aaa" }}
            >
              Real-time memory usage
            </p>
            {systemHealth ? (
              <PieChartComponent
                memUsage={systemHealth.data.ramUsage.memUsage}
                title={<span style={{ color: "white" }}>RAM Usage</span>}
                used="RAM Used"
                unused="RAM Unused"
              />
            ) : (
              <div style={{display:"flex", alignContent:"center",justifyContent:"center"}}>
              <Loader />
              </div>
            )}
          </div>

          
        </div>
      </div>
    </>
  );
};

export default Dashboard;
