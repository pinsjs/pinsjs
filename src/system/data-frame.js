import mime from 'mime';

class DataFrame {
  constructor(path) {
    this.path = path;
    this.metadata = {
      type: mime.getType(this.path),
    };
  }
}

export default DataFrame;
