### Link to [all notes](/notes.md).

# React Notes

## Why?

### Differences between React and a Vanilla webpage?

While vanilla webpages can create amazing applications and sites, React can do it faster and with less code.

For example, in Activity Anarchy, I have a function to render the html for a voting table and a function to load the html onto the page, both of which are triggered by another function that is called each time a user changes their vote. Using React, the html can already be added to the voting page with variables in place of values. Then, when any variable is changed, the page will render the change to that variable, rather than loading the html of the whole table again.

## Basic Syntax

### How to add React to an html document?

The following must be added to an html document in the `head` section:

```
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>

<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>

<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

This code will load the current version of React, the DOM integration, and the Babel complier.

### Components of a React script

React script is added to the webpage in a `script` element at the end of the body html element. The script element must include the 'type="text/babel"' tag.

Within this script tag, you need to:

- define the element you wish to render, using document.getElementById('<element>')

- assign `ReactDOM.createRoot(<element>)` to a constant to be rendered later

- create the html to be added as the element (using {} to add JavaScript directly into the element)

- render the React element using `<ReactDOM constant>.render(<html to be rendered>)`

By using doing this, Reach will compare the element and its children to the previous one, and it only changes the parts of the DOM that need to be updated!

