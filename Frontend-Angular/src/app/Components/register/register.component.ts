import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
      usertype: ['customer', Validators.required]
    });
  }

  get f() { return this.registerForm.controls; }

  register(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.apiService.register(this.registerForm.value).subscribe(
      res => {
        if (res.status === "400") {
          console.error("Registration failed: Details cannot be empty");
        } else {
          this.router.navigate(['/login']);
        }
      },
      err => {
        console.error("Registration error:", err);
        alert("An error has occurred. Please try again later.");
      }
    );
  }
}
