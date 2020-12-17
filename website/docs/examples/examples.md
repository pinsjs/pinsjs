---
id: examples
title: Examples
slug: /examples
---

The following live example shows `pins.js` retrieving public data from [datatxt.org](https://datatxt.org). This works since pins are stored and retrieved using this specification.

```html
<html>
  <head>
    <script language="javascript" src="pins.js"></script>
  </head>
  <body>
    <script>
      pins.pin([1, 2, 3], { name: "onetwothree", board: "local" })
    </script>
  </body>
 </head>
 ```


