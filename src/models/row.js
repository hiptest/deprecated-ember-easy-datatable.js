EasyDatatable.DatatableRow = Ember.Object.extend({
  cells: null,

  moveCell: function (from, to) {
    EasyDatatable.moveObject(this.get('cells'), from, to);
  }
});