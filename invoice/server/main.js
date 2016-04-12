import { Meteor } from 'meteor/meteor';
import { Invoices } from '../imports/api/invoices.js';	
import faker from 'faker'; 
//import '../imports/api/invoices.js';


function generateRandomNumber(digits) {
	return faker.finance.account(digits)
}

function generateRandomDate() {
	return faker.date.past(1)
}

Meteor.startup( () => {
	Invoices.remove({}, () => {
		for (i = 1 ; i <= 50; i++) {
			Invoices.insert({
      			invoiceNumber: i,
      			total: generateRandomNumber(i),
      			createdAt: generateRandomDate(),
    		});
		}
	
	});
 
});
