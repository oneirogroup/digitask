// ApexChart.js

import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from '../../actions/axios';
import "./chart.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

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

    fetchData = async (year) => {
        try {
            const response = await axios.get('/services/mainpage/');

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
            console.error('Error fetching data:', error);
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else if (error.response && error.response.status === 401) {
                try {
                    await axios.refreshAccessToken();
                    await this.fetchData(year);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                }
            } else {
                console.error('Error:', error.message);
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
