Ember.TEMPLATES["easy_datatable"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "easy_datatable_table", "model", options) : helperMissing.call(depth0, "render", "easy_datatable_table", "model", options))));
  data.buffer.push("\n");
  stack1 = helpers._triageMustache.call(depth0, "selectedCellPosition.row", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" - ");
  stack1 = helpers._triageMustache.call(depth0, "selectedCellPosition.column", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
  
});

Ember.TEMPLATES["easy_datatable_cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1;


  stack1 = helpers._triageMustache.call(depth0, "value", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});

Ember.TEMPLATES["easy_datatable_row"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "easy_datatable_cell", "cell", options) : helperMissing.call(depth0, "render", "easy_datatable_cell", "cell", options))));
  data.buffer.push("\n");
  return buffer;
  }

  stack1 = helpers.each.call(depth0, "cell", "in", "cells", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});

Ember.TEMPLATES["easy_datatable_table"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var helper, options;
  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "easy_datatable_row", "row", options) : helperMissing.call(depth0, "render", "easy_datatable_row", "row", options))));
  }

  data.buffer.push("<table class=\"table table-stripped table-collapsed\">\n  <thead>\n    ");
  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "easy_datatable_row", "headers", options) : helperMissing.call(depth0, "render", "easy_datatable_row", "headers", options))));
  data.buffer.push("\n  </thead>\n  <tbody>\n    ");
  stack1 = helpers.each.call(depth0, "row", "in", "body", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </tbody>\n</table>");
  return buffer;
  
});
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

  needFirefoxFixes: function () {
    var match = navigator.userAgent.match(/Firefox\/(\d+)/);
    if (Ember.isNone(match)) {
      return false;
    }

    // Not 100% sure about the version were it started working correctly ...
    return parseInt(match[1]) < 30;
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
    return element && element.closest('tr').find('th, td').index(element);
  },

  getRowFor: function(element) {
    return element && element.closest('tbody').find('tr').index(element.closest('tr'));
  },

  notifyEvent: function (event, data) {
    var datatable = this.get('datatable');

    if (!Ember.isNone(datatable)) {
      datatable.dispatchEvent(event, data);
    }
  },

  validateAndProcess: function (validator, success, failure, args) {
    var result = validator.apply(this, args);

    if (result instanceof Ember.RSVP.Promise) {
      this.processForPromise(result, success, failure, args);
    } else  {
      this.processForBoolean(result, success, failure, args);
    }
  },

  processForBoolean: function (result, success, failure, args) {
    if (result) {
      success.apply(this, args);
    } else {
      failure.apply(this, args);
    }
  },

  processForPromise: function  (result, success, failure, args) {
    var self = this;

    result.then(function () {
      success.apply(self, args);
    },
    function () {
      failure.apply(self, args);
    });
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
    if (Ember.isNone(el)) {
      return;
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
    var selectedCell = this.getSelectedCell();

    if (selectedCell && this.isElementInViewport(selectedCell.get(0))) {
      event.preventDefault();
    }
  },

  moveAfterEdition: function (data) {
    if (data.event.which === this.keyCodes.ENTER) {
      this.moveDown();
    }

    if (data.event.which === this.keyCodes.TAB) {
      if (data.event.shiftKey) {
        this.moveLeft();
      } else {
        this.moveRight();
      }
    }
  }.on('cellEdited')
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
      .append('<input type="text" value="%@" />'.fmt(this.getCellValue(selectedCell)))
      .find('input')
      .on('blur', function () {
        self.removeErrorClasses($(this).parent());
      })
      .on('focus, click', function (event) {
        event.stopPropagation();
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
    this.placeEditor();
    this.selectAllEditorContent();
  },

  placeEditor: function () {
    var selectedCell = this.getSelectedCell(),
      input = selectedCell.find('input');

    // We need absolute positionning before checking the width/height of the cell
    // Otherwise, the input counts in the cell size
    input.css({
      position: 'absolute'
    });

    input.css({
      width: selectedCell.outerWidth(),
      height: selectedCell.outerHeight(),
      top: selectedCell.position().top,
      left: selectedCell.position().left
    });
  },

  selectAllEditorContent: function () {
    var selectedCell = this.getSelectedCell(),
      input = selectedCell.find('input'),
      domInput = input.get(0);

    domInput.selectionStart = 0;
    domInput.selectionEnd = input.val().length;
  },

  getCellValue: function (cell) {
    return cell.text();
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

    this.validateAndProcess(
      validator,
      this.processEditionSuccess,
      this.processEditionFailure,
      [value, row, column, applicator, event]);
  },

  processEditionSuccess: function (value, row, column, applicator, event) {
    this.getSelectedCell().focus();
    applicator.apply(this, [value, row, column]);
    this.set('editorShown', false);
    this.notifyEvent('cellEdited', {value: value, row: row, column: column, event: event});
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
EasyDatatable = Ember.Namespace.create({
  declareDatatable: function (namespace) {
    var copiedObjects = Ember.keys(EasyDatatable).filter(function (key) {
      return key.indexOf('EasyDatatable') === 0
    });
    copiedObjects.forEach(function (obj) {
      namespace[obj] = EasyDatatable[obj].extend();
    })
  },

  makeDatatable: function (datatable) {
    if (datatable instanceof Array) {
      datatable = {
        headers: [],
        body: datatable
      }
    }

    var self = this;

    return EasyDatatable.Datatable.create({
      headers: self.makeHeaderRow(datatable.headers),
      body: datatable.body.map(function (row) {
        return self.makeRow(row)
      })
    })
  },

  makeHeaderRow: function (row) {
    var dtRow = this.makeRow(row);
    dtRow.get('cells').forEach(function (item) {
      item.set('isHeader', true);
    });

    return dtRow;
  },

  makeRow: function (row) {
    var self = this;

    return EasyDatatable.DatatableRow.create({
      cells: row.map(function (item) {
        return self.makeCell(item)
      })
    });
  },

  makeCell: function (value) {
    if (!(value instanceof Object)) {
      value = {value: value}
    }
    return EasyDatatable.DatatableCell.create(value);
  }
});

EasyDatatable.Datatable = Ember.Object.extend({
  headers: null,
  body: null
});

EasyDatatable.DatatableRow = Ember.Object.extend({
  cells: null
});

EasyDatatable.DatatableCell = Ember.Object.extend({
  isSelected: false,
  isHeader: false,
  isProtected: false,
  value: null
});

EasyDatatable.EasyDatatableController = Ember.ObjectController.extend({
  selectedCellPosition: null,
  previouslySelectedCell : null,

  actions: {
    navigateLeft: function () {
      var current = this.get('selectedCellPosition'),
        newPosition = {row: current.row, column: current.column - 1};

      this.set('selectedCellPosition', this.fixPosition(newPosition));
    },

    navigateUp: function () {
      var current = this.get('selectedCellPosition'),
        newPosition = {row: current.row - 1, column: current.column};

      this.set('selectedCellPosition', this.fixPosition(newPosition));
    },

    navigateRight: function () {
      var current = this.get('selectedCellPosition'),
        newPosition = {row: current.row, column: current.column + 1};

      this.set('selectedCellPosition', this.fixPosition(newPosition));
    },

    navigateDown: function () {
      var current = this.get('selectedCellPosition'),
        newPosition = {row: current.row + 1, column: current.column};

      this.set('selectedCellPosition', this.fixPosition(newPosition));
    }
  },

  fixPosition: function (position) {
    var columnCount = this.get('model.body.firstObject.cells.length'),
      rowCount = this.get('model.body.length');

    if (position.column < 0) {
      position.column = columnCount - 1;
      position.row -= 1;
    }

    if (position.column >= columnCount) {
      position.column = 0;
      position.row += 1;
    }

    if (position.row < -1 || position.row >= rowCount) {
      position.row = null;
      position.column = null;
    }

    return position;
  },

  updateSelection: function () {
    var position = this.get('selectedCellPosition'),
      previous = this.get('previouslySelectedCell')
      cell = null;

    if (!Ember.isNone(previous)) {
      previous.set('isSelected', false);
    }

    if (Ember.isNone(position.row) || Ember.isNone(position.column)) {
      this.set('previouslySelectedCell', null);
      return;
    }

    if (position.row === -1) {
      cell = this.get('model.headers.cells')[position.column];
    } else {
      cell = this.get('model.body')[position.row].get('cells')[position.column];
    }

    cell.set('isSelected', true);
    this.set('previouslySelectedCell', cell);
  }.observes('selectedCellPosition')
});

EasyDatatable.EasyDatatableView = Ember.View.extend({
  classNames: ['easy-datatable-container']
});

EasyDatatable.EasyDatatableTableController = Ember.ObjectController.extend({
  datatableController: Ember.computed.alias('parentController')
});

EasyDatatable.EasyDatatableRowController = Ember.ObjectController.extend({
  datatableController: Ember.computed.alias('parentController.datatableController'),
  rowIndex: function () {
    return this.get('datatableController.model.body').indexOf(this.get('model'));
  }.property('model', 'datatableController.model.body.[]')
});

EasyDatatable.EasyDatatableRowView = Ember.View.extend({
  tagName: 'tr'
});

EasyDatatable.EasyDatatableCellController = Ember.ObjectController.extend({
  datatableController: Ember.computed.alias('parentController.datatableController'),
  rowIndex: Ember.computed.alias('parentController.rowIndex'),

  columnIndex: function () {
    return this.get('parentController.model.cells').indexOf(this.get('model'));
  }.property('model', 'parentController.model.cells.[]'),

  position: function () {
    return {
      row: this.get('rowIndex'),
      column: this.get('columnIndex')
    }
  }.property('rowIndex', 'columnIndex'),
});

EasyDatatable.EasyDatatableCellView = Ember.View.extend({
  templateName: 'easy_datatable_cell',
  classNameBindings: ['isProtected:protected'],
  attributeBindings: ['tabindex'],
  tabindex: 1,

  setTagName: function () {
    this.set('tagName', this.get('controller.model.isHeader') ? 'th' : 'td');
  }.observes('controller.model'),

  focusIn: function () {
    if (this.get('controller.isSelected')) return;
    this.set('controller.datatableController.selectedCellPosition', this.get('controller.position'));
  },

  keyDown: function (event) {
    this.navigate(event);
  },

  navigate: function (event) {
    if (event.ctrlKey) return;
    var mapping = {
        37: 'navigateLeft',
        38: 'navigateUp',
        39: 'navigateRight',
        40: 'navigateDown'
      },
      action = mapping[event.which];

    if (event.which === 9) {
      action = event.shiftKey ? 'navigateLeft' : 'navigateRight';
    }

    if (!Ember.isNone(action)) {
      event.preventDefault();
      this.get('controller.datatableController').send(action);
    }
  },

  focusWhenSelected: function () {
    Ember.run.schedule('afterRender', this, function () {
      if (this.get('controller.isSelected')) {
        this.$().focus();
      } else {
        this.$().blur();
      }
    });
  }.observes('controller.isSelected')
});

