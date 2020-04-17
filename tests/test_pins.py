import pytest
import os
import pins

def test_board_list_default():
    assert all([a == b for a, b in zip(pins.board_list(), ["local", "packages"])])

def test_sources():
    template = os.path.join(pins.__path__[0], 'js', 'pins.js')
    assert os.path.exists(template)
