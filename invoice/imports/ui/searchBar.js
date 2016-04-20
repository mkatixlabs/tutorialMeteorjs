import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict';

import './searchBar.html'

Template.SearchBar.onCreated(function bodyOnCreated() {
  
  this.state = new ReactiveDict(0)
  this.state.set('selectedSearchField', null)	
  
  this.autorun( () => {
	  setSelectedSearchField(this.state, this.data.searchFields[0])	
	})
  
});  

function getSelectedSearchField(state) {
  return state.get('selectedSearchField')
}

function setSelectedSearchField(state, value) {
  state.set('selectedSearchField', value)
}

function getQueryValue(instance) {
    return instance.$('.searchValue')[0].value
}

function cleanQueryValue(instance) {
  instance.$('.searchValue')[0].value = ''
}

function createQuery(instance) {
  return {'value': getQueryValue(instance) , 'findBy': getQuerySearchBy(instance)}
}

function waitAndSearchTheQuery(instance, waitTime) {
  return _.debounce(function() {
        const query = {'value': getQueryValue(instance) , 'findBy': getSelectedSearchField(instance.state)}
        instance.data.searchOn(query)
    }, waitTime)()
}

Template.SearchBar.helpers({

  searchFields() {
    const instance = Template.instance()
    return instance.data.searchFields //  could pass a function to invoices table to clean the search ? =S
  },
  
  selectedSearchField() {
    const instance = Template.instance()
    return getSelectedSearchField(instance.state)
  },
  
})

Template.SearchBar.events({
    
   /*'keypress .searchValue': (event, template) => {
     const instance = Template.instance()
     const preSearch = 4 
     const value = event.target.value
     console.log(value.length)
     if (value.length >= preSearch) {
        console.log("pre busquedad!")
        //$('.dropdown-toggle').dropdown()
        
        const query = {'value': getQueryValue(instance) , 'findBy': getQuerySearchBy(instance)}
        const invoices = instance.data.preFind(query)
        invoices.forEach(function(element) {
        }, this);
     }
     
  },*/
  
  'click .selectSearchField': (event, template) => {
     const instance = Template.instance()
     setSelectedSearchField(instance.state, event.target.value)
  },
  
  'keypress .searchValue': (event, template) => {
    const instance = Template.instance()
    const debounceWaitTime = 800
    waitAndSearchTheQuery(instance, debounceWaitTime)
  },
  
})