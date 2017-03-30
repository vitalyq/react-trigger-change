'use strict';
describe('#reactTriggerChange', function () {
  var assert = chai.assert;
  var render = ReactDOM.render;
  var createElement = React.createElement;

  var container;
  var node;
  var changes;

  function getReference(element) {
    node = element;
  }

  function handleChange() {
    changes += 1;
  }

  function triggerAndCheck() {
    assert.strictEqual(changes, 0, 'change was triggered too early');
    reactTriggerChange(node);
    assert.notStrictEqual(changes, 0, 'change was not triggered');
    assert.strictEqual(changes, 1, 'change was triggered multiple times');
  }

  function getCheckProperty(props) {
    return (
      'checked' in props ||
      'defaultChecked' in props ?
      'checked' : 'value');
  }

  function getExpectedValue(props) {
    var expected;
    [
      'value', 'defaultValue',
      'checked', 'defaultChecked'
    ].some(function(key) {
      if (key in props) {
        expected = props[key];
        return true;
      }
    });
    return expected;
  }

  // title - test title.
  // options.tag - tag name to create.
  // options.props - props object.
  function createTest(title, options) {
    it(title, function () {
      var tag = options.tag;
      var props = options.props;
      var checkProperty = getCheckProperty(props);
      var expected = getExpectedValue(props);

      function handleChangeLocal() {
        // If checkbox is toggled manually, this will throw.
        assert.strictEqual(node[checkProperty], expected);
        changes += 1;
      }

      props.ref = getReference;
      props.onChange = handleChangeLocal;
      render(createElement(tag, props), container);
      triggerAndCheck();
      assert.strictEqual(node[checkProperty], expected);
    });
  }

  function createDescriptorTest(title, options) {
    it(title, function () {
      var tag = options.tag;
      var props = options.props;
      var checkProperty = getCheckProperty(props);
      var descriptorFirst;
      var descriptorLast;

      props.ref = getReference;
      render(createElement(tag, props), container);

      descriptorFirst = Object.getOwnPropertyDescriptor(node, checkProperty);
      if (descriptorFirst) {
        reactTriggerChange(node);
        descriptorLast = Object.getOwnPropertyDescriptor(node, checkProperty);
        assert.strictEqual(descriptorLast.configurable, descriptorFirst.configurable);
        assert.strictEqual(descriptorLast.enumerable, descriptorFirst.enumerable);
        assert.strictEqual(descriptorLast.get, descriptorFirst.get);
        assert.strictEqual(descriptorLast.set, descriptorFirst.set);
      }
    });
  }

  beforeEach(function () {
    changes = 0;
    container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
  });

  afterEach(function () {
    document.body.removeChild(container);
  });

  describe('on select', function () {
    it('should not change index (controlled)', function () {
      render(
        createElement('select',
          { value: 'opt2', ref: getReference, onChange: handleChangeLocal },
          createElement('option', { value: 'opt1' }, 'Option 1'),
          createElement('option', { value: 'opt2' }, 'Option 2')
        ),
        container
      );

      function handleChangeLocal() {
        assert.strictEqual(node.selectedIndex, 1);
        assert.strictEqual(node.value, 'opt2');
        changes += 1;
      }
      triggerAndCheck();
      assert.strictEqual(node.selectedIndex, 1);
      assert.strictEqual(node.value, 'opt2');
    });

    it('should not change index (uncontrolled)', function () {
      render(
        createElement('select',
          { defaultValue: 'opt2', ref: getReference, onChange: handleChangeLocal },
          createElement('option', { value: 'opt1' }, 'Option 1'),
          createElement('option', { value: 'opt2' }, 'Option 2')
        ),
        container
      );

      function handleChangeLocal() {
        assert.strictEqual(node.selectedIndex, 1);
        assert.strictEqual(node.value, 'opt2');
        changes += 1;
      }
      triggerAndCheck();
      assert.strictEqual(node.selectedIndex, 1);
      assert.strictEqual(node.value, 'opt2');
    });
  });

  describe('on file input', function () {
    it('should support file input', function () {
      render(
        createElement('input', { type: 'file', ref: getReference, onChange: handleChange }),
        container
      );
      triggerAndCheck();
    });
  });

  describe('on text input', function () {
    var supportedInputTypes = {
      color:            { filled: '#ff00ff',          empty: '#000000' },
      date:             { filled: '2017-03-24',       empty: '' },
      datetime:         { filled: '2017-03-29T11:11', empty: '' },
      'datetime-local': { filled: '2017-03-29T11:11', empty: '' },
      email:            { filled: '5',                empty: '' },
      month:            { filled: '2017-03',          empty: '' },
      number:           { filled: '5',                empty: '' },
      password:         { filled: '5',                empty: '' },
      range:            { filled: '5',                empty: '50' },
      search:           { filled: '5',                empty: '' },
      tel:              { filled: '5',                empty: '' },
      text:             { filled: '5',                empty: '' },
      time:             { filled: '14:14',            empty: '' },
      url:              { filled: '5',                empty: '' },
      week:             { filled: '2017-W11',         empty: '' }
    };

    var maxlengthSupport = {
      email: true,
      password: true,
      search: true,
      tel: true,
      text: true,
      url: true
    }

    createDescriptorTest('should reattach value property descriptor (React 16)', {
      tag: 'input',
      props: { defaultValue: '' }
    });

    describe('(controlled)', function () {
      describe('should not change empty value on input of type', function () {
        Object.keys(supportedInputTypes).forEach(function(type) {
          createTest(type, {
            tag: 'input',
            props: { value: supportedInputTypes[type].empty, type: type }
          });
        });
        createTest('textarea', {
          tag: 'textarea',
          props: { value: '' }
        });
      });

      describe('should not change non-empty value on input of type', function () {
        Object.keys(supportedInputTypes).forEach(function(type) {
          createTest(type, {
            tag: 'input',
            props: { value: supportedInputTypes[type].filled, type: type }
          });
        });
        createTest('textarea', {
          tag: 'textarea',
          props: { value: '5' }
        });
      });

      describe('should support maxlength attribute on input of type', function () {
        Object.keys(maxlengthSupport).forEach(function(type) {
          createTest(type, {
            tag: 'input',
            props: { value: supportedInputTypes[type].filled, type: type, maxLength: 1 }
          });
        });
        createTest('textarea', {
          tag: 'textarea',
          props: { value: '5', maxLength: 1 }
        });
      });
    });

    describe('(uncontrolled)', function () {
      describe('should not change empty value on input of type', function () {
        Object.keys(supportedInputTypes).forEach(function(type) {
          createTest(type, {
            tag: 'input',
            props: { defaultValue: supportedInputTypes[type].empty, type: type }
          });
        });
        createTest('textarea', {
          tag: 'textarea',
          props: { defaultValue: '' }
        });
      });

      describe('should not change non-empty value on input of type', function () {
        Object.keys(supportedInputTypes).forEach(function(type) {
          createTest(type, {
            tag: 'input',
            props: { defaultValue: supportedInputTypes[type].filled, type: type }
          });
        });
        createTest('textarea', {
          tag: 'textarea',
          props: { defaultValue: '5' }
        });
      });

      describe('should support maxlength attribute on input of type', function () {
        Object.keys(maxlengthSupport).forEach(function(type) {
          createTest(type, {
            tag: 'input',
            props: { defaultValue: supportedInputTypes[type].filled, type: type, maxLength: 1 }
          });
        });
        createTest('textarea', {
          tag: 'textarea',
          props: { defaultValue: '5', maxLength: 1 }
        });
      });
    });
  });

  describe('on checkbox', function () {
    createDescriptorTest('should reattach checked property descriptor (React 16)', {
      tag: 'input',
      props: { defaultChecked: false, type: 'checkbox' }
    });

    describe('(controlled)', function () {
      createTest('should not toggle unchecked', {
        tag: 'input',
        props: { checked: false, type: 'checkbox' }
      });

      createTest('should not toggle checked', {
        tag: 'input',
        props: { checked: true, type: 'checkbox' }
      });
    });

    describe('(uncontrolled)', function () {
      createTest('should not toggle unchecked', {
        tag: 'input',
        props: { defaultChecked: false, type: 'checkbox' }
      });

      createTest('should not toggle checked', {
        tag: 'input',
        props: { defaultChecked: true, type: 'checkbox' }
      });
    });
  });

  describe('on radio', function () {
    createDescriptorTest('should reattach checked property descriptor (React 16)', {
      tag: 'input',
      props: { defaultChecked: false, type: 'radio' }
    });

    describe('(controlled)', function () {
      createTest('should not toggle unchecked', {
        tag: 'input',
        props: { checked: false, type: 'radio' }
      });

      createTest('should not toggle checked', {
        tag: 'input',
        props: { checked: true, type: 'radio' }
      });
    });

    describe('(uncontrolled)', function () {
      createTest('should not toggle unchecked', {
        tag: 'input',
        props: { defaultChecked: false, type: 'radio' }
      });

      createTest('should not toggle checked', {
        tag: 'input',
        props: { defaultChecked: true, type: 'radio' }
      });
    });
  });

  describe('on radio group', function () {
    describe('should not toggle any or trigger change on partner', function () {
      var partner;

      function getPartner(element) {
        partner = element;
      }
      function fail() {
        assert.fail(null, null, 'change triggered on partner');
      }

      describe('(controlled)', function () {
        it('when botch unchecked', function () {
          render(
            createElement('div', null,
              createElement('input', {
                checked: false, ref: getReference, onChange: handleChangeLocal,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                checked: false, ref: getPartner, onChange: fail,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function handleChangeLocal() {
            assert.isFalse(node.checked);
            assert.isFalse(partner.checked);
            changes += 1;
          }
          triggerAndCheck();
          assert.isFalse(node.checked);
          assert.isFalse(partner.checked);
        });

        it('when self checked and partner unchecked', function () {
          render(
            createElement('div', null,
              createElement('input', {
                checked: true, ref: getReference, onChange: handleChangeLocal,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                checked: false, ref: getPartner, onChange: fail,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function handleChangeLocal() {
            assert.isTrue(node.checked);
            assert.isFalse(partner.checked);
            changes += 1;
          }
          triggerAndCheck();
          assert.isTrue(node.checked);
          assert.isFalse(partner.checked);
        });

        it('when self unchecked and partner checked', function () {
          render(
            createElement('div', null,
              createElement('input', {
                checked: false, ref: getReference, onChange: handleChangeLocal,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                checked: true, ref: getPartner, onChange: fail,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function handleChangeLocal() {
            assert.isFalse(node.checked);
            assert.isTrue(partner.checked);
            changes += 1;
          }
          triggerAndCheck();
          assert.isFalse(node.checked);
          assert.isTrue(partner.checked);
        });
      });

      describe('(uncontrolled)', function () {
        it('when botch unchecked', function () {
          render(
            createElement('div', null,
              createElement('input', {
                defaultChecked: false, ref: getReference, onChange: handleChangeLocal,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                defaultChecked: false, ref: getPartner, onChange: fail,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function handleChangeLocal() {
            assert.isFalse(node.checked);
            assert.isFalse(partner.checked);
            changes += 1;
          }
          triggerAndCheck();
          assert.isFalse(node.checked);
          assert.isFalse(partner.checked);
        });

        it('when self checked and partner unchecked', function () {
          render(
            createElement('div', null,
              createElement('input', {
                defaultChecked: true, ref: getReference, onChange: handleChangeLocal,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                defaultChecked: false, ref: getPartner, onChange: fail,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function handleChangeLocal() {
            assert.isTrue(node.checked);
            assert.isFalse(partner.checked);
            changes += 1;
          }
          triggerAndCheck();
          assert.isTrue(node.checked);
          assert.isFalse(partner.checked);
        });

        it('when self unchecked and partner checked', function () {
          render(
            createElement('div', null,
              createElement('input', {
                defaultChecked: false, ref: getReference, onChange: handleChangeLocal,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                defaultChecked: true, ref: getPartner, onChange: fail,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function handleChangeLocal() {
            assert.isFalse(node.checked);
            assert.isTrue(partner.checked);
            changes += 1;
          }
          triggerAndCheck();
          assert.isFalse(node.checked);
          assert.isTrue(partner.checked);
        });
      });
    });
  });
});
