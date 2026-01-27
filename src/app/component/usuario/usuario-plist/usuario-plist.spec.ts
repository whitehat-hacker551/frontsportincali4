import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UsuarioPlist } from './usuario-plist';

describe('UsuarioPlist', () => {
  let component: UsuarioPlist;
  let fixture: ComponentFixture<UsuarioPlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UsuarioPlist]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UsuarioPlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
