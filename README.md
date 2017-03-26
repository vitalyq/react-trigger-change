# react-trigger-change

In React production builds `ReactTestUtils.Simulate` doesn't work because of dead code elimination. Thus, there is no reliable way to dispatch synthetic change events on elements.

This module is a hack and is tightly coupled with React's implementation details. May break with each new version of React. Not intended for production use. Useful for end-to-end testing and debugging.

## Install

With npm:

`npm install react-trigger-change --save-dev`

In browser:

`<script src=""></script>`

## Usage

```
var node = document.getElementById('testee');
reactTriggerChange(node);
```
