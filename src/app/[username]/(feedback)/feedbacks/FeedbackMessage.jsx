const FeedbackMessage = ({ msg }) => {
	return (
		<div className="rounded-lg border border-default-200">
			<div className="border-b border-default-200 px-4 py-2">
				<h4 className="text-lg font-medium text-default-800">Nội dung</h4>
			</div>
			<div className="px-4">
				<div className="flex justify-between border-b border-default-200 py-2">
					<h4 className="text-md font-medium text-default-800">{msg}</h4>
				</div>
			</div>
		</div>
	);
};

export default FeedbackMessage;
