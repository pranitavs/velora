/**
 * Form Validation Utilities for VELORA
 */

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

export function validatePassword(password) {
  const pwd = String(password || '');
  return {
    minLength: pwd.length >= 8,
    hasUppercase: /[A-Z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    isValid: pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)
  };
}

export function validateAmount(amount) {
  const num = Number(amount);
  return !isNaN(num) && num > 0;
}

export function validateRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}
