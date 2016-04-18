import { Template } from 'meteor/templating';
import moment from 'moment';

Template.registerHelper('simpleFormat', (date) => {
    return moment(date).format('YYYY-MM-DD')
});