# react-trigger-change

In React production builds `ReactTestUtils.Simulate` doesn't work because of dead code elimination. Thus, there is no reliable way to dispatch synthetic change events on elements.

This module is a hack and is tightly coupled with React's implementation details. May break with each new version of React. Not intended for production use. Useful for end-to-end testing and debugging.

## Install

With npm:

`npm install react-trigger-change --save-dev`

From a CDN:

`<script src="https://unpkg.com/react-trigger-change/dist/react-trigger-change.js"></script>`

## Use

`reactTriggerChange(DOMElement);`

*DOMElement* - native DOM element, will be the target of change event.

One way to obtain a DOM element in React is to use `ref` attribute:

```
let node;
ReactDOM.render(
  <input
    onChange={console.log('changed')}
    ref={input => node = input}
  />,
  mountNode
);

reactTriggerChange(node); // 'changed' is logged
```

## Test

Open `test/test.html` in the browser.
Specify React version with a query string, for example:

`?version=15.4.2` for React v15.4.2  
`?version=16.0.0-alpha.6&min=1` for minified React v16.0.0-alpha.6
