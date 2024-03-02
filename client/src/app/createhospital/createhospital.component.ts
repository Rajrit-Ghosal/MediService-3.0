import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { Hospital } from '../model/Search';

@Component({
  selector: 'app-createhospital',
  templateUrl: './createhospital.component.html',
  styleUrls: ['./createhospital.component.scss']
})
export class CreatehospitalComponent implements OnInit {
  isdubclicked: boolean = true;
  itemForm: FormGroup;
  equipmentForm: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  hospitalList: any = [];
  assignModel: any = {};
  filteredHospitalList: any = []; // Newly added property to store filtered hospitals
  modalSearchQuery: any;
  showMessage: any;
  responseMessage: any;
  showHospitalfilterData: boolean = false;//FOR SHOWING THE FILTERED DATA
  showHospitalData: boolean = true;//TO SHOW ALL THE HOSPITALS
  isClick: boolean = true;
  search: Hospital[]=[];
  NotFoundMessage:string="" 


   /*---------------------------------------------------------------------------------------------------------------------------------*/
  

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
  ) {
    this.itemForm = this.formBuilder.group({
      name: [this.formModel.name, [Validators.required]],
      location: [this.formModel.location, [Validators.required]],
    });

    this.equipmentForm = this.formBuilder.group({
      name: [this.formModel.name, [Validators.required]],
      description: [this.formModel.description, [Validators.required]],
      hospitalId: [this.formModel.hospitalId, [Validators.required]],
    });
  }


   /*---------------------------------------------------------------------------------------------------------------------------------*/
  



  ngOnInit(): void {
    this.getHospital();
  }



 /*---------------------------------------------------------------------------------------------------------------------------------*/
  



  getHospital() {
    this.httpService.getHospital().subscribe(
      (data: any) => {
        this.hospitalList = data;
        this.search=data;
        // console.log(this.hospitalList);
        console.log(this.search)
      },
      error => {
        this.showError = true;
        this.errorMessage = "An error occurred while fetching hospitals. Please try again later.";
        console.error('Error fetching hospitals:', error);
      }
    );
  }



 /*---------------------------------------------------------------------------------------------------------------------------------*/
  

/*(hosp: Search) => hosp.name.toLowerCase().includes(searchTerm) */

  //SEACHING HOSPITAL BY IT'S NAME
  filterHospitalByName() {
    this.showHospitalfilterData = true; // TO SHOW THE FILTERED HOSPITAL-LIST
    this.showHospitalData = false; // TO DISABLE ALL THE HOSPITAL LIST
    
    if (!!this.modalSearchQuery) { // Double bang operator is used to check whether the value is there or not 
      const searchTerm = this.modalSearchQuery.toLowerCase(); // Convert search query to lowercase
      this.filteredHospitalList = this.hospitalList.filter((hosp: Hospital) => hosp.name.toLowerCase().trim() === searchTerm || hosp.location.toLowerCase().trim() === searchTerm || hosp.id == searchTerm);
      console.log(this.filteredHospitalList); 
      if (this.filteredHospitalList.length == 0) {
        this.isClick = false;
        this.NotFoundMessage="No Hospital(s) Found!!"
        this.showHospitalData=true;

      } else {
        this.isClick = true;
      }
    } else {
      this.isClick = false; // IF THE SEARCH FIELD DOES NOT HAVE ANY VALUE
      //this.filteredHospitalList = null;
      this.NotFoundMessage="Nothing to search"
      this.showHospitalData=true;

    }
  }
  

  /*---------------------------------------------------------------------------------------------------------------------------------*/
   
  
  
  //CLOSING THE LIST OF FILTERED SEARCHED HOSPITAL-lIST-->(to search)
  closeIt() {
    this.showHospitalfilterData = false;
    this.showHospitalData = true;
    this.modalSearchQuery=""
  }


  /*---------------------------------------------------------------------------------------------------------------------------------*/
  
  
  
  onSubmit() {
    if (this.itemForm.valid) {
      this.httpService.createHospital(this.itemForm.value).subscribe(
        (data: any) => {
          this.itemForm.reset();
          this.getHospital();
        },
        error => {
          this.showError = true;
          this.errorMessage = "An error occurred while creating hospital. Please try again later.";
          console.error('Error creating hospital:', error);
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }



   /*---------------------------------------------------------------------------------------------------------------------------------*/
  

  Addequipment(value: any) {
    this.equipmentForm.controls['hospitalId'].setValue(value.id);
  }




   /*---------------------------------------------------------------------------------------------------------------------------------*/
  

  submitEquipment() {
    if (this.equipmentForm.valid) {
      this.showMessage = false;
      this.httpService.addEquipment(this.equipmentForm.value, this.equipmentForm.controls['hospitalId'].value).subscribe(
        (data: any) => {
          this.showMessage = true;
          this.responseMessage = `Equipment added successfully`;
        },
        error => {
          this.showError = true;
          this.errorMessage = "An error occurred while adding equipment. Please try again later.";
          console.error('Error adding equipment:', error);
        }
      );
    } else {
      this.equipmentForm.markAllAsTouched();
    }
  }
}