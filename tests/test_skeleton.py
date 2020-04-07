# -*- coding: utf-8 -*-

import pytest
from pins.skeleton import fib

__author__ = "Javier Luraschi"
__copyright__ = "Javier Luraschi"
__license__ = "Apache 2.0"


def test_fib():
    assert fib(1) == 1
    assert fib(2) == 1
    assert fib(7) == 13
    with pytest.raises(AssertionError):
        fib(-10)
