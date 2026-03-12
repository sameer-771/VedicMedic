export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vedicmedic_token');
}

export function getUser(): any | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('vedicmedic_user');
  return user ? JSON.parse(user) : null;
}

export function setAuth(token: string, user: any) {
  localStorage.setItem('vedicmedic_token', token);
  localStorage.setItem('vedicmedic_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('vedicmedic_token');
  localStorage.removeItem('vedicmedic_user');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
