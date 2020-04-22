import mime from 'mime';

export class DataFrame {
  constructor(path) {
    this.path = path;
    this.metadata = {
      type: mime.getType(this.path),
    };
  }
}
