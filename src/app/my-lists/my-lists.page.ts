import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ShoppingList } from '../shared/shopping-list.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingListService } from '../shared/shopping-list.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Utils } from '../utils/utils';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../shared/translation.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'my-lists.page.html',
  styleUrls: ['my-lists.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, TranslateModule]
})
export class MyListsPage implements OnInit, OnDestroy {

  shoppingLists: ShoppingList[] = [];
  sub: Subscription;
  sub2:Subscription;
  warning= '';
  constructor(
    private listService: ShoppingListService, 
    private router: Router,
    private utils: Utils,
    private trService: TranslationService) {}

  ngOnInit(): void {
    this.sub = this.listService.myShoppingLists.subscribe(list => {
      this.shoppingLists = list;
    });
    this.sub2 = this.trService.language.subscribe(()=>{
      this.trService.translateValue('delete-warning').subscribe(res =>{
        this.warning = res;
      }).unsubscribe();      
    })
  }
  
  onAddList(){
    this.router.navigateByUrl('tabs/my-lists/new');
  }
  
  ngOnDestroy(): void {
    if(this.sub){this.sub.unsubscribe();}
    if(this.sub2){this.sub2.unsubscribe();}
  }

  onDeleteShoppingList(index: number){
    this.utils.presentAlert(this.warning).then(result => {
      if(result.role === 'confirm'){
        this.listService.deleteShoppingList(index);
      }
    });
  }

  onSelectList(index: number){
    this.listService.setCurrentList(index);
    this.router.navigateByUrl('/tabs/shopping-list')
  }

  isCompleted(index: number){
    return this.shoppingLists[index].completed == this.shoppingLists[index].items.length
  }

}
