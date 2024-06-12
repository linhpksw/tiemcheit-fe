export const toNormalText = (str) => {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    str = str.replace(/\s+/g, ''); 
    return str;
}

