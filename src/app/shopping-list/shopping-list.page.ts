import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActionSheetController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Subscription, map, switchMap, take, tap } from 'rxjs';
import { CreateListElementComponent } from '../create-list-element/create-list-element.component';
import { Item } from '../shared/item.model';
import { ShoppingList } from '../shared/shopping-list.model';
import { ShoppingListService } from '../shared/shopping-list.service';
import { CommonModule } from '@angular/common';
import { ItemCheckedDirective } from '../utils/item-checked.directive';
import { HighlightDirective } from '../utils/highlight.directive';
import { OptionsService } from '../options/options.service';
import { SortPipe } from "../shared/pipes/sort.pipe";
import { Utils } from '../utils/utils';
import { TranslateModule } from "@ngx-translate/core";
import { TranslationService } from '../shared/translation.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'shopping-list.page.html',
  styleUrls: ['shopping-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, ItemCheckedDirective, HighlightDirective, SortPipe, TranslateModule ],
})
export class ShoppingListHome {
  @ViewChild('modal',{static: true}) modal: ModalController
  public lastAdds = [];
  public results = [...this.lastAdds];
  selectedList: number;
  shoppingLists: ShoppingList[] //= [new ShoppingList('test',[], [])]
  sub: Subscription; 
  listId: number
  noListMessage: string = '';
  time: any = null;
  triggerSortPipe: number;
  sortType: string;

  //translations
  appTitle: string = '';
  archiveWarning: string = '';
  cancel: string = '';
  archive: string = '';
  deleteWarning: string = '';
  delete: string = '';
  rename: string = '';
  chooseAction: string = '';
  listCompletedMess: string = '';
  createListMess: string = '';
  selectListMess: string = '';
  

  constructor(
    private listService: ShoppingListService,
    private optionsService: OptionsService,
    private modalCtrl: ModalController, 
    private toastController: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private utils: Utils,
    private langService: TranslationService,) { }

  ngOnInit() {
    this.sub = this.listService.currentId.pipe(
      tap(id => {
        this.listId = id;
        console.log('selected index', this.listId)
      }),
      switchMap(() => {
        return this.listService.myShoppingLists
      }),
      map(list => {
        this.shoppingLists = list;
        // console.log('selected list', this.shoppingLists)
      })
    ).subscribe();

    //subscribe translations
    this.langService.language.subscribe(()=>{
      this._initialiseTranslation();
      console.log("refresh lang");
    })
  }

  _initialiseTranslation(): void {
    this.langService.translateValue('app-title').subscribe((res: string) => {
      this.appTitle = res;
    }).unsubscribe();
    this.langService.translateValue('archive-warning').subscribe((res: string) => {
      this.archiveWarning = res;
    }).unsubscribe();
    this.langService.translateValue('archive-warning').subscribe((res: string) => {
      this.archiveWarning = res;
    }).unsubscribe();
    this.langService.translateValue('cancel').subscribe((res: string) => {
      this.cancel = res;
    }).unsubscribe();
    this.langService.translateValue('archive').subscribe((res: string) => {
      this.archive = res;
    }).unsubscribe();
    this.langService.translateValue('delete-warning').subscribe((res: string) => {
      this.deleteWarning = res;
    }).unsubscribe();
    this.langService.translateValue('delete').subscribe((res: string) => {
      this.delete = res;
    }).unsubscribe();
    this.langService.translateValue('rename').subscribe((res: string) => {
      this.rename = res;
    }).unsubscribe();
    this.langService.translateValue('select-action').subscribe((res: string) => {
      this.chooseAction = res;
    }).unsubscribe();
    this.langService.translateValue('list-completed').subscribe((res: string) => {
      this.listCompletedMess = res;
    }).unsubscribe();
    this.langService.translateValue('create-a-list').subscribe((res: string) => {
      this.createListMess = res;
    }).unsubscribe();
    this.langService.translateValue('select-list').subscribe((res: string) => {
      this.selectListMess = res;
    }).unsubscribe();
  }

  ionViewWillEnter(){
    this.setNoListMessage();
    if(this.optionsService.completedItemsToBottom){
      this.sortType = 'asc';
    } else { this.sortType = 'none'; }
  }

  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  onRemoveItem(index: number){
    if(this.optionsService.doubleClickDelete){
      if(this.time != null){
        this.removeItem(index);
      }
    this.time = setTimeout(()=>{ this.time = null;}, 300);
    } else {
      this.removeItem(index);
    }
  }

  removeItem(index: number){
    if(this.shoppingLists[this.listId].items[index].checked){ this.shoppingLists[this.listId].completed--; }
    this.listService.removeItem(this.listId, index);
    this.triggerSortPipeR();
  }
  
  triggerSortPipeR(){
    if(this.optionsService.completedItemsToBottom){
      setTimeout(()=>{this.triggerSortPipe = Math.random(); console.log('triggered')}, 200)
    }
  }
  
  onEnterInput(event: string){
    this.lastAdds.push(event)
    this.results = [...this.lastAdds];
    this.modal.dismiss();
  }

  renameList(newName: string){
    this.shoppingLists[this.listId].name = newName;
  }

  onOpenModal(selectedMode: 'add-item' | 'add-category' | 'rename', categoryIndex?: number, previousName?: string){
    this.modalCtrl.create({
      component: CreateListElementComponent,
      componentProps: { selectedMode: selectedMode, previousName: previousName },
      // initialBreakpoint: 0.40
    }).then(modalEl=>{
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData =>{

      if(resultData.role === 'confirm'){
        if(selectedMode === 'add-item'){
          this.listService.addItem(this.listId, new Item(resultData.data.formData.name, resultData.data.formData.amount, false));
          this.triggerSortPipeR();
        } else if(selectedMode === 'rename'){
          this.renameList(resultData.data.formData.name);
        }
      }        
    });
  }

  setNoListMessage(){
    this.listService.shoppingListsLenght.pipe(take(1)).subscribe(length => {
      if(length > 0){
        this.noListMessage = this.selectListMess;
      }else {
        this.noListMessage = this.createListMess;
      }
    }).unsubscribe();

  }

  onCheckItem(index: number, checked: boolean){
    this.triggerSortPipeR();
    const list = this.shoppingLists[this.listId];
    list.items[index].checked = checked;
    if(checked){ list.completed++; } else { list.completed--; }
    // console.log(checked, this.shoppingLists)
    // if(list.completed == list.items.length){ 
    //   this.listId = -1; 
    //   this.presentToast('middle'); 

    // }
  }

  log(log:any){
    console.log(log)
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {

    const toast = await this.toastController.create({
      message: this.listCompletedMess,
      duration: 1500,
      position: position
    });

    await toast.present();
    
  }

  onListOptions(){
      this.actionSheetCtrl.create({
        header: this.chooseAction,
        cssClass: 'custom-action-sheet',
        buttons: [
          {
            text: this.rename,
            icon: 'create-outline',
            handler: () => {
              this.onOpenModal('rename', 0, this.shoppingLists[this.listId].name)
            }
          },
          {
            text: this.delete,
            icon: 'trash-outline',
            handler: () => {
              this.utils.presentAlert(this.deleteWarning).then(result => {
                if(result.role === 'confirm'){
                  this.listService.deleteShoppingList(this.listId);
                }
              });
            }
          },
          {
            text: this.archive,
            icon: 'file-tray-outline',
            handler: () => {
              this.utils.presentAlert(this.archiveWarning).then(result => {
                if(result.role === 'confirm'){
                  this.archiveList();
                }
              });
            }
          },
          {
            text: this.cancel,
            role: 'destructive'
          },
        ]
      }).then(actionSheetEl =>{
        actionSheetEl.present();
      })
  }  


  archiveList(){
    this.shoppingLists[this.listId].items
    .forEach(element => {
      element.checked = false;
    });
    this.shoppingLists[this.listId].completed = 0;
    this.listService.unsetList();
  }

}
