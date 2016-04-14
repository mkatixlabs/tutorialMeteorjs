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
	const controllerState = Iron.controller().state
	this.state = new ReactiveDict(0)
	this.state.set('loadedInvoices', 0)
	  	//this.state.set('loadedInvoices', this.state.get('loadedInvoices') + 5)
	
	this.autorun( () => {
		Meteor.subscribe('invoices', createQueryDateFilter(controllerState), createQuerySortAndLimit(controllerState));
	})
 
});  

Template.invoicesTable.onRendered(function(){
  const controllerState = Iron.controller().state;
  this.scrollHandler = () => {
    return showMoreVisible(controllerState);
  }

  $(window).on("scroll" ,this.scrollHandler);
});

Template.invoicesTable.onDestroyed(function(){
  $(window).off("scroll", this.scrollHandler);
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

function getLoadLimit(state) {
	return state.get('invoiceLimit')
}

function createQuerySortAndLimit(state) {
	return {
		sort: createSort(state),
		limit: getLoadLimit(state)
	}
}

function getQueryFromState( state ) {
  const query = state
  delete query.dateFilter
  return query
}

const LOAD_SIZE = 20
function showMoreVisible(state) {
    var threshold, target = $("#showMoreResults");

    if (!target.length) 
    	return;
 
    threshold = $(window).scrollTop() + $(window).height() - target.height();
    if (target.offset().top < threshold) {
        if (!target.data("visible")) {
            state.set("invoiceLimit", state.get("invoiceLimit") + LOAD_SIZE);
        }
    } else {
        if (target.data("visible")) {
            target.data("visible", false);
        }
    }        
}
 
function getLoadedInvoices(state) {
	return state.get('loadedInvoices')
}

Template.invoicesTable.helpers({
 
  invoices() {
  	const controllerState = Iron.controller().state;
  	const instance = Template.instance()
  	const invoices = Invoices.find(createQueryDateFilter(controllerState), createQuerySortAndLimit(controllerState))
  	instance.state.set('loadedInvoices', invoices.count())

  	return invoices
  },

  dateFormating(date) {
  	return moment(date).format('YYYY-MM-DD')
  },

  moreResults() {
  	const controllerState = Iron.controller().state;
  	const templateState = Template.instance().state
  	return !(getLoadedInvoices(templateState) < getLoadLimit(controllerState));
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
  	const controllerState = Iron.controller().state;
  	const sortType = event.target.value
  	let sortValue = controllerState.get(sortType)
  	sortValue === 'asc' ? sortValue = 'desc' : sortValue = 'asc'
  	controllerState.set(sortType, sortValue)

   	Router.go('invoices', {
       dateFilter: controllerState.get('dateFilter')
    }, {
        query: getQueryFromState(controllerState.all())
    })
  },

});
