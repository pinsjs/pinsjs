import argparse
import sys
import os
import logging
import js2py

import pins
import pins.host

_logger = logging.getLogger(__name__)

def host_log(message):
  _logger.info(message)

def setup_logging(log_level):
  log_format = "[%(asctime)s] %(levelname)s:%(name)s %(message)s"
  logging.basicConfig(level=log_level, stream=sys.stdout,
                      format=log_format, datefmt="%Y-%m-%d %H:%M:%S")

def pins_load_js(file):
  global _pins_lib
  pins_path = os.path.join(__path__[0], "js", file)

  file = open(pins_path, mode = "r")
  pins_source = file.read()
  file.close()

  _pins_lib = _context.eval(pins_source)

def pins_configure():
  global _context
  global _pins_lib

  setup_logging("INFO")
  _logger.debug("pins starting...")
  _context = js2py.EvalJs({ "host_log": host_log })

  pins_load_js("polyfills.js")
  pins_load_js("pins.js")

  host.init_callbacks()

def board_list():
  global _pins_lib
  return _pins_lib["boardList"]()

def board_register(board, name = None, cache = None, versions = None):
  global _pins_lib
  return _pins_lib["boardRegister"](board, { "name": name, "cache": cache, "versions": versions })

def callbacks_set(name, callback):
  global _pins_lib
  _pins_lib["callbacks"]["set"](name, callback);
  return True

def pin(x, name, board):
  global _pins_lib
  return _pins_lib["pin"](x, {"name": name, "board": board})

pins_configure()
