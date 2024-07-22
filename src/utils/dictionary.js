export const dictionary = (word) => {
	const translations = {
		CUSTOMER: 'Khách hàng',
		ADMIN: 'Quản lý',
		EMPLOYEE: 'Nhân viên',
		'Verification code not found or expired': 'Mã xác minh không tồn tại hoặc đã hết hạn',
		'Password is not correct': 'Mật khẩu không chính xác',
		'User not found': 'Tài khoản không tồn tại',
		Unauthorized: 'Không có quyền truy cập',
		'User already exists with this username': 'Tên tài khoản đã tồn tại',
		'User already exists with this email': 'Email đã tồn tại',
		'User already exists with this phone': 'Số điện thoại đã tồn tại',
		"This account doesn't register password. Please login using Google and update your password in Profile page":
			'Tài khoản này chưa đăng ký mật khẩu. Vui lòng đăng nhập bằng Google và tạo mật khẩu mới trong trang Thông tin',
		'This account has been banned': 'Tài khoản này đã bị khóa',
		'This account has been deleted': 'Tài khoản này đã bị xóa',
		'Order Received': 'Nhận đơn',
		'Order Canceled': 'Hủy đơn',
		Processing: 'Xử lý',
		'Out for Delivery': 'Đang vận chuyển',
		Delivered: 'Đã giao',
		'Order Confirmed': 'Đã nhận hàng',
		'Coupon code must be unique': 'Mã code đã tồn tại',
		'Coupon not found': 'Mã giảm giá không tồn tại',
		'Coupon is not valid anymore': 'Mã giảm giá không còn giá trị sử dụng',
		"You have access the user's limit uses": 'Bạn đã đạt giới hạn sử dụng',
	};

	return translations[word] || word;
};

export const toEnglish = (word) => {
	const translations = {
		'tăng dần': 'asc',
		'giảm dần': 'desc',
		'tất cả': 'all',
		'Nhận đơn': 'Order Received',
		'Hủy đơn': 'Order Cancelled',
		'Xử lý': 'Processing',
		'Đang vận chuyển': 'Out for Delivery',
		'Đã giao': 'Delivered',
		'Đã nhận hàng': 'Order Confirmed',
		khác: 'others',
	};

	return translations[word] || word;
};
