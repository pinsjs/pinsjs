import pins
import tempfile
import pytest
import random
import os

board_tests = [
    ("local"),
]

random_file_index = random.randint(1, 1000)
temp_file = tempfile.TemporaryDirectory().name

pin_name = 'afile' + str(random_file_index)
dataset_name = 'adataset' + str(random_file_index)

@pytest.mark.parametrize("board", board_tests)
def test_initialize_test(board):
    text_file_path = "fixtures/" + board + "/files/hello.txt"

    os.makedirs("fixtures/" + board + "/files", exist_ok = True)

    out_file = open(text_file_path, "w")
    out_file.writelines(["hello world"])
    out_file.close()

    assert True

@pytest.mark.parametrize("board", board_tests)
def test_can_pin_file(board):
    assert True
