import { Mongo } from 'meteor/mongo';
import moment from 'moment'; 

export const Invoices = new Mongo.Collection('invoices');

if (Meteor.isServer) {
  Meteor.publish('invoices', function invoicesPublication(limit) {
    return Invoices.find({}, Invoices.createSortAndLimitQuery({}, limit))
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

Invoices.createSortAndLimitQuery = function(sort, limit) {
  return {
    sort: createSort(sort),
    limit: limit,
  }
}

Invoices.createTimeFilterQuery = function(timeFilter) {
  const date = castTimeFilterToDate(timeFilter)
 	const queryFilter = {}
  if (date !== null) {
    queryFilter.createdAt = {
      $gte: date.toDate()
    }
  }
  console.log(queryFilter)
  return queryFilter
} 

Invoices.createSearchFilterQuery = function(query) {
  let queryFilter = {}
  if (query.value !== null) {
    const queryRegex = new RegExp('^' + query.value + '.*')
    const criteria = {$regex: queryRegex}
    queryFilter[`${query.findBy}`] = criteria
  }
  
  console.log(queryFilter)
  return queryFilter
}

Invoices.findBy = function(query, sort, limit) {
	return Invoices.find(query, Invoices.createSortAndLimitQuery(sort, limit))
}
