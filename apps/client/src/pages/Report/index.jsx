import { Button, List, Skeleton } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

import useRefreshToken from "../../common/refreshToken";

const Report = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState(1);
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://37.61.77.5/accounts/reportsListView/`, {
        params: { page }
      });

      const fetchedData = response.data.results;

      setList(prevList => {
        const uniqueData = fetchedData.filter(
          newItem => !prevList.some(existingItem => existingItem.id === newItem.id)
        );
        return [...prevList, ...uniqueData];
      });

      setPagination(page + 1);
    } catch (error) {
      if (error.response?.status === 403) {
        await refreshAccessToken();
        fetchReports();
      }
    } finally {
      setInitLoading(false);
      setLoading(false);
    }
  };

  const onLoadMore = () => {
    fetchReports(pagination);
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px"
        }}
      >
        <Button onClick={onLoadMore}>Daha Çox Yüklə</Button>
      </div>
    ) : null;

  return (
    <List
      className="demo-loadmore-list"
      loading={initLoading}
      itemLayout="vertical"
      loadMore={loadMore}
      dataSource={list}
      renderItem={item => (
        <List.Item key={item.id}>
          <Skeleton loading={loading} active>
            <List.Item.Meta
              title={`Tapşırıq: ${item.task?.full_name || "Ad bilinmir"}`}
              description={
                <>
                  <p>{item.message || "Mesaj yoxdur"}</p>
                  <p>Tapşırığın növü: {item.task?.task_type || "Bilinmir"}</p>
                </>
              }
            />
            <div>
              <p>Hesabat: {item.report || "Hesabat mövcud deyil"}</p>
            </div>
            <div>
              <p>Status: {item.task?.status || "Bilinmir"}</p>
              <p>
                Tarix: {item.task?.date || "Bilinmir"} {item.task?.start_time && `Saat: ${item.task.start_time}`}
              </p>
            </div>
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default Report;
