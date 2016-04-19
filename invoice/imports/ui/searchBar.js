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
  console.log(instance.$('.searchValue')[0].value)
    return instance.$('.searchValue')[0].value
}

function createQuery(instance) {
  return {'value': getQueryValue(instance) , 'findBy': getQuerySearchBy(instance)}
}

Template.SearchBar.helpers({

  searchFields() {
    const instance = Template.instance()
    return instance.data.searchFields
  },
  
  selectedSearchField() {
    const instance = Template.instance()
    return getSelectedSearchField(instance.state)
  }
 
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
     console.log(event.target.value)
     setSelectedSearchField(instance.state, event.target.value)
  },
  
  'keypress .searchValue': (event, template) => {
    const instance = Template.instance()
    const query = {'value': getQueryValue(instance) , 'findBy': getSelectedSearchField(instance.state)}
    instance.data.searchOn(query)
  },
  
})