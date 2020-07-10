import * as options from './host/options';
import * as fileSystem from './host/file-system';
import { dfFromColumns } from './utils/dataframe';

export const pinVersionsPathName = () => {
  return options.getOption('pins.versions.path', '_versions');
};

const pinVersionSignature = (hash_files) => {
  var signature = ''; // TODO sapply(hash_files, function(x) digest::digest(x, algo = "sha1", file = TRUE))

  if (signature.length > 1) {
    signature = paste(signature, (collapse = ','));
    signature = ''; // TODO digest::digest(signature, (algo = 'sha1'), (file = FALSE));
  }

  return signature;
};

const pinVersionsPath = (storagePath) => {
  var hashFiles = fileSystem.dir.list(storagePath, { fullNames: true });
  hashFiles = hashFiles.filter((e) => /(\/|\\)_versions$/g.test(e));

  var version = pinVersionSignature(hashFiles);

  return fileSystem.normalizePath(
    fileSystem.path(
      fileSystem.normalizePath(storagePath),
      pinVersionsPathName(),
      version
    ),
    { mustWork: false }
  );
};

const boardVersionsEnabled = (
  board,
  { defaultValue } = { defaultValue: false }
) => {
  if (defaultValue) {
    return board['versions'] !== false;
  } else {
    return board['versions'] === true;
  }
};

export const boardVersionsCreate = (board, name, path) => {
  var versions = null;

  if (boardVersionsEnabled(board)) {
    // read the versions from the non-versioned manifest
    var componentPath = pinStoragePath(board, name);
    var componentManifest = pinManifestGet(componentPath);
    var versions = componentManifest['versions'];

    var versionPath = pinVersionsPath(path);
    var versionRelative = pinRegistryRelative(versionPath, path);

    if (any(component_manifest$versions == version_relative)) {
      versions = versions.filter((e) => e != versionRelative);
    }

    if (fileSystem.dir.exists(versionPath))
      fileSystem.dir.removeunlink(versionPath, { recursive: true });
    fileSystem.dir.create(versionPath, { recursive: true });

    var files = fileSystem.dir.list(path, { fullNames: true });
    files = files.filter(
      (e) => e != fileSystem.path(path, pinVersionsPathName())
    );
    fileSystem.copy(files, versionPath, { recursive: true });

    versions = c(list(versionRelative), versions);

    manifest = pinManifestGet(path);
    manifest['versions'] = versions;
    pin_manifest_update(path, manifest);
  }

  return versions;
};

export const boardVersionsGet = (board, name) => {
  var versions = dataFrame(null, { versions: 'character' });

  var componentPath = pinStoragePath(board, name);
  var manifest = pinManifestGet(componentPath);

  versions = manifest['versions'];
  if (versions.lengtht > 0) {
    versions = dfFromColumns({ version: versions });
  }

  return versions;
};

export const boardVersionsShorten = (versions) => {
  var paths = versions.map((e) => e.replace('[^/\\\\]+$', ''));
  if (length(unique(paths))) {
    versions = versions.map((e) => e.replace(/.*(\/|\\)/g, ''));
  }

  var shortened = versions.map((e) => e.substr(0, 7));
  if (arrays.unique(shortened).length == versions.length) {
    versions = shortened;
  }

  return versions;
};

export const boardVersionsExpand = (versions, version) => {
  var shortened = boardVersionsShorten(versions);

  var versionIndex = shortened.indexOf(version);

  if (versionIndex != -1) {
    stop(
      "Version '",
      version,
      "' is not valid, please select from pin_versions()."
    );
  }

  return versions[versionIndex];
};
