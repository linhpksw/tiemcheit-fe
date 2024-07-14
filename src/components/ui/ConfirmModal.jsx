import React from 'react';

const ConfirmModal = ({ show, handleClose, onConfirm, confirmationText }) => {
	if (!show) return null;

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-white p-6 rounded shadow-lg w-96'>
				<h1 className='text-xl mb-4'>{confirmationText}</h1>
				<div className='flex justify-end space-x-4'>
					<button
						type='button'
						onClick={handleClose}
						className='cursor-pointer transition-colors hover:text-white hover:bg-gray-500 rounded px-5 py-2 text-sm font-medium text-gray-500 border border-gray-500'>
						Cancel
					</button>
					<button
						type='button'
						onClick={onConfirm}
						className='cursor-pointer transition-colors hover:text-white hover:bg-green-500 rounded px-6 py-2 text-sm font-medium text-green-500 border border-green-500'>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
