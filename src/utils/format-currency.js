export function formatCurrency(amount) {
	if (typeof amount !== 'number') {
		return null;
	}

	return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
