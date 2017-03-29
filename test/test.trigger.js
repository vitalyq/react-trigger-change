'use strict';
var assert = chai.assert;
var render = ReactDOM.render;
var createElement = React.createElement;

describe('#reactTriggerChange', function () {
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

  function handleChange(event) {
    changed = true;
  }

  it('should support select', function () {
    render(
      createElement('select', { ref: getReference, onChange: handleChange }),
      container
    );

    assert.isFalse(changed, 'change was triggered too early');
    reactTriggerChange(node);
    assert.isTrue(changed, 'change was not triggered');
  });

  it('should not change controlled select index', function () {
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
    }
    reactTriggerChange(node);
    assert.strictEqual(node.selectedIndex, 1);
    assert.strictEqual(node.value, 'opt2');
  });

  it('should not change uncontrolled select index', function () {
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
    }
    reactTriggerChange(node);
    assert.strictEqual(node.selectedIndex, 1);
    assert.strictEqual(node.value, 'opt2');
  });

  it('should support file input', function () {
    render(
      createElement('input', { type: 'file', ref: getReference, onChange: handleChange }),
      container
    );

    assert.isFalse(changed, 'change was triggered too early');
    reactTriggerChange(node);
    assert.isTrue(changed, 'change was not triggered');
  });

  it('should support text input', function () {
    render(
      createElement('input', { ref: getReference, onChange: handleChange }),
      container
    );

    assert.isFalse(changed, 'change was triggered too early');
    reactTriggerChange(node);
    assert.isTrue(changed, 'change was not triggered');
  });

  it('should not change controlled text input non-empty value', function () {
    render(
      createElement('input',
        { value: 'bar', ref: getReference, onChange: handleChangeLocal }),
      container
    );

    function handleChangeLocal() {
      assert.strictEqual(node.value, 'bar');
    }
    reactTriggerChange(node);
    assert.strictEqual(node.value, 'bar');
  });

  it('should not change uncontrolled text input non-empty value', function () {
    render(
      createElement('input',
        { defaultValue: 'bar', ref: getReference, onChange: handleChangeLocal }),
      container
    );

    function handleChangeLocal() {
      assert.strictEqual(node.value, 'bar');
    }
    reactTriggerChange(node);
    assert.strictEqual(node.value, 'bar');
  });

  it('should not change uncontrolled text input empty value', function () {
    render(
      createElement('input',
        { defaultValue: '', ref: getReference, onChange: handleChangeLocal }),
      container
    );

    function handleChangeLocal() {
      assert.strictEqual(node.value, '');
    }
    reactTriggerChange(node);
    assert.strictEqual(node.value, '');
  });

  it('should support maxlength attribute on text input', function () {
    render(
      createElement('input',
        { defaultValue: 'x', maxLength: 1, ref: getReference, onChange: handleChangeLocal }),
      container
    );

    function handleChangeLocal() {
      assert.strictEqual(node.value, 'x');
    }
    reactTriggerChange(node);
    assert.strictEqual(node.value, 'x');
  });

  it('should support maxlength attribute on textarea', function () {
    render(
      createElement('textarea',
        { defaultValue: 'x', maxLength: 1, ref: getReference, onChange: handleChangeLocal }),
      container
    );

    function handleChangeLocal() {
      assert.strictEqual(node.value, 'x');
    }
    reactTriggerChange(node);
    assert.strictEqual(node.value, 'x');
  });

  it('should reattach value property descriptor on input and textarea');

  describe('on checkbox', function () {
    it('should work', function () {
      render(
        createElement('input',
          { type: 'checkbox', ref: getReference, onChange: handleChange }),
        container
      );

      assert.isFalse(changed, 'change was triggered too early');
      reactTriggerChange(node);
      assert.isTrue(changed, 'change was not triggered');
    });

    it('should not toggle controlled checked false', function () {
      render(
        createElement('input',
          { type: 'checkbox', checked: false, ref: getReference, onChange: handleChangeLocal }),
        container
      );

      function handleChangeLocal() {
        // If checkbox is toggled manually, this will throw.
        assert.isFalse(node.checked);
      }
      reactTriggerChange(node);
      assert.isFalse(node.checked);
    });

    it('should not toggle controlled checked true', function () {
      render(
        createElement('input',
          { type: 'checkbox', checked: true, ref: getReference, onChange: handleChangeLocal }),
        container
      );

      function handleChangeLocal() {
        // If checkbox is toggled manually, this will throw.
        assert.isTrue(node.checked);
      }
      reactTriggerChange(node);
      assert.isTrue(node.checked);
    });

    it('should not toggle uncontrolled checked false', function () {
      render(
        createElement('input', {
          type: 'checkbox', defaultChecked: false, ref: getReference, onChange: handleChangeLocal
        }),
        container
      );

      function handleChangeLocal() {
        assert.isFalse(node.checked);
      }
      reactTriggerChange(node);
      assert.isFalse(node.checked);
    });

    it('should not toggle uncontrolled checked true', function () {
      render(
        createElement('input', {
          type: 'checkbox', defaultChecked: true, ref: getReference, onChange: handleChangeLocal
        }),
        container
      );

      function handleChangeLocal() {
        assert.isTrue(node.checked);
      }
      reactTriggerChange(node);
      assert.isTrue(node.checked);
    });
  });

  describe('on radio', function () {
    it('should work', function () {
      render(
        createElement('input',
          { type: 'radio', ref: getReference, onChange: handleChange }),
        container
      );

      assert.isFalse(changed, 'change was triggered too early');
      reactTriggerChange(node);
      assert.isTrue(changed, 'change was not triggered');
    });

    it('should not toggle controlled checked false', function () {
      render(
        createElement('input',
          { type: 'radio', checked: false, ref: getReference, onChange: handleChangeLocal }),
        container
      );

      function handleChangeLocal() {
        assert.isFalse(node.checked);
      }
      reactTriggerChange(node);
      assert.isFalse(node.checked);
    });

    it('should not toggle controlled checked true', function () {
      render(
        createElement('input',
          { type: 'radio', checked: true, ref: getReference, onChange: handleChangeLocal }),
        container
      );

      function handleChangeLocal() {
        assert.isTrue(node.checked);
      }
      reactTriggerChange(node);
      assert.isTrue(node.checked);
    });

    it('should not toggle uncontrolled checked false', function () {
      render(
        createElement('input', {
          type: 'radio', defaultChecked: false, ref: getReference, onChange: handleChangeLocal
        }),
        container
      );

      function handleChangeLocal() {
        assert.isFalse(node.checked);
      }
      reactTriggerChange(node);
      assert.isFalse(node.checked);
    });

    it('should not toggle uncontrolled checked true', function () {
      render(
        createElement('input', {
          type: 'radio', defaultChecked: true, ref: getReference, onChange: handleChangeLocal
        }),
        container
      );

      function handleChangeLocal() {
        assert.isTrue(node.checked);
      }
      reactTriggerChange(node);
      assert.isTrue(node.checked);
    });
  });

  describe('on radio group', function () {
    describe('should not toggle any or trigger change on partner', function () {
      describe('(controlled)', function () {
        it('when botch unchecked', function () {
          var partner;

          render(
            createElement('div', null,
              createElement('input', {
                checked: false, ref: getReference, onChange: handleChangeSelf,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                checked: false, ref: getPartner, onChange: handleChangePartner,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function getPartner(element) {
            partner = element;
          }
          function handleChangeSelf() {
            assert.isFalse(node.checked);
            changed = true;
          }
          function handleChangePartner() {
            assert.fail(null, null, 'change triggered on partner');
          }
          assert.isFalse(changed, 'change was triggered too early');
          reactTriggerChange(node);
          assert.isTrue(changed, 'change was not triggered');
          assert.isFalse(node.checked);
          assert.isFalse(partner.checked);
        });

        it('when self checked and partner unchecked', function () {
          var partner;

          render(
            createElement('div', null,
              createElement('input', {
                checked: true, ref: getReference, onChange: handleChangeSelf,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                checked: false, ref: getPartner, onChange: handleChangePartner,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function getPartner(element) {
            partner = element;
          }
          function handleChangeSelf() {
            assert.isTrue(node.checked);
            changed = true;
          }
          function handleChangePartner() {
            assert.fail(null, null, 'change triggered on partner');
          }
          assert.isFalse(changed, 'change was triggered too early');
          reactTriggerChange(node);
          assert.isTrue(changed, 'change was not triggered');
          assert.isTrue(node.checked);
          assert.isFalse(partner.checked);
        });

        it('when self unchecked and partner checked', function () {
          var partner;

          render(
            createElement('div', null,
              createElement('input', {
                checked: false, ref: getReference, onChange: handleChangeSelf,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                checked: true, ref: getPartner, onChange: handleChangePartner,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function getPartner(element) {
            partner = element;
          }
          function handleChangeSelf() {
            assert.isFalse(node.checked);
            changed = true;
          }
          function handleChangePartner() {
            assert.fail(null, null, 'change triggered on partner');
          }
          assert.isFalse(changed, 'change was triggered too early');
          reactTriggerChange(node);
          assert.isTrue(changed, 'change was not triggered');
          assert.isFalse(node.checked);
          assert.isTrue(partner.checked);
        });
      });

      describe('(uncontrolled)', function () {
        it('when botch unchecked', function () {
          var partner;

          render(
            createElement('div', null,
              createElement('input', {
                defaultChecked: false, ref: getReference, onChange: handleChangeSelf,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                defaultChecked: false, ref: getPartner, onChange: handleChangePartner,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function getPartner(element) {
            partner = element;
          }
          function handleChangeSelf() {
            assert.isFalse(node.checked);
            changed = true;
          }
          function handleChangePartner() {
            assert.fail(null, null, 'change triggered on partner');
          }
          assert.isFalse(changed, 'change was triggered too early');
          reactTriggerChange(node);
          assert.isTrue(changed, 'change was not triggered');
          assert.isFalse(node.checked);
          assert.isFalse(partner.checked);
        });

        it('when self checked and partner unchecked', function () {
          var partner;

          render(
            createElement('div', null,
              createElement('input', {
                defaultChecked: true, ref: getReference, onChange: handleChangeSelf,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                defaultChecked: false, ref: getPartner, onChange: handleChangePartner,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function getPartner(element) {
            partner = element;
          }
          function handleChangeSelf() {
            assert.isTrue(node.checked);
            changed = true;
          }
          function handleChangePartner() {
            assert.fail(null, null, 'change triggered on partner');
          }
          assert.isFalse(changed, 'change was triggered too early');
          reactTriggerChange(node);
          assert.isTrue(changed, 'change was not triggered');
          assert.isTrue(node.checked);
          assert.isFalse(partner.checked);
        });

        it('when self unchecked and partner checked', function () {
          var partner;

          render(
            createElement('div', null,
              createElement('input', {
                defaultChecked: false, ref: getReference, onChange: handleChangeSelf,
                name: 'foo', type: 'radio'
              }),
              createElement('input', {
                defaultChecked: true, ref: getPartner, onChange: handleChangePartner,
                name: 'foo', type: 'radio'
              })),
            container
          );

          function getPartner(element) {
            partner = element;
          }
          function handleChangeSelf() {
            assert.isFalse(node.checked);
            changed = true;
          }
          function handleChangePartner() {
            assert.fail(null, null, 'change triggered on partner');
          }
          assert.isFalse(changed, 'change was triggered too early');
          reactTriggerChange(node);
          assert.isTrue(changed, 'change was not triggered');
          assert.isFalse(node.checked);
          assert.isTrue(partner.checked);
        });
      });
    });
  });
});
