import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  employeeForm!: FormGroup;
  loginForm!: FormGroup;
  showSuccessMessage: boolean = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      employee_id: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      appointment_date: ['', Validators.required]
    });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  registerEmployee(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    const formData = this.employeeForm.value;

    this.http.post('http://127.0.0.1:8000/employee/', formData).subscribe(
      (response) => {
        this.showSuccessMessage = true;
        console.log(response); // Handle successful response
      },
      (error) => {
        console.error(error); // Handle error
      }
    );
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
  
    const loginData = this.loginForm.value;
    // Retrieve CSRF token from cookie
    const csrfToken = this.cookieService.get('csrftoken');
  
    // Set request headers with CSRF token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    });
  
    // Send the login credentials to the backend
    this.http.post('http://127.0.0.1:8000/admin/login/', loginData, { headers }).subscribe(
      (data: any) => {
        // Handle the backend response
        if (data.success) {
          // Login successful, display success message and clear form
          this.showSnackBar('Login successful');
          this.loginForm.reset();
        } else {
          // Login failed, display error message
          this.errorMessage = 'Invalid username or password';
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Login error:', error);
  
        // Check the error status and message
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access';
        } else {
          this.errorMessage = 'An error occurred while logging in';
        }
      }
    );
  }
  

  showSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
