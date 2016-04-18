import { Template } from 'meteor/templating'
import './searchBar.html'

Template.SearchBar.helpers({

  searchFields() {
    const instance = Template.instance()
    return instance.data.fields
  },
  
})

function getQueryValue(instance) {
    return  instance.$('.searchValue')[0].value
}

function getQuerySearchBy(instance) {
    return instance.$('.searchBy')[0].value
}

Template.SearchBar.events({
    
  'click .search': (event, template) => {
    const instance = Template.instance()
    const query = {'value': getQueryValue(instance) , 'findBy': getQuerySearchBy(instance)}
    instance.data.findBy(query)
    event.preventDefault() 
  },
  
})