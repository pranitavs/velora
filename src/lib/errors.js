/**
 * Humanized error handling and messaging for VELORA
 */

export function humanizeAuthError(error) {
  if (!error) return '';
  const message = (error.message || '').toLowerCase();

  if (message.includes('invalid login credentials') || message.includes('invalid_grant')) {
    return 'The email or password you entered is incorrect. Please check and try again.';
  }
  if (message.includes('email not confirmed')) {
    return 'Please verify your email address to continue. Check your inbox for the confirmation link.';
  }
  if (message.includes('user already registered') || message.includes('already exists')) {
    return 'An account with this email address already exists. Try signing in instead.';
  }
  if (message.includes('password should be at least')) {
    return 'Password must be at least 8 characters long, containing uppercase and numbers.';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many login attempts. Please wait a moment and try again.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Network connection issue. Please check your internet connection.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}
