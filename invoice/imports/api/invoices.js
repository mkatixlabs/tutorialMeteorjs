import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import moment from 'moment'; 
import isANumber from '../helpers/regexpFunctions'

export const Invoices = new Mongo.Collection('invoices');

if (Meteor.isServer) {
  Meteor.publish('invoices', function invoicesPublication(filter, sort, limit) {
    return Invoices.findBy(filter, Invoices.createSortAndLimitQuery(sort, limit))
  });
}

// filter functions
function castTimeFilterToDate(type) {
  switch (type) {
      case "today":
        return moment().subtract(1, 'days').startOf('day')
      case "month":
        return moment().subtract(1, 'months').startOf('day')
      case "week":
        return moment().subtract(1, 'weeks').startOf('day')
      case "all":
        return null;
      default: 
        return null;
    } 
}

// sort functions
function createSort(sort) {
  return {
    createdAt: sort.sortCreatedAt === 'asc' ? 1 : -1,
    total: sort.sortTotal === 'asc' ? 1 : -1,
  }
}

Invoices.createSortAndLimitQuery = function(sort, limit, skip) {
  return {
    sort: createSort(sort),
    skip: skip,
    limit: limit,
  }
}

Invoices.addTimeQueryToFilter = function(timeQuery, filter) {
  const date = castTimeFilterToDate(timeQuery)
  if (date !== null) {
    filter.createdAt = {
      $gte: date.toDate()
    }
  }
} 

Invoices.addSearchQueryToFilter = function(searchQuery, filter) {
  let criteria = {}
  if (searchQuery !== null && searchQuery.value !== null && searchQuery.value !== '') {
   
    if (isANumber(searchQuery.value)) {
      criteria = { $in: [parseInt(searchQuery.value)] }
    } else { // ifTextValue
      const queryRegex = new RegExp(searchQuery.value + '.*')
      criteria = {$regex: queryRegex}
    }
    filter[`${searchQuery.findBy}`] = criteria
  }
}

Invoices.findBy = function(query, sort, limit, skip) {
	return Invoices.find(query, Invoices.createSortAndLimitQuery(sort, limit, skip))
}

Invoices.totalInvoices = function(filter) {
  return Invoices.find(filter).count()
}

Meteor.methods({
 
})
