import { Injectable } from '@angular/core';
import { ListCategory, ShoppingList } from './shopping-list.model';
import { Item } from './item.model';
import { BehaviorSubject, map, take, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private _myShoppingList = new BehaviorSubject<ShoppingList[]>([])
  // [
  //   new ShoppingList('mercato',
  //     [
  //       new Item('mela', 3),
  //       new Item('banana', 1),
  //       new Item('pera', 1),
  //       new Item('ananas', 1),
  //     ],
  //     [
  //     new ListCategory(
  //       'generale',[
  //         new Item('mela', 3),
  //         new Item('banana', 1),
  //       ]
  //     ),
  //     new ListCategory(
  //       'pane',[
  //         new Item('infarinato', 3),
  //         new Item('rosetta', 1),
  //       ]
  //     ),
  //     new ListCategory(
  //       'bagno',[
  //         new Item('carta igenica', 3),
  //         new Item('dentifricio', 1),
  //       ]
  //     ),
  //     new ListCategory(
  //       'affetati',[
  //         new Item('salsiccia', 3),
  //         new Item('mortadella', 1),
  //       ]
  //     ),
  //   ]),
  //   new ShoppingList('mercato',
  //     [
  //       new Item('mela', 3),
  //       new Item('banana', 1),
  //       new Item('pera', 1),
  //       new Item('ananas', 1),
  //     ], [])
  // ];

  private _currentId = new BehaviorSubject<number>(null);
  
  currentID = 0;

  constructor() { }

  get currentId() {
    return this._currentId.asObservable();
  }

  get myShoppingLists(){
    return this._myShoppingList.asObservable();
  }

  get shoppingListsLenght(){
    return this._myShoppingList.pipe(take(1), map(list => {return list.length;}))
  }

  getMyShoppingList(index: number){
    return this._myShoppingList.pipe(take(1), map(lists => {
      return lists.slice(index)[0];
    }))
  }

  addShoppingList(newShoppingList: ShoppingList){
    console.log('new shoppinglist', newShoppingList)
    this.myShoppingLists.pipe(take(1)).subscribe(lists => {
      this._myShoppingList.next(lists.concat(newShoppingList));
    }).unsubscribe();
  }

  addItem(listIndex: number, newItem: Item){
    this.myShoppingLists.pipe(take(1)).subscribe(lists => {
      lists[listIndex].items.push(newItem);
      this._myShoppingList.next(lists);
    }).unsubscribe();
  }

  removeItem(listIndex: number, index: number){
    this.myShoppingLists.pipe(take(1)).subscribe(list=>{
      list[listIndex].items.splice(index, 1);
    })    
  }

  deleteShoppingList(index: number){
    this.myShoppingLists.pipe(take(1)).subscribe(lists => {
      lists.splice(index, 1);
      this._myShoppingList.next(lists);
    }).unsubscribe()
  }

  saveLists(){
    this.myShoppingLists.pipe(take(1)).subscribe(lists => {
      Preferences.set({key:'lists', value:JSON.stringify(lists)});
    }).unsubscribe();   

    this._currentId.pipe(take(1)).subscribe(id => {
      if(id != null){
        Preferences.set({key:'currentId', value:id.toString()});
      }
    }).unsubscribe();
  }

  loadLists(){
    // load current list
    Preferences.get({key:'currentId'}).then(result => {
      if(!result){
        console.log('no saves found')
        return null;
      }
      return result.value
    }).then(parsed => {
      if(!parsed)
        return;
      this.currentId.pipe(take(1)).subscribe(() => {
        this._currentId.next(+parsed);
        this.currentID = +parsed;
      }).unsubscribe();
    });
    Preferences.get({key:'lists'}).then(result => {
      if(!result){
        console.log('no saves found')
        return null;
      }
      return JSON.parse(result.value)
    }).then(parsed => {
      if(!parsed)
        return;
      this.myShoppingLists.pipe(take(1)).subscribe(lists => {
        this._myShoppingList.next(lists.concat(parsed));
      }).unsubscribe();
    });

  }

  setCurrentList(index: number){
    console.log('setting', index);
    this._currentId.next(index);
    this.currentID = index;
  }

  unsetList(){
    this._currentId.next(-1);
  }
  
}
