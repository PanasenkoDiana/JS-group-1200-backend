import { db } from "./db.js";

// Создаем категории и сохраняем их результаты, чтобы использовать их реальные ID
const electronics = await db.orm.public.Category.create({
    name: "Electronics",
});

const accessories = await db.orm.public.Category.create({
    name: "Accessories",
});

const clothing = await db.orm.public.Category.create({
    name: "Clothing",
});

const home = await db.orm.public.Category.create({
    name: "Home & Kitchen",
});

console.log("Categories created");

// Создаем 10 товаров, привязывая их к категориям через categoryId
await db.orm.public.Product.create({
    name: "Smartphone X",
    price: 699,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    categoryId: electronics.id,
});

await db.orm.public.Product.create({
    name: "Wireless Headphones",
    price: 199,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    categoryId: electronics.id,
});

await db.orm.public.Product.create({
    name: "Smart Watch",
    price: 299,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    categoryId: electronics.id,
});

await db.orm.public.Product.create({
    name: "Leather Wallet",
    price: 49,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
    categoryId: accessories.id,
});

await db.orm.public.Product.create({
    name: "Classic Sunglasses",
    price: 89,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    categoryId: accessories.id,
});

await db.orm.public.Product.create({
    name: "Canvas Backpack",
    price: 75,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    categoryId: accessories.id,
});

await db.orm.public.Product.create({
    name: "Basic Cotton T-Shirt",
    price: 25,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    categoryId: clothing.id,
});

await db.orm.public.Product.create({
    name: "Slim Fit Jeans",
    price: 60,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    categoryId: clothing.id,
});

await db.orm.public.Product.create({
    name: "Automatic Coffee Maker",
    price: 150,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6",
    categoryId: home.id,
});

await db.orm.public.Product.create({
    name: "Kitchen Blender",
    price: 45,
    image: "https://images.unsplash.com/photo-1570222094114-d074f7e1e6e4",
    categoryId: home.id,
});

console.log("Products created successfully");