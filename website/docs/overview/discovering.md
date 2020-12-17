---
id: discovering
title: Discovering
slug: /discovering
---

You can discover datasets with `pinFind()`, which by default will search for data in all the registered boards. The places where `pins.js` can find or store resources are referred to as 'boards'. There are multiple boards available but they require you to configure them so we will leave those for later on.

As a quick example, let's search for resources that may contain 'home' related datasets:

````multilang
```js pinFind('')```
```py pin_find("")```
````

We've found out that the `local` board contains a `home_price_indexes` dataset, you can then retrieve this dataset using `pin_get()` as follows:

````multilang
```js pinFind('home')```
```py pin_get("home")```
````
