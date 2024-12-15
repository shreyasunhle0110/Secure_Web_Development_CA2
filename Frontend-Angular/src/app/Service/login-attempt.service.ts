import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginAttemptService {
  private attempts: Map<string, number> = new Map();
  private maxAttempts = 5; // max attempts are set to 5 but can be changed
  private lockoutTime = 300000; // 5 minutes

  isLocked(email: string): boolean {
    const attempts = this.attempts.get(email) || 0;
    return attempts >= this.maxAttempts;
  }

  recordAttempt(email: string) {
    // this records a failed attempt to login and adds 1 to the counter
    const attempts = (this.attempts.get(email) || 0) + 1;
    this.attempts.set(email, attempts);
    if (attempts >= this.maxAttempts) {
      setTimeout(() => this.attempts.delete(email), this.lockoutTime);
    }
  }

  resetAttempts(email: string) {
    // Upon sucessfull login email is deleted from to map to return to counter to 0
    this.attempts.delete(email);
  }

  getAttempts(email: string): number {
    // get total attempts to check for account lockout
    return this.attempts.get(email) || 0;
  }

}
