import '../imports/ui/invoicesTable.js';

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  	this.redirect('/invoices/all')
});

Router.route('/invoices/:dateFilter', function () {
	if (this.params.dateFilter === null) 
		this.redirect('/invoices/all')
  	this.state.set('dateFilter', this.params.dateFilter)
  	this.state.set('sortTotal', this.params.query.sortTotal)
  	this.state.set('sortCreatedAt', this.params.query.sortCreatedAt)

  	this.render('invoicesTable', {to:'main'})
}, {
  name: 'invoices'
} );