export function generateAccountNumberBase(sequentialId) {
    const prefix = "180";
    const idStr = String(sequentialId).padStart(6, '0');
    const base = prefix + idStr;
    
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
        sum += parseInt(base[i], 10);
    }
    
    const checkDigit = sum % 10;
    return base + checkDigit;
}

export function isValidAccountNumber(accountNumber) {
    if (!/^180\d{7}$/.test(accountNumber)) {
        return false;
    }

    const base = accountNumber.substring(0, 9);
    const providedCheckDigit = parseInt(accountNumber[9], 10);

    let sum = 0;
    for (let i = 0; i < base.length; i++) {
        sum += parseInt(base[i], 10);
    }
    
    const calculatedCheckDigit = sum % 10;
    return providedCheckDigit === calculatedCheckDigit;
}
