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
import './infiniteScroll.js'
import './timeFilters.js';
import './invoicesTable.html';

Template.InvoicesTable.onCreated(function bodyOnCreated() {
	const controllerState = Iron.controller().state
	this.state = new ReactiveDict(0)
	this.state.set('loadedInvoices', 0)
	
	this.autorun( () => {
		Meteor.subscribe('invoices', createQuerytimeFilter(controllerState), createQuerySortAndLimit(controllerState));
	})
 
});  

// filter functions
function getTimeFilter(type) {
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


function createQuerytimeFilter(state) {
	const timeFilter = getTimeFilter(state.get('timeFilter'))
 	const queryFilter = {}

  if (timeFilter !== null) {
    queryFilter.createdAt = {
      $gte: timeFilter.toDate()
    }
  }
  return queryFilter
}

// sort functions
function createSort(state) {
  return {
  	total: state.get('sortTotal') === 'asc' ? 1 : -1,
  	createdAt: state.get('sortCreatedAt') === 'asc' ? 1 : -1,
  }
}


function getLoadLimit(state) {
	return state.get('itemsLimit') // dont like it, coupling with route controller
}

function createQuerySortAndLimit(state) {
	return {
		sort: createSort(state),
		limit: getLoadLimit(state)
	}
}

function getQueryFromState(state) {
  const query = state
  delete query.timeFilter
  return query
}

Template.InvoicesTable.helpers({
 
  invoices() {
  	const controllerState = Iron.controller().state;
  	const instance = Template.instance()
  	const invoices = Invoices.find(createQuerytimeFilter(controllerState), createQuerySortAndLimit(controllerState))
  	instance.state.set('loadedInvoices', invoices.count())
  	return invoices
  },

  currentTimeFilter() {
    return  Iron.controller().state.get('timeFilter')
  },

  onTimeFilterSelected() { 
    return function(timeFilter) {
      Router.go('invoices', {
        timeFilter: timeFilter
      }, {
        query: getQueryFromState(Iron.controller().state.all())
      })
    }
  },

  loadedInvoices() { // passed to infiniteScroll
    const instance = Template.instance()
    return instance.state.get('loadedInvoices')
  },

  dateFormating(date) {
  	return moment(date).format('YYYY-MM-DD')
  },

});

Template.InvoicesTable.events({

  'click .sort'(event, instance) {
    const controllerState = Iron.controller().state;
    const sortType = event.target.value
    let sortValue = controllerState.get(sortType)
    sortValue === 'asc' ? sortValue = 'desc' : sortValue = 'asc'
    controllerState.set(sortType, sortValue)

    Router.go('invoices', {
       timeFilter: controllerState.get('timeFilter')
    }, {
        query: getQueryFromState(controllerState.all())
    })
  },

});
