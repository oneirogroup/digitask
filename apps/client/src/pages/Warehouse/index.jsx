import { useState } from "react";

import History from "../../components/History";
import Warehouse from "../../components/WarehouseComponent";

import "./warehouse.css";

function index() {
  const [selectedTab, setSelectedTab] = useState(
    sessionStorage.getItem("warehouse") ? sessionStorage.getItem("warehouse") : "anbar"
  );
  const selectTab = ware => {
    setSelectedTab(ware);
    sessionStorage.setItem("warehouse", ware);
  };

  return (
    <div className="warehouse-page">
      <div className="warehousePage-title">
        <p className={selectedTab === "anbar" ? "selected" : ""} onClick={() => selectTab("anbar")}>
          Anbar
        </p>
        <p className={selectedTab === "anbarHistory" ? "selected" : ""} onClick={() => selectTab("anbarHistory")}>
          Anbar tarixçəsi
        </p>
      </div>
      {selectedTab === "anbar" ? <Warehouse /> : null}
      {selectedTab === "anbarHistory" ? <History /> : null}
    </div>
  );
}

export default index;