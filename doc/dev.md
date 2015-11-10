# Developers' Draft

- static server with
  - routers

- live reload
  - patch live reload seed to a specific file
  - the seed could
    - reload css files without refreshing the page
    - refresh the page if any javascript file changes
    - connect to dev server to receive reload signals
  - restful api to let other modules to tell dev server if any file changes.