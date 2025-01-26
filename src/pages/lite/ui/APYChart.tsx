import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface APYChartProps {
    yearlyAPY: number; // Годовой APY в процентах
}

export const APYChart: React.FC<APYChartProps> = ({ yearlyAPY }) => {
    // Функция для расчета месячного APY
    const calculateMonthlyAPY = (yearlyAPY: number): number[] => {
        const monthlyRate = Math.pow(1 + yearlyAPY / 100, 1/12) - 1;
        return Array(12).fill(0).map((_, index) => {
            // Add random variation between -0.5% and +0.5%
            const randomVariation = (Math.random() - 0.5) * 1;
            // Calculate accumulated APY for each month with variation
            const baseAPY = ((Math.pow(1 + monthlyRate, index + 1) - 1) * 100);
            return Number((baseAPY + randomVariation).toFixed(2));
        });
    };

    const monthlyValues = calculateMonthlyAPY(yearlyAPY);

    const options = {
        chart: {
            type: 'line',
            backgroundColor: '#000000',
        },
        title: {
            text: 'Monthly APY Profit',
            style: {
                color: '#FFFFFF'
            }
        },
        xAxis: {
            categories: [
                'January', 'February', 'March', 'April', 
                'May', 'June', 'July', 'August', 
                'September', 'October', 'November', 'December'
            ],
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
