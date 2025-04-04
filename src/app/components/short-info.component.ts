import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable, map } from 'rxjs';
import { AsyncPipe, NgFor, KeyValuePipe, NgIf } from '@angular/common'; // Import KeyValuePipe and NgIf
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-short-info',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    MatCardModule,
    KeyValuePipe, // Add KeyValuePipe to imports
    NgIf, // Add NgIf to imports
  ],
  template: `
    <h2>Краткая информация</h2>

    <div *ngIf="data$ | async as data">
      <mat-card>
        <mat-card-title>Кількість виданих кредитів по місяцях</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getCreditsByMonth(data) | keyvalue">
            {{ item.key }}: {{ item.value }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Середня сума видачі кредитів по місяцях</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getAverageCreditAmountByMonth(data) | keyvalue">
            {{ item.key }}: {{ item.value.toFixed(2) }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Загальна сума виданих кредитів по місяцях</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getTotalCreditAmountByMonth(data) | keyvalue">
            {{ item.key }}: {{ item.value.toFixed(2) }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Загальна сума нарахованих відсотків по місяцях</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getTotalPercentByMonth(data) | keyvalue">
            {{ item.key }}: {{ item.value.toFixed(2) }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Кількість повернених кредитів по місяцях</mat-card-title>
        <mat-card-content>
          <p *ngFor="let item of getReturnedCreditsByMonth(data) | keyvalue">
            {{ item.key }}: {{ item.value }}
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
    `,
  ],
})
export class ShortInfoComponent implements OnInit {
  data$!: Observable<any[]>;

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
}