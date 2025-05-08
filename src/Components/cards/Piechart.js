import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ memUsage, title, used, unused }) => {
  const value = parseFloat(memUsage);
  const [color, setColor] = useState("#82ca9d"); 

  useEffect(() => {
    if (value > 85) {
      setColor("#c82333"); 
    } else {
      setColor("#82ca9d"); 
    }
  }, [value]);

  const data = {
    labels: [used, unused],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [color, "#e0e0e0"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // Set to true if you want labels
      },
      tooltip: {
        enabled: true,
      },
    },
    cutout: "70%", // makes it a doughnut
  };

  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h5 style={{ marginBottom: "10px", color: "#fff" }}>{title}</h5>
      <div style={{ position: "relative", width: "200px", height: "200px" }}>
        <Pie data={data} options={options} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            color: color,
          }}
        >
          {value.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;
