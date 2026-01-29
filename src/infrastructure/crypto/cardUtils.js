// Utilidades para validación de tarjetas de crédito

export function isValidLuhn(number) {
    const s = String(number).replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    for (let i = s.length - 1; i >= 0; i--) {
        let digit = parseInt(s.charAt(i), 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}

export function isExpiryValid(expiry) {
    // expiry expected MM/YY or MM/YYYY
    if (!expiry || typeof expiry !== 'string') return false;
    const parts = expiry.split('/');
    if (parts.length !== 2) return false;
    const month = parseInt(parts[0], 10);
    let year = parseInt(parts[1], 10);
    if (isNaN(month) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;
    if (year < 100) year += 2000; // YY -> YYYY
    const now = new Date();
    const exp = new Date(year, month, 1);
    // card expiry is usually end of month, so check month+1 > current month
    return exp > now;
}

export function isCvcValid(cvc) {
    return /^\d{3}$/.test(String(cvc));
}
