EasyDatatable.Datatable = Ember.Object.extend({
  headers: null,
  body: null,

  validateCell: function (cell, position, value) {
    return true;
  },

  columnCanMoveLeft: function (index) {
    return this.get('headers.cells')[index].get('isMovable') && index > 0 && this.get('headers.cells')[index - 1].get('isMovable')
  },

  columnCanMoveRight: function (index) {
    return this.get('headers.cells')[index].get('isMovable') && index < this.get('headers.cells.length') - 1  && this.get('headers.cells')[index + 1].get('isMovable');
  },

  makeDefaultRow: function (index) {
    return EasyDatatable.makeListOf(this.get('headers.cells.length'));
  },

  makeDefaultColumn: function (index) {
    var column = EasyDatatable.makeListOf(this.get('body.length') + 1);
    column[0] = {isHeader: true};
    return column;
  },

  insertRow: function (index) {
    this.get('body').insertAt(index, EasyDatatable.makeRow(this.makeDefaultRow(index)));
  },

  insertColumn: function (index) {
    var column = this.makeDefaultColumn(index);
    this.get('headers.cells').insertAt(index, EasyDatatable.makeCell(column[0]));
    this.get('body').forEach(function (row, rowIndex) {
      row.get('cells').insertAt(index, EasyDatatable.makeCell(column[rowIndex + 1]));
    });
  },

  removeRow: function (index) {
    this.get('body').removeAt(index);
  },

  removeColumn: function (index) {
    this.get('headers.cells').removeAt(index);
    this.get('body').forEach(function (row) {
      row.get('cells').removeAt(index);
    });
  },

  moveRow: function (from, to) {
    EasyDatatable.moveObject(this.get('body'), from, to);
  },

  moveColumn: function (from, to) {
    this.get('headers').moveCell(from, to);
    this.get('body').forEach(function (row) {
      row.moveCell(from, to);
    });
  }
});