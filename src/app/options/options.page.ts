import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSelect, IonToggle, IonicModule } from '@ionic/angular';
import { OptionsService } from './options.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../shared/translation.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class OptionsPage implements AfterViewInit  {

  @ViewChild('theme',{read: IonToggle}) themeRef;
  @ViewChild('completedToBottom',{read: IonToggle}) completedToBottomRef;
  @ViewChild('doubleClick',{read: IonToggle}) doubleClickRef;
  // @ViewChild('autoDelete',{read: IonToggle}) autoDeleteRef;
  @ViewChild('lang',{read: IonSelect}) langRef;
  // public themeColor = [
  //   { name: 'Default', class: 'default' },
  //   { name: 'Dark', class: 'dark' },
  //   { name: 'Purple', class: 'purple' },
  //   { name: 'Green', class: 'green' }
  // ];
  // public selectTheme;
  
  constructor(public optionsService: OptionsService, private trService: TranslationService) {
    // this.selectTheme = 'light';
    // this.dynamicTheme()
    trService.language.subscribe(lang => {
      this.optionsService.lang = lang;
    }).unsubscribe()
  }
  ngAfterViewInit(): void {
    this.themeRef.checked = this.optionsService.defaultTheme;
    this.completedToBottomRef.checked = this.optionsService.completedItemsToBottom;
    this.doubleClickRef.checked = this.optionsService.doubleClickDelete;
    // this.autoDeleteRef.checked = this.optionsService.autoDeleteCompletedLists;
    this.langRef.value = this.optionsService.lang;
  }
  // dynamicTheme() {
  //   this.theme.activeTheme(this.selectTheme);
  // }


  onChangeTheme(event){
    this.optionsService.changeTheme(event.detail.checked);
  }

  onChangeDoubleClick(event){
    console.log(event.detail.checked)
    if(event.detail.checked){
      this.optionsService.changeDoubleClick(true);
    } else {
      this.optionsService.changeDoubleClick(false);
    }    
  }

  onChangeCompletedToBottom(event){
    this.optionsService.changeCompletedItemsToBottom(event.detail.checked);
  }

  onChangeLang(lang: string){
    this.optionsService.changeLang(lang);
  }
}
