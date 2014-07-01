(function () {
  module('%@ integration - content edition'.fmt(Ember.EasyDatatable.toString()), {
    setup: function () {
      App.IndexView = Ember.View.extend({
        template: Ember.Handlebars.compile(makeSampleTable()),

        addDatatable: function () {
          Ember.EasyDatatable.create({tableSelector: '#sample1'});
        }.on('didInsertElement')
      });

      DatatableIntegrationHelpers.registerHelpers();
      App.injectTestHelpers();
    },

    teardown: function () {
      App.reset();
    }
  });

  test('click and edit', function () {
    expect(4);

    visit('/')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 1)
      .assertEditorShown()
      .typeInDatatable('This is my row')
      .pressEnterInDatatable()
      .clickOnDatatableCell(0, 0)
      .assertEditorShown()
      .assertDatatableContent([
        ['This is my row', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ]);
  });

  test('navigate, press enter and edit', function () {
    expect(4);

    visit('/')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 1)
      .pressEscInDatatable()
      .pressRightKeyInDatatable()
      .pressDownKeyInDatatable()
      .pressEnterInDatatable()
      .assertEditorShown()
      .typeInDatatable('My new value')
      .pressEnterInDatatable()
      .assertEditorNotShown()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', 'My new value', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ]);
  });

  test('navigate, start typing to replace the cell content', function () {
    expect(4);

    visit('/')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 1)
      .pressEscInDatatable()
      .typeInDatatable('I type something without having an input')
      .assertEditorShown()
      .pressEnterInDatatable()
      .assertEditorNotShown()
      .assertDatatableContent([
        ['I type something without having an input', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ]);
  });

  test('cells with a class "protected" can not be edited', function () {
    expect(6);

    visit('/')
      .then(function () {
        $('#app table thead th:first').addClass('protected');
        $('#app table tbody tr:odd th').addClass('protected');
        $('#app table tbody tr:even td:first').addClass('protected');
      })
      .clickOnDatatableCell(0, 0)
      .assertEditorNotShown(
        'When clicking on the protected cell, the editor does not show up')
      .clickOnDatatableCell(0, 1)
      .assertEditorShown(
        '(but it still work on a non protected cell)')
      .pressEscInDatatable()
      .pressDownKeyInDatatable()
      .pressEnterInDatatable()
      .assertEditorNotShown(
        'When pressing enter in a protected cell, we do not get the editor')
      .pressDownKeyInDatatable()
      .pressEnterInDatatable()
      .assertEditorShown(
        '(but it still works in non protected cells)')
      .pressEscInDatatable()
      .pressLeftKeyInDatatable()
      .typeInDatatable('Hey')
      .assertEditorNotShown(
        'Same principle when typing in a protected cell')
      .pressDownKeyInDatatable()
      .typeInDatatable('Ho')
      .assertEditorShown(
        '(but it still works in non protected cells)')
      .pressEscInDatatable();
  });

  test('cells with a class "protected" can not be edited', function () {
    expect(7);

    visit('/')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(2, 2)
      .typeInDatatable('x')
      .pressEnterInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', 'x', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .assertSelectedDatatableCell(3, 2,
        'If the cell value is validated using enter, then cell below is selected')
      .typeInDatatable('y')
      .pressTabKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', 'x', '11', '21'],
        ['Row 2', 'y', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .assertSelectedDatatableCell(3, 3,
        'If the cell value is validated using tab, then cell on the right is selected')
      .typeInDatatable('z')
      .pressShiftTabKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', 'x', '11', '21'],
        ['Row 2', 'y', 'z', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .assertSelectedDatatableCell(3, 2,
        'If the cell value is validated using shift+tab, then cell on the left is selected');
  });
})();