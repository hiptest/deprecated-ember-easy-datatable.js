(function () {
  module('%@ integration - content edition'.fmt(Ember.EasyDatatable.toString()), {
    setup: function () {
      App.IndexView = Ember.View.extend({
        template: Ember.Handlebars.compile(makeSampleTable()),

        addDatatable: function () {
          Ember.EasyDatatable.create({tableSelector: '#sample1'});
        }.on('didInsertElement')
      });

      registerDatatableHelpers();
      App.injectTestHelpers();
    },

    teardown: function () {
      App.reset();
    }
  });

  test('click and edit', function () {
    expect(2);

    visit('/')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 1)
      .typeInDatatable('This is my row')
      .pressEnterInDatatable()
      .assertDatatableContent([
        ['This is my row', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ]);
  });

  test('navigate, press enter and edit', function () {
    expect(2);

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
      .typeInDatatable('My new value')
      .pressEnterInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', 'My new value', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
  });

  test('navigate, start typing to replace the cell content', function () {
    expect(2);

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
      .pressEnterInDatatable()
      .assertDatatableContent([
        ['I type something without having an input', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
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
  })
})();