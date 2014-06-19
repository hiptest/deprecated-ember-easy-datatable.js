Ember.EasyDatatable = Ember.Object.extend({
  tabindex: 1,
  tableSelector: '',
  selectionClass: 'selected',
  protectedClass: 'protected',
  validationErrorClasses: ['error'],

  addBehaviors: function () {
    var self = this,
      subObjects = {
        EasyDatatableHighlighter: ['selectionClass'],
        EasyDatatableKeyboardMoves: [],
        EasyDatatableEditor: [
          'protectedClass',
          'validationErrorClasses',
          'validateCellValue',
          'validateRowHeaderValue',
          'validateColumnHeaderValue',
          'updateCellValue',
          'updateRowHeaderValue',
          'updateColumnHeaderValue'
        ]
      };

    Ember.keys(subObjects).forEach(function (subCls) {
      Ember[subCls].create(self.makeSubObjectsCreationHash(subObjects[subCls]));
    });
  }.on('init'),

  makeSubObjectsCreationHash: function (copiedKeys) {
    var self = this,
      creationElements = {
        tabindex: this.get('tabindex'),
        tableSelector: this.get('tableSelector')
      };

    copiedKeys.forEach(function (key) {
      var value = self.get(key) || self[key];

      if (!Ember.isNone(value)) {
        creationElements[key] = value;
      }
    });
    return creationElements;
  }
});