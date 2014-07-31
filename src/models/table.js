EasyDatatable.Datatable = Ember.Object.extend({
  headers: null,
  body: null,

  validateCell: function (cell, position, value) {
    return true;
  },

  makeArrayOfEmptyHashes: function (length) {
    return Array.apply(null, {length: length}).map(function () {return {}});
  },

  makeDefaultRow: function (index) {
    return this.makeArrayOfEmptyHashes(this.get('headers.cells.length'));
  },

  makeDefaultColumn: function (index) {
    var column =  this.makeArrayOfEmptyHashes(this.get('body.length') + 1);
    column[0].isHeader = true;
    return column;
  },

  insertRow: function (index) {
    this.get('body').insertAt(index, EasyDatatable.DatatableRow.create({
      cells: this.makeDefaultRow(index).map(function (cell) {
        return EasyDatatable.DatatableCell.create(cell);
      })
    }))
  },

  insertColumn: function (index) {
    var column = this.makeDefaultColumn(index);
    this.get('headers.cells').insertAt(index, EasyDatatable.DatatableCell.create(column[0]));
    this.get('body').forEach(function (row, rowIndex) {
      row.get('cells').insertAt(index, EasyDatatable.DatatableCell.create(column[rowIndex + 1]));
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
    var body = this.get('body'),
      moved = body[from];

    body.removeAt(from);
    body.insertAt(to, moved);
  },

  moveColumn: function (from, to) {
    this.get('headers').moveCell(from, to);
    this.get('body').forEach(function (row) {
      row.moveCell(from, to);
    });
  }
});