export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  console.log(token, 'token');
  return !!token;
}
