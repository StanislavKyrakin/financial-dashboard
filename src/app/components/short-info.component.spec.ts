import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ShortInfoComponent } from './short-info.component';
import { DataService } from '../services/data.service';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ShortInfoComponent', () => {
    let component: ShortInfoComponent;
    let fixture: ComponentFixture<ShortInfoComponent>;
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
            actual_return_date: '2024-03-01',
        },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, MatCardModule, NoopAnimationsModule],
            providers: [
                {
                    provide: DataService,
                    useValue: {
                        getData: () => of(mockData),
                    },
                },
            ],
            declarations: [],
        }).compileComponents();

        fixture = TestBed.createComponent(ShortInfoComponent);
        component = fixture.componentInstance;
        dataService = TestBed.inject(DataService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display metric cards', () => {
        const cards = fixture.nativeElement.querySelectorAll('mat-card');
        expect(cards.length).toBe(5);
    });

    it('should calculate credits by month', () => {
        const result = component.getCreditsByMonth(mockData);
        expect(result['January 2024']).toBe(3);
    });

    it('should calculate average credit amount by month', () => {
        const result = component.getAverageCreditAmountByMonth(mockData);
        expect(result['January 2024']).toBe(200);
    });

    it('should calculate total credit amount by month', () => {
        const result = component.getTotalCreditAmountByMonth(mockData);
        expect(result['January 2024']).toBe(600);
    });

    it('should calculate total percent by month', () => {
        const result = component.getTotalPercentByMonth(mockData);
        expect(result['January 2024']).toBe(60);
    });

    it('should calculate returned credits by month', () => {
        const result = component.getReturnedCreditsByMonth(mockData);
        expect(result['January 2024']).toBe(1);
    });
});