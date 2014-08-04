Ember.TEMPLATES["easy_datatable"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "easy_datatable_table", "model", options) : helperMissing.call(depth0, "render", "easy_datatable_table", "model", options))));
  
});

Ember.TEMPLATES["easy_datatable_cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var stack1;
  stack1 = helpers._triageMustache.call(depth0, "view.displayableIndex", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  }

function program3(depth0,data) {
  
  
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "easy_datatable_editor", {hash:{
    'valueBinding': ("value")
  },hashTypes:{'valueBinding': "STRING"},hashContexts:{'valueBinding': depth0},contexts:[depth0],types:["STRING"],data:data})));
  }

  stack1 = helpers['if'].call(depth0, "isIndex", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = helpers._triageMustache.call(depth0, "value", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = helpers['if'].call(depth0, "editorShown", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
  
});

Ember.TEMPLATES["easy_datatable_row"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "easy_datatable_cell", "cell", options) : helperMissing.call(depth0, "render", "easy_datatable_cell", "cell", options))));
  data.buffer.push("\n");
  return buffer;
  }

  stack1 = helpers.each.call(depth0, "cell", "in", "cells", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});

Ember.TEMPLATES["easy_datatable_table"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var helper, options;
  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "easy_datatable_row", "row", options) : helperMissing.call(depth0, "render", "easy_datatable_row", "row", options))));
  }

  data.buffer.push("<thead>\n  ");
  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "easy_datatable_row", "headers", options) : helperMissing.call(depth0, "render", "easy_datatable_row", "headers", options))));
  data.buffer.push("\n</thead>\n<tbody>\n  ");
  stack1 = helpers.each.call(depth0, "row", "in", "body", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</tbody>\n");
  return buffer;
  
});
EasyDatatable = Ember.Namespace.create({
  declareDatatable: function (namespace) {
    var copiedObjects = Ember.keys(EasyDatatable).filter(function (key) {
      return key.indexOf('EasyDatatable') === 0;
    });

    copiedObjects.forEach(function (obj) {
      namespace[obj] = EasyDatatable[obj].extend();
    });
  },

  makeDatatable: function (datatable) {
    if (datatable instanceof Array) {
      datatable = {
        headers: [],
        body: datatable
      };
    }

    var self = this,
      creationHash = {
        headers: self.makeHeaderRow(datatable.headers),
        body: datatable.body.map(function (row) {
          return self.makeRow(row);
        })
      },
      copiedMethods = ['makeDefaultRow', 'makeDefaultColumn', 'validateCell'];

    copiedMethods.forEach(function (name) {
      if (Ember.isNone(datatable[name])) return;
      creationHash[name] = datatable[name];
    });

    return EasyDatatable.Datatable.create(creationHash);
  },

  makeHeaderRow: function (row) {
    var dtRow = this.makeRow(row);
    dtRow.get('cells').forEach(function (item) {
      item.set('isHeader', true);
    });

    return dtRow;
  },

  makeRow: function (row) {
    var self = this;

    return EasyDatatable.DatatableRow.create({
      cells: row.map(function (item) {
        return self.makeCell(item);
      })
    });
  },

  makeCell: function (value) {
    if (!(value instanceof Object)) {
      value = {value: value};
    }
    return EasyDatatable.DatatableCell.create(value);
  },

  moveObject: function (list, from, to) {
    var moved = list[from];

    list.removeAt(from);
    list.insertAt(to, moved);
  },

  makeListOf: function (size) {
    var list = [], i;
    for (i = 0; i < size; i++) {
      list.push(null);
    }
    return list;
  }
});

EasyDatatable.DatatableCell = Ember.Object.extend({
  isSelected: false,
  isHeader: false,
  isEditable: true,
  isMovable: true,
  isRemovable: true,
  canInsertColumnAfter: true,
  canInsertRowAfter: true,
  value: null
});
EasyDatatable.DatatableRow = Ember.Object.extend({
  cells: null,

  moveCell: function (from, to) {
    EasyDatatable.moveObject(this.get('cells'), from, to);
  }
});
EasyDatatable.Datatable = Ember.Object.extend({
  headers: null,
  body: null,
  canInsertColumns: true,
  canInsertRows: true,

  validateCell: function (cell, position, value) {
    return true;
  },

  columnCanMove: function (index) {
    return this.get('headers.cells')[index].get('isMovable');
  },

  columnCanMoveLeft: function (index) {
    return this.columnCanMove(index) && index > 0 && this.columnCanMove(index - 1);
  },

  columnCanMoveRight: function (index) {
    return this.columnCanMove(index) && index < this.get('headers.cells.length') - 1  && this.columnCanMove(index + 1);
  },

  rowCanMove: function (index) {
    return this.get('body')[index].get('cells').every(function (cell) {
      return cell.get('isMovable');
    });
  },

  rowCanMoveUp: function (index) {
    return this.rowCanMove(index) && index > 0 && this.rowCanMove(index - 1);
  },

  rowCanMoveDown: function (index) {
    return this.rowCanMove(index) && index < this.get('body.length') - 1  && this.rowCanMove(index + 1);
  },

  columnCanBeRemoved: function (index) {
    return this.get('headers.cells')[index].get('isRemovable');
  },

  rowCanBeRemoved: function (index) {
    return this.get('body')[index].get('cells').every(function (cell) {
      return cell.get('isRemovable');
    });
  },

  makeDefaultRow: function (index) {
    return EasyDatatable.makeListOf(this.get('headers.cells.length'));
  },

  makeDefaultColumn: function (index) {
    var column = EasyDatatable.makeListOf(this.get('body.length') + 1);
    column[0] = {isHeader: true};
    return column;
  },

  rowCanBeInserted: function (index) {
    if (this.get('canInsertRows')) {
      if (index === 0) return true;
      return this.get('body')[index - 1].get('cells').every(function (cell) {
        return cell.get('canInsertRowAfter');
      });
    }
    return false;
  },

  insertRow: function (index) {
    this.get('body').insertAt(index, EasyDatatable.makeRow(this.makeDefaultRow(index)));
  },

  columnCanBeInserted: function (index) {
    if (this.get('canInsertColumns')) {
      if (index === 0) return true;
      return this.get('headers.cells')[index - 1].get('canInsertColumnAfter');
    }
    return false;
  },

  insertColumn: function (index) {
    var column = this.makeDefaultColumn(index);
    this.get('headers.cells').insertAt(index, EasyDatatable.makeCell(column[0]));
    this.get('body').forEach(function (row, rowIndex) {
      row.get('cells').insertAt(index, EasyDatatable.makeCell(column[rowIndex + 1]));
    });
  },

  removeRow: function (index) {
    this.get('body').removeAt(index);
  },

  removeColumn: function (index) {
    this.get('headers.cells').removeAt(index);
    this.get('body').forEach(function (row) {
      row.get('cells').removeAt(index);
    });
  },

  moveRow: function (from, to) {
    EasyDatatable.moveObject(this.get('body'), from, to);
  },

  moveColumn: function (from, to) {
    this.get('headers').moveCell(from, to);
    this.get('body').forEach(function (row) {
      row.moveCell(from, to);
    });
  }
});
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
EasyDatatable.EasyDatatableRowController = Ember.ObjectController.extend({
  datatableController: Ember.computed.alias('parentController.datatableController'),

  rowIndex: function () {
    return this.get('datatableController.model.body').indexOf(this.get('model'));
  }.property('model', 'datatableController.model.body.[]')
});
EasyDatatable.EasyDatatableTableController = Ember.ObjectController.extend({
  datatableController: Ember.computed.alias('parentController')
});

EasyDatatable.EasyDatatableController = Ember.ObjectController.extend({
  selectedCellPosition: null,
  previouslySelectedCell : null,

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

    insertRow: function (index) {
      if (this.get('model').rowCanBeInserted(index)) {
        this.get('model').insertRow(index);
        this.send('navigateDown');
      }
    },

    removeRow: function (index) {
      if (this.get('model').rowCanBeRemoved(index)) {
        this.get('model').removeRow(index);
        this.notifyPropertyChange('selectedCellPosition');
      }
    },

    insertColumn: function (index) {
      if (this.get('model').columnCanBeInserted(index)) {
        this.get('model').insertColumn(index);
        this.send('navigateRight');
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
    if (this.get('controller.position.row') === -1) {
      this.manipulateColumns(event);
    } else {
      this.manipulateRows(event);
    }
  },

  manipulateColumns: function (event) {
    if (event.keyCode === 45) {
      this.get('controller.datatableController').send('insertColumn', this.get('controller.position.column') + 1);
    }

    if (event.keyCode === 46) {
      this.get('controller.datatableController').send('removeColumn', this.get('controller.position.column'));
    }

    if (event.which === 37) {
      this.get('controller.datatableController').send('moveColumnLeft', this.get('controller.position.column'));
    }

    if (event.which === 39) {
      this.get('controller.datatableController').send('moveColumnRight', this.get('controller.position.column'));
    }
  },

  manipulateRows: function (event) {
    if (event.keyCode === 45) {
      this.get('controller.datatableController').send('insertRow', this.get('controller.position.row') + 1);
    }

    if (event.keyCode === 46) {
      this.get('controller.datatableController').send('removeRow', this.get('controller.position.row'));
    }

    if (event.which === 38) {
      this.get('controller.datatableController').send('moveRowUp', this.get('controller.position.row'));
    }

    if (event.which === 40) {
      this.get('controller.datatableController').send('moveRowDown', this.get('controller.position.row'));
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
EasyDatatable.EasyDatatableEditorView = Ember.TextField.extend({
  originalValue: null,
  cellController: Ember.computed.alias('parentView.controller'),

  storeOriginalValue: function () {
    this.set('originalValue', this.get('value'));
  }.on('init'),

  keyDown: function (event) {
    event.stopPropagation();
    if (event.which === 27) {
      this.get('cellController').send('cancel', this.get('originalValue'));
    }

    if (event.which === 13 || event.which === 9) {
      event.preventDefault();

      var postSaveAction = 'navigateDown';
      if (event.which === 9) {
        postSaveAction = event.shiftKey ? 'navigateLeft' : 'navigateRight';
      }
      this.get('cellController').send('save', postSaveAction);
    }
  },

  focusOut: function () {
    this.get('cellController').send('saveOnLeave', this.get('originalValue'));
  },

  placeAndFocusOnShow: function () {
    var selectedCell = this.$().closest('th, td'),
      domElement = this.$().get(0);
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

    domElement.selectionStart = 0;
    domElement.selectionEnd = this.get('value').toString().length;
  }.on('didInsertElement'),

});
EasyDatatable.EasyDatatableRowView = Ember.View.extend({
  tagName: 'tr'
});
EasyDatatable.EasyDatatableView = Ember.View.extend({
  classNames: ['easy-datatable-container']
});

EasyDatatable.EasyDatatableTableView = Ember.View.extend({
  tagName: 'table',
  classNames: ['table', 'table-stripped', 'table-collapsed']
});