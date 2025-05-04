import { Table, Tag, Button } from 'antd';
import { PiTelevisionSimple } from "react-icons/pi";
import { TfiWorld } from "react-icons/tfi";
import { RiVoiceprintFill } from "react-icons/ri";

const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const statusLabel = {
    waiting: 'Gözləyir',
    inprogress: 'Qəbul edilib',
    started: 'Başlanıb',
    completed: 'Tamamlanıb'
};

const TasksTable = ({ tasks }) => {
    const columns = [
        {
            title: 'Ad',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) =>
                record.first_name && record.last_name
                    ? `${record.first_name} ${record.last_name}`
                    : '-',
        },
        {
            title: 'Növ',
            dataIndex: 'type',
            key: 'type',
            render: (_, record) => {
                const types = [];
                if (record.tv) types.push(<PiTelevisionSimple key="tv" />);
                if (record.internet) types.push(<TfiWorld key="internet" />);
                if (record.voice) types.push(<RiVoiceprintFill key="voice" />);
                if (types.length === 0) return 'Xidmət daxil edilməyib';
                return <span style={{ display: 'flex', gap: 8 }}>{types}</span>;
            },
        },
        {
            title: 'Ünvan',
            dataIndex: 'location',
            key: 'location',
            render: (text) => text || '-',
        },
        {
            title: 'Nömrə',
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => text || '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const label = statusLabel[status] || status;
                const className = `status ${status?.toLowerCase().replace(' ', '-')}`;
                return <Button className={className}>{label}</Button>;
            },
        },
    ];

    return (
        <Table
            scroll={{ y: 160 }}
            columns={columns}
            dataSource={tasks?.slice(0, 5).map((item, index) => ({ ...item, key: index })) || []}
            pagination={false}
        />
    );
};

export default TasksTable;
