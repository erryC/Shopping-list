import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, take } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class TranslationService{

    availableLanguages = ['en', 'it'];
    language = new BehaviorSubject<string>(null);

    constructor(private trService: TranslateService) {
        trService.setTranslation('en', {
            "app-title": "Shopping list",
            "select-list": "Select a list to follow",
            "create-a-list": "Create a list to get started",
            "list-completed": "List completed!",
            "select-action": "Select an action",
            "rename" : "Rename",
            "delete" : "Delete",
            "delete-warning": "The objects in its contents will also be deleted.",
            "archive": "Archive",
            "archive-warning": "The list will be reset, ready for the next use.",
            "cancel": "Cancel",
            "add": "Add",
            "add-advice": "Add a new element!",
            "amount": "amount",
            "name": "name",
            "obj-name": "object name",
            "confirm": "Confirm",
            "u-sure": "Are you sure?",
            "tab-active-list": "Active lists",
            "tab-my-lists": "My lists",
            "options": "Options",
            "warn-close-app": "Double click to exit!",
            "new-list": "New list",
            "change-theme": "Change theme",
            "objects-to-bottom-o": "Put the items taken at the bottom of the list",
            "double-click-del-o": "Double click to delete objects",
            "select-language": "Select language",
        });
        
        trService.setTranslation('it', {
            "app-title": "Lista della spesa",
            "select-list": "Seleziona una lista da seguire",
            "create-a-list": "Crea una lista per iniziare",
            "list-completed": "Lista completata!",
            "select-action": "scegli un azione",
            "rename": "Rinomina",
            "delete": "Elimina",
            "delete-warning": "Verranno eliminati anche gli oggetti nel suo contenuto.",
            "archive": "Archivia",
            "archive-warning": "Verrà resettata la lista, pronta per il prossimo utilizzo.",
            "cancel": "Annulla",
            "add": "Aggiungi",
            "add-advice": "Aggiungi un nuovo elemento!",
            "amount": "quantità",
            "name": "nome",
            "obj-name": "nome oggetto",
            "confirm": "Conferma",
            "u-sure": "Sei sicuro?",
            "tab-active-list": "Lista attiva",
            "tab-my-lists": "Le mie liste",
            "options": "Opzioni",
            "warn-close-app": "Clicca due volte per uscire!",
            "new-list": "Nuova lista",
            "change-theme": "Cambia tema",
            "objects-to-bottom-o": "Metti gli oggetti presi infondo la lista",
            "double-click-del-o": "Doppio click per eliminare gli oggetti",
            "select-language": "Seleziona la lingua",
        });
    }

    translateValue(id: string){
        return this.trService.get(id)
    }

    _initTranslate(language: string) {
        if (!language) {
            language = 'en'
        }
        // Set the default language for translation strings, and the current language.
        this.trService.setDefaultLang(language);
        this.selectLanguage(language);
    }

    selectLanguage(lang: string){
        this.trService.use(lang);
        this.language.next(lang);
    }

    getDeviceLanguage(savedcustomLang: string) {
        if(savedcustomLang!= null){
            this._initTranslate(savedcustomLang);
            return;
        }
        
        const defaultLang = window.navigator.language.slice(0, 2);
        console.log("setting default lang: ", defaultLang);
        if(this.availableLanguages.indexOf(defaultLang) >= 0){
            this._initTranslate(defaultLang);
        } else {
            this._initTranslate('en');
        }
        
    }

    getCurrentLang(){
        return this.trService.currentLang;
    }
}
