import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict';
import './paging.html' 

Template.Paging.helpers({
    disableNext(actualPages, totalPages) {
        let disabled = ''
        if (actualPages >= totalPages) {
            disabled = 'disabled'
        }
        return disabled
    },
    
    disablePrevious(actualPages) {
        let disabled = ''
        if (actualPages <= 1) {
            disabled = 'disabled'
        }
        return disabled
    }
});

Template.Paging.events({
    
    'click .loadPage': (event, template) => {
        const instance = Template.instance().data
        instance.onPaging(event.target.id)
        event.preventDefault() 
    },
    
})
