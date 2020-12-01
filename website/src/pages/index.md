
## [pins.js](/): A cross-language data sharing library

The `pins.js` library is implemented in <b>JavaScript</b> making it ideal to read and write datasets from plain <b>HTML</b> or <b>Node.js</b> applications. It provides support for <b>Python</b> as well by embedding `pins.js` into its Python package. Since `pins.js` was ported from the [pins](https://pins.rstudio.com) R package, it can also interoperate with <b>R</b>, making it an ideal library for sharing datasets across R, Python and JavaScript.

export const Floating = ({children, title}) => (
  <div
    style={{
      borderRadius: '2px',
      padding: '0.2rem',
      width: '25%',
      margin: '4%',
      minWidth: '200px',
      display: 'inline-block',
      verticalAlign: 'top'
    }}>
    <h1>{title}</h1>
    {children}
  </div>
);

<Floating title="Pin"><b>Pin</b> remote resources locally with <code>pin()</code>, work offline and cache results.</Floating>
<Floating title="Discover"><b>Discover</b> new resources across different boards using
    <code>pinFind()</code>.</Floating>
<Floating title="Share"><b>Share</b> and retrieve resources from cloud services with <code>boardRegister()</code>.</Floating>

````multilang
```html <head>
   <script language="javascript" src="pins.js"></script>
   <script>
     pins.pin([1, 2, 3], { name: "onetwothree", board: "local" })
   </script>
 </head>```

```js // npm install pinsjs

 pins.pin([1, 2, 3], { name: "onetwothree", board: "local" })```

```py # pip3 install git+https://github.com/pinsjs/pinsjs.git@master#subdirectory=python --user

 import pins
 pins.pin([1, 2, 3], name = "onetwothree", board = "local") ```

```r # install.packages("pins")

 library(pins) 
 pin(1:3, name = "onetwothree", board = "local") ```
````

For R, please make use of the documentation available at [pins.rstudio.com](https://pins.rstudio.com) otherwise use the [docs](docs) section.

