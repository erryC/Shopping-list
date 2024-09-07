import { Injectable, OnDestroy } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { TranslationService } from "../shared/translation.service";


@Injectable({providedIn: 'root'})
export class Utils implements OnDestroy {

  uSure = '';
  cancel = '';
  confirm = '';
  sub;
  constructor(private alertCtrl: AlertController, private trService: TranslationService) {
    
    //subscribe translations
    this.sub = this.trService.language.subscribe(()=>{
      this.refreshLang();
    })
  }
  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    } 
  }

  refreshLang(){ 
    this.trService.translateValue('u-sure').subscribe((res: string)=>{
      this.uSure = res;
      console.log('aggiornato')
    }).unsubscribe();
    this.trService.translateValue('cancel').subscribe((res: string)=>{
      this.cancel = res;
    }).unsubscribe();
    this.trService.translateValue('confirm').subscribe((res: string)=>{
      this.confirm = res;
    }).unsubscribe();
  }

  presentAlert(message: string){
      return this.alertCtrl.create({
        header: this.uSure,
        message: message,
        buttons: [
          {
            text: this.cancel,
            role: 'cancel',
          },
          {
            text: this.confirm,
            role: 'confirm',
          },
        ],  
      }).then(a => {
        a.present();
        return a.onDidDismiss();
      });
  }

}
