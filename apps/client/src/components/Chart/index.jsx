import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { FaAngleLeft, FaAngleRight, FaCircle } from "react-icons/fa";
import useRefreshToken from "../../common/refreshToken";

import "./chart.css";

const ApexChart = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const refreshAccessToken = useRefreshToken();
  const [series, setSeries] = useState([
    {
      name: "Qoşulmalar",
      data: Array(12).fill(0)
    },
    {
      name: "Problemlər",
      data: Array(12).fill(0)
    },
    {
      name: "Boş",
      data: Array(12).fill(0)
    }
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
        dataLabels: {
          enable: false
        },
        onColumnHover: {
          highlight: false
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      categories: ["Yan", "Fev", "Mar", "Apr", "May", "İyun", "İyul", "Avq", "Sen", "Okt", "Noy", "Dek"]
    },
    fill: {
      colors: ["#FF5449", "#005ABF", "transparent"]
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " ədəd";
        }
      }
    },
    grid: {
      row: {
        colors: ["#ffffff", "#f3f3f3"],
        opacity: 1
      }
    },
    legend: {
      show: false
    }
  });

  const legendLabels = ["Qoşulmalar", "Problemlər"];



  useEffect(() => {
    fetchData(year);
  }, [year]);

  const fetchData = async (year, isRetry = false) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://37.61.77.5/services/mainpage/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const { completed_tasks } = response.data;

      const connectionCounts = Array(12).fill(0);
      const problemCounts = Array(12).fill(0);

      completed_tasks.forEach(task => {
        const taskDate = new Date(task.date);
        const taskYear = taskDate.getFullYear();
        const taskMonth = taskDate.getMonth();

        if (taskYear === year) {
          if (task.task_type === "connection") {
            connectionCounts[taskMonth]++;
          } else if (task.task_type === "problem") {
            problemCounts[taskMonth]++;
          }
        }
      });

      const filteredConnectionCounts = connectionCounts.map(count => (count > 0 ? count : null));
      const filteredProblemCounts = problemCounts.map(count => (count > 0 ? count : null));

      setSeries([
        {
          name: "Qoşulmalar",
          data: filteredConnectionCounts
        },
        {
          name: "Problemlər",
          data: filteredProblemCounts
        },
        {
          name: "Boş",
          data: Array(12).fill(0)
        }
      ]);
    } catch (error) {
      if (error.status === 403) {
        await refreshAccessToken();
        fetchData(year, true);
      }
    }
  };

  const handleIncrementYear = () => {
    if (year < currentYear) {
      setYear(year + 1);
    }
  };

  const handleDecrementYear = () => {
    if (year > 1970) {
      setYear(year - 1);
    }
  };

  return (
    <div id="chart">
      <div className="year-filter">
        <FaAngleLeft onClick={handleDecrementYear} />
        <span>{year}</span>
        <FaAngleRight onClick={handleIncrementYear} />
      </div>
      <ReactApexChart options={options} series={series} type="bar" height={250} />
      <div className="home-chart-services-chart">
        {legendLabels.map((label, index) => (
          <div key={index}>
            <FaCircle style={{ color: options.fill.colors[index] }} />
            <p>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApexChart;
