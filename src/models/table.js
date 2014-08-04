EasyDatatable.Datatable = Ember.Object.extend({
  headers: null,
  body: null,
  canInsertColumns: true,
  canInsertRows: true,

  validateCell: function (cell, position, value) {
    return true;
  },

  columnCanMove: function (index) {
    return this.get('headers.cells')[index].get('isMovable');
  },

  columnCanMoveLeft: function (index) {
    return this.columnCanMove(index) && index > 0 && this.columnCanMove(index - 1);
  },

  columnCanMoveRight: function (index) {
    return this.columnCanMove(index) && index < this.get('headers.cells.length') - 1  && this.columnCanMove(index + 1);
  },

  rowCanMove: function (index) {
    return this.get('body')[index].get('cells').every(function (cell) {
      return cell.get('isMovable');
    });
  },

  rowCanMoveUp: function (index) {
    return this.rowCanMove(index) && index > 0 && this.rowCanMove(index - 1);
  },

  rowCanMoveDown: function (index) {
    return this.rowCanMove(index) && index < this.get('body.length') - 1  && this.rowCanMove(index + 1);
  },

  columnCanBeRemoved: function (index) {
    return this.get('headers.cells')[index].get('isRemovable');
  },

  rowCanBeRemoved: function (index) {
    return this.get('body')[index].get('cells').every(function (cell) {
      return cell.get('isRemovable');
    });
  },

  makeDefaultRow: function (index) {
    return EasyDatatable.makeListOf(this.get('headers.cells.length'));
  },

  makeDefaultColumn: function (index) {
    var column = EasyDatatable.makeListOf(this.get('body.length') + 1);
    column[0] = {isHeader: true};
    return column;
  },

  rowCanBeInserted: function (index) {
    if (this.get('canInsertRows')) {
      if (index === 0) return true;
      return this.get('body')[index - 1].get('cells').every(function (cell) {
        return cell.get('canInsertRowAfter');
      });
    }
    return false;
  },

  insertRow: function (index) {
    this.get('body').insertAt(index, EasyDatatable.makeRow(this.makeDefaultRow(index)));
  },

  columnCanBeInserted: function (index) {
    if (this.get('canInsertColumns')) {
      if (index === 0) return true;
      return this.get('headers.cells')[index - 1].get('canInsertColumnAfter');
    }
    return false;
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