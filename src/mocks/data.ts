import { ORDER_STATUSES, PRODUCT_CATEGORIES } from '../constants/sales';
import type { SalesOrder } from '../types/sales';

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Ishaan', 'Meera', 'Ananya', 'Diya', 'Kavya',
  'Rohan', 'Sara', 'Karthik', 'Priya', 'Arjun', 'Neha', 'Sanjay', 'Divya',
];
const LAST_NAMES = [
  'Sharma', 'Verma', 'Iyer', 'Nair', 'Reddy', 'Gupta', 'Menon', 'Rao',
  'Pillai', 'Chatterjee', 'Kapoor', 'Joshi',
];

const PRODUCTS: Record<string, string[]> = {
  Electronics: ['Wireless Earbuds', '4K Monitor', 'Smart Watch', 'Bluetooth Speaker', 'Laptop Stand'],
  Apparel: ['Cotton T-Shirt', 'Denim Jacket', 'Running Shoes', 'Wool Sweater', 'Formal Shirt'],
  'Home & Kitchen': ['Air Fryer', 'Non-stick Pan Set', 'Coffee Maker', 'Blender', 'Vacuum Cleaner'],
  'Sports & Outdoors': ['Yoga Mat', 'Dumbbell Set', 'Camping Tent', 'Cycling Helmet', 'Water Bottle'],
  Books: ['Fiction Novel', 'Cook Book', 'Self-Help Guide', 'Business Strategy', 'Sci-Fi Anthology'],
  Beauty: ['Face Serum', 'Lip Balm Set', 'Hair Dryer', 'Sunscreen SPF50', 'Perfume'],
  Toys: ['Building Blocks', 'RC Car', 'Puzzle Set', 'Board Game', 'Plush Toy'],
};

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function generateOrders(count: number): SalesOrder[] {
  const rand = seededRandom(42);
  const orders: SalesOrder[] = [];
  const startDate = new Date('2025-01-01').getTime();
  const endDate = new Date('2026-07-29').getTime();

  for (let i = 1; i <= count; i++) {
    const category = PRODUCT_CATEGORIES[Math.floor(rand() * PRODUCT_CATEGORIES.length)];
    const productList = PRODUCTS[category];
    const product = productList[Math.floor(rand() * productList.length)];
    const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const status = ORDER_STATUSES[Math.floor(rand() * ORDER_STATUSES.length)];
    const quantity = Math.floor(rand() * 8) + 1;
    const unitPrice = Math.floor(rand() * 4500) + 500;
    const timestamp = startDate + rand() * (endDate - startDate);

    orders.push({
      orderId: `ORD-${String(i).padStart(5, '0')}`,
      customerName: `${firstName} ${lastName}`,
      productName: product,
      category,
      quantity,
      amount: quantity * unitPrice,
      orderDate: new Date(timestamp).toISOString(),
      status,
    });
  }
  return orders;
}

export const MOCK_ORDERS: SalesOrder[] = generateOrders(537);
