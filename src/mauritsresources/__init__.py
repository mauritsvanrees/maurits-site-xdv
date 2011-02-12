from fanstatic import Library, Resource
from wsgifilter import Filter

# Register our library:
maurits_library = Library('maurits', 'resources')

# Register our javascript files:
live_search = Resource(maurits_library, 'livesearch.js')

# Register our css files:
reset_css = Resource(maurits_library, 'reset.css')
text_css = Resource(maurits_library, 'text.css')
ninesixty = Resource(maurits_library, '960_simple.css')
maurits_css = Resource(maurits_library, 'maurits.css')


def need_all():
    # Make sure to use the correct order here, as the order we specify
    # here is the order in which the files get added to the html.
    for res in (live_search, reset_css, text_css, ninesixty, maurits_css):
        res.need()


class ResourceFilter(Filter):
    """Tell fanstatic we need our resources.
    """

    def filter(self, environ, headers, data):
        need_all()
        return data
