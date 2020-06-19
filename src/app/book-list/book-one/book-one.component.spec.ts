import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookOneComponent } from './book-one.component';

describe('BookOneComponent', () => {
  let component: BookOneComponent;
  let fixture: ComponentFixture<BookOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
