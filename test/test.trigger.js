'use strict';
var assert = chai.assert;
var render = ReactDOM.render;
var createElement = React.createElement;

describe('Trigger change', function () {
  var container;
  var node;
  var changed;

  beforeEach(function () {
    changed = false;
    container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
  });

  afterEach(function () {
    document.body.removeChild(container);
  });

  function getReference(element) {
    node = element;
  }

  function handleChange() {
    changed = true;
  }

  it('should support select', function () {
    render(
      createElement('select', { ref: getReference, onChange: handleChange },
        createElement('option', null, 'Option 1'),
        createElement('option', null, 'Option 2')
      ),
      container
    );

    assert.isFalse(changed, 'change was triggered too early');
    reactTriggerChange(node);
    assert.isTrue(changed, 'change was not triggered');
  });
});
