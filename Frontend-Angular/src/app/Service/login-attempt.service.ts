import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginAttemptService {
  private attempts: Map<string, number> = new Map();
  private maxAttempts = 5;
  private lockoutTime = 300000; // 5 minutes in milliseconds

  isLocked(email: string): boolean {
    const attempts = this.attempts.get(email) || 0;
    return attempts >= this.maxAttempts;
  }

  recordAttempt(email: string) {
    const attempts = (this.attempts.get(email) || 0) + 1;
    this.attempts.set(email, attempts);
    if (attempts >= this.maxAttempts) {
      setTimeout(() => this.attempts.delete(email), this.lockoutTime);
    }
  }

  resetAttempts(email: string) {
    this.attempts.delete(email);
  }

  getAttempts(email: string): number {
    return this.attempts.get(email) || 0;
  }
}
