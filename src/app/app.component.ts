import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from './shared/shopping-list.service';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { OptionsService } from './options/options.service';
import { TranslationService } from './shared/translation.service';
import { take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppComponent implements OnInit {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(
    private shoppingListService: ShoppingListService, 
    private platform: Platform,
    private optionsService: OptionsService,
    private trService: TranslationService,
    /*private translatorService: TranslateService*/) {}

  ngOnInit(): void {
    console.log("LANG DETECTED: ", window.navigator.language);
    // this.translatorService.setDefaultLang(window.navigator.language.slice(0,2));
    // console.log('android', this.platform.is('android'))
    // console.log('desktop', this.platform.is('desktop'))
    // console.log('mobile', this.platform.is('mobile'))
    // console.log('hybrid', this.platform.is('hybrid')) 
    if(this.platform.is('android') && this.platform.is('hybrid')){
      this.AppStateChange();
    }
    else{
      this.WindowStateChange();
    }
    this.shoppingListService.loadLists();
    this.optionsService.loadOptions().subscribe(lang=>{
      console.log('load options lang: ', lang);
      this.trService.getDeviceLanguage(lang);
    })
    
  }

  async AppStateChange(){
    App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) {
        // App went to background
        // Save anything you fear might be lost
        this.shoppingListService.saveLists();
        this.optionsService.saveOptions();
      } else {
        // App went to foreground
        // restart things like sound playing
      }
    });
  }

  async WindowStateChange(){
    window.addEventListener('beforeunload', () => {
      this.shoppingListService.saveLists();
      this.optionsService.saveOptions();
    });
  }

  saveOptions(){

  }
}
