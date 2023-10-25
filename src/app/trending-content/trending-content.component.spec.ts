import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingContentComponent } from './trending-content.component';

describe('LatestContentComponent', () => {
  let component: TrendingContentComponent;
  let fixture: ComponentFixture<TrendingContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
