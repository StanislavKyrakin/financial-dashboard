import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable, map } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-table',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTableModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
  ],
  template: `
    <h2>Общая таблица</h2>
    <div class="filters">
      <mat-form-field>
        <mat-label>Дата выдачи от</mat-label>
        <input matInput type="date" [(ngModel)]="issuanceDateFrom" (ngModelChange)="filterData()" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Дата выдачи до</mat-label>
        <input matInput type="date" [(ngModel)]="issuanceDateTo" (ngModelChange)="filterData()" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Дата возврата от</mat-label>
        <input matInput type="date" [(ngModel)]="returnDateFrom" (ngModelChange)="filterData()" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Дата возврата до</mat-label>
        <input matInput type="date" [(ngModel)]="returnDateTo" (ngModelChange)="filterData()" />
      </mat-form-field>

      <mat-checkbox [(ngModel)]="showOverdue" (ngModelChange)="filterData()">Просроченные кредиты</mat-checkbox>
    </div>

    <table mat-table *ngIf="filteredData$ | async as data" [dataSource]="data" class="mat-elevation-z8">
      <ng-container matColumnDef="user">
        <th mat-header-cell *matHeaderCellDef>Пользователь</th>
        <td mat-cell *matCellDef="let row">{{ row.user }}</td>
      </ng-container>

      <ng-container matColumnDef="body">
        <th mat-header-cell *matHeaderCellDef>Сумма</th>
        <td mat-cell *matCellDef="let row">{{ row.body }}</td>
      </ng-container>

      <ng-container matColumnDef="percent">
        <th mat-header-cell *matHeaderCellDef>Процент</th>
        <td mat-cell *matCellDef="let row">{{ row.percent }}</td>
      </ng-container>

      <ng-container matColumnDef="issuance_date">
        <th mat-header-cell *matHeaderCellDef>Дата выдачи</th>
        <td mat-cell *matCellDef="let row">{{ row.issuance_date }}</td>
      </ng-container>

      <ng-container matColumnDef="return_date">
        <th mat-header-cell *matHeaderCellDef>Дата возврата</th>
        <td mat-cell *matCellDef="let row">{{ row.return_date }}</td>
      </ng-container>

      <ng-container matColumnDef="actual_return_date">
        <th mat-header-cell *matHeaderCellDef>Фактическая дата возврата</th>
        <td mat-cell *matCellDef="let row">{{ row.actual_return_date }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [
    `
      table {
        width: 100%;
      }
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class GeneralTableComponent implements OnInit {
  data$!: Observable<any[]>;
  filteredData$!: Observable<any[]>;
  displayedColumns: string[] = [
    'user',
    'body',
    'percent',
    'issuance_date',
    'return_date',
    'actual_return_date',
  ];

  issuanceDateFrom: string | null = null;
  issuanceDateTo: string | null = null;
  returnDateFrom: string | null = null;
  returnDateTo: string | null = null;
  showOverdue = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.data$ = this.dataService.getData();
    this.filteredData$ = this.data$;
  }

  filterData(): void {
    this.filteredData$ = this.data$.pipe(
      map((data) =>
        data.filter((row) => {
          let issuanceDateFilter = true;
          let returnDateFilter = true;
          let overdueFilter = true;

          if (this.issuanceDateFrom && row.issuance_date < this.issuanceDateFrom) {
            issuanceDateFilter = false;
          }

          if (this.issuanceDateTo && row.issuance_date > this.issuanceDateTo) {
            issuanceDateFilter = false;
          }

          if (this.returnDateFrom && row.actual_return_date && row.actual_return_date < this.returnDateFrom) {
            returnDateFilter = false;
          }

          if (this.returnDateTo && row.actual_return_date && row.actual_return_date > this.returnDateTo) {
            returnDateFilter = false;
          }

          if (this.showOverdue) {
            const returnDate = row.return_date;
            const actualReturnDate = row.actual_return_date;
            const today = new Date().toISOString().split('T')[0];

            if (actualReturnDate) {
              overdueFilter = actualReturnDate > returnDate;
            } else {
              overdueFilter = returnDate < today;
            }
          }

          return issuanceDateFilter && returnDateFilter && overdueFilter;
        })
      )
    );
  }
}