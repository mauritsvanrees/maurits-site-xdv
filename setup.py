from setuptools import setup, find_packages

version = '1.0dev'

setup(name='mauritsresources',
      version=version,
      description="Resources for maurits.vanrees.org website",
      long_description=("Resources for maurits.vanrees.org website, using "
                        "fanstatic"),
      classifiers=[],
      keywords='',
      author='Maurits van Rees',
      author_email='maurits@vanrees.org',
      url='http://maurits.vanrees.org/',
      license='BSD',
      packages=find_packages('src'),
      package_dir={'': 'src'},
      include_package_data=True,
      zip_safe=False,
      install_requires=[
        'fanstatic',
        'PasteDeploy',
        'WSGIFilter',
      ],
      entry_points={
        'fanstatic.libraries': [
            'maurits = mauritsresources:maurits_library',
            ],
        'paste.filter_app_factory': [
            'filter = mauritsresources:ResourceFilter.paste_deploy_middleware',
            ],
        },
      )
