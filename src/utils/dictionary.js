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
    };

    return translations[word] || word;
};
