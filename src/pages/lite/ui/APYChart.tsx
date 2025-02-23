import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface APYChartProps {
    yearlyAPY: number; 
}

export const APYChart: React.FC<APYChartProps> = ({ yearlyAPY }) => {
    const calculateMonthlyAPY = (yearlyAPY: number): number[] => {
        return Array(12).fill(0).map((_, index) => {
            const x = index;
            const smoothValue = yearlyAPY * (1 - Math.cos(x * Math.PI / 24)) / 2;
            return Number(smoothValue.toFixed(2));
        });
    };

    const monthlyValues = calculateMonthlyAPY(yearlyAPY);

    const categories = () => {
        const months = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];
        const currentMonth = new Date().getMonth(); // 0-11
        const reorderedMonths = [
            ...months.slice(currentMonth),
            ...months.slice(0, currentMonth)
        ];
        return reorderedMonths;
    }

    const options = {
        chart: {
            type: 'spline',
            backgroundColor: '#000000',
        },
        title: {
            text: 'Monthly APY Profit',
            style: {
                color: '#FFFFFF'
            }
        },
        xAxis: {
            categories: categories(),
            labels: {
                style: {
                    color: '#FFFFFF'
                }
            }
        },
        yAxis: {
            title: {
                text: 'APY (%)',
                style: {
                    color: '#FFFFFF'
                }
            },
            labels: {
                style: {
                    color: '#FFFFFF'
                }
            }
        },
        series: [{
            name: 'APY',
            data: monthlyValues,
            color: '#FFFFFF'
        }],
        legend: {
            itemStyle: {
                color: '#FFFFFF'
            }
        }
    };

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};
