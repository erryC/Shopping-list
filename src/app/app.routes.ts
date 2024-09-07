import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  // {
  //   path: 'new-list',
  //   loadComponent: () => import('./new-list/new-list.page').then( m => m.NewListPage)
  // },
  // {
  //   path: 'edit-list',
  //   loadComponent: () => import('./edit-list/edit-list.page').then( m => m.EditListPage)
  // },
];
