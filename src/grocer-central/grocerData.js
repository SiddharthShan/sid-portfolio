// src/grocer-central/grocerData.js

export const PRODUCTS = [
  { id: 1, name: "Oat Milk 1L", price: 120, stock: 2, category: "Dairy-free", emoji: "🥛" },
  { id: 2, name: "Whole Wheat Bread", price: 55, stock: 10, category: "Bakery", emoji: "🍞" },
  { id: 3, name: "Farm Fresh Eggs (6)", price: 90, stock: 8, category: "Dairy", emoji: "🥚" },
  { id: 4, name: "Bananas (1 dozen)", price: 60, stock: 12, category: "Fruits", emoji: "🍌" },
  { id: 5, name: "Greek Yogurt", price: 85, stock: 6, category: "Dairy", emoji: "🥣" },
  { id: 6, name: "Peanut Butter", price: 160, stock: 5, category: "Pantry", emoji: "🥜" },
  { id: 7, name: "Rolled Oats", price: 110, stock: 7, category: "Pantry", emoji: "🌾" },
  { id: 8, name: "Fresh Spinach", price: 40, stock: 9, category: "Vegetables", emoji: "🥬" },
];

export const INITIAL_CART = [
  { productId: 1, quantity: 2 },
  { productId: 4, quantity: 1 },
  { productId: 3, quantity: 1 },
];

export const PROMOS = {
  FRESH10: { discount: 10, expired: false },
  OLD5: { discount: 5, expired: true },
};

export const DELIVERY_SLOTS = [
  { day: 1, label: "Tomorrow", slots: ["9 AM – 12 PM", "2 PM – 5 PM"] },
  { day: 2, label: "Day after tomorrow", slots: ["9 AM – 12 PM", "6 PM – 9 PM"] },
  { day: 3, label: "In three days", slots: ["2 PM – 5 PM", "6 PM – 9 PM"] },
];

export function getDeliveryDates() {
  return DELIVERY_SLOTS.map((item) => {
    const date = new Date();
    date.setDate(date.getDate() + item.day);

    const value = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    return { ...item, value };
  });
}

export const BUGS = [
  {
    id: 1,
    title: "Search is case-sensitive",
    area: "Search",
    reproduction: "Search for OAT MILK in uppercase, then search for oat milk in lowercase.",
    expected: "Search should return matching products regardless of letter case.",
    actual: "Uppercase OAT MILK returns no results, while lowercase oat milk works.",
    impact: "Customers may believe products are unavailable.",
    priority: "P2",
  },
  {
    id: 2,
    title: "Clearing search does not restore products",
    area: "Search",
    reproduction: "Search for a product, then clear the search field.",
    expected: "The complete product catalogue should return.",
    actual: "The search text clears, but the filtered product list remains.",
    impact: "Customers cannot easily return to browsing the full catalogue.",
    priority: "P2",
  },
  {
    id: 3,
    title: "Customer can exceed available stock",
    area: "Stock",
    reproduction: "Add Oat Milk to the initial basket, which already contains two units.",
    expected: "The app should prevent ordering more than the available stock of two.",
    actual: "A third unit can be added.",
    impact: "The store may accept orders it cannot fulfil.",
    priority: "P1",
  },
  {
    id: 4,
    title: "Order total does not recalculate",
    area: "Cart",
    reproduction: "Change the quantity of an item in the cart.",
    expected: "The line subtotal and order total should update together.",
    actual: "The line subtotal changes, but the order total remains unchanged.",
    impact: "Customers may be shown an incorrect payable amount.",
    priority: "P1",
  },
  {
    id: 5,
    title: "Cart badge is not updated after removal",
    area: "Cart",
    reproduction: "Remove an item from the cart and check the cart badge.",
    expected: "The badge should reflect the current cart quantity.",
    actual: "The cart updates, but the badge retains its previous count.",
    impact: "Customers see misleading cart information.",
    priority: "P2",
  },
  {
    id: 6,
    title: "Valid promo code does not apply discount",
    area: "Promotions",
    reproduction: "Apply the valid promo code FRESH10.",
    expected: "A 10% discount should be deducted from eligible item subtotal.",
    actual: "The app confirms the code was applied but does not reduce the total.",
    impact: "Customers are charged more than the advertised promotional price.",
    priority: "P1",
  },
  {
    id: 7,
    title: "Expired promo code is accepted",
    area: "Promotions",
    reproduction: "Apply the expired promo code OLD5.",
    expected: "The app should reject the expired code with a clear message.",
    actual: "The app accepts the expired code.",
    impact: "Expired campaigns may be incorrectly honoured.",
    priority: "P1",
  },
  {
    id: 8,
    title: "Past delivery dates are selectable",
    area: "Delivery",
    reproduction: "Open the delivery date picker and select a date in the past.",
    expected: "Past dates should be unavailable.",
    actual: "A past date can be selected.",
    impact: "Orders may be scheduled for impossible delivery dates.",
    priority: "P2",
  },
  {
    id: 9,
    title: "Unavailable delivery slot remains selected",
    area: "Delivery",
    reproduction: "Select Tomorrow, choose 2 PM – 5 PM, then change the date to Day after tomorrow.",
    expected: "The selected slot should clear if it is unavailable on the new date.",
    actual: "The old 2 PM – 5 PM slot remains selected.",
    impact: "Orders may contain an invalid delivery schedule.",
    priority: "P2",
  },
  {
    id: 10,
    title: "Invalid phone number is accepted",
    area: "Contact details",
    reproduction: "Enter a six-digit phone number such as 987654.",
    expected: "The app should require a ten-digit phone number.",
    actual: "The six-digit number is accepted.",
    impact: "Delivery teams may be unable to contact customers.",
    priority: "P1",
  },
  {
    id: 11,
    title: "Declined payment still creates an order",
    area: "Payment",
    reproduction: "Select TEST-DECLINE and place the order.",
    expected: "A declined payment must not create a successful order.",
    actual: "The app displays an order confirmation.",
    impact: "Orders may be confirmed without successful payment.",
    priority: "P1",
  },
  {
    id: 12,
    title: "Duplicate order submission",
    area: "Order submission",
    reproduction: "Rapidly click Place order twice using TEST-APPROVE.",
    expected: "Only one order should be created for a single checkout.",
    actual: "Multiple order confirmations can be created.",
    impact: "Customers may receive duplicate orders and charges.",
    priority: "P1",
  },
];

export const CATEGORIES = [
  "All",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Dairy-free",
  "Bakery",
  "Pantry",
];

export const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);