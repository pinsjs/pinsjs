---
id: getting-started
title: Overview
slug: /starting
---

A [typical Data Science project](https://r4ds.had.co.nz/introduction.html) starts with importing data and finishes with communicating your results with others; however, some projects have a few additional steps that we will refer as: **Discover**, **Cache** and **Share**. While these steps might not deserve to be part of the official Data Science diagram, they can help us understand where the `pins.js` package can help.

Conceptually, the modified Data Science diagram looks as follows:

![](/images/docs/pins-starting-overview.png)

The `pins.js` package refers to arbitrary resources as pins, and refers to the action of caching a resource as pinning. A pin is something useful to have but not terrible to lose -- you should always have reproducible code to regenerate a pin.

Let's now introduce each operation the `pins.js` package supports.

**Cache**: Once you identify which datasets to import, it is often the case that they are manually downloaded. It is common to give explicit instructions to download datasets before actually importing the dataset. However, manual steps make it hard to reproduce your code -- we can no longer just copy-paste and run code. One easy solution is to explicitly download the file from code; however, this would cause the file to be re-downloaded each time the code runs, so you can then try to check if the file already exists, and keep adding complexity to try to reliably download and cache files. Quoting Phil Karlton, "There are only two hard things in Computer Science: cache invalidation and naming things". So instead of worrying when to invalidate and cache online resources, you can use `pin()` to cache any resource with ease.

**Share**: There are cases where you might want to not only communicate with others your results, but also allow others to reuse your results. For instance, once you finish analyzing house remodel projects, you might also want to share your final dataset for others to reuse. The `pins.js` package allows you to share resources cloud services like Amazon S3, Microsoft Azure, Digital Ocean, and RStudio Connect.

**Discover**: In some Data Science projects, it might not be obvious which dataset you should use; therefore, a first step might be to search online for specific datasets. For instance, suppose that you are trying to figure out what kind of house remodel could increase your home property value the most, where do you get such data from? You can search online but is often hard to filter results to contain only datasets, it also requires you to have some knowledge of which data sources are trustworthy and so on. This is obviously a hard problem and we can't expect a single tool to magically fix this for us; instead, the `pins.js` package gives you a few tools to search well known data repositories through the `pin_find()` function. In addition, even though most projects have well-defined datasets to import from, you might also want to consider enhancing them with additional data sources; for example, while analyzing a well-known ice-cream sales dataset, you might want also want to find resources with historical weather to properly adjust the existing data.

Before we present code examples on how to discover datasets, install the `pins.js` package as follows:

````multilang
```html <html>
   <head>
     <script language="javascript" src="pins.js"></script>
     <script language="javascript" src="pins.browser.js"></script>
   </head>
 </html>```

```py # pip3 install git+https://github.com/pinsjs/pinsjs.git@master#subdirectory=python --user
```
````
