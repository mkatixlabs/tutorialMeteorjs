import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Invoices } from '../api/invoices.js';

import './searchBar.js';
import './loadingIndicator.js'
import './timeFilters.js';
import '../helpers/dateFormating.js'
import './invoicesTable.html';

Template.InvoicesTable.onCreated(function bodyOnCreated() {
  const limit = 25
	this.state = new ReactiveDict(0)
	// loading indicator
  this.state.set('loadedInvoices', 0)	
  this.state.set('invociesLimit', limit)
  this.state.set('invoicesIncrement', limit)
  // search bar
  this.state.set('search', false)
  this.state.set('searchQuery', {})
  
	this.autorun( () => {
		Meteor.subscribe('invoices', getInvociesLimit(this.state));
	})
});  

function getQueryFromState(state) {
  const query = state
  delete query.timeFilter
  return query
}

// for loading indicator
function getInvociesLimit(state) {
  return state.get("invociesLimit")
}

function setInvociesLimit(state, newLimit) {
  return state.set("invociesLimit", newLimit)
}

function getInvoicesIncrement(state) {
  return state.get("invoicesIncrement")
}

 function getLoadedInvoices(state) { 
    return state.get('loadedInvoices')
 }
 
 function getInvoicesSearchFields() {
    return  ["invoicesNumber", "email"]
 }
 
// for search 
function searchIsActivate(state) {
  return state.get("search")
}

function setSearch(state, onOff) {
  state.set("search", onOff)
}

function getSearchQuery(state) {
  return state.get("searchQuery")
}

function setSearchQuery(state, query) {
  state.set("searchQuery", query)
}

Template.InvoicesTable.helpers({
 
  invoices() {
  	const instance = Template.instance()
    let invoices = {}
    
    if (!searchIsActivate(instance.state)) {
      const timeFilterQuery = Invoices.createTimeFilterQuery(instance.data.timeFilter)
      invoices = Invoices.findBy(timeFilterQuery, instance.data.sort, getInvociesLimit(instance.state))
    } else {
      console.log("entre!")
      const searchFilterQuery = Invoices.createSearchFilterQuery(getSearchQuery(instance.state))
      invoices = Invoices.findBy(searchFilterQuery, instance.data.sort, getInvociesLimit(instance.state))
    }
    console.log(invoices.count())
    instance.state.set('loadedInvoices', invoices.count())
  	return invoices
  },

  currentTimeFilter() {
    const instance = Template.instance().data
    return instance.timeFilter
  },

  onTimeFilterSelected() { 
    const instance = Template.instance()
    return function(timeFilter) {
      setSearch(instance.state, false)
      Router.go('invoices', {
        timeFilter: timeFilter
      }, {
        query: getQueryFromState(Iron.controller().state.all())
      })
    }
  },
  
  ifMoreResults() {
    const instance = Template.instance()
    return !(getLoadedInvoices(instance.state) < getInvociesLimit(instance.state))
  },

  updateInvoicesLimit () {
    const instance = Template.instance()
    return function() {
      setInvociesLimit(instance.state, getInvociesLimit(instance.state) + getInvoicesIncrement(instance.state))
    }
  },
  
  getSearchFields() {
    return getInvoicesSearchFields()
  },
  
  searchOn() {
    const instance = Template.instance()
    return function(query) {   
      setSearch(instance.state, true)
      setSearchQuery(instance.state, query)
    }
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
