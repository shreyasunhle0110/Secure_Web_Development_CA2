import { TestBed } from '@angular/core/testing';
import { LoginAttemptService } from 'src/app/Service/login-attempt.service';

describe('LoginAttemptService', () => {
  let service: LoginAttemptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginAttemptService);
  });

  it('should block after 5 failed attempts', () => {
    const username = 'testUser';
    for (let i = 0; i < 4; i++) {
      service.recordAttempt(username);
      expect(service.isLocked(username)).toBeFalse();
    }
    service.recordAttempt(username);
    expect(service.isLocked(username)).toBeTrue();
  });

  it('should reset attempts after successful login', () => {
    const username = 'testUser';
    service.recordAttempt(username);
    service.recordAttempt(username);
    service.resetAttempts(username);
    expect(service.isLocked(username)).toBeFalse();
  });
});
