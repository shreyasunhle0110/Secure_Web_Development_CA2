import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditItemComponent } from './edit-item.component';

describe('EditItemComponent', () => {
  let component: EditItemComponent;
  let fixture: ComponentFixture<EditItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
