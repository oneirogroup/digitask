import { List, Pagination, Skeleton } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

import useRefreshToken from "../../common/refreshToken";

import "./report.css";

const Report = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0
  });
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    fetchReports(pagination.current);
  }, []);

  const fetchReports = async page => {
    setLoading(true);
    try {
      const response = await axios.get(`http://37.61.77.5/accounts/reportsListView/`, {
        params: {
          page
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
        fetchReports(page);
      }
    } finally {
      setInitLoading(false);
      setLoading(false);
    }
  };

  const handlePageChange = page => {
    fetchReports(page);
  };

  return (
    <div>
      <List
        className="demo-loadmore-list report-page-list"
        loading={initLoading}
        itemLayout="vertical"
        dataSource={list}
        renderItem={item => (
          <List.Item key={item.id} className="report-page-item">
            <Skeleton loading={loading} active>
              <List.Item.Meta
                title={`Tapşırığın qeydiyyat nömrəsi: ${item.task?.registration_number || "Ad bilinmir"}`}
                description={
                  <div>
                    <p>Hesabat: {item.report || "Hesabat mövcud deyil"}</p>
                    <p>Tapşırığın növü: {item.task?.task_type || "Bilinmir"}</p>
                  </div>
                }
              />
              <div className={"bottomClass"}>
                <p>Status: {item.task?.status || "Bilinmir"}</p>
                <p>
                  Tarix: {item.task?.date || "Bilinmir"} {item.task?.start_time && `Saat: ${item.task.start_time}`}
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
  );
};

export default Report;
