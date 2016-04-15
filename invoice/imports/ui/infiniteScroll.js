import { Template } from 'meteor/templating';


import './infiniteScroll.html';


Template.InfiniteScroll.onRendered(function() {

  	this.scrollHandler = () => {
    	return showMoreVisible(this);
  	}
  	$(window).on("scroll" , this.scrollHandler);
});

Template.InfiniteScroll.onDestroyed(function() {
	$(window).off("scroll", this.scrollHandler);
});

function showMoreVisible(instance) {
    var threshold, target = $("#showMoreResults");

    if (!target.length) 
    	return;
 
    threshold = $(window).scrollTop() + $(window).height() - target.height();
    if (target.offset().top < threshold) {
        if (!target.data("visible")) {
        	instance.data.updateItemsLimit()
        }
    } else {
        if (target.data("visible")) {
            target.data("visible", false);
        }
    }        
}

Template.InfiniteScroll.helpers({

 	moreResults() {
 		const instance = Template.instance().data
  		return !(instance.loadedItems < instance.itemsLimit);
  	},

});
