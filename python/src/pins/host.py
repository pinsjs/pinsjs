import pins
import os
import tempfile
import shutil
import pathlib
import sys
import platform
import random

def _callback_dir_create(path):
  return os.makedirs(path.value)

def _callback_dir_exists(path):
  return os.path.isdir(path.value)

def _callback_dir_list(path, recursive, fullNames):
  if fullNames:
    return map(lambda x: os.path.join(path, x), os.listdir(path.value))
  else:
    return os.listdir(path.value)

def _callback_dir_remove(path):
  return os.rmdir(path.value)

def _callback_dir_zip(path, zip, common_path):
  raise Exception("zip files not yet supported")

def _callback_temp_file():
  return os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000)))

def _callback_read_lines(path):
  file = open(path.value, "r")
  lines = file.readlines()
  file.close() 
  return lines

def _callback_write_lines(path, content):
  file = open(path.value, "w")
  lines = map(lambda x: str(x.value), content)
  file.writelines(lines)
  file.close()

def _callback_basename(path):
  return os.path.basename(path.value)

def _callback_board_register_code(board, name):
  return ""

def _callback_ui_viewer_registered(board, name):
  return False

def _callback_user_cache_dir(name):
  if platform.system() == "Darwin":
    return "~/AppData/local/" + name.value
  elif platform.system() == "Linux":
    return "~/.cache/" + name.value
  elif platform.system() == "Windows":
    return "C:\\Users\\AppData\\Local\\Cache\\" + name.value
  else:
    return "pins/"

def _callback_pin_log(message):
  print(message.value)
  sys.stdout.flush()
  log_file = open("pins.log", "a")
  log_file.write(message.value)
  log_file.write('\n')
  log_file.flush()
  log_file.close()

def _callback_tests(option):
  options = {
    "pins.board": "memory",
    "pins.path": "",
    "pins.verbose": True,
    "pins.debug": True
  }

  if option in options.keys():
    return options[option.value]
  else:
    return "";

def _callback_file_write(object, path):
  file = open(path.value, "w")
  file.write(str(object))
  file.close()

def _callback_file_read(path):
  raise Exception("binary reads not yet supported")

def _callback_file_path(path1, path2):
  return os.path.join(path1.value, path2.value)

def _callback_file_exists(path):
  return os.path.isfile(path.value)

def _callback_file_copy(source, to, recursive):
  if isinstance(source, list):
    source = map(lambda x: x.value, source.value) 

  if type(source).__name__ == "PyJsArray":
    source = source.to_list()

  if not isinstance(source, list):
    if not os.path.isdir(source.value) and not os.path.isfile(source.value):
      raise Exception("The path " + source.value + " <" + type(source).__name__ + "> " + " is not a file nor directory from " + os.getcwd())

  if not isinstance(source, list) and os.path.isfile(source.value):
    if os.path.isdir(to.value):
      shutil.copyfile(source.value, os.path.join(to.value, os.path.basename(source.value)))
    else:
      os.makedirs(to.value, { "exist_ok": True })
      shutil.copyfile(source.value, to.value)
  else:
    os.makedirs(to.value, { "exist_ok": True })

    if recursive and not isinstance(source, list):
      shutil.copyfile(source.value, os.path.join(to.value, os.path.basename(source.value)))
    else:
      if not isinstance(source, list):
        source = os.listdir(source.value)

      for file in source: 
        shutil.copyfile(file, os.path.join(to.value, os.path.basename(file)))

def _callback_create_link(source, to):
  os.symlink(source.value, to.value)

def _callback_file_size(path):
  return pathlib.Path(path.value).stat().st_size

def _callback_supports_links():
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

  pins.callbacks_set("supportsLinks", _callback_supports_links)
