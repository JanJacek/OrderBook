import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function exportToGoogleSheets() {
  const credentialsPath = path.join(__dirname, '../config/kawaiifood-bc6830fc6fef.json');
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth: client });

  // Pobierz dane z bazy danych
  const restaurants = await prisma.restaurants.findMany();
  const products = await prisma.products.findMany();
  const orders = await prisma.orders.findMany();

  const spreadsheetId = '121NzHSGiY-n2IxWZtH4Xg-JRKIHKpY1m-BU36DXdSeA';

  // Funkcja do formatowania daty
  function formatDate(date: Date): string {
    // Przykładowe formatowanie daty
    return date.toISOString().split('T')[0]; // Zwraca datę w formacie YYYY-MM-DD
  }
// Przygotuj dane do Google Sheets
const restaurantData = restaurants.map(r => [r.id, r.name, r.email]);
const productData = products.map(p => [p.id, p.name, p.img, p.price]);
const orderData = orders.map(o => {
  return [o.id, o.id_set, o.id_restaurant, o.id_product, o.quantity, formatDate(o.date)];
});
// Zapisz dane do Google Sheets
await sheets.spreadsheets.values.update({
  spreadsheetId,
  range: 'Restaurants!A1',
  valueInputOption: 'RAW',
  requestBody: {
    values: [['ID', 'Name', 'Email'], ...restaurantData],
  },
});

await sheets.spreadsheets.values.update({
  spreadsheetId,
  range: 'Products!A1',
  valueInputOption: 'RAW',
  requestBody: {
    values: [['ID', 'Name', 'Image', 'Price'], ...productData],
  },
});

await sheets.spreadsheets.values.update({
  spreadsheetId,
  range: 'Orders!A1',
  valueInputOption: 'RAW',
  requestBody: {
    values: [['ID', 'Set ID', 'Restaurant ID', 'Product ID', 'Quantity', 'Date'], ...orderData],
  },
});

console.log('Dane zostały pomyślnie wyeksportowane do Google Sheets.');
}

exportToGoogleSheets().catch(console.error);

// exportToGoogleSheets() every 5 minutes
setInterval(() => {
  console.log('excel update');
  exportToGoogleSheets().catch(console.error);
}, 300000);

