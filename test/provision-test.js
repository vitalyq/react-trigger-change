'use strict';
var changed = false;

function handleChange(event) {
  changed = true;
}

window.onload = function() {
  var changedEarly;
  var node;
  var result;

  document.body.innerHTML =
    '<div id="root"></div> <div id="result">pending</div>';

  ReactDOM.render(
    React.createElement("input", { id: 'testee', onChange: handleChange }),
    document.getElementById('root')
  );

  changedEarly = changed;
  node = document.getElementById('testee');
  reactTriggerChange(node, 'hello');

  result = document.getElementById('result');
  result.innerHTML = !changedEarly && changed ? 'success' : 'fail';
};
