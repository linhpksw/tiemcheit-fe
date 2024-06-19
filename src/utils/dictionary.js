export const dictionary = (word) => {
    const translations = {
        CUSTOMER: 'Khách hàng',
        ADMIN: 'Quản lý',
        EMPLOYEE: 'Nhân viên',
        'Verification code not found or expired': 'Mã xác minh không tồn tại hoặc đã hết hạn',
        'Password is not correct': 'Mật khẩu không chính xác',
        'User not found': 'Tài khoản không tồn tại',
        Unauthorized: 'Không có quyền truy cập',
    };

    return translations[word] || word;
};
