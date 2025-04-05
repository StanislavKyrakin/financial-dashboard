import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable, map } from 'rxjs';
import { AsyncPipe, NgFor, KeyValuePipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-short-info',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    MatCardModule,
    KeyValuePipe,
    NgIf,
    MatButtonModule, // Add MatButtonModule
  ],
  template: `
    <h2>Краткая информация</h2>

    <div *ngIf="data$ | async as data" class="buttons-container">
      <button mat-button (click)="selectedMetric = 'credits'">Кількість виданих кредитів</button>
      <button mat-button (click)="selectedMetric = 'average'">Середня сума кредитів</button>
      <button mat-button (click)="selectedMetric = 'totalAmount'">Загальна сума кредитів</button>
      <button mat-button (click)="selectedMetric = 'totalPercent'">Загальна сума відсотків</button>
      <button mat-button (click)="selectedMetric = 'returned'">Кількість повернених кредитів</button>
      <button mat-button (click)="selectedMetric = 'topUsersCredits'">Топ-10 користувачів (кількість кредитів)</button>
      <button mat-button (click)="selectedMetric = 'topUsersPercent'">Топ-10 користувачів (сума відсотків)</button>
      <button mat-button (click)="selectedMetric = 'topUsersRatio'">Топ-10 користувачів (співвідношення)</button>
    </div>

    <div *ngIf="data$ | async as data">
      <mat-card *ngIf="selectedMetric === 'credits'">
        <mat-card-title>Кількість виданих кредитів по місяцях</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getCreditsByMonth(data) | keyvalue">
            {{ item.key }}: {{ item.value }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="selectedMetric === 'average'">
        <mat-card-title>Середня сума видачі кредитів по місяцях</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getAverageCreditAmountByMonth(data) | keyvalue">
            {{ item.key }}: {{ item.value.toFixed(2) }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="selectedMetric === 'totalAmount'">
        <mat-card-title>Загальна сума виданих кредитів по місяцях</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getTotalCreditAmountByMonth(data) | keyvalue">
            {{ item.key }}: {{ item.value.toFixed(2) }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="selectedMetric === 'totalPercent'">
        <mat-card-title>Загальна сума нарахованих відсотків по місяцях</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getTotalPercentByMonth(data) | keyvalue">
            {{ item.key }}: {{ item.value.toFixed(2) }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="selectedMetric === 'returned'">
        <mat-card-title>Кількість повернених кредитів по місяцях</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getReturnedCreditsByMonth(data) | keyvalue">
            {{ item.key }}: {{ item.value }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="selectedMetric === 'topUsersCredits'">
        <mat-card-title>Топ-10 користувачів за кількістю отриманих кредитів</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getTopUsersByCredits(data)">
            {{ item.user }}: {{ item.count }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="selectedMetric === 'topUsersPercent'">
        <mat-card-title>Топ-10 користувачів за сумою сплачених відсотків</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getTopUsersByPercent(data)">
            {{ item.user }}: {{ item.totalPercent.toFixed(2) }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="selectedMetric === 'topUsersRatio'">
        <mat-card-title>Топ-10 користувачів з найбільшим співвідношенням відсотків до суми кредиту</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getTopUsersByPercentRatio(data)">
            {{ item.user }}: {{ item.percentRatio.toFixed(2) }}
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      mat-card {
        margin-bottom: 20px;
      }

      .buttons-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class ShortInfoComponent implements OnInit {
  data$!: Observable<any[]>;
  selectedMetric: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.data$ = this.dataService.getData();
  }

  getCreditsByMonth(data: any[]): { [key: string]: number } {
    const result: { [key: string]: number } = {};
    data.forEach((item) => {
      const month = new Date(item.issuance_date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      result[month] = (result[month] || 0) + 1;
    });
    return result;
  }

  getAverageCreditAmountByMonth(data: any[]): { [key: string]: number } {
    const result: { [key: string]: number } = {};
    const sums: { [key: string]: number } = {};
    const counts: { [key: string]: number } = {};

    data.forEach((item) => {
      const month = new Date(item.issuance_date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      sums[month] = (sums[month] || 0) + item.body;
      counts[month] = (counts[month] || 0) + 1;
    });

    for (const month in sums) {
      result[month] = sums[month] / counts[month];
    }
    return result;
  }

  getTotalCreditAmountByMonth(data: any[]): { [key: string]: number } {
    const result: { [key: string]: number } = {};
    data.forEach((item) => {
      const month = new Date(item.issuance_date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      result[month] = (result[month] || 0) + item.body;
    });
    return result;
  }

  getTotalPercentByMonth(data: any[]): { [key: string]: number } {
    const result: { [key: string]: number } = {};
    data.forEach((item) => {
      const month = new Date(item.issuance_date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      result[month] = (result[month] || 0) + item.percent;
    });
    return result;
  }

  getReturnedCreditsByMonth(data: any[]): { [key: string]: number } {
    const result: { [key: string]: number } = {};
    data.forEach((item) => {
      if (item.actual_return_date) {
        const month = new Date(item.issuance_date).toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        });
        result[month] = (result[month] || 0) + 1;
      }
    });
    return result;
  }

  getTopUsersByCredits(data: any[]): { user: string; count: number }[] {
    const userCounts: { [user: string]: number } = {};
    data.forEach((item) => {
      userCounts[item.user] = (userCounts[item.user] || 0) + 1;
    });
    return Object.entries(userCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([user, count]) => ({ user, count }));
  }

  getTopUsersByPercent(data: any[]): { user: string; totalPercent: number }[] {
    const userPercents: { [user: string]: number } = {};
    data.forEach((item) => {
      if (item.actual_return_date) {
        userPercents[item.user] = (userPercents[item.user] || 0) + item.percent;
      }
    });
    return Object.entries(userPercents)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([user, totalPercent]) => ({ user, totalPercent }));
  }

  getTopUsersByPercentRatio(data: any[]): { user: string; percentRatio: number }[] {
    const userRatios: { [user: string]: number } = {};
    data.forEach((item) => {
      if (item.actual_return_date) {
        userRatios[item.user] =
          (userRatios[item.user] || 0) + item.percent / item.body;
      }
    });
    return Object.entries(userRatios)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([user, percentRatio]) => ({ user, percentRatio }));
  }
}