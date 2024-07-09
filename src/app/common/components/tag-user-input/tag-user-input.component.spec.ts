import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagUserInputComponent } from './tag-user-input.component';

describe('TagUserInputComponent', () => {
  let component: TagUserInputComponent;
  let fixture: ComponentFixture<TagUserInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagUserInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TagUserInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
