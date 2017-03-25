# react-trigger-change

In React production builds `ReactTestUtils.Simulate` doesn't work because of minification. Thus, there is no reliable way to dispatch synthetic change events on elements. Useful for end-to-end/functional tests.

## Install

With npm:

`npm install react-trigger-change --save-dev`

In browser:

`<script src=""></script>`

## Usage

```
var node = document.getElementById('myInput');
var newValue = node.value + 'hello';
// newValue must be different from node.value

reactTriggerChange(node, newValue);
```
