import pins
import tempfile
import pytest
import random
import os

board_tests = [
    ("local"),
    ("s3"),
]

random_file_index = random.randint(1, 1000)
temp_file = tempfile.TemporaryDirectory().name

pin_name = 'afile' + str(random_file_index)
dataset_name = 'adataset' + str(random_file_index)

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

    assert True

@pytest.mark.parametrize("board", board_tests)
def test_initialize_board_local(board):
    if (board == "local"):
        pins.board_register(board, cache = os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000))));
    elif (board == "s3"):
        testS3Bucket = os.environ['AWS_BUCKET'];
        testS3Key = os.environ['AWS_KEY'];
        testS3Secret = os.environ['AWS_SECRET'];

        pins.board_register(
            board,
            bucket = testS3Bucket,
            key = testS3Key,
            secret = testS3Secret,
            versions = False,
            cache = os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000))));
    else:
        assert False

@pytest.mark.parametrize("board", board_tests)
def test_can_pin_file(board):
    config = configuration_test(board)

    if (board == "s3"):
        return # NYI

    assert os.path.isfile(config["text_file_path"])

    cached_path = pins.pin(config["text_file_path"], name=pin_name, board=board)

    assert len(cached_path) > 0

    in_file = open(config["text_file_path"], "r")
    lines = in_file.readlines()
    in_file.close()

    assert lines == ['hello world'];
