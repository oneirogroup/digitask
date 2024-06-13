import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import "./chart.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
        throw new Error('No refresh token available');
    }

    const response = await axios.post('http://135.181.42.192/accounts/token/refresh/', { refresh: refresh_token });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
};

class ApexChart extends React.Component {
    constructor(props) {
        super(props);

        const currentYear = new Date().getFullYear();

        this.state = {
            year: currentYear,
            series: [{
                name: 'Qoşulmalar',
                data: Array(12).fill(0)
            }, {
                name: 'Boş',
                data: Array(12).fill(0)
            }, {
                name: 'Problemlər',
                data: Array(12).fill(0)
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '50%',
                        endingShape: 'rounded',
                        dataLabels: {
                            position: 'top'
                        },
                    },
                },
                dataLabels: {
                    enabled: false,
                    offsetY: -10,
                    style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                    }
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                },
                yaxis: {},
                fill: {
                    colors: ["#FF5449", "transparent", "#36C43D"],
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + " ədəd"
                        }
                    }
                },
                grid: {
                    row: {
                        colors: ['#ffffff', '#f3f3f3'],
                        opacity: 1
                    },
                },
                legend: {
                    offsetY: -10,
                    position: 'top',
                    horizontalAlign: 'center',

                    floating: true
                }
            }
        };
    }

    componentDidMount() {
        this.fetchData(this.state.year);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.year !== this.state.year) {
            this.fetchData(this.state.year);
        }
    }

    fetchData = async (year, isRetry = false) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://135.181.42.192/services/mainpage/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const { ongoing_tasks } = response.data;

            const connectionCounts = Array(12).fill(0);
            const problemCounts = Array(12).fill(0);

            ongoing_tasks.forEach(task => {
                const taskDate = new Date(task.date);
                const taskYear = taskDate.getFullYear();
                const taskMonth = taskDate.getMonth();

                if (taskYear === year) {
                    if (task.task_type === 'connection') {
                        connectionCounts[taskMonth]++;
                    } else if (task.task_type === 'problem') {
                        problemCounts[taskMonth]++;
                    }
                }
            });

            this.setState({
                series: [{
                    name: 'Qoşulmalar',
                    data: connectionCounts
                }, {
                    name: 'Boş',
                    data: Array(12).fill(0)
                }, {
                    name: 'Problemlər',
                    data: problemCounts
                }]
            });

        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403) && !isRetry) {
                try {
                    await refreshAccessToken();
                    await this.fetchData(year, true);
                } catch (refreshError) {
                    console.error('Error: Token refresh failed:', refreshError);
                }
            } else {
                console.error('Error: Unable to fetch data:', error);
            }
        }
    }

    handleIncrementYear = () => {
        const { year } = this.state;
        const currentYear = new Date().getFullYear();
        if (year < currentYear) {
            this.setState({ year: year + 1 });
        }
    }

    handleDecrementYear = () => {
        const { year } = this.state;
        if (year > 1970) {
            this.setState({ year: year - 1 });
        }
    }

    render() {
        const { year } = this.state;
        return (
            <div id="chart">
                <div className="year-filter">
                    <FaAngleLeft onClick={this.handleDecrementYear} />
                    <span>{year}</span>
                    <FaAngleRight onClick={this.handleIncrementYear} />
                </div>
                <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={250} />
            </div>
        );
    }
}

export default ApexChart;
