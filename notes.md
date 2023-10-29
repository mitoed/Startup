Link to [README file](/README.md) for startup application

### Run in console to deploy code:

> ./deployService.sh -k ~/JavaScript/keys/prod.pem -h activityanarchy.click -s startup

# CS 260 Notes (by topic)

[Web Server Notes -- Internet, Servers, DNS, AWS, Caddy, Certificates](/all_notes/web_server_notes.md)

[GitHub Notes -- Terms and Basic Instructions](/All_Notes/GitHub_notes.md)

[HTML Notes -- Commands and Basics](/All_Notes/html_notes.md)
    
[CSS Notes -- Block Displays and Positioning](/all_notes/css_notes.md)

[JavaScript Notes -- DOM interaction, Promises, other need-to-knows](/all_notes/javascript_notes.md)

[Web Service Notes](/all_notes/web_service_notes.md)

[Database Notes](/all_notes/database_notes.md)

[Login Notes](/all_notes/login_notes.md)

[WebSocket](/all_notes/websocket_notes.md)

[React](/all_notes/react_notes.md)

All Midterm 1 Notes:

# The Internet

## Tracking Connections (done in console)

What is the domain's IP address?
> dig [domain]

What is the internet path that leads from my computer to domain's IP address?
> tracert [domain]

## Network Internals

TCP/IP Layers:

| Layer | Example | Purpose |
| :---- | :-----: | :------ |
| Application | HTTPS | Functionality like web browsing |
| Transport | TCP | Moving connection information packets |
| Internet | IP | Establishing connections |
| Link | Fiber, hardware | Physical connections |

## Common Ports

| Port | Protocol                                             |
|------|-----------------------------------------------------|
| 20   | File Transfer Protocol (FTP) for data transfer      |
| 22   | Secure Shell (SSH) for connecting to remote devices |
| 25   | Simple Mail Transfer Protocol (SMTP) for sending email |
| 53   | Domain Name System (DNS) for looking up IP addresses |
| 80   | Hypertext Transfer Protocol (HTTP) for web requests  |
| 110  | Post Office Protocol (POP3) for retrieving email     |
| 123  | Network Time Protocol (NTP) for managing time       |
| 161  | Simple Network Management Protocol (SNMP) for managing network devices such as routers or printers |
| 194  | Internet Relay Chat (IRC) for chatting              |
| 443  | HTTP Secure (HTTPS) for secure web requests         |


# Setting up webpage

For this class, we used an AMI (Amazon Machine Image) which is the base for our server. It came installed with Ubuntu, Node.js, NVM, Caddy Server, and PM2 (see AMI below).

We created an elastic IP address, which will allow me to continue to use the IP address even if I stopped the server (which means I'm not paying for its use).

We then allowed for SSH, HTTP, and HTTPS traffic for the website.

### Startup Web Address information

Elastic IP Address (click to go to page)
> [3.209.236.159](http://3.209.236.159)

PEM file location:
> C:\Users\masau\keys\Startup-Production.pem

CS 260 class AMI (Community AMI)
> ami-0b009f6c56cdd83ed

# Domain Names

## Basic Structure (with example)

| Part of Domain Name | Subdomain | Secondary | Top |
| ------------- | -- | -- | -- |
| Entire Domain | react.simon | cs260 | .click |
| Root | | cs260 | .click |

## Domain Name System (DNS)

We used Route 53, the AWS service that handles everything DNS-related. From there, I bought my domain name ('activityanarchy.click') and created DNS records on their DNS server. Here are two types of DNS records (I just did the first one):

An `A` record maps name to IP address

A `CNAME` record maps one domain name to another domain name

Here are a list of console commands to see the actual DNS records as hosted by Amazon:

`dig domain.com` in console to get all the IP address associated with the domain name

`whois domain.com` console to get all registration information about domain name from registry

# Console Commands

Basic Console Commands:

`echo` - Output the parameters of the command

`cd` - Change directory

`mkdir` - Make directory

`rmdir` - Remove directory

`rm` - Remove file(s)

`mv` - Move file(s)

`cp` - Copy files

`ls` - List files

`curl` - Command line client URL browser

`grep` - Regular expression search

`find` - Find files

`top` - View running processes with CPU and memory 
usage

`df` - View disk statistics

`cat` - Output the contents of a file

`less` - Interactively output the contents of a file

`wc` - Count the words in a file

`ps` - View the currently running processes

`kill` - Kill a currently running process

`sudo` - Execute a command as a super user (admin)

`ssh` - Create a secure shell on a remote computer

`scp` - Securely copy files to a remote computer

`history` - Show the history of commands

`ping` - Check if a website is up

`tracert` - Trace the connections to a website

`dig` - Show the DNS information for a domain

`man` - Look up a command in the manual

Remote shell into server command:
> ssh -i /keys/Startup-Production.pem ubuntu@3.209.236.159

# Caddy

## What is Caddy?

Caddy is a Web Service that handles incoming HTTP requests by then sending requested static files or routes the request to another webservice. Think of it as a mail center that routes letters and packages to the correct mail truck.

## Why use Caddy?

- Caddy handles all of the creation and rotation of web certificates. This allows us to easily support HTTPS.

- Caddy serves up all of your static HTML, CSS, and JavaScript files. All of your early application work will be hosted as static files.

- Caddy acts as a gateway for subdomain requests to your Simon and startup application services. For example, when a request is made to simon.yourdomain Caddy will proxy the request to the Simon application running with node.js as an internal web service.

## Important Caddy Files

- Configuration File, which defines the operations for dealing with requests.

> ~/Caddyfile

- HTML Files, which are served by Caddy when requests are made to the root or the web server.

> ~/public_html

# HTTPS, TLS, and Web Certificates

HTTPS: protected way to transfer documents without user information

TLS: the protocol that encrypts the user information. It works by negotiating a shared secret that is then used to encrypt data.

Web Certificates: proof that the the certificate owner actually owns the domain name represented by the certificate. It's generated by a 3rd party (Let's Encrypt) and gathered by Caddy.

# GitHub

## Using Github
Github houses repositories in the cloud that can be accessed or updated from code editors (like Visual Studio Code) or consoles (like Git Bash or Command Line). Such interactions include:
- **cloning**: creating a copy of the repository which is linked to the original housed in Github
- **committing**: creating an update to the code, still to be sent to or from the repository on Github
- **pushing**: sending updates from a code editor to the repository on Github
- **pulling**: requesting updates from the repository on Github to your code editor
- **merging**: managing different changes to the same code from multiple sources
- **branching**: creating a new line of updates apart from the main line (like branches on a tree)
- **forking**: creating a more permanent branch from the original code; still can send to original creator to be merged with original
- **Personal Access Tokens**: unique passwords used for committing, merging, branching, etc. your repository

The highly repetitive process used as one makes changes to code goes as follows:
1. Pull the repository's latest changes from Github (console command: `git pull`)
1. Make changes to the code
1. Commit the changes (console command: `git commit`)
1. Push the changes to Github (console command: `get push`)

### Committing Comments
When committing any saved change to the repository, you should add a meaningful comment to describe the change.

`type: short description`

Below are keywords to use as the `type` in your comment:
- `feat` – a new feature is introduced with the changes
- `update` - a feature is changed or updated
- `fix` – a bug fix has occurred
- `chore` – changes that do not relate to a fix or feature and don't modify src or test files (for example updating dependencies)
- `refactor` – refactored code that neither fixes a bug nor adds a feature
- `docs` – updates to documentation such as a the README or other markdown files
- `style` – changes that do not affect the meaning of the code, likely related to code formatting such as white-space, missing semi-colons, and so on.
- `test` – including new or correcting previous tests
- `perf` – performance improvements
- `ci` – continuous integration related
- `build` – changes that affect the build system or external dependencies
- `revert` – reverts a previous commit

# Hypertext Markup Language (HTML)

Current version: `HTML5`

Official Specification: [W3C Specification](https://html.spec.whatwg.org/multipage/)

Default page loaded for webpage: `index.html`

## Structure = elements + attributes (tags)

### Basic Elements

```
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <main>
      <p>Hello world</p>
    </main>
  </body>
</html>
```

### Basic Attributes (Tags)

```
<p id="hello" class="greeting">Hello world</p>
<a href="https://www.google.com>Google.com</a>
<script src="./main.js"></script>
```

### Comprehensive Example

```
<!DOCTYPE html>
<html lang="en">
    <body>
        <p>Body</p>
        <header>
            <p>Header - <span>Span</span></p>
            <nav>
            Navigation
            <div>Div</div>
            <div>Div</div>
            </nav>
        </header>

        <main>
            <section>
            <p>Section</p>
            <ul>
                <li>List</li>
                <li>List</li>
                <li>List</li>
            </ul>
            </section>
            <section>
            <p>Section</p>
            <table>
                <tr>
                <th>Table</th>
                <th>Table</th>
                <th>Table</th>
                </tr>
                <tr>
                <td>table</td>
                <td>table</td>
                <td>table</td>
                </tr>
            </table>
            </section>
            <aside>
            <p>Aside</p>
            </aside>
        </main>

        <footer>
            <div>Footer - <span>Span</span></div>
        </footer>
    </body>
</html>
```

## Common Elements

| Element   | Meaning                                          |
|-----------|--------------------------------------------------|
| html      | The page container                               |
| head      | Header information                               |
| title     | Title of the page                                |
| meta      | Metadata for the page such as character set or viewport settings |
| script    | JavaScript reference. Either an external reference, or inline |
| include   | External content reference                       |
| body      | The entire content body of the page              |
| header    | Header of the main content                       |
| footer    | Footer of the main content                       |
| nav       | Navigational inputs                              |
| main      | Main content of the page                         |
| section   | A section of the main content                    |
| aside     | Aside content from the main content              |
| div       | A block division of content                      |
| span      | An inline span of content                        |
| h<1-9>    | Text heading. From h1, the highest level, down to h9, the lowest level |
| p         | A paragraph of text                              |
| b         | Bring attention                                 |
| table     | Table                                            |
| tr        | Table row                                       |
| th        | Table header                                    |
| td        | Table data                                      |
| ol,ul     | Ordered or unordered list                       |
| li        | List item                                       |
| a         | Anchor the text to a hyperlink                  |
| img       | Graphical image reference                        |
| dialog    | Interactive component such as a confirmation    |
| form      | A collection of user input                      |
| input     | User input field                               |
| audio     | Audio content                                  |
| video     | Video content                                  |
| svg       | Scalable vector graphic content                 |
| iframe    | Inline frame of another HTML page                |

## Form elements

```
<form action="submission.html" method="post">
  <label for="ta">TextArea: </label>
  <textarea id="ta" name="ta-id">
Some text
  </textarea>
  <button type="submit">Submit</button>
</form>
```

| Type           | Meaning                   |
|----------------|---------------------------|
| text           | Single line textual value |
| password       | Obscured password         |
| email          | Email address             |
| tel            | Telephone number          |
| url            | URL address               |
| number         | Numerical value           |
| checkbox       | Inclusive selection       |
| radio          | Exclusive selection       |
| range          | Range limited number      |
| date           | Year, month, day          |
| datetime-local | Date and time             |
| month          | Year, month               |
| week           | Week of year              |
| color          | Color                     |
| file           | Local file                |
| submit         | Button to trigger form submission |

## Images/Audio/Video

```
<img alt="mountain landscape" src="https://images.pexels.com/photos/164170/pexels-photo-164170.jpeg" />
```

```
<audio controls src="testAudio.mp3"></audio>
```

```
<video controls width="300" crossorigin="anonymous">
  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
</video>
```

### Commenting

```<!-- commented text -->```

### Special Characters

| Character | Entity    |
|-----------|-----------|
| &         | &amp;     |
| <         | &lt;      |
| >         | &gt;      |
| "         | &quot;    |
| '         | &apos;    |
| 😀        | &#128512; |

### Block vs Inline Elements

**Block Elements** - will start a new line. Examples include div, p, and aside.

**Inline Elements** - will continue on the same line. Examples include span, b, 

# CSS Notes

## Types of Blocks (Display)

| Display | New Line | Auto Width | Change Width | *Change Height | **Default Examples |
| ----- | :-----: | :-----: | :-----: | :-----: | ----- |
| **Inline** |  | content |  |  | em, strong, a (link), span |
| **Block** | X | full width | X | X | h1-6, p, div, header, body |
| **Inline-Block** |  | content | X | X | img(?), button, textarea, input, select |
| **Flex***** | X | full width | X | X | None |
| **Inline-Flex***** |  | content | X | X | None |

**Including top and bottom margins and padding*

***Note that any block can be changed to a different type.*

****see below*

### Flex Blocks

Made up of **flex containers** that house **flex items**. All flex items become inline-blocks (no new lines but can be resized).

**Properties of flex blocks**

Horizontal Growing and Shrinking:

- **"Flex-grow"** to horizontally grow the items to fill the container (default is OFF). Lives on MAIN AXIS.

  - Set the "flex-grow" property to an integer to direct the ratio of each flex-item that will grow.
  
  - For example, say item 1 has a flex-grow value of 2 and items 2 and 3 have flex-grow values of 1. If there are 60 pixels of empty space, item 1 would add 30 pixels to its width and items 2 and 3 would each add 15 pixels to their widths.

  - Note that "max-width" will override "flex-grow" from increasing an item's size past its max-width value.

- **"Flex-shrink"** to horizontally shrink the items to fit the container (default is ON). Lives on MAIN AXIS.

  - Set the "flex-shrink" property to an integer to direct the ratio of each flex-item that will shrink. Set to 0 to prohibit any shrinking.

  - For example, say item 1 has a flex-shrink value of 2 and items 2 and 3 have flex-shrink values of 1. If the items in a container are 60 more pixels than the container's size, item 1 would subtract 30 pixels from its width and items 2 and 3 would each subtract 15 pixels from their widths.

  - Note that "min-width" will override "flex-shrink" from decreasing an item's size past its min-width value.

- **"Flex-basis"** to size items (or use "width").

- **"Flex-wrap"** to prevent items from shrinking or growing and instead create new rows.
  - Default is nowrap. Other options are wrap (last item starts row 2) andr wrap-reverse (last item pushes the rest onto row 2). Lives on MAIN AXIS.

Shorthand:

- **"Flex: [grow value] [shrink value] [basis value (px or %)]"** to set "flex-grow", "flex-shrink", and "flex-basis" in one line.

**Item Alignment**

- **"Justfify-content"** to horizontally align the items in a container. Lives on MAIN AXIS.

  - Default is flex-start (left). Other options are flex-end (right), center, space-around (evenly spaced), or space-between (spread apart).

- **"Align-items"** to vertically align items within a row. Lives on CROSS AXIS.

  - Default is stretch. Other options are flex-start (top), flex-end (bottom), center, or baseline (bottoms of items, high in the container).

- **"Align-content"** to vertically align rows. Lives on CROSS AXIS.

  - Default is stretch (rows fill space). Other options are flex-start (top), flex-end (bottom), center, space-around (evenly spaced), or space-between (spread apart).

Interchanging Flex Container Axes:

- **"Flex-direction"** can change the axes which will reorder the items.

  - **row** (default) left to right

  - **row-reverse** right to left

  - **column** top to bottom

  - **column-reverse** bottom to top

More Shorthand:

- **"Flex-flow: [flex-direction] [flex-wrap]"** to set flex-direction and flex wrap on one line.

### Nested Flexboxes

By nexting flexboxes, one can create a multi-layered auto-aligning and auto-sizing group of groups of elements. Very helpful for designing webpages that will be used across multiple browser and window sizes.

## Block Positioning Settings

### Properties of Block Positions

| Position | Can offset | Moves Relative to | Recognized by Blocks | Scrolls with Page |
| ----- | :-----: | ----- | :-----: | :-----: |
| * Static |  | N/A | X | X | itself |
| Relative | X | itself | X | X | 
| Absolute | X | itself |  | X |
| Fixed | X | closest parent |  |  |
| Sticky |  | N/A | ** X | ** X |

**Default for all blocks; ignores z-index*

***Fixes when offset position is reached (top, right, bottom, left); declare offset property to apply*

### Offset Properties

Moves the content in a direction (top, right, left, or bottom) away from the default position. Can be dictated in pixels (px), percentage of the width of the containing block (%), or css units (em).

## Z-Index

Changes the order of back-to-front of overlapping elements. Default is 0. Higher Z-index equals forward.

Note that elements with a "static" position ignore the z-index.

## Float

With a specified width element, float moves a block furthest to the left or right as possible. Used for things like wrapping text around an image.

Example: the code below will make a block cover the right half of the window.
> width: 50%

> float: right;

## Clear

When elements are floating together, clear will prohibit a side, left or right, from having floats next to it. Clear is applied to another block to disallow a floating block from being on a side or sides.

Options are left (no floats to the left), right (no floats to the right), both (no floats on either side), or none (floats on any side).

## Animation

Add `animation-name` and `animation-duration` properties to element

Define CSS keyframe using @keyframes [animation-name]
1. starting position/styling: `from {}`
1. middle styling: `50% {}`
1. ending styling: `to {}`

## Fonts

You can access font-family files stored on your server using:
```
@font-face {
  font-family: Quicksand;
  src: url( 'https://cs260.click/fonts/quicksand.woff2' );
}

p {
  font-family: Quicksand
}
```

You can also import fonts hosted online (websites like fonts.googleapis.com). You access them using:
```
@import url( 'https://fonts.googlespis.com/...' )

p {
  font-family: [as given by website]
}
```

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