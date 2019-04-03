# Node.js GraphViz Module

[![All Contributors](https://img.shields.io/badge/all_contributors-9-orange.svg?style=flat-square)](#contributors)

Copyright (C) 2010-2019 Gregoire Lejeune

* Sources : http://github.com/glejeune/node-graphviz

## DESCRIPTION

Interface to the GraphViz graphing tool

## SYNOPSIS

A basic example

```
var util = require('util'),
  graphviz = require('graphviz');

// Create digraph G
var g = graphviz.digraph("G");

// Add node (ID: Hello)
var n1 = g.addNode( "Hello", {"color" : "blue"} );
n1.set( "style", "filled" );

// Add node (ID: World)
g.addNode( "World" );

// Add edge between the two nodes
var e = g.addEdge( n1, "World" );
e.set( "color", "red" );

// Print the dot script
console.log( g.to_dot() );

// Set GraphViz path (if not in your path)
g.setGraphVizPath( "/usr/local/bin" );
// Generate a PNG output
g.output( "png", "test01.png" );
```

## INSTALLATION

```
$ npm install graphviz
```

You also need to install GraphViz[http://www.graphviz.org]

## DOCUMENTATION

Install node-jake[http://github.com/mde/node-jake] and dox[http://github.com/visionmedia/dox] then run

```
jake doc && open documentation.html
```

## AUTHORS

* Gregoire Lejeune (http://algorithmique.net)
* Mathieu Ravaux (http://mathieuravaux.com)

## LICENCES

Copyright (c) 2010 Gregoire Lejeune <gregoire.lejeune@free.fr>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="http://lejeun.es"><img src="https://avatars1.githubusercontent.com/u/15168?v=4" width="100px;" alt="Gregoire Lejeune"/><br /><sub><b>Gregoire Lejeune</b></sub></a><br /><a href="https://github.com/glejeune/node-graphviz/commits?author=glejeune" title="Code">💻</a> <a href="https://github.com/glejeune/node-graphviz/commits?author=glejeune" title="Documentation">📖</a> <a href="#example-glejeune" title="Examples">💡</a></td><td align="center"><a href="https://tinysubversions.com"><img src="https://avatars3.githubusercontent.com/u/266454?v=4" width="100px;" alt="Darius Kazemi"/><br /><sub><b>Darius Kazemi</b></sub></a><br /><a href="https://github.com/glejeune/node-graphviz/commits?author=dariusk" title="Code">💻</a></td><td align="center"><a href="https://github.com/SebastienElet"><img src="https://avatars0.githubusercontent.com/u/541937?v=4" width="100px;" alt="Sébastien ELET"/><br /><sub><b>Sébastien ELET</b></sub></a><br /><a href="https://github.com/glejeune/node-graphviz/commits?author=SebastienElet" title="Code">💻</a></td><td align="center"><a href="https://github.com/papandreou"><img src="https://avatars3.githubusercontent.com/u/373545?v=4" width="100px;" alt="Andreas Lind"/><br /><sub><b>Andreas Lind</b></sub></a><br /><a href="https://github.com/glejeune/node-graphviz/commits?author=papandreou" title="Code">💻</a></td><td align="center"><a href="http://www.blakmatrix.com"><img src="https://avatars3.githubusercontent.com/u/91209?v=4" width="100px;" alt="Farrin Reid"/><br /><sub><b>Farrin Reid</b></sub></a><br /><a href="https://github.com/glejeune/node-graphviz/commits?author=blakmatrix" title="Code">💻</a></td><td align="center"><a href="https://pahen.se"><img src="https://avatars3.githubusercontent.com/u/353888?v=4" width="100px;" alt="Patrik Henningsson"/><br /><sub><b>Patrik Henningsson</b></sub></a><br /><a href="https://github.com/glejeune/node-graphviz/commits?author=pahen" title="Code">💻</a></td><td align="center"><a href="https://github.com/pooriaazimi"><img src="https://avatars2.githubusercontent.com/u/814637?v=4" width="100px;" alt="Pooria Azimi"/><br /><sub><b>Pooria Azimi</b></sub></a><br /><a href="https://github.com/glejeune/node-graphviz/commits?author=pooriaazimi" title="Code">💻</a></td></tr><tr><td align="center"><a href="https://twitter.com/BridgeAR"><img src="https://avatars2.githubusercontent.com/u/8822573?v=4" width="100px;" alt="Ruben Bridgewater"/><br /><sub><b>Ruben Bridgewater</b></sub></a><br /><a href="https://github.com/glejeune/node-graphviz/commits?author=BridgeAR" title="Code">💻</a></td><td align="center"><a href="https://github.com/mathieuravaux"><img src="https://avatars1.githubusercontent.com/u/38495?v=4" width="100px;" alt="Mathieu Ravaux"/><br /><sub><b>Mathieu Ravaux</b></sub></a><br /><a href="https://github.com/glejeune/node-graphviz/commits?author=mathieuravaux" title="Code">💻</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
