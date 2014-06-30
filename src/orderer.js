Ember.EasyDatatableOrderer = Ember.Object.extend(Ember.Evented, Ember.EasyDatatableUtils, {
  bindKeydownForOrdering: function () {
    var table = this.get('table'),
      self = this;

    table
      .on('keydown', 'thead th', function (event) {
        var column = self.getColumnFor(self.getSelectedCell());

        if (event.ctrlKey) {
          if (event.which === self.keyCodes.ARROW_RIGHT && self.allowMoveColumnRight(column)) {
            self.moveColumnRight(column);
          } else if (event.which === self.keyCodes.ARROW_LEFT && self.allowMoveColumnLeft(column)) {
            self.moveColumnLeft(column);
          }
        }
      });

    table
      .on('keydown', 'tbody th', function (event) {
        var row = self.getRowFor(self.getSelectedCell());

        if (event.ctrlKey) {
          if (event.which === self.keyCodes.ARROW_UP && self.allowMoveRowUp(row)) {
            self.moveRowUp(row);
          } else if (event.which === self.keyCodes.ARROW_DOWN && self.allowMoveRowDown(row)) {
            self.moveRowDown(row);
          }
        }
      });
  }.on('init'),

  moveColumnRight: function (column) {
    this._moveColumn(column, column + 1);
    this.notifyEvent('columnMovedRight', {column: column});
  },

  moveColumnLeft: function (column) {
    this._moveColumn(column, column - 1);
    this.notifyEvent('columnMovedLeft', {column: column});
  },

  moveRowUp: function (row) {
    this._moveRow(row, row - 1);
    this.notifyEvent('rowMovedUp', {row: row});
  },

  moveRowDown: function (row) {
    this._moveRow(row, row + 1);
    this.notifyEvent('rowMovedDown', {row: row});
  },

  allowMoveColumnRight: function (column) {
    return column < this.get('table').find('thead tr:first th').length - 1;
  },

  allowMoveColumnLeft: function (column) {
    return column > 0;
  },

  allowMoveRowUp: function (row) {
    return row > 0;
  },

  allowMoveRowDown: function (row) {
    return row < this.get('table').find('tbody tr').length - 1;
  },

  _moveColumn: function (from, to) {
    var table = this.get('table'),
      self = this;

    table.find('tr').each(function () {
      self._moveElement($(this), 'th, td', from, to);
    });
    table.find('thead tr:first th:nth(%@)'.fmt(to)).focus();
  },

  _moveRow: function (from, to) {
    var table = this.get('table');
    this._moveElement(table.find('tbody'), 'tr', from, to);
    table.find('tbody tr:nth(%@) th'.fmt(to)).focus();
  },

  _moveElement: function (container, childrenSelector, from, to) {
    var moved = container.find(childrenSelector).eq(from),
      realTo = to > from ? to + 1 : to;

    if (realTo === 0) {
      moved.insertBefore(container.find(childrenSelector).eq(0));
    } else {
      moved.insertAfter(container.find(childrenSelector).eq(realTo - 1));
    }
  }
});
