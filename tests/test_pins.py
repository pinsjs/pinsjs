# -*- coding: utf-8 -*-

import pytest
import os
import pins
from pins import fib

__author__ = "Javier Luraschi"
__copyright__ = "Javier Luraschi"
__license__ = "Apache 2.0"


def test_fib():
    assert fib(1) == 1
    assert fib(2) == 1
    assert fib(7) == 13
    with pytest.raises(AssertionError):
        fib(-10)

def test_sources():
    template = os.path.join(pins.__path__[0], 'js', 'pins.js')
    assert os.path.exists(template)
