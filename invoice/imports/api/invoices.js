import { Mongo } from 'meteor/mongo';
 
export const Invoices = new Mongo.Collection('invoices');

/*Invoices.schema = new SimpleSchema({
  invoiceNumber: {type: String},
  total: {type: Number, defaultValue: 0},
  createdAt: {type: Date, defaultValue: new Date()}
});*/