import pins
import pytest
import os

board_tests = [
    ("local"),
    ("s3"),
    ("rsconnect"),
]

def configuration_test(board):
    return {
        "text_file_path": "fixtures/" + board + "/files/hello.txt"
    }

@pytest.mark.parametrize("board", board_tests)
def test_initialize_test(board):
    config = configuration_test(board)

    os.makedirs("fixtures/" + board + "/files", exist_ok=True)

    out_file = open(config["text_file_path"], "w")
    out_file.writelines(["hello world"])
    out_file.close()
