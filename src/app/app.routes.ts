import { Routes } from '@angular/router';
import { GeneralTableComponent } from './components/general-table.component';
import { ShortInfoComponent } from './components/short-info.component';

export const routes: Routes = [
  { path: 'general-table', component: GeneralTableComponent },
  { path: 'short-info', component: ShortInfoComponent },
  { path: '', redirectTo: '/general-table', pathMatch: 'full' },
];