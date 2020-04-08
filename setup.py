from setuptools import setup, find_packages
from os import path
from io import open

here = path.abspath(path.dirname(__file__))

setup(
    name = 'pins',
    version = '0.0.1',
    description = 'Pin, discover, and share resources',
    url='https://github.com/mlverse/pypins',
    author='The Python Packaging Authority', 
    author_email='javier@rstudio.com',
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Topic :: Software Development :: Build Tools',
        'License :: OSI Approved :: Apache 2.0',

        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
    ],

    keywords='data management cloud caching',

    package_dir={'': 'src'},

    packages=find_packages(where='src'),

    python_requires='>=2.7, !=3.0.*, !=3.1.*, !=3.2.*, !=3.3.*, !=3.4.*, <4',

    install_requires=[
        'js2py>=0.68'
    ],

    extras_require={
        'dev': [
            'pytest>=2.0.0',
            'twine>=3.1.1'
        ],
        'test': [
            'pytest>=2.0.0'
        ],
    },

    package_data={  # Optional
        'pins': ['js/pins.js'],
    },

    project_urls={  # Optional
        'Bug Reports': 'https://github.com/mlverse/pins/issues',
        'Source': 'https://github.com/mlverse/pins/',
    },
)