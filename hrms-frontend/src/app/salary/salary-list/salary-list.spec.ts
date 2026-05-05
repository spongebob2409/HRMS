import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryList } from './salary-list';

describe('SalaryList', () => {
  let component: SalaryList;
  let fixture: ComponentFixture<SalaryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryList],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
