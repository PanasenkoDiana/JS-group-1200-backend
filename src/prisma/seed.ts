import { db } from "./db";

await db.orm.public.Category.create({
    name:"Animal"
})

await db.orm.public.Category.create({
    name:"Fruit"
})

console.log("Categories created")