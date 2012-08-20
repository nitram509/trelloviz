
/**
 * Sample usage: <input type="text" data-bind="colorPicker:color" />
 */

if (typeof ko != 'undefined') {
  ko.bindingHandlers.colorPicker = {
    init:function (element, valueAccessor, allBindingsAccessor, viewModel) {
      var value = valueAccessor();
      $(element).val(ko.utils.unwrapObservable(value));
      $(element).colorPicker({onColorChange: function(elementId, newColorValue) {
        value(newColorValue);
      }});
    },
    update:function (element, valueAccessor, allBindingsAccessor, viewModel) {
      $(element).val(ko.utils.unwrapObservable(valueAccessor()));
    }
  }
}

