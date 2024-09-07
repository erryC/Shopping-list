import { Item } from "./item.model";

export class ShoppingList{
    constructor(
        public name: string,
        public items: Item[],
        public completed: number,
        // public categories: ListCategory[],
    ){}
}

export class ListCategory{
    constructor(
        public name: string,
        public itemsToBuy: Item[],
    ){}
}