import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, width, height, colors }) => {
	// Lấy ra mảng màu nếu được truyền vào, nếu không mặc định là các màu RGBA
	const backgroundColors = colors || [
		'rgba(255, 99, 132, 0.2)',
		'rgba(54, 162, 235, 0.2)',
		'rgba(255, 206, 86, 0.2)',
		'rgba(75, 192, 192, 0.2)',
	];

	const borderColors = colors || [
		'rgba(255, 99, 132, 1)',
		'rgba(54, 162, 235, 1)',
		'rgba(255, 206, 86, 1)',
		'rgba(75, 192, 192, 1)',
	];

	const chartData = {
		labels: data.map((category) => category.name),
		datasets: [
			{
				label: '# of Products',
				data: data.map((category) => category.productCount),
				backgroundColor: backgroundColors.slice(0, data.length),
				borderColor: borderColors.slice(0, data.length),
				borderWidth: 1,
			},
		],
	};

	const options = {
		// responsive: false, // Disable responsive resizing
		maintainAspectRatio: false, // Disable maintaining aspect ratio
		width: width,
		height: height,
	};

	return <Pie data={chartData} options={options} width={width} height={height} />;
};

PieChart.defaultProps = {
	width: 150, // Set a smaller width here
	height: 150, // Set a smaller height here
};

export default PieChart;
