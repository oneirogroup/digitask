import { Tabs } from "antd";

import Employees from "./Employees/index.jsx";
import Positions from "./Positions/index.jsx";
import Regions from "./Regions/index.jsx";

import "./employees.css";
import Groups from "./Groups/index.jsx";

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
    },
    {
      key: "groups",
      label: <h2>Qruplar</h2>,
      children: <Groups />
    },
    {
      key: "regions",
      label: <h2>Regionlar</h2>,
      children: <Regions />
    }
  ];

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default EmployeeList;
