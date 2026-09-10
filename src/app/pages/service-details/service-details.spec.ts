import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ServiceDetails } from './service-details';

describe('ServiceDetails', () => {
  let component: ServiceDetails;
  let fixture: ComponentFixture<ServiceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDetails],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
