### Link to [all notes](/notes.md).

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

