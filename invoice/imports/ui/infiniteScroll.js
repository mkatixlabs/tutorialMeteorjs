import { 
	Template 
} from 'meteor/templating';

import './infiniteScroll.html';

Template.InfiniteScroll.onRendered(function() {
	const controllerState = Iron.controller().state
  	this.scrollHandler = () => {
    	return showMoreVisible(controllerState);
  	}
  	$(window).on("scroll" , this.scrollHandler);
});

Template.InfiniteScroll.onDestroyed(function() {
	$(window).off("scroll", this.scrollHandler);
});

const LOAD_SIZE = 25
function showMoreVisible(state) {
    var threshold, target = $("#showMoreResults");

    if (!target.length) 
    	return;
 
    threshold = $(window).scrollTop() + $(window).height() - target.height();
    if (target.offset().top < threshold) {
        if (!target.data("visible")) {
        	setItemsLimit(state, getItemsLimit(state) + LOAD_SIZE)
        }
    } else {
        if (target.data("visible")) {
            target.data("visible", false);
        }
    }        
}

function getItemsLimit(state) {
	return state.get("itemsLimit")
}

function setItemsLimit(state, newLimit) {
	state.set('itemsLimit', newLimit)
}
 
Template.InfiniteScroll.helpers({

 	moreResults() {
 		const instance = Template.instance().data
  		return !(instance.loadedItems < getItemsLimit(Iron.controller().state));
  	},

});
