import pytest
import os
import pins
import helpers

def test_sources():
  template = os.path.join(pins.__path__[0], "js", "pins.js")
  assert os.path.exists(template)

def test_board_register_temp():
  board = pins.board_register("local", name = "temp", cache = "temp")
  assert board == "temp"
  assert board in pins.board_list()

def test_board():
  for board in ["local", "s3"]:
    test_suite_default = helpers.BoardDefaultSuite(board, [])
    test_suite_default.test_register_board()
    test_suite_default.test_pin_file()
    test_suite_default.test_pin_dataframe()
    test_suite_default.test_pin_get()
    test_suite_default.test_pin_find()
    test_suite_default.test_pin_info()
    test_suite_default.test_pin_remove()
    test_suite_default.test_pin_remove_dataset()
    test_suite_default.test_pin_with_custom_metadata()

  for board in ["local"]:
    test_suite_versions = helpers.BoardVersionsSuite(board, [])
    test_suite_versions.test_register_board_version()
    test_suite_versions.test_pin_version()
    test_suite_versions.test_pin_remove_version()
