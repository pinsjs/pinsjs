---
id: examples
title: Examples
slug: /examples
---

The following live example shows `pins.js` retrieving public data from [datatxt.org](https://datatxt.org), which is a public Amazon S3 bucket with datasets shared with the pins project.

```html
<html>
  <head>
    <script language="javascript" src="pins.js"></script>
    <script language="javascript" src="pins.browser.js"></script>
    <script language="javascript" src="pagedtable.js"></script>
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

 <iframe width="100%" height="146px" style={{borderRadius: '0.4em', marginBottom: '30px'}} frameborder="0" src="/pinsjs/examples/public-s3.html"/>

We can modify the previous code to retrieve a particular pin as follows:

```html
<html>
  <head>
    <script language="javascript" src="pins.js"></script>
    <script language="javascript" src="pins.browser.js"></script>
    <script language="javascript" src="pagedtable.js"></script>
  </head>
  <body onload="render()">
    <div id="pagedtable"></div>
    <script>
      async function render() {
        await pins.boardRegister('https://datatxt.org', { name: "datatxt" });

        var results = await pins.pinGet("iris", { board: "datatxt" });
        pagedtable.create({ data: results }, "pagedtable");
      }
    </script>
  </body>
</html>
 ```

 <iframe width="100%" height="250px" style={{borderRadius: '0.4em'}} frameborder="0" src="/pinsjs/examples/public-s3-get.html"/>

