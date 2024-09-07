import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import { TranslationService } from "../shared/translation.service";
import { from, map, take } from "rxjs";


interface Ioptions {
    theme: boolean,
    toBottom: boolean,
    dcd: boolean,
    autoDelete: boolean,
    lang: string,
}

@Injectable({providedIn: 'root'})
export class OptionsService {

    defaultTheme: boolean = true;
    completedItemsToBottom: boolean = false;
    doubleClickDelete:boolean = false;
    autoDeleteCompletedLists: boolean = false;
    lang: string = '';
    private hasOptionsChanged: boolean = false;

    constructor(private trService: TranslationService) {}
    
    saveOptions(){
        if(!this.hasOptionsChanged){
            return;
        }
        console.log('saved options', this.trService.getCurrentLang())
        Preferences.set({key:'options', value:JSON.stringify({
            theme: this.defaultTheme,
            dcd: this.doubleClickDelete,
            toBottom: this.completedItemsToBottom,
            autoDelete: this.autoDeleteCompletedLists,
            lang: this.trService.getCurrentLang()
        })});
    }

    loadOptions(){
        return from(Preferences.get({key:'options'})).pipe(
            take(1),
            map(result => {
                console.log('map')
                if(!result){
                    console.log('no saves found')
                    return null;
                }
                return JSON.parse(result.value) as Ioptions;
            }),
            map(parsed => {
                console.log('tap')

                if(!parsed)
                    return null;
                this.setTheme(parsed.theme);
                this.completedItemsToBottom = parsed.toBottom;
                this.doubleClickDelete = parsed.dcd;
                this.autoDeleteCompletedLists = parsed.autoDelete;
                this.lang = parsed.lang;
                return parsed.lang;
            }),
        )
    }
    // loadOptions(){
    //     Preferences.get({key:'options'}).then(result => {
    //         if(!result){
    //           console.log('no saves found')
    //           return null;
    //         }
    //         return JSON.parse(result.value) as Ioptions;
    //       }).then(parsed => {
    //         if(!parsed)
    //           return;
    //         this.setTheme(parsed.theme);
    //         this.completedItemsToBottom = parsed.toBottom;
    //         this.doubleClickDelete = parsed.dcd;
    //         this.autoDeleteCompletedLists = parsed.autoDelete;
    //       });
    // }

    setTheme(defaultTheme: boolean){
        this.defaultTheme = defaultTheme;
        if(!defaultTheme){
            document.body.setAttribute('color-theme', 'dark');
        } else {
            document.body.setAttribute('color-theme', 'light');
        } 
    }

    changeTheme(defaultTheme: boolean){
        this.hasOptionsChanged = true;
        this.setTheme(defaultTheme);
    }

    changeCompletedItemsToBottom(value: boolean){
        this.completedItemsToBottom = value;
        this.hasOptionsChanged = true;
    }

    changeDoubleClick(value: boolean){
        this.doubleClickDelete = value;
        this.hasOptionsChanged = true;

    }
    changeAutoDelete(value: boolean){
        this.autoDeleteCompletedLists = value;
        this.hasOptionsChanged = true;
    }

    changeLang(newLang: string){
        this.trService.selectLanguage(newLang);
        this.hasOptionsChanged = true;
    }

}