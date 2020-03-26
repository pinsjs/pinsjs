//' Custom Pins
//'
//' Family of functions meant to be used to implement custom pin extensions, not to be used by users.
//'
//' @param board The board to extended, retrieved with \code{board_get()}.
//' @param name The name of the pin.
//' @param path The path to store.
//' @param description The text patteren to find a pin.
//' @param type The type of pin being stored.
//' @param metadata A list containing additional metadata desecribing the pin.
//' @param ... Additional parameteres.
//'
//' @rdname custom-pins
//'
//' @export
//' @rdname custom-pins
function board_pin_store(board, path, name, description, type, metadata, extract = true) {
  let dotdotdot = Array.from(arguments);

  board = board_get(board)
  if (is.null(name)) name = gsub("[^a-zA-Z0-9]+", "_", tools__file_path_sans_ext(base__basename(path[0])))

  if (dotdotdot["cache"] === false) pin_reset_cache(board["name"], name);

  path = path.filter(e => !grepl("data\\.txt", e));

  store_path = tempfile()
  dir.create(store_path)
  on.exit(unlink(store_path, recursive = true))

  if (length(path) == 1 && grepl("^http", path)) {
    // attempt to download data.txt to enable public access to boards like rsconnect
    datatxt_path = file.path(path, "data.txt")
    local_path = pin_download(datatxt_path, name, board_default(), can_fail = true)
    if (!is.null(local_path)) {
      manifest = pin_manifest_get(local_path)
      path = base__paste(path, manifest["path"], sep = "/")
      extract = false
    }
  }

  for (single_path in path) {
    if (grepl("^http", single_path)) {
      single_path = pin_download(single_path,
                                  name,
                                  board_default(),
                                  extract = extract,
                                  dotdotdot)
    }

    if (dir.exists(single_path)) {
      base__file_copy(base__dir(single_path, full_names = true) , store_path, recursive = true)
    }
    else {
      base__file_copy(single_path, store_path, recursive = true)
    }
  }

  if (!pin_manifest_exists(store_path)) {
    metadata["description"] = description
    metadata["type"] = type

    pin_manifest_create(store_path, metadata, dir(store_path, recursive = true))
  }

  board_pin_create(board, store_path, name = name, metadata = metadata)

  ui_viewer_updated(board)

  invisible_maybe(pin_get(name, board["name"], dotdotdot))
}

function invisible_maybe(e) {
  if (base__get_option("pins.invisible", true))
    return base__invisible(e)
  else
    return e;
}
