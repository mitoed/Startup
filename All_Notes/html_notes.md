### Link to [all notes](/notes.md).

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