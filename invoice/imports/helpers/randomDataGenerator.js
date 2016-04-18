import faker from 'faker'; 

function generateRandomNumber(digits) {
	return faker.finance.account(digits)
}

function generateRandomEmail() {
	return faker.internet.email()
}

function generateRandomDate() {
	return faker.date.past(1)
}

function generateRandomInvoice(index) {
	const aplifyFactor = 10
	const numberOfDigits = 5
	return {
      	invoiceNumber: generateRandomNumber(numberOfDigits),
		email: generateRandomEmail(),
      	total: index * aplifyFactor,
     	createdAt: generateRandomDate(),
	}
}

export default function generateRandomData(n) {
	return _.times(n, generateRandomInvoice)
}