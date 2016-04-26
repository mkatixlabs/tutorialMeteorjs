import '../imports/ui/invoicesTable.js';

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  	this.redirect('/invoices/all?sortTotal=asc&sortCreatedAt=asc')
});

Router.route('/invoices/:timeFilter', function () {
	if (this.params.timeFilter === null) {
		this.redirect('/invoices/all')
  }

  this.state.set('timeFilter', this.params.timeFilter)
  this.state.set('sortTotal', this.params.query.sortTotal)
  this.state.set('sortCreatedAt', this.params.query.sortCreatedAt)

  this.render('InvoicesTable', {to:'main', 
    data: function() {
      return {
        timeFilter: this.state.get('timeFilter'),
        sort: {
            sortTotal: this.state.get('sortTotal'),
            sortCreatedAt: this.state.get('sortCreatedAt'),
          }, 
      } 
    } 
  })
}, {
  name: 'invoices'
} );