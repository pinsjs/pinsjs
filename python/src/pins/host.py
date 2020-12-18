import pins
import os
import tempfile
import shutil
import pathlib
import sys
import platform
import random
import requests
import tarfile
import hashlib
import hmac
import struct
import base64
import yaml
import json

def _callback_dir_create(path):
  return os.makedirs(path.value)

def _callback_dir_exists(path):
  return os.path.isdir(path.value)

def _callback_dir_list(path, recursive, fullNames):
  files = []
  if recursive:
    for root, dirs, fls in os.walk(path.value):
      for fl in fls:
        if fullNames:
          files.append(os.path.join(root, fl))
        else:
          files.append(fl)
  else:
    files = os.listdir(path.value)
    return list(map(lambda x: os.path.join(path.value, x), files))

  return files

def _callback_dir_remove(path):
  if os.path.isdir(path.value):
    return shutil.rmtree(path.value)
  else:
    return os.remove(path.value)

def _callback_dir_zip(path, name):
  tar_path = os.path.join(tempfile.gettempdir(), os.path.basename(name.value))
  tar = tarfile.open(tar_path, "w:gz")

  tar.add(path.value, arcname="")
  tar.close()

  return tar_path

def _callback_temp_file():
  return os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000)))

def _callback_read_lines(path):
  file = open(path.value, "r")
  lines = file.read().splitlines()
  file.close()
  return lines

def _callback_write_lines(path, content):
  file = open(path.value, "w")
  for line in content.to_list():
    line = str(line.value) + "\n"
    file.write(line)
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
    "pins.debug": False
  }

  if option.value in options.keys():
    return options[option.value]
  else:
    return "";

def _callback_file_write(object, path):
  file = open(path.value, "w")
  file.write(object.value)
  file.close()

def _callback_file_read(path):
  extension = os.path.splitext(path.value)[1]
  if extension == ".gz":
    return path.value
  else:
    file = open(path.value, "r")
    result = file.read()
    file.close()
    return result

def _callback_file_path(path1, path2):
  return os.path.join(path1.value, path2.value)

def _callback_file_exists(path):
  return os.path.isfile(path.value)

def _callback_file_copy(source, to, recursive):
  if isinstance(source, list):
    source = list(map(lambda x: x.value, source.value))

  if type(source).__name__ == "PyJsArray":
    source = source.to_list()

  if not isinstance(source, list):
    if not os.path.isdir(source.value) and not os.path.isfile(source.value):
      raise Exception("The path " + source.value + " <" + type(source).__name__ + "> " + " is not a file nor directory from " + os.getcwd())

  if not os.path.isdir(to.value):
    os.makedirs(to.value, exist_ok = True)

  def deep_copy(source, target):
    for src in os.listdir(source):
      basename = os.path.basename(src)
      full_src = os.path.join(source, basename)
      if os.path.isfile(full_src):
        shutil.copyfile(full_src, os.path.join(target, basename))
      elif recursive:
        full_trg = target if src in target else os.path.join(target, basename)
        if not os.path.isdir(full_trg):
          os.makedirs(full_trg, exist_ok = True)
        deep_copy(full_src, full_trg)

  if isinstance(source, list):
    for src in source:
      if os.path.isfile(src.value):
        shutil.copyfile(src.value, os.path.join(to.value, os.path.basename(src.value)))
      else:
        target = to.value if src.value in to.value else os.path.join(to.value, os.path.basename(src.value))
        if not os.path.isdir(target):
          os.makedirs(target, exist_ok = True)
        deep_copy(src.value, target)
  else:
    if os.path.isfile(source.value):
      shutil.copyfile(source.value, os.path.join(to.value, os.path.basename(source.value)))
    else:
      deep_copy(source.value, to.value)

def _callback_create_link(source, to):
  os.symlink(source.value, to.value)

def _callback_file_size(path):
  return pathlib.Path(path.value).stat().st_size

def _callback_supports_links():
  return False

def _callback_env(name):
  return os.environ.get(str(name), "")

def _callback_fetch(url, args):
  method = str(args["method"].value)

  headers = {}
  for k in args["headers"]:
    headers[str(k.value)] = str(args["headers"][k].value)

  data = args["body"].value

  is_form_data = hasattr(headers, "Content-Type") and headers["Content-Type"] == "multipart/form-data"

  # TODO: consider moving this special case to JS
  if is_form_data:
    file = open(data, "rb")
    file_content = file.read()
    hash = hashlib.md5()
    hash.update(file_content)
    headers["X-Content-Checksum"] = hash.hexdigest()

  if method == "GET":
    r = requests.get(url.value, headers = headers)
  elif method == "POST":
    if is_form_data:
      files = (data, open(data, "rb"))
      r = requests.post(url.value, files = files, headers = headers)
    else:
      r = requests.post(url.value, data = data, headers = headers)
  elif method == "DELETE":
    r = requests.delete(url.value, headers = headers)
  elif method == "PUT":
    r = requests.put(url.value, data = data, headers = headers)
  elif method == "HEAD":
    r = requests.head(url.value, headers = headers)
  else:
    r = {}

  return r

def _callback_sha1(content, key):
  hash = hmac.new(key.value.encode(), content.value.encode(), hashlib.sha1)
  return base64.b64encode(hash.digest()).decode()

def _callback_md5(content):
  hash = hashlib.md5()
  hash.update(content.value.encode())
  return hash.hexdigest()

def _callback_yaml_safe_dump(encoded):
  data = json.loads(encoded.value)
  return yaml.safe_dump(data)

def _callback_yaml_safe_load(text):
  return yaml.safe_load(text.value)

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

  pins.callbacks_set("env", _callback_env)
  pins.callbacks_set("fetch", _callback_fetch)

  pins.callbacks_set("sha1", _callback_sha1)
  pins.callbacks_set("md5", _callback_md5)

  pins.callbacks_set("yamlSafeDump", _callback_yaml_safe_dump)
  pins.callbacks_set("yamlSafeLoad", _callback_yaml_safe_load)
