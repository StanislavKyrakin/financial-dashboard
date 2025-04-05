import { Component, OnInit, signal } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable, map } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-general-table',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatPaginatorModule,
  ],
  template: `
    <h2>Общая таблица</h2>
    <div class="filters">
      <mat-form-field>
        <mat-label>Дата выдачи от</mat-label>
        <input
          matInput
          type="date"
          [value]="issuanceDateFrom()"
          (input)="onIssuanceDateFromChange($event)"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Дата выдачи до</mat-label>
        <input
          matInput
          type="date"
          [value]="issuanceDateTo()"
          (input)="onIssuanceDateToChange($event)"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Дата возврата от</mat-label>
        <input
          matInput
          type="date"
          [value]="returnDateFrom()"
          (input)="onReturnDateFromChange($event)"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Дата возврата до</mat-label>
        <input
          matInput
          type="date"
          [value]="returnDateTo()"
          (input)="onReturnDateToChange($event)"
        />
      </mat-form-field>

      <mat-checkbox
        [checked]="showOverdue()"
        (change)="onShowOverdueChange($event)"
        >Просроченные кредиты</mat-checkbox
      >
    </div>

    <table
      mat-table
      *ngIf="filteredData$ | async as data"
      [dataSource]="getPagedData(data)"
      class="mat-elevation-z8"
    >
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
        <th mat-header-cell *matHeaderCellDef>
          Фактическая дата возврата
        </th>
        <td mat-cell *matCellDef="let row">{{ row.actual_return_date }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>

    <mat-paginator
      [length]="dataLength"
      [pageSize]="pageSize"
      [pageSizeOptions]="[5, 10, 25, 100]"
      (page)="handlePageEvent($event)"
      aria-label="Select page"
      *ngIf="filteredData$ | async"
    >
    </mat-paginator>
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

  issuanceDateFrom = signal<string | null>(null);
  issuanceDateTo = signal<string | null>(null);
  returnDateFrom = signal<string | null>(null);
  returnDateTo = signal<string | null>(null);
  showOverdue = signal<boolean>(false);

  dataLength = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.data$ = this.dataService.getData();
    this.filteredData$ = this.data$;
    this.filterData();

    this.data$.subscribe((data) => (this.dataLength = data.length));
  }

  filterData(): void {
    console.log('filterData() called');
    this.filteredData$ = this.data$.pipe(
      map((data) =>
        data.filter((row) => {
          let issuanceDateFilter = true;
          let returnDateFilter = true;
          let overdueFilter = true;

          // Convert dates to Date objects for proper comparison
          const issuanceDate = row.issuance_date ? new Date(row.issuance_date) : null;
          const actualReturnDate = row.actual_return_date ? new Date(row.actual_return_date) : null;
          const returnDate = row.return_date ? new Date(row.return_date) : null;
          const issuanceDateFromFilter = this.issuanceDateFrom() ? new Date(this.issuanceDateFrom()!) : null;
          const issuanceDateToFilter = this.issuanceDateTo() ? new Date(this.issuanceDateTo()!) : null;
          const returnDateFromFilter = this.returnDateFrom() ? new Date(this.returnDateFrom()!) : null;
          const returnDateToFilter = this.returnDateTo() ? new Date(this.returnDateTo()!) : null;
          const today = new Date();

          if (issuanceDateFromFilter && issuanceDate && issuanceDate < issuanceDateFromFilter) {
            issuanceDateFilter = false;
          }

          if (issuanceDateToFilter && issuanceDate && issuanceDate > issuanceDateToFilter) {
            issuanceDateFilter = false;
          }

          if (returnDateFromFilter && actualReturnDate && actualReturnDate < returnDateFromFilter) {
            returnDateFilter = false;
          }

          if (returnDateToFilter && actualReturnDate && actualReturnDate > returnDateToFilter) {
            returnDateFilter = false;
          }

          if (this.showOverdue()) {
            if (actualReturnDate && returnDate) { // Added returnDate check
              overdueFilter = actualReturnDate > returnDate;
            } else if (returnDate) {
              overdueFilter = returnDate < today;
            }
          }

          return issuanceDateFilter && returnDateFilter && overdueFilter;
        })
      )
    );

    console.log('filteredData$ updated:', this.filteredData$);
    this.filteredData$.subscribe((data) => {
      this.pageIndex = 0;
      this.dataLength = data.length;
      console.log('filteredData$ subscribe data:', data);
    });
  }

  getPagedData(data: any[]): any[] {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return data.slice(startIndex, endIndex);
  }

  handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  onIssuanceDateFromChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.issuanceDateFrom.set(target.value);
    console.log('issuanceDateFrom changed:', this.issuanceDateFrom());
    this.filterData();
  }

  onIssuanceDateToChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.issuanceDateTo.set(target.value);
    console.log('issuanceDateTo changed:', this.issuanceDateTo());
    this.filterData();
  }

  onReturnDateFromChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.returnDateFrom.set(target.value);
    console.log('returnDateFrom changed:', this.returnDateFrom());
    this.filterData();
  }

  onReturnDateToChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.returnDateTo.set(target.value);
    console.log('returnDateTo changed:', this.returnDateTo());
    this.filterData();
  }

  onShowOverdueChange(event: MatCheckboxChange): void {
    this.showOverdue.set(event.checked);
    console.log('showOverdue changed:', this.showOverdue());
    this.filterData();
  }
}