---
id: sharing
title: Sharing
slug: /sharing
---

After performing a data analysis, you might want to share your dataset with others, which you can achieve using `pin(data, board = "<board-name>")`.

There are multiple boards available, one of them is the "local" board which `pins.js` uses by default. A "local" board can help you share pins with other JavaScript or Python sessions using a well-known cache folder in your local computer. Notice that this board is available by default:

````multilang
```js boardList()```
```py board_list()```
````

Unless you've registered a board, you can expect the output to be an array containing the "local" board.

Other boards supported in `pins.js` include Amazon S3 and RStudio Connnect boards, you can register an Amazon S3 board as follows:

````multilang
```js pins.boardRegister('s3', {
  bucket: 'bucket',
  key: 'key',
  secret: 'secret'
});
```
```py pins.board_register("s3", bucket = "bucket", key = "key", secret = "secrert")```
````

Similarily, and RStudio Connect board can be register as:

````multilang
```js pins.boardRegister('rsconnect', { 'key', 'server' }); ```
```py pins.board_register('rsconnect', key = "key", server = "https://rsconnectsrv/" });```
````
