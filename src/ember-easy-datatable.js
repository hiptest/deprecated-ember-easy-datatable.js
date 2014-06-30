Ember.EasyDatatable = Ember.Object.extend(Ember.Evented, {
  tabindex: 1,
  tableSelector: '',
  selectionClass: 'selected',
  protectedClass: 'protected',
  validationErrorClasses: ['error'],

  behaviors: null,

  allowedBehaviors: null,
  behaviorContructors: {
    highlighter: Ember.EasyDatatableHighlighter,
    keyboard: Ember.EasyDatatableKeyboardMoves,
    editor: Ember.EasyDatatableEditor,
    orderer: Ember.EasyDatatableOrderer,
    inserter: Ember.EasyDatatableInserter,
    remover: Ember.EasyDatatableRemover
  },
  behaviorAttributes: {
    highlighter: ['selectionClass'],
    keyboard: [],
    editor: [
      'protectedClass',
      'validationErrorClasses',
      'validateCellValue',
      'validateRowHeaderValue',
      'validateColumnHeaderValue',
      'updateCellValue',
      'updateRowHeaderValue',
      'updateColumnHeaderValue'
    ],
    orderer: [
      'moveColumnRight',
      'moveColumnLeft',
      'moveRowUp',
      'moveRowDown',
      'allowMoveColumnRight',
      'allowMoveColumnLeft',
      'allowMoveRowUp',
      'allowMoveRowDown'
    ],
    inserter: [],
    remover: []
  },

  addBehaviors: function () {
    var self = this,
      allowedBehaviors = this.get('allowedBehaviors') || Ember.keys(this.get('behaviorContructors')),
      behaviors = {};

    allowedBehaviors.forEach(function (behavior) {
      var constructor = self.get('behaviorContructors')[behavior],
        attributes = self.makeSubObjectsCreationHash(self.get('behaviorAttributes')[behavior]);

      behaviors[behavior] = constructor.create(attributes);
    });
    this.set('behaviors', behaviors);
  }.on('init'),

  makeSubObjectsCreationHash: function (copiedKeys) {
    var self = this,
      creationElements = {
        datatable: this,
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
  },

  dispatchEvent: function (event, data) {
    var behaviors = this.get('behaviors');
    this.trigger(event, data);
    Ember.keys(behaviors).forEach(function (behavior) {
      behaviors[behavior].trigger(event, data);
    });
  }
});