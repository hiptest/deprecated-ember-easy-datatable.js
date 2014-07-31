EasyDatatable.EasyDatatableEditorView = Ember.TextField.extend({
  originalValue: null,

  storeOriginalValue: function () {
    this.set('originalValue', this.get('value'));
  }.on('init'),

  restoreOriginalValue: function () {
    this.set('parentView.controller.model.value', this.get('originalValue'));
  },

  keyDown: function (event) {
    if (event.which === 27) {
      this.restoreOriginalValue();
      this.$().blur();
    }

    if (event.which === 13 || event.which === 9) {
      if (this.get('parentView.controller.datatableController.model').validateCell(
          this.get('parentView.controller.model'),
          this.get('parentView.controller.position'),
          this.get('value'))) {

        if (event.which === 13) {
          this.get('parentView.controller.datatableController').send('navigateDown');
        }

        if (event.which === 9) {
          event.preventDefault();
          this.get('parentView.controller.datatableController').send(event.shiftKey ? 'navigateLeft' : 'navigateRight');
        }

        this.set('parentView.inError', false);
        this.$().blur();
      } else {
        this.set('parentView.inError', true);
      }
    }
    event.stopPropagation();
  },

  focusOut: function () {
    this.get('parentView.controller').send('hideEditor');
    this.get('parentView').focusWhenSelected();
  },

  focusOnShow: function () {
    var selectedCell = this.$().closest('th, td');
    // We need absolute positionning before checking the width/height of the cell
    // Otherwise, the input counts in the cell size
    this.$()
      .css({position: 'absolute'})
      .css({
        width: selectedCell.outerWidth(),
        height: selectedCell.outerHeight(),
        top: selectedCell.position().top,
        left: selectedCell.position().left
      }).focus();
  }.on('didInsertElement')
});