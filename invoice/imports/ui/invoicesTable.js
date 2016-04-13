import {
	Meteor 
} from 'meteor/meteor';
import { 
	Template 
} from 'meteor/templating';
import { 
	ReactiveDict 
} from 'meteor/reactive-dict';
import { 
	Invoices 
} from '../api/invoices.js';

import moment from 'moment';
import './invoicesTable.html';

Template.invoicesTable.onCreated(function bodyOnCreated() {

	const controller = Iron.controller();
 	Meteor.subscribe('invoices', createQueryDateFilter(controller.state));
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

function createQueryDateFilter(state) {
	const dateFilter = getDateFilter(state.get('dateFilter'))
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

function getQueryFromState( state ) {
  const query = state
  delete query.dateFilter
  return query
}

Template.invoicesTable.helpers({
  invoices() {
  	const controller = Iron.controller();

 	const queryFilter = createQueryDateFilter(controller.state)
 	const sortedBy = createSort(controller.state)

  	return Invoices.find(queryFilter, {sort: sortedBy})
  },
  dateFormating(date) {
  	return moment(date).format('YYYY-MM-DD')
  },
  test(){
  	console.log("test")
  }
});

Template.invoicesTable.events({
  'click .filter'(event, instance) {
  	
   	Router.go('invoices', {
       dateFilter: event.target.value
    }, {
        query: getQueryFromState(Iron.controller().state.all())
    })

  },
  'click .sort'(event, instance) {
  	const controller = Iron.controller();
  	const sortType = event.target.value
  	let sortValue = controller.state.get(sortType)
  	sortValue === 'asc' ? sortValue = 'desc' : sortValue = 'asc'
  	controller.state.set(sortType, sortValue)

   	Router.go('invoices', {
       dateFilter: controller.state.get('dateFilter')
    }, {
        query: getQueryFromState(controller.state.all())
    })
  },
});
