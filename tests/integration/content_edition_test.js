(function () {
  module('%@ integration - keyboard navigation'.fmt(Ember.EasyDatatable.toString()), {
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
})();