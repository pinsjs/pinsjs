
# Contributing

```bash
# build
cp ../js/dist/pins.js src/pins/js/

# install pins and dependencies
pip install -e .[dev]

# run tests
pytest

# create wheel
python3 setup.py egg_info
python3 setup.py sdist bdist_wheel

# install wheel
pip3 install dist/pins-0.0.1.tar.gz

# test wheel
python3 -m twine upload --repository-url https://test.pypi.org/legacy/ dist/*
python3 -m pip install --index-url https://test.pypi.org/simple/ --no-deps pins
```