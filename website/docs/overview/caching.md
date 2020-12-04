---
id: caching
title: Caching
slug: /caching
---

Let's suppose that the 'home prices' dataset is not exactly what we are looking for, we can try to search online for 'home prices' and find out that [catalog.data.gov](https://catalog.data.gov/) contains a more suitable [FHFA House Price Indexes](https://catalog.data.gov/dataset/fhfa-house-price-indexes-hpis) dataset. Instead of giving users explicit instructions to download the CSV file, we can instead use `pin()` to cache this dataset locally:

````multilang
```js pins.pin("http://www.fhfa.gov/datatools/downloads/documents/hpi/hpi_master.csv",
          { name: "home_price_indexes" })```
```py pins.pin("http://www.fhfa.gov/datatools/downloads/documents/hpi/hpi_master.csv",
          name = "home_price_indexes")```
````

Notice that the pin returns a path to a local CSV file, which you are free to load with your favorite package.

````multilang
```js var data = pins.pin("http://www.fhfa.gov/datatools/downloads/documents/hpi/hpi_master.csv",
          { name: "home_price_indexes" })
 d3.csvParse(data)```
```py data = pins.pin("http://www.fhfa.gov/datatools/downloads/documents/hpi/hpi_master.csv",
          name = "home_price_indexes")
 csv.reader(data)```
````

The `pins.js` library makes use of HTTP headers like [cache-control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) and [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) to avoid downloading files when they have not changed or when the cache has not expired.
