import pytest
import os
import pins

def test_sum():
    assert pins.sum(1, 3) == 4
    assert pins.sum(2, 5) == 7

def test_sources():
    template = os.path.join(pins.__path__[0], 'js', 'pins.js')
    assert os.path.exists(template)
