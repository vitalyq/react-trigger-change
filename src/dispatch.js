// Trigger React synthetic change event on input or textarea.
// Discussion:
// https://github.com/facebook/react/issues/3249
// http://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js
// React changes:
// https://github.com/facebook/react/pull/4051 - React 15 fix
// https://github.com/facebook/react/pull/5746 - React 16 fix
// Events only fire if the value in the event hasn't been seen before.

module.exports = function(node, val) {
  // Noop on server
  if (typeof window === 'undefined') {
    return;
  }

  // React 0.14: IE9; React 15: IE9-IE11
  // Dispatch focus
  var focusEvent = document.createEvent('UIEvents');
  focusEvent.initEvent('focus', false, false);
  node.dispatchEvent(focusEvent);

  // Remove artificial value property
  delete node.value;

  // Update value, should be different from the previous one
  node.value = val;

  // Dispatch propertychange
  var propChangeEvent = document.createEvent('HTMLEvents');
  propChangeEvent.initEvent('propertychange', false, false);
  propChangeEvent.propertyName = 'value';
  node.dispatchEvent(propChangeEvent);

  // React 0.14: IE10-IE11, non-IE; React 15: non-IE
  var inputEvent = document.createEvent('HTMLEvents');
  inputEvent.initEvent('input', true, false);
  node.dispatchEvent(inputEvent);
}
