Ember.EasyDatatable = Ember.Object.extend({
  tableSelector: '',

  selectionClass: 'selected',
  selectedColumn: null,
  selectedRow: null,

  tabindex: 1,

  keyCodes: {
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    ENTER: 13,
    TAB: 9,
    ESC: 27,
    DEL: 46
  },

  table: function () {
    return $(this.get('tableSelector'));
  }.property('tableSelector'),

  addTabindex: function () {
    this.get('table').find('th, td').attr('tabindex', this.get('tabindex'));
  }.on('init'),

  bindFocusBlur: function () {
    var table = this.get('table'),
      self = this;

    table.find('thead th')
      .on('focus', function () {
        self.set('selectedColumn', self.getColumnFor($(this)));
      })
      .on('blur', function () {
        self.set('selectedColumn', null);
      });

    table.find('tbody th')
      .on('focus', function () {
        self.set('selectedRow', self.getRowFor($(this)));
      })
      .on('blur', function () {
        self.set('selectedRow', null);
      });
  }.on('init'),

  notifyCellSelection: function () {
    var table = this.get('table'),
      selectionClass = this.get('selectionClass'),
      selectedRow = this.get('selectedRow'),
      selectedColumn = this.get('selectedColumn');

    table.find('.%@'.fmt(selectionClass)).removeClass(selectionClass);
    if (!Ember.isNone(selectedRow)) {
      table.find('tbody tr:nth(%@)'.fmt(selectedRow)).find('td, th').addClass(selectionClass);
    } else if (!Ember.isNone(selectedColumn)) {
      table.find('tr').each(function () {
        $(this).find('th, td').eq(selectedColumn).addClass(selectionClass);
      });
    }
  }.on('init').observes('selectedRow', 'selectedColumn'),

  bindKeydown: function () {
    var self = this;

    this.get('table').find('td, th')
      .on('keydown', function (event) {
        if (!event.ctrlKey) {
          self.move(event);
        }
      })
  }.on('init'),

  move: function (event) {
    if (event.which === this.keyCodes.ARROW_UP) {
      this.moveUp();
    } else if (event.which === this.keyCodes.ARROW_DOWN) {
      this.moveDown();
    } else if (event.which === this.keyCodes.ARROW_RIGHT) {
      this.moveRight();
    } else if (event.which === this.keyCodes.ARROW_LEFT) {
      this.moveLeft();
    }
  },

  moveUp: function () {
    var table = this.get('table'),
      selectedCell = table.find('th:focus, td:focus'),
      row = this.getRowFor(selectedCell),
      column = this.getColumnFor(selectedCell);

    if (row === -1) {
      selectedCell.blur();
      return;
    }

    this.focusCell(row - 1, column);
  },

  moveDown: function () {
    var table = this.get('table'),
      selectedCell = table.find('th:focus, td:focus'),
      row = this.getRowFor(selectedCell),
      column = this.getColumnFor(selectedCell),
      rowCount = table.find('tbody tr').length;

    if (row === rowCount -1) {
      selectedCell.blur();
      return;
    }

    this.focusCell(row + 1, column);
  },

  moveRight: function () {
    var table = this.get('table'),
      selectedCell = table.find('th:focus, td:focus'),
      row = this.getRowFor(selectedCell),
      column = this.getColumnFor(selectedCell),
      rowCount = table.find('tbody tr').length,
      columnCount = selectedCell.closest('tr').find('td, th').length;

    if (column === columnCount - 1) {
      row += 1;
      column = -1;
    }

    if (row === rowCount) {
      selectedCell.blur();
      return;
    }

    this.focusCell(row, column + 1);
  },

  moveLeft: function () {
    var table = this.get('table'),
      selectedCell = table.find('th:focus, td:focus'),
      row = this.getRowFor(selectedCell),
      column = this.getColumnFor(selectedCell);

    if (column === 0) {
      if (row === - 1) {
        selectedCell.blur();
        return;
      }

      row -= 1;
    }

    this.focusCell(row, column - 1);
  },

  focusCell: function (row, column) {
    var table = this.get('table'),
      destinationRow = null;

    if (row === -1) {
      destinationRow = table.find('thead tr');
    } else {
      destinationRow = table.find('tbody tr:nth(%@)'.fmt(row));
    }
    destinationRow.find('th, td').eq(column).focus();
  },

  getColumnFor: function (element) {
    return element.closest('tr').find('th, td').index(element);
  },

  getRowFor: function(element) {
    return element.closest('tbody').find('tr').index(element.closest('tr'));
  }
});