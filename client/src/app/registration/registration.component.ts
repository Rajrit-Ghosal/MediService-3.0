import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  itemForm: FormGroup;
  formModel: any = { role: null, email: '', password: '', username: '' };
  showMessage: boolean = false;

  responseMessage: any;
  constructor(public router: Router, private bookService: HttpService, private formBuilder: FormBuilder) {

    this.itemForm = this.formBuilder.group({
      //complete this function 
      username: [this.formModel.username, Validators.required],
      password: [this.formModel.password, Validators.required],
      email: [this.formModel.email, Validators.required],
      role: [this.formModel.role, Validators.required]

    });
  }

  ngOnInit(): void {
  }

  onRegister() {
    
  //   if (this.itemForm.invalid) {
  //     this.showMessage = true;
  //     this.responseMessage = 'Please fill all the required fields correctly.';
  //     return;
  //   }

  //   // Call the service to register the user
    this.bookService.registerUser(this.itemForm.value).subscribe(
      (response: any) => {
        this.showMessage = true;
        if(response==null){
          this.showMessage=false;
          this.responseMessage="Try with another username";
        }
        this.responseMessage = response.message || 'Registration successful.';
      },
      (error: any) => {
        this.showMessage = false;
        this.responseMessage = 'An error occurred while registering.';
      }
    );
  
  console.log(this.itemForm.value);
   }

}

