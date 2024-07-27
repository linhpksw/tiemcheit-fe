// Modal.js
import React from "react";

const IngredientListModal = ({ show, handleClose, ingredients }) => {
	if (!show) return null;
	console.log(ingredients);

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white p-6 rounded shadow-lg w-96">
				<h2 className="text-xl mb-4">Danh sách Nguyên Liệu</h2>
				<ul>
					{ingredients.map((ingredient) => (
						<li key={ingredient.id} className="mb-2">
							{ingredient.ingredient.name} - {ingredient.unit} UIC
						</li>
					))}
				</ul>
				<div className="flex justify-end space-x-4">
					<button
						onClick={handleClose}
						className="px-4 py-2 bg-gray-300 rounded"
					>
						Thoát
					</button>
				</div>
			</div>
		</div>
	);
};

export default IngredientListModal;
