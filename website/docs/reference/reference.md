---
id: reference
title: Reference
slug: /reference
---

:::info
Parameter names are slightly different between JavaScript and Python.
Python names require snake_case but are documented with camelCase.
:::
## Functions

<dl>
<dt><a href="#boardList">boardList()</a> ⇒ <code>Object</code></dt>
<dd><p>Retrieves all available boards.</p>
</dd>
<dt><a href="#boardRegister">boardRegister(board, name, cache, versions)</a> ⇒ <code>String</code></dt>
<dd><p>Registers a board, useful to find resources with <code>pinFind()</code> or pin to additional boards with <code>pin()</code>.</p>
</dd>
<dt><a href="#pinGet">pinGet(name, board, cache, extract, version, files, signature)</a> ⇒ <code>Object</code></dt>
<dd><p>Retrieves a pin by name and, by default, from the local board. You can use
             the <code>board</code> parameter to specify which board to retrieve a pin from. If a board
             is not specified, it will use <code>pinFind()</code> to find the pin across all boards
             and retrieve the one that matches by name.</p>
</dd>
<dt><a href="#pinRemove">pinRemove(name, board)</a></dt>
<dd><p>Removes a pin by name from the local or given board.</p>
</dd>
<dt><a href="#pinFind">pinFind(text, board, name, extended)</a></dt>
<dd><p>Find a pin in any board registered.</p>
</dd>
</dl>

<a name="boardList"></a>

## boardList() ⇒ <code>Object</code>
Retrieves all available boards.

**Kind**: global function  
**Returns**: <code>Object</code> - All the names from the registered boards.  
**Example**  
````multilang
```js
pins.boardList();
```
```py
pins.board_list()
```
````
<a name="boardRegister"></a>

## boardRegister(board, name, cache, versions) ⇒ <code>String</code>
Registers a board, useful to find resources with `pinFind()` or pin to additional boards with `pin()`.

**Kind**: global function  
**Returns**: <code>String</code> - The name of the board.  

| Param | Type | Description |
| --- | --- | --- |
| board | <code>String</code> | The name of the board to register. |
| name | <code>String</code> | An optional name to identify this board, defaults to the board name. |
| cache | <code>String</code> | The local folder to use as a cache. |
| versions | <code>Boolean</code> | Should this board be registered with support for versions? |

**Example**  
````multilang
```js
pins.boardRegister("s3", {
  bucket: "bucket",
  key: "key",
  secret: "secret"
});
```
```py
pin = pins.board_register("s3", bucket = "bucket", key = "key", secret = "secrert")
```
````
<a name="pinGet"></a>

## pinGet(name, board, cache, extract, version, files, signature) ⇒ <code>Object</code>
Retrieves a pin by name and, by default, from the local board. You can use
             the `board` parameter to specify which board to retrieve a pin from. If a board
             is not specified, it will use `pinFind()` to find the pin across all boards
             and retrieve the one that matches by name.

**Kind**: global function  
**Returns**: <code>Object</code> - A pin from a given board.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the pin. |
| board | <code>String</code> | The board where this pin will be retrieved from. |
| cache | <code>Boolean</code> | Should the pin cache be used? Defaults to `true`. |
| extract | <code>Boolean</code> | Should compressed files be extracted?                                       Each board defines the default behavior. |
| version | <code>String</code> | The version of the dataset to retrieve, defaults to latest one. |
| files | <code>Boolean</code> | Should only the file names be returned? Defaults to `false`. |
| signature | <code>String</code> | Optional signature to validate this pin,                                       use `pin_info()` to compute signature. |

**Example**  
````multilang
```js
pins.pinGet("numbers")
```

```py
pin = pins.pin_get("numbers")
```
````
<a name="pinRemove"></a>

## pinRemove(name, board)
Removes a pin by name from the local or given board.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the pin. |
| board | <code>Object</code> | The board where this pin will be retrieved from. |

**Example**  
````multilang
```js
pins.pinRemove("numbers", { board: 'local' })
```

```py
pin = pins.pin_remove("numbers", board = "local")
```
````
<a name="pinFind"></a>

## pinFind(text, board, name, extended)
Find a pin in any board registered.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | The text to find in the pin description or name. |
| board | <code>String</code> | The board where this pin will be retrieved from. |
| name | <code>String</code> | The exact name of the pin to match when searching. |
| extended | <code>Boolean</code> | Should additional board-specific columns be shown? |

**Example**  
````multilang
```js
pins.pinFind("")
```

```py
pin = pins.pin_find("")
```
````
