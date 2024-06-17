export const dictionary = (word) => {
    const translations = {
        CUSTOMER: 'Khách hàng',
        ADMIN: 'Quản lý',
        EMPLOYEE: 'Nhân viên',
        'Verification code not found or expired': 'Mã xác minh không tồn tại hoặc đã hết hạn',
    };

    return translations[word] || word;
};
