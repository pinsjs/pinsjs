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
    <script language="javascript" src="pins.browser.js"></script>
    <script language="javascript" src="https://mlverse.github.io/pagedtablejs/js/pagedtable.js"></script>
  </head>
  <body onload="render()">
    <div id="pagedtable"></div>
    <script>
      async function render() {
        await pins.boardRegister('https://datatxt.org', { name: "datatxt" });

        var results = await pins.pinFind("", { board: "datatxt" });
        pagedtable.create({ data: results }, "pagedtable");
      }
    </script>
  </body>
</html>
 ```

 <iframe width="100%" height="146px" style={{borderRadius: '0.4em'}} frameborder="0" src="/pinsjs/examples/public-s3.html"/>

