import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingMoviesSeriesComponent } from './upcoming-movies-series.component';

describe('UpcomingMoviesSeriesComponent', () => {
  let component: UpcomingMoviesSeriesComponent;
  let fixture: ComponentFixture<UpcomingMoviesSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingMoviesSeriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingMoviesSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
