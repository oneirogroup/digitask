import { Tabs } from "antd";

import Employees from "./Employees/index.jsx";
import Positions from "./Positions/index.jsx";

import "./employees.css";

const EmployeeList = () => {
  const onChange = key => {
    console.log(key);
  };

  const items = [
    {
      key: "employees",
      label: <h2>İşçilər</h2>,
      children: <Employees />
    },
    {
      key: "positions",
      label: <h2>Vəzifələr</h2>,
      children: <Positions />
    }
  ];

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default EmployeeList;
