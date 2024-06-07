export const dictionary = (role) => {
    const translations = {
        CUSTOMER: 'Khách hàng',
        ADMIN: 'Quản lý',
        EMPLOYEE: 'Nhân viên',
    };

    return translations[role] || 'Không dịch được';
};
