import argparse
import sys
import os
import logging
import js2py

_logger = logging.getLogger(__name__)

def host_log(message):
    _logger.info(message)

def fib(n):
    global pins_fib
    return pins_fib(n)

def setup_logging(log_level):
    log_format = "[%(asctime)s] %(levelname)s:%(name)s %(message)s"
    logging.basicConfig(level=log_level, stream=sys.stdout,
                        format=log_format, datefmt="%Y-%m-%d %H:%M:%S")

def pins_configure():
    global _context
    global pins_fib

    setup_logging("INFO")
    _logger.debug("pins starting...")

    pins_path = os.path.join(__path__[0], 'js', 'pins.js')

    file = open(pins_path, mode = 'r')
    pins_source = file.read()
    file.close()

    _context = js2py.EvalJs({ 'host_log': host_log })
    pins_fib = _context.eval(pins_source)

pins_configure()