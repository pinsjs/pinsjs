import pins

def _callback_dir_create(path):
  return False

def _callback_dir_exists(path):
  return False

def _callback_dir_list(path):
  return []

def _callback_dir_remove(path):
  return False

def _callback_dir_zip(path, zip, common_path):
  return False

def _callback_temp_file():
  return ""

def _callback_read_lines(path):
  return [""]

def _callback_write_lines(path, content):
  return False;

def _callback_basename(path):
  return ""

def _callback_board_register_code(board, name):
  return ""

def _callback_ui_viewer_registered(board, name):
  return False

def _callback_user_cache_dir(name):
  return "pins/" + name.value;

def _callback_pin_log(message):
  print(message.value)

def _callback_tests(option):
  options = {
    "pins.board": "memory",
    "pins.path": "",
    "pins.verbose": True
  }
  return options[option.value]

def _callback_file_write(object, path):
  return False

def _callback_file_read(path):
  return None

def _callback_file_path(path1, path2):
  return path1 + "/" + path2

def _callback_file_exists(path):
  return False

def _callback_file_copy(source, to, recursive):
  return False

def _callback_create_link(source, to):
  return False

def _callback_file_size(path):
  return False

def init_callbacks():
  pins.callbacks_set("dirCreate", _callback_dir_create)
  pins.callbacks_set("dirExists", _callback_dir_exists)
  pins.callbacks_set("dirList", _callback_dir_list)
  pins.callbacks_set("dirRemove", _callback_dir_remove)
  pins.callbacks_set("dirZip", _callback_dir_zip)

  pins.callbacks_set("tempfile", _callback_temp_file)

  pins.callbacks_set("readLines", _callback_read_lines)
  pins.callbacks_set("writeLines", _callback_write_lines)

  pins.callbacks_set("basename", _callback_basename)

  pins.callbacks_set("boardRegisterCode", _callback_board_register_code)

  pins.callbacks_set("uiViewerRegister", _callback_ui_viewer_registered)

  pins.callbacks_set("userCacheDir", _callback_user_cache_dir)

  pins.callbacks_set("pinLog", _callback_pin_log)

  pins.callbacks_set("getOption", _callback_tests)

  pins.callbacks_set("fileWrite", _callback_file_write)
  pins.callbacks_set("fileRead", _callback_file_read)
  pins.callbacks_set("filePath", _callback_file_path)
  pins.callbacks_set("fileExists", _callback_file_exists)
  pins.callbacks_set("fileCopy", _callback_file_copy)

  pins.callbacks_set("createLink", _callback_create_link)

  pins.callbacks_set("fileSize", _callback_file_size)
