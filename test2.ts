import { createRepository } from "*"

export function createServise(repository: createRepository){
    return{
        getProducts(take? : number){
            return repository.getAll(take)
        }
    }
}