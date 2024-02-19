import { plainToInstance } from 'class-transformer';
import { CreateTripDto } from './create-trip.dto';
import { validate } from 'class-validator';
import { UpdateTripDto } from './update-trip.dto';
import { CreatePaymentDto } from './cretate-payment.dto';

describe('CreatePayment DTO', () => {
  it('CreatePayment DTO should work on success case', async () => {
    const createTest = {
      tokenized_payment: 'abcd12345',
      acceptance_token: 'abcd12345',
    };
    const ofImportDto = plainToInstance(CreatePaymentDto, createTest);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBe(0);
    expect(errors.toString()).toBe('');
  });

  it('CreatePayment DTO should work on fail case', async () => {
    let createTest = {
      tokenized_payment: 'a',
      acceptance_token: 'abcd12345',
    };
    let ofImportDto = plainToInstance(CreatePaymentDto, createTest);
    let errors = await validate(ofImportDto);
    expect(errors.length).not.toBe(0);
    expect(errors.toString()).toContain('tokenized_payment has fail');

    createTest = {
      tokenized_payment: 'abcd12345',
      acceptance_token: 'a',
    };
    ofImportDto = plainToInstance(CreatePaymentDto, createTest);
    errors = await validate(ofImportDto);
    expect(errors.length).not.toBe(0);
    expect(errors.toString()).toContain('acceptance_token has fail');
  });
});

describe('Create DTO', () => {
  it('Create DTO should work on success case', async () => {
    const createTest = {
      startLocation: { longitude: 0, latitude: 0 },
      startTime: new Date(),
    };
    const ofImportDto = plainToInstance(CreateTripDto, createTest);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBe(0);
    expect(errors.toString()).toBe('');
  });

  it('Create DTO should work on fail case', async () => {
    let createTest = {
      startLocation: { longitude: '0', latitude: 0 },
      startTime: new Date(),
    } as any;
    let ofImportDto = plainToInstance(CreateTripDto, createTest);
    let errors = await validate(ofImportDto);
    expect(errors.length).not.toBe(0);
    expect(errors.toString()).toContain('startLocation.longitude has fail');

    createTest = {
      startLocation: { longitude: 0, latitude: '0' },
      startTime: new Date(),
    } as any;
    ofImportDto = plainToInstance(CreateTripDto, createTest);
    errors = await validate(ofImportDto);
    expect(errors.length).not.toBe(0);
    expect(errors.toString()).toContain('startLocation.latitude has fail');

    createTest = {
      startLocation: { longitude: 0, latitude: 0 },
      startTime: '',
    } as any;
    ofImportDto = plainToInstance(CreateTripDto, createTest);
    errors = await validate(ofImportDto);
    expect(errors.length).not.toBe(0);
    expect(errors.toString()).toContain('startTime has fail');
  });
});

describe('Update DTO', () => {
  it('Update DTO should work on success case', async () => {
    const createTest = {
      endLocation: { longitude: 0, latitude: 0 },
      endTime: new Date(),
    };
    const ofImportDto = plainToInstance(UpdateTripDto, createTest);
    const errors = await validate(ofImportDto);
    expect(errors.length).toBe(0);
    expect(errors.toString()).toBe('');
  });

  it('Update DTO should work on fail case', async () => {
    let createTest = {
      endLocation: { longitude: '0', latitude: 0 },
      endTime: new Date(),
    } as any;
    let ofImportDto = plainToInstance(UpdateTripDto, createTest);
    let errors = await validate(ofImportDto);
    expect(errors.length).not.toBe(0);
    expect(errors.toString()).toContain('endLocation.longitude has fail');

    createTest = {
      endLocation: { longitude: 0, latitude: '0' },
      endTime: new Date(),
    } as any;
    ofImportDto = plainToInstance(UpdateTripDto, createTest);
    errors = await validate(ofImportDto);
    expect(errors.length).not.toBe(0);
    expect(errors.toString()).toContain('endLocation.latitude has fail');

    createTest = {
      endLocation: { longitude: 0, latitude: 0 },
      endTime: '',
    } as any;
    ofImportDto = plainToInstance(UpdateTripDto, createTest);
    errors = await validate(ofImportDto);
    expect(errors.length).not.toBe(0);
    expect(errors.toString()).toContain('endTime has fail');
  });
});
