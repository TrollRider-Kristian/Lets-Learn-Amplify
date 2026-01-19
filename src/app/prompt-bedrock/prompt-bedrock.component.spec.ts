import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptBedrockComponent } from './prompt-bedrock.component';

describe('PromptBedrockComponent', () => {
  let component: PromptBedrockComponent;
  let fixture: ComponentFixture<PromptBedrockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptBedrockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromptBedrockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
