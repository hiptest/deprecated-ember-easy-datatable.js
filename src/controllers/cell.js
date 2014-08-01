EasyDatatable.EasyDatatableCellController = Ember.ObjectController.extend({
  datatableController: Ember.computed.alias('parentController.datatableController'),
  rowIndex: Ember.computed.alias('parentController.rowIndex'),
  editorShown: false,
  inError: false,

  actions: {
    showEditor: function () {
      if (this.get('isEditable')) {
        this.set('editorShown', true);
      }
    },

    hideEditor: function () {
      this.set('editorShown', false);
      this.notifyPropertyChange('isSelected');
    },

    save: function (postSaveAction) {
      if (this.validateValue()) {
        this.set('inError', false);
        this.send('hideEditor');
        this.get('datatableController').send(postSaveAction);
      } else {
        this.set('inError', true);
      }
    },

    cancel: function (originalValue) {
      this.set('model.value', originalValue);
      this.set('inError', false);
      this.send('hideEditor');
    },

    saveOnLeave: function (originalValue) {
      if (this.validateValue()) {
        this.set('inError', false);
      } else {
        this.set('model.value', originalValue);
      }
      this.send('hideEditor');
    }
  },

  validateValue: function () {
    var datatable = this.get('datatableController.model'),
      cell = this.get('model'),
      position = this.get('position'),
      value = cell.get('value');
    return datatable.validateCell(cell, position, value);
  },

  columnIndex: function () {
    return this.get('parentController.model.cells').indexOf(this.get('model'));
  }.property('model', 'parentController.model.cells.[]'),

  position: function () {
    return {
      row: this.get('rowIndex'),
      column: this.get('columnIndex')
    };
  }.property('rowIndex', 'columnIndex'),

  inHighlightedRow: function () {
    return this.get('position.row') === this.get('datatableController.highlightedRow');
  }.property('position', 'datatableController.highlightedRow'),

  inHighlightedColumn: function () {
    return this.get('position.column') === this.get('datatableController.highlightedColumn');
  }.property('position', 'datatableController.highlightedColumn'),

  isHighlighted: Ember.computed.or('inHighlightedRow', 'inHighlightedColumn')
});