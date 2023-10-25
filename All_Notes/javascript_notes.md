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







### Interacting with the DOM

`document.querySelector('p')` will affect only the **first** p element
`document.querySelectorAll('p')` will affect **all** p elements

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