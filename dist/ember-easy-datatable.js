Ember.EasyDatatableUtils = Ember.Mixin.create({
  datatable: null,
  tabindex: 1,
  tableSelector: '',

  keyCodes: {
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    ENTER: 13,
    TAB: 9,
    ESC: 27,
    INSER: 45,
    DEL: 46,
    PLUS: 107,
    SHIFT: 16
  },

  table: function () {
    return $(this.get('tableSelector'));
  }.property('tableSelector'),

  addTabindex: function () {
    this.get('table').find('th, td').attr('tabindex', this.get('tabindex'));
  }.on('init'),

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

  notifyEvent: function (event, data) {
    var datatable = this.get('datatable');

    if (!Ember.isNone(datatable)) {
      datatable.dispatchEvent(event, data);
    }
  }
});

Ember.EasyDatatableHighlighter = Ember.Object.extend(Ember.Evented, Ember.EasyDatatableUtils, {
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
Ember.EasyDatatableKeyboardMoves = Ember.Object.extend(Ember.Evented, Ember.EasyDatatableUtils, {
  bindKeydownForMovements: function () {
    var self = this;

    this.get('table')
      .on('keydown', 'td, th', function (event) {
        if (!event.ctrlKey) {
          self.move(event);
        }
      });
  }.on('init'),

  move: function (event) {
    var navigationKeys = [
      this.keyCodes.ARROW_UP,
      this.keyCodes.ARROW_DOWN,
      this.keyCodes.ARROW_RIGHT,
      this.keyCodes.ARROW_LEFT,
      this.keyCodes.TAB];

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

    if (navigationKeys.contains(event.which)) {
      this.preventDefaultInViewport(event);
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
  },

  isElementInViewport: function (el) {
    // Based on http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
    //special bonus for those using jQuery
    if (el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  },

  preventDefaultInViewport: function (event) {
    if (this.isElementInViewport(this.getSelectedCell())) {
      event.preventDefault();
    }
  }
});
Ember.EasyDatatableEditor = Ember.Object.extend(Ember.Evented, Ember.EasyDatatableUtils, {
  protectedClass: 'protected',
  validationErrorClasses: ['error'],

  editorShown: false,

  bindShowEditorOnClick: function () {
    var table = this.get('table'),
      self = this;

    table
      .on('click', 'thead th, tbody th, tbody td', function () {
        self.set('editorShown', false);
        self.set('editorShown', true);
      });
  }.on('init'),

  bindKeydown: function () {
    var self = this,
      nonEditionKeys = [
        this.keyCodes.ARROW_UP,
        this.keyCodes.ARROW_RIGHT,
        this.keyCodes.ARROW_DOWN,
        this.keyCodes.ARROW_LEFT,
        this.keyCodes.TAB,
        this.keyCodes.ESC,
        this.keyCodes.SHIFT,
        this.keyCodes.DEL,
        this.keyCodes.INSER
      ];

    this.get('table')
      .on('keydown', 'thead th, tbody th, tbody td', function (event) {
        if (event.ctrlKey || nonEditionKeys.contains(event.which)) {
          return;
        }

        self.set('editorShown', true);

      });
  }.on('init'),

  addEditor: function () {
    var selectedCell = this.getSelectedCell(),
      self = this;

    if (selectedCell.hasClass(this.get('protectedClass'))) {
      this.set('editorShown', false);
      return;
    }

    selectedCell
      .append('<input type="text" value="%@" />'.fmt(selectedCell.text()))
      .find('input')
      .on('blur', function () {
        self.removeErrorClasses($(this).parent());
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
  },

  removeEditor: function () {
    this.get('table').find('input').remove();
  },

  addRemoveEditor: function () {
    Ember.run(this, function () {
      if (this.get('editorShown')) {
        this.addEditor();
      } else {
        this.removeEditor();
      }
    });
  }.observes('editorShown'),

  addErrorClasses: function (element) {
    element = element || this.getSelectedCell();
    element.addClass(this.get('validationErrorClasses').join(' '));
  },

  removeErrorClasses: function (element) {
    element = element || this.getSelectedCell();
    element.removeClass(this.get('validationErrorClasses').join(' '));
  },

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
      applicator = this['update%@Value'.fmt(type)],
      validationResult;

    Ember.assert('"%@" if not a valid type for processEdition, accepted values are: %@'.fmt(type, allowedTypes), allowedTypes.contains(type));

    event.stopPropagation();
    event.preventDefault();

    validationResult = validator.apply(this, [value, row, column]);
    if (typeof(validationResult) === 'boolean') {
      this.processDirectEdition(validationResult, value, row, column, applicator);
      return;
    }
    this.processPromiseEdition(validationResult, value, row, column, applicator);
  },

  processDirectEdition: function (validationResult, value, row, column, applicator) {
    if (validationResult) {
      this.processEditionSuccess(value, row, column, applicator);
    } else {
      this.processEditionFailure();
    }
  },

  processPromiseEdition: function (validationResult, value, row, column, applicator) {
    var self = this;

    validationResult.then(function () {
        self.processEditionSuccess(value, row, column, applicator);
      },
      function () {
        self.processEditionFailure();
      });
  },

  processEditionSuccess: function (value, row, column, applicator) {
    this.getSelectedCell().focus();
    applicator.apply(this, [value, row, column]);
    this.set('editorShown', false);
  },

  processEditionFailure: function () {
    this.addErrorClasses();
  }
});
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

Ember.EasyDatatableInserter = Ember.Object.extend(Ember.Evented, Ember.EasyDatatableUtils, {
  bindKeydownForInsertion: function () {
    var self = this,
      table = this.get('table');

    table
      .on('keydown', 'thead th', function (event) {
        var index = self.getColumnFor(self.getSelectedCell());

        if (event.ctrlKey && event.which === self.keyCodes.INSER) {
          if (self.canInsertColumn(index)) {
            event.stopPropagation();
            self.insertColumnAfter(index);
          }
        }
      })
      .on('keydown', 'tbody th', function (event) {
        var index = self.getRowFor(self.getSelectedCell());

        if (event.ctrlKey && event.which === self.keyCodes.INSER) {
          if (self.canInsertRow(index)) {
            event.stopPropagation();
            self.insertRowAfter(index);
          }
        }
      });
  }.on('init'),

  canInsertRow: function (index) {
    return true;
  },

  canInsertColumn: function (index) {
    return true;
  },

  insertRowAfter: function (index) {
    var self = this,
      row = this.get('table').find('tbody tr:nth(%@)'.fmt(index)),
      newRow = '<tr>%@</tr>'.fmt(row.find('th, td').map(function () {
        var cell = $(this),
          cellType = self.getCellType(cell);

        return '<%@ class="%@" tabindex="%@"></%@>'.fmt(
          cellType,
          cell.attr('class'),
          self.get('tabindex'),
          cellType);
      }).get().join(''));

    $(newRow).insertAfter(row);
    this.get('table').find('tbody tr:nth(%@) th'.fmt(index + 1)).focus();
    this.notifyEvent('rowAddedAfter', {index: index});
  },

  insertColumnAfter: function (index) {
    var self = this;

    this.get('table').find('tr').each(function () {
      var row = $(this),
        cell = row.find('th, td').eq(index),
        cellType = self.getCellType(cell);

      $('<%@ tabindex="%@"></%@>'.fmt(
        cellType,
        self.get('tabindex'),
        cellType)).insertAfter(cell);
    });
    this.get('table').find('thead th:nth(%@)'.fmt(index + 1)).focus();
    this.notifyEvent('columnAddedAfter', {index: index});
  },

  getCellType: function (cell) {
    return cell.is('td') ? 'td' : 'th';
  }
});
Ember.EasyDatatableRemover = Ember.Object.extend(Ember.Evented, Ember.EasyDatatableUtils, {
  bindKeydownForDeletion: function () {
    var self = this,
      table = this.get('table');

    table
      .on('keydown', 'thead th', function (event) {
        var index = self.getColumnFor(self.getSelectedCell());

        if (event.ctrlKey && event.which === self.keyCodes.DEL) {
          if (self.canDeleteColumn(index)) {
            event.stopPropagation();
            self.deleteColumn(index);
          }
        }
      })
      .on('keydown', 'tbody th', function (event) {
        var index = self.getRowFor(self.getSelectedCell());

        if (event.ctrlKey && event.which === self.keyCodes.DEL) {
          if (self.canDeleteRow(index)) {
            event.stopPropagation();
            self.deleteRow(index);
          }
        }
      });
  }.on('init'),

  canDeleteRow: function (index) {
    return true;
  },

  canDeleteColumn: function (index) {
    return true;
  },

  deleteRow: function (index) {
    var table = this.get('table');
    table.find('tbody tr:nth(%@)'.fmt(index)).remove();

    index = Math.min(index, table.find('tbody tr').length - 1);
    table.find('tbody tr:nth(%@) th'.fmt(index)).focus();
    this.notifyEvent('rowDeleted', {index: index});
  },

  deleteColumn: function (index) {
    var table = this.get('table');

    table.find('tr').each(function () {
      $(this).find('th, td').eq(index).remove();
    });

    index = Math.min(index, table.find('thead th').length - 1);
    table.find('thead th:nth(%@)'.fmt(index)).focus();
    this.notifyEvent('columnDeleted', {index: index});
  }
});
Ember.EasyDatatable = Ember.Object.extend(Ember.Evented, {
  tabindex: 1,
  tableSelector: '',
  selectionClass: 'selected',
  protectedClass: 'protected',
  validationErrorClasses: ['error'],

  behaviors: null,

  allowedBehaviors: null,
  behaviorContructors: {
    highlighter: Ember.EasyDatatableHighlighter,
    keyboard: Ember.EasyDatatableKeyboardMoves,
    editor: Ember.EasyDatatableEditor,
    orderer: Ember.EasyDatatableOrderer,
    inserter: Ember.EasyDatatableInserter,
    remover: Ember.EasyDatatableRemover
  },
  behaviorAttributes: {
    highlighter: ['selectionClass'],
    keyboard: [],
    editor: [
      'protectedClass',
      'validationErrorClasses',
      'validateCellValue',
      'validateRowHeaderValue',
      'validateColumnHeaderValue',
      'updateCellValue',
      'updateRowHeaderValue',
      'updateColumnHeaderValue'
    ],
    orderer: [
      'moveColumnRight',
      'moveColumnLeft',
      'moveRowUp',
      'moveRowDown',
      'allowMoveColumnRight',
      'allowMoveColumnLeft',
      'allowMoveRowUp',
      'allowMoveRowDown'
    ],
    inserter: [],
    remover: []
  },

  addBehaviors: function () {
    var self = this,
      allowedBehaviors = this.get('allowedBehaviors') || Ember.keys(this.get('behaviorContructors')),
      behaviors = {};

    allowedBehaviors.forEach(function (behavior) {
      var constructor = self.get('behaviorContructors')[behavior],
        attributes = self.makeSubObjectsCreationHash(self.get('behaviorAttributes')[behavior]);

      behaviors[behavior] = constructor.create(attributes);
    });
    this.set('behaviors', behaviors);
  }.on('init'),

  makeSubObjectsCreationHash: function (copiedKeys) {
    var self = this,
      creationElements = {
        datatable: this,
        tabindex: this.get('tabindex'),
        tableSelector: this.get('tableSelector')
      };

    copiedKeys.forEach(function (key) {
      var value = self.get(key) || self[key];

      if (!Ember.isNone(value)) {
        creationElements[key] = value;
      }
    });
    return creationElements;
  },

  dispatchEvent: function (event, data) {
    var behaviors = this.get('behaviors');
    this.trigger(event, data);
    Ember.keys(behaviors).forEach(function (behavior) {
      behaviors[behavior].trigger(event, data);
    });
  }
});