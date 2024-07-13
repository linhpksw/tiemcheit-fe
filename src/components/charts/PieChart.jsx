// components/charts/CategoryPieChart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, width, height }) => {
	const chartData = {
		labels: data.map((category) => category.name),
		datasets: [
			{
				label: '# of Products',
				data: data.map((category) => category.productCount),
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
				],
				borderWidth: 1,
			},
		],
	};

	return <Pie data={chartData} width={width} height={height} />;
};

PieChart.defaultProps = {
	width: 50,
	height: 50,
};

export default PieChart;
