# react-trigger-change [![Build Status](https://img.shields.io/travis/vitalyq/react-trigger-change.svg)](https://travis-ci.org/vitalyq/react-trigger-change) [![Npm Version](https://img.shields.io/npm/v/react-trigger-change.svg)](https://www.npmjs.com/package/react-trigger-change)

[![Build Status](https://saucelabs.com/browser-matrix/vitalyq.svg)](https://saucelabs.com/u/vitalyq)

Library for triggering [React](https://github.com/facebook/react/)'s synthetic change events on input, textarea and select elements.

In production builds of React `ReactTestUtils.Simulate` doesn't work because of dead code elimination. There is no other built-in way to dispatch synthetic change events.

This module is a hack and is tightly coupled with React's implementation details. Not intended for production use. Useful for end-to-end testing and debugging.

## Install

With npm:

```
npm install react-trigger-change --save-dev
```

From a CDN:

```HTML
<script src="https://unpkg.com/react-trigger-change/dist/react-trigger-change.js"></script>
```

## Use

```JSX
reactTriggerChange(DOMElement);
```

*DOMElement* - native DOM element, will be the target of change event.

One way to obtain a DOM element in React is to use `ref` attribute:

```JSX
let node;
ReactDOM.render(
  <input
    onChange={() => console.log('changed')}
    ref={(input) => { node = input; }}
  />,
  mountNode
);

reactTriggerChange(node); // 'changed' is logged
```

## Test

Build the browser bundle:

```
npm install
npm run build
```

Open `test/test.html` in the browser.

To test with a different version of React, specify React and ReactDOM URLs in a query string:

```
?react=https://unpkg.com/react@16.2.0/umd/react.development.js&dom=https://unpkg.com/react-dom@16.2.0/umd/react-dom.development.js
```
