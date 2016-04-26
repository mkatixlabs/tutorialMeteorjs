import '../imports/ui/invoicesTable.js';

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  	this.redirect('/invoices/all?sortBy=total&order=asc')
});

Router.route('/invoices/:timeFilter', function () {
	if (this.params.timeFilter === null) {
		this.redirect('/invoices/all')
  }

  this.state.set('timeFilter', this.params.timeFilter)
  this.state.set('sortBy', this.params.query.sortBy)
  this.state.set('order', this.params.query.order)

  this.render('InvoicesTable', {to:'main', 
    data: function() {
      return {
        timeFilter: this.state.get('timeFilter'),
        sort: {
            sortBy: this.state.get('sortBy'),
            order: this.state.get('order'),
          }, 
      } 
    } 
  })
}, {
  name: 'invoices'
} );