import React from 'react';
import { ModalRoot } from '..';

const SelectModal = ({ show, handleClose, onFirstConfirm, onSecondConfirm, confirmationText }) => {
	if (!show) return null;

	return (
		<ModalRoot>
			<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
				<div className='bg-white p-6 rounded shadow-lg w-96'>
					<h1 className='text-xl mb-4'>{confirmationText}</h1>
					<div className='flex justify-end space-x-4'>
						<button
							type='button'
							onClick={onFirstConfirm}
							className='cursor-pointer transition-colors hover:text-white hover:bg-green-500 rounded px-6 py-2 text-sm font-medium text-green-500 border border-green-500'>
							Activate All
						</button>
						<button
							type='button'
							onClick={onSecondConfirm}
							className='cursor-pointer transition-colors hover:text-white hover:bg-blue-500 rounded px-6 py-2 text-sm font-medium text-blue-500 border border-blue-500'>
							Restore Previous Status
						</button>
						<button
							type='button'
							onClick={handleClose}
							className='cursor-pointer transition-colors hover:text-white hover:bg-gray-500 rounded px-5 py-2 text-sm font-medium text-gray-500 border border-gray-500'>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</ModalRoot>
	);
};

export default SelectModal;
