Theming my personal website
===========================

The main goal of this code is to theme my own personal website:
http://maurits.vanrees.org/.  It may be a nice example of some python
web technologies though.

Do not take this as *the* way to do things.  There are lots of ways to
theme a website, lots of potentially helpful techniques and various
ways to use them.  This is just my way of doing things, which I am
discovering along the way.

So, what is in here?

- This code is a buildout, see the ``buildout.cfg`` file.  At the
  moment this only sets up a ``bin/paster`` script with all the
  necessary packages.  Feel free to use a virtualenv instead.

- The paster script can be used with the ``devel.ini`` or
  ``deploy.ini`` configuration files to fire up a Paste server.  The
  most important job of that server is to answer http requests with
  this pipeline:

  - fanstatic

  - mauritsresources

  - xdv

  - plone

- fanstatic_ is used to serve some static resources: css and
  javascript.  It makes them available at a unique url that can be
  cached indefinitely, making the load on the web server smaller while
  avoiding browsers using outdated resources.

- The resources are defined in the ``mauritsresources`` python
  package, which is bundled together with the rest of the code as it
  is very much tied to the rest.

- The xdv_ part is handled by `dv.xdvserver`_.  You define an html
  theme and an xslt rules file.  xdv then uses xslt to grab the html
  of some web server (Plone in my case) and stuffs it in the html
  theme.  This is a handy way to let themes be created by an html and
  css wizard who has no clue of what happens in the backend that the
  crazy programmers created.

- In my case the backend is a website created in Plone 2.5.  I might
  at some point upgrade this to Plone 3, 4 or 5, or convert this to
  Grok or to pyramid.  The html theme should not need many changes for
  this, if any.

- Oh, and there are some images in the ``static/`` directory, used by
  the html theme.

The idea is now that I configure Apache to proxy the requests to this
Paste server.  For editing the Plone Site I will either use a
different domain or set up an ssh tunnel.  I could define the theme
and the rules to allow editing through the Paste server, but I don't
want to.


Ideas to improve this setup are welcome.

Maurits van Rees

.. _fanstatic: http://fanstatic.org
.. _xdv: http://pypi.python.org/pypi/xdv
.. _`dv.xdvserver`: http://pypi.python.org/pypi/dv.xdvserver
