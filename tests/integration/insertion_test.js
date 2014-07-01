(function () {
  module('%@ integration - inserting data'.fmt(Ember.EasyDatatable.toString()), {
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

  test('Inserting a new row', function () {
    expect(3);

    visit('/')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 1)
      .pressEscInDatatable()
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'Nothing happens if it is not done in a row header')
      .pressLeftKeyInDatatable()
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['', '', '', ''],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'Otherwise, a new empty row is added after the selected row');
  });

  test('Inserting a new column', function () {
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
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'Nothing happens if it is not done in a column header')
      .pressUpKeyInDatatable()
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '', '0', '10', '20'],
        ['Row 1', '', '1', '11', '21'],
        ['Row 2', '', '2', '12', '22'],
        ['Row 3', '', '3', '13', '23']
      ], 'Otherwise, a new empty column is added after the selected column')
      .assertDatatableHeader([ "", 'Name', '', 'Value 1', 'Value 2', 'Value 3'],
        'An empty header is also added');
  });
})();