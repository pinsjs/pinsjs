import mime from 'mime';

// TODO nrow()
// TODO filter((e, idx) => ())
// TODO cbind()
// TODO remove(column)
// TODO order((e) => ())
// TODO colnames()

export class DataFrame {
  constructor(data, columns) {
    this.data = data;
    this.columns = columns;
  }
}
