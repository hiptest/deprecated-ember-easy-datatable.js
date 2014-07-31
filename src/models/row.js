EasyDatatable.DatatableRow = Ember.Object.extend({
  cells: null,

  moveCell: function (from, to) {
    var cells = this.get('cells'),
      moved = cells[from];

    cells.removeAt(from);
    cells.insertAt(to, moved);
  }
});