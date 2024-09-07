import { Component, EnvironmentInjector, OnDestroy, ViewChild, inject } from '@angular/core';
import { App } from '@capacitor/app';
import { IonTabs, IonicModule, Platform, ToastController } from '@ionic/angular';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '../shared/translation.service';
import { ShoppingListService } from '../shared/shopping-list.service';
import { OptionsService } from '../options/options.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, TranslateModule],
})
export class TabsPage implements OnDestroy {
  public environmentInjector = inject(EnvironmentInjector);
  timer: any = null;
  lockToastSpam:boolean = false;
  warnMess = '';
  sub;
  @ViewChild(IonTabs, { static: true }) private ionTabs: IonTabs;
  
  constructor(
    private platform: Platform, 
    private toastController: ToastController, 
    private trService: TranslationService,
    private shoppingListService: ShoppingListService,
    private optionsService: OptionsService) {

    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.ionTabs.outlet.canGoBack()) {
        if(this.timer != null){
          this.shoppingListService.saveLists();
          this.optionsService.saveOptions();
          App.exitApp();          
        } else if(!this.lockToastSpam) {
          
          this.presentToast('bottom');
        }
        this.timer = setTimeout(()=>{ this.timer = null; }, 300);
      }
    });
    this.sub = this.trService.language.subscribe(()=>{
      this.trService.translateValue('warn-close-app').subscribe((res: string)=> {
        this.warnMess = res;
      }).unsubscribe();
    })
  }
  ngOnDestroy(): void {
    if(this.sub)
      this.sub.unsubscribe();
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    this.lockToastSpam = true;
    const toast = await this.toastController.create({
      message: this.warnMess,
      duration: 1500,
      position: position
    });

    await toast.present().then(()=>{setTimeout(()=>{this.lockToastSpam = false;}, 1700)});
    
  }
}
