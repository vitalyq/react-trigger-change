# react-trigger-change

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
Specify React version with a query string, for example:

`?version=15.4.2` for React v15.4.2  
`?version=16.0.0-alpha.6&min=1` for minified React v16.0.0-alpha.6
