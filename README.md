# vedic-js
node.js library for Vedic Maths sutras. This library implements the vedic
maths sutras for performing basic mathematical operations like addition, subtraction, multiplication,
square roots, cube roots etc.

The library will also expose operations like factorial. This library can be used to
perform very large multiplications.

Since vedic maths sutras work on individual digits in a number as opposed to the
whole number, they can treat numbers as strings and hence not run into issues with storage
and computations on very large numbers.


## Addition
Two vedic numbers can be added using the **+** operator as follows. Addition
is performed using the L-R vedic sutra.

```javascript
const Vedic = require('../lib/vedic').Vedic;

console.log(Vedic.add(['123', '254', '267']));
```

For adding multiple numbers at a time, the API can be used as follows

```javascript
const Vedic = require('../lib/vedic').Vedic;

// Adding very long numbers
var result = Vedic.add(['8729874983749238742938472398472398472398472394723984239384723947392749848402984023948230948203842308423098423094823098420398402984203983423098498479472492374329472394729830980098201980219820918209180981098',
		'8729874983749238742938472398472398472398472394723984239384723947392749848402984023948230948203842308423098423094823098420398402984203983423098498479472492374329472394729830980098201980219820918209180981098',
		'17459749967498477485876944796944796944796944789447968478769447894785499696805968047896461896407684616846196846189646196840796805968407966846196996958944984748658944789459661960196403960439641836418361962196']);
		
console.log(result);		
```

## Subtraction
A vedic number can be subtracted from another vedic number. This uses the L-R vedic sutra.

```javascript
const Vedic = require('../lib/vedic').Vedic;

var result = Vedic.subtract('90008988', '28200009');
console.log(result);

// Bigger subtractions
console.log(Vedic.subtract('8729874983749238742938472398472398472398472394723984239384723947392749848402984023948230948203842308423098423094823098420398402984203983423098498479472492374329472394729830980098201980219820918209180981098123', '8729874983749238742938472398472398472398472394723984239384723947392749848402984023948230948203842308423098423094823098420398402984203983423098498479472492374329472394729830980098201980219820918209180981098'));
```

## Multiplication
Two vedic numbers can be multiplied using the * operator of javascript. The multiplication
is performed using Vertical-Crosswise sutra of vedic maths

```javascript
const Vedic = require('../lib/vedic').Vedic;

console.log(Vedic.multiply('45', '57'));

// Really large numbers
console.log(Vedic.multiply('68629335010652649695338856996888505082799258781159071602280830658069423538482865002531059244901433270522974099404725678', '4681792376906432202903607601716785597020499902587316420748476976419066198975454254254254278899'));
```


**P.S** - THIS LIBRARY IS STILL WIP



