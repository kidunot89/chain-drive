(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react-transition-group'), require('react'), require('lodash'), require('animejs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react-transition-group', 'react', 'lodash', 'animejs'], factory) :
  (factory((global['Chain Drive'] = {}),global['react-transition-group'],global.React,global._,global.anime));
}(this, (function (exports,reactTransitionGroup,React,lodash,anime) { 'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;
  anime = anime && anime.hasOwnProperty('default') ? anime['default'] : anime;

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (err) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);

  		for (var key in from) {
  			if (hasOwnProperty.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (getOwnPropertySymbols) {
  			symbols = getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

  var ReactPropTypesSecret_1 = ReactPropTypesSecret;

  var printWarning = function() {};

  {
    var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};

    printWarning = function(text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
  }

  /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?Function} getStack Returns the component stack.
   * @private
   */
  function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
    {
      for (var typeSpecName in typeSpecs) {
        if (typeSpecs.hasOwnProperty(typeSpecName)) {
          var error;
          // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.
          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== 'function') {
              var err = Error(
                (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
              );
              err.name = 'Invariant Violation';
              throw err;
            }
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            printWarning(
              (componentName || 'React class') + ': type specification of ' +
              location + ' `' + typeSpecName + '` is invalid; the type checker ' +
              'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
              'You may have forgotten to pass an argument to the type checker ' +
              'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
              'shape all require an argument).'
            );

          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;

            var stack = getStack ? getStack() : '';

            printWarning(
              'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
            );
          }
        }
      }
    }
  }

  var checkPropTypes_1 = checkPropTypes;

  var printWarning$1 = function() {};

  {
    printWarning$1 = function(text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
  }

  function emptyFunctionThatReturnsNull() {
    return null;
  }

  var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
    /* global Symbol */
    var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

    /**
     * Returns the iterator method function contained on the iterable object.
     *
     * Be sure to invoke the function with the iterable as context:
     *
     *     var iteratorFn = getIteratorFn(myIterable);
     *     if (iteratorFn) {
     *       var iterator = iteratorFn.call(myIterable);
     *       ...
     *     }
     *
     * @param {?object} maybeIterable
     * @return {?function}
     */
    function getIteratorFn(maybeIterable) {
      var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
      if (typeof iteratorFn === 'function') {
        return iteratorFn;
      }
    }

    /**
     * Collection of methods that allow declaration and validation of props that are
     * supplied to React components. Example usage:
     *
     *   var Props = require('ReactPropTypes');
     *   var MyArticle = React.createClass({
     *     propTypes: {
     *       // An optional string prop named "description".
     *       description: Props.string,
     *
     *       // A required enum prop named "category".
     *       category: Props.oneOf(['News','Photos']).isRequired,
     *
     *       // A prop named "dialog" that requires an instance of Dialog.
     *       dialog: Props.instanceOf(Dialog).isRequired
     *     },
     *     render: function() { ... }
     *   });
     *
     * A more formal specification of how these methods are used:
     *
     *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
     *   decl := ReactPropTypes.{type}(.isRequired)?
     *
     * Each and every declaration produces a function with the same signature. This
     * allows the creation of custom validation functions. For example:
     *
     *  var MyLink = React.createClass({
     *    propTypes: {
     *      // An optional string or URI prop named "href".
     *      href: function(props, propName, componentName) {
     *        var propValue = props[propName];
     *        if (propValue != null && typeof propValue !== 'string' &&
     *            !(propValue instanceof URI)) {
     *          return new Error(
     *            'Expected a string or an URI for ' + propName + ' in ' +
     *            componentName
     *          );
     *        }
     *      }
     *    },
     *    render: function() {...}
     *  });
     *
     * @internal
     */

    var ANONYMOUS = '<<anonymous>>';

    // Important!
    // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
    var ReactPropTypes = {
      array: createPrimitiveTypeChecker('array'),
      bool: createPrimitiveTypeChecker('boolean'),
      func: createPrimitiveTypeChecker('function'),
      number: createPrimitiveTypeChecker('number'),
      object: createPrimitiveTypeChecker('object'),
      string: createPrimitiveTypeChecker('string'),
      symbol: createPrimitiveTypeChecker('symbol'),

      any: createAnyTypeChecker(),
      arrayOf: createArrayOfTypeChecker,
      element: createElementTypeChecker(),
      instanceOf: createInstanceTypeChecker,
      node: createNodeChecker(),
      objectOf: createObjectOfTypeChecker,
      oneOf: createEnumTypeChecker,
      oneOfType: createUnionTypeChecker,
      shape: createShapeTypeChecker,
      exact: createStrictShapeTypeChecker,
    };

    /**
     * inlined Object.is polyfill to avoid requiring consumers ship their own
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
    /*eslint-disable no-self-compare*/
    function is(x, y) {
      // SameValue algorithm
      if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
      } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
      }
    }
    /*eslint-enable no-self-compare*/

    /**
     * We use an Error-like object for backward compatibility as people may call
     * PropTypes directly and inspect their output. However, we don't use real
     * Errors anymore. We don't inspect their stack anyway, and creating them
     * is prohibitively expensive if they are created too often, such as what
     * happens in oneOfType() for any type before the one that matched.
     */
    function PropTypeError(message) {
      this.message = message;
      this.stack = '';
    }
    // Make `instanceof Error` still work for returned errors.
    PropTypeError.prototype = Error.prototype;

    function createChainableTypeChecker(validate) {
      {
        var manualPropTypeCallCache = {};
        var manualPropTypeWarningCount = 0;
      }
      function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
        componentName = componentName || ANONYMOUS;
        propFullName = propFullName || propName;

        if (secret !== ReactPropTypesSecret_1) {
          if (throwOnDirectAccess) {
            // New behavior only for users of `prop-types` package
            var err = new Error(
              'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
              'Use `PropTypes.checkPropTypes()` to call them. ' +
              'Read more at http://fb.me/use-check-prop-types'
            );
            err.name = 'Invariant Violation';
            throw err;
          } else if (typeof console !== 'undefined') {
            // Old behavior for people using React.PropTypes
            var cacheKey = componentName + ':' + propName;
            if (
              !manualPropTypeCallCache[cacheKey] &&
              // Avoid spamming the console because they are often not actionable except for lib authors
              manualPropTypeWarningCount < 3
            ) {
              printWarning$1(
                'You are manually calling a React.PropTypes validation ' +
                'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
                'and will throw in the standalone `prop-types` package. ' +
                'You may be seeing this warning due to a third-party PropTypes ' +
                'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
              );
              manualPropTypeCallCache[cacheKey] = true;
              manualPropTypeWarningCount++;
            }
          }
        }
        if (props[propName] == null) {
          if (isRequired) {
            if (props[propName] === null) {
              return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
            }
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
          }
          return null;
        } else {
          return validate(props, propName, componentName, location, propFullName);
        }
      }

      var chainedCheckType = checkType.bind(null, false);
      chainedCheckType.isRequired = checkType.bind(null, true);

      return chainedCheckType;
    }

    function createPrimitiveTypeChecker(expectedType) {
      function validate(props, propName, componentName, location, propFullName, secret) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== expectedType) {
          // `propValue` being instance of, say, date/regexp, pass the 'object'
          // check, but we can offer a more precise error message here rather than
          // 'of type `object`'.
          var preciseType = getPreciseType(propValue);

          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createAnyTypeChecker() {
      return createChainableTypeChecker(emptyFunctionThatReturnsNull);
    }

    function createArrayOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== 'function') {
          return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
        }
        var propValue = props[propName];
        if (!Array.isArray(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
        }
        for (var i = 0; i < propValue.length; i++) {
          var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createElementTypeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        if (!isValidElement(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createInstanceTypeChecker(expectedClass) {
      function validate(props, propName, componentName, location, propFullName) {
        if (!(props[propName] instanceof expectedClass)) {
          var expectedClassName = expectedClass.name || ANONYMOUS;
          var actualClassName = getClassName(props[propName]);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createEnumTypeChecker(expectedValues) {
      if (!Array.isArray(expectedValues)) {
        printWarning$1('Invalid argument supplied to oneOf, expected an instance of array.');
        return emptyFunctionThatReturnsNull;
      }

      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        for (var i = 0; i < expectedValues.length; i++) {
          if (is(propValue, expectedValues[i])) {
            return null;
          }
        }

        var valuesString = JSON.stringify(expectedValues);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
      }
      return createChainableTypeChecker(validate);
    }

    function createObjectOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== 'function') {
          return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
        }
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
        }
        for (var key in propValue) {
          if (propValue.hasOwnProperty(key)) {
            var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
            if (error instanceof Error) {
              return error;
            }
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createUnionTypeChecker(arrayOfTypeCheckers) {
      if (!Array.isArray(arrayOfTypeCheckers)) {
        printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.');
        return emptyFunctionThatReturnsNull;
      }

      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (typeof checker !== 'function') {
          printWarning$1(
            'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
            'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
          );
          return emptyFunctionThatReturnsNull;
        }
      }

      function validate(props, propName, componentName, location, propFullName) {
        for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
          var checker = arrayOfTypeCheckers[i];
          if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
            return null;
          }
        }

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
      }
      return createChainableTypeChecker(validate);
    }

    function createNodeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        if (!isNode(props[propName])) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
        }
        for (var key in shapeTypes) {
          var checker = shapeTypes[key];
          if (!checker) {
            continue;
          }
          var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createStrictShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
        }
        // We need to check all keys in case some are required but missing from
        // props.
        var allKeys = objectAssign({}, props[propName], shapeTypes);
        for (var key in allKeys) {
          var checker = shapeTypes[key];
          if (!checker) {
            return new PropTypeError(
              'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
              '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
              '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
            );
          }
          var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error) {
            return error;
          }
        }
        return null;
      }

      return createChainableTypeChecker(validate);
    }

    function isNode(propValue) {
      switch (typeof propValue) {
        case 'number':
        case 'string':
        case 'undefined':
          return true;
        case 'boolean':
          return !propValue;
        case 'object':
          if (Array.isArray(propValue)) {
            return propValue.every(isNode);
          }
          if (propValue === null || isValidElement(propValue)) {
            return true;
          }

          var iteratorFn = getIteratorFn(propValue);
          if (iteratorFn) {
            var iterator = iteratorFn.call(propValue);
            var step;
            if (iteratorFn !== propValue.entries) {
              while (!(step = iterator.next()).done) {
                if (!isNode(step.value)) {
                  return false;
                }
              }
            } else {
              // Iterator will provide entry [k,v] tuples rather than values.
              while (!(step = iterator.next()).done) {
                var entry = step.value;
                if (entry) {
                  if (!isNode(entry[1])) {
                    return false;
                  }
                }
              }
            }
          } else {
            return false;
          }

          return true;
        default:
          return false;
      }
    }

    function isSymbol(propType, propValue) {
      // Native Symbol.
      if (propType === 'symbol') {
        return true;
      }

      // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
      if (propValue['@@toStringTag'] === 'Symbol') {
        return true;
      }

      // Fallback for non-spec compliant Symbols which are polyfilled.
      if (typeof Symbol === 'function' && propValue instanceof Symbol) {
        return true;
      }

      return false;
    }

    // Equivalent of `typeof` but with special handling for array and regexp.
    function getPropType(propValue) {
      var propType = typeof propValue;
      if (Array.isArray(propValue)) {
        return 'array';
      }
      if (propValue instanceof RegExp) {
        // Old webkits (at least until Android 4.0) return 'function' rather than
        // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
        // passes PropTypes.object.
        return 'object';
      }
      if (isSymbol(propType, propValue)) {
        return 'symbol';
      }
      return propType;
    }

    // This handles more types than `getPropType`. Only used for error messages.
    // See `createPrimitiveTypeChecker`.
    function getPreciseType(propValue) {
      if (typeof propValue === 'undefined' || propValue === null) {
        return '' + propValue;
      }
      var propType = getPropType(propValue);
      if (propType === 'object') {
        if (propValue instanceof Date) {
          return 'date';
        } else if (propValue instanceof RegExp) {
          return 'regexp';
        }
      }
      return propType;
    }

    // Returns a string that is postfixed to a warning about an invalid type.
    // For example, "undefined" or "of type array"
    function getPostfixForTypeWarning(value) {
      var type = getPreciseType(value);
      switch (type) {
        case 'array':
        case 'object':
          return 'an ' + type;
        case 'boolean':
        case 'date':
        case 'regexp':
          return 'a ' + type;
        default:
          return type;
      }
    }

    // Returns class name of the object, if any.
    function getClassName(propValue) {
      if (!propValue.constructor || !propValue.constructor.name) {
        return ANONYMOUS;
      }
      return propValue.constructor.name;
    }

    ReactPropTypes.checkPropTypes = checkPropTypes_1;
    ReactPropTypes.PropTypes = ReactPropTypes;

    return ReactPropTypes;
  };

  var propTypes = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  {
    var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
      Symbol.for &&
      Symbol.for('react.element')) ||
      0xeac7;

    var isValidElement = function(object) {
      return typeof object === 'object' &&
        object !== null &&
        object.$$typeof === REACT_ELEMENT_TYPE;
    };

    // By explicitly using `prop-types` you are opting into new development behavior.
    // http://fb.me/prop-types-in-prod
    var throwOnDirectAccess = true;
    module.exports = factoryWithTypeCheckers(isValidElement, throwOnDirectAccess);
  }
  });

  var _jsxFileName = "/home/geoff/Dev/web/chain-drive/src/context.js";
  /**
   * Chain initial state
   */

  var chainInitialState = function chainInitialState(id) {
    return {
      id: id,
      state: 'unmounted',
      animations: {},
      innerChains: {}
    };
  };
  /**
   * Reusable React Context for Chain
   */


  var ChainContext = React.createContext(chainInitialState());
  /**
   * @class UpdatingProvider
   * 
   * @description acts as middleman for ChainContext and Transition from 
   * the 'react-transition-group'. It's job is to update the 'state' state
   * variable in the wrapping 'Chain' component and calls the 'updateParent'
   * prop to provide the updated 'state' to the parent 'Chain' of the wrapping 
   * 'Chain'
   */

  var UpdatingProvider =
  /*#__PURE__*/
  function (_React$PureComponent) {
    _inherits(UpdatingProvider, _React$PureComponent);

    function UpdatingProvider() {
      var _this;

      _classCallCheck(this, UpdatingProvider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(UpdatingProvider).apply(this, arguments));
      _this.update = _this.update.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      return _this;
    }

    _createClass(UpdatingProvider, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.update();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if (prevProps.state !== this.props.state) {
          this.update();
        }
      }
    }, {
      key: "update",
      value: function update() {
        var _this$props = this.props,
            context = _this$props.context,
            state = _this$props.state;
        context.setState(state);
      }
    }, {
      key: "render",
      value: function render() {
        return React.createElement(ChainContext.Provider, {
          value: _objectSpread({}, this.props.context),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 55
          },
          __self: this
        }, this.props.children);
      }
    }]);

    return UpdatingProvider;
  }(React.PureComponent);

  UpdatingProvider.propTypes = {
    context: propTypes.shape({
      id: propTypes.string.isRequired
    }).isRequired,
    state: propTypes.string.isRequired
  };
  UpdatingProvider.defaultProps = {
    parentUpdate: function parentUpdate() {}
  };
  ChainContext.UpdatingProvider = UpdatingProvider;
  /**
   * Reusable wrapper for passing Chain context and state
   * 
   * @param { React.Component } BaseComponent 
   */

  var chainedConsumer = function chainedConsumer(BaseComponent) {
    return function (_ref) {
      var id = _ref.id,
          state = _ref.state,
          rest = _objectWithoutProperties(_ref, ["id", "state"]);

      return React.createElement(ChainContext.Consumer, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 81
        },
        __self: this
      }, function (context) {
        return React.createElement(BaseComponent, Object.assign({
          context: !context.id ? chainInitialState(id) : context,
          id: id,
          state: state || context.state
        }, rest, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 83
          },
          __self: this
        }));
      });
    };
  };

  var _jsxFileName$1 = "/home/geoff/Dev/web/chain-drive/src/chain.jsx";

  var Chain =
  /*#__PURE__*/
  function (_React$PureComponent) {
    _inherits(Chain, _React$PureComponent);

    function Chain() {
      var _this;

      _classCallCheck(this, Chain);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Chain).apply(this, arguments));
      _this.state = {
        setState: _this.setTransitionState.bind(_assertThisInitialized(_assertThisInitialized(_this))),
        updateAnimation: _this.updateAnimation.bind(_assertThisInitialized(_assertThisInitialized(_this))),
        removeAnimation: _this.removeAnimation.bind(_assertThisInitialized(_assertThisInitialized(_this))),
        updateInnerChain: _this.updateInnerChain.bind(_assertThisInitialized(_assertThisInitialized(_this))),
        removeInnerChain: _this.removeInnerChain.bind(_assertThisInitialized(_assertThisInitialized(_this)))
      };
      _this.timeout = _this.timeout.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this.isReady = _this.isReady.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      return _this;
    }

    _createClass(Chain, [{
      key: "setTransitionState",
      value: function setTransitionState(state) {
        var _this2 = this;

        this.setState({
          state: state
        }, function () {
          return _this2.props.updateParent(_this2.props.id, state);
        });
      }
    }, {
      key: "updateAnimation",
      value: function updateAnimation(id, timeout) {
        var oldAnimation = Object.assign({}, this.state.animations[id]);
        var updatedAnimation = Object.assign(oldAnimation, timeout);
        this.setState({
          animations: _objectSpread({}, this.state.animations, _defineProperty({}, id, updatedAnimation))
        });
      }
    }, {
      key: "removeAnimation",
      value: function removeAnimation(id) {
        var animations = Object.assign({}, this.state.animations);
        delete animations[id];
        this.setState({
          animations: animations
        });
      }
    }, {
      key: "updateInnerChain",
      value: function updateInnerChain(id, state) {
        this.setState({
          innerChains: _objectSpread({}, this.state.innerChains, _defineProperty({}, id, state))
        });
      }
    }, {
      key: "removeInnerChain",
      value: function removeInnerChain(id) {
        var innerChains = Object.assign({}, this.state.innerChains);
        delete innerChains[id];
        this.setState({
          innerChains: innerChains
        });
      }
    }, {
      key: "timeout",
      value: function timeout() {
        return lodash.reduce(this.state.animations, function (result, _ref) {
          var enter = _ref.enter,
              exit = _ref.exit;

          if (enter > result.enter) {
            result.enter = enter;
          }

          if (exit > result.exit) {
            result.exit = exit;
          }

          return result;
        }, {
          enter: 0,
          exit: 0
        });
      }
    }, {
      key: "isReady",
      value: function isReady() {
        if (this.state.state === 'unmounted') {
          return;
        }

        var _this$props = this.props,
            parentOrder = _this$props.parentOrder,
            parentState = _this$props.parentState;
        var ready;
        var parentReady;

        if (this.state.in) {
          switch (parentOrder.substring(0, 2)) {
            case 'li':
              parentReady = this.state.in;
              break;

            default:
              parentReady = !parentState || parentState === 'entered';
          }

          switch (this.state.order.substring(0, 2)) {
            case 'li':
              ready = lodash.every(this.state.innerChains, function (state) {
                return state === 'entered';
              });
              break;

            default:
              ready = this.state.in;
          }

          return ready && parentReady;
        } else {
          switch (parentOrder.substring(2)) {
            case 'lo':
              parentReady = true;
              break;

            default:
              parentReady = !parentState || parentState === 'exited';
          }

          switch (this.state.order.substring(2)) {
            case 'lo':
              ready = lodash.every(this.state.innerChains, function (state) {
                return state === 'exited';
              }) ? this.state.in : true;
              return ready;

            default:
              ready = parentReady ? this.state.in : true;
              return ready;
          }
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var transProps = lodash.omit(this.props, ['id', 'children', 'updateParent', 'parentState', 'parentOrder', 'order', 'in']);
        return React.createElement(reactTransitionGroup.Transition, Object.assign({
          timeout: this.timeout()
        }, transProps, {
          in: this.isReady(),
          __source: {
            fileName: _jsxFileName$1,
            lineNumber: 165
          },
          __self: this
        }), function (state) {
          return React.createElement(ChainContext.UpdatingProvider, {
            context: _this3.state,
            state: state,
            __source: {
              fileName: _jsxFileName$1,
              lineNumber: 171
            },
            __self: this
          }, _this3.props.children);
        });
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(props, state) {
        var newState = null;

        if (props.id !== state.id) {
          newState = chainInitialState(props.id);
        }

        if (props.parentState !== state.parentState) {
          newState = newState || {};
          newState.parentState = props.parentState;
        }

        if (props.order !== state.order) {
          newState = newState || {};
          newState.order = props.order;
        }

        if (props.in !== state.in) {
          newState = newState || {};
          newState.in = props.in;
        }

        return newState;
      }
    }]);

    return Chain;
  }(React.PureComponent);

  Chain.propTypes = {
    id: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
    parentState: propTypes.string,
    updateParent: propTypes.func,
    order: propTypes.oneOf(['fifo', 'filo', 'lifo', 'lilo']),
    parentOrder: propTypes.oneOf(['fifo', 'filo', 'lifo', 'lilo'])
  };
  Chain.defaultProps = {
    updateParent: function updateParent() {},
    parentState: undefined,
    order: 'fifo',
    parentOrder: 'fifo'
  };
  var InnerChain = React.memo(function (_ref2) {
    var show = _ref2.in,
        rest = _objectWithoutProperties(_ref2, ["in"]);

    return React.createElement(ChainContext.Consumer, {
      __source: {
        fileName: _jsxFileName$1,
        lineNumber: 212
      },
      __self: this
    }, function (context) {
      return React.createElement(Chain, Object.assign({}, rest, {
        parentState: context.state,
        parentOrder: context.order,
        updateParent: context.updateInnerChain,
        in: show && context.in,
        __source: {
          fileName: _jsxFileName$1,
          lineNumber: 214
        },
        __self: this
      }));
    });
  });
  InnerChain.propTypes = {
    id: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
    in: propTypes.bool
  };
  InnerChain.defaultProps = {
    in: true
  };

  var _jsxFileName$2 = "/home/geoff/Dev/web/chain-drive/src/with-anime.jsx";
  /**
   * Returns formatted Anime.js targets parameter
   * 
   * @param { HTMLElement } rootEl - root element
   * @param { string|string[]|null } selectors - targetted css selectors
   * 
   * @returns { HTMLElement|HTMLElement[]|object }
   */

  var formatTargets = function formatTargets(rootEl, selectors) {
    if (!selectors) {
      return rootEl;
    }

    if (Array.isArray(selectors)) {
      return rootEl.querySelectorAll(selectors.join(', '));
    }

    if (_typeof(selectors) === 'object') {
      return selectors;
    }

    return rootEl.querySelectorAll(selectors);
  };
  /**
   * Return formatted animation parameter object for use in Anime.js functions
   * 
   * @param { object } params - unformatted params
   * @param { HTMLElement } rootEl - root element
   * 
   * @returns { object }
   */


  var formatParams = function formatParams(params, rootEl) {
    var selector = params.targets,
        update = params.update,
        begin = params.begin,
        run = params.run,
        complete = params.complete,
        rest = _objectWithoutProperties(params, ["targets", "update", "begin", "run", "complete"]);

    var targets = formatTargets(rootEl, selector);
    return _objectSpread({
      targets: targets
    }, rest, {
      update: update ? function (anim) {
        return update(anim, targets);
      } : undefined,
      begin: begin ? function (anim) {
        return begin(anim, targets);
      } : undefined,
      run: run ? function (anim) {
        return run(anim, targets);
      } : undefined,
      complete: complete ? function (anim) {
        return complete(anim, targets);
      } : undefined
    });
  };
  /**
   * Returns calculated timeout by add duration and delay properties in the params object
   * 
   * @param { HTMLElement } rootEl - root element 
   * @param { object } params - unformatted parameter
   * 
   * @returns { number }
   */


  var calculate = function calculate(rootEl, params) {
    var _params$duration = params.duration,
        duration = _params$duration === void 0 ? 0 : _params$duration,
        _params$delay = params.delay,
        delay = _params$delay === void 0 ? 0 : _params$delay,
        t = params.targets;

    if (typeof delay === 'function') {
      var targets = formatTargets(rootEl, t);

      if (Array.isArray(targets)) {
        return duration + lodash.reduce(targets, function (highestDelay, nextTarget, index, list) {
          var nextDelay = delay(nextTarget, index, list.length);
          return highestDelay < nextDelay ? nextDelay : highestDelay;
        }, 0);
      } else {
        return duration + delay(targets, 0, 1);
      }
    }

    return duration + delay;
  };
  /**
   * Returns processed timeout value for provided Anime.js params
   * 
   * @param { HTMLElement } rootEl - root element 
   * @param { object } params - unformatted Anime.js params
   * 
   * @return { number }
   */


  var processTimeout = function processTimeout(rootEl, params) {
    if (params) {
      if (Array.isArray(params)) {
        return lodash.reduce(params, function (total, nextParams) {
          var nextTimeout = calculate(rootEl, nextParams);
          return total + nextTimeout;
        }, 0);
      } else {
        return calculate(rootEl, params);
      }
    }

    return 0;
  };
  /**
   * Returns a component to be animated by Anime.js
   * 
   * @param { React.Component || React.PureComponent } BaseComponent - wrapped component
   * 
   * @returns { React.PureComponent }
   */


  var withAnime = (function (BaseComponent) {
    var AnimeJs =
    /*#__PURE__*/
    function (_React$PureComponent) {
      _inherits(AnimeJs, _React$PureComponent);

      function AnimeJs() {
        var _this;

        _classCallCheck(this, AnimeJs);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(AnimeJs).apply(this, arguments));
        _this.ref = React.createRef();
        _this.animeRef = null;
        _this.linkToChain = _this.linkToChain.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.unlinkToChain = _this.unlinkToChain.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.timeout = _this.timeout.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.animate = _this.animate.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.animateTimeline = _this.animateTimeline.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        return _this;
      }

      _createClass(AnimeJs, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          this.linkToChain();
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.unlinkToChain();
        }
      }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
          var state = this.props.state;

          if (prevProps.state !== state) {
            this.animate(state);
          }
        }
      }, {
        key: "linkToChain",
        value: function linkToChain() {
          var _this$props = this.props,
              id = _this$props.id,
              state = _this$props.state,
              context = _this$props.context;

          if (context.updateAnimation) {
            context.updateAnimation(id, this.timeout());
          }

          this.animate(state);
        }
      }, {
        key: "unlinkToChain",
        value: function unlinkToChain() {
          var _this$props2 = this.props,
              id = _this$props2.id,
              context = _this$props2.context;

          if (context.removeAnimation) {
            context.removeAnimation(id);
          }
        }
      }, {
        key: "timeout",
        value: function timeout() {
          var _this$props3 = this.props,
              entering = _this$props3.entering,
              exiting = _this$props3.exiting,
              processTimeout = _this$props3.processTimeout;
          var rootEl = this.ref.current;
          return {
            enter: processTimeout(rootEl, entering),
            exit: processTimeout(rootEl, exiting)
          };
        }
      }, {
        key: "animate",
        value: function animate(state) {
          var params = this.props[state];

          if (Array.isArray(params)) {
            return this.animateTimeline(state);
          }

          if (params) {
            this.animeRef = anime(_objectSpread({
              loop: false
            }, formatParams(params, this.ref.current)));
          }
        }
      }, {
        key: "animateTimeline",
        value: function animateTimeline(state) {
          var _this2 = this;

          this.animeRef = anime.timeline({
            loop: false
          });
          var rootEl = this.ref.current;
          lodash.each(this.props[state], function (params) {
            return _this2.animeRef.add(formatParams(params, rootEl));
          });
        }
      }, {
        key: "render",
        value: function render() {
          var props = lodash.omit(this.props, ['entering', 'entered', 'exiting', 'exited', 'processTimeout']);
          return React.createElement(BaseComponent, Object.assign({
            ref: this.ref,
            animeRef: this.animeRef
          }, props, {
            __source: {
              fileName: _jsxFileName$2,
              lineNumber: 212
            },
            __self: this
          }));
        }
      }]);

      return AnimeJs;
    }(React.PureComponent);

    AnimeJs.propTypes = {
      id: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
      context: propTypes.shape({
        status: propTypes.func,
        updateTimeout: propTypes.func
      }).isRequired,
      state: propTypes.string.isRequired,
      processTimeout: propTypes.func
    };
    AnimeJs.defaultProps = {
      processTimeout: processTimeout
    };
    return chainedConsumer(AnimeJs);
  });

  // index.js

  exports.withAnimeJs = withAnime;
  exports.chainInitialState = chainInitialState;
  exports.ChainContext = ChainContext;
  exports.chainedConsumer = chainedConsumer;
  exports.Chain = Chain;
  exports.InnerChain = InnerChain;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
