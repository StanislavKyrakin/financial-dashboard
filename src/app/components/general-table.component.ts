import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-general-table',
  standalone: true,
  imports: [AsyncPipe, MatTableModule, NgIf],
  template: `
    <h2>Общая таблица</h2>
    <table mat-table *ngIf="data$ | async as data" [dataSource]="data" class="mat-elevation-z8">
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
    `,
  ],
})
export class GeneralTableComponent implements OnInit {
  data$!: Observable<any[]>; // Изменили тип на Observable<any[]>
  displayedColumns: string[] = [
    'user',
    'body',
    'percent',
    'issuance_date',
    'return_date',
    'actual_return_date',
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.data$ = this.dataService.getData();
  }
}