import path from 'path';
import host from 'pinsjs/host';

beforeAll(() => {
  const irisPath = path.resolve(__dirname, 'fixtures', 'files', 'iris.csv');
  const iris = new host.DataFrame(irisPath);

  host.assign('iris', iris, { envir: 'datasets' });
});
