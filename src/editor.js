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
    this.updateCSSForFirefox();
  },

  updateCSSForFirefox: function () {
    // Firefox does not really display the input as expected ...
    if (navigator.userAgent.search("Firefox") === -1) {
      return;
    }

    var selectedCell = this.getSelectedCell(),
      input = selectedCell.find('input');

    input.css({
      width: selectedCell.outerWidth(),
      height: selectedCell.outerHeight(),
      top: selectedCell.position().top,
      left: selectedCell.position().left
    });
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