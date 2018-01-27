/// <reference types="mocha" />
/// <reference path="../declarations.d.ts" />

import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as chai from 'chai';
import spies = require('chai-spies');
import SimpleSchema from 'simpl-schema';
import { SimpleSchemaValidatorFactory } from './simple-schema-validator-factory';

chai.use(spies);

const {
  assert,
  expect,
  spy,
} = chai;

describe('SimpleSchemaValidationFactory', function() {
  describe('connected to a valid form', function() {
    const schema = new SimpleSchema({
      name: String,
    }, {
      clean: {
        removeEmptyStrings: true,
      },
    });
    const vf = new SimpleSchemaValidatorFactory(schema);
    const form = new FormGroup({
      name: new FormControl('percent'),
    });

    describe('when set with an invalid value', function() {
      let changedStatus;
      let changedValue;
      const statusChangesSpy = spy((status) => {
        changedStatus = status;
      });
      const valueChangesSpy = spy((value) => {
        changedValue = value;
      });
      form.statusChanges.subscribe(statusChangesSpy);
      form.valueChanges.subscribe(valueChangesSpy);
      vf.connectControl(form);
      vf.connectForm(form);

      form.setValue({ name: '' });

      it('should result in an invalid form control', function(done) {
        setTimeout(() => {
          assert.equal(form.get('name').invalid, true);
          done();
        }, 100);
      });

      it('should result in an invalid form', function(done) {
        setTimeout(() => {
          assert.equal(form.invalid, true);
          done();
        }, 100);
      });

      it('should emit statusChanges once', function(done) {
        setTimeout(() => {
          expect(statusChangesSpy).to.have.been.called.once;
          done();
        }, 100);
      });

      it('should emit valueChanges once', function(done) {
        setTimeout(() => {
          expect(valueChangesSpy).to.have.been.called.once;
          done();
        }, 100);
      });

      it('should result in an \'INVALID\' changed status', function(done) {
        setTimeout(() => {
          expect(changedStatus).to.equal('INVALID');
          done();
        }, 100);
      });

      it('should result in a changed value', function(done) {
        setTimeout(() => {
          expect(changedValue.name).to.equal('');
          done();
        }, 100);
      });
    });
  });

  describe('connected to a form with a valid path `a`', () => {
    const schema = new SimpleSchema({
      a: String,
    }, {
      clean: {
        removeEmptyStrings: true,
      },
    });
    const vf = new SimpleSchemaValidatorFactory(schema);
    const form = new FormGroup({
      a: new FormControl('valid ', vf.createControlValidator('a')),
    });
    vf.connectForm(form);

    it('should not fail with structure changed so that path `a` does not exist', (done) => {
      form.removeControl('a');
      setTimeout(done, 100);
    });
  });
});
