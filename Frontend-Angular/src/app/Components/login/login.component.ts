import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Service/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginAttemptService } from 'src/app/Service/login-attempt.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private loginAttemptService: LoginAttemptService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  login(): void {
    console.log('Login method called');
    if (this.loginForm.invalid) {
      console.log('Form is invalid', this.loginForm.errors);
      return;
    }
  
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
  
    if (this.loginAttemptService.isLocked(email)) {
      this.error = true;
      this.errorMessage = "Account locked. Try again later.";
      return;
    }
  
    // Send the password in plaintext
    const loginData = {
      username: email,
      password: password
    };
  
    this.apiService.login(loginData).subscribe(
      res => {
        if (res.status == "200") {
          this.loginAttemptService.resetAttempts(email);
          this.apiService.storeToken(res.authToken, res.userType.toLowerCase());
          this.router.navigate([res.userType === "CUSTOMER" ? '/home' : '/admin']);
          this.error = false;
        }
      },
      err => {
        this.loginAttemptService.recordAttempt(email);
        this.error = true;
        const remainingAttempts = 5 - this.loginAttemptService.getAttempts(email);
        this.errorMessage = `Invalid credentials. Attempts remaining: ${remainingAttempts}`;
        if (this.loginAttemptService.isLocked(email)) {
          this.errorMessage = "Account locked. Try again later.";
        }
      }
    );
  }
}