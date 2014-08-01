EasyDatatable.EasyDatatableRowController = Ember.ObjectController.extend({
  datatableController: Ember.computed.alias('parentController.datatableController'),

  rowIndex: function () {
    return this.get('datatableController.model.body').indexOf(this.get('model'));
  }.property('model', 'datatableController.model.body.[]')
});