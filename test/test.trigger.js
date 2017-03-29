'use strict';
describe('#reactTriggerChange', function () {
  var assert = chai.assert;
  var render = ReactDOM.render;
  var createElement = React.createElement;

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

  function triggerAndCheck() {
    assert.isFalse(changed, 'change was triggered too early');
    reactTriggerChange(node);
    assert.isTrue(changed, 'change was not triggered');
  }

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
    it('should reattach value property descriptor on input and textarea');

    describe('(controlled)', function () {
      it('should not change non-empty value', function () {
        render(
          createElement('input',
            { value: 'bar', ref: getReference, onChange: handleChangeLocal }),
          container
        );

        function handleChangeLocal() {
          assert.strictEqual(node.value, 'bar');
          changed = true;
        }
        triggerAndCheck();
        assert.strictEqual(node.value, 'bar');
      });

      it('should not change empty value', function () {
        render(
          createElement('input',
            { value: '', ref: getReference, onChange: handleChangeLocal }),
          container
        );

        function handleChangeLocal() {
          assert.strictEqual(node.value, '');
          changed = true;
        }
        triggerAndCheck();
        assert.strictEqual(node.value, '');
      });
    });

    describe('(uncontrolled)', function () {
      it('should not change non-empty value', function () {
        render(
          createElement('input',
            { defaultValue: 'bar', ref: getReference, onChange: handleChangeLocal }),
          container
        );

        function handleChangeLocal() {
          assert.strictEqual(node.value, 'bar');
          changed = true;
        }
        triggerAndCheck();
        assert.strictEqual(node.value, 'bar');
      });

      it('should not change empty value', function () {
        render(
          createElement('input',
            { defaultValue: '', ref: getReference, onChange: handleChangeLocal }),
          container
        );

        function handleChangeLocal() {
          assert.strictEqual(node.value, '');
          changed = true;
        }
        triggerAndCheck();
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
    });
  });

  describe('on checkbox', function () {
    describe('(controlled)', function () {
      it('should not toggle checked false', function () {
        render(
          createElement('input',
            { type: 'checkbox', checked: false, ref: getReference, onChange: handleChangeLocal }),
          container
        );

        function handleChangeLocal() {
          // If checkbox is toggled manually, this will throw.
          assert.isFalse(node.checked);
          changed = true;
        }
        triggerAndCheck();
        assert.isFalse(node.checked);
      });

      it('should not toggle checked true', function () {
        render(
          createElement('input',
            { type: 'checkbox', checked: true, ref: getReference, onChange: handleChangeLocal }),
          container
        );

        function handleChangeLocal() {
          // If checkbox is toggled manually, this will throw.
          assert.isTrue(node.checked);
          changed = true;
        }
        triggerAndCheck();
        assert.isTrue(node.checked);
      });
    });

    describe('(uncontrolled)', function () {
      it('should not toggle checked false', function () {
        render(
          createElement('input', {
            type: 'checkbox', defaultChecked: false, ref: getReference, onChange: handleChangeLocal
          }),
          container
        );

        function handleChangeLocal() {
          assert.isFalse(node.checked);
          changed = true;
        }
        triggerAndCheck();
        assert.isFalse(node.checked);
      });

      it('should not toggle checked true', function () {
        render(
          createElement('input', {
            type: 'checkbox', defaultChecked: true, ref: getReference, onChange: handleChangeLocal
          }),
          container
        );

        function handleChangeLocal() {
          assert.isTrue(node.checked);
          changed = true;
        }
        triggerAndCheck();
        assert.isTrue(node.checked);
      });
    });
  });

  describe('on radio', function () {
    describe('(controlled)', function () {
      it('should not toggle unchecked', function () {
        render(
          createElement('input',
            { type: 'radio', checked: false, ref: getReference, onChange: handleChangeLocal }),
          container
        );

        function handleChangeLocal() {
          assert.isFalse(node.checked);
          changed = true;
        }
        triggerAndCheck();
        assert.isFalse(node.checked);
      });

      it('should not toggle checked', function () {
        render(
          createElement('input',
            { type: 'radio', checked: true, ref: getReference, onChange: handleChangeLocal }),
          container
        );

        function handleChangeLocal() {
          assert.isTrue(node.checked);
          changed = true;
        }
        triggerAndCheck();
        assert.isTrue(node.checked);
      });
    });

    describe('(uncontrolled)', function () {
      it('should not toggle unchecked', function () {
        render(
          createElement('input', {
            type: 'radio', defaultChecked: false, ref: getReference, onChange: handleChangeLocal
          }),
          container
        );

        function handleChangeLocal() {
          assert.isFalse(node.checked);
          changed = true;
        }
        triggerAndCheck();
        assert.isFalse(node.checked);
      });

      it('should not toggle checked', function () {
        render(
          createElement('input', {
            type: 'radio', defaultChecked: true, ref: getReference, onChange: handleChangeLocal
          }),
          container
        );

        function handleChangeLocal() {
          assert.isTrue(node.checked);
          changed = true;
        }
        triggerAndCheck();
        assert.isTrue(node.checked);
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
