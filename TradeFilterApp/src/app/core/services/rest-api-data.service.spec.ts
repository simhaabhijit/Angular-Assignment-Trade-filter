import { TestBed } from '@angular/core/testing';

import { RestApiDATAService } from './rest-api-data.service';

describe('RestApiDATAService', () => {
  let service: RestApiDATAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestApiDATAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
