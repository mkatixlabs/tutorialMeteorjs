
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Invoices } from '../api/invoices.js';

import moment from 'moment';
import './invoicesTable.html';

Template.invoicesTable.helpers({
  invoices() {
    return Invoices.find({});
  },
  dateFormating(date) {
  	return moment(date).format('YYYY-MM-DD');
  }
});


