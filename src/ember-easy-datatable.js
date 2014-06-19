Ember.EasyDatatable = Ember.Object.extend(
  Ember.EasyDatatableHighlighter, Ember.EasyDatatableKeyboardMoves, {
  tabindex: 1,
  protectedClass: 'protected',
  validationErrorClasses: ['error'],

  editorShown: false,

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