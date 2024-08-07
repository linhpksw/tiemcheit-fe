// Modal.js
import React from "react";

const RestockModal = ({
	show,
	handleClose,
	handleSave,
	quantity,
	setQuantity,
}) => {
	if (!show) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white p-6 rounded shadow-lg w-96">
				<h2 className="text-xl mb-4">Restock Ingredient</h2>
				<input
					type="number"
					value={quantity}
					onChange={(e) => setQuantity(e.target.value)}
					className="w-full p-2 border rounded mb-4"
				/>
				<div className="flex justify-end space-x-4">
					<button
						onClick={handleClose}
						className="px-4 py-2 bg-gray-300 rounded"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="px-4 py-2 bg-blue-500 text-white rounded"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default RestockModal;
