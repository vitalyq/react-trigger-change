// Trigger React's synthetic change event on input, textarea or select
// https://github.com/facebook/react/pull/4051 - React 15 fix
// https://github.com/facebook/react/pull/5746 - React 16 fix

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

// In IE10 propertychange is not dispatched on range input if invalid
// value is set.
function changeRangeValue(node) {
  var initMin = node.min;
  var initMax = node.max;
  var initStep = node.step;
  var initVal = Number(node.value);

  node.min = initVal;
  node.max = initVal + 1;
  node.step = 1;
  node.value = initVal + 1;
  delete node.value;
  node.min = initMin;
  node.max = initMax;
  node.step = initStep;
  node.value = initVal;
}

module.exports = function(node) {
  var nodeName = node.nodeName.toLowerCase();
  var type = node.type;

  var initialChecked;
  var initialCheckedRadio;
  function preventChecking(event) {
    event.preventDefault();
    if (!initialChecked) {
      event.target.checked = false;
    }
    if (initialCheckedRadio) {
      initialCheckedRadio.checked = true;
    }
  }

  if (nodeName === 'select' ||
    (nodeName === 'input' && type === 'file')) {
    // IE9-IE11, non-IE
    // Dispatch change.
    var changeEvent = document.createEvent('HTMLEvents');
    changeEvent.initEvent('change', true, false);
    node.dispatchEvent(changeEvent);

  } else if ((nodeName === 'input' && supportedInputTypes[type]) ||
    nodeName === 'textarea') {
    // React 16
    // Cache artificial value property descriptor.
    // Property doesn't exist in React <16, descriptor is undefined.
    var descriptor = Object.getOwnPropertyDescriptor(node, 'value');

    // React 0.14: IE9
    // React 15: IE9-IE11
    // React 16: IE9
    // Dispatch focus.
    var focusEvent = document.createEvent('UIEvents');
    focusEvent.initEvent('focus', false, false);
    node.dispatchEvent(focusEvent);

    // React 0.14: IE9
    // React 15: IE9-IE11
    // React 16
    // In IE9-10 imperative change of node value triggers propertychange event.
    // Update inputValueTracking cached value.
    // Remove artificial value property.
    // Restore initial value to trigger event with it.
    if (type === 'range') {
      changeRangeValue(node);
    } else {
      var initialValue = node.value;
      node.value = initialValue + '#';
      delete node.value;
      node.value = initialValue;
    }

    // React 15: IE11
    // For unknown reason React 15 added listener for propertychange with addEventListener.
    // This doesn't work, propertychange events are deprecated in IE11,
    // but allows us to dispatch fake propertychange which is handled by IE11.
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
    // Restore artificial value property descriptor.
    if (descriptor) {
      Object.defineProperty(node, 'value', descriptor);
    }

  } else if (nodeName === 'input' && type === 'checkbox') {
    // Invert inputValueTracking cached value.
    node.checked = !node.checked;

    // Dispatch click.
    // Click event inverts checked value.
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    node.dispatchEvent(clickEvent);

  } else if (nodeName === 'input' && type === 'radio') {
    // Cache initial checked value.
    initialChecked = node.checked;

    // Find and cache initially checked radio in the group.
    if (node.name) {
      var radios = document.querySelectorAll('input[type="radio"][name="' + node.name + '"]');
      for (var i = 0; i < radios.length; i += 1) {
        if (radios[i].checked) {
          if (radios[i] !== node) {
            initialCheckedRadio = radios[i];
          }
          break;
        }
      }
    }

    // React 16
    // Cache property descriptor.
    // Invert inputValueTracking cached value.
    // Remove artificial checked property.
    // Restore initial value, otherwise preventDefault will eventually revert the value.
    var descriptor = Object.getOwnPropertyDescriptor(node, 'checked');
    node.checked = !initialChecked;
    delete node.checked;
    node.checked = initialChecked;

    // Prevent toggling during event capturing phase.
    // Set checked value to false if initialChecked is false,
    // otherwise next listeners will see true.
    // Restore initially checked radio in the group.
    node.addEventListener('click', preventChecking, true);

    // Dispatch click.
    // Click event inverts checked value.
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    node.dispatchEvent(clickEvent);

    // Remove listener to stop further change prevention.
    node.removeEventListener('click', preventChecking, true);

    // React 16
    // Restore artificial checked property descriptor.
    if (descriptor) {
      Object.defineProperty(node, 'checked', descriptor);
    }
  }
}
