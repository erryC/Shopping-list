import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslationService } from '../shared/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-create-list-element',
  templateUrl: './create-list-element.component.html',
  styleUrls: ['./create-list-element.component.scss'],
  standalone: true,
  imports:[IonicModule ,CommonModule, ReactiveFormsModule, TranslateModule]
})
export class CreateListElementComponent  implements OnInit, OnDestroy {

  @Input() selectedMode: 'add-item' | 'add-category' | 'rename';
  @Input() previousName: '';
  form: FormGroup;
  isAddItem = false;
  unit: string = 'pcs';
  subLang;

  add = '';
  rename = '';
  amount: string = '';
  name = '';
  objName = '';

  constructor(private modalCtrl: ModalController, private langService: TranslationService,) { }
  ngOnDestroy(): void {
    if(this.subLang)
      this.subLang.unsubscribe();
  }

  ngOnInit() {
    // console.log(this.selectedMode)
    if(this.selectedMode === 'add-item'){
      this.isAddItem = true;
    }
    let prevName = this.previousName;
    this.form = new FormGroup({
      name: new FormControl(prevName, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      amount: new FormControl(1, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
    })

    //subscribe translations
    this.subLang = this.langService.language.subscribe(()=>{
      this._initialiseTranslation();
    })
  }

  _initialiseTranslation(): void {
    this.langService.translateValue('add').subscribe((res: string) => {
      this.add = res;
    }).unsubscribe();
    this.langService.translateValue('rename').subscribe((res: string) => {
      this.rename = res;
    }).unsubscribe();
    this.langService.translateValue('amount').subscribe((res: string) => {
      this.amount = res;
    }).unsubscribe();
    this.langService.translateValue('name').subscribe((res: string) => {
      this.name = res;
    }).unsubscribe();
    this.langService.translateValue('obj-name').subscribe((res: string) => {
      this.objName = res;
    }).unsubscribe();
  }

  onCancel(){
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if(!this.form.valid)
      return;
    // console.log(this.form.value.name, 'confirm');
    if(this.isAddItem){
      this.modalCtrl.dismiss({
        formData: {
          name: this.form.value.name,
          amount: this.form.value.amount + " " + this.unit,
        }
      }, 'confirm');
    } else {
      this.modalCtrl.dismiss({
        formData: {
          name: this.form.value.name
        }
      }, 'confirm');
    }

  }

  onSelectUnit(unit: string){
    this.unit = unit;
  }

  getConfirm(){
    if(this.selectedMode == 'rename'){
      return this.rename
    }
    return this.add
  }
}
