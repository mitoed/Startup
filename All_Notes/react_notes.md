### Link to [all notes](/notes.md).

# React Notes

## Web Frameworks

Web Frameworks allow designers to condense the interaction of HTML, JavaScript, and/or CSS into combined files. This can shorten the total lines of code since the HTML is rendered based on the scripts run. Additionally, the rendered HTML/styling can be automatically updated as other scripts are run or as states change.

Popular examples include:

- React

- Angular

- Vue

- Svelte

### Differences between React and a Vanilla webpage?

While vanilla webpages can create amazing applications and sites, React can do it faster and with less code.

For example, in Activity Anarchy, I have a function to render the html for a voting table and a function to load the html onto the page, both of which are triggered by another function that is called each time a user changes their vote. Using React, the html can already be added to the voting page with variables in place of values. Then, when any variable is changed, the page will render the change to that variable, rather than loading the html of the whole table again.

## React - Basic Syntax

### How to add React to an html document?

The following must be added to an html document in the `head` section:

```
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>

<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>

<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

This code will load the current version of React, the DOM integration, and the Babel complier.

### Components of a React script

React script is added to the webpage in a `script` element at the end of the body html element (or linked as a .jsx file). The script element must include the 'type="text/babel"' tag, which compiles the script before deployment.

Within this script, you need to:

- define the element you wish to render, using document.getElementById('<element>')

- assign `ReactDOM.createRoot(<element>)` to a constant to be rendered later

- create the html to be added as the element (using {} to add JavaScript directly into the element)

- render the React element using `<ReactDOM constant>.render(<html to be rendered>)`

By using doing this, Reach will compare the element and its children to the previous one, and it only changes the parts of the DOM that need to be updated!

Example:

```
const Clicker = () => {
  const [clicked, updateClicked] = React.useState(false);

  const onClicked = (e) => {
    updateClicked(!clicked);
  };

  return <p onClick={(e) => onClicked(e)}>clicked: {`${clicked}`}</p>;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Clicker />);
```

### How to use functions?

1. Create a "function", which is used like an object.

1. Define any state variables you wish: `const [<property>, <change_method>] = React.useState(<default_value>)`

1. Update states by calling the change_method defined above; return value is the new state value

1. Use the state as desired in the return statement.

Function syntax = same as normal JavaScript but properties passed later are within "props" object. Access using `props.<property_name>`

Pass function with properties to render in html = `<myFunction myProperty="" />`

Create React element = `ReactDOM.render( <function_as_above>, document.getElementById('<elementID>'))`

## Toolchains - Tools to prep the code for deployement

- Code repository - Stores code in a shared, versioned, location.

- Linter - Removes, or warns, of non-idiomatic code usage.

- Prettier - Formats code according to a shared standard.

- Transpiler - Compiles code into a different format. For example, from JSX to JavaScript, TypeScript to JavaScript, or SCSS to CSS.

- Polyfill - Generates backward compatible code for supporting old browser versions that do not support the latest standards.

- Bundler - Packages code into bundles for delivery to the browser. This enables compatibility (for example with ES6 module support), or performance (with lazy loading).

- Minifier - Removes whitespace and renames variables in order to make code smaller and more efficient to deploy.

- Testing - Automated tests at multiple levels to ensure correctness.

- Deployment - Automated packaging and delivery of code from the development environment to the production environment.

## Vite - Toolchain used in CS 260

Vite bundles your code quickly, has great debugging support, and allows you to easily support JSX, TypeScript, and different CSS flavors.

## Routers - Single-page Applications

Rather than only using multiple html files that clients move to, routers can help to simplify the code for certain types of applications. A router helps to navigate to different main components, while allowing the flexibility to create components that persist between "pages" (like a nav bar).

## Reactivity - Props, States, and Render

*How React changes the UI based on inputs or data.*

Props: Properties, variables or states, passed from parent component to child component.

States: Variables that React will monitor. Can be used to re-render elements or run script upon changes.

Render: Process of turning script (variables, states, props, etc.) into readable HTML on client-side.

## Hooks

*Allows React Functions to act like classes, but do so much more.*

UseEffect Hook: Represents "life-cycle" events. In other words, UseEffect will run code if a perscribed variable changes.