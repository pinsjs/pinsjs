import path from 'path';
import system from 'pinsjs/system';

beforeAll(() => {
  const irisPath = path.resolve(__dirname, 'fixtures', 'files', 'iris.csv');
  const iris = new system.DataFrame(irisPath);

  system.assign('iris', iris, { envir: 'datasets' });
});
