'use strict';
describe('#reactTriggerChange', function () {
  var assert = chai.assert;
  var render = ReactDOM.render;
  var createElement = React.createElement;

  var container;
  var node;
  var changed;

  function getReference(element) {
    node = element;
  }

  function handleChange(event) {
    changed = true;
  }

  function triggerAndCheck() {
    assert.isFalse(changed, 'change was triggered too early');
    reactTriggerChange(node);
    assert.isTrue(changed, 'change was not triggered');
  }

  // title - test title.
  // options.tag - tag name to create.
  // options.props - props object.
  function createTest(title, options) {
    it(title, function () {
      var tag = options.tag;
      var props = options.props;
      var checkProperty = 'checked' in props || 'defaultChecked' in props ?
        'checked' : 'value';
      var expected;
      ['value', 'defaultValue', 'checked', 'defaultChecked'].some(function(key) {
        if (key in props) {
          expected = props[key];
          return true;
        }
      });

      function handleChangeLocal() {
        // If checkbox is toggled manually, this will throw.
        assert.strictEqual(node[checkProperty], expected);
        changed = true;
      }

      props.ref = getReference;
      props.onChange = handleChangeLocal;
      render(
        createElement(tag, props),
        container
      );
      triggerAndCheck();
      assert.strictEqual(node[checkProperty], expected);
    });
  }

  beforeEach(function () {
    changed = false;
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
        changed = true;
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
        changed = true;
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
    it('should reattach value property descriptor');

    describe('(controlled)', function () {
      createTest('should not change empty value', {
        tag: 'input',
        props: { value: '' }
      });

      createTest('should not change non-empty value', {
        tag: 'input',
        props: { value: 'bar' }
      });
    });

    describe('(uncontrolled)', function () {
      createTest('should not change empty value', {
        tag: 'input',
        props: { defaultValue: '' }
      });

      createTest('should not change non-empty value', {
        tag: 'input',
        props: { defaultValue: 'bar' }
      });

      createTest('should support maxlength attribute on text input', {
        tag: 'input',
        props: { defaultValue: 'x', maxLength: 1 }
      });

      createTest('should support maxlength attribute on textarea', {
        tag: 'textarea',
        props: { defaultValue: 'x', maxLength: 1 }
      });
    });
  });

  describe('on checkbox', function () {
    it('should reattach checked property descriptor');

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
    it('should reattach checked property descriptor');

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
                checked: false, ref: getReference, onChange: handleChangeSelf,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                checked: false, ref: getPartner, onChange: fail,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function handleChangeSelf() {
            assert.isFalse(node.checked);
            changed = true;
          }
          triggerAndCheck();
          assert.isFalse(node.checked);
          assert.isFalse(partner.checked);
        });

        it('when self checked and partner unchecked', function () {
          render(
            createElement('div', null,
              createElement('input', {
                checked: true, ref: getReference, onChange: handleChangeSelf,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                checked: false, ref: getPartner, onChange: fail,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function handleChangeSelf() {
            assert.isTrue(node.checked);
            changed = true;
          }
          triggerAndCheck();
          assert.isTrue(node.checked);
          assert.isFalse(partner.checked);
        });

        it('when self unchecked and partner checked', function () {
          render(
            createElement('div', null,
              createElement('input', {
                checked: false, ref: getReference, onChange: handleChangeSelf,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                checked: true, ref: getPartner, onChange: fail,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function handleChangeSelf() {
            assert.isFalse(node.checked);
            changed = true;
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
                defaultChecked: false, ref: getReference, onChange: handleChangeSelf,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                defaultChecked: false, ref: getPartner, onChange: fail,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function handleChangeSelf() {
            assert.isFalse(node.checked);
            changed = true;
          }
          triggerAndCheck();
          assert.isFalse(node.checked);
          assert.isFalse(partner.checked);
        });

        it('when self checked and partner unchecked', function () {
          render(
            createElement('div', null,
              createElement('input', {
                defaultChecked: true, ref: getReference, onChange: handleChangeSelf,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                defaultChecked: false, ref: getPartner, onChange: fail,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function handleChangeSelf() {
            assert.isTrue(node.checked);
            changed = true;
          }
          triggerAndCheck();
          assert.isTrue(node.checked);
          assert.isFalse(partner.checked);
        });

        it('when self unchecked and partner checked', function () {
          render(
            createElement('div', null,
              createElement('input', {
                defaultChecked: false, ref: getReference, onChange: handleChangeSelf,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                defaultChecked: true, ref: getPartner, onChange: fail,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function handleChangeSelf() {
            assert.isFalse(node.checked);
            changed = true;
          }
          triggerAndCheck();
          assert.isFalse(node.checked);
          assert.isTrue(partner.checked);
        });
      });
    });
  });
});
