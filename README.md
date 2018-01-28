# ngx-simpl-schema-validation
Simple Schema validator factory for Angular 4.3+

## Example usage

### test-form.component.html

```html
<form [ngForm]="form">
  <input type="text" formControlName="name">
  <p class="error" *ngIf="vf.hasErrorMessages('name')">{{vf.getFirstErrorMessage('name')}}</p>
  <input type="text" formControlName="count">
  <p class="error" *ngIf="vf.hasErrorMessages('count')">{{vf.getFirstErrorMessage('count')}}</p>
  <input type="submit" value="Submit">
</form>
```

### test-form.component.ts

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import SimpleSchema from 'simpl-schema';

import { SimpleSchemaValidatorFactory } from 'ngx-simpl-schema-validation';

const schema = new SimpleSchema({
  name: String,
  count: Number,
}, {
  clean: {
    removeEmptyStrings: true,
  },
});

@Component({
  selector: 'nssv-test-form',
  templateUrl: './test-form.component.html',
})
export class TestFormComponent {
  form: FormGroup;
  vf: SimpleSchemaValidatorFactory;

  constructor(
    private fb: FormBuilder,
  ) {
    this.vf = new SimpleSchemaValidatorFactory(schema);
    const formDef = Object
      .keys(schema.schema())
      .reduce((group, key) => Object.assign(group, {
        [key]: [''],
      }), {})
    ;
    this.form = fb.group(formDef);
    this.vf.connectForm(this.form);
    this.vf.connectControl();
  }
}
```
