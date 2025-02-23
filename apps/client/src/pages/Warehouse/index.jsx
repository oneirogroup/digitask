import { useState } from "react";

import History from "../../components/History";
import Warehouse from "../../components/WarehouseComponent";
import Warehouses from "./Warehouses"
import "./warehouse.css";

function index() {
  const [selectedTab, setSelectedTab] = useState("item");
  const selectTab = ware => {
    setSelectedTab(ware);
  };


  return (
    <div className="warehouse-page">
      <div className="warehousePage-title">
        <p className={selectedTab === "item" ? "selected" : ""} onClick={() => selectTab("item")}>
          Məhsullar
        </p>
        <p className={selectedTab === "storage" ? "selected" : ""} onClick={() => selectTab("storage")}>
          Anbarlar
        </p>
        <p className={selectedTab === "history" ? "selected" : ""} onClick={() => selectTab("history")}>
          Anbar tarixçəsi
        </p>
      </div>
      {selectedTab === "item" ? <Warehouse /> : null}
      {selectedTab === "history" ? <History /> : null}
      {selectedTab === "storage" ? <Warehouses /> : null}
    </div>
  );
}

export default index;