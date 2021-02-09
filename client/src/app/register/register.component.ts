import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { IMember } from '../models/member';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() userFromHomeComponent: IMember[];
  @Output() cancelRegister = new EventEmitter();
   registerForm: FormGroup;
   maxDate: Date;
  constructor(private account: AccountService, private formBuilder: FormBuilder,
              private localeService: BsLocaleService, private router: Router,
              private toastr: ToastrService) {

              }

  ngOnInit(): void {
     this.applyLocale();
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', [Validators.required]),
    //   password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
    //   confirmPassword: new FormControl('', [Validators.required, this.compareTo('password')])
    // });

     this.registerForm = this.formBuilder.group({
      gender: ['female'],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, this.compareTo('password')]],
      knowAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
     this.maxDate = new Date();
     this.maxDate.setFullYear( this.maxDate.getUTCFullYear() - 18);
  }


  compareTo(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value  === control?.parent?.controls[matchTo].value ? null : {isMatching: true};
    };
  }

  register(): void{
    // console.log(this.registerForm.value);
    this.account.register(this.registerForm.value).subscribe(() => {
    //  dont care about response
    this.toastr.success('welcome');
    this.router.navigateByUrl('/members');
    }, error => {
      this.toastr.error(error.error);
    });
  }

  cancel(): void {
    this.cancelRegister.emit(false);
  }

  applyLocale(): void{
    this.localeService.use('bg');
  }

}
