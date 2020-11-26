import pins
import tempfile
import pytest
import random
import os

board_tests = [
    ("local"),
    ("s3"),
    #("rsconnect"),
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

    assert True

@pytest.mark.parametrize("board", board_tests)
def test_initialize_board(board):
    if (board == "local"):
        cache = os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000)))
        pins.board_register(board, { "cache": cache });
    elif (board == "s3"):
        testS3Bucket = os.environ['AWS_BUCKET']
        testS3Key = os.environ['AWS_KEY']
        testS3Secret = os.environ['AWS_SECRET']

        pins.board_register(
            board, {
                "bucket": testS3Bucket,
                "key": testS3Key,
                "secret": testS3Secret,
                "versions": False,
                "cache": os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000)))
            });
    elif (board == "rsconnect"):
        testRSConnectServer = os.environ['RSCONNECT_SERVER']
        testRSConnectKey = os.environ['RSCONNECT_KEY']

        pins.board_register(
            board, {
                "key": testRSConnectKey,
                "server": testRSConnectServer,
                "versions": False,
                "cache": os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000)))
            });
    else:
        assert False

    assert board in pins.board_list()
