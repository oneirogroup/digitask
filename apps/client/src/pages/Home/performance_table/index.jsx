import { Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRefreshToken from '../../../common/refreshToken';
import axios from 'axios';

const PerformanceTable = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const navigate = useNavigate();
    const refreshAccessToken = useRefreshToken();

    const fetchData = async (isRetry = false) => {
        try {
            const token = localStorage.getItem("access_token");
            const responsePerformance = await axios.get("https://app.desgah.az/services/performance/", {
                headers: { Authorization: `Bearer ${token}` }
            });
            // API-dən gələn məlumatları formatla
            const formattedData = responsePerformance.data.map((item, index) => ({
                key: index,
                name: `${item.first_name} ${item.last_name.charAt(0)}.`,
                group: item.group?.group || '-',
                tasks: item.task_count?.total || 0,
            }));
            setPerformanceData(formattedData);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403) && !isRetry) {
                try {
                    await refreshAccessToken();
                    fetchData(true);
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    navigate("/login");
                }
            } else {
                console.error("Error fetching data:", error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Ad',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Qrup',
            dataIndex: 'group',
            key: 'group',
        },
        {
            title: 'Tapşırıqlar',
            dataIndex: 'tasks',
            key: 'tasks',
            width: 140
        },
    ];

    return <Table scroll={{ y: 160 }} columns={columns} dataSource={performanceData} pagination={false} />;
};

export default PerformanceTable;
