import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { of, throwError } from 'rxjs'; // Import throwError

import { DataService } from './data.service';

describe('DataService', () => {
    let service: DataService;
    let httpTestingController: HttpTestingController;
    const apiUrl =
        'https://raw.githubusercontent.com/LightOfTheSun/front-end-coding-task-db/master/db.json';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DataService],
        });
        service = TestBed.inject(DataService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get data from API', () => {
        const mockData = [{ id: 1, name: 'Test' }];

        service.getData().subscribe((data) => {
            expect(data).toEqual(mockData);
        });

        const req = httpTestingController.expectOne(apiUrl);
        expect(req.request.method).toBe('GET');
        req.flush(mockData);

        httpTestingController.verify();
    });

    it('should handle error', () => {
        const mockError = 'Error fetching data';

        service.getData().subscribe({
            next: () => fail('should have errored'),
            error: (error) => expect(error.message).toContain(mockError), // Access error.message
        });

        const req = httpTestingController.expectOne(apiUrl);
        req.error(new ErrorEvent('Network error'), {
            status: 500,
            statusText: mockError,
        });

        httpTestingController.verify();
    });

    it('should return an Observable', () => {
        const result = service.getData();
        expect(result instanceof of).toBe(true); // Check if it's an Observable
    });

    it('should handle empty response', () => {
      service.getData().subscribe(data => {
        expect(data).toEqual([]); // Expect empty array
      });

      const req = httpTestingController.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush([]); // Return empty array
    });
});