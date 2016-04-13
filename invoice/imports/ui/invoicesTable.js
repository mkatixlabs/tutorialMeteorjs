
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Invoices } from '../api/invoices.js';

import moment from 'moment';
import './invoicesTable.html';


Template.invoicesTable.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict()
	this.state.set('dateFilterType', 'all')
	this.state.set('sortTotal', 'asc')
	this.state.set('sortCreatedAt', 'asc')

 	Meteor.subscribe('invoices', createQueryFilter(this.state));
});


function getDateFilter(type) {
	switch (type) {
  		case "today":
  			return moment().subtract(1, 'days').startOf('day')
  		case "month":
  			return moment().subtract(1, 'months').startOf('day')
  		case "week":
  			return moment().subtract(1, 'weeks').startOf('day')
  		case "all":
  			return null;
  	} 
}

function createQueryFilter(state) {
	const dateFilter = getDateFilter(state.get('dateFilterType'))
 	const queryFilter = {}
	/* $gte selects the documents where the value of the field is greater than or equal to (i.e. >=)
  		a specified value (e.g. value.) */
  	if (dateFilter !== null) {
    	queryFilter.createdAt = {
    	$gte: dateFilter.toDate()
    	}
  	}
  	return queryFilter
}

function createSort(state) {
  return {
  	total: state.get('sortTotal') === 'asc' ? 1 : -1,
  	createdAt: state.get('sortCreatedAt') === 'asc' ? 1 : -1,
  }
}

Template.invoicesTable.helpers({
  invoices() {
  	const state = Template.instance().state
 	const queryFilter = createQueryFilter(state)
 	const sortedBy = createSort(state)

  	return Invoices.find(queryFilter, {sort: sortedBy})
  },
  dateFormating(date) {
  	return moment(date).format('YYYY-MM-DD')
  },
});

Template.invoicesTable.events({
  'click .filter'(event, instance) {
  	instance.state.set('dateFilterType', event.target.value)
  },
  'click .sort'(event, instance) {
  	const sortType = event.target.value
  	let sortValue = instance.state.get(sortType)
  	sortValue === 'asc' ? sortValue = 'desc' : sortValue = 'asc'
  	instance.state.set(sortType, sortValue)
  },
});
