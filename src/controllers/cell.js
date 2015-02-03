EasyDatatable.EasyDatatableCellController = Ember.ObjectController.extend({
  datatableController: Ember.computed.alias('parentController.datatableController'),
  rowIndex: Ember.computed.alias('parentController.rowIndex'),
  editorShown: false,
  inError: false,
  errorMessage: '',

  actions: {
    startEdition: function () {
      if (this.get('isEditable')) {
        this.set('editorShown', true);
      }
    },

    stopEdition: function () {
      this.set('errorMessage', '');
      this.set('inError', false);
      this.set('editorShown', false);
      this.notifyPropertyChange('isSelected');
    },

    save: function (newValue, postSaveAction) {
      var self = this;

      this.validateValue(newValue).then(function (validatedNewValue) {
        if (self.get('isDestroyed')) {
          return;
        }
        self.set('model.value', validatedNewValue);
        self.send('stopEdition');
        self.get('datatableController.model').notifyPropertyChange('contentUpdated');
        if (!Ember.isNone(postSaveAction)) {
          self.get('datatableController').send(postSaveAction);
        }
      }, function (error) {
        if (self.get('isDestroyed')) {
          return;
        }
        self.set('inError', true);
        self.set('errorMessage', error);
      });
    },

    saveOnLeave: function (newValue) {
      var self = this;

      this.validateValue(newValue).then(function (validatedNewValue) {
        if (self.get('isDestroyed')) {
          return;
        }
        self.set('model.value', validatedNewValue);
        self.send('stopEdition');
        self.get('datatableController.model').notifyPropertyChange('contentUpdated');
      }, function (error) {
        if (self.get('isDestroyed')) {
          return;
        }
        self.send('stopEdition');
      });
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

  validateValue: function (value) {
    var datatable = this.get('datatableController.model'),
      cell = this.get('model'),
      position = this.get('position'),
      isValid;
    isValid = datatable.validateCell(cell, position, value);
    // is it a promise? (async validation)
    if (isValid instanceof Ember.RSVP.Promise) {
      return isValid;
    // no, so it is a boolean (sync validation)
    } else if (isValid) {
      return Ember.RSVP.Promise.resolve(value);
    } else {
      return Ember.RSVP.Promise.reject("Invalid value");
    }
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
