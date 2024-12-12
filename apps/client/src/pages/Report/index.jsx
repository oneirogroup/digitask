import { DatePicker, List, Pagination, Skeleton, Space, Tabs } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

import useRefreshToken from "../../common/refreshToken";
import ReportChart from "../../components/ReportChart";
import DetailsModal from "../../components/TaskType";

import "./report.css";

const TASK_TYPES = [
  { value: "connection", label: "Qoşulma" },
  { value: "problem", label: "Problem" }
];

const STATUS_OPTIONS = [
  { value: "waiting", label: "Gözləyir" },
  { value: "inprogress", label: "Qəbul edilib" },
  { value: "started", label: "Başlanıb" },
  { value: "completed", label: "Tamamlandı" }
];

const Report = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0
  });
  const [filter, setFilter] = useState({ month: null });
  const [activeTab, setActiveTab] = useState("table"); // state to track active tab
  const refreshAccessToken = useRefreshToken();
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    fetchReports(pagination.current, filter);
  }, [filter]);

  const fetchReports = async (page, filterParams) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://135.181.42.192/accounts/reportsListView/`, {
        params: {
          page,
          ...(filterParams.year && { year: filterParams.year }),
          ...(filterParams.month && { month: filterParams.month })
        }
      });
      const fetchedData = response.data.results;
      setList(fetchedData);
      setPagination({
        current: page,
        total: response.data.count
      });
    } catch (error) {
      if (error.response?.status === 403) {
        await refreshAccessToken();
        fetchReports(page, filterParams);
      }
    } finally {
      setInitLoading(false);
      setLoading(false);
    }
  };

  const handlePageChange = page => {
    fetchReports(page, filter);
  };

  const handleDateFilterChange = date => {
    if (date) {
      const year = date.year();
      const month = date.month() + 1;
      setFilter(prev => ({
        ...prev,
        year,
        month
      }));
    } else {
      setFilter(prev => ({ ...prev, year: null, month: null }));
    }
  };

  const openTaskDetailsModal = taskId => {
    setSelectedTaskId(taskId);
    setIsTaskDetailsModalOpen(true);
  };

  const closeTaskDetailsModal = () => {
    setIsTaskDetailsModalOpen(false);
    setSelectedTaskId(null);
  };

  const getTranslatedLabel = (options, value) => {
    const found = options.find(option => option.value === value);
    return found ? found.label : "Məlumat daxil edilməyib";
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getServiceName = task => {
    if (task.is_tv) return "Tv";
    if (task.is_internet) return "İnternet";
    if (task.is_voice) return "Səs";
    return "Xidmət mövcud deyil";
  };

  const onTabChange = key => {
    setActiveTab(key); // change active tab
  };

  const items = [
    {
      key: "table",
      label: "Hesabat Cədvəli",
      children: (
        <div>
          <Space direction="vertical" size={12} className="report-date-filter">
            <DatePicker picker="month" onChange={handleDateFilterChange} placeholder="Tarix seçin" />
          </Space>
          <List
            className="demo-loadmore-list report-page-list"
            loading={initLoading}
            itemLayout="vertical"
            dataSource={list}
            renderItem={item => (
              <List.Item key={item.id} className="report-page-item" onClick={() => openTaskDetailsModal(item.id)}>
                <Skeleton loading={loading} active>
                  <List.Item.Meta
                    title={`Tapşırığın qeydiyyat nömrəsi: ${item.task?.registration_number || "Ad Məlumat daxil edilməyib"}`}
                    description={
                      <div>
                        <p>Hesabat: {item.report || "Hesabat mövcud deyil"}</p>
                        <p>Tapşırığın növü: {getTranslatedLabel(TASK_TYPES, item.task?.task_type)}</p>
                        <p>Xidmət növü: {getServiceName(item.task)}</p>
                      </div>
                    }
                  />
                  <div className={"bottomClass"}>
                    <p>Status: {getTranslatedLabel(STATUS_OPTIONS, item.task?.status)}</p>
                    <p>
                      Tarix: {item.task?.date ? formatDate(item.task.date) : "Məlumat daxil edilməyib"}{" "}
                      {item.task?.start_time && `Saat: ${item.task.start_time}`}
                    </p>
                  </div>
                </Skeleton>
              </List.Item>
            )}
          />
          <Pagination
            current={pagination.current}
            total={pagination.total}
            onChange={handlePageChange}
            style={{ textAlign: "center", marginTop: "20px" }}
          />
        </div>
      )
    },
    {
      key: "chart",
      label: "Diaqram",
      children: <ReportChart />
    }
  ];

  return (
    <div>
      <div className="performance-page-title">
        <p>Hesabat</p>
      </div>
      <Tabs defaultActiveKey="table" items={items} onChange={onTabChange} />
      {isTaskDetailsModalOpen && <DetailsModal onClose={closeTaskDetailsModal} taskId={selectedTaskId} />}
    </div>
  );
};

export default Report;
