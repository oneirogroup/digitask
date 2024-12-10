import React, { useEffect, useState } from "react";

import { Venn } from "@ant-design/plots";

import "./reportChart.css";

const DemoVenn = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://135.181.42.192/services/api/task-report/");
        const apiData = await response.json();

        const tv = apiData.tv_tasks.total;
        const internet = apiData.internet_tasks.total;
        const voice = apiData.voice_tasks.total;

        const tvAndInternet = apiData.tv_and_internet.total;
        const tvAndVoice = apiData.tv_and_voice.total;
        const internetAndVoice = apiData.internet_and_voice.total;

        const total = Math.min(tvAndInternet, tvAndVoice, internetAndVoice);

        const transformedData = [
          { sets: ["Tv"], size: tv - tvAndInternet - tvAndVoice + total, label: "Tv" },
          { sets: ["Internet"], size: internet - tvAndInternet - internetAndVoice + total, label: "Internet" },
          { sets: ["Voice"], size: voice - tvAndVoice - internetAndVoice + total, label: "Səs" },
          { sets: ["Tv", "Internet"], size: tvAndInternet - total, label: "Tv & Internet" },
          { sets: ["Tv", "Voice"], size: tvAndVoice - total, label: "Tv & Səs" },
          { sets: ["Internet", "Voice"], size: internetAndVoice - total, label: "Internet & Səs" },
          { sets: ["Tv", "Internet", "Voice"], size: total, label: "Tv & Internet & Səs" }
        ];

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getColor = datum => {
    switch (datum.label) {
      case "Tv":
        return "rgb(255, 0, 0)";
      case "Internet":
        return "rgb(0, 0, 255)";
      case "Səs":
        return "rgb(44, 160, 44)";
      case "Tv & Internet":
        return "rgb(204, 102, 51)";
      case "Tv & Voice":
        return "rgb(115, 87, 153)";
      case "Internet & Voice":
        return "rgb(167, 98, 55)";
      case "Tv & Internet & Voice":
        return "rgb(221, 119, 177)";
      default:
        return "rgb(204, 204, 204)";
    }
  };

  const config = {
    data: data,
    setsField: "sets",
    sizeField: "size",
    label: {
      position: "inside",
      text: d => {
        return d.label || (d.sets.length > 1 ? `${d.sets.join(" & ")}` : d.sets[0]);
      }
    },
    tooltip: {
      title: false,
      items: [
        d => {
          return { name: d.sets.join(", "), value: d.size };
        }
      ]
    },
    style: {
      fillOpacity: 0.85,
      fill: getColor
    }
  };

  return (
    <div className="report-chart-color">
      <Venn {...config} />
    </div>
  );
};

export default DemoVenn;
