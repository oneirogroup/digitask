import React from 'react';
import ReactApexChart from 'react-apexcharts';
import "./circlechart.css";
import { IoMdInformationCircle } from "react-icons/io";
import { FaCircle } from "react-icons/fa";
import { MdPadding } from 'react-icons/md';

class CircleChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [50, 25, 25],
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
        };
    }

    render() {
        return (
            <div id="circlechart">
                <p>Servislər <IoMdInformationCircle /></p>
                <hr />
                <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={250} />
                <div className='home-chart-services'>
                    <div>
                        <FaCircle style={{ color: '#005ABF' }} />
                        <p>Internet</p>
                    </div>
                    <div>
                        <FaCircle style={{ color: '#FFD600' }} />
                        <p>Tv</p>
                    </div>
                    <div>
                        <FaCircle style={{ color: '#FF5449' }} />
                        <p>Voice</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default CircleChart;