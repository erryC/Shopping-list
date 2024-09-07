import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonicModule } from '@ionic/angular';
import { ShoppingList } from '../shared/shopping-list.model';
import { ShoppingListService } from '../shared/shopping-list.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../shared/translation.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.page.html',
  styleUrls: ['./new-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule]
})
export class NewListPage implements OnInit, OnDestroy {
  
  @ViewChild('listName', {static: true}) listName: IonInput;
  shoppingList: ShoppingList = new ShoppingList('', [], 0/*, [new ListCategory('generale', [])]*/);
  form: FormGroup;
  name: string;
  amount: number;
  labelName = '';
  objName = '';
  sub;

  constructor(
    private shoppinglistService: ShoppingListService,
    private trService: TranslationService,
    private router: Router) { }
  ngOnDestroy(): void {
    if(this.sub){this.sub.unsubscribe();}
  }

  ngOnInit(): void {
    this.sub = this.trService.language.subscribe(()=>{
      this.trService.translateValue('name').subscribe(res=>{
        this.labelName = res;
      }).unsubscribe();
      this.trService.translateValue('obj-name').subscribe(res=>{
        this.objName = res;
      }).unsubscribe();
    })
  }

  onAddShoppingList(form: NgForm){
    this.shoppingList.name = this.listName.value.toString();
    this.shoppinglistService.addShoppingList({...this.shoppingList});
    form.reset();
    this.router.navigateByUrl('/tabs/my-lists');
  }

}
