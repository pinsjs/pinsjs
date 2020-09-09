import * as fileSystem from './host/file-system';
import { tryCatch } from './utils/errors';
import { pinLog } from './log';
import {
  pinStoragePath,
  pinRegistryRetrieveMaybe,
  pinRegistryUpdate,
} from './pin-registry';

export const pinDownloadOne = (
  path,
  {
    name,
    component,
    extract,
    customEtag = '',
    removeQuery,
    config,
    headers,
    canFail,
    cache = true,
    contentLength = 0,
    subpath,
    details = {},
    download = true,
  }
) => {
  if (!subpath) subpath = name;

  const mustDownload = !cache;

  // clean up name in case it's a full url
  name = name.replace('^https?://', '');

  const localPath = pinStoragePath(component, subpath);

  if (!download) {
    return localPath;
  }

  // use a temp path to rollback if something fails
  const tempfile = fileSystem.tempfile();
  fileSystem.dir.create(tempfile);

  const oldPin = pinRegistryRetrieveMaybe(name, component);
  let oldCache = oldPin.cache;
  let oldCacheMissing = true;
  let cacheIndex = 0;

  if (!oldCache) {
    oldPin.cache = {};
    oldCache = {};
    cacheIndex = 1;
  } else {
    const cacheUrls = Object.keys(oldCache).map((k) => oldCache[k].url);

    cacheIndex = cacheUrls.findIndex((u) => u === path);
    if (cacheIndex === -1) {
      oldCache = {};
      cacheIndex = cacheUrls.length + 1;
    } else {
      oldCache = oldCache[cacheIndex];
      oldCacheMissing = false;
    }
  }

  let reportError = (e) => {
    if (oldCacheMissing) {
      throw new Error(e);
    } else {
      pinLog(e);
    }
  };
  const catchLog = (func) =>
    tryCatch(func, (e) => {
      pinLog(e.message);
    });
  const catchError = oldCacheMissing
    ? (func) => func
    : (func) =>
        tryCatch(func, (e) => {
          reportError(e.message);
        });

  if (canFail) {
    reportError = (e) => {
      details.error = e;
    };
  }

  cache = {};
  cache.etag = oldCache.etag || '';
  cache.maxAge = oldCache.maxAge || 0;
  cache.changeAge = oldCache.changeAge || new Date().getTime() - cache.maxAge;
  cache.url = path;

  let error = null;
  let extractType = null;

  pinLog(
    `Checking 'changeAge' header (time, change age, max age): ${new Date()}, ${
      cache.changeAge
    }, ${cache.maxAge}`
  );

  details.somethingChanged = false;

  // skip downloading if maxAge still valid
  if (new Date().getTime() >= cache.changeAge + cache.maxAge || mustDownload) {
    const skipDownload = false;

    if (customEtag && customEtag.length) {
      pinLog(`Using custom 'etag' (old, new): ${oldCache.etag}, ${customEtag}`);
      cache.etag = customEtag;
    } else {
      /*
      head_result <- catch_log(httr::HEAD(path, httr::timeout(5), headers, config))
      if (!is.null(head_result)) {
        cache$etag <- head_result$headers$etag
        cache$max_age <- pin_file_cache_max_age(head_result$headers$`cache-control`)
        cache$change_age <- as.numeric(Sys.time())
        content_length <- head_result$headers$`content-length`
        pin_log("Checking 'etag' (old, new): ", old_cache$etag, ", ", cache$etag)
      }
      */
    }

    const etagChanged = cache.etag || oldCache.etag !== cache.etag;

    // skip downloading if etag has not changed
    if (oldCacheMissing || etagChanged || mustDownload) {
      let downloadName = fileSystem.basename(path);

      if (removeQuery) {
        // downloadName = strsplit(download_name, "\\?")[[1]][1];
      }

      const destinationPath = fileSystem.path(tempfile, downloadName);

      pinLog(`Downloading ${path} to ${destinationPath}`);
      details.somethingChanged = true;

      /*
      write_spec <- httr::write_disk(destination_path, overwrite = TRUE)
      result <- catch_error(httr::GET(path, write_spec, headers, config, http_utils_progress(size = content_length)))
      extract_type <- gsub("application/(x-)?", "", result$headers$`content-type`)
      if (!is.null(result$headers$`content-type`) && result$headers$`content-type` %in% c("application/octet-stream", "application/zip")) {
        if (file.size(destination_path) > 4 &&
            identical(readBin(destination_path, raw(), 4), as.raw(c(0x50, 0x4b, 0x03, 0x04))))
          extract_type <- "zip"
      }

      if (httr::http_error(result)) {
        error <- paste0(httr::http_status(result)$message, ". Failed to download remote file: ", path)
        pin_log(as.character(httr::content(result)))

        report_error(error)
      }
      */
    }
  }

  if (error) return;

  const newCache = oldPin.cache;
  newCache[cacheIndex] = cache;

  // allow to override extraction method, useful in pin() from URLs
  if (extract) {
    extractType = extract;
    extract = true;
  }

  const files = fileSystem.dir.list(tempfile, { fullNames: true });
  if (extractType && extract) {
    /*
    pinExtract(
      structure(files, { class: extractType }),
      tempPath
    )
    */
  }

  for (file in files) {
    fileSystem.copy(file, localPath, { overwrite: true, recursive: true });
  }

  // use relative paths to match remote service downloads and allow moving pins folder, potentially
  const relativePath = localPath.replace(pinStoragePath(component, ''), '');

  pinRegistryUpdate(name, component, {
    path: oldPin.path || relativePath,
    cache: newCache,
  });

  return localPath;
};

export const pinDownload = (path, { ...args }) => {
  // TODO: path can be an array
  const localPath = pinDownloadOne(path, args);

  return localPath;
};
