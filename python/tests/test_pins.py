import pytest
import os
import pins
import helpers

def assert_array_equals(value, expected):
  assert all([a == b for a, b in zip(value, expected)])

def test_sources():
  template = os.path.join(pins.__path__[0], "js", "pins.js")
  assert os.path.exists(template)

def test_board_list_default():
  assert_array_equals(pins.board_list(), ["local", "memory"])

def test_callbacks():
  assert_array_equals(pins.board_list(), ["local", "memory"])

def test_board_register_temp():
  board = pins.board_register("local", name = "temp", cache = "temp-path")
  assert board == "temp"
  assert_array_equals(pins.board_list(), ["temp", "local", "memory"])

board_suite = helpers.BoardDefaultSuite("local", [])

def test_can_pin_file():
  board_suite.can_pin_file()
