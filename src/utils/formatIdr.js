const formatIdr = (amount) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });
    return formatter.format(amount);
};

export default formatIdr;
