import {
  Template
} from 'meteor/templating'

import './timeFilters.html'

Template.TimeFilters.helpers( {

  getActiveClass(buttonId) {
    return this.active === buttonId ? 'on' : 'off';
  }

})

Template.TimeFilters.events( {

  'click .time-filter': (event, template) => {
    const instance = Template.instance().data
    instance.onTimeFilterSelected(event.target.id)
    event.preventDefault() 
  }
})