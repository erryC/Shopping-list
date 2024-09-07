import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'shopping-list', loadComponent: () => import('../shopping-list/shopping-list.page').then((m) => m.ShoppingListHome),
      },
      {
        path: 'my-lists', children:[
          {path: '', loadComponent: () => import('../my-lists/my-lists.page').then((m) => m.MyListsPage)},
          {path: 'new', loadComponent: () => import('../new-list/new-list.page').then((m) => m.NewListPage)},
        ]
        
      },
      {
        path: 'options', loadComponent: () => import('../options/options.page').then( m => m.OptionsPage)
      },
      {
        path: '',
        redirectTo: '/tabs/shopping-list',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/shopping-list',
    pathMatch: 'full',
  },
];
