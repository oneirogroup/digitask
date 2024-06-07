import React from 'react';
import ReactApexChart from 'react-apexcharts';
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
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 63, 60, 98]
            }, {
                name: 'Boş',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }, {
                name: 'Problemlər',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 95, 96, 56]
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
