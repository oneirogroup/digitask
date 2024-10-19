import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import "./circlechart.css";
import { IoMdInformationCircle } from "react-icons/io";
import { FaCircle } from "react-icons/fa";

class CircleChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [0, 0, 0],
            options: {
                chart: {
                    type: 'donut',
                    height: 300,
                    events: {
                        // Handle the click event at the chart level
                        dataPointSelection: (event, chartContext, { dataPointIndex }) => {
                            this.handleSegmentClick(dataPointIndex);
                        }
                    }
                },
                plotOptions: {
                    pie: {
                        startAngle: -90,
                        endAngle: 90,
                        offsetY: 20,
                    }
                },
                fill: {
                    colors: ['#005ABF', '#FFD600', '#FF5449'],
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: '100%',
                            height: 300,
                        },
                        legend: {
                            position: 'bottom',
                            offsetY: 0,
                        },
                    }
                }],
                tooltip: {
                    enabled: true,
                    y: {
                        formatter: function (val) {
                            return val.toFixed(0) + '%';
                        }
                    }
                }
            },
            userType: '',
            isAdmin: false,
            legendLabels: ['İnternet', 'TV', 'Səs'],
            expandedSegment: null, // New state variable
        };
    }

    componentDidMount() {
        this.fetchData();
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleSegmentClick = (index) => {
        this.setState((prevState) => ({
            expandedSegment: prevState.expandedSegment === index ? null : index,
        }));
    };

    handleClickOutside = (event) => {
        const chartContainer = document.getElementById('circlechart');
        if (chartContainer && !chartContainer.contains(event.target)) {
            this.setState({ expandedSegment: null });
        }
    };

    fetchData = async (isRetry = false) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://135.181.42.192/services/mainpage/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const { user_type, is_admin, task_details } = response.data;
            let series = [0, 0, 0];
            let legendLabels = ['İnternet', 'TV', 'Səs'];

            if (user_type === 'Texnik' || user_type === 'Plumber') {
                const { problem_count, connection_count } = task_details;
                const total = problem_count + connection_count;
                series = total === 0 ? [0, 0] : [
                    Math.round((problem_count / total) * 100),
                    Math.round((connection_count / total) * 100),
                ];
                legendLabels = ['Problem', 'Qoşulma'];
            } else if (is_admin) {
                const { tv_count, internet_count, voice_count } = task_details;
                const total = tv_count + internet_count + voice_count;
                series = total === 0 ? [0, 0, 0] : [
                    Math.round((internet_count / total) * 100),
                    Math.round((tv_count / total) * 100),
                    Math.round((voice_count / total) * 100)
                ];
            } else {
                const { tv_count, internet_count, voice_count } = task_details;
                const total = tv_count + internet_count + voice_count;
                series = total === 0 ? [0, 0, 0] : [
                    Math.round((internet_count / total) * 100),
                    Math.round((tv_count / total) * 100),
                    Math.round((voice_count / total) * 100)
                ];
            }

            this.setState({ series, userType: user_type, isAdmin: is_admin, legendLabels });

        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403) && !isRetry) {
                try {
                    await this.fetchData(true);
                } catch (refreshError) {
                    console.error('Error: Token refresh failed:', refreshError);
                }
            } else {
                console.error('Error: Unable to fetch data:', error);
            }
        }
    }

    render() {
        const { series, options, legendLabels, expandedSegment } = this.state;

        return (
            <div id="circlechart">
                <p>Xidmətlər <IoMdInformationCircle /></p>
                <hr />
                <ReactApexChart options={options} series={series} type="donut" height={250} />
                <div className='home-chart-services'>
                    {legendLabels.map((label, index) => (
                        <div key={index}>
                            <FaCircle style={{ color: options.fill.colors[index] }} />
                            <p>{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default CircleChart;
