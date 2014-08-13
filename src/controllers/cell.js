EasyDatatable.EasyDatatableCellController = Ember.ObjectController.extend({
  datatableController: Ember.computed.alias('parentController.datatableController'),
  rowIndex: Ember.computed.alias('parentController.rowIndex'),
  editorShown: false,
  inError: false,
  errorMessage: '',

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
      var self = this;

      this.validateValue().then(function () {
        self.set('inError', false);
        self.set('errorMessage', '');
        self.send('hideEditor');
        self.get('datatableController.model').notifyPropertyChange('contentUpdated');
        if (!Ember.isNone(postSaveAction)) {
          self.get('datatableController').send(postSaveAction);
        }
      }, function (error) {
        self.set('inError', true);
        self.set('errorMessage', error);
      });
    },

    cancel: function (originalValue) {
      this.set('model.value', originalValue);
      this.set('inError', false);
      this.send('hideEditor');
    },

    saveOnLeave: function (originalValue) {
      this.send('save');

      if (this.get('inError')) {
        this.set('model.value', originalValue);
        this.set('inError', false);
        this.send('hideEditor');
      }
    },

    insertRowAfter: function () {
      this.get('datatableController').send('insertRow', this.get('position.row') + 1);
    },

    removeRow: function () {
      this.get('datatableController').send('removeRow', this.get('position.row'));
    },

    moveRowUp: function () {
      this.get('datatableController').send('moveRowUp', this.get('position.row'));
    },

    moveRowDown: function () {
      this.get('datatableController').send('moveRowDown', this.get('position.row'));
    },

    insertColumnAfter: function () {
      this.get('datatableController').send('insertColumn', this.get('position.column') + 1);
    },

    removeColumn: function () {
      this.get('datatableController').send('removeColumn', this.get('position.column'));
    },

    moveColumnLeft: function () {
      this.get('datatableController').send('moveColumnLeft', this.get('position.column'));
    },

    moveColumnRight: function () {
      this.get('datatableController').send('moveColumnRight', this.get('position.column'));
    }
  },

  validateValue: function () {
    var datatable = this.get('datatableController.model'),
      cell = this.get('model'),
      position = this.get('position'),
      value = cell.get('value');
    return this.makePromise(datatable.validateCell(cell, position, value));
  },

  makePromise: function (value) {
    if (value instanceof Ember.RSVP.Promise) return value;
    return {
      then: function (success, failure) {
        if (value) {
          success();
        } else {
          failure();
        }
      }
    };
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