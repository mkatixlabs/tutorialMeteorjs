import '../imports/ui/invoicesTable.js';

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  	this.redirect('/invoices/all')
});

Router.route('/invoices/:timeFilter', function () {
	if (this.params.timeFilter === null) 
		this.redirect('/invoices/all')
  	this.state.set('timeFilter', this.params.timeFilter)
  	this.state.set('sortTotal', this.params.query.sortTotal)
  	this.state.set('sortCreatedAt', this.params.query.sortCreatedAt)
  	this.state.set('invoiceLimit', 25)

  	this.render('invoicesTable', {to:'main'})
}, {
  name: 'invoices'
} );