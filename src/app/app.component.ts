import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button'; // Импортируем MatButtonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive, // Добавляем RouterLinkActive
    NgbModule,
    MatToolbarModule,
    MatButtonModule, // Добавляем MatButtonModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Финансовый Дашборд</span>
      <span class="example-spacer"></span>
      <button mat-button routerLink="/general-table" routerLinkActive="active">
        Общая таблица
      </button>
      <button mat-button routerLink="/short-info" routerLinkActive="active">
        Краткая информация
      </button>
    </mat-toolbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .example-spacer {
        flex: 1 1 auto;
      }

      .mat-toolbar-row button {
        margin-left: 10px;
      }
    `,
  ],
})
export class AppComponent {}