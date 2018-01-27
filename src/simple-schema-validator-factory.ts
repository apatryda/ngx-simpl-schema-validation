import 'rxjs/add/operator/startWith';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import SimpleSchema from 'simpl-schema';

interface ISimpleSchemaValidatorFactoryErrors {
  [path: string]: {
    [type: string]: string;
  };
}

export class SimpleSchemaValidatorFactory {
  private context: any;
  private errors: ISimpleSchemaValidatorFactoryErrors = {};
  private form: FormGroup;
  private formValueChangesSubscription: Subscription;

  constructor(
    private schema: any,
  ) {
    this.context = schema.newContext();
  }

  connectForm(form: FormGroup) {
    const onValueChanges = (value) => {
      this.context.validate(this.context.clean(value));
      const validationErrors = this.context.validationErrors();
      const oldErrors = this.errors;
      const newErrors = validationErrors.reduce(
        (errors, { name: path, type }) => Object.assign(errors, {
          [path]: Object.assign(errors[path] || {}, {
            [type]: this.context.keyErrorMessage(path),
          }),
        }),
        {}
      );
      this.errors = newErrors;

      const paths = new Set([
        ...Object.keys(oldErrors),
        ...Object.keys(newErrors),
      ]);

      paths.forEach((path) => {
        const oldPathErrors = oldErrors[path] || {};
        const newPathErrors = newErrors[path] || {};
        const types = new Set([
          ...Object.keys(oldPathErrors),
          ...Object.keys(newPathErrors),
        ]);

        let pathValidityChanged = false;
        types.forEach((type) => {
          pathValidityChanged = pathValidityChanged || newPathErrors[type] !== oldPathErrors[type];
        });

        if (pathValidityChanged) {
          const control = form.get(path);
          if (control) {
            control.updateValueAndValidity({ emitEvent: false });
          }
        }
      });
    };

    this.disconnectForm();
    this.form = form;
    this.formValueChangesSubscription = form.valueChanges
      .startWith(form.value)
      .subscribe(onValueChanges)
    ;
  }

  connectControl(control: AbstractControl, path?: string) {
    const validator = this.createControlValidator(path);
    if (validator) {
      control.setValidators(validator);
    } else {
      control.clearValidators();
    }

    if (control instanceof FormArray) {
      const { controls } = control;
      controls.forEach((childControl, key) => {
        const childPath = path ? `${path}.${key}` : `${key}`;
        this.connectControl(childControl, childPath);
      });
    } else if (control instanceof FormGroup) {
      const { controls } = control;
      Object.keys(controls).forEach((key) => {
        const childControl = controls[key];
        const childPath = path ? `${path}.${key}` : key;
        this.connectControl(childControl, childPath);
      });
    }
  }

  createControlValidator(path?: string): ValidatorFn {
    if (!path) {
      return () => null;
    }

    return () => this.errors[path] || null;
  }

  disconnectForm() {
    this.form = null;
    this.resetErrors();
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  getErrorMessages(path?: string): string[] {
    return SimpleSchemaValidatorFactory.getErrorMessages(this.form, path);
  }

  getFirstErrorMessage(path?: string): string {
    return SimpleSchemaValidatorFactory.getFirstErrorMessage(this.form, path);
  }

  hasErrorMessages(path?: string): boolean {
    return SimpleSchemaValidatorFactory.hasErrorMessages(this.form, path);
  }

  hasErrors(path?: string): boolean {
    return SimpleSchemaValidatorFactory.hasErrors(this.form, path);
  }

  resetErrors() {
    this.errors = {};
  }

  static getErrorMessages(form: FormGroup, path?: string): string[] {
    if (!form) {
      return [];
    }
    const control: AbstractControl = path ? form.get(path) : form;
    const errorCodes = control && control.errors ? Object.keys(control.errors) : [];
    const errorMessages = errorCodes.filter(error =>
      typeof control.getError(error) === 'string'
    );
    return errorMessages;
  }

  static getFirstErrorMessage(form: FormGroup, path?: string): string | null {
    if (!form) {
      return null;
    }
    const control: AbstractControl = path ? form.get(path) : form;
    const errorMessages = this.getErrorMessages(form, path);
    return errorMessages.length
      ? control.getError(errorMessages[0])
      : null
    ;
  }

  static hasErrorMessages(form: FormGroup, path?: string): boolean {
    if (!form) {
      return false;
    }
    const errorMessages = this.getErrorMessages(form, path);
    return !!errorMessages.length;
  }

  static hasErrors(form: FormGroup, path?: string): boolean {
    if (!form) {
      return false;
    }
    const control: AbstractControl = path ? form.get(path) : form;
    const errorCodes = control && control.errors ? Object.keys(control.errors) : [];
    return errorCodes.reduce((hasError, errorCode) => hasError || control.hasError(errorCode), false);
  }
}
