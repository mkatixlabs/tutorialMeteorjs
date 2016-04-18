import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict';
import './loadingIndicator.html'

Template.LoadingIndicator.onRendered(function() {

  	this.scrollHandler = () => {
    	return showMoreVisible(this)
  	}
  	$(window).on("scroll" , this.scrollHandler)
});

Template.LoadingIndicator.onDestroyed(function() {
	$(window).off("scroll", this.scrollHandler)
});

function setLoadingCondition(state, condition) {
    return state.set('loadingCondition', condition)
}

function getLoadingCondition(state) {
    return state.get('loadingCondition')
}

function showMoreVisible(instance) {
    var threshold, target = $("#showMoreResults")
    
    if (!target.length) 
    	return
 
    threshold = $(window).scrollTop() + $(window).height() - target.height()
    if (target.offset().top < threshold) {
        if (!target.data("visible")) {
        	instance.data.update()
        }
    } else {
        if (target.data("visible")) {
            target.data("visible", false)
        }
    }        
}

Template.LoadingIndicator.helpers({

 	loading() {
 		const instance = Template.instance()
  		return instance.data.loadingCondition
  	},

});
