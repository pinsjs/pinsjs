import pytest
import os
import pins

def assert_array_equals(value, expected):
  assert all([a == b for a, b in zip(value, expected)])

def test_sources():
  template = os.path.join(pins.__path__[0], "js", "pins.js")
  assert os.path.exists(template)

def test_board_list_default():
  assert_array_equals(pins.board_list(), ["local", "packages"])

def _callback_tests(option):
  options = {
      "pins.board": "memory"
  }
  return options[option.value]

def test_callbacks():
  pins.callbacks_set("getOption", _callback_tests)
  assert_array_equals(pins.board_list(), ["local", "packages", "memory"])
  pins.callbacks_set("getOption", None)
