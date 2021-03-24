import { TestBed } from '@angular/core/testing';
import { PeachtreeBank } from './peachtree-bank.component';

describe('PeachtreeBank', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PeachtreeBank
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(PeachtreeBank);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Backbase-Interview'`, () => {
    const fixture = TestBed.createComponent(PeachtreeBank);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Backbase-Interview');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(PeachtreeBank);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('Backbase-Interview app is running!');
  });
});
