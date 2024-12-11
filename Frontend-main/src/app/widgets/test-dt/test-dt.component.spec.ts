import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDtComponent } from './test-dt.component';

describe('TestDtComponent', () => {
  let component: TestDtComponent;
  let fixture: ComponentFixture<TestDtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
