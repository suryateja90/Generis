import { TestBed } from '@angular/core/testing';

import { AbstractParametersService } from './abstract-parameters.service';

describe('AbstractParametersService', () => {
  let service: AbstractParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AbstractParametersService] });
    service = TestBed.inject(AbstractParametersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
