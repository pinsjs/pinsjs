'''
 Suite of test shared across all boards
'''

import pins
import random
import tempfile
import os

iris = [{"Sepal.Length":5.1,"Sepal.Width":3.5,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.9,"Sepal.Width":3,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.7,"Sepal.Width":3.2,"Petal.Length":1.3,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.6,"Sepal.Width":3.1,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.6,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.4,"Sepal.Width":3.9,"Petal.Length":1.7,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":4.6,"Sepal.Width":3.4,"Petal.Length":1.4,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.4,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.4,"Sepal.Width":2.9,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.9,"Sepal.Width":3.1,"Petal.Length":1.5,"Petal.Width":0.1,"Species":"setosa"},{"Sepal.Length":5.4,"Sepal.Width":3.7,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.8,"Sepal.Width":3.4,"Petal.Length":1.6,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.8,"Sepal.Width":3,"Petal.Length":1.4,"Petal.Width":0.1,"Species":"setosa"},{"Sepal.Length":4.3,"Sepal.Width":3,"Petal.Length":1.1,"Petal.Width":0.1,"Species":"setosa"},{"Sepal.Length":5.8,"Sepal.Width":4,"Petal.Length":1.2,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.7,"Sepal.Width":4.4,"Petal.Length":1.5,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":5.4,"Sepal.Width":3.9,"Petal.Length":1.3,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.5,"Petal.Length":1.4,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":5.7,"Sepal.Width":3.8,"Petal.Length":1.7,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.8,"Petal.Length":1.5,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":5.4,"Sepal.Width":3.4,"Petal.Length":1.7,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.7,"Petal.Length":1.5,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":4.6,"Sepal.Width":3.6,"Petal.Length":1,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.3,"Petal.Length":1.7,"Petal.Width":0.5,"Species":"setosa"},{"Sepal.Length":4.8,"Sepal.Width":3.4,"Petal.Length":1.9,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3,"Petal.Length":1.6,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.4,"Petal.Length":1.6,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":5.2,"Sepal.Width":3.5,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.2,"Sepal.Width":3.4,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.7,"Sepal.Width":3.2,"Petal.Length":1.6,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.8,"Sepal.Width":3.1,"Petal.Length":1.6,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.4,"Sepal.Width":3.4,"Petal.Length":1.5,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":5.2,"Sepal.Width":4.1,"Petal.Length":1.5,"Petal.Width":0.1,"Species":"setosa"},{"Sepal.Length":5.5,"Sepal.Width":4.2,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.9,"Sepal.Width":3.1,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.2,"Petal.Length":1.2,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.5,"Sepal.Width":3.5,"Petal.Length":1.3,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.9,"Sepal.Width":3.6,"Petal.Length":1.4,"Petal.Width":0.1,"Species":"setosa"},{"Sepal.Length":4.4,"Sepal.Width":3,"Petal.Length":1.3,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.4,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.5,"Petal.Length":1.3,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":4.5,"Sepal.Width":2.3,"Petal.Length":1.3,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":4.4,"Sepal.Width":3.2,"Petal.Length":1.3,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.5,"Petal.Length":1.6,"Petal.Width":0.6,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.8,"Petal.Length":1.9,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":4.8,"Sepal.Width":3,"Petal.Length":1.4,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.8,"Petal.Length":1.6,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.6,"Sepal.Width":3.2,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.3,"Sepal.Width":3.7,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.3,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":7,"Sepal.Width":3.2,"Petal.Length":4.7,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":6.4,"Sepal.Width":3.2,"Petal.Length":4.5,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":6.9,"Sepal.Width":3.1,"Petal.Length":4.9,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":5.5,"Sepal.Width":2.3,"Petal.Length":4,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.5,"Sepal.Width":2.8,"Petal.Length":4.6,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":5.7,"Sepal.Width":2.8,"Petal.Length":4.5,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.3,"Sepal.Width":3.3,"Petal.Length":4.7,"Petal.Width":1.6,"Species":"versicolor"},{"Sepal.Length":4.9,"Sepal.Width":2.4,"Petal.Length":3.3,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":6.6,"Sepal.Width":2.9,"Petal.Length":4.6,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":5.2,"Sepal.Width":2.7,"Petal.Length":3.9,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":5,"Sepal.Width":2,"Petal.Length":3.5,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":5.9,"Sepal.Width":3,"Petal.Length":4.2,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":6,"Sepal.Width":2.2,"Petal.Length":4,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":6.1,"Sepal.Width":2.9,"Petal.Length":4.7,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":5.6,"Sepal.Width":2.9,"Petal.Length":3.6,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.7,"Sepal.Width":3.1,"Petal.Length":4.4,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":5.6,"Sepal.Width":3,"Petal.Length":4.5,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":5.8,"Sepal.Width":2.7,"Petal.Length":4.1,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":6.2,"Sepal.Width":2.2,"Petal.Length":4.5,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":5.6,"Sepal.Width":2.5,"Petal.Length":3.9,"Petal.Width":1.1,"Species":"versicolor"},{"Sepal.Length":5.9,"Sepal.Width":3.2,"Petal.Length":4.8,"Petal.Width":1.8,"Species":"versicolor"},{"Sepal.Length":6.1,"Sepal.Width":2.8,"Petal.Length":4,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.3,"Sepal.Width":2.5,"Petal.Length":4.9,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":6.1,"Sepal.Width":2.8,"Petal.Length":4.7,"Petal.Width":1.2,"Species":"versicolor"},{"Sepal.Length":6.4,"Sepal.Width":2.9,"Petal.Length":4.3,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.6,"Sepal.Width":3,"Petal.Length":4.4,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":6.8,"Sepal.Width":2.8,"Petal.Length":4.8,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":6.7,"Sepal.Width":3,"Petal.Length":5,"Petal.Width":1.7,"Species":"versicolor"},{"Sepal.Length":6,"Sepal.Width":2.9,"Petal.Length":4.5,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":5.7,"Sepal.Width":2.6,"Petal.Length":3.5,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":5.5,"Sepal.Width":2.4,"Petal.Length":3.8,"Petal.Width":1.1,"Species":"versicolor"},{"Sepal.Length":5.5,"Sepal.Width":2.4,"Petal.Length":3.7,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":5.8,"Sepal.Width":2.7,"Petal.Length":3.9,"Petal.Width":1.2,"Species":"versicolor"},{"Sepal.Length":6,"Sepal.Width":2.7,"Petal.Length":5.1,"Petal.Width":1.6,"Species":"versicolor"},{"Sepal.Length":5.4,"Sepal.Width":3,"Petal.Length":4.5,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":6,"Sepal.Width":3.4,"Petal.Length":4.5,"Petal.Width":1.6,"Species":"versicolor"},{"Sepal.Length":6.7,"Sepal.Width":3.1,"Petal.Length":4.7,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":6.3,"Sepal.Width":2.3,"Petal.Length":4.4,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":5.6,"Sepal.Width":3,"Petal.Length":4.1,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":5.5,"Sepal.Width":2.5,"Petal.Length":4,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":5.5,"Sepal.Width":2.6,"Petal.Length":4.4,"Petal.Width":1.2,"Species":"versicolor"},{"Sepal.Length":6.1,"Sepal.Width":3,"Petal.Length":4.6,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":5.8,"Sepal.Width":2.6,"Petal.Length":4,"Petal.Width":1.2,"Species":"versicolor"},{"Sepal.Length":5,"Sepal.Width":2.3,"Petal.Length":3.3,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":5.6,"Sepal.Width":2.7,"Petal.Length":4.2,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":5.7,"Sepal.Width":3,"Petal.Length":4.2,"Petal.Width":1.2,"Species":"versicolor"},{"Sepal.Length":5.7,"Sepal.Width":2.9,"Petal.Length":4.2,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.2,"Sepal.Width":2.9,"Petal.Length":4.3,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":5.1,"Sepal.Width":2.5,"Petal.Length":3,"Petal.Width":1.1,"Species":"versicolor"},{"Sepal.Length":5.7,"Sepal.Width":2.8,"Petal.Length":4.1,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.3,"Sepal.Width":3.3,"Petal.Length":6,"Petal.Width":2.5,"Species":"virginica"},{"Sepal.Length":5.8,"Sepal.Width":2.7,"Petal.Length":5.1,"Petal.Width":1.9,"Species":"virginica"},{"Sepal.Length":7.1,"Sepal.Width":3,"Petal.Length":5.9,"Petal.Width":2.1,"Species":"virginica"},{"Sepal.Length":6.3,"Sepal.Width":2.9,"Petal.Length":5.6,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.5,"Sepal.Width":3,"Petal.Length":5.8,"Petal.Width":2.2,"Species":"virginica"},{"Sepal.Length":7.6,"Sepal.Width":3,"Petal.Length":6.6,"Petal.Width":2.1,"Species":"virginica"},{"Sepal.Length":4.9,"Sepal.Width":2.5,"Petal.Length":4.5,"Petal.Width":1.7,"Species":"virginica"},{"Sepal.Length":7.3,"Sepal.Width":2.9,"Petal.Length":6.3,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.7,"Sepal.Width":2.5,"Petal.Length":5.8,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":7.2,"Sepal.Width":3.6,"Petal.Length":6.1,"Petal.Width":2.5,"Species":"virginica"},{"Sepal.Length":6.5,"Sepal.Width":3.2,"Petal.Length":5.1,"Petal.Width":2,"Species":"virginica"},{"Sepal.Length":6.4,"Sepal.Width":2.7,"Petal.Length":5.3,"Petal.Width":1.9,"Species":"virginica"},{"Sepal.Length":6.8,"Sepal.Width":3,"Petal.Length":5.5,"Petal.Width":2.1,"Species":"virginica"},{"Sepal.Length":5.7,"Sepal.Width":2.5,"Petal.Length":5,"Petal.Width":2,"Species":"virginica"},{"Sepal.Length":5.8,"Sepal.Width":2.8,"Petal.Length":5.1,"Petal.Width":2.4,"Species":"virginica"},{"Sepal.Length":6.4,"Sepal.Width":3.2,"Petal.Length":5.3,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":6.5,"Sepal.Width":3,"Petal.Length":5.5,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":7.7,"Sepal.Width":3.8,"Petal.Length":6.7,"Petal.Width":2.2,"Species":"virginica"},{"Sepal.Length":7.7,"Sepal.Width":2.6,"Petal.Length":6.9,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":6,"Sepal.Width":2.2,"Petal.Length":5,"Petal.Width":1.5,"Species":"virginica"},{"Sepal.Length":6.9,"Sepal.Width":3.2,"Petal.Length":5.7,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":5.6,"Sepal.Width":2.8,"Petal.Length":4.9,"Petal.Width":2,"Species":"virginica"},{"Sepal.Length":7.7,"Sepal.Width":2.8,"Petal.Length":6.7,"Petal.Width":2,"Species":"virginica"},{"Sepal.Length":6.3,"Sepal.Width":2.7,"Petal.Length":4.9,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.7,"Sepal.Width":3.3,"Petal.Length":5.7,"Petal.Width":2.1,"Species":"virginica"},{"Sepal.Length":7.2,"Sepal.Width":3.2,"Petal.Length":6,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.2,"Sepal.Width":2.8,"Petal.Length":4.8,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.1,"Sepal.Width":3,"Petal.Length":4.9,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.4,"Sepal.Width":2.8,"Petal.Length":5.6,"Petal.Width":2.1,"Species":"virginica"},{"Sepal.Length":7.2,"Sepal.Width":3,"Petal.Length":5.8,"Petal.Width":1.6,"Species":"virginica"},{"Sepal.Length":7.4,"Sepal.Width":2.8,"Petal.Length":6.1,"Petal.Width":1.9,"Species":"virginica"},{"Sepal.Length":7.9,"Sepal.Width":3.8,"Petal.Length":6.4,"Petal.Width":2,"Species":"virginica"},{"Sepal.Length":6.4,"Sepal.Width":2.8,"Petal.Length":5.6,"Petal.Width":2.2,"Species":"virginica"},{"Sepal.Length":6.3,"Sepal.Width":2.8,"Petal.Length":5.1,"Petal.Width":1.5,"Species":"virginica"},{"Sepal.Length":6.1,"Sepal.Width":2.6,"Petal.Length":5.6,"Petal.Width":1.4,"Species":"virginica"},{"Sepal.Length":7.7,"Sepal.Width":3,"Petal.Length":6.1,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":6.3,"Sepal.Width":3.4,"Petal.Length":5.6,"Petal.Width":2.4,"Species":"virginica"},{"Sepal.Length":6.4,"Sepal.Width":3.1,"Petal.Length":5.5,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6,"Sepal.Width":3,"Petal.Length":4.8,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.9,"Sepal.Width":3.1,"Petal.Length":5.4,"Petal.Width":2.1,"Species":"virginica"},{"Sepal.Length":6.7,"Sepal.Width":3.1,"Petal.Length":5.6,"Petal.Width":2.4,"Species":"virginica"},{"Sepal.Length":6.9,"Sepal.Width":3.1,"Petal.Length":5.1,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":5.8,"Sepal.Width":2.7,"Petal.Length":5.1,"Petal.Width":1.9,"Species":"virginica"},{"Sepal.Length":6.8,"Sepal.Width":3.2,"Petal.Length":5.9,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":6.7,"Sepal.Width":3.3,"Petal.Length":5.7,"Petal.Width":2.5,"Species":"virginica"},{"Sepal.Length":6.7,"Sepal.Width":3,"Petal.Length":5.2,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":6.3,"Sepal.Width":2.5,"Petal.Length":5,"Petal.Width":1.9,"Species":"virginica"},{"Sepal.Length":6.5,"Sepal.Width":3,"Petal.Length":5.2,"Petal.Width":2,"Species":"virginica"},{"Sepal.Length":6.2,"Sepal.Width":3.4,"Petal.Length":5.4,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":5.9,"Sepal.Width":3,"Petal.Length":5.1,"Petal.Width":1.8,"Species":"virginica"}]

def random_file_index():
  return str(random.randint(1, 1000))

def initialize_board(board, versions):
  if (board == "local"):
    cache = os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000)))
    pins.board_register(board, cache = cache, versions = versions);
  elif (board == "s3"):
    testS3Bucket = os.environ['AWS_BUCKET']
    testS3Key = os.environ['AWS_KEY']
    testS3Secret = os.environ['AWS_SECRET']

    pins.board_register(
      board,
      bucket = testS3Bucket,
      key = testS3Key,
      secret = testS3Secret,
      versions = False,
      cache = os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000)))
    );
  elif (board == "rsconnect"):
    testRSConnectServer = os.environ['RSCONNECT_SERVER']
    testRSConnectKey = os.environ['RSCONNECT_KEY']

    pins.board_register(
      board,
      key = testRSConnectKey,
      server = testRSConnectServer,
      versions = False,
      cache = os.path.join(tempfile.gettempdir(), str(random.randint(1, 100000)))
    );

class BoardDefaultSuite:

  def __init__(self, board, exclude):
    self.board = board
    self.exclude = exclude
    self.text_file_path = "fixtures/local/files/hello.txt"

    self.read_lines = pins.callbacks_get("readLines")

    self.pin_name = "afile" + random_file_index()
    self.dataset_name = "adataset" + random_file_index()

  def test_register_board(self):
    initialize_board(self.board, False)
    assert self.board in pins.board_list()

  def test_pin_file(self):
    cached_path = pins.pin(
      self.text_file_path,
      name = self.pin_name,
      board = self.board
    )
    cached_data = self.read_lines(cached_path)

    assert len(cached_path) > 0
    assert len(cached_data) == 1
    assert cached_data[0] == "hello world"

  def test_pin_dataframe(self):
    cached_data = pins.pin(
      iris,
      name = self.dataset_name,
      board = self.board
    )

    for idx, x in enumerate(cached_data):
      assert sorted(x.items()) == sorted(iris[idx].items())

  def test_pin_get(self):
    cached_path = pins.pin_get(self.pin_name, board = self.board)
    assert type(str(cached_path[0])) == str

    cached_data = self.read_lines(cached_path[0])
    assert len(cached_data) == 1
    assert cached_data[0] == "hello world"

  def test_pin_find(self):
    results = pins.pin_find(self.dataset_name, board = self.board)

    names = list(map(lambda r: r["name"], results))

    assert len(names) == 1
    assert self.dataset_name in names[0]

  def test_pin_info(self):
    info = pins.pin_info(self.pin_name, board = self.board)

    assert self.pin_name in info["name"]
    assert info["board"] == self.board

  def test_pin_with_custom_metadata(self):
    name = "iris-metadata"
    source = "The R programming language"

    pins.pin(iris,
      name = name,
      board = self.board,
      metadata = {
        "source": source,
        "columns": [
          { "name": "Species", "description": "Really like this column" },
          { "name": "Sepal.Length", "description": "Sepal Length" },
          { "name": "Sepal.Width", "description": "Sepal Width" },
          { "name": "Petal.Length", "description": "Petal Length" },
          { "name": "Petal.Width", "description": "Petal Width" },
        ]
      }
    )

    info = pins.pin_info(name, board = self.board, metadata = True)

    assert name in info["name"]
    assert info["source"] == source
    assert len(info["columns"]) == 5
    assert info["columns"][0]["name"] == "Species"

    pins.pin_remove(name, self.board)

  def test_pin_remove(self):
    if "remove" in self.exclude:
      return True

    result = pins.pin_remove(self.pin_name, self.board)
    assert result is None

    results = pins.pin_find(self.pin_name, board = self.board)
    assert len(results) == 0

  def test_pin_remove_dataset(self):
    if "remove" in self.exclude:
      return True

    result = pins.pin_remove(self.dataset_name, self.board)
    assert result is None

    results = pins.pin_find(self.dataset_name, board = self.board)
    assert len(results) == 0

class BoardVersionsSuite:

  def __init__(self, board, exclude):
    self.board = board
    self.exclude = exclude
    self.pin_version_name = "aversion" + random_file_index()

  def test_register_board_version(self):
    initialize_board(self.board, True)
    assert self.board in pins.board_list()

  def test_pin_version(self):
    va = [1, 2, 3]
    vb = [11, 12, 13]

    pins.pin(va, name = self.pin_version_name, board = self.board)
    pins.pin(vb, name = self.pin_version_name, board = self.board)

    versions = pins.pin_versions(self.pin_version_name, board = self.board)

    assert len(versions["version"]) == 2

    pin1 = pins.pin_get(self.pin_version_name, board = self.board, version = versions["version"][0])
    pin2 = pins.pin_get(self.pin_version_name, board = self.board, version = versions["version"][1])

    assert pin1 == vb
    assert pin2 == va

  def test_pin_remove_version(self):
    if "remove" in self.exclude:
      return True

    result = pins.pin_remove(self.pin_version_name, self.board)
    assert result is None

    results = pins.pin_find(self.pin_version_name, board = self.board)
    assert len(results) == 0
