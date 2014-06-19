(function () {
  var sut;

  module(Ember.EasyDatatableEditor.toString(), {
    setup: function () {
      createSampleTable();
      sut = Ember.Object.createWithMixins(Ember.EasyDatatableEditor, {
        tableSelector: '#sample1'}
      );
    },

    teardown: function () {
      $('#qunit-fixtures').empty();
    }
  });

  test('addEditor', function () {
    var input;

    sut.get('table').find('tbody tr:first td').addClass('protected');
    sinon.stub(sut, 'getSelectedCell');

    sut.getSelectedCell.returns(sut.get('table').find('tbody tr:first td:first'));
    sut.addEditor();
    equal(sut.get('table').find('input').length, 0,
      'When the currently selected cell is protected, nothing happens');

    sut.getSelectedCell.returns(sut.get('table').find('tbody tr:last td:first'));
    sut.addEditor();
    input = sut.get('table').find('input');
    deepEqual(input.parent().get(0), sut.getSelectedCell().get(0),
      'Otherwise an input field is added in the currently selected cell');
    deepEqual(input.get(0), $(document.activeElement).get(0),
      'And it gets the focus');

    sut.getSelectedCell.restore();
  });

  test('removeEditor', function () {
    $('#qunit-fixtures, #sample1 td').each(function () {
      $(this).append('<input type="text" />');
    });

    equal($('#qunit-fixtures input').length, 17,
      'We now have 16 input accross the table + one in the fixtures div');

    sut.removeEditor();
    equal($('#sample1 input').length, 0,
      'After calling removeEditor, the inputs are gone ...');
    equal($('#qunit-fixtures input').length, 1,
      '... but the one outside the table is still there');
  });

  test('addRemoveEditor', function () {
    sinon.stub(sut, 'addEditor', Ember.K);
    sinon.stub(sut, 'removeEditor', Ember.K);

    sut.set('editorShown', true);
    ok(sut.addEditor.calledOnce && sut.removeEditor.callCount === 0,
      'When setting editorShown to true, adEditor is automaticaly called');

    sut.set('editorShown', false);
    ok(sut.addEditor.calledOnce && sut.removeEditor.calledOnce,
      'And when it is set to false, remove editor is called');

    sut.removeEditor.restore();
    sut.addEditor.restore();
  });

  test('addErrorClasses', function () {
    var cell = sut.get('table').find('th:first');
    sut.set('validationErrorClasses', ['error', 'danger', 'stuff']);
    sut.get('table').find('th:first').focus();

    equal(cell.attr('class'), null);
    sut.addErrorClasses();
    equal(cell.attr('class'), 'error danger stuff',
      'If no element is specified, it adds the error classes to the selected element');

    equal(sut.get('table').attr('class'), null);
    sut.addErrorClasses(sut.get('table'));
    equal(sut.get('table').attr('class'), 'error danger stuff',
      'It an element is specified, the error classes are added to it');
  });

  test('removeErrorClasses', function () {
    var cell = sut.get('table').find('th:first');
    cell.addClass('this is a long list of classes');
    sut.set('validationErrorClasses', ['long', 'of', 'classes']);
    sut.get('table').find('th:first').focus();

    equal(cell.attr('class'), 'this is a long list of classes');
    sut.removeErrorClasses();
    equal(cell.attr('class'), 'this is a list',
      'If no element is specified, it removes the error classes to the selected element');

    sut.get('table').addClass('this is a long list of classes');
    sut.removeErrorClasses(sut.get('table'));
    equal(sut.get('table').attr('class'), 'this is a list',
      'It an element is specified, the error classes are removed from it');
  });

  test('cellIsEdited', function () {
    sinon.stub(sut, 'getSelectedCell');
    sinon.stub(sut, 'processEdition', Ember.K);

    sut.getSelectedCell.returns(sut.get('table').find('thead th:nth(3)'));
    sut.cellIsEdited('A value', 'someEvent');
    deepEqual(sut.processEdition.getCall(0).args, ['ColumnHeader', 'A value', -1, 3, 'someEvent'],
      'If the currently selected cell is in the header, it calls processEvent with "ColumnHeader" as type');

    sut.getSelectedCell.returns(sut.get('table').find('tbody tr:first th:first'));
    sut.cellIsEdited('Another value', 'someEvent');
    deepEqual(sut.processEdition.getCall(1).args, ['RowHeader', 'Another value', 0, 0, 'someEvent'],
      'If the currently selected cell is a <th> in the body, it calls processEvent with "RowHeader" as type');

    sut.getSelectedCell.returns(sut.get('table').find('tbody tr:nth(2) td:nth(3)'));
    sut.cellIsEdited('Yet another value', 'someEvent');
    // Note: the 3rd <td> is at the 4th column due to the <th> element
    deepEqual(sut.processEdition.getCall(2).args, ['Cell', 'Yet another value', 2, 4, 'someEvent'],
      'Otherwise, it calls processEvent with "Cell" as type');

    sut.getSelectedCell.restore();
    sut.processEdition.restore();
  });

  test('validateCellValue', function () {
    ok(sut.validateCellValue(),
      'It simply returns true and should be overriden if more complex validation is needed');
  });

  test('validateRowHeaderValue', function () {
    ok(sut.validateRowHeaderValue(),
      'It simply returns true and should be overriden if more complex validation is needed');
  });

  test('validateColumnHeaderValue', function () {
    ok(sut.validateColumnHeaderValue(),
      'It simply returns true and should be overriden if more complex validation is needed');
  });

  test('updateCellValue', function () {
    sut.updateCellValue('My new value', 3, 3);
    equal(sut.get('table').find('tbody tr:nth(3)').text(), '#3Row 33My new value23',
      'It only updates the cell content. When using data with Ember, it should be overriden to update real values');
  });

  test('updateRowHeaderValue', function () {
    sut.updateRowHeaderValue('My new value', 0, 0);
    equal(sut.get('table').find('tbody tr:nth(0)').text(), 'My new valueRow 001020',
      'It only updates the cell content. When using data with Ember, it should be overriden to update real values');
  });

  test('updateColumnHeaderValue', function () {
    sut.updateColumnHeaderValue('My new value', 0, 3);
    sut.updateRowHeaderValue('My new value', 0, 0);
    equal(sut.get('table').find('thead').text(), 'NameValue 1My new valueValue 3',
      'It only updates the cell content. When using data with Ember, it should be overriden to update real values');

    sut.updateColumnHeaderValue('My other value', 1664, 4);
    equal(sut.get('table').find('thead').text(), 'NameValue 1My new valueMy other value',
      'The row parameter has no impact');
  });

  test('processEdition: wrong type', function () {
    var validatorStub = sinon.stub(sut, 'validateCellValue'),
      event = {
        stopPropagation: function () {}
      };

    throws(
      function() {
        sut.processEdition('somethingWrong');
      },
      "An error is thrown if the type argument is incorrect"
    );
  });

  test('processEdition: event is stopped', function () {
    var validatorStub = sinon.stub(sut, 'validateRowHeaderValue'),
      event = {
        preventDefault: function () {},
        stopPropagation: function () {}
      };

    validatorStub.onFirstCall().returns(true);
    validatorStub.onSecondCall().returns(false);

    sinon.spy(event, 'preventDefault');
    sinon.spy(event, 'stopPropagation');

    $('#sample1 tbody tr:first th:first').focus().click();
    sut.processEdition('RowHeader', 0, 0, 'My value', event);
    ok(event.preventDefault.calledOnce && event.stopPropagation.calledOnce,
      'Event default and propagation are stopped if validation succeded');

    $('#sample1 tbody tr:first td:first').focus().click();
    sut.processEdition('RowHeader', 0, 1, 'My value', event);
    ok(event.preventDefault.calledTwice && event.stopPropagation.calledTwice,
      'Same thing if validation failed');

    event.preventDefault.restore();
    event.stopPropagation.restore();
  });

  test('processEdition: validation success', function () {
    var event = {
        preventDefault: function () {},
        stopPropagation: function () {}
      };

    $('#sample1 tbody tr:first td:first').focus().click();
    sinon.stub(sut, 'validateCellValue').returns(true);
    sinon.stub(sut, 'updateCellValue', Ember.K);
    sinon.spy(sut, 'removeErrorClasses');

    sut.processEdition('Cell', 0, 1, 'My value', event);
    ok(sut.removeErrorClasses.calledOnce,
       'The errors are removed');
    ok(sut.updateCellValue.calledOnce,
       'The function to update the cell value is called');
    ok(!sut.get('editorShown'),
       'The editor is not shown');
    deepEqual(document.activeElement, sut.getSelectedCell().get(0),
       'The current cell gets the focus back');

    sut.updateCellValue.restore();
    sut.removeErrorClasses.restore();
  });

  test('processEdition: validation failed', function () {
    var event = {
        preventDefault: function () {},
        stopPropagation: function () {}
      };

    sinon.stub(sut, 'validateCellValue').returns(false);
    sinon.stub(sut, 'updateCellValue', Ember.K);
    sinon.spy(sut, 'addErrorClasses');

    $('#sample1 tbody tr:first td:first').focus().click();
    sut.processEdition('Cell', 0, 0, 'My value', event);
    ok(sut.addErrorClasses.calledOnce,
      'If validation failed, then the errors are added');
    ok(sut.get('editorShown'),
      'And the editor is still shown');
    equal(sut.updateCellValue.callCount, 0,
      'The method to update the value is not called');

    sut.updateCellValue.restore();
    sut.addErrorClasses.restore();
  });

})();