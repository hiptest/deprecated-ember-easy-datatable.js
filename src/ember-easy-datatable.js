Ember.EasyDatatable = Ember.Object.extend({
  tabindex: 1,
  tableSelector: '',
  selectionClass: 'selected',
  protectedClass: 'protected',

  selectedColumn: null,
  selectedRow: null,

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

  editorShown: false,

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

    table.find('td, th')
      .on('click', function () {
        self.set('editorShown', false);
        self.set('editorShown', true);
      });
  }.on('init'),

  addRemoveEditor: function () {
    var selectedCell = this.getSelectedCell(),
      self = this;

    Ember.run(this, function () {
      if (this.get('editorShown')) {
        if (selectedCell.hasClass(this.get('protectedClass'))) {
          this.set('editorShown', false);
          return;
        }

        selectedCell
          .append('<input type="text" value="%@" />'.fmt(selectedCell.text()))
          .find('input')
          .on('focus', function () {
            var th = $(this).closest('th');

            if (th.length === 0) {
              return;
            }

            if ($(this).closest('thead').length === 1) {
              self.set('selectedColumn', self.getColumnFor(th));
            } else {
              self.set('selectedRow', self.getRowFor(th));
            }
          })
          .on('blur', function () {
            self.set('selectedRow', null);
            self.set('selectedColumn', null);
          })
          .on('keydown', function (event) {
            if (event.which === self.keyCodes.ESC) {
              $(this).parent().focus();
              self.set('editorShown', false);
            }

            if ([self.keyCodes.ENTER, self.keyCodes.TAB].contains(event.which)) {
              self.validateCellEdition($(this).val(), event);
            }

            if ([self.keyCodes.ARROW_UP, self.keyCodes.ARROW_DOWN, self.keyCodes.ARROW_LEFT, self.keyCodes.ARROW_RIGHT].contains(event.which)) {
              event.stopPropagation();
            }
          })
          .focus();
      } else {
        selectedCell.find('input').remove();
      }
    });
  }.observes('editorShown'),

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
        var moved;

        if (!event.ctrlKey) {
          moved = self.move(event);

          if (!moved && event.which !== self.keyCodes.ESC) {
            self.set('editorShown', true);
          }
        }
      });
  }.on('init'),

  move: function (event) {
    if (event.which === this.keyCodes.ARROW_UP) {
      this.moveUp();
      return true;
    }

    if (event.which === this.keyCodes.ARROW_DOWN) {
      this.moveDown();
      return true;
    }

    if (event.which === this.keyCodes.ARROW_RIGHT) {
      this.moveRight();
      return true;
    }

    if (event.which === this.keyCodes.ARROW_LEFT) {
      this.moveLeft();
      return true;
    }

    return (event.which === this.keyCodes.TAB);
  },

  moveUp: function () {
    var selectedCell = this.getSelectedCell(),
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
      selectedCell = this.getSelectedCell(),
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
      selectedCell = this.getSelectedCell(),
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
    var selectedCell = this.getSelectedCell(),
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

  getSelectedCell: function () {
    var active = $(document.activeElement);
    if (active && active.closest(this.get('table')).length === 1) {
      return active.closest('td, th');
    }
  },

  getColumnFor: function (element) {
    return element.closest('tr').find('th, td').index(element);
  },

  getRowFor: function(element) {
    return element.closest('tbody').find('tr').index(element.closest('tr'));
  },

  validateCellEdition: function (value, event) {
    var cell = this.getSelectedCell();
    cell.html(value).focus();

    if (event.which === this.keyCodes.ENTER) {
      event.stopPropagation();
    }
    this.set('editorShown', false);
  }
});