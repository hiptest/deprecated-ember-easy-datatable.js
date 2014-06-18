Ember.EasyDatatableUtils = Ember.Mixin.create({
  tableSelector: '',

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
  }
});

Ember.EasyDatatableHighlighter = Ember.Mixin.create(Ember.EasyDatatableUtils, {
  selectionClass: 'selected',

  selectedColumn: null,
  selectedRow: null,

  bindFocusAndBlurForHighlighting: function () {
    var table = this.get('table'),
      self = this;

    table
      .on('focus', 'thead th, thead th *', function () {
        self.set('selectedColumn', self.getColumnFor($(this)));
      })
      .on('blur', 'thead th, thead th *', function () {
        self.set('selectedColumn', null);
      });

    table
      .on('focus', 'tbody th, tbody th *', function () {
        self.set('selectedRow', self.getRowFor($(this)));
      })
      .on('blur', 'tbody th, tbody th *', function () {
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
  }.on('init').observes('selectedRow', 'selectedColumn')
});

Ember.EasyDatatableKeyboardMoves = Ember.Mixin.create(Ember.EasyDatatableUtils, {
  bindKeydownForMovements: function () {
    var self = this;

    this.get('table').find('td, th')
      .on('keydown', function (event) {
        if (!event.ctrlKey) {
          self.move(event);
        }
      });
  }.on('init'),

  move: function (event) {
    if (event.which === this.keyCodes.ARROW_UP) {
      this.moveUp();
    }

    if (event.which === this.keyCodes.ARROW_DOWN) {
      this.moveDown();
    }

    if (event.which === this.keyCodes.ARROW_RIGHT) {
      this.moveRight();
    }

    if (event.which === this.keyCodes.ARROW_LEFT) {
      this.moveLeft();
    }
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
  }
});

Ember.EasyDatatable = Ember.Object.extend(
  Ember.EasyDatatableHighlighter, Ember.EasyDatatableKeyboardMoves, {
  tabindex: 1,
  protectedClass: 'protected',
  validationErrorClasses: ['error'],

  editorShown: false,

  addTabindex: function () {
    this.get('table').find('th, td').attr('tabindex', this.get('tabindex'));
  }.on('init'),

  bindFocusBlur: function () {
    var table = this.get('table'),
      self = this;

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
          })
          .on('blur', function () {
            $(this).parent().removeClass(self.get('validationErrorClasses').join(' '));
          })
          .on('keydown', function (event) {
            if (event.which === self.keyCodes.ESC) {
              $(this).parent().focus();
              self.set('editorShown', false);
            }

            if ([self.keyCodes.ENTER, self.keyCodes.TAB].contains(event.which)) {
              self.cellIsEdited($(this).val(), event);
            }

            if ([self.keyCodes.ARROW_UP, self.keyCodes.ARROW_DOWN, self.keyCodes.ARROW_LEFT, self.keyCodes.ARROW_RIGHT].contains(event.which)) {
              event.stopPropagation();
            }
          })
          .focus();
      } else {
        this.get('table').find('input').remove();
      }
    });
  }.observes('editorShown'),

  bindKeydown: function () {
    var self = this,
      nonEditionKeys = [
        this.keyCodes.ARROW_UP,
        this.keyCodes.ARROW_RIGHT,
        this.keyCodes.ARROW_DOWN,
        this.keyCodes.ARROW_LEFT,
        this.keyCodes.TAB,
        this.keyCodes.ESC
      ];

    this.get('table').find('td, th')
      .on('keydown', function (event) {
        if (!event.ctrlKey && !nonEditionKeys.contains(event.which)) {
          self.set('editorShown', true);
        }
      });
  }.on('init'),

  cellIsEdited: function (value, event) {
    var cell = this.getSelectedCell(),
      row = this.getRowFor(cell),
      column = this.getColumnFor(cell);

    if (row === -1) {
      return this.processEdition('ColumnHeader', value, row, column, event);
    }

    if (cell.closest('th').length === 1) {
      return this.processEdition('RowHeader', value, row, column, event);
    }
    return this.processEdition('Cell', value, row, column, event);
  },

  validateCellValue: function (value, row, column) {
    return true;
  },

  validateRowHeaderValue: function (value, row, column) {
    return true;
  },

  validateColumnHeaderValue: function (value, row, column) {
    return true;
  },

  updateCellValue: function (value, row, column) {
    this.get('table').find('tbody tr:nth(%@)'.fmt(row)).find('th, td').eq(column).html(value);
  },

  updateRowHeaderValue: function (value, row, column) {
    this.get('table').find('tbody tr:nth(%@)'.fmt(row)).find('th, td').eq(column).html(value);
  },

  updateColumnHeaderValue: function (value, row, column) {
    this.get('table').find('thead th:nth(%@)'.fmt(column)).html(value);
  },

  processEdition: function (type, value, row, column, event) {
    var allowedTypes = ['Cell', 'RowHeader', 'ColumnHeader'],
      validator = this['validate%@Value'.fmt(type)],
      applicator = this['update%@Value'.fmt(type)];

    Ember.assert('"%@" if not a valid type for processEdition, accepted values are: %@'.fmt(type, allowedTypes), allowedTypes.contains(type));

    if (validator.apply(this, [value, row, column])) {
      this.getSelectedCell()
        .removeClass(this.get('validationErrorClasses').join(' '))
        .focus();

      applicator.apply(this, [value, row, column]);

      if (event.which === this.keyCodes.ENTER) {
        event.stopPropagation();
      }
      this.set('editorShown', false);
    } else {
      this.getSelectedCell()
        .addClass(this.get('validationErrorClasses').join(' '));
    }
  }
});