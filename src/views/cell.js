EasyDatatable.EasyDatatableCellView = Ember.View.extend({
  templateName: 'easy_datatable_cell',
  classNameBindings: [
    'controller.isProtected:protected',
    'controller.isSelected:selected',
    'controller.isHighlighted:highlighted',
    'inError:error'
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
        if (event.keyCode === 45) { //INSERT
          if (this.get('controller.position.row') === -1) {
            this.get('controller.datatableController').send('insertColumn', this.get('controller.position.column') + 1);
          } else {
            this.get('controller.datatableController').send('insertRow', this.get('controller.position.row') + 1);
          }
        }

        if (event.keyCode === 46) { //DELETE
          if (this.get('controller.position.row') === -1) {
            this.get('controller.datatableController').send('removeColumn', this.get('controller.position.column'));
          } else {
            this.get('controller.datatableController').send('removeRow', this.get('controller.position.row'));
          }
        }

        if (this.get('controller.position.row') >= 0) {
          if (event.which === 38) {
            this.get('controller.datatableController').send('moveRowUp', this.get('controller.position.row'));
          }

          if (event.which === 40) {
            this.get('controller.datatableController').send('moveRowDown', this.get('controller.position.row'));
          }
        } else {
          if (event.which === 37) {
            this.get('controller.datatableController').send('moveColumnLeft', this.get('controller.position.column'));
          }

          if (event.which === 39) {
            this.get('controller.datatableController').send('moveColumnRight', this.get('controller.position.column'));
          }
        }

      }
      return;
    }

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
    } else {
      this.get('controller').send('showEditor');
    }
  },

  click: function () {
    this.get('controller').send('showEditor');
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