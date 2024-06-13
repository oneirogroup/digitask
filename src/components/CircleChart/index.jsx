// CircleChart.js

import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from '../../actions/axios';
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
                    height: 250,
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
                            width: 250,
                            height: 100,
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },
            userType: '',
            legendLabels: ['Internet', 'Tv', 'Voice'],
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const response = await axios.get('/services/mainpage/');

            const { user_type, task_details } = response.data;
            let series = [0, 0, 0];
            let legendLabels = ['Internet', 'Tv', 'Voice'];

            if (user_type === 'technician' || user_type === 'plumber') {
                const { problem_count, connection_count } = task_details;
                const total = problem_count + connection_count;
                series = total === 0 ? [0, 0] : [
                    (problem_count / total) * 100,
                    (connection_count / total) * 100,
                ];
                legendLabels = ['Problem', 'Connection'];
            } else {
                const { tv_count, internet_count, voice_count } = task_details;
                const total = tv_count + internet_count + voice_count;
                series = total === 0 ? [0, 0, 0] : [
                    (internet_count / total) * 100,
                    (tv_count / total) * 100,
                    (voice_count / total) * 100
                ];
            }

            this.setState({ series, userType: user_type, legendLabels });
        } catch (error) {
            console.error('Error fetching data:', error);
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else if (error.response && error.response.status === 401) {
                try {
                    await axios.refreshAccessToken();
                    await this.fetchData();
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                }
            } else {
                console.error('Error:', error.message);
            }
        }
    }

    render() {
        const { series, options, legendLabels } = this.state;

        return (
            <div id="circlechart">
                <p>Servislər <IoMdInformationCircle /></p>
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
