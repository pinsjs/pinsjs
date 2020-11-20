---
id: reference
title: Reference
---

:::info
Parameter names are slightly different between JavaScript and Python.
Python names require snake_case but are documented with camelCase.
:::
<a name="pinGet"></a>

## pinGet(name) ⇒ <code>Object</code>
Retrieves a pin by name and, by default, from the local board. You can use
             the `board` parameter to specify which board to retrieve a pin from. If a board
             is not specified, it will use `pin_find()` to find the pin across all boards
             and retrieve the one that matches by name.

**Kind**: global function  
**Returns**: <code>Object</code> - A pin from a given board.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the pin. |
| options.board | <code>Object</code> | The board where this pin will be retrieved from. |
| options.cache | <code>Boolean</code> | Should the pin cache be used? Defaults to `true`. |
| options.extract | <code>Boolean</code> | Should compressed files be extracted?                                       Each board defines the default behavior. |
| options.version | <code>String</code> | The version of the dataset to retrieve, defaults to latest one. |
| options.files | <code>Boolean</code> | Should only the file names be returned? Defaults to `false`. |
| options.signature | <code>String</code> | Optional signature to validate this pin,                                       use `pin_info()` to compute signature. |

**Example**  
````multilang
```js
const file = 'nycflights13/flights';
const pin = pinGet(file);
```

```py
file = 'nycflights13/flights'
pin = pin_get(file)
```
````
