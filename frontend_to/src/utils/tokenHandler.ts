export function getTokenData(token: string): {
  traderName: string;
  traderId: number;
} {
  const tokenData = JSON.parse(atob(token.split('.')[1]));
  return tokenData;
}
