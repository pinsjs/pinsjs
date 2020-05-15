import mime from 'mime';

// TODO nrow()
// TODO filter((e, idx) => ())
// TODO cbind()
// TODO remove(column)
// TODO order((e) => ())
// TODO colnames()

export class DataFrame {
  constructor(path) {
    this.path = path;
    this.metadata = {
      type: mime.getType(this.path),
    };
  }
}
