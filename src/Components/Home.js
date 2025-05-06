import React, { useEffect, useState } from "react";
import DashboardCard from "./cards/index";
import { Container, Row, Col } from "react-bootstrap";
import { FaMobileAlt, FaClock, FaHistory } from "react-icons/fa";
import Navbar from "./Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PieChartComponent from "./cards/Piechart";
import Header from "./cards/header";

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeschedule, setTimeschedule] = useState(0);
  const [countHistory, setCountHistory] = useState(0);
  const [systemHealth, setSystemHealth] = useState(null);
  const [onlineDevices, setOnlineDevices] = useState(0);
  const BaseUrlSpring = "192.168.250.58" || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";
  const BaseUrlTr069 = "192.168.250.58" || "localhost";
  const PORTTr069 = "3000";
  const BaseUrlNode = "192.168.250.58" || "localhost";
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

  return (

    <>
      <Navbar />
      <Header Title="Auto Provisioning Dashboard" breadcrumb="/dashboard" />

      <div
        style={{
          backgroundColor: '#4a4a4a', // black background
          minHeight: '100vh',
          padding: '20px',
          marginLeft: '240px', // leave space for sidebar
          color: 'white', // default text color
          boxSizing: 'border-box',
        }}
      >
        {/* Top Row with Dashboard Cards */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: '30px',
            gap: '20px',
          }}
        >
          <div style={{ flex: '1', minWidth: '250px' }}>
            <DashboardCard
              title="Online devices"
              value={onlineDevices || ""}
              color="#8cbed6"
              icon={<FaMobileAlt />}
              style={{
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: '#1c1c1c',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                height: '100%',
                color: 'white',
              }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <DashboardCard
              title="Time schedule"
              value={timeschedule || ""}
              color="#8cbed6"
              icon={<FaClock />}
              style={{
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: '#1c1c1c',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                height: '100%',
                color: 'white',
              }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <DashboardCard
              title="Total histories"
              value={countHistory || ""}
              color="#8cbed6"
              icon={<FaHistory />}
              style={{
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: '#1c1c1c',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                height: '100%',
                color: 'white',
              }}
            />
          </div>
        </div>

        {/* Pie Charts Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#8cbed6', borderRadius: '10px', padding: '20px' }}>
            {systemHealth !== null && (
              <PieChartComponent
                memUsage={systemHealth.data.totalCpu}
                title={<span style={{ color: 'white' }}>CPU Usage</span>}
                used="CPU Used"
                unused="CPU Unused"
              />
            )}
          </div>

          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#8cbed6', borderRadius: '10px', padding: '20px' }}>
            {systemHealth !== null && (
              <PieChartComponent
                memUsage={systemHealth.data.diskUsage.diskUsage}
                title={<span style={{ color: 'white' }}>Disk Usage</span>}
                used="Disk Used"
                unused="Disk Unused"
              />
            )}
          </div>

          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#8cbed6', borderRadius: '10px', padding: '20px' }}>
            {systemHealth !== null && (
              <PieChartComponent
                memUsage={systemHealth.data.ramUsage.memUsage}
                title={<span style={{ color: 'white' }}>RAM Usage</span>}
                used="RAM Used"
                unused="RAM Unused"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
