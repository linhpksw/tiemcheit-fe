const generateVietQR = async (accountNo, accountName, acqId, amount, addInfo, format, template) => {
	try {
		const response = await fetch('https://api.vietqr.io/v2/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-id': '36cb01ee-882d-469f-b1ea-237def4180d0',
				'x-api-key': 'd989661c-a00f-4408-bfd6-e4d508db41b0',
			},
			body: JSON.stringify({
				accountNo,
				accountName,
				acqId,
				amount,
				addInfo,
				format,
				template,
			}),
		});

		const data = await response.json();
		if (response.ok) {
			return data;
		} else {
			throw new Error(data.desc || 'Failed to generate VietQR');
		}
	} catch (error) {
		console.error('Error generating VietQR:', error);
		throw error;
	}
};

export default generateVietQR;
