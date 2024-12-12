import { Component, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PrimeIcons } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { setDefaultParameter, setParameter } from 'src/app/store/parameters/parameters.actions';
import { SeguridadParameterModel } from 'src/shared/models/seguridad-parameter.model';

@Component({
  selector: 'app-parameters-set',
  standalone: true,
  imports: [InputTextModule, ButtonDirective, FormsModule, ReactiveFormsModule],
  templateUrl: './parameters-set.component.html'
})
@RegisterWidget('app-parameters-set', PrimeIcons.LIST_CHECK)
export class ParametersSetComponent implements OnInit {

  public parameterForm!: FormGroup<any>;

  parameters$ = input.required<any>({ alias: 'parameters' });

  // --------------------------------------------------------------------------------------------------------------------------------------------------
  constructor(private fb: FormBuilder, private store: Store) {
  }


  // --------------------------------------------------------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.parameterForm = this.fb.group({
      application: ['', [Validators.required]],
      parameter: ['', [Validators.required]],
      value: ['', [Validators.required]],
    });
  }


  // --------------------------------------------------------------------------------------------------------------------------------------------------
  onSubmit(): void {
    if (this.parameterForm.valid) {
      const parameterData: SeguridadParameterModel = {
        application: this.parameterForm.value.application,
        parameter: this.parameterForm.value.parameter,
        value: this.parameterForm.value.value,
      };
      this.store.dispatch(setParameter({ parameter: parameterData, showMessage: true }));
    }
  }

  // --------------------------------------------------------------------------------------------------------------------------------------------------
  // save the parameter but as a default one (user_id=0) to allow for when
  onDefault(): void {
    if (this.parameterForm.valid) {
      const parameterData: SeguridadParameterModel = {
        application: this.parameterForm.value.application,
        parameter: this.parameterForm.value.parameter,
        value: this.parameterForm.value.value,
      };
      this.store.dispatch(setDefaultParameter({ parameter: parameterData, showMessage: true }));
    }
  }
}
