import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Invoices } from '../api/invoices.js';

import './searchBar.js';
import './paging.js'
import './timeFilters.js';
import '../helpers/dateFormating.js'
import './invoicesTable.html';

Template.InvoicesTable.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict(0)
  const limit = 30
  setInvociesLimit(this.state, limit)
  initStateForSearchBar(this.state)
  const controllerState =  Iron.controller().state
  
	this.autorun( () => {
    // if gets the values from this.data, autorun wont run again because wasnt attached a reactive variable 
    const timeFilterQuery = Invoices.createTimeFilterQuery(controllerState.get('timeFilter'))
    const sort = {
      sortTotal: controllerState.get('sortTotal'),
      sortCreatedAt: controllerState.get('sortCreatedAt'),
    }
    const limit = getInvociesLimit(this.state)
		Meteor.subscribe('invoices', timeFilterQuery , sort, limit);
    initStateForPaging(this.state, timeFilterQuery)
	})  
  
})

// for paging
function initStateForPaging(state, filter) { // run after subscribe
    setTotalPages(state, Invoices.totalInvoices(filter))
    setActualPage(state, 1)
}

function getActualSkipIndex(state) {  
  return (getInvociesLimit(state) * (getActualPage(state) - 1 ))
}

function getActualPage(state) {
  return state.get('actualPage')
}

function setActualPage(state, pageNumber) {
  state.set('actualPage', pageNumber)
}

function getTotalPages(state) {
  return state.get('totalPages')
}

function setTotalPages(state, totalInvoices) {
  state.set('totalPages', Math.ceil(totalInvoices / getInvociesLimit(state)))
}
  
// for filter
function getQueryFromState(state) {
  const query = state
  delete query.timeFilter
  return query
}

// for loading indicator
function initStateForLoadingIndicator(state, limit) {
  state.set('loadedInvoices', 0)	
  state.set('invociesLimit', limit)
  state.set('invoicesIncrement', limit)
}  

function getInvociesLimit(state) { // for paging to
  return state.get("invociesLimit")
}

function setInvociesLimit(state, newLimit) {  // for paging to
  return state.set("invociesLimit", newLimit)
}

function getInvoicesIncrement(state) {
  return state.get("invoicesIncrement")
}

function getLoadedInvoices(state) { 
  return state.get('loadedInvoices')
}
 
// for search  
function initStateForSearchBar(state) {
  state.set('search', false)
  state.set('searchQuery', {})
} 

function getInvoicesSearchFields() {
  return  ["invoiceNumber", "email"]
}
 
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

// time filters or search 
function createCorrectFilter(instance) {
   let filter = {}
   if (!searchIsActivate(instance.state)) {
    filter = Invoices.createTimeFilterQuery(instance.data.timeFilter)
   } else {
    filter = Invoices.createSearchFilterQuery(getSearchQuery(instance.state))
   }
   return filter
}

Template.InvoicesTable.helpers({
 
  invoices() {
  	const instance = Template.instance()
    
    const filter = createCorrectFilter(instance)
    const sort = instance.data.sort
    const limit = getInvociesLimit(instance.state)
    const skip = getActualSkipIndex(instance.state)
    
    const totalPages = Invoices.totalInvoices(filter)
    setTotalPages(instance.state, totalPages)
    
  	return Invoices.findBy(filter, sort, limit, skip) 
  },

  // for filters
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
  
  // for paging
  updateInvoices() {
    const instance = Template.instance()
    return function(event) {
      switch (event) {
        case 'next':
          setActualPage(instance.state, getActualPage(instance.state) + 1)
          break
        case 'previous':
          setActualPage(instance.state, getActualPage(instance.state) -1 )
          break
        case 'first':
          setActualPage(instance.state, 1)
          break
        case 'last':
          setActualPage(instance.state, getTotalPages(instance.state))
          break      
     }
   }
  },
  
  actualPage() {
    const instance = Template.instance()
    return getActualPage(instance.state)
  },
  
  totalPages() {
    const instance = Template.instance()
    return getTotalPages(instance.state)
  },
  
  // for loading indicator
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
  
  // for search methods
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
  
  // -> for partial results - todo! 
  findBy() {
     const instance = Template.instance()
     return function(query) {   
      setSearchQuery(instance.state, query)
      const searchFilterQuery = Invoices.createSearchFilterQuery(getSearchQuery(instance.state))
      return Invoices.findBy(searchFilterQuery, instance.data.sort, getInvociesLimit(instance.state))
    }
  }

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
