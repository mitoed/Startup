### Link to [all notes](/notes.md).

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