EasyDatatable.EasyDatatableTableController = Ember.ObjectController.extend({
  datatableController: Ember.computed.alias('parentController')
});

EasyDatatable.EasyDatatableController = Ember.ObjectController.extend({
  selectedCellPosition: null,
  previouslySelectedCell : null,

  editAfterInsertion: false,
  showEditorForSelectedCell: false,

  actions: {
    navigateLeft: function () {
      this.set('selectedCellPosition', this.computeNavigateLeftPosition());
    },

    navigateUp: function () {
      this.set('selectedCellPosition', this.computeNavigateUpPosition());
    },

    navigateRight: function () {
      this.set('selectedCellPosition', this.computeNavigateRightPosition());
    },

    navigateDown: function () {
      this.set('selectedCellPosition', this.computeNavigateDownPosition());
    },

    addFirstRow: function () {
      var index = this.get('model').getIndexForFirstInsertableRow();

      this.insertRowAt(index, {row: index, column: 0});
    },

    addLastRow: function () {
      var index = this.get('model').getIndexForLastInsertableRow();

      this.insertRowAt(index, {row: index, column: 0});
    },

    insertRow: function (index) {
      if (this.get('model').rowCanBeInserted(index)) {
        this.insertRowAt(index, this.computeNavigateDownPosition);
      }
    },

    removeRow: function (index) {
      if (this.get('model').rowCanBeRemoved(index)) {
        this.get('model').removeRow(index);

        if (this.get('selectedCellPosition.row') === this.get('model.body.length')) {
          this.send('navigateUp');
        } else {
          this.notifyPropertyChange('selectedCellPosition');
        }
      }
    },

    addFirstColumn: function () {
      var index = this.get('model').getIndexForFirstInsertableColumn();

      this.insertColumnAt(index, {row: -1, column: index});
    },

    addLastColumn: function () {
      var index = this.get('model').getIndexForLastInsertableColumn();

      this.insertColumnAt(index, {row: -1, column: index});
    },

    insertColumn: function (index) {
      if (this.get('model').columnCanBeInserted(index)) {
        this.insertColumnAt(index, this.computeNavigateRightPosition);
      }
    },

    removeColumn: function (index) {
      if (this.get('model').columnCanBeRemoved(index)) {
        this.get('model').removeColumn(index);
        this.notifyPropertyChange('selectedCellPosition');
      }
    },

    moveRowUp: function (index) {
      if (this.get('model').rowCanMoveUp(index)) {
        this.get('model').moveRow(index, index - 1);
        this.send('navigateUp');
      }
    },

    moveRowDown: function (index) {
      if (this.get('model').rowCanMoveDown(index)) {
        this.get('model').moveRow(index, index + 1);
        this.send('navigateDown');
      }
    },

    moveColumnLeft: function (index) {
      if (this.get('model').columnCanMoveLeft(index)) {
        this.get('model').moveColumn(index, index - 1);
        this.send('navigateLeft');
      }
    },

    moveColumnRight: function (index) {
      if (this.get('model').columnCanMoveRight(index)) {
        this.get('model').moveColumn(index, index + 1);
        this.send('navigateRight');
      }
    }
  },

  firstEditableCellIndexInColumn: function (columnIndex) {
    var index;

    if (this.get('model.headers.cells')[columnIndex].get('isEditable')) {
      return -1;
    }
    for (index = 0; index < this.get('model.body.length'); index++) {
      if (this.get('model.body')[index].get('cells')[columnIndex].get('isEditable')) return index;
    }
  },

  navigateToFirstEditableCellInColumn: function () {
    var columnIndex = this.get('selectedCellPosition.column'),
       rowIndex = this.firstEditableCellIndexInColumn(columnIndex);

    if (!Ember.isNone(rowIndex)) {
      this.set('selectedCellPosition', {row: rowIndex, column: columnIndex});
    }
  },

  firstEditableCellIndexInRow: function (rowIndex) {
    var index, row = this.get('model.body')[rowIndex].get('cells');

    for (index = 0; index < row.length; index++) {
      if (row[index].get('isEditable')) return index;
    }
  },

  navigateToFirstEditableCellInRow: function () {
    var rowIndex = this.get('selectedCellPosition.row'),
      columnIndex = this.firstEditableCellIndexInRow(rowIndex);

    if (!Ember.isNone(columnIndex)) {
      this.set('selectedCellPosition', {row: rowIndex, column: columnIndex});
    }
  },

  highlightedColumn: function () {
    var position = this.get('selectedCellPosition');
    if (Ember.isNone(position) || position.row !== -1) return;

    return position.column;
  }.property('selectedCellPosition'),

  highlightedRow: function () {
    var position = this.get('selectedCellPosition'),
      cell = this.get('selectedCell');

    if (Ember.isNone(cell) || !cell.get('isHeader') || position.row < 0) return;
    return position.row;
  }.property('selectedCellPosition'),

  fixPosition: function (position) {
    if (!this.isRowValid(position)) {
      position = this.fixRowPosition(position);
    } else if (!(this.isColumnValid(position))) {
      position = this.fixColumnPosition(position);
    }

    if (!this.isRowValid(position) || !this.isColumnValid(position)) {
      position.row = null;
      position.column = null;
    }

    return position;
  },

  isRowValid: function (position) {
    var rowCount = this.get('model.body.length');
    return position.row >= -1 && position.row < rowCount;
  },

  isColumnValid: function (position) {
    var columnCount = this.get('model.headers.cells.length');
    return position.column >= 0 && position.column < columnCount;
  },

  fixRowPosition: function (position) {
    var rowCount = this.get('model.body.length');

    if (position.row < - 1) {
      position.row = rowCount - 1;
      position.column -= 1;
    }

    if (position.row >= rowCount) {
      position.row = -1;
      position.column += 1;
    }

    return position;
  },

  fixColumnPosition: function (position) {
    var columnCount = this.get('model.body.firstObject.cells.length');

    if (position.column < 0) {
      position.column = columnCount - 1;
      position.row -= 1;
    }

    if (position.column >= columnCount) {
      position.column = 0;
      position.row += 1;
    }

    return position;
  },

  computeNavigateUpPosition: function () {
    var current = this.get('selectedCellPosition');
    return this.fixPosition({row: current.row - 1, column: current.column});
  },

  computeNavigateDownPosition: function () {
    var current = this.get('selectedCellPosition');
    return this.fixPosition({row: current.row + 1, column: current.column});
  },

  computeNavigateRightPosition: function () {
    var current = this.get('selectedCellPosition');
    return this.fixPosition({row: current.row, column: current.column + 1});
  },

  computeNavigateLeftPosition: function () {
    var current = this.get('selectedCellPosition');
    return this.fixPosition({row: current.row, column: current.column - 1});
  },

  insertRowAt: function (index, nextPosition) {
    if (Ember.isNone(index)) return;

    this.get('model').insertRow(index);
    if (typeof(nextPosition) === 'function') {
      nextPosition = nextPosition.apply(this);
    }

    this.set('selectedCellPosition', nextPosition);
    if (this.get('editAfterInsertion')) {
      this.navigateToFirstEditableCellInRow();
      this.set('showEditorForSelectedCell', true);
    }
  },

  insertColumnAt: function (index, nextPosition) {
    if (Ember.isNone(index)) return;

    this.get('model').insertColumn(index);
    if (typeof(nextPosition) === 'function') {
      nextPosition = nextPosition.apply(this);
    }

    this.set('selectedCellPosition', nextPosition);
    if (this.get('editAfterInsertion')) {
      this.navigateToFirstEditableCellInColumn();
      this.set('showEditorForSelectedCell', true);
    }
  },

  selectedCell: function () {
    var position = this.get('selectedCellPosition');
    if (Ember.isNone(position) || Ember.isNone(position.row) || Ember.isNone(position.column)) return;

    if (position.row === -1) {
      return this.get('model.headers.cells')[position.column];
    }
    return this.get('model.body')[position.row].get('cells')[position.column];
  }.property('selectedCellPosition'),

  updateSelection: function () {
    var previous = this.get('previouslySelectedCell'),
      cell = this.get('selectedCell');

    if (!Ember.isNone(previous)) {
      previous.set('isSelected', false);
    }

    if (Ember.isNone(cell)) {
      this.set('previouslySelectedCell', null);
    } else {
      cell.set('isSelected', true);
      this.set('previouslySelectedCell', cell);
    }
  }.observes('selectedCellPosition')
});