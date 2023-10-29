### Link to [all notes](/notes.md).

# JavaScript

*Officially known as ECMAScript, JavaScript is a weakly typed language based on concepts found in C, Java, and Scheme. It is by far the most used programming language in the world. Commonly used as a web server language and for creating serverless functions.*

## Basics of JavaScript

### Adding JavaScript to HTML

Call a JavaScript file in head or at the end of body.

```
<head>
  <script src="javascript.js"></script>
</head>
<body>
  <button onclick="sayHello()">Say Hello</button>
  <button onclick="sayGoodbye()">Say Goodbye</button>
  <script>
    function sayGoodbye() {
      alert('Goodbye');
    }
  </script>
</body>
```

Or write the code directly into the HTML.

```
<button onclick="let i=1;i++;console.log(i)">press me</button>
OUTPUT: 2
```

### Comments

```
// Line Comment
```

```
/*
Block Comment
*/
```

### Timers

How long did it take to run code between console.time() and console.timeEnd()?

```
console.time('demo time');
// some code that takes a long time.
console.timeEnd('demo time');
// OUTPUT: demo time: 9762.74 ms
```

### Count

How many times was a block of code called?

```
console.count('a');
// OUTPUT: a: 1
console.count('a');
// OUTPUT: a: 2
console.count('b');
// OUTPUT: b: 1
```

## Variables, Types, and Constructs

### Variable Declarations

*Only accessable within the scope of the declaration (i.e., not defined outside of block, but is defined inside child blocks)*

`let`: can be redefined

`const`: cannot be redefined (if array, can be altered but not redefined)

`var`: like "let", but should not be used

### Variable Types

| Type      | Meaning                                      |
|-----------|----------------------------------------------|
| Null      | The type of a variable that has not been assigned a value.    |
| Undefined | The type of a variable that has not been defined.              |
| Boolean   | true or false.                              |
| Number    | A 64-bit signed number.                    |
| BigInt    | A number of arbitrary magnitude.          |
| String    | A textual sequence of characters.          |
| Symbol    | A unique value.                           |

### Object Types

| Type      | Use                                                            | Example                |
|-----------|----------------------------------------------------------------|------------------------|
| Object    | A collection of properties represented by name-value pairs. Values can be of any type. | `{a:3, b:'fish'}`      |
| Function  | An object that has the ability to be called.                  | `function a() {}`     |
| Date      | Calendar dates and times.                                    | `new Date('1995-12-17')` |
| Array     | An ordered sequence of any type.                             | `[3, 'fish']`           |
| Map       | A collection of key-value pairs that support efficient lookups. | `new Map()`             |
| JSON      | A lightweight data-interchange format used to share information across programs. | `{"a":3, "b":"fish"}` |

### Operators

`+`: add or concatenate

`-`: subtract

`*`: multiply

`/`: divide

`===`: equality

`!==`: inequality

### Type Conversions

```
2 + '3';
// OUTPUT: '23'
2 * '3';
// OUTPUT: 6
[2] + [3];
// OUTPUT: '23'
true + null;
// OUTPUT: 1
true + undefined;
// OUTPUT: NaN
```

**unexpected conversions**

```
1 == '1';
// OUTPUT: true
null == undefined;
// OUTPUT: true
'' == false;
// OUTPUT: true
```

**weird conversions**

```
1 === '1';
// OUTPUT: false
null === undefined;
// OUTPUT: false
'' === false;
// OUTPUT: false
```

## Conditionals and Loops

### Conditionals

If-else statements written out:

```
if (a === 1) {
  //...
} else if (b === 2) {
  //...
} else {
  //...
}
```

If-then-else statements shortened:

```
a === 1 ? console.log(1) : console.log('not 1');
```

### Loops

#### For

```
for (let i = 0; i < 2; i++) {
  console.log(i);
}
// OUTPUT: 0 1
```

#### Do While

```
let i = 0;
do {
  console.log(i);
  i++;
} while (i < 2);
// OUTPUT: 0 1
```

#### While

```
let i = 0;
while (i < 2) {
  console.log(i);
  i++;
}
// OUTPUT: 0 1
```

#### For In (Objects)

```
const obj = { a: 1, b: 'fish' };
for (const name in obj) {
  console.log(name);
}
// OUTPUT: a
// OUTPUT: b
```

#### For In (Arrays)

```
const arr = ['a', 'b'];
for (const name in arr) {
  console.log(name);
}
// OUTPUT: 0
// OUTPUT: 1
```

#### Break and Continue

*Break* - stops the loop

*Continue* - keep going in loop

## String Functions

| Function      | Meaning                                              |
|---------------|------------------------------------------------------|
| length        | The number of characters in the string              |
| indexOf()     | The starting index of a given substring              |
| split()       | Split the string into an array on the given delimiter string |
| startsWith()  | True if the string has a given prefix               |
| endsWith()    | True if the string has a given suffix               |
| toLowerCase() | Converts all characters to lowercase                |


## Writing Functions

*Functions allows the code to be simpler, parsable, reusable, and deciferable.*

### Functions with parameters and default values

```
function labeler(value, title = 'title') {
  console.log(`${title}=${value}`);
}

labeler();
// OUTPUT: title=undefined

labeler('fish');
// OUTPUT: title=fish

labeler('fish', 'animal');
// OUTPUT: animal=fish
```

### Anonymous Functions

For writing functions for single-time use or to be stored as an object property, you can declare an anonymous function and assign it to a constant.

```
const add = function (a, b) {
  return a + b;
}
```

### Arrow Functions

*To make the code more compact the `arrow` syntax was created.*

This is a function in arrow syntax that takes no parameters and always returns 3.

```
() => 3
```

What are the rules for return values using arrow functions?

```
() => 3;
// RETURNS: 3

() => {
  3;
};
// RETURNS: undefined

() => {
  return 3;
};
// RETURNS: 3
```

### Rest and Spread

Sometime, you want a function to take an unknown number of parameters. The `rest` syntax makes this easier. The function below will take all the given parameters after the first and combine them into the array "numbers", which the function can reference. Note that `rest` is applied when the function is created.

```
function hasNumber (test, ...numbers) {
  return numbers.some((i) => i === test);
}

hasNumber(2, 1, 2, 3);
// RETURNS: true
```

The `spread` syntax does the opposite. it can take an iterable object (array or string) and expand it into a functions parameters. For example, the below code will extropolate the strings from the array ['Ryan', 'Dahl'] and use them as parameters for the person function. Note the `spread` is applied when the function is called.

```
function person(firstName, lastName) {
  return { first: firstName, last: lastName };
}

const p = person(...['Ryan', 'Dahl']);
console.log(p);
// OUTPUT: {first: 'Ryan', last: 'Dahl'}
```

### Exceptions

Basic syntax looks like this:

```
try {
  // normal execution code
} catch (err) {
  // exception handling code
} finally {
  // always called code
}
```

Can be used to call a fallback pattern, such as to use a local cache of data if the network data is unavailable.

```
function getScores() {
  try {
    const scores = scoringService.getScores();
    // store the scores so that we can use them later if the network is not available
    window.localStorage.setItem('scores', scores);
    return scores;
  } catch {
    return window.localStorage.getItem('scores');
  }
}
```

### Destructuring

*The process of pulling individual items out of an existing one, or removing structure.*

You can pull out parts of existing items while assigning them to variables:

```
const a = [1, 2, 4, 5];

// destructure the first two items from a, into the new variables b and c
const [b, c] = a;

console.log(b, c);
// OUTPUT: 1, 2
```

You can use the rest syntax:

```
const [b, c, ...others] = a;

console.log(b, c, others);
// OUTPUT: 1, 2, [4,5]
```

When destructuring objects, you will call the keys and the values will be stored instead:

```
const o = { a: 1, b: 'animals', c: ['fish', 'cats'] };

const { a, c } = o;

console.log(a, c);
// OUTPUT 1, ['fish', 'cats']
```

Or you can map the values to new variable names:

```
const o = { a: 1, b: 'animals', c: ['fish', 'cats'] };

const { a: count, b: type } = o;

console.log(count, type);
// OUTPUT 1, animals
```

You can provide default values:

```
const { a, b = 22 } = {};
const [c = 44] = [];

console.log(a, b, c);
// OUTPUT: undefined, 22, 44
```

And you can update existing variables instead of defining new ones:

```
let a = 22;

[a] = [1, 2, 3];

console.log(a);
// OUTPUT: 1
```

### Promises

These are functions that run asyncronously. So, if there's a timeout as part of the promise, most other parts of the code will run first as they will be faster than the timeout.

If you declare the function as an `async` function, then use `await`, the promise function will finish before continuing. It will not run asyncronously.

Promises contain a resolve and reject statement. See example:

```
const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('taco');
        resolve(true);
    }, 10000);
});
console.log('burger');

p
.then((result) => console.log('shake'))
.catch((e) => console.log('salad'))
.finally(() => console.log('noodles'))

console.log('fries');
```

The output of the above code would be:

```burger fries taco shake noodles```

## JavaScript Arrays

*Objects that contain a list of objects. Can be lists of strings, numbers, arrays, objects, etc.*

### Object Functions

| Function | Meaning                                                | Example          |
|----------|--------------------------------------------------------|------------------|
| push     | Add an item to the end of the array                  | `a.push(4)`      |
| pop      | Remove an item from the end of the array              | `x = a.pop()`    |
| slice    | Return a sub-array                                    | `a.slice(1,-1)`  |
| sort     | Run a function to sort an array in place              | `a.sort((a,b) => b-a)` |
| values   | Creates an iterator for use with a `for of` loop      | `for (i of a.values()) {...}` |
| find     | Find the first item satisfied by a test function      | `a.find(i => i < 2)` |
| forEach  | Run a function on each array item                     | `a.forEach(console.log)` |
| reduce   | Run a function to reduce each array item to a single item | `a.reduce((a, c) => a + c)` |
| map      | Run a function to map an array to a new array          | `a.map(i => i+i)` |
| filter   | Run a function to remove items                         | `a.filter(i => i%2)` |
| every    | Run a function to test if all items match              | `a.every(i => i < 3)` |
| some     | Run a function to test if any items match              | `a.some(i => 1 < 1)` |

## Objects and Classes

### Objects

An object is a collection of key-value pairs (properties), including sub-objects, arrays, or customizable functions (methods). Objects can be created using the `new` operator or with object-literal syntax. Objects can be manipulated by adding, deleting, or modifying properties using dot or bracket notation. Objects have some static functions to access its properties such as Object.entries, Object.keys, and Object.values.

```
// Creating an object with the new operator
const obj = new Object({a:3});
obj['b'] = 'fish';
obj.c = [1, 2, 3];
obj.hello = function () {
  console.log('hello');
};
console.log(obj);
// OUTPUT: {a: 3, b: 'fish', c: [1,2,3], hello: func}

// Creating an object with object-literal syntax
const obj = {
  a: 3,
  b: 'fish',
  c: [1, 2, 3],
  hello: function () {
    console.log('hello');
  },
};
console.log(obj);
// OUTPUT: {a: 3, b: 'fish', c: [1,2,3], hello: func}

// Using Object functions
console.log(Object.entries(obj));
// OUTPUT: [['a', 3], ['b', 'fish'], ['c', [1,2,3]], ['hello', func]]
console.log(Object.keys(obj));
// OUTPUT: ['a', 'b', 'c', 'hello']
console.log(Object.values(obj));
// OUTPUT: [3, 'fish', [1,2,3], func]
```

### Classes

Classes are templates for creating objects with predefined properties and methods. Classes have an explicit constructor that initializes the object’s state with the this pointer. Classes can have private properties and methods by prefixing them with a #. Classes can inherit from other classes using the extends keyword and the super function. Classes can override the parent’s methods by defining them with the same name.

```
// Creating a class
class Person {
  constructor(name) {
    this.name = name;
  }
  log() {
    console.log('My name is ' + this.name);
  }
}
const p = new Person('Eich');
p.log();
// OUTPUT: My name is Eich

// Using private properties and methods
class Person {
  #name;
  constructor(name) {
    this.#name = name;
  }
  #greet() {
    console.log('Hello, ' + this.#name);
  }
}
const p = new Person('Eich');
p.#greet();
// OUTPUT: Uncaught SyntaxError: Private field '#greet' must be declared in an enclosing class

// Using inheritance
class Person {
  constructor(name) {
    this.name = name;
  }
  print() {
    return 'My name is ' + this.name;
  }
}
class Employee extends Person {
  constructor(name, position) {
    super(name);
    this.position = position;
  }
  print() {
    return super.print() + '. I am a ' + this.position;
  }
}
const e = new Employee('Eich', 'programmer');
console.log(e.print());
// OUTPUT: My name is Eich. I am a programmer
```

## Scope

Scope is defined as the variables that are visible in the current context of execution. JavaScript has four types of scope:

1. Global - Visible to all code
1. Module - Visible to all code running in a module
1. Function - Visible within a function
1. Block - Visible within a block of code delimited by curly braces

*Note that declaring a variable using `var` will ignore block scope.*

### This

The keywork `this` represents a variable that points to an object that contains the context withitn the scope of the currently executing line of code.

1. Global - When this is referenced outside a function or object it refers to the globalThis object. The globalThis object represents the context for runtime environment. For example, when running in a browser, globalThis refers to the browser's window object.
1. Function - When this is referenced in a function it refers to the object that owns the function. That is either an object you defined or globalThis if the function is defined outside of an object. Note that when running in JavaScript strict mode, a global function's this variable is undefined instead of globalThis.
1. Object - When this is referenced in an object it refers to the object.

## JavaScript Object Notation (JSON)

*A simple and effective way to share and store data, particularly to and from JavaScript objects.*

A JSON document contains an object with zero or more key value pairs. Key is always a string and value must be one of the valid JSON data types (see below). Here is a simple example of a JSON document:

```
{
  "class": {
    "title": "web programming",
    "description": "Amazing"
  },
  "enrollment": ["Marco", "Jana", "فَاطِمَة"],
  "start": "2025-02-01",
  "end": null
}
```

### Converting JavaScript to and from JSON documents

```
const obj = { a: 2, b: 'crockford', c: undefined };
const json = JSON.stringify(obj);
// to JSON
const objFromJson = JSON.parse(json);
// to JavaScript object

console.log(obj, json, objFromJson);

// OUTPUT:
// {a: 2, b: 'crockford', c: undefined}
// {"a":2, "b":"crockford"}
// {a: 2, b: 'crockford'}
```

*Note that because JSON cannot represet the JavaScript `undefined` object, it gets dropped when converting from JavaScript to JSON.*

### JSON Data Types

| Type   | Example                    |
|--------|----------------------------|
| string | "crockford"                |
| number | 42                         |
| boolean | true                       |
| array  | [null, 42, "crockford"]    |
| object | {"a": 1, "b": "crockford"} |
| null   | null                       |

## Regular Expressions (RegEx)

*RegEx support is built into JavaScript as methods on `string` class objects.*

You can create a regular expression using the class constructor or a regular expression literal:

```
const objRegex = new RegExp('ab*', 'i');
const literalRegex = /ab*/i;
```

Then, you can use the `string` class methods `match`, `replace`, `search`, `split`, and `test`.

| Method   | Explanation                                               | Example                                 |
|----------|-----------------------------------------------------------|-----------------------------------------|
| `match`  | Searches a string for a pattern and returns an array of matched substrings. | `const text = "Hello, world!";`<br> `const matches = text.match(/o/g);`<br> `// Result: ['o', 'o']` |
| `replace` | Replaces occurrences of a pattern in a string with a specified replacement. | `const text = "Hello, world!";`<br> `const replaced = text.replace(/world/, 'universe');`<br> `// Result: "Hello, universe!"` |
| `search` | Searches a string for a pattern and returns the index of the first match. | `const text = "Hello, world!";`<br> `const index = text.search(/world/);`<br> `// Result: 7` |
| `split`  | Splits a string into an array of substrings based on a specified separator. | `const text = "apple,orange,banana";`<br> `const fruits = text.split(',');`<br> `// Result: ["apple", "orange", "banana"]` |
| `test`   | Tests if a pattern matches a string and returns a boolean. | `const pattern = /apple/;`<br> `const result = pattern.test("I like apples");`<br> `// Result: true` |

## Using JavaScript within a Web Application

### Interacting with the DOM

`document.querySelector('p')` will affect only the **first** p element
`document.querySelectorAll('p')` will affect **all** p elements

`const newChild = document.createElement('div')` will create an element, which needs to be added somewhere
`<parentElement>.appendChild(newChild)` will append the new element to a parent element

`const element = document.querySelector('div')` will query for the first **div** element
`<parentElement>.removeChild(element)` will then remove that specific **div** element from a parent element

`<element>.innerHTML = '<div>Hello world</div>` will change the html of the element to the new html block

### Event Listeners

You can attach a function to an element that gets called with an event occurs on said element. These are called event listeners. Here's an example:

```
const submitDataEl = document.querySelector('#submitData');
submitDataEl.addEventListener('click', function (event) {
  console.log(event.type);
});
```

Here are common event:

| Event Category  | Description                  |
|-----------------|------------------------------|
| Clipboard       | Cut, copied, pasted          |
| Focus           | An element gets focus        |
| Keyboard        | Keys are pressed             |
| Mouse           | Click events                 |
| Text selection  | When text is selected        |

### Local Storage

Using the browser's `localStorage` API, code can write and retrieve information that persists until the browser is closed (i.e., the information can be accessed across session and HTML page renderings). It can also be used as a cache for when data cannot be obtained from the server.

Main functions:

| Function         | Meaning                                         |
|------------------|-------------------------------------------------|
| setItem(name, value) | Sets a named item's value into local storage |
| getItem(name)    | Gets a named item's value from local storage |
| removeItem(name) | Removes a named item from local storage       |
| clear()          | Clears all items in local storage              |

> To see what values are currently set for your application, open the `Application` tab of the dev tools (in browser), select `Storage > Local Storage` and then your domain name.