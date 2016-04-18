import { Mongo } from 'meteor/mongo';
import moment from 'moment'; 

export const Invoices = new Mongo.Collection('invoices');

if (Meteor.isServer) {
  Meteor.publish('invoices', function invoicesPublication(timeFilter, sort, limit) {
    return Invoices.find(createQuerytimeFilter(timeFilter), createQuerySortAndLimit(sort, limit))
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
    total: sort.sortTotal === 'asc' ? 1 : -1,
    createdAt: sort.sortCreatedAt === 'asc' ? 1 : -1,
  }
}

function createQuerySortAndLimit(sort, limit) {
  return {
    sort: createSort(sort),
    limit: limit,
  }
}

function createQuerytimeFilter(timeFilter) {
  const date = castTimeFilterToDate(timeFilter)
 	const queryFilter = {}
  if (date !== null) {
    queryFilter.createdAt = {
      $gte: date.toDate()
    }
  }
  return queryFilter
} 

Invoices.findByTimeFilter = function(timeFilter, sort, limit) {
	return Invoices.find(createQuerytimeFilter(timeFilter), createQuerySortAndLimit(sort, limit))
}