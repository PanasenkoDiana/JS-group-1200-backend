 console.log(1)

// setTimeout() - позволяет сделать задержку в милисекундах
// promise - это обьект ответа, который мы ожидаем получить, у него есть три состояния:
// 1. pending - состояние, которое ожидает результата
// 2. fulfilled - выполнено успешно
// 3. rejected - выполнено неуспешно


function getLaterProducts(){
    // new Promise() - позволяет создать новый обьект promise
    return new Promise((resolve, reject) => {
        // стрелочная функция принимает две функции:
        // 1. resolve - функция, которая возвращает успешный результат, переводит состояние promise в fulfilled
        // 2. reject - функция, которая возвращает неуспешный результат, переводит в rejected
        // setTimeout(() => {
        //     resolve(['alowe','kw'])
        // },2000)
        setTimeout(() => {
            reject('E123qwe 3,141592653')
        }, 500);
    })
}


// getLaterProducts()
// // then - используется для того, что бы обработать успешный результат
//     .then(products => {
//         console.log(products)
//     })
//     // catch - используется для того, что бы обработать ошибки
//     .catch(error => {
//         console.log(error)
//     } )


// const result = getLaterProducts()
// console.log(result)

// setTimeout(() => {
//    console.log(result) 
// }, 3000);

// указываем тип целого числа
let number: number = 10

//указуем тип строки
let name: string = 'gehqr'

// указуем логический тип 
let rain: boolean = false

// называеться type interface
let price = 7183590
price = 'fsdf'

// Указуем тип масиивов строк.
const tags: string[] = [
    'какие теги мы хотим?',
    'теги которые мы хотим'
]
// указываем тип объекта
const product:{
    id: number
    name: string
    price: number
} = {
    id:1,
    name:"лоло",
    price: 123,
}
// Union type -- позволяет указать то, что перемнная может ровнять или одному типу или второму
const color:number|string = "ffd"
// image? -- опциональное поле, говорит то, что его передавать необязательно
interface productPreview{
    title:string
    image?:string
}
const productOne:productPreview = {
    title: 'cat1',
    price: 123
}
// типизация функции
const calculateDiscount = (
    price:number,
    discount: number
):number => {
    return price - price * discount
}