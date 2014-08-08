EasyDatatable.EasyDatatableCellView = Ember.View.extend({
  templateName: 'easy_datatable_cell',
  classNameBindings: [
    'controller.isEditable::protected',
    'controller.isSelected:selected',
    'controller.isHighlighted:highlighted',
    'controller.inError:error',
    'controller.inError:alert',
    'controller.inError:alert-danger'
  ],
  attributeBindings: ['tabindex'],
  tabindex: 1,

  displayableIndex: function () {
    return this.get('controller.position.row') + 1;
  }.property('controller.position'),

  setTagName: function () {
    this.set('tagName', this.get('controller.model.isHeader') ? 'th' : 'td');
  }.observes('controller.model'),

  focusIn: function () {
    if (this.get('controller.isSelected')) return;
    this.set('controller.datatableController.selectedCellPosition', this.get('controller.position'));
  },

  keyDown: function (event) {
    if (event.ctrlKey) {
      if (this.get('controller.model.isHeader')) {
        this.manipulate(event);
      }
    } else if (!this.navigate(event)) {
      this.get('controller').send('showEditor');
    }
  },

  navigate: function (event) {
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
      return true;
    }
  },

  manipulate: function (event) {
    var mapping, action;
    if (this.get('controller.position.row') === -1) {
      mapping = {
        45: 'insertColumnAfter',
        46: 'removeColumn',
        37: 'moveColumnLeft',
        39: 'moveColumnRight'
      };
    } else {
      mapping = {
        45: 'insertRowAfter',
        46: 'removeRow',
        38: 'moveRowUp',
        40: 'moveRowDown'
      };
    }

    action = mapping[event.which];
    if (!Ember.isNone(action)) {
      this.get('controller').send(action);
    }
  },

  click: function () {
    this.get('controller').send('showEditor');
  },

  showEditorWhenAsked: function () {
    Ember.run.schedule('afterRender', this, function () {
      if (this.get('controller.isSelected') && !this.get('controller.editorShown') && this.get('controller.datatableController.showEditorForSelectedCell')) {
        this.get('controller').send('showEditor');
        this.set('controller.datatableController.showEditorForSelectedCell', false);
      }
    });
  }.observes('controller.datatableController.showEditorForSelectedCell'),

  focusWhenSelected: function () {
    Ember.run.schedule('afterRender', this, function () {
      if (this.get('controller.isSelected') && !this.get('controller.editorShown')) {
        this.$().focus();
      } else {
        this.$().blur();
      }
    });
  }.observes('controller.isSelected')
});