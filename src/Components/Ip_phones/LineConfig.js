import React, { useState, useEffect } from "react";
import Navbar from "../Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOnlinePrediction } from "react-icons/md";

export default function LineConfig() {

    const [isLoading, setIsLoading] = useState(false);
    const [iframeUrl, setIframeUrl] = useState("");
    const [showIframe, setShowIframe] = useState(false);
    const [showIframeData, setShowIframeData] = useState({
        ipAddress: '',
        macAddress: ''
    });
    const [apiData, setApiData] = useState([]);
    const BaseUrlSpring = "192.168.100.190" || "localhost";
    const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";
    const BaseUrlTr069 = "192.168.100.190" || "localhost";
    const PORTTr069 = "3000";
    const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
    const Token = Cookies.get(CookieName);
    const navigate = useNavigate();

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
        const left = window.screen.availWidth ;
        const top = window.screen.availHeight ;

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
                                    <th>BLF config</th>
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
