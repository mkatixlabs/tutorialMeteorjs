import { 
	Meteor 
} from 'meteor/meteor';
import { 
	Invoices 
} from '../imports/api/invoices.js';	

import generateRandomData from '../imports/helpers/randomDataGenerator' // -> without extension!

function preloadInvoices(n) {
	Invoices.remove({}, () => {
		generateRandomData(n).forEach (invoice => {
			Invoices.insert(invoice)
		})
	});
}

Meteor.startup(() => {
	preloadInvoices(100)
});
