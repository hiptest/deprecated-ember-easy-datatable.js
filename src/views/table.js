EasyDatatable.EasyDatatableView = Ember.View.extend({
  classNames: ['easy-datatable-container']
});

EasyDatatable.EasyDatatableTableView = Ember.View.extend({
  tagName: 'table',
  classNames: ['table', 'table-stripped', 'table-collapsed']
});