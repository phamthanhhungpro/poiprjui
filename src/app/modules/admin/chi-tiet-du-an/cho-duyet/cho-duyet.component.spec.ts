import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoDuyetComponent } from './cho-duyet.component';

describe('ChoDuyetComponent', () => {
  let component: ChoDuyetComponent;
  let fixture: ComponentFixture<ChoDuyetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoDuyetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChoDuyetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
