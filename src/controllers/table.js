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
    },

    addLastRow: function () {
      var index = this.get('model').getIndexForLastInsertableRow();

      if (!Ember.isNone(index)) {
        this.get('model').insertRow(index);
        this.set('selectedCellPosition', {row: index, column: 0});
        if (this.get('editAfterInsertion')) {
          this.navigateToFirstEditableCellInRow();
          this.set('showEditorForSelectedCell', true);
        }
      }
    },

    insertRow: function (index) {
      if (this.get('model').rowCanBeInserted(index)) {
        this.get('model').insertRow(index);
        this.send('navigateDown');
        if (this.get('editAfterInsertion')) {
          this.navigateToFirstEditableCellInRow();
          this.set('showEditorForSelectedCell', true);
        }
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

    addLastColumn: function () {
      var index = this.get('model').getIndexForLastInsertableColumn();

      if (!Ember.isNone(index)) {
        this.get('model').insertColumn(index);
        this.set('selectedCellPosition', {row: -1, column: index});
        if (this.get('editAfterInsertion')) {
          this.navigateToFirstEditableCellInColumn();
          this.set('showEditorForSelectedCell', true);
        }
      }
    },

    insertColumn: function (index) {
      if (this.get('model').columnCanBeInserted(index)) {
        this.get('model').insertColumn(index);
        this.send('navigateRight');
        if (this.get('editAfterInsertion')) {
          this.navigateToFirstEditableCellInColumn();
          this.set('showEditorForSelectedCell', true);
        }
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