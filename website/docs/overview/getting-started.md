---
id: getting-started
title: Overview
slug: /
---

A [typical Data Science project](https://r4ds.had.co.nz/introduction.html) starts with importing data and finishes with communicating your results with others; however, some projects have a few additional steps that we will refer as: **Discover**, **Cache** and **Share**. While these steps might not deserve to be part of the official Data Science diagram, they can help us understand where the `pins` package can help.

Conceptually, the modified Data Science diagram looks as follows:

![](/images/docs/pins-starting-overview.png)

The `pins` package refers to arbitrary resources as pins, and refers to the action of caching a resource as pinning. A pin is something useful to have but not terrible to lose -- you should always have reproducible code to regenerate a pin.

Let's now introduce each operation the `pins` package supports.

**Cache**: Once you identify which datasets to import, it is often the case that they are manually downloaded. It is common to give explicit instructions to download datasets before actually importing the dataset. However, manual steps make it hard to reproduce your code -- we can no longer just copy-paste and run code. One easy solution is to use `download.file()`; however, this would cause the file to be re-downloaded each time the code runs, so you can then try to check if the file already exists, and keep adding complexity to try to reliably download and cache files. Quoting Phil Karlton, "There are only two hard things in Computer Science: cache invalidation and naming things". So instead of worrying when to invalidate and cache online resources, you can use `pin()` to cache any resource with ease.

**Share**: There are cases where you might want to not only communicate with others your results, but also allow others to reuse your results. For instance, once you finish analyzing house remodel projects, you might also want to share your final dataset for others to reuse. The `pins` package allows you to share resources in [GitHub](/), [Kaggle](/), [RStudio Connect](/) and allows you to create extensions to support many other services and technologies.

**Discover**: In some Data Science projects, it might not be obvious which dataset you should use; therefore, a first step might be to search online for specific datasets. For instance, suppose that you are trying to figure out what kind of house remodel could increase your home property value the most, where do you get such data from? You can search online but is often hard to filter results to contain only datasets, it also requires you to have some knowledge of which data sources are trustworthy and so on. This is obviously a hard problem and we can't expect a single tool to magically fix this for us; instead, the `pins` package gives you a few tools to search well known data repositories through the `pin_find()` function. In addition, even though most projects have well-defined datasets to import from, you might also want to consider enhancing them with additional data sources; for example, while analyzing a well-known ice-cream sales dataset, you might want also want to find resources with historical weather to properly adjust the existing data.

Before we present code examples on how to discover datasets, install the `pins.js` package as follows:

````multilang
```html <html>
   <head>
     <script language="javascript" src="pins.js"></script>
   </head>
 </html>```

```js // npm install pinsjs
```

```py # pip3 install git+https://github.com/pinsjs/pinsjs.git@master#subdirectory=python --user
```

````

## Caching

Let's suppose that the 'home prices' dataset is not exactly what we are looking for, we can try to search online for 'home prices' and find out that [catalog.data.gov](https://catalog.data.gov/) contains a more suitable [FHFA House Price Indexes](https://catalog.data.gov/dataset/fhfa-house-price-indexes-hpis) dataset. Instead of giving users explicit instructions to download the CSV file, we can instead use `pin()` to cache this dataset locally:

````multilang
```js pins.pin("http://www.fhfa.gov/datatools/downloads/documents/hpi/hpi_master.csv",
          { name: "home_price_indexes" })```
```py pins.pin("http://www.fhfa.gov/datatools/downloads/documents/hpi/hpi_master.csv",
          name = "home_price_indexes")```
````

Notice that the pin returns a path to a local CSV file, which you are free to load with your favorite package.

```r
library(readr)
pin("http://www.fhfa.gov/datatools/downloads/documents/hpi/hpi_master.csv", name = "home_price_indexes")read_csv(col_types = cols())
```

The `pins.js` library makes use of HTTP headers like [cache-control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) and [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) to avoid downloading files when they have not changed or when the cache has not expired.

## Sharing

After performing a data analysis, you might want to share your dataset with others, which you can achieve using `pin(data, board = "<board-name>")`.

There are multiple boards available, one of them is the "local" board which `pins` uses by default. A "local" board can help you share pins with other R sessions and tools using a well-known cache folder in your local computer defined in the `rappdirs` package. Notice that this board is available by default:

```r
board_list()
```
```
[1] "local"    "packages"
```

You can also name your boards using the 'name' parameter, when a name is not specified, the `pins` package will simply name your board with the kind of board you are using, 'local' in the previous example.

The following example stores a simple data analysis over home prices as 'home_price_analysis' in the 'local' board.

```r
pin_get("home_price_indexes") %>%
  read_csv(col_types = cols()) %>%
  dplyr::group_by(yr) %>%
  dplyr::count() %>%
  pin("home_price_analysis")
```

The local board allows you to share pins with other R sessions or even other Python sessions, to share with other people or across different computers, you can consider using the  `github`, `rsconnect` or `kaggle` boards; these boards will be introduced in the [Understanding Boards](/) article.

Before we get to that, the [Using Pins with RStudio](/) article presents a few enhancements available when using `pins` in RStudio.

## Discovering

You can discover datasets with `pinFind()`, which by default will search for data in all the registered boards. The places where `pins` can find or store resources are referred to as 'boards'. There are multiple boards available but they require you to configure them so we will leave those for later on.

As a quick example, let's search for resources that may contain 'boston housing':

```{r eval=FALSE}
library(pins)
pin_find("")
```

We've found out that the `BSDA` package contains a `Housing` dataset, you can then retrieve this dataset using `pin_get()` as follows:

```r
pin_get("BSDA/Housing")
```
