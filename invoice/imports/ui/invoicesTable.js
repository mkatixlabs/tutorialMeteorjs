import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Invoices } from '../api/invoices.js';

import './loadingIndicator.js'
import './timeFilters.js';
import '../helpers/dateFormating.js'
import './invoicesTable.html';

Template.InvoicesTable.onCreated(function bodyOnCreated() {
  const limit = 25
	this.state = new ReactiveDict(0)
	this.state.set('loadedInvoices', 0)	
  this.state.set('invociesLimit', limit)
  this.state.set('invoicesIncrement', limit)
	this.autorun( () => {
		Meteor.subscribe('invoices', this.data.timeFilter, this.data.sort, getInvociesLimit(this.state));
	})
});  

function getQueryFromState(state) {
  const query = state
  delete query.timeFilter
  return query
}

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

Template.InvoicesTable.helpers({
 
  invoices() {
  	const instance = Template.instance()
  	const invoices = Invoices.findByTimeFilter(instance.data.timeFilter, instance.data.sort, getInvociesLimit(instance.state))
  	instance.state.set('loadedInvoices', invoices.count())
  	return invoices
  },

  currentTimeFilter() {
    const instance = Template.instance().data
    return instance.timeFilter
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
