
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Invoices } from '../api/invoices.js';

import moment from 'moment';
import './invoicesTable.html';


Template.invoicesTable.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict()
	this.state.set('filterType', 'all')
 	Meteor.subscribe('invoices');
});


function getDateFilter(type) {
	switch (type) {
  		case "today":
  			return moment().subtract( 1, 'days' ).startOf( 'day' )
  		case "month":
  			return moment().subtract( 1, 'months' ).startOf( 'day' )
  		case "week":
  			return moment().subtract( 1, 'weeks' ).startOf( 'day' )
  		case "all":
  			return null;
  	} 
}

Template.invoicesTable.helpers({
  invoices() {
  	const instance = Template.instance()
  	const dateFilter = getDateFilter(instance.state.get('filterType'))
 	const queryFilter = {};

  	if ( dateFilter !== null ) {
    	queryFilter.createdAt = {
    	$gte: dateFilter.toDate()
    	}
  	}
  	return Invoices.find(queryFilter,{})
  },
  dateFormating(date) {
  	return moment(date).format('YYYY-MM-DD')
  },
});

Template.invoicesTable.events({
  'click .filter'(event, instance) {
  	instance.state.set('filterType', event.target.value)
  },
});
