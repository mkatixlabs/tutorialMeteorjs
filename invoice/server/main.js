import { 
	Meteor 
} from 'meteor/meteor';
import { 
	Invoices 
} from '../imports/api/invoices.js';	

import faker from 'faker'; 

function generateRandomNumber(digits) {
	return faker.finance.account(digits)
}

function generateRandomDate() {
	return faker.date.past(1)
}

Meteor.startup( () => {
	Invoices.remove({}, () => {
		for (i = 1 ; i <= 100; i++) {
			Invoices.insert({
      			invoiceNumber: generateRandomNumber(5),
      			total: i*10,
      			createdAt: generateRandomDate(),
    		});
		}
	
	});
});
