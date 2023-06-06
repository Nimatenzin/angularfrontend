import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  employeeForm!: FormGroup;
  showSuccessMessage: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
   

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
  }

  registerEmployee(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    const formData = this.employeeForm.value;

    this.http.post('http://127.0.0.1:8000/employee/', formData).subscribe(
      (response) => {
        this.showSuccessMessage = true;
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.handleValidationErrors(error.error);
        } else {
          console.error(error);
        }
      }
    );
  }

  handleValidationErrors(errors: any): void {
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        const fieldErrors = errors[field];
        const formControl = this.employeeForm.get(field);

        if (formControl) {
          formControl.setErrors({ serverError: true });
          formControl.setErrors({ serverErrorMessages: fieldErrors });
        }
      }
    }

    this.openSnackBar('Please fix the form errors.');
  }

  openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  redirectToAdmin(): void {
    window.location.href = 'http://127.0.0.1:8000/admin/';
  }
}
