import pytest
import os
import pins

def _callback_tests(option):
  options = {
    "pins.board": "memory",
    "pins.path": "",
    "pins.verbose": True
  }
  return options[option.value]

def _callback_user_cache_dir(name):
  return "pins/" + name.value;

def _callback_dir_exists(path):
  return False

def _callback_dir_create(path):
  return False

def _callback_board_register_code(board, name):
  return ""

def _callback_ui_viewer_registered(board, name):
  return False

def _callback_pin_log(message):
  print(message.value)

pins.callbacks_set("userCacheDir", _callback_user_cache_dir)
pins.callbacks_set("dirExists", _callback_dir_exists)
pins.callbacks_set("dirCreate", _callback_dir_create)
pins.callbacks_set("getOption", _callback_tests)
pins.callbacks_set("boardRegisterCode", _callback_board_register_code)
pins.callbacks_set("uiViewerRegister", _callback_ui_viewer_registered)
pins.callbacks_set("pinLog", _callback_pin_log)

def assert_array_equals(value, expected):
  assert all([a == b for a, b in zip(value, expected)])

def test_sources():
  template = os.path.join(pins.__path__[0], "js", "pins.js")
  assert os.path.exists(template)

def test_board_list_default():
  assert_array_equals(pins.board_list(), ["local", "packages"])

def test_callbacks():
  assert_array_equals(pins.board_list(), ["local", "packages", "memory"])

def test_board_register_temp():
  
  board = pins.board_register("local", name = "temp", cache = "temp-path")
  assert board == "temp"
  # assert_array_equals(pins.board_list(), ["local", "packages", "memory", "temp"])
