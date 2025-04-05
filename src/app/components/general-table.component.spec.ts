import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GeneralTableComponent } from './general-table.component';
import { DataService } from '../services/data.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('GeneralTableComponent', () => {
    let component: GeneralTableComponent;
    let fixture: ComponentFixture<GeneralTableComponent>;
    let dataService: DataService;

    const mockData = [
        {
            user: 'User1',
            body: 100,
            percent: 10,
            issuance_date: '2024-01-01',
            return_date: '2024-02-01',
            actual_return_date: '2024-02-01',
        },
        {
            user: 'User2',
            body: 200,
            percent: 20,
            issuance_date: '2024-02-01',
            return_date: '2024-03-01',
            actual_return_date: '2024-03-01',
        },
        {
            user: 'User3',
            body: 300,
            percent: 30,
            issuance_date: '2024-03-01',
            return_date: '2024-03-01',
        },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                MatTableModule,
                MatPaginatorModule,
                NoopAnimationsModule,
                MatFormFieldModule,
                MatInputModule,
                MatCheckboxModule,
            ],
            providers: [
                {
                    provide: DataService,
                    useValue: {
                        getData: () => of(mockData),
                    },
                },
            ],
            declarations: [],
            // standalone: true, // Remove this line
        }).compileComponents();

        fixture = TestBed.createComponent(GeneralTableComponent);
        component = fixture.componentInstance;
        dataService = TestBed.inject(DataService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ... остальные тесты
});