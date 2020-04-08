import argparse
import sys
import logging

from pins import __version__

_logger = logging.getLogger(__name__)

def fib(n):
    assert n > 0
    a, b = 1, 1
    for i in range(n-1):
        a, b = b, a+b
    return a

def setup_logging(loglevel):
    logformat = "[%(asctime)s] %(levelname)s:%(name)s:%(message)s"
    logging.basicConfig(level=loglevel, stream=sys.stdout,
                        format=logformat, datefmt="%Y-%m-%d %H:%M:%S")

def run():
    setup_logging(args.loglevel)
    _logger.debug("pins starting...")

if __name__ == "__main__":
    run()
