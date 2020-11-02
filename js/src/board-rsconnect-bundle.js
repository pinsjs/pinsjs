import * as fileSystem from './host/file-system';
import * as options from './host/options';
import * as signature from './host/signature';
import callbacks from './host/callbacks';
import { dataFrame } from './utils/dataframe';
import { useMethod } from './utils/inheritance';

const addUserHtml = (
  dir,
  path = options.getOption('RSCONNECT_HTML_PATH', '')
) => {
  if (path) {
    fileSystem.copy(path, fileSystem.path(dir, 'index.html'), {
      overwrite: true,
    });
  }
};

const rsconnectBundleTemplateHtml = (tempDir, template, value) => {
  const htmlFile = fileSystem.path(tempDir, 'index.html');
  let htmlIndex = '';

  htmlIndex = fileSystem.read(htmlFile);

  value = value.replace('\\n', '\\\\n');
  htmlIndex = htmlIndex.replace(`{{${template}}}`, value);

  fileSystem.write(htmlFile, htmlIndex);
};

const rsconnectBundleFilesHtml = (files) => {
  let html = '';

  files.forEach((file) => {
    html = `${html}<a href=\"${file}\">${file}</a>`;
  });

  return html;
};

const rsconnectBundleTemplateCommon = (
  tempDir,
  style,
  name,
  board,
  accountName,
  retrieveCommand
) => {
  rsconnectBundleTemplateHtml(tempDir, 'data_preview_style', style);
  rsconnectBundleTemplateHtml(tempDir, 'pin_name', name);

  if (typeof board.server === 'string') {
    rsconnectBundleTemplateHtml(tempDir, 'server_name', board.server);
  } else {
    rsconnectBundleTemplateHtml(
      tempDir,
      'server_name',
      'https://rstudio-connect-server'
    );
  }
  rsconnectBundleTemplateHtml(tempDir, 'account_name', accountName);

  if (!retrieveCommand) {
    retrieveCommand = `pin_get(\"${accountName}/${name}\", board = \"rsconnect\")`;
  }
  rsconnectBundleTemplateHtml(tempDir, 'retrieve_pin', retrieveCommand);
};

export const rsconnectBundleCreateDefault = (
  x,
  tempDir,
  name,
  board,
  accountName,
  retrieveCommand
) => {
  const htmlFile = fileSystem.path(tempDir, 'index.html');

  // TODO:
  // saveRDS(x, fileSystem.path(tempDir, 'data.rds'), { version: 2 });

  let files = fileSystem.dir.list(tempDir, { recursive: true });
  files = files.filter((f) => !new RegExp('index\\.html').test(f));

  /* TODO: copy predefined files from data folder
  fileSystem.copy(
    fileSystem.dir.list('../data', { fullNames: true }),
    tempDir,
    { recursive: true }
  );
  */
  addUserHtml(tempDir);

  rsconnectBundleTemplateHtml(
    tempDir,
    'files_html',
    rsconnectBundleFilesHtml(files)
  );
  rsconnectBundleTemplateHtml(
    tempDir,
    'data_preview',
    '{"data": [], "columns": []}'
  );
  rsconnectBundleTemplateCommon(
    tempDir,
    'display: none',
    name,
    board,
    accountName,
    retrieveCommand
  );

  return 'data.rds';
};

export const rsconnectBundleCreateDataFrame = (
  x,
  tempDir,
  name,
  board,
  accountName,
  retrieveCommand
) => {
  /* TODO: copy predefined files from data folder
  fileSystem.copy(
    fileSystem.dir.list('../data', { fullNames: true }),
    tempDir,
    { recursive: true }
  );
  */
  addUserHtml(tempDir);

  const maxRows = Math.min(
    x.length,
    options.getOption('pins.preview.rows', 10 ^ 4)
  );
  const csvName = fileSystem.dir.list(tempDir, 'data\\.csv');

  let xPreview = x.length ? x.slice(0, 6) : [];

  xPreview = dataFrame(
    xPreview.map((x) => {
      if (typeof x !== 'number') {
        const charColumn = x.toString();

        return charColumn.length === xPreview.length
          ? charColumn
          : '...'.repeat(xPreview.length);
      } else {
        return x;
      }
    })
  );

  const dataPreview = {
    columns: xPreview[0].map((x) => ({
      align: 'right',
      label: x,
      name: x,
      type: '',
    })),
    data: xPreview,
    options: {
      columns: { max: 10 },
      rows: { min: 1, total: xPreview.length },
    },
  };

  rsconnectBundleTemplateHtml(
    tempDir,
    'files_html',
    rsconnectBundleFilesHtml(csvName)
  );
  rsconnectBundleTemplateHtml(
    tempDir,
    'data_preview',
    JSON.stringify(dataPreview)
  );
  rsconnectBundleTemplateCommon(
    tempDir,
    '',
    name,
    board,
    accountName,
    retrieveCommand
  );

  return 'data.rds';
};

export const rsconnectBundleCreateString = (
  x,
  tempDir,
  name,
  board,
  accountName,
  retrieveCommand
) => {
  fileSystem.copy(fileSystem.dir.list(x, { fullNames: true }), tempDir, {
    recursive: true,
  });

  const dataFiles = fileSystem.dir.list(tempDir, { recursive: true });
  const htmlFile = fileSystem.path(tempDir, 'index.html');

  let files = fileSystem.dir.list(tempDir, { recursive: true });
  files = files.filter((f) => !new RegExp('index\\.html').test(f));

  /* TODO: copy predefined files from data folder
  fileSystem.copy(
    fileSystem.dir.list('../data', { fullNames: true }),
    tempDir,
    { recursive: true }
  );
  */
  addUserHtml(tempDir);

  rsconnectBundleTemplateHtml(
    tempDir,
    'files_html',
    rsconnectBundleFilesHtml(files)
  );
  rsconnectBundleTemplateHtml(
    tempDir,
    'data_preview',
    '{"data": [], "columns": []}'
  );
  rsconnectBundleTemplateCommon(
    tempDir,
    'display: none',
    name,
    board,
    accountName,
    retrieveCommand
  );

  return dataFiles;
};

export const rsconnectBundleCreate = (x, ...args) => {
  return useMethod('rsconnectBundleCreate', x, ...args);
};

export const rsconnectBundleCompress = async (path, manifest) => {
  const manifestJson = JSON.stringify(manifest);
  const bundlePath = 'rsconnect-bundle.tar.gz';

  fileSystem.write(fileSystem.path(path, 'manifest.json'), manifestJson);
  fileSystem.dir.zip(path, bundlePath);

  return bundlePath;
};

export const rsconnectBundleFileMd5 = (path) => {
  const fileData = fileSystem.read(path);

  return signature.md5(fileData);
};
