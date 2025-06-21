import React, { useState, useEffect } from "react";
import Navbar from "../Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOnlinePrediction } from "react-icons/md";
import { Button } from "react-bootstrap";
import Header from "../cards/header";

export default function LineConfig() {

    const [isLoading, setIsLoading] = useState(false);
    const [iframeUrl, setIframeUrl] = useState("");
    const [showIframe, setShowIframe] = useState(false);
    const [showIframeData, setShowIframeData] = useState({
        ipAddress: '',
        macAddress: ''
    });
    const [apiData, setApiData] = useState([]);
    const BaseUrlSpring = window.location.host.split(":")[0] || "localhost";
    const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";
    const BaseUrlTr069 = window.location.host.split(":")[0] || "localhost";
    const PORTTr069 = "3000";
    const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
    const Token = Cookies.get(CookieName);
    const navigate = useNavigate();

    const blfType = [
        "N/A",
        "Line",
        "Speed Dial",
        "BLF",
        "BLF List",
        "Voice Mail",
        "Direct Pickup",
        "Group Pickup",
        "Call Park",
        "Intercom",
        "DTMF",
        "Prefix",
        "Local Group",
        "XML Group",
        "XML Browser",
        "LDAP",
        "Network Directories",
        "Conference",
        "Forward",
        "Transfer",
        "Hold",
        "DND",
        "Redial",
        "Call Return",
        "SMS",
        "Record",
        "URL Record",
        "Group Listening",
        "Public Hold",
        "Private Hold",
        "Hot Desking",
        "ACD",
        "Zero Touch",
        "URL",
        "Network Group",
        "MultiCast Paging",
        "Group Call Park",
        "CallPark Retrieve",
        "XML BLF",
        "Silent Call",
        "Smart BLF"
    ];

    const [lineData, setLineData] = useState([]);
    const [selectedMac, setSelectedMac] = useState(null);

    useEffect(() => {
        const initialData = Array(45).fill(null).map((_, index) => ({
            key: `${index + 1}`,
            type: 0,
            mode: 0,
            value: "",
            label: "",
            account: 1,
            extension: ""
        }));

        setLineData(initialData);
    }, []);

    const handleChange = (index, field, value) => {
        const updated = [...lineData];
        updated[index][field] = value;
        setLineData(updated);
    };

    const handleClear = () => {
        const initialData = Array(45).fill(null).map((_, index) => ({
            key: `${index + 1}`,
            type: 0,
            mode: 0,
            value: "",
            label: "",
            account: 1,
            extension: ""
        }));

        setLineData(initialData);
    }

    const HandleLineData = async (e) => {
        e.preventDefault();
    
        if (selectedMac === -1) {
            alert("Your device is offline.");
            return;
        } else if (selectedMac === null) {
            alert("Please select your device.");
            return;
        }
    
        const filteredData = lineData.filter(line => line.type !== 0);
    
        if (filteredData.length === 0) {
            alert("No line data to save.");
            return;
        }

        try {
            setIsLoading(true);
            const TokenData = JSON.parse(Token);
                const response = await fetch(`http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/linekey`, {
                // const response = await fetch(`http://localhost:9093/api/deviceManager/linekey`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + TokenData.AuthToken,
                    "MacAddress": selectedMac,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filteredData),
            });
    
            if (response.ok) {
                const result = await response.json();
                alert(result.message || "Line data saved successfully for mac address: " + selectedMac);
            } else {
                const errorResult = await response.json();
                alert(errorResult.message || "Error saving line data for mac address: " + selectedMac);
            }
        } catch (error) {
            console.error("Error during the line data save:", error);
            alert("An error occurred while saving line data.");
        } finally {
            setIsLoading(false);
        }
    };    

    const fetchData = async () => {
        try {
            if (!Token) navigate("/");
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

    useEffect(() => {

        const fetchData2 = async () => {
            try {
                const TokenData = JSON.parse(Token);
                const response = await fetch(
                    `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerInfo/allData`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: TokenData.AuthToken,
                        },
                    }
                );
                const data = await response.json();
                const sortedData = data.sort((a, b) => a.id - b.id);
                if (sortedData) {
                    setApiData(sortedData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData2();
        fetchData();

        const intervalId = setInterval(() => {
            fetchData2();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [
        setApiData,
        BaseUrlSpring,
        PORTSpring,
    ]);

    const handleCall = async (ipAddress, macAddress) => {
        setIframeUrl("");
        setShowIframe(false);
        setIsLoading(true);
        setShowIframeData({ ipAddress: '', macAddress: '' });

        if (ipAddress === -1) {
            alert("Device is not connected.");
            setIsLoading(false);
            return;
        }

        const isValidIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(ipAddress);
        if (!isValidIp) {
            alert("Please enter a valid IP address.");
            setIsLoading(false);
            return;
        }

        setShowIframeData({ ipAddress, macAddress });

        const width = 1;
        const height = 1;
        const left = window.screen.availWidth;
        const top = window.screen.availHeight;

        const authWindow = window.open(
            `http://admin:admin@${ipAddress}/`,
            'authWindow',
            `width=${width},height=${height},top=${top},left=${left}`
        );

        if (authWindow) {
            setTimeout(() => {
                authWindow.close();
            }, 1000);
        } else {
            console.warn("Popup blocked. Please allow popups for background auth.");
        }

        setTimeout(() => {
            setIsLoading(false);
            const url = `http://${ipAddress}/dsskey.htm`;
            setIframeUrl(url);
            setShowIframe(true);
        }, 3000);
    };

    return (
        <>
            <Navbar />
            <Header Title="Line key" breadcrumb="/Line_key" />
            <form
                className="history-list"
                style={{ marginLeft: "240px", marginRight: "40px" }}
                onSubmit={(e) => e.preventDefault()}
            >
                {!showIframe && (
                    <div className="form-group902232">
                        <table className="styled-table2232">
                            <thead>
                                <tr>
                                    <th>Serial no.</th>
                                    <th>MacAddress</th>
                                    <th>OUI</th>
                                    <th>Product class</th>
                                    <th>IpAddress</th>
                                    <th>Status</th>
                                    <th>Line Key</th>
                                    <th>Select here</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.macAddress}</td>
                                        <td>{item.oui}</td>
                                        <td>{item.productClass}</td>
                                        <td>{item.ipAddress !== "-1" ? item.ipAddress : "N/A"}</td>
                                        <td>
                                            <MdOnlinePrediction
                                                style={{
                                                    cursor: "pointer",
                                                    color: item.active ? "green" : "red",
                                                    marginLeft: "10px",
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="button"
                                                style={{ width: "150px" }}
                                                onClick={() => handleCall(item.active ? item.ipAddress : -1, item.macAddress)}
                                            >
                                                Fetch
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="button"
                                                style={{
                                                    width: "150px",
                                                    backgroundColor: selectedMac === item.macAddress ? "#333" : "",
                                                    color: selectedMac === item.macAddress ? "#fff" : "",
                                                }}
                                                onClick={() => {
                                                    if (!item.active) {
                                                        alert("Your device is offline");
                                                    } else {
                                                        setSelectedMac(item.macAddress);
                                                    }
                                                }}
                                            >
                                                {selectedMac === item.macAddress ? "Selected" : "Select"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showIframe && (
                    <div className="iframe-info-box">
                        <div className="info-row">
                            <button className="back-button" style={{ height: "40px", width: "160px" }} onClick={() => setShowIframe(false)}>← Back</button>
                            <span><strong>IP Address:</strong> {showIframeData.ipAddress}</span>
                            <span><strong>MAC Address:</strong> {showIframeData.macAddress}</span>
                        </div>
                    </div>
                )}

                {showIframe && (
                    <div
                        style={{
                            marginTop: "20px",
                            height: "600px",
                            width: "100%",
                            border: "2px solid #ccc",
                            borderRadius: "8px",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <iframe
                            src={iframeUrl}
                            title="IP Phone Config"
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                                transform: "scale(1.7)",
                                transformOrigin: "center",
                                position: "absolute",
                                top: 0,
                                right: "-5%",
                            }}
                        />
                    </div>
                )}
            </form>

            <form
                className="history-list"
                style={{ marginLeft: "240px", marginRight: "40px" }}
                onSubmit={HandleLineData}
            >
                <div style={{ maxHeight: "450px", overflowY: "auto", border: "1px solid #ccc" }}>
                    <table
                        className="styled-table2232"
                        style={{
                            marginTop: '-10px',
                            width: "100%",
                            borderCollapse: "collapse",
                            border: "1px solid #ccc"
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{ position: "sticky", top: 0, background: "#4CAF50", zIndex: 1 }}>Key</th>
                                <th style={{ position: "sticky", top: 0, background: "#4CAF50", zIndex: 1 }}>Type</th>
                                <th style={{ position: "sticky", top: 0, background: "#4CAF50", zIndex: 1 }}>Mode</th>
                                <th style={{ position: "sticky", top: 0, background: "#4CAF50", zIndex: 1 }}>Value</th>
                                <th style={{ position: "sticky", top: 0, background: "#4CAF50", zIndex: 1 }}>Label</th>
                                <th style={{ position: "sticky", top: 0, background: "#4CAF50", zIndex: 1 }}>Account</th>
                                <th style={{ position: "sticky", top: 0, background: "#4CAF50", zIndex: 1 }}>Extension</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineData.map((line, i) => (
                                <tr key={i}>
                                    <td >{line.key}</td>
                                    <td >
                                        <select
                                            value={line.type}
                                            onChange={(e) => {
                                                const selectedIndex = e.target.selectedIndex;
                                                handleChange(i, "type", selectedIndex);
                                            }}
                                        >
                                            {blfType.map((typeOption, index) => (
                                                <option key={index} value={index}>
                                                    {typeOption}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td >Default</td>
                                    <td >
                                        <input
                                            type="text"
                                            value={line.value}
                                            onChange={(e) => handleChange(i, "value", e.target.value)}
                                        />
                                    </td>
                                    <td >
                                        <input
                                            type="text"
                                            value={line.label}
                                            onChange={(e) => handleChange(i, "label", e.target.value)}
                                        />
                                    </td>
                                    <td >
                                        <select
                                            value={line.account}
                                            onChange={(e) =>
                                                handleChange(i, "account", parseInt(e.target.value))
                                            }c
                                        >
                                            {[...Array(16).keys()].map((account) => (
                                                <option key={account} value={account + 1}>
                                                    Account {account + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td >
                                        <input
                                            type="text"
                                            value={line.extension}
                                            onChange={(e) => handleChange(i, "extension", e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="twoFileButton flex justify-end items-left gap-4 mt-4" style={{ marginBottom: '40px' }}>
                    <Button
                        type="button"
                        onClick={handleClear}
                        style={{ width: "300px", height: "50px" }}
                    >
                        Clear
                    </Button>
                    <Button
                        type="submit"
                        style={{ width: "300px", height: "50px", marginLeft: '20px', }}
                    >
                        Save
                    </Button>
                </div>
            </form>

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
                        Please wait... while we are fetching device XML.
                    </div>
                </div>
            )}
        </>
    );
}
