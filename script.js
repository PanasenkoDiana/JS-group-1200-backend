const product =
    {
        id: 1,
        name: "test",
        price: 100,
        category: "test1category"
}

//Диструктуризация - это специальный способ,который 
// позволяет легко расспаковать значение из масивов или объектов
//у объектов значение получаються по названию свойств 
const { id, name, price} = product
console.log(id)
console.log(price)

//у масивов значение получаются по индексу(позиции элемента в масиве)
const numbers = [10, 20, 30]
const [num1, num2] = numbers
console.log(num2)

//length - позволяет получить колличество элементов
console.log(numbers.length) // 3

// filter - фильтрует масив по условию и возвращает новый масив
const result = numbers.filter(number => number > 10)
console.log(result) // 20, 30

// map - создаёт новый масив изменяя каждый элемент по условию 
const result2 = numbers.map(number => number * 2)
console.log(result2)// 20, 40, 60

// forEach - перебирает масив и выполняет действие для каждого элемента
// не создавая новый масив,а изменяя существующий
numbers.forEach(number => {
    console.log(number)
})

// Иммутабельность - это подход при котором мы стараемся 
// не изменять исходные данные, а создавать новые(Например: slice,filter,map)

const sameNubers = numbers

const fruits = ['apple', 'banana', 'plum']
// spread-оператор(...масив который берём за основу, значения которые хотим добавить(...либо масив))
// позволяет создавать новый масив на основе существующего 
const numbersCopy = [...numbers, ...fruits]

console.log(numbers)
console.log(numbersCopy)
// передаём элементы как отдельные аргументы функции
// Math.max - возвращеться максимальное число из масива
console.log(Math.max(...numbers))