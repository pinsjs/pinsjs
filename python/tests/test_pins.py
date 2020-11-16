import pytest
import os
import pins
import helpers

def assert_array_equals(value, expected):
  assert all([a == b for a, b in zip(value, expected)])

def test_sources():
  template = os.path.join(pins.__path__[0], "js", "pins.js")
  assert os.path.exists(template)

def test_callbacks():
  # TODO: test callbacks
  return True

def test_board_register_temp():
  board = pins.board_register("local", { "name": "temp", "cache": "python/temp" })
  assert board == "temp"
  assert_array_equals(pins.board_list(), ["local", "temp"])

def test_board():
  for board in ["local"]:
    test_suite_default = helpers.BoardDefaultSuite(board, [])
    #test_suite_default.can_pin_file()
    #test_suite_default.can_pin_dataframe()
    #test_suite_default.can_pin_get()
    #test_suite_default.can_pin_find()
    #test_suite_default.can_pin_info()
    #test_suite_default.can_pin_remove()
    #test_suite_default.can_pin_remove_dataset()
    #test_suite_default.can_pin_with_custom_metadata()

    test_suite_versions = helpers.BoardVersionsSuite(board, [])
    #test_suite_versions.can_pin_version()
    #test_suite_versions.can_pin_remove_version()
