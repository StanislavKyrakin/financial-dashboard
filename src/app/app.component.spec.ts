import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgbModule, MatToolbarModule],
  template: `
    <mat-toolbar color="primary">
      <span>Финансовый Дашборд</span>
      <span class="example-spacer"></span>
      <a mat-button routerLink="/general-table" routerLinkActive="active">
        Общая таблица
      </a>
      <a mat-button routerLink="/short-info" routerLinkActive="active">
        Краткая информация
      </a>
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
    `,
  ],
})
export class AppComponent {
  title = 'Финансовый Дашборд'; // Add this line
}