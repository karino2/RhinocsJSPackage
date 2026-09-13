# JS Package for Rhinocs

This repository is the JS package for [Rhinocs](https://github.com/karino2/Rhinocs).
Use the same tag version of the one of Rhinocs.

## Download

Download RhinocsJS.zip file from [Releases](https://github.com/karino2/RhinocsJSPackage/releases) page.

Extract and put directory on device and specify that directory from Rhinocs M-x setup.


## init.js

init.js is the first file which Rhinocs load.
This file will be customized by every user.

## Development information

Good start point is reading builtins.js in assets folder in Rhinocs github.

[Rhinocs/app/src/main/assets/builtins.js at main · karino2/Rhinocs](https://github.com/karino2/Rhinocs/blob/main/app/src/main/assets/builtins.js)

## Custom commands

### Filer

Filer keybind is start from "C-x C-d"

- `C-x C-d r` register dir to filer
- `C-x C-d d` find dir then filke
- `C-x C-d f` find filr from last used dir
- `C-x C-h` find-file from history

### Calendar

`M-x calendar`

## SKK Submodule

SKK is submodule of this repository.

[karino2/RhinocsSKK: SKK port for Rhinocs](https://github.com/karino2/RhinocsSKK).

SKK is included in RhinocsJS.zip.