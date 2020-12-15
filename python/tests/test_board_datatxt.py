import pins
import tempfile
import random
import os

board = 'simpletxt'
url = 'https://raw.githubusercontent.com/mlverse/pins/pins-js/js/spec/fixtures/datatxt/data.txt'

def test_register_datatxt():
  cache = os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000)))
  pins.board_register('datatxt', { "name": board, "url": url, "cache": cache })

  assert board in pins.board_list()

def test_get_pin_datatxt():
  pin = pins.pin_get('iris', { "board": board })

  assert len(pin) == 151
  assert len(pin[0]) == 5

def test_find_pin_datatxt():
  pin = pins.pin_find('mtcars_expr', { "board": board, "metadata": True })

  print(pin)

  assert len(pin) == 1
  assert pin[0]["metadata"]["rows"] == 32
  assert pin[0]["metadata"]["cols"] == 11

  assert type(pin[0]["metadata"]["rows"]).__name__ == "int"
  assert type(pin[0]["metadata"]["cols"]).__name__ == "int"

def test_deregister_datatxt():
  pins.board_deregister(board)

  assert board not in pins.board_list()

def test_register_url_name_datatxt():
  cache = os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000)))
  name = pins.board_register(url, { "name": board, "cache": cache })

  assert name == board

  pins.board_deregister(name)

def test_register_url_noname_datatxt():
  cache = os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000)))
  name = pins.board_register(url, { "cache": cache })

  assert name == 'raw'

  pin = pins.pin_get('iris', { "board": url })

  assert len(pin) == 151
