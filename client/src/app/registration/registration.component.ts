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
  formModel: any = { role: null, email: '', password: '', username: '' , confirmPassword: ''};
  showMessage: boolean = false;
  showError:boolean=false;
  responseMessage: any;
  
  constructor(public router: Router, private bookService: HttpService, private formBuilder: FormBuilder) {

    this.itemForm = this.formBuilder.group({
      username: [this.formModel.username, Validators.required],
      password: [this.formModel.password, [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$.#!%*?&^])[a-zA-Z0-9@$.#!%*?&^]{5,10}$')]],
      confirmPassword: [this.formModel.confirmPassword, Validators.required],
      email: [this.formModel.email, [Validators.required,Validators.email]],
      role: [this.formModel.role, Validators.required]},
      { validators: this.checkPasswords }
      );
     

}
  
   ngOnInit(): void {
   }


  onRegister() {

    // Call the service to register the user
    this.bookService.registerUser(this.itemForm.value).subscribe(
      (response: any) => {
        this.showMessage = true;
        if(response==null){
          this.showError=false;
          this.responseMessage="User Already Exist";
        }else{
          if(this.itemForm.get('role')?.value==='HOSPITAL'){
            this.responseMessage ='Welcome '+this.itemForm.get('username')?.value+' to our page!!. You are an Admin now';
            this.itemForm.reset();
          }
          else{
            this.responseMessage ='Welcome '+this.itemForm.get('username')?.value+' to our page!!. You are an '+this.itemForm.get('role')?.value+' now';
            this.itemForm.reset();
          }
        
        }
      },
      (error: any) => {
        this.showError = true;
        this.responseMessage = 'An error occurred while registering.';
      }
    );

    console.log(this.itemForm.value);
  }

  

  
  // Custom validator function to check if password and confirmPassword match
  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password !== confirmPassword || password==="") {
      group.get('confirmPassword')?.setErrors({ notSame: true }); 
    } else if(password===confirmPassword){
      group.get('confirmPassword')?.setErrors(null); // Clear error if passwords match
    }
  }
  
  
}