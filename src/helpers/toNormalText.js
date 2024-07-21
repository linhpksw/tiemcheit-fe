export const toNormalText = (str) => {
    if (!str) return '';
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    str = str.replace(/[^a-zA-Z0-9\s]/g, '');
    str = str.replace(/\s+/g, '');
    str = str.toLowerCase();
    return str;
}
