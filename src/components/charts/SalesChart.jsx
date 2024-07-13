// components/SalesChart.js
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SalesChart = ({ salesData }) => {
	const data = {
		labels: Object.keys(salesData), // Array of months
		datasets: [
			{
				label: 'Products Sold',
				data: Object.values(salesData), // Array of sales numbers
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
				position: 'top',
			},
			tooltip: {
				enabled: true,
			},
		},
		scales: {
			x: {
				beginAtZero: true,
			},
			y: {
				beginAtZero: true,
			},
		},
	};

	return <Bar data={data} options={options} />;
};

export default SalesChart;
