(function () {
  module('%@ integration - deleting data'.fmt(Ember.EasyDatatable.toString()), {
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

  test('Removing a row', function () {
    expect(3);

    visit('/')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 1)
      .pressEnterInDatatable()
      .pressDelKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'Nothing happens if it is not done in a row header')
      .pressLeftKeyInDatatable()
      .pressDelKeyInDatatable()
      .assertDatatableContent([
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'Otherwise, the current row is removed');
  });

  test('Removing a column', function () {
    expect(4);

    visit('/')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 1)
      .pressEnterInDatatable()
      .pressDelKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'Nothing happens if it is not done in a column header')
      .pressUpKeyInDatatable()
      .pressDelKeyInDatatable()
      .assertDatatableContent([
        ['0', '10', '20'],
        ['1', '11', '21'],
        ['2', '12', '22'],
        ['3', '13', '23']
      ], 'Otherwise, the current row is removed')
      .assertDatatableHeader([ "", 'Value 1', 'Value 2', 'Value 3'],
        'The header is also removed');
  });
})();