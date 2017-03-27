// Trigger React synthetic change event on input or textarea.
// Discussion:
// https://github.com/facebook/react/issues/3249
// http://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js
// React changes:
// https://github.com/facebook/react/pull/4051 - React 15 fix
// https://github.com/facebook/react/pull/5746 - React 16 fix
// Events only fire if the value in the event hasn't been seen before.

var supportedInputTypes = {
  color: true,
  date: true,
  datetime: true,
  'datetime-local': true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  time: true,
  url: true,
  week: true
};

module.exports = function(node) {
  // Noop on server
  if (typeof window === 'undefined') {
    return;
  }

  var nodeName = node.nodeName.toLowerCase();
  var type = node.type;

  if (nodeName === 'select' ||
    (nodeName === 'input' && type === 'file')) {
    // IE9-IE11, non-IE
    // Dispatch change
    var changeEvent = document.createEvent('HTMLEvents');
    changeEvent.initEvent('change', true, false);
    node.dispatchEvent(changeEvent);

  } else if ((nodeName === 'input' && supportedInputTypes[type]) ||
    nodeName === 'textarea') {
    // React 16
    // Cache artificial value property descriptor
    // Property doesn't exist in React <16, descriptor is undefined
    var descriptor = Object.getOwnPropertyDescriptor(node, 'value');

    // React 0.14: IE9
    // React 15: IE9-IE11
    // React 16: IE9
    // Dispatch focus
    var focusEvent = document.createEvent('UIEvents');
    focusEvent.initEvent('focus', false, false);
    node.dispatchEvent(focusEvent);

    // React 0.14: IE9
    // React 15: IE9-IE11
    // React 16
    // Update inputValueTracking cached value
    // Remove artificial value property
    // Restore original value to trigger event with it
    var originalValue = node.value;
    node.value = originalValue + '#';
    delete node.value;
    node.value = originalValue;

    // React 0.14: IE9
    // React 15: IE9-IE11
    // React 16: IE9
    // Dispatch propertychange
    var propChangeEvent = document.createEvent('HTMLEvents');
    propChangeEvent.initEvent('propertychange', false, false);
    propChangeEvent.propertyName = 'value';
    node.dispatchEvent(propChangeEvent);

    // React 0.14: IE10-IE11, non-IE
    // React 15: non-IE
    // React 16: IE10-IE11, non-IE
    var inputEvent = document.createEvent('HTMLEvents');
    inputEvent.initEvent('input', true, false);
    node.dispatchEvent(inputEvent);

    // React 16
    // Restore artificial value property descriptor
    if (descriptor !== undefined) {
      Object.defineProperty(node, 'value', descriptor);
    }

  } else if (nodeName === 'input' &&
    (type === 'checkbox' || type === 'radio')) {
    // Update inputValueTracking cached value to inverted checked value
    node.checked = !node.checked;

    // Dispatch click
    // Click event inverts checked value
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    node.dispatchEvent(clickEvent);
  }
}
