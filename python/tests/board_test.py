import pins
import os
import tempfile
import shutil
import pathlib
import pytest

boardTests = [
    ("local"),
]


@pytest.mark.parametrize("board", boardTests)
def test_timedistance_v0(board):
    assert True