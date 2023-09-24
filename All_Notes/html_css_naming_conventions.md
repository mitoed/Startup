# CSS & HTML SMACSS
### *Scalable and Modular Architecture for CSS*

## Class & ID Name Structures

### HTML Page Names and Prefixes

| Page Name | Prefix |
| --------- | ------ |
| ALL PAGES | ALL- |
| index.html | IND- |
| enter-session.html | ENT- |
| voting-session.html | VOT- |
| about.html | ABT- |

### Class (and Sub-Class) Structure

| Page | Section | Full Abreviation | LO, Mod, or Style* |
| ---- | ------- | ---------------- | ---------- |
| ALL- | l-header | ALL-l-header | LO |
| ALL- | menu | ALL-menu | Mod |
| IN- | l-main | IN-l-main | LO |
| IN- | login | IN-login | Mod |
| IN- | userexist | IN-userexist | Mod |
| IN- | usernew | IN-usernew | Mod |
| ALL- | l-footer | ALL-l-footer | LO |

**sorted by position on HTML page*

## CSS File Organization

1. Base Rules: selectors, child selectors, or sibling selectors; e.g., all "a" elements or "h1" elements

1. Layout Rules: major components or sections on a page; beginning with sections applicable to all pages, then organized by html page; e.g., "l-header", "l-flex", "l-grid" (or general IDs)

1. Module Rules: minor components or parts of design: popups, callouts, sidebars; just named with ".[class]" or ".[class]-[subclass]" (when subclass is created, both class and subclass should be listed in HTML element).

1. State Rules: describe the individual states of specific modules; e.g., "is-hidden", is-collapsed"

1. Theme Rules: describe how modules/layouts might look; e.g., "text-1", "button-1"