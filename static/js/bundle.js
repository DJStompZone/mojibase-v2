require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/**
 * matchesSelector v2.0.2
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
  /*global define: false, module: false */
  'use strict';
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.matchesSelector = factory();
  }

}( window, function factory() {
  'use strict';

  var matchesMethod = ( function() {
    var ElemProto = window.Element.prototype;
    // check for the standard method name first
    if ( ElemProto.matches ) {
      return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0; i < prefixes.length; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  return function matchesSelector( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  };

}));

},{}],3:[function(require,module,exports){
/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( typeof window != 'undefined' ? window : this, function() {

"use strict";

function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  // copy over to avoid interference if .off() in listener
  listeners = listeners.slice(0);
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  for ( var i=0; i < listeners.length; i++ ) {
    var listener = listeners[i]
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
  }

  return this;
};

proto.allOff = function() {
  delete this._events;
  delete this._onceEvents;
};

return EvEmitter;

}));

},{}],4:[function(require,module,exports){
/**
 * Fizzy UI utils v2.0.7
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'desandro-matches-selector/matches-selector'
    ], function( matchesSelector ) {
      return factory( window, matchesSelector );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('desandro-matches-selector')
    );
  } else {
    // browser global
    window.fizzyUIUtils = factory(
      window,
      window.matchesSelector
    );
  }

}( window, function factory( window, matchesSelector ) {

'use strict';

var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

// ----- makeArray ----- //

var arraySlice = Array.prototype.slice;

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    return obj;
  }
  // return empty array if undefined or null. #6
  if ( obj === null || obj === undefined ) {
    return [];
  }

  var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
  if ( isArrayLike ) {
    // convert nodeList to array
    return arraySlice.call( obj );
  }

  // array of single index
  return [ obj ];
};

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
  var index = ary.indexOf( obj );
  if ( index != -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
  while ( elem.parentNode && elem != document.body ) {
    elem = elem.parentNode;
    if ( matchesSelector( elem, selector ) ) {
      return elem;
    }
  }
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
  if ( typeof elem == 'string' ) {
    return document.querySelector( elem );
  }
  return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = utils.makeArray( elems );
  var ffElems = [];

  elems.forEach( function( elem ) {
    // check that elem is an actual element
    if ( !( elem instanceof HTMLElement ) ) {
      return;
    }
    // add elem if no selector
    if ( !selector ) {
      ffElems.push( elem );
      return;
    }
    // filter & find items if we have a selector
    // filter
    if ( matchesSelector( elem, selector ) ) {
      ffElems.push( elem );
    }
    // find children
    var childElems = elem.querySelectorAll( selector );
    // concat childElems to filterFound array
    for ( var i=0; i < childElems.length; i++ ) {
      ffElems.push( childElems[i] );
    }
  });

  return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
  threshold = threshold || 100;
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    clearTimeout( timeout );

    var args = arguments;
    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold );
  };
};

// ----- docReady ----- //

utils.docReady = function( callback ) {
  var readyState = document.readyState;
  if ( readyState == 'complete' || readyState == 'interactive' ) {
    // do async to allow for other scripts to run. metafizzy/flickity#441
    setTimeout( callback );
  } else {
    document.addEventListener( 'DOMContentLoaded', callback );
  }
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via [data-namespace] or .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-options
 */
utils.htmlInit = function( WidgetClass, namespace ) {
  utils.docReady( function() {
    var dashedNamespace = utils.toDashed( namespace );
    var dataAttr = 'data-' + dashedNamespace;
    var dataAttrElems = document.querySelectorAll( '[' + dataAttr + ']' );
    var jsDashElems = document.querySelectorAll( '.js-' + dashedNamespace );
    var elems = utils.makeArray( dataAttrElems )
      .concat( utils.makeArray( jsDashElems ) );
    var dataOptionsAttr = dataAttr + '-options';
    var jQuery = window.jQuery;

    elems.forEach( function( elem ) {
      var attr = elem.getAttribute( dataAttr ) ||
        elem.getAttribute( dataOptionsAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' + elem.className +
          ': ' + error );
        }
        return;
      }
      // initialize
      var instance = new WidgetClass( elem, options );
      // make available via $().data('namespace')
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    });

  });
};

// -----  ----- //

return utils;

}));

},{"desandro-matches-selector":2}],5:[function(require,module,exports){
/*!
 * getSize v2.0.3
 * measure size of elements
 * MIT license
 */

/* jshint browser: true, strict: true, undef: true, unused: true */
/* globals console: false */

( function( window, factory ) {
  /* jshint strict: false */ /* globals define, module */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.getSize = factory();
  }

})( window, function factory() {
'use strict';

// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') == -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console == 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

var measurementsLength = measurements.length;

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}

// -------------------------- getStyle -------------------------- //

/**
 * getStyle, get style of element, check for Firefox bug
 * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function getStyle( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    logError( 'Style returned ' + style +
      '. Are you running this code in a hidden iframe on Firefox? ' +
      'See https://bit.ly/getsizebug1' );
  }
  return style;
}

// -------------------------- setup -------------------------- //

var isSetup = false;

var isBoxSizeOuter;

/**
 * setup
 * check isBoxSizerOuter
 * do on first getSize() rather than on page load for Firefox bug
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  // -------------------------- box sizing -------------------------- //

  /**
   * Chrome & Safari measure the outer-width on style.width on border-box elems
   * IE11 & Firefox<29 measures the inner-width
   */
  var div = document.createElement('div');
  div.style.width = '200px';
  div.style.padding = '1px 2px 3px 4px';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px 2px 3px 4px';
  div.style.boxSizing = 'border-box';

  var body = document.body || document.documentElement;
  body.appendChild( div );
  var style = getStyle( div );
  // round value for browser zoom. desandro/masonry#928
  isBoxSizeOuter = Math.round( getStyleSize( style.width ) ) == 200;
  getSize.isBoxSizeOuter = isBoxSizeOuter;

  body.removeChild( div );
}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem == 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem != 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display == 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

  // get all measurements
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

return getSize;

});

},{}],6:[function(require,module,exports){
/**
 * Isotope Item
**/

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        'outlayer/outlayer'
      ],
      factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('outlayer')
    );
  } else {
    // browser global
    window.Isotope = window.Isotope || {};
    window.Isotope.Item = factory(
      window.Outlayer
    );
  }

}( window, function factory( Outlayer ) {
'use strict';

// -------------------------- Item -------------------------- //

// sub-class Outlayer Item
function Item() {
  Outlayer.Item.apply( this, arguments );
}

var proto = Item.prototype = Object.create( Outlayer.Item.prototype );

var _create = proto._create;
proto._create = function() {
  // assign id, used for original-order sorting
  this.id = this.layout.itemGUID++;
  _create.call( this );
  this.sortData = {};
};

proto.updateSortData = function() {
  if ( this.isIgnored ) {
    return;
  }
  // default sorters
  this.sortData.id = this.id;
  // for backward compatibility
  this.sortData['original-order'] = this.id;
  this.sortData.random = Math.random();
  // go thru getSortData obj and apply the sorters
  var getSortData = this.layout.options.getSortData;
  var sorters = this.layout._sorters;
  for ( var key in getSortData ) {
    var sorter = sorters[ key ];
    this.sortData[ key ] = sorter( this.element, this );
  }
};

var _destroy = proto.destroy;
proto.destroy = function() {
  // call super
  _destroy.apply( this, arguments );
  // reset display, #741
  this.css({
    display: ''
  });
};

return Item;

}));

},{"outlayer":13}],7:[function(require,module,exports){
/**
 * Isotope LayoutMode
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        'get-size/get-size',
        'outlayer/outlayer'
      ],
      factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('get-size'),
      require('outlayer')
    );
  } else {
    // browser global
    window.Isotope = window.Isotope || {};
    window.Isotope.LayoutMode = factory(
      window.getSize,
      window.Outlayer
    );
  }

}( window, function factory( getSize, Outlayer ) {
  'use strict';

  // layout mode class
  function LayoutMode( isotope ) {
    this.isotope = isotope;
    // link properties
    if ( isotope ) {
      this.options = isotope.options[ this.namespace ];
      this.element = isotope.element;
      this.items = isotope.filteredItems;
      this.size = isotope.size;
    }
  }

  var proto = LayoutMode.prototype;

  /**
   * some methods should just defer to default Outlayer method
   * and reference the Isotope instance as `this`
  **/
  var facadeMethods = [
    '_resetLayout',
    '_getItemLayoutPosition',
    '_manageStamp',
    '_getContainerSize',
    '_getElementOffset',
    'needsResizeLayout',
    '_getOption'
  ];

  facadeMethods.forEach( function( methodName ) {
    proto[ methodName ] = function() {
      return Outlayer.prototype[ methodName ].apply( this.isotope, arguments );
    };
  });

  // -----  ----- //

  // for horizontal layout modes, check vertical size
  proto.needsVerticalResizeLayout = function() {
    // don't trigger if size did not change
    var size = getSize( this.isotope.element );
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var hasSizes = this.isotope.size && size;
    return hasSizes && size.innerHeight != this.isotope.size.innerHeight;
  };

  // ----- measurements ----- //

  proto._getMeasurement = function() {
    this.isotope._getMeasurement.apply( this, arguments );
  };

  proto.getColumnWidth = function() {
    this.getSegmentSize( 'column', 'Width' );
  };

  proto.getRowHeight = function() {
    this.getSegmentSize( 'row', 'Height' );
  };

  /**
   * get columnWidth or rowHeight
   * segment: 'column' or 'row'
   * size 'Width' or 'Height'
  **/
  proto.getSegmentSize = function( segment, size ) {
    var segmentName = segment + size;
    var outerSize = 'outer' + size;
    // columnWidth / outerWidth // rowHeight / outerHeight
    this._getMeasurement( segmentName, outerSize );
    // got rowHeight or columnWidth, we can chill
    if ( this[ segmentName ] ) {
      return;
    }
    // fall back to item of first element
    var firstItemSize = this.getFirstItemSize();
    this[ segmentName ] = firstItemSize && firstItemSize[ outerSize ] ||
      // or size of container
      this.isotope.size[ 'inner' + size ];
  };

  proto.getFirstItemSize = function() {
    var firstItem = this.isotope.filteredItems[0];
    return firstItem && firstItem.element && getSize( firstItem.element );
  };

  // ----- methods that should reference isotope ----- //

  proto.layout = function() {
    this.isotope.layout.apply( this.isotope, arguments );
  };

  proto.getSize = function() {
    this.isotope.getSize();
    this.size = this.isotope.size;
  };

  // -------------------------- create -------------------------- //

  LayoutMode.modes = {};

  LayoutMode.create = function( namespace, options ) {

    function Mode() {
      LayoutMode.apply( this, arguments );
    }

    Mode.prototype = Object.create( proto );
    Mode.prototype.constructor = Mode;

    // default options
    if ( options ) {
      Mode.options = options;
    }

    Mode.prototype.namespace = namespace;
    // register in Isotope
    LayoutMode.modes[ namespace ] = Mode;

    return Mode;
  };

  return LayoutMode;

}));

},{"get-size":5,"outlayer":13}],8:[function(require,module,exports){
/**
 * fitRows layout mode
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        '../layout-mode'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( LayoutMode ) {
'use strict';

var FitRows = LayoutMode.create('fitRows');

var proto = FitRows.prototype;

proto._resetLayout = function() {
  this.x = 0;
  this.y = 0;
  this.maxY = 0;
  this._getMeasurement( 'gutter', 'outerWidth' );
};

proto._getItemLayoutPosition = function( item ) {
  item.getSize();

  var itemWidth = item.size.outerWidth + this.gutter;
  // if this element cannot fit in the current row
  var containerWidth = this.isotope.size.innerWidth + this.gutter;
  if ( this.x !== 0 && itemWidth + this.x > containerWidth ) {
    this.x = 0;
    this.y = this.maxY;
  }

  var position = {
    x: this.x,
    y: this.y
  };

  this.maxY = Math.max( this.maxY, this.y + item.size.outerHeight );
  this.x += itemWidth;

  return position;
};

proto._getContainerSize = function() {
  return { height: this.maxY };
};

return FitRows;

}));

},{"../layout-mode":7}],9:[function(require,module,exports){
/*!
 * Masonry layout mode
 * sub-classes Masonry
 * https://masonry.desandro.com
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        '../layout-mode',
        'masonry-layout/masonry'
      ],
      factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode'),
      require('masonry-layout')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode,
      window.Masonry
    );
  }

}( window, function factory( LayoutMode, Masonry ) {
'use strict';

// -------------------------- masonryDefinition -------------------------- //

  // create an Outlayer layout class
  var MasonryMode = LayoutMode.create('masonry');

  var proto = MasonryMode.prototype;

  var keepModeMethods = {
    _getElementOffset: true,
    layout: true,
    _getMeasurement: true
  };

  // inherit Masonry prototype
  for ( var method in Masonry.prototype ) {
    // do not inherit mode methods
    if ( !keepModeMethods[ method ] ) {
      proto[ method ] = Masonry.prototype[ method ];
    }
  }

  var measureColumns = proto.measureColumns;
  proto.measureColumns = function() {
    // set items, used if measuring first item
    this.items = this.isotope.filteredItems;
    measureColumns.call( this );
  };

  // point to mode options for fitWidth
  var _getOption = proto._getOption;
  proto._getOption = function( option ) {
    if ( option == 'fitWidth' ) {
      return this.options.isFitWidth !== undefined ?
        this.options.isFitWidth : this.options.fitWidth;
    }
    return _getOption.apply( this.isotope, arguments );
  };

  return MasonryMode;

}));

},{"../layout-mode":7,"masonry-layout":11}],10:[function(require,module,exports){
/**
 * vertical layout mode
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        '../layout-mode'
      ],
      factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( LayoutMode ) {
'use strict';

var Vertical = LayoutMode.create( 'vertical', {
  horizontalAlignment: 0
});

var proto = Vertical.prototype;

proto._resetLayout = function() {
  this.y = 0;
};

proto._getItemLayoutPosition = function( item ) {
  item.getSize();
  var x = ( this.isotope.size.innerWidth - item.size.outerWidth ) *
    this.options.horizontalAlignment;
  var y = this.y;
  this.y += item.size.outerHeight;
  return { x: x, y: y };
};

proto._getContainerSize = function() {
  return { height: this.y };
};

return Vertical;

}));

},{"../layout-mode":7}],11:[function(require,module,exports){
/*!
 * Masonry v4.2.2
 * Cascading grid layout library
 * https://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        'outlayer/outlayer',
        'get-size/get-size'
      ],
      factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('outlayer'),
      require('get-size')
    );
  } else {
    // browser global
    window.Masonry = factory(
      window.Outlayer,
      window.getSize
    );
  }

}( window, function factory( Outlayer, getSize ) {

'use strict';

// -------------------------- masonryDefinition -------------------------- //

  // create an Outlayer layout class
  var Masonry = Outlayer.create('masonry');
  // isFitWidth -> fitWidth
  Masonry.compatOptions.fitWidth = 'isFitWidth';

  var proto = Masonry.prototype;

  proto._resetLayout = function() {
    this.getSize();
    this._getMeasurement( 'columnWidth', 'outerWidth' );
    this._getMeasurement( 'gutter', 'outerWidth' );
    this.measureColumns();

    // reset column Y
    this.colYs = [];
    for ( var i=0; i < this.cols; i++ ) {
      this.colYs.push( 0 );
    }

    this.maxY = 0;
    this.horizontalColIndex = 0;
  };

  proto.measureColumns = function() {
    this.getContainerWidth();
    // if columnWidth is 0, default to outerWidth of first item
    if ( !this.columnWidth ) {
      var firstItem = this.items[0];
      var firstItemElem = firstItem && firstItem.element;
      // columnWidth fall back to item of first element
      this.columnWidth = firstItemElem && getSize( firstItemElem ).outerWidth ||
        // if first elem has no width, default to size of container
        this.containerWidth;
    }

    var columnWidth = this.columnWidth += this.gutter;

    // calculate columns
    var containerWidth = this.containerWidth + this.gutter;
    var cols = containerWidth / columnWidth;
    // fix rounding errors, typically with gutters
    var excess = columnWidth - containerWidth % columnWidth;
    // if overshoot is less than a pixel, round up, otherwise floor it
    var mathMethod = excess && excess < 1 ? 'round' : 'floor';
    cols = Math[ mathMethod ]( cols );
    this.cols = Math.max( cols, 1 );
  };

  proto.getContainerWidth = function() {
    // container is parent if fit width
    var isFitWidth = this._getOption('fitWidth');
    var container = isFitWidth ? this.element.parentNode : this.element;
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var size = getSize( container );
    this.containerWidth = size && size.innerWidth;
  };

  proto._getItemLayoutPosition = function( item ) {
    item.getSize();
    // how many columns does this brick span
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
    // round if off by 1 pixel, otherwise use ceil
    var colSpan = Math[ mathMethod ]( item.size.outerWidth / this.columnWidth );
    colSpan = Math.min( colSpan, this.cols );
    // use horizontal or top column position
    var colPosMethod = this.options.horizontalOrder ?
      '_getHorizontalColPosition' : '_getTopColPosition';
    var colPosition = this[ colPosMethod ]( colSpan, item );
    // position the brick
    var position = {
      x: this.columnWidth * colPosition.col,
      y: colPosition.y
    };
    // apply setHeight to necessary columns
    var setHeight = colPosition.y + item.size.outerHeight;
    var setMax = colSpan + colPosition.col;
    for ( var i = colPosition.col; i < setMax; i++ ) {
      this.colYs[i] = setHeight;
    }

    return position;
  };

  proto._getTopColPosition = function( colSpan ) {
    var colGroup = this._getTopColGroup( colSpan );
    // get the minimum Y value from the columns
    var minimumY = Math.min.apply( Math, colGroup );

    return {
      col: colGroup.indexOf( minimumY ),
      y: minimumY,
    };
  };

  /**
   * @param {Number} colSpan - number of columns the element spans
   * @returns {Array} colGroup
   */
  proto._getTopColGroup = function( colSpan ) {
    if ( colSpan < 2 ) {
      // if brick spans only one column, use all the column Ys
      return this.colYs;
    }

    var colGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.cols + 1 - colSpan;
    // for each group potential horizontal position
    for ( var i = 0; i < groupCount; i++ ) {
      colGroup[i] = this._getColGroupY( i, colSpan );
    }
    return colGroup;
  };

  proto._getColGroupY = function( col, colSpan ) {
    if ( colSpan < 2 ) {
      return this.colYs[ col ];
    }
    // make an array of colY values for that one group
    var groupColYs = this.colYs.slice( col, col + colSpan );
    // and get the max value of the array
    return Math.max.apply( Math, groupColYs );
  };

  // get column position based on horizontal index. #873
  proto._getHorizontalColPosition = function( colSpan, item ) {
    var col = this.horizontalColIndex % this.cols;
    var isOver = colSpan > 1 && col + colSpan > this.cols;
    // shift to next row if item can't fit on current row
    col = isOver ? 0 : col;
    // don't let zero-size items take up space
    var hasSize = item.size.outerWidth && item.size.outerHeight;
    this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;

    return {
      col: col,
      y: this._getColGroupY( col, colSpan ),
    };
  };

  proto._manageStamp = function( stamp ) {
    var stampSize = getSize( stamp );
    var offset = this._getElementOffset( stamp );
    // get the columns that this stamp affects
    var isOriginLeft = this._getOption('originLeft');
    var firstX = isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor( firstX / this.columnWidth );
    firstCol = Math.max( 0, firstCol );
    var lastCol = Math.floor( lastX / this.columnWidth );
    // lastCol should not go over if multiple of columnWidth #425
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min( this.cols - 1, lastCol );
    // set colYs to bottom of the stamp

    var isOriginTop = this._getOption('originTop');
    var stampMaxY = ( isOriginTop ? offset.top : offset.bottom ) +
      stampSize.outerHeight;
    for ( var i = firstCol; i <= lastCol; i++ ) {
      this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
    }
  };

  proto._getContainerSize = function() {
    this.maxY = Math.max.apply( Math, this.colYs );
    var size = {
      height: this.maxY
    };

    if ( this._getOption('fitWidth') ) {
      size.width = this._getContainerFitWidth();
    }

    return size;
  };

  proto._getContainerFitWidth = function() {
    var unusedCols = 0;
    // count unused columns
    var i = this.cols;
    while ( --i ) {
      if ( this.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
    // fit container to columns that have been used
    return ( this.cols - unusedCols ) * this.columnWidth - this.gutter;
  };

  proto.needsResizeLayout = function() {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth != this.containerWidth;
  };

  return Masonry;

}));

},{"get-size":5,"outlayer":13}],12:[function(require,module,exports){
/**
 * Outlayer Item
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( [
        'ev-emitter/ev-emitter',
        'get-size/get-size'
      ],
      factory
    );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory(
      require('ev-emitter'),
      require('get-size')
    );
  } else {
    // browser global
    window.Outlayer = {};
    window.Outlayer.Item = factory(
      window.EvEmitter,
      window.getSize
    );
  }

}( window, function factory( EvEmitter, getSize ) {
'use strict';

// ----- helpers ----- //

function isEmptyObj( obj ) {
  for ( var prop in obj ) {
    return false;
  }
  prop = null;
  return true;
}

// -------------------------- CSS3 support -------------------------- //


var docElemStyle = document.documentElement.style;

var transitionProperty = typeof docElemStyle.transition == 'string' ?
  'transition' : 'WebkitTransition';
var transformProperty = typeof docElemStyle.transform == 'string' ?
  'transform' : 'WebkitTransform';

var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  transition: 'transitionend'
}[ transitionProperty ];

// cache all vendor properties that could have vendor prefix
var vendorProperties = {
  transform: transformProperty,
  transition: transitionProperty,
  transitionDuration: transitionProperty + 'Duration',
  transitionProperty: transitionProperty + 'Property',
  transitionDelay: transitionProperty + 'Delay'
};

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
  if ( !element ) {
    return;
  }

  this.element = element;
  // parent layout class, i.e. Masonry, Isotope, or Packery
  this.layout = layout;
  this.position = {
    x: 0,
    y: 0
  };

  this._create();
}

// inherit EvEmitter
var proto = Item.prototype = Object.create( EvEmitter.prototype );
proto.constructor = Item;

proto._create = function() {
  // transition objects
  this._transn = {
    ingProperties: {},
    clean: {},
    onEnd: {}
  };

  this.css({
    position: 'absolute'
  });
};

// trigger specified handler for event type
proto.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

proto.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
proto.css = function( style ) {
  var elemStyle = this.element.style;

  for ( var prop in style ) {
    // use vendor property if available
    var supportedProp = vendorProperties[ prop ] || prop;
    elemStyle[ supportedProp ] = style[ prop ];
  }
};

 // measure position, and sets it
proto.getPosition = function() {
  var style = getComputedStyle( this.element );
  var isOriginLeft = this.layout._getOption('originLeft');
  var isOriginTop = this.layout._getOption('originTop');
  var xValue = style[ isOriginLeft ? 'left' : 'right' ];
  var yValue = style[ isOriginTop ? 'top' : 'bottom' ];
  var x = parseFloat( xValue );
  var y = parseFloat( yValue );
  // convert percent to pixels
  var layoutSize = this.layout.size;
  if ( xValue.indexOf('%') != -1 ) {
    x = ( x / 100 ) * layoutSize.width;
  }
  if ( yValue.indexOf('%') != -1 ) {
    y = ( y / 100 ) * layoutSize.height;
  }
  // clean up 'auto' or other non-integer values
  x = isNaN( x ) ? 0 : x;
  y = isNaN( y ) ? 0 : y;
  // remove padding from measurement
  x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
  y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

  this.position.x = x;
  this.position.y = y;
};

// set settled position, apply padding
proto.layoutPosition = function() {
  var layoutSize = this.layout.size;
  var style = {};
  var isOriginLeft = this.layout._getOption('originLeft');
  var isOriginTop = this.layout._getOption('originTop');

  // x
  var xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight';
  var xProperty = isOriginLeft ? 'left' : 'right';
  var xResetProperty = isOriginLeft ? 'right' : 'left';

  var x = this.position.x + layoutSize[ xPadding ];
  // set in percentage or pixels
  style[ xProperty ] = this.getXValue( x );
  // reset other property
  style[ xResetProperty ] = '';

  // y
  var yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom';
  var yProperty = isOriginTop ? 'top' : 'bottom';
  var yResetProperty = isOriginTop ? 'bottom' : 'top';

  var y = this.position.y + layoutSize[ yPadding ];
  // set in percentage or pixels
  style[ yProperty ] = this.getYValue( y );
  // reset other property
  style[ yResetProperty ] = '';

  this.css( style );
  this.emitEvent( 'layout', [ this ] );
};

proto.getXValue = function( x ) {
  var isHorizontal = this.layout._getOption('horizontal');
  return this.layout.options.percentPosition && !isHorizontal ?
    ( ( x / this.layout.size.width ) * 100 ) + '%' : x + 'px';
};

proto.getYValue = function( y ) {
  var isHorizontal = this.layout._getOption('horizontal');
  return this.layout.options.percentPosition && isHorizontal ?
    ( ( y / this.layout.size.height ) * 100 ) + '%' : y + 'px';
};

proto._transitionTo = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var didNotMove = x == this.position.x && y == this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = x - curX;
  var transY = y - curY;
  var transitionStyle = {};
  transitionStyle.transform = this.getTranslate( transX, transY );

  this.transition({
    to: transitionStyle,
    onTransitionEnd: {
      transform: this.layoutPosition
    },
    isCleaning: true
  });
};

proto.getTranslate = function( x, y ) {
  // flip cooridinates if origin on right or bottom
  var isOriginLeft = this.layout._getOption('originLeft');
  var isOriginTop = this.layout._getOption('originTop');
  x = isOriginLeft ? x : -x;
  y = isOriginTop ? y : -y;
  return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
};

// non transition + transform support
proto.goTo = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

proto.moveTo = proto._transitionTo;

proto.setPosition = function( x, y ) {
  this.position.x = parseFloat( x );
  this.position.y = parseFloat( y );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
proto._nonTransition = function( args ) {
  this.css( args.to );
  if ( args.isCleaning ) {
    this._removeStyles( args.to );
  }
  for ( var prop in args.onTransitionEnd ) {
    args.onTransitionEnd[ prop ].call( this );
  }
};

/**
 * proper transition
 * @param {Object} args - arguments
 *   @param {Object} to - style to transition to
 *   @param {Object} from - style to start transition from
 *   @param {Boolean} isCleaning - removes transition styles after transition
 *   @param {Function} onTransitionEnd - callback
 */
proto.transition = function( args ) {
  // redirect to nonTransition if no transition duration
  if ( !parseFloat( this.layout.options.transitionDuration ) ) {
    this._nonTransition( args );
    return;
  }

  var _transition = this._transn;
  // keep track of onTransitionEnd callback by css property
  for ( var prop in args.onTransitionEnd ) {
    _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
  }
  // keep track of properties that are transitioning
  for ( prop in args.to ) {
    _transition.ingProperties[ prop ] = true;
    // keep track of properties to clean up when transition is done
    if ( args.isCleaning ) {
      _transition.clean[ prop ] = true;
    }
  }

  // set from styles
  if ( args.from ) {
    this.css( args.from );
    // force redraw. http://blog.alexmaccaw.com/css-transitions
    var h = this.element.offsetHeight;
    // hack for JSHint to hush about unused var
    h = null;
  }
  // enable transition
  this.enableTransition( args.to );
  // set styles that are transitioning
  this.css( args.to );

  this.isTransitioning = true;

};

// dash before all cap letters, including first for
// WebkitTransform => -webkit-transform
function toDashedAll( str ) {
  return str.replace( /([A-Z])/g, function( $1 ) {
    return '-' + $1.toLowerCase();
  });
}

var transitionProps = 'opacity,' + toDashedAll( transformProperty );

proto.enableTransition = function(/* style */) {
  // HACK changing transitionProperty during a transition
  // will cause transition to jump
  if ( this.isTransitioning ) {
    return;
  }

  // make `transition: foo, bar, baz` from style object
  // HACK un-comment this when enableTransition can work
  // while a transition is happening
  // var transitionValues = [];
  // for ( var prop in style ) {
  //   // dash-ify camelCased properties like WebkitTransition
  //   prop = vendorProperties[ prop ] || prop;
  //   transitionValues.push( toDashedAll( prop ) );
  // }
  // munge number to millisecond, to match stagger
  var duration = this.layout.options.transitionDuration;
  duration = typeof duration == 'number' ? duration + 'ms' : duration;
  // enable transition styles
  this.css({
    transitionProperty: transitionProps,
    transitionDuration: duration,
    transitionDelay: this.staggerDelay || 0
  });
  // listen for transition end event
  this.element.addEventListener( transitionEndEvent, this, false );
};

// ----- events ----- //

proto.onwebkitTransitionEnd = function( event ) {
  this.ontransitionend( event );
};

proto.onotransitionend = function( event ) {
  this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
  '-webkit-transform': 'transform'
};

proto.ontransitionend = function( event ) {
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }
  var _transition = this._transn;
  // get property name of transitioned property, convert to prefix-free
  var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

  // remove property that has completed transitioning
  delete _transition.ingProperties[ propertyName ];
  // check if any properties are still transitioning
  if ( isEmptyObj( _transition.ingProperties ) ) {
    // all properties have completed transitioning
    this.disableTransition();
  }
  // clean style
  if ( propertyName in _transition.clean ) {
    // clean up style
    this.element.style[ event.propertyName ] = '';
    delete _transition.clean[ propertyName ];
  }
  // trigger onTransitionEnd callback
  if ( propertyName in _transition.onEnd ) {
    var onTransitionEnd = _transition.onEnd[ propertyName ];
    onTransitionEnd.call( this );
    delete _transition.onEnd[ propertyName ];
  }

  this.emitEvent( 'transitionEnd', [ this ] );
};

proto.disableTransition = function() {
  this.removeTransitionStyles();
  this.element.removeEventListener( transitionEndEvent, this, false );
  this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
proto._removeStyles = function( style ) {
  // clean up transition styles
  var cleanStyle = {};
  for ( var prop in style ) {
    cleanStyle[ prop ] = '';
  }
  this.css( cleanStyle );
};

var cleanTransitionStyle = {
  transitionProperty: '',
  transitionDuration: '',
  transitionDelay: ''
};

proto.removeTransitionStyles = function() {
  // remove transition
  this.css( cleanTransitionStyle );
};

// ----- stagger ----- //

proto.stagger = function( delay ) {
  delay = isNaN( delay ) ? 0 : delay;
  this.staggerDelay = delay + 'ms';
};

// ----- show/hide/remove ----- //

// remove element from DOM
proto.removeElem = function() {
  this.element.parentNode.removeChild( this.element );
  // remove display: none
  this.css({ display: '' });
  this.emitEvent( 'remove', [ this ] );
};

proto.remove = function() {
  // just remove element if no transition support or no transition
  if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
    this.removeElem();
    return;
  }

  // start transition
  this.once( 'transitionEnd', function() {
    this.removeElem();
  });
  this.hide();
};

proto.reveal = function() {
  delete this.isHidden;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onRevealTransitionEnd;

  this.transition({
    from: options.hiddenStyle,
    to: options.visibleStyle,
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

proto.onRevealTransitionEnd = function() {
  // check if still visible
  // during transition, item may have been hidden
  if ( !this.isHidden ) {
    this.emitEvent('reveal');
  }
};

/**
 * get style property use for hide/reveal transition end
 * @param {String} styleProperty - hiddenStyle/visibleStyle
 * @returns {String}
 */
proto.getHideRevealTransitionEndProperty = function( styleProperty ) {
  var optionStyle = this.layout.options[ styleProperty ];
  // use opacity
  if ( optionStyle.opacity ) {
    return 'opacity';
  }
  // get first property
  for ( var prop in optionStyle ) {
    return prop;
  }
};

proto.hide = function() {
  // set flag
  this.isHidden = true;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onHideTransitionEnd;

  this.transition({
    from: options.visibleStyle,
    to: options.hiddenStyle,
    // keep hidden stuff hidden
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

proto.onHideTransitionEnd = function() {
  // check if still hidden
  // during transition, item may have been un-hidden
  if ( this.isHidden ) {
    this.css({ display: 'none' });
    this.emitEvent('hide');
  }
};

proto.destroy = function() {
  this.css({
    position: '',
    left: '',
    right: '',
    top: '',
    bottom: '',
    transition: '',
    transform: ''
  });
};

return Item;

}));

},{"ev-emitter":3,"get-size":5}],13:[function(require,module,exports){
/*!
 * Outlayer v2.1.1
 * the brains and guts of a layout library
 * MIT license
 */

( function( window, factory ) {
  'use strict';
  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( [
        'ev-emitter/ev-emitter',
        'get-size/get-size',
        'fizzy-ui-utils/utils',
        './item'
      ],
      function( EvEmitter, getSize, utils, Item ) {
        return factory( window, EvEmitter, getSize, utils, Item);
      }
    );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory(
      window,
      require('ev-emitter'),
      require('get-size'),
      require('fizzy-ui-utils'),
      require('./item')
    );
  } else {
    // browser global
    window.Outlayer = factory(
      window,
      window.EvEmitter,
      window.getSize,
      window.fizzyUIUtils,
      window.Outlayer.Item
    );
  }

}( window, function factory( window, EvEmitter, getSize, utils, Item ) {
'use strict';

// ----- vars ----- //

var console = window.console;
var jQuery = window.jQuery;
var noop = function() {};

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
  var queryElement = utils.getQueryElement( element );
  if ( !queryElement ) {
    if ( console ) {
      console.error( 'Bad element for ' + this.constructor.namespace +
        ': ' + ( queryElement || element ) );
    }
    return;
  }
  this.element = queryElement;
  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }

  // options
  this.options = utils.extend( {}, this.constructor.defaults );
  this.option( options );

  // add id for Outlayer.getFromElement
  var id = ++GUID;
  this.element.outlayerGUID = id; // expando
  instances[ id ] = this; // associate via id

  // kick it off
  this._create();

  var isInitLayout = this._getOption('initLayout');
  if ( isInitLayout ) {
    this.layout();
  }
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
  containerStyle: {
    position: 'relative'
  },
  initLayout: true,
  originLeft: true,
  originTop: true,
  resize: true,
  resizeContainer: true,
  // item options
  transitionDuration: '0.4s',
  hiddenStyle: {
    opacity: 0,
    transform: 'scale(0.001)'
  },
  visibleStyle: {
    opacity: 1,
    transform: 'scale(1)'
  }
};

var proto = Outlayer.prototype;
// inherit EvEmitter
utils.extend( proto, EvEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
proto.option = function( opts ) {
  utils.extend( this.options, opts );
};

/**
 * get backwards compatible option value, check old name
 */
proto._getOption = function( option ) {
  var oldOption = this.constructor.compatOptions[ option ];
  return oldOption && this.options[ oldOption ] !== undefined ?
    this.options[ oldOption ] : this.options[ option ];
};

Outlayer.compatOptions = {
  // currentName: oldName
  initLayout: 'isInitLayout',
  horizontal: 'isHorizontal',
  layoutInstant: 'isLayoutInstant',
  originLeft: 'isOriginLeft',
  originTop: 'isOriginTop',
  resize: 'isResizeBound',
  resizeContainer: 'isResizingContainer'
};

proto._create = function() {
  // get items from children
  this.reloadItems();
  // elements that affect layout, but are not laid out
  this.stamps = [];
  this.stamp( this.options.stamp );
  // set container style
  utils.extend( this.element.style, this.options.containerStyle );

  // bind resize method
  var canBindResize = this._getOption('resize');
  if ( canBindResize ) {
    this.bindResize();
  }
};

// goes through all children again and gets bricks in proper order
proto.reloadItems = function() {
  // collection of item elements
  this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
proto._itemize = function( elems ) {

  var itemElems = this._filterFindItemElements( elems );
  var Item = this.constructor.Item;

  // create new Outlayer Items for collection
  var items = [];
  for ( var i=0; i < itemElems.length; i++ ) {
    var elem = itemElems[i];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
proto._filterFindItemElements = function( elems ) {
  return utils.filterFindElements( elems, this.options.itemSelector );
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
proto.getItemElements = function() {
  return this.items.map( function( item ) {
    return item.element;
  });
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
proto.layout = function() {
  this._resetLayout();
  this._manageStamps();

  // don't animate first layout
  var layoutInstant = this._getOption('layoutInstant');
  var isInstant = layoutInstant !== undefined ?
    layoutInstant : !this._isLayoutInited;
  this.layoutItems( this.items, isInstant );

  // flag for initalized
  this._isLayoutInited = true;
};

// _init is alias for layout
proto._init = proto.layout;

/**
 * logic before any new layout
 */
proto._resetLayout = function() {
  this.getSize();
};


proto.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
proto._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else {
    // use option as an element
    if ( typeof option == 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( option instanceof HTMLElement ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};

/**
 * layout a collection of item elements
 * @api public
 */
proto.layoutItems = function( items, isInstant ) {
  items = this._getItemsForLayout( items );

  this._layoutItems( items, isInstant );

  this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
proto._getItemsForLayout = function( items ) {
  return items.filter( function( item ) {
    return !item.isIgnored;
  });
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
proto._layoutItems = function( items, isInstant ) {
  this._emitCompleteOnItems( 'layout', items );

  if ( !items || !items.length ) {
    // no items, emit event with empty array
    return;
  }

  var queue = [];

  items.forEach( function( item ) {
    // get x/y object from method
    var position = this._getItemLayoutPosition( item );
    // enqueue
    position.item = item;
    position.isInstant = isInstant || item.isLayoutInstant;
    queue.push( position );
  }, this );

  this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
proto._getItemLayoutPosition = function( /* item */ ) {
  return {
    x: 0,
    y: 0
  };
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
proto._processLayoutQueue = function( queue ) {
  this.updateStagger();
  queue.forEach( function( obj, i ) {
    this._positionItem( obj.item, obj.x, obj.y, obj.isInstant, i );
  }, this );
};

// set stagger from option in milliseconds number
proto.updateStagger = function() {
  var stagger = this.options.stagger;
  if ( stagger === null || stagger === undefined ) {
    this.stagger = 0;
    return;
  }
  this.stagger = getMilliseconds( stagger );
  return this.stagger;
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
proto._positionItem = function( item, x, y, isInstant, i ) {
  if ( isInstant ) {
    // if not transition, just set CSS
    item.goTo( x, y );
  } else {
    item.stagger( i * this.stagger );
    item.moveTo( x, y );
  }
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
proto._postLayout = function() {
  this.resizeContainer();
};

proto.resizeContainer = function() {
  var isResizingContainer = this._getOption('resizeContainer');
  if ( !isResizingContainer ) {
    return;
  }
  var size = this._getContainerSize();
  if ( size ) {
    this._setContainerMeasure( size.width, true );
    this._setContainerMeasure( size.height, false );
  }
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *   @param {Number} width
 *   @param {Number} height
 */
proto._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
proto._setContainerMeasure = function( measure, isWidth ) {
  if ( measure === undefined ) {
    return;
  }

  var elemSize = this.size;
  // add padding and border width if border box
  if ( elemSize.isBorderBox ) {
    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
      elemSize.borderLeftWidth + elemSize.borderRightWidth :
      elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }

  measure = Math.max( measure, 0 );
  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * emit eventComplete on a collection of items events
 * @param {String} eventName
 * @param {Array} items - Outlayer.Items
 */
proto._emitCompleteOnItems = function( eventName, items ) {
  var _this = this;
  function onComplete() {
    _this.dispatchEvent( eventName + 'Complete', null, [ items ] );
  }

  var count = items.length;
  if ( !items || !count ) {
    onComplete();
    return;
  }

  var doneCount = 0;
  function tick() {
    doneCount++;
    if ( doneCount == count ) {
      onComplete();
    }
  }

  // bind callback
  items.forEach( function( item ) {
    item.once( eventName, tick );
  });
};

/**
 * emits events via EvEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
proto.dispatchEvent = function( type, event, args ) {
  // add original event to arguments
  var emitArgs = event ? [ event ].concat( args ) : args;
  this.emitEvent( type, emitArgs );

  if ( jQuery ) {
    // set this.$element
    this.$element = this.$element || jQuery( this.element );
    if ( event ) {
      // create jQuery event
      var $event = jQuery.Event( event );
      $event.type = type;
      this.$element.trigger( $event, args );
    } else {
      // just trigger with type if no event available
      this.$element.trigger( type, args );
    }
  }
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
proto.ignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
proto.unignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
proto.stamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ) {
    return;
  }

  this.stamps = this.stamps.concat( elems );
  // ignore
  elems.forEach( this.ignore, this );
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
proto.unstamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ){
    return;
  }

  elems.forEach( function( elem ) {
    // filter out removed stamp elements
    utils.removeFrom( this.stamps, elem );
    this.unignore( elem );
  }, this );
};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
proto._find = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems == 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = utils.makeArray( elems );
  return elems;
};

proto._manageStamps = function() {
  if ( !this.stamps || !this.stamps.length ) {
    return;
  }

  this._getBoundingRect();

  this.stamps.forEach( this._manageStamp, this );
};

// update boundingLeft / Top
proto._getBoundingRect = function() {
  // get bounding rect for container element
  var boundingRect = this.element.getBoundingClientRect();
  var size = this.size;
  this._boundingRect = {
    left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
    top: boundingRect.top + size.paddingTop + size.borderTopWidth,
    right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
    bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
  };
};

/**
 * @param {Element} stamp
**/
proto._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
proto._getElementOffset = function( elem ) {
  var boundingRect = elem.getBoundingClientRect();
  var thisRect = this._boundingRect;
  var size = getSize( elem );
  var offset = {
    left: boundingRect.left - thisRect.left - size.marginLeft,
    top: boundingRect.top - thisRect.top - size.marginTop,
    right: thisRect.right - boundingRect.right - size.marginRight,
    bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
  };
  return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
proto.handleEvent = utils.handleEvent;

/**
 * Bind layout to window resizing
 */
proto.bindResize = function() {
  window.addEventListener( 'resize', this );
  this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
proto.unbindResize = function() {
  window.removeEventListener( 'resize', this );
  this.isResizeBound = false;
};

proto.onresize = function() {
  this.resize();
};

utils.debounceMethod( Outlayer, 'onresize', 100 );

proto.resize = function() {
  // don't trigger if size did not change
  // or if resize was unbound. See #9
  if ( !this.isResizeBound || !this.needsResizeLayout() ) {
    return;
  }

  this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
proto.needsResizeLayout = function() {
  var size = getSize( this.element );
  // check that this.size and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.size && size;
  return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
proto.addItems = function( elems ) {
  var items = this._itemize( elems );
  // add items to collection
  if ( items.length ) {
    this.items = this.items.concat( items );
  }
  return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
proto.appended = function( elems ) {
  var items = this.addItems( elems );
  if ( !items.length ) {
    return;
  }
  // layout and reveal just the new items
  this.layoutItems( items, true );
  this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
proto.prepended = function( elems ) {
  var items = this._itemize( elems );
  if ( !items.length ) {
    return;
  }
  // add items to beginning of collection
  var previousItems = this.items.slice(0);
  this.items = items.concat( previousItems );
  // start new layout
  this._resetLayout();
  this._manageStamps();
  // layout new stuff without transition
  this.layoutItems( items, true );
  this.reveal( items );
  // layout previous items
  this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
proto.reveal = function( items ) {
  this._emitCompleteOnItems( 'reveal', items );
  if ( !items || !items.length ) {
    return;
  }
  var stagger = this.updateStagger();
  items.forEach( function( item, i ) {
    item.stagger( i * stagger );
    item.reveal();
  });
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
proto.hide = function( items ) {
  this._emitCompleteOnItems( 'hide', items );
  if ( !items || !items.length ) {
    return;
  }
  var stagger = this.updateStagger();
  items.forEach( function( item, i ) {
    item.stagger( i * stagger );
    item.hide();
  });
};

/**
 * reveal item elements
 * @param {Array}, {Element}, {NodeList} items
 */
proto.revealItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.reveal( items );
};

/**
 * hide item elements
 * @param {Array}, {Element}, {NodeList} items
 */
proto.hideItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.hide( items );
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
proto.getItem = function( elem ) {
  // loop through items to get the one that matches
  for ( var i=0; i < this.items.length; i++ ) {
    var item = this.items[i];
    if ( item.element == elem ) {
      // return item
      return item;
    }
  }
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
proto.getItems = function( elems ) {
  elems = utils.makeArray( elems );
  var items = [];
  elems.forEach( function( elem ) {
    var item = this.getItem( elem );
    if ( item ) {
      items.push( item );
    }
  }, this );

  return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
proto.remove = function( elems ) {
  var removeItems = this.getItems( elems );

  this._emitCompleteOnItems( 'remove', removeItems );

  // bail if no items to remove
  if ( !removeItems || !removeItems.length ) {
    return;
  }

  removeItems.forEach( function( item ) {
    item.remove();
    // remove item from collection
    utils.removeFrom( this.items, item );
  }, this );
};

// ----- destroy ----- //

// remove and disable Outlayer instance
proto.destroy = function() {
  // clean up dynamic styles
  var style = this.element.style;
  style.height = '';
  style.position = '';
  style.width = '';
  // destroy items
  this.items.forEach( function( item ) {
    item.destroy();
  });

  this.unbindResize();

  var id = this.element.outlayerGUID;
  delete instances[ id ]; // remove reference to instance by id
  delete this.element.outlayerGUID;
  // remove data for jQuery
  if ( jQuery ) {
    jQuery.removeData( this.element, this.constructor.namespace );
  }

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.outlayerGUID;
  return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
  // sub-class Outlayer
  var Layout = subclass( Outlayer );
  // apply new options and compatOptions
  Layout.defaults = utils.extend( {}, Outlayer.defaults );
  utils.extend( Layout.defaults, options );
  Layout.compatOptions = utils.extend( {}, Outlayer.compatOptions  );

  Layout.namespace = namespace;

  Layout.data = Outlayer.data;

  // sub-class Item
  Layout.Item = subclass( Item );

  // -------------------------- declarative -------------------------- //

  utils.htmlInit( Layout, namespace );

  // -------------------------- jQuery bridge -------------------------- //

  // make into jQuery plugin
  if ( jQuery && jQuery.bridget ) {
    jQuery.bridget( namespace, Layout );
  }

  return Layout;
};

function subclass( Parent ) {
  function SubClass() {
    Parent.apply( this, arguments );
  }

  SubClass.prototype = Object.create( Parent.prototype );
  SubClass.prototype.constructor = SubClass;

  return SubClass;
}

// ----- helpers ----- //

// how many milliseconds are in each unit
var msUnits = {
  ms: 1,
  s: 1000
};

// munge time-like parameter into millisecond number
// '0.4s' -> 40
function getMilliseconds( time ) {
  if ( typeof time == 'number' ) {
    return time;
  }
  var matches = time.match( /(^\d*\.?\d*)(\w*)/ );
  var num = matches && matches[1];
  var unit = matches && matches[2];
  if ( !num.length ) {
    return 0;
  }
  num = parseFloat( num );
  var mult = msUnits[ unit ] || 1;
  return num * mult;
}

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}));

},{"./item":12,"ev-emitter":3,"fizzy-ui-utils":4,"get-size":5}],14:[function(require,module,exports){
const fs = require('fs')
const stickers = require('./stickers.json')
const stickers_i = require('./stickers_i.json')

var $ = require("jquery");
var isotope = require("isotope-layout");

var $grid = $('.grid').isotope({
    itemSelector: '.grid-item',
    columnWidth: 60,
    sortBy : 'random'
});
$grid.isotope('layout');
$grid.on('click', '.grid-item', function() {
   var $this = $(this);
    if ( !$this.hasClass('gigante') ) {
      $grid.find('.gigante').removeClass('gigante');
    }
    $this.toggleClass('gigante');
  // update sort data, sort, and layout
  $grid.isotope('updateSortData').isotope();
})

function getChar(qry) {
    var outpt = "";
    if (typeof(qry) === typeof('')) {
        if (qry.includes('.png')) {
            let output = parseInt(qry)
            if (output.toString() == 'NaN') {
                console.error(`Error in getChar: ${qry} cannot be converted to an integer`)
                return null
            } else {
                outpt = String.fromCharCode(output)
            }
        } else {
            //todo: import stickerdict
        }
    } else if (typeof(qry) == typeof(1)) {
        if (47000 < qry < 70000) {
            outpt = String.fromCharCode(qry)
        } else {
            console.error(`Error in getChar: ${qry} is outside valid range`);
            return null;
        }
    } else {
        console.error(`Error in getChar: ${qry} is an invalid type: ${typeof(qry)}`)
        return null
    }
    console.log(`getChar returning ${outpt} for ${qry}`)
    return outpt
}

function getName(code) {
    //todo: import stickerdict
    let emojiname = stickerdict[`${code}`].name
    console.log(`${code}: ${emojiname}`)
    return emojiname
}

},{"./stickers.json":15,"./stickers_i.json":16,"fs":1,"isotope-layout":"isotope-layout","jquery":"jquery"}],15:[function(require,module,exports){
module.exports={
    "59648": {
        "code": 59648,
        "name": "1080p_pepe",
        "filename": "59648.png"
    },
    "59649": {
        "code": 59649,
        "name": "blade_pepe",
        "filename": "59649.png"
    },
    "59650": {
        "code": 59650,
        "name": "bob_the_pepe_builder",
        "filename": "59650.png"
    },
    "59651": {
        "code": 59651,
        "name": "peepofaku",
        "filename": "59651.png"
    },
    "59652": {
        "code": 59652,
        "name": "peeposnack",
        "filename": "59652.png"
    },
    "59653": {
        "code": 59653,
        "name": "pepebigbrain",
        "filename": "59653.png"
    },
    "59654": {
        "code": 59654,
        "name": "pepeevil",
        "filename": "59654.png"
    },
    "59655": {
        "code": 59655,
        "name": "pepefrance",
        "filename": "59655.png"
    },
    "59656": {
        "code": 59656,
        "name": "pepehola",
        "filename": "59656.png"
    },
    "59657": {
        "code": 59657,
        "name": "pepeknight",
        "filename": "59657.png"
    },
    "59659": {
        "code": 59659,
        "name": "pepethonk",
        "filename": "59659.png"
    },
    "59660": {
        "code": 59660,
        "name": "pepeyikes",
        "filename": "59660.png"
    },
    "59661": {
        "code": 59661,
        "name": "pepe_toxic2008",
        "filename": "59661.png"
    },
    "59663": {
        "code": 59663,
        "name": "plord",
        "filename": "59663.png"
    },
    "59664": {
        "code": 59664,
        "name": "police_pepe",
        "filename": "59664.png"
    },
    "59665": {
        "code": 59665,
        "name": "purple_pepe",
        "filename": "59665.png"
    },
    "59666": {
        "code": 59666,
        "name": "soul_consumer_pepe",
        "filename": "59666.png"
    },
    "59667": {
        "code": 59667,
        "name": "themanbehindthepepe",
        "filename": "59667.png"
    },
    "59668": {
        "code": 59668,
        "name": "ak_pepe",
        "filename": "59668.png"
    },
    "59669": {
        "code": 59669,
        "name": "alphinaud_pepe",
        "filename": "59669.png"
    },
    "59670": {
        "code": 59670,
        "name": "amongus_thumbsup",
        "filename": "59670.png"
    },
    "59671": {
        "code": 59671,
        "name": "anakinlove",
        "filename": "59671.png"
    },
    "59672": {
        "code": 59672,
        "name": "angerydiamondsword",
        "filename": "59672.png"
    },
    "59673": {
        "code": 59673,
        "name": "angeryfuckoff",
        "filename": "59673.png"
    },
    "59674": {
        "code": 59674,
        "name": "angerykid",
        "filename": "59674.png"
    },
    "59675": {
        "code": 59675,
        "name": "angeryping",
        "filename": "59675.png"
    },
    "59676": {
        "code": 59676,
        "name": "angerypolice",
        "filename": "59676.png"
    },
    "59677": {
        "code": 59677,
        "name": "angeryscimitar",
        "filename": "59677.png"
    },
    "59678": {
        "code": 59678,
        "name": "angerysip",
        "filename": "59678.png"
    },
    "59679": {
        "code": 59679,
        "name": "angerytuxedo",
        "filename": "59679.png"
    },
    "59680": {
        "code": 59680,
        "name": "angerywut",
        "filename": "59680.png"
    },
    "59681": {
        "code": 59681,
        "name": "angrypepeak47",
        "filename": "59681.png"
    },
    "59682": {
        "code": 59682,
        "name": "anime",
        "filename": "59682.png"
    },
    "59683": {
        "code": 59683,
        "name": "anime_girl_pepe",
        "filename": "59683.png"
    },
    "59684": {
        "code": 59684,
        "name": "arab",
        "filename": "59684.png"
    },
    "59685": {
        "code": 59685,
        "name": "astropepe",
        "filename": "59685.png"
    },
    "59686": {
        "code": 59686,
        "name": "b_a_n_h_a_m_m_e_r_p_e_p_e",
        "filename": "59686.png"
    },
    "59687": {
        "code": 59687,
        "name": "baguette",
        "filename": "59687.png"
    },
    "59688": {
        "code": 59688,
        "name": "baked",
        "filename": "59688.png"
    },
    "59689": {
        "code": 59689,
        "name": "ban",
        "filename": "59689.png"
    },
    "59690": {
        "code": 59690,
        "name": "bandpepe",
        "filename": "59690.png"
    },
    "59691": {
        "code": 59691,
        "name": "banned",
        "filename": "59691.png"
    },
    "59692": {
        "code": 59692,
        "name": "bartdge",
        "filename": "59692.png"
    },
    "59693": {
        "code": 59693,
        "name": "basedcigar",
        "filename": "59693.png"
    },
    "59694": {
        "code": 59694,
        "name": "batman",
        "filename": "59694.png"
    },
    "59695": {
        "code": 59695,
        "name": "bear_pink_cute",
        "filename": "59695.png"
    },
    "59696": {
        "code": 59696,
        "name": "bedge",
        "filename": "59696.png"
    },
    "59697": {
        "code": 59697,
        "name": "bingus_amongus",
        "filename": "59697.png"
    },
    "59698": {
        "code": 59698,
        "name": "birthday",
        "filename": "59698.png"
    },
    "59699": {
        "code": 59699,
        "name": "black_pepe_clown",
        "filename": "59699.png"
    },
    "59700": {
        "code": 59700,
        "name": "blob_controller",
        "filename": "59700.png"
    },
    "59701": {
        "code": 59701,
        "name": "blueflower",
        "filename": "59701.png"
    },
    "59702": {
        "code": 59702,
        "name": "boca_juniors_escudo",
        "filename": "59702.png"
    },
    "59703": {
        "code": 59703,
        "name": "boost_pls",
        "filename": "59703.png"
    },
    "59704": {
        "code": 59704,
        "name": "boost_plz",
        "filename": "59704.png"
    },
    "59705": {
        "code": 59705,
        "name": "bskek",
        "filename": "59705.png"
    },
    "59706": {
        "code": 59706,
        "name": "bunnyletter_b",
        "filename": "59706.png"
    },
    "59707": {
        "code": 59707,
        "name": "bunnypeped",
        "filename": "59707.png"
    },
    "59708": {
        "code": 59708,
        "name": "cat_scratch",
        "filename": "59708.png"
    },
    "59709": {
        "code": 59709,
        "name": "catpepecry",
        "filename": "59709.png"
    },
    "59710": {
        "code": 59710,
        "name": "chestopen",
        "filename": "59710.png"
    },
    "59711": {
        "code": 59711,
        "name": "christmas_pepe_riding_a_goose",
        "filename": "59711.png"
    },
    "59712": {
        "code": 59712,
        "name": "christmaspepeno",
        "filename": "59712.png"
    },
    "59713": {
        "code": 59713,
        "name": "chunguspepe_sad",
        "filename": "59713.png"
    },
    "59714": {
        "code": 59714,
        "name": "chunkypepe",
        "filename": "59714.png"
    },
    "59715": {
        "code": 59715,
        "name": "clown_peepo",
        "filename": "59715.png"
    },
    "59716": {
        "code": 59716,
        "name": "clownge",
        "filename": "59716.png"
    },
    "59717": {
        "code": 59717,
        "name": "clowngewave",
        "filename": "59717.png"
    },
    "59718": {
        "code": 59718,
        "name": "cocka",
        "filename": "59718.png"
    },
    "59719": {
        "code": 59719,
        "name": "coffeepepe",
        "filename": "59719.png"
    },
    "59720": {
        "code": 59720,
        "name": "comfy_panda_pepe",
        "filename": "59720.png"
    },
    "59721": {
        "code": 59721,
        "name": "comfy_pepe_cat",
        "filename": "59721.png"
    },
    "59722": {
        "code": 59722,
        "name": "comfypepe",
        "filename": "59722.png"
    },
    "59723": {
        "code": 59723,
        "name": "comfypepered",
        "filename": "59723.png"
    },
    "59724": {
        "code": 59724,
        "name": "conco_pepe_chad",
        "filename": "59724.png"
    },
    "59725": {
        "code": 59725,
        "name": "cool_pepe",
        "filename": "59725.png"
    },
    "59726": {
        "code": 59726,
        "name": "coolpepe",
        "filename": "59726.png"
    },
    "59727": {
        "code": 59727,
        "name": "copege",
        "filename": "59727.png"
    },
    "59728": {
        "code": 59728,
        "name": "copium",
        "filename": "59728.png"
    },
    "59729": {
        "code": 59729,
        "name": "cozyblush",
        "filename": "59729.png"
    },
    "59730": {
        "code": 59730,
        "name": "cozypepebubzface",
        "filename": "59730.png"
    },
    "59731": {
        "code": 59731,
        "name": "crazy",
        "filename": "59731.png"
    },
    "59732": {
        "code": 59732,
        "name": "cursed_pepe",
        "filename": "59732.png"
    },
    "59733": {
        "code": 59733,
        "name": "cutepepe",
        "filename": "59733.png"
    },
    "59734": {
        "code": 59734,
        "name": "cutepepeomg",
        "filename": "59734.png"
    },
    "59735": {
        "code": 59735,
        "name": "dankegirl",
        "filename": "59735.png"
    },
    "59736": {
        "code": 59736,
        "name": "dankest_pepe",
        "filename": "59736.png"
    },
    "59737": {
        "code": 59737,
        "name": "dankies_pepe",
        "filename": "59737.png"
    },
    "59738": {
        "code": 59738,
        "name": "darthpepe",
        "filename": "59738.png"
    },
    "59739": {
        "code": 59739,
        "name": "died",
        "filename": "59739.png"
    },
    "59740": {
        "code": 59740,
        "name": "dittopeped",
        "filename": "59740.png"
    },
    "59741": {
        "code": 59741,
        "name": "djpeepo",
        "filename": "59741.png"
    },
    "59742": {
        "code": 59742,
        "name": "donald_trump_pepe",
        "filename": "59742.png"
    },
    "59743": {
        "code": 59743,
        "name": "donetsk",
        "filename": "59743.png"
    },
    "59744": {
        "code": 59744,
        "name": "donkpls",
        "filename": "59744.png"
    },
    "59745": {
        "code": 59745,
        "name": "doorpepebubzface",
        "filename": "59745.png"
    },
    "59746": {
        "code": 59746,
        "name": "drugs",
        "filename": "59746.png"
    },
    "59747": {
        "code": 59747,
        "name": "elegant_human_pepe",
        "filename": "59747.png"
    },
    "59748": {
        "code": 59748,
        "name": "empty_pepe",
        "filename": "59748.png"
    },
    "59749": {
        "code": 59749,
        "name": "epicownersignpepe",
        "filename": "59749.png"
    },
    "59750": {
        "code": 59750,
        "name": "evil_pepe",
        "filename": "59750.png"
    },
    "59751": {
        "code": 59751,
        "name": "exhaustedpepe",
        "filename": "59751.png"
    },
    "59752": {
        "code": 59752,
        "name": "fatfuck",
        "filename": "59752.png"
    },
    "59753": {
        "code": 59753,
        "name": "fatpepe",
        "filename": "59753.png"
    },
    "59754": {
        "code": 59754,
        "name": "feelsbadmane",
        "filename": "59754.png"
    },
    "59755": {
        "code": 59755,
        "name": "feelsbirthdayman",
        "filename": "59755.png"
    },
    "59756": {
        "code": 59756,
        "name": "feelsbussinfam",
        "filename": "59756.png"
    },
    "59757": {
        "code": 59757,
        "name": "feelsgoodman",
        "filename": "59757.png"
    },
    "59758": {
        "code": 59758,
        "name": "feelsokman",
        "filename": "59758.png"
    },
    "59759": {
        "code": 59759,
        "name": "feelsweakman",
        "filename": "59759.png"
    },
    "59760": {
        "code": 59760,
        "name": "floppawicked",
        "filename": "59760.png"
    },
    "59761": {
        "code": 59761,
        "name": "flushed_pepe",
        "filename": "59761.png"
    },
    "59762": {
        "code": 59762,
        "name": "flushedge",
        "filename": "59762.png"
    },
    "59763": {
        "code": 59763,
        "name": "frog_stare",
        "filename": "59763.png"
    },
    "59764": {
        "code": 59764,
        "name": "froglaugh",
        "filename": "59764.png"
    },
    "59765": {
        "code": 59765,
        "name": "frograisedeyes",
        "filename": "59765.png"
    },
    "59766": {
        "code": 59766,
        "name": "frogsalut",
        "filename": "59766.png"
    },
    "59767": {
        "code": 59767,
        "name": "fuck_off",
        "filename": "59767.png"
    },
    "59768": {
        "code": 59768,
        "name": "fumardge",
        "filename": "59768.png"
    },
    "59769": {
        "code": 59769,
        "name": "funny_cat_smashed_face_girl",
        "filename": "59769.png"
    },
    "59770": {
        "code": 59770,
        "name": "funny_cat_smashed_face_hawtf",
        "filename": "59770.png"
    },
    "59771": {
        "code": 59771,
        "name": "galaxypepe_cry",
        "filename": "59771.png"
    },
    "59772": {
        "code": 59772,
        "name": "galaxypepe_middlefinger",
        "filename": "59772.png"
    },
    "59773": {
        "code": 59773,
        "name": "garman_pepe",
        "filename": "59773.png"
    },
    "59774": {
        "code": 59774,
        "name": "gay_parrot",
        "filename": "59774.png"
    },
    "59775": {
        "code": 59775,
        "name": "gentlemanpepe",
        "filename": "59775.png"
    },
    "59776": {
        "code": 59776,
        "name": "givemeadminpeeposign",
        "filename": "59776.png"
    },
    "59777": {
        "code": 59777,
        "name": "gloomypepe",
        "filename": "59777.png"
    },
    "59778": {
        "code": 59778,
        "name": "gold_pepe",
        "filename": "59778.png"
    },
    "59779": {
        "code": 59779,
        "name": "googlechromepepe",
        "filename": "59779.png"
    },
    "59780": {
        "code": 59780,
        "name": "gunscared",
        "filename": "59780.png"
    },
    "59781": {
        "code": 59781,
        "name": "h_e_l_p",
        "filename": "59781.png"
    },
    "59782": {
        "code": 59782,
        "name": "hackerpepe",
        "filename": "59782.png"
    },
    "59783": {
        "code": 59783,
        "name": "happy_pepe",
        "filename": "59783.png"
    },
    "59784": {
        "code": 59784,
        "name": "happy_pepe_like_a_child",
        "filename": "59784.png"
    },
    "59785": {
        "code": 59785,
        "name": "haramgun",
        "filename": "59785.png"
    },
    "59786": {
        "code": 59786,
        "name": "harrowpcross",
        "filename": "59786.png"
    },
    "59787": {
        "code": 59787,
        "name": "heartu",
        "filename": "59787.png"
    },
    "59788": {
        "code": 59788,
        "name": "hecker_pepe",
        "filename": "59788.png"
    },
    "59789": {
        "code": 59789,
        "name": "help",
        "filename": "59789.png"
    },
    "59790": {
        "code": 59790,
        "name": "hmm",
        "filename": "59790.png"
    },
    "59791": {
        "code": 59791,
        "name": "hmm1",
        "filename": "59791.png"
    },
    "59792": {
        "code": 59792,
        "name": "hmmge",
        "filename": "59792.png"
    },
    "59793": {
        "code": 59793,
        "name": "hmmrun",
        "filename": "59793.png"
    },
    "59794": {
        "code": 59794,
        "name": "hollowpeped",
        "filename": "59794.png"
    },
    "59795": {
        "code": 59795,
        "name": "homdge",
        "filename": "59795.png"
    },
    "59796": {
        "code": 59796,
        "name": "homerpepe",
        "filename": "59796.png"
    },
    "59797": {
        "code": 59797,
        "name": "hugers",
        "filename": "59797.png"
    },
    "59798": {
        "code": 59798,
        "name": "hyperslpink",
        "filename": "59798.png"
    },
    "59799": {
        "code": 59799,
        "name": "inspect",
        "filename": "59799.png"
    },
    "59800": {
        "code": 59800,
        "name": "invert_happy_pepe",
        "filename": "59800.png"
    },
    "59801": {
        "code": 59801,
        "name": "jacked_pepe",
        "filename": "59801.png"
    },
    "59802": {
        "code": 59802,
        "name": "jailpepe",
        "filename": "59802.png"
    },
    "59803": {
        "code": 59803,
        "name": "jammies",
        "filename": "59803.png"
    },
    "59804": {
        "code": 59804,
        "name": "jiggle",
        "filename": "59804.png"
    },
    "59805": {
        "code": 59805,
        "name": "kekamid",
        "filename": "59805.png"
    },
    "59806": {
        "code": 59806,
        "name": "kekega",
        "filename": "59806.png"
    },
    "59807": {
        "code": 59807,
        "name": "kekexplode",
        "filename": "59807.png"
    },
    "59808": {
        "code": 59808,
        "name": "kekwpain",
        "filename": "59808.png"
    },
    "59809": {
        "code": 59809,
        "name": "killerkoalas",
        "filename": "59809.png"
    },
    "59810": {
        "code": 59810,
        "name": "lightblue_heartspin",
        "filename": "59810.png"
    },
    "59811": {
        "code": 59811,
        "name": "lisamadge",
        "filename": "59811.png"
    },
    "59812": {
        "code": 59812,
        "name": "loliguess",
        "filename": "59812.png"
    },
    "59813": {
        "code": 59813,
        "name": "lurkingpepe",
        "filename": "59813.png"
    },
    "59814": {
        "code": 59814,
        "name": "madge",
        "filename": "59814.png"
    },
    "59815": {
        "code": 59815,
        "name": "maracaspeped",
        "filename": "59815.png"
    },
    "59816": {
        "code": 59816,
        "name": "maradona_angry",
        "filename": "59816.png"
    },
    "59817": {
        "code": 59817,
        "name": "mardgye",
        "filename": "59817.png"
    },
    "59818": {
        "code": 59818,
        "name": "me",
        "filename": "59818.png"
    },
    "59819": {
        "code": 59819,
        "name": "monaks",
        "filename": "59819.png"
    },
    "59820": {
        "code": 59820,
        "name": "monkasweat",
        "filename": "59820.png"
    },
    "59821": {
        "code": 59821,
        "name": "monkathink",
        "filename": "59821.png"
    },
    "59822": {
        "code": 59822,
        "name": "neko_pepe",
        "filename": "59822.png"
    },
    "59823": {
        "code": 59823,
        "name": "nerdge",
        "filename": "59823.png"
    },
    "59824": {
        "code": 59824,
        "name": "nezupepe",
        "filename": "59824.png"
    },
    "59825": {
        "code": 59825,
        "name": "nitro_classic",
        "filename": "59825.png"
    },
    "59826": {
        "code": 59826,
        "name": "no_maidens",
        "filename": "59826.png"
    },
    "59827": {
        "code": 59827,
        "name": "no_u_pepe_sign",
        "filename": "59827.png"
    },
    "59828": {
        "code": 59828,
        "name": "nobody_cares_pepe",
        "filename": "59828.png"
    },
    "59829": {
        "code": 59829,
        "name": "noppers",
        "filename": "59829.png"
    },
    "59830": {
        "code": 59830,
        "name": "ok_boomer",
        "filename": "59830.png"
    },
    "59831": {
        "code": 59831,
        "name": "okayeg",
        "filename": "59831.png"
    },
    "59832": {
        "code": 59832,
        "name": "okayge",
        "filename": "59832.png"
    },
    "59833": {
        "code": 59833,
        "name": "okayman",
        "filename": "59833.png"
    },
    "59834": {
        "code": 59834,
        "name": "omegaluliguess",
        "filename": "59834.png"
    },
    "59835": {
        "code": 59835,
        "name": "paimonshootpepe",
        "filename": "59835.png"
    },
    "59836": {
        "code": 59836,
        "name": "palpzap",
        "filename": "59836.png"
    },
    "59837": {
        "code": 59837,
        "name": "pancakepepe",
        "filename": "59837.png"
    },
    "59838": {
        "code": 59838,
        "name": "pangel",
        "filename": "59838.png"
    },
    "59839": {
        "code": 59839,
        "name": "pangry",
        "filename": "59839.png"
    },
    "59840": {
        "code": 59840,
        "name": "peepo4kleave",
        "filename": "59840.png"
    },
    "59841": {
        "code": 59841,
        "name": "peepocoffeehiss",
        "filename": "59841.png"
    },
    "59842": {
        "code": 59842,
        "name": "peepocroche",
        "filename": "59842.png"
    },
    "59843": {
        "code": 59843,
        "name": "peepoteddydreaming",
        "filename": "59843.png"
    },
    "59844": {
        "code": 59844,
        "name": "peepo_ban",
        "filename": "59844.png"
    },
    "59845": {
        "code": 59845,
        "name": "peepo_creepy",
        "filename": "59845.png"
    },
    "59846": {
        "code": 59846,
        "name": "peepo_cry_swim",
        "filename": "59846.png"
    },
    "59847": {
        "code": 59847,
        "name": "peepo_happy",
        "filename": "59847.png"
    },
    "59848": {
        "code": 59848,
        "name": "peepo_hi",
        "filename": "59848.png"
    },
    "59849": {
        "code": 59849,
        "name": "peepo_mute",
        "filename": "59849.png"
    },
    "59850": {
        "code": 59850,
        "name": "peepo_no",
        "filename": "59850.png"
    },
    "59851": {
        "code": 59851,
        "name": "peepo_ok_admins",
        "filename": "59851.png"
    },
    "59852": {
        "code": 59852,
        "name": "peepo_pixel_art",
        "filename": "59852.png"
    },
    "59853": {
        "code": 59853,
        "name": "peepo_pumpkin_dance",
        "filename": "59853.png"
    },
    "59854": {
        "code": 59854,
        "name": "peepo_run",
        "filename": "59854.png"
    },
    "59855": {
        "code": 59855,
        "name": "peepo_toxic",
        "filename": "59855.png"
    },
    "59856": {
        "code": 59856,
        "name": "peepo_yes",
        "filename": "59856.png"
    },
    "59857": {
        "code": 59857,
        "name": "peepoangel",
        "filename": "59857.png"
    },
    "59858": {
        "code": 59858,
        "name": "peepoangerydownvote",
        "filename": "59858.png"
    },
    "59859": {
        "code": 59859,
        "name": "peepoanimecaught",
        "filename": "59859.png"
    },
    "59860": {
        "code": 59860,
        "name": "peepoarrive",
        "filename": "59860.png"
    },
    "59861": {
        "code": 59861,
        "name": "peepoaxe",
        "filename": "59861.png"
    },
    "59862": {
        "code": 59862,
        "name": "peepobackflip",
        "filename": "59862.png"
    },
    "59863": {
        "code": 59863,
        "name": "peepoballa",
        "filename": "59863.png"
    },
    "59864": {
        "code": 59864,
        "name": "peepoban",
        "filename": "59864.png"
    },
    "59865": {
        "code": 59865,
        "name": "peepobanana",
        "filename": "59865.png"
    },
    "59866": {
        "code": 59866,
        "name": "peepobeanbag",
        "filename": "59866.png"
    },
    "59867": {
        "code": 59867,
        "name": "peepoberry",
        "filename": "59867.png"
    },
    "59868": {
        "code": 59868,
        "name": "peepoblankethd",
        "filename": "59868.png"
    },
    "59869": {
        "code": 59869,
        "name": "peepoblanketshare",
        "filename": "59869.png"
    },
    "59870": {
        "code": 59870,
        "name": "peepoblink",
        "filename": "59870.png"
    },
    "59871": {
        "code": 59871,
        "name": "peepobonk",
        "filename": "59871.png"
    },
    "59872": {
        "code": 59872,
        "name": "peepobusinesstux",
        "filename": "59872.png"
    },
    "59873": {
        "code": 59873,
        "name": "peepocandy",
        "filename": "59873.png"
    },
    "59874": {
        "code": 59874,
        "name": "peepochomky",
        "filename": "59874.png"
    },
    "59875": {
        "code": 59875,
        "name": "peepocomfy",
        "filename": "59875.png"
    },
    "59876": {
        "code": 59876,
        "name": "peepoconfetti",
        "filename": "59876.png"
    },
    "59877": {
        "code": 59877,
        "name": "peepocry",
        "filename": "59877.png"
    },
    "59878": {
        "code": 59878,
        "name": "peepocryingban",
        "filename": "59878.png"
    },
    "59879": {
        "code": 59879,
        "name": "peepocute",
        "filename": "59879.png"
    },
    "59880": {
        "code": 59880,
        "name": "peepodababy",
        "filename": "59880.png"
    },
    "59881": {
        "code": 59881,
        "name": "peepodancingduck",
        "filename": "59881.png"
    },
    "59882": {
        "code": 59882,
        "name": "peepodetective",
        "filename": "59882.png"
    },
    "59883": {
        "code": 59883,
        "name": "peepodino",
        "filename": "59883.png"
    },
    "59884": {
        "code": 59884,
        "name": "peepoenlighten",
        "filename": "59884.png"
    },
    "59885": {
        "code": 59885,
        "name": "peepoenter",
        "filename": "59885.png"
    },
    "59886": {
        "code": 59886,
        "name": "peepoevil",
        "filename": "59886.png"
    },
    "59887": {
        "code": 59887,
        "name": "peepofetish",
        "filename": "59887.png"
    },
    "59888": {
        "code": 59888,
        "name": "peepoflame",
        "filename": "59888.png"
    },
    "59889": {
        "code": 59889,
        "name": "peepofloshed",
        "filename": "59889.png"
    },
    "59890": {
        "code": 59890,
        "name": "peepogun",
        "filename": "59890.png"
    },
    "59891": {
        "code": 59891,
        "name": "peepohands",
        "filename": "59891.png"
    },
    "59892": {
        "code": 59892,
        "name": "peepohandsup",
        "filename": "59892.png"
    },
    "59893": {
        "code": 59893,
        "name": "peepohappy",
        "filename": "59893.png"
    },
    "59894": {
        "code": 59894,
        "name": "peepohappygun",
        "filename": "59894.png"
    },
    "59895": {
        "code": 59895,
        "name": "peepoheart",
        "filename": "59895.png"
    },
    "59896": {
        "code": 59896,
        "name": "peepohey",
        "filename": "59896.png"
    },
    "59897": {
        "code": 59897,
        "name": "peepohurensohn",
        "filename": "59897.png"
    },
    "59899": {
        "code": 59899,
        "name": "peepoinstitutions",
        "filename": "59899.png"
    },
    "59900": {
        "code": 59900,
        "name": "peepoinvestigate",
        "filename": "59900.png"
    },
    "59901": {
        "code": 59901,
        "name": "peepojam",
        "filename": "59901.png"
    },
    "59902": {
        "code": 59902,
        "name": "peepolove",
        "filename": "59902.png"
    },
    "59903": {
        "code": 59903,
        "name": "peepomenacing",
        "filename": "59903.png"
    },
    "59904": {
        "code": 59904,
        "name": "peepominecraft",
        "filename": "59904.png"
    },
    "59905": {
        "code": 59905,
        "name": "peepomoney",
        "filename": "59905.png"
    },
    "59906": {
        "code": 59906,
        "name": "peeponewyear",
        "filename": "59906.png"
    },
    "59907": {
        "code": 59907,
        "name": "peeponoob",
        "filename": "59907.png"
    },
    "59908": {
        "code": 59908,
        "name": "peeponotstonks",
        "filename": "59908.png"
    },
    "59909": {
        "code": 59909,
        "name": "peepookayzoomer",
        "filename": "59909.png"
    },
    "59910": {
        "code": 59910,
        "name": "peepoonly2genders",
        "filename": "59910.png"
    },
    "59911": {
        "code": 59911,
        "name": "peepopillow",
        "filename": "59911.png"
    },
    "59912": {
        "code": 59912,
        "name": "peeporich",
        "filename": "59912.png"
    },
    "59913": {
        "code": 59913,
        "name": "peeporiot",
        "filename": "59913.png"
    },
    "59914": {
        "code": 59914,
        "name": "peeporomania",
        "filename": "59914.png"
    },
    "59915": {
        "code": 59915,
        "name": "peeporose",
        "filename": "59915.png"
    },
    "59916": {
        "code": 59916,
        "name": "peeporules",
        "filename": "59916.png"
    },
    "59917": {
        "code": 59917,
        "name": "peeporunsanta",
        "filename": "59917.png"
    },
    "59918": {
        "code": 59918,
        "name": "peeposad",
        "filename": "59918.png"
    },
    "59919": {
        "code": 59919,
        "name": "peeposadblanket",
        "filename": "59919.png"
    },
    "59920": {
        "code": 59920,
        "name": "peeposanta",
        "filename": "59920.png"
    },
    "59921": {
        "code": 59921,
        "name": "peeposcam",
        "filename": "59921.png"
    },
    "59922": {
        "code": 59922,
        "name": "peeposhy",
        "filename": "59922.png"
    },
    "59923": {
        "code": 59923,
        "name": "peeposignboobs",
        "filename": "59923.png"
    },
    "59924": {
        "code": 59924,
        "name": "peeposimp",
        "filename": "59924.png"
    },
    "59926": {
        "code": 59926,
        "name": "peepostonks",
        "filename": "59926.png"
    },
    "59927": {
        "code": 59927,
        "name": "peeposuspiciouswithbeard",
        "filename": "59927.png"
    },
    "59928": {
        "code": 59928,
        "name": "peeposusshoot",
        "filename": "59928.png"
    },
    "59929": {
        "code": 59929,
        "name": "peepotalk",
        "filename": "59929.png"
    },
    "59930": {
        "code": 59930,
        "name": "peepoteddycrying",
        "filename": "59930.png"
    },
    "59931": {
        "code": 59931,
        "name": "peepotired",
        "filename": "59931.png"
    },
    "59932": {
        "code": 59932,
        "name": "peepotoilet",
        "filename": "59932.png"
    },
    "59933": {
        "code": 59933,
        "name": "peepoukraine",
        "filename": "59933.png"
    },
    "59934": {
        "code": 59934,
        "name": "peepouno",
        "filename": "59934.png"
    },
    "59935": {
        "code": 59935,
        "name": "peepoupvote",
        "filename": "59935.png"
    },
    "59936": {
        "code": 59936,
        "name": "peepoveryhappy",
        "filename": "59936.png"
    },
    "59937": {
        "code": 59937,
        "name": "peepowait",
        "filename": "59937.png"
    },
    "59938": {
        "code": 59938,
        "name": "peepowave",
        "filename": "59938.png"
    },
    "59939": {
        "code": 59939,
        "name": "peepoweary",
        "filename": "59939.png"
    },
    "59940": {
        "code": 59940,
        "name": "peepoweirdlooking",
        "filename": "59940.png"
    },
    "59941": {
        "code": 59941,
        "name": "peepowhyareyoudum",
        "filename": "59941.png"
    },
    "59942": {
        "code": 59942,
        "name": "peepowicked",
        "filename": "59942.png"
    },
    "59943": {
        "code": 59943,
        "name": "peepowow",
        "filename": "59943.png"
    },
    "59944": {
        "code": 59944,
        "name": "peepoyeet",
        "filename": "59944.png"
    },
    "59945": {
        "code": 59945,
        "name": "peepoyes",
        "filename": "59945.png"
    },
    "59946": {
        "code": 59946,
        "name": "peepoyessir",
        "filename": "59946.png"
    },
    "59947": {
        "code": 59947,
        "name": "peepoyum",
        "filename": "59947.png"
    },
    "59948": {
        "code": 59948,
        "name": "pep_army",
        "filename": "59948.png"
    },
    "59949": {
        "code": 59949,
        "name": "pep_high_five_1",
        "filename": "59949.png"
    },
    "59950": {
        "code": 59950,
        "name": "pep_stab",
        "filename": "59950.png"
    },
    "59951": {
        "code": 59951,
        "name": "pepe",
        "filename": "59951.png"
    },
    "59953": {
        "code": 59953,
        "name": "peped",
        "filename": "59953.png"
    },
    "59954": {
        "code": 59954,
        "name": "pepe_1",
        "filename": "59954.png"
    },
    "59955": {
        "code": 59955,
        "name": "pepe_10",
        "filename": "59955.png"
    },
    "59956": {
        "code": 59956,
        "name": "pepe_11",
        "filename": "59956.png"
    },
    "59957": {
        "code": 59957,
        "name": "pepe_12",
        "filename": "59957.png"
    },
    "59958": {
        "code": 59958,
        "name": "pepe_13",
        "filename": "59958.png"
    },
    "59959": {
        "code": 59959,
        "name": "pepe_14",
        "filename": "59959.png"
    },
    "59960": {
        "code": 59960,
        "name": "pepe_15",
        "filename": "59960.png"
    },
    "59961": {
        "code": 59961,
        "name": "pepe_16",
        "filename": "59961.png"
    },
    "59962": {
        "code": 59962,
        "name": "pepe_17",
        "filename": "59962.png"
    },
    "59963": {
        "code": 59963,
        "name": "pepe_18",
        "filename": "59963.png"
    },
    "59964": {
        "code": 59964,
        "name": "pepe_19",
        "filename": "59964.png"
    },
    "59965": {
        "code": 59965,
        "name": "pepe_2",
        "filename": "59965.png"
    },
    "59966": {
        "code": 59966,
        "name": "pepe_20",
        "filename": "59966.png"
    },
    "59967": {
        "code": 59967,
        "name": "pepe_21",
        "filename": "59967.png"
    },
    "59968": {
        "code": 59968,
        "name": "pepe_22",
        "filename": "59968.png"
    },
    "59969": {
        "code": 59969,
        "name": "pepe_23",
        "filename": "59969.png"
    },
    "59970": {
        "code": 59970,
        "name": "pepe_24",
        "filename": "59970.png"
    },
    "59971": {
        "code": 59971,
        "name": "pepe_25",
        "filename": "59971.png"
    },
    "59972": {
        "code": 59972,
        "name": "pepe_3",
        "filename": "59972.png"
    },
    "59973": {
        "code": 59973,
        "name": "pepe_3dsmirk",
        "filename": "59973.png"
    },
    "59974": {
        "code": 59974,
        "name": "pepe_3dspin",
        "filename": "59974.png"
    },
    "59975": {
        "code": 59975,
        "name": "pepe_4",
        "filename": "59975.png"
    },
    "59976": {
        "code": 59976,
        "name": "pepe_4k",
        "filename": "59976.png"
    },
    "59977": {
        "code": 59977,
        "name": "pepe_5",
        "filename": "59977.png"
    },
    "59978": {
        "code": 59978,
        "name": "pepe_6",
        "filename": "59978.png"
    },
    "59979": {
        "code": 59979,
        "name": "pepe_60",
        "filename": "59979.png"
    },
    "59980": {
        "code": 59980,
        "name": "pepe_7",
        "filename": "59980.png"
    },
    "59981": {
        "code": 59981,
        "name": "pepe_8",
        "filename": "59981.png"
    },
    "59982": {
        "code": 59982,
        "name": "pepe_9",
        "filename": "59982.png"
    },
    "59983": {
        "code": 59983,
        "name": "pepe_adolf",
        "filename": "59983.png"
    },
    "59984": {
        "code": 59984,
        "name": "pepe_agiota",
        "filename": "59984.png"
    },
    "59985": {
        "code": 59985,
        "name": "pepe_ahaa",
        "filename": "59985.png"
    },
    "59986": {
        "code": 59986,
        "name": "pepe_ahegao",
        "filename": "59986.png"
    },
    "59987": {
        "code": 59987,
        "name": "pepe_angel",
        "filename": "59987.png"
    },
    "59988": {
        "code": 59988,
        "name": "pepe_angry",
        "filename": "59988.png"
    },
    "59989": {
        "code": 59989,
        "name": "pepe_angry_communist",
        "filename": "59989.png"
    },
    "59990": {
        "code": 59990,
        "name": "pepe_angry_kid",
        "filename": "59990.png"
    },
    "59991": {
        "code": 59991,
        "name": "pepe_angry_ping",
        "filename": "59991.png"
    },
    "59992": {
        "code": 59992,
        "name": "pepe_angry_police",
        "filename": "59992.png"
    },
    "59993": {
        "code": 59993,
        "name": "pepe_angry_scimitar",
        "filename": "59993.png"
    },
    "59994": {
        "code": 59994,
        "name": "pepe_anime",
        "filename": "59994.png"
    },
    "59995": {
        "code": 59995,
        "name": "pepe_annoyed",
        "filename": "59995.png"
    },
    "59996": {
        "code": 59996,
        "name": "pepe_argento",
        "filename": "59996.png"
    },
    "59997": {
        "code": 59997,
        "name": "pepe_aussie",
        "filename": "59997.png"
    },
    "59998": {
        "code": 59998,
        "name": "pepe_awkward",
        "filename": "59998.png"
    },
    "59999": {
        "code": 59999,
        "name": "pepe_back_off",
        "filename": "59999.png"
    },
    "60000": {
        "code": 60000,
        "name": "pepe_baguette",
        "filename": "60000.png"
    },
    "60001": {
        "code": 60001,
        "name": "pepe_baguetteberet",
        "filename": "60001.png"
    },
    "60002": {
        "code": 60002,
        "name": "pepe_ban",
        "filename": "60002.png"
    },
    "60003": {
        "code": 60003,
        "name": "pepe_band",
        "filename": "60003.png"
    },
    "60004": {
        "code": 60004,
        "name": "pepe_banned",
        "filename": "60004.png"
    },
    "60005": {
        "code": 60005,
        "name": "pepe_batman",
        "filename": "60005.png"
    },
    "60006": {
        "code": 60006,
        "name": "pepe_big_brain",
        "filename": "60006.png"
    },
    "60007": {
        "code": 60007,
        "name": "pepe_big_eyes",
        "filename": "60007.png"
    },
    "60008": {
        "code": 60008,
        "name": "pepe_blackmetal",
        "filename": "60008.png"
    },
    "60009": {
        "code": 60009,
        "name": "pepe_blanket",
        "filename": "60009.png"
    },
    "60010": {
        "code": 60010,
        "name": "pepe_bloodshot",
        "filename": "60010.png"
    },
    "60011": {
        "code": 60011,
        "name": "pepe_bonk",
        "filename": "60011.png"
    },
    "60012": {
        "code": 60012,
        "name": "pepe_boost",
        "filename": "60012.png"
    },
    "60013": {
        "code": 60013,
        "name": "pepe_bored_toy",
        "filename": "60013.png"
    },
    "60014": {
        "code": 60014,
        "name": "pepe_box",
        "filename": "60014.png"
    },
    "60015": {
        "code": 60015,
        "name": "pepe_boxer",
        "filename": "60015.png"
    },
    "60016": {
        "code": 60016,
        "name": "pepe_bruh",
        "filename": "60016.png"
    },
    "60017": {
        "code": 60017,
        "name": "pepe_business",
        "filename": "60017.png"
    },
    "60018": {
        "code": 60018,
        "name": "pepe_call",
        "filename": "60018.png"
    },
    "60019": {
        "code": 60019,
        "name": "pepe_car",
        "filename": "60019.png"
    },
    "60020": {
        "code": 60020,
        "name": "pepe_cardgreen",
        "filename": "60020.png"
    },
    "60021": {
        "code": 60021,
        "name": "pepe_cardred",
        "filename": "60021.png"
    },
    "60022": {
        "code": 60022,
        "name": "pepe_cardyellow",
        "filename": "60022.png"
    },
    "60023": {
        "code": 60023,
        "name": "pepe_cat_cry",
        "filename": "60023.png"
    },
    "60024": {
        "code": 60024,
        "name": "pepe_cat_cry_2",
        "filename": "60024.png"
    },
    "60025": {
        "code": 60025,
        "name": "pepe_cat_roll",
        "filename": "60025.png"
    },
    "60026": {
        "code": 60026,
        "name": "pepe_caughtin4k",
        "filename": "60026.png"
    },
    "60027": {
        "code": 60027,
        "name": "pepe_celebrate_confetti",
        "filename": "60027.png"
    },
    "60028": {
        "code": 60028,
        "name": "pepe_cheer",
        "filename": "60028.png"
    },
    "60029": {
        "code": 60029,
        "name": "pepe_chips",
        "filename": "60029.png"
    },
    "60030": {
        "code": 60030,
        "name": "pepe_chrome",
        "filename": "60030.png"
    },
    "60031": {
        "code": 60031,
        "name": "pepe_chubby",
        "filename": "60031.png"
    },
    "60032": {
        "code": 60032,
        "name": "pepe_cia",
        "filename": "60032.png"
    },
    "60033": {
        "code": 60033,
        "name": "pepe_cigarette",
        "filename": "60033.png"
    },
    "60034": {
        "code": 60034,
        "name": "pepe_cigarettesmoke",
        "filename": "60034.png"
    },
    "60035": {
        "code": 60035,
        "name": "pepe_clap",
        "filename": "60035.png"
    },
    "60036": {
        "code": 60036,
        "name": "pepe_cookie",
        "filename": "60036.png"
    },
    "60037": {
        "code": 60037,
        "name": "pepe_cool",
        "filename": "60037.png"
    },
    "60038": {
        "code": 60038,
        "name": "pepe_coolclap",
        "filename": "60038.png"
    },
    "60039": {
        "code": 60039,
        "name": "pepe_copium",
        "filename": "60039.png"
    },
    "60040": {
        "code": 60040,
        "name": "pepe_copter",
        "filename": "60040.png"
    },
    "60041": {
        "code": 60041,
        "name": "pepe_cough",
        "filename": "60041.png"
    },
    "60042": {
        "code": 60042,
        "name": "pepe_cowboy",
        "filename": "60042.png"
    },
    "60043": {
        "code": 60043,
        "name": "pepe_crazy_write",
        "filename": "60043.png"
    },
    "60044": {
        "code": 60044,
        "name": "pepe_cross",
        "filename": "60044.png"
    },
    "60045": {
        "code": 60045,
        "name": "pepe_crown",
        "filename": "60045.png"
    },
    "60046": {
        "code": 60046,
        "name": "pepe_crown_flip",
        "filename": "60046.png"
    },
    "60047": {
        "code": 60047,
        "name": "pepe_cry",
        "filename": "60047.png"
    },
    "60048": {
        "code": 60048,
        "name": "pepe_cry_groovin",
        "filename": "60048.png"
    },
    "60049": {
        "code": 60049,
        "name": "pepe_crydrink",
        "filename": "60049.png"
    },
    "60050": {
        "code": 60050,
        "name": "pepe_crying",
        "filename": "60050.png"
    },
    "60051": {
        "code": 60051,
        "name": "pepe_dab",
        "filename": "60051.png"
    },
    "60052": {
        "code": 60052,
        "name": "pepe_dababy",
        "filename": "60052.png"
    },
    "60053": {
        "code": 60053,
        "name": "pepe_damn",
        "filename": "60053.png"
    },
    "60054": {
        "code": 60054,
        "name": "pepe_dance",
        "filename": "60054.png"
    },
    "60055": {
        "code": 60055,
        "name": "pepe_danceru",
        "filename": "60055.png"
    },
    "60056": {
        "code": 60056,
        "name": "pepe_deformed",
        "filename": "60056.png"
    },
    "60057": {
        "code": 60057,
        "name": "pepe_deletethis",
        "filename": "60057.png"
    },
    "60058": {
        "code": 60058,
        "name": "pepe_deppresed",
        "filename": "60058.png"
    },
    "60059": {
        "code": 60059,
        "name": "pepe_derp",
        "filename": "60059.png"
    },
    "60060": {
        "code": 60060,
        "name": "pepe_devil",
        "filename": "60060.png"
    },
    "60061": {
        "code": 60061,
        "name": "pepe_diamond_sword",
        "filename": "60061.png"
    },
    "60062": {
        "code": 60062,
        "name": "pepe_dipsy",
        "filename": "60062.png"
    },
    "60063": {
        "code": 60063,
        "name": "pepe_disabled_poggers",
        "filename": "60063.png"
    },
    "60064": {
        "code": 60064,
        "name": "pepe_disco_dance",
        "filename": "60064.png"
    },
    "60065": {
        "code": 60065,
        "name": "pepe_driver",
        "filename": "60065.png"
    },
    "60066": {
        "code": 60066,
        "name": "pepe_drums",
        "filename": "60066.png"
    },
    "60067": {
        "code": 60067,
        "name": "pepe_eggplant",
        "filename": "60067.png"
    },
    "60068": {
        "code": 60068,
        "name": "pepe_elon_musk",
        "filename": "60068.png"
    },
    "60069": {
        "code": 60069,
        "name": "pepe_emoji_sign",
        "filename": "60069.png"
    },
    "60070": {
        "code": 60070,
        "name": "pepe_enchanted_diamond_sword",
        "filename": "60070.png"
    },
    "60071": {
        "code": 60071,
        "name": "pepe_enchanted_netherite_sword",
        "filename": "60071.png"
    },
    "60072": {
        "code": 60072,
        "name": "pepe_excited",
        "filename": "60072.png"
    },
    "60073": {
        "code": 60073,
        "name": "pepe_explode",
        "filename": "60073.png"
    },
    "60074": {
        "code": 60074,
        "name": "pepe_eye_fat",
        "filename": "60074.png"
    },
    "60075": {
        "code": 60075,
        "name": "pepe_eyeroll",
        "filename": "60075.png"
    },
    "60076": {
        "code": 60076,
        "name": "pepe_ez",
        "filename": "60076.png"
    },
    "60077": {
        "code": 60077,
        "name": "pepe_facepalm",
        "filename": "60077.png"
    },
    "60078": {
        "code": 60078,
        "name": "pepe_fansniff",
        "filename": "60078.png"
    },
    "60079": {
        "code": 60079,
        "name": "pepe_fast_run",
        "filename": "60079.png"
    },
    "60080": {
        "code": 60080,
        "name": "pepe_fbi_dumb",
        "filename": "60080.png"
    },
    "60081": {
        "code": 60081,
        "name": "pepe_fcku",
        "filename": "60081.png"
    },
    "60082": {
        "code": 60082,
        "name": "pepe_feelsadman",
        "filename": "60082.png"
    },
    "60083": {
        "code": 60083,
        "name": "pepe_feelsbadman",
        "filename": "60083.png"
    },
    "60084": {
        "code": 60084,
        "name": "pepe_feelsgoodman",
        "filename": "60084.png"
    },
    "60085": {
        "code": 60085,
        "name": "pepe_fisherman",
        "filename": "60085.png"
    },
    "60086": {
        "code": 60086,
        "name": "pepe_fla",
        "filename": "60086.png"
    },
    "60087": {
        "code": 60087,
        "name": "pepe_flame",
        "filename": "60087.png"
    },
    "60088": {
        "code": 60088,
        "name": "pepe_flex",
        "filename": "60088.png"
    },
    "60089": {
        "code": 60089,
        "name": "pepe_flower",
        "filename": "60089.png"
    },
    "60090": {
        "code": 60090,
        "name": "pepe_flushed",
        "filename": "60090.png"
    },
    "60091": {
        "code": 60091,
        "name": "pepe_forever_alone",
        "filename": "60091.png"
    },
    "60092": {
        "code": 60092,
        "name": "pepe_fuck_you",
        "filename": "60092.png"
    },
    "60093": {
        "code": 60093,
        "name": "pepe_fury",
        "filename": "60093.png"
    },
    "60094": {
        "code": 60094,
        "name": "pepe_gimme_corona",
        "filename": "60094.png"
    },
    "60095": {
        "code": 60095,
        "name": "pepe_glare",
        "filename": "60095.png"
    },
    "60096": {
        "code": 60096,
        "name": "pepe_goose_ride",
        "filename": "60096.png"
    },
    "60097": {
        "code": 60097,
        "name": "pepe_goosed_out",
        "filename": "60097.png"
    },
    "60098": {
        "code": 60098,
        "name": "pepe_gostface_red_evil",
        "filename": "60098.png"
    },
    "60099": {
        "code": 60099,
        "name": "pepe_graduate",
        "filename": "60099.png"
    },
    "60100": {
        "code": 60100,
        "name": "pepe_grin_reaper",
        "filename": "60100.png"
    },
    "60101": {
        "code": 60101,
        "name": "pepe_guitar",
        "filename": "60101.png"
    },
    "60102": {
        "code": 60102,
        "name": "pepe_gun",
        "filename": "60102.png"
    },
    "60103": {
        "code": 60103,
        "name": "pepe_guns",
        "filename": "60103.png"
    },
    "60104": {
        "code": 60104,
        "name": "pepe_hack",
        "filename": "60104.png"
    },
    "60105": {
        "code": 60105,
        "name": "pepe_hacker",
        "filename": "60105.png"
    },
    "60106": {
        "code": 60106,
        "name": "pepe_haha_noob",
        "filename": "60106.png"
    },
    "60107": {
        "code": 60107,
        "name": "pepe_halloween",
        "filename": "60107.png"
    },
    "60108": {
        "code": 60108,
        "name": "pepe_hamburger",
        "filename": "60108.png"
    },
    "60109": {
        "code": 60109,
        "name": "pepe_hammer",
        "filename": "60109.png"
    },
    "60110": {
        "code": 60110,
        "name": "pepe_happy",
        "filename": "60110.png"
    },
    "60111": {
        "code": 60111,
        "name": "pepe_happyeyes",
        "filename": "60111.png"
    },
    "60112": {
        "code": 60112,
        "name": "pepe_headphones",
        "filename": "60112.png"
    },
    "60113": {
        "code": 60113,
        "name": "pepe_headset",
        "filename": "60113.png"
    },
    "60114": {
        "code": 60114,
        "name": "pepe_heart",
        "filename": "60114.png"
    },
    "60115": {
        "code": 60115,
        "name": "pepe_hearts",
        "filename": "60115.png"
    },
    "60116": {
        "code": 60116,
        "name": "pepe_heartstruck",
        "filename": "60116.png"
    },
    "60117": {
        "code": 60117,
        "name": "pepe_hellfire",
        "filename": "60117.png"
    },
    "60118": {
        "code": 60118,
        "name": "pepe_high",
        "filename": "60118.png"
    },
    "60119": {
        "code": 60119,
        "name": "pepe_high_five_2",
        "filename": "60119.png"
    },
    "60120": {
        "code": 60120,
        "name": "pepe_hmhmm",
        "filename": "60120.png"
    },
    "60121": {
        "code": 60121,
        "name": "pepe_hmm",
        "filename": "60121.png"
    },
    "60122": {
        "code": 60122,
        "name": "pepe_hoes_mad",
        "filename": "60122.png"
    },
    "60123": {
        "code": 60123,
        "name": "pepe_holy_scared",
        "filename": "60123.png"
    },
    "60124": {
        "code": 60124,
        "name": "pepe_hoodie_blue",
        "filename": "60124.png"
    },
    "60125": {
        "code": 60125,
        "name": "pepe_hoodie_red",
        "filename": "60125.png"
    },
    "60126": {
        "code": 60126,
        "name": "pepe_hug",
        "filename": "60126.png"
    },
    "60127": {
        "code": 60127,
        "name": "pepe_hype",
        "filename": "60127.png"
    },
    "60128": {
        "code": 60128,
        "name": "pepe_hyped",
        "filename": "60128.png"
    },
    "60129": {
        "code": 60129,
        "name": "pepe_iloveyou",
        "filename": "60129.png"
    },
    "60130": {
        "code": 60130,
        "name": "pepe_inspect",
        "filename": "60130.png"
    },
    "60131": {
        "code": 60131,
        "name": "pepe_jamming",
        "filename": "60131.png"
    },
    "60132": {
        "code": 60132,
        "name": "pepe_jet_bubbles",
        "filename": "60132.png"
    },
    "60133": {
        "code": 60133,
        "name": "pepe_joeycreepy",
        "filename": "60133.png"
    },
    "60134": {
        "code": 60134,
        "name": "pepe_joy",
        "filename": "60134.png"
    },
    "60135": {
        "code": 60135,
        "name": "pepe_juice",
        "filename": "60135.png"
    },
    "60136": {
        "code": 60136,
        "name": "pepe_jump",
        "filename": "60136.png"
    },
    "60137": {
        "code": 60137,
        "name": "pepe_karen",
        "filename": "60137.png"
    },
    "60138": {
        "code": 60138,
        "name": "pepe_kek",
        "filename": "60138.png"
    },
    "60139": {
        "code": 60139,
        "name": "pepe_kekw",
        "filename": "60139.png"
    },
    "60140": {
        "code": 60140,
        "name": "pepe_king",
        "filename": "60140.png"
    },
    "60141": {
        "code": 60141,
        "name": "pepe_kiss",
        "filename": "60141.png"
    },
    "60142": {
        "code": 60142,
        "name": "pepe_knickers_pink",
        "filename": "60142.png"
    },
    "60144": {
        "code": 60144,
        "name": "pepe_kraken",
        "filename": "60144.png"
    },
    "60145": {
        "code": 60145,
        "name": "pepe_krytoi",
        "filename": "60145.png"
    },
    "60146": {
        "code": 60146,
        "name": "pepe_kys",
        "filename": "60146.png"
    },
    "60147": {
        "code": 60147,
        "name": "pepe_l",
        "filename": "60147.png"
    },
    "60148": {
        "code": 60148,
        "name": "pepe_laalaa",
        "filename": "60148.png"
    },
    "60149": {
        "code": 60149,
        "name": "pepe_laugh",
        "filename": "60149.png"
    },
    "60150": {
        "code": 60150,
        "name": "pepe_legit",
        "filename": "60150.png"
    },
    "60151": {
        "code": 60151,
        "name": "pepe_lex",
        "filename": "60151.png"
    },
    "60152": {
        "code": 60152,
        "name": "pepe_lgbtq_bandana",
        "filename": "60152.png"
    },
    "60153": {
        "code": 60153,
        "name": "pepe_lgbtq_flag",
        "filename": "60153.png"
    },
    "60154": {
        "code": 60154,
        "name": "pepe_lgbtq_sign",
        "filename": "60154.png"
    },
    "60155": {
        "code": 60155,
        "name": "pepe_like",
        "filename": "60155.png"
    },
    "60156": {
        "code": 60156,
        "name": "pepe_lipbite",
        "filename": "60156.png"
    },
    "60157": {
        "code": 60157,
        "name": "pepe_love",
        "filename": "60157.png"
    },
    "60158": {
        "code": 60158,
        "name": "pepe_love_you",
        "filename": "60158.png"
    },
    "60159": {
        "code": 60159,
        "name": "pepe_loves_anime",
        "filename": "60159.png"
    },
    "60160": {
        "code": 60160,
        "name": "pepe_low_cost",
        "filename": "60160.png"
    },
    "60161": {
        "code": 60161,
        "name": "pepe_lurk",
        "filename": "60161.png"
    },
    "60162": {
        "code": 60162,
        "name": "pepe_machete",
        "filename": "60162.png"
    },
    "60163": {
        "code": 60163,
        "name": "pepe_mad",
        "filename": "60163.png"
    },
    "60164": {
        "code": 60164,
        "name": "pepe_mad_angry",
        "filename": "60164.png"
    },
    "60165": {
        "code": 60165,
        "name": "pepe_mad_jam",
        "filename": "60165.png"
    },
    "60166": {
        "code": 60166,
        "name": "pepe_mexican",
        "filename": "60166.png"
    },
    "60167": {
        "code": 60167,
        "name": "pepe_middlefinger",
        "filename": "60167.png"
    },
    "60168": {
        "code": 60168,
        "name": "pepe_millionaire",
        "filename": "60168.png"
    },
    "60169": {
        "code": 60169,
        "name": "pepe_mindblown",
        "filename": "60169.png"
    },
    "60170": {
        "code": 60170,
        "name": "pepe_mirror_vamp",
        "filename": "60170.png"
    },
    "60171": {
        "code": 60171,
        "name": "pepe_mods",
        "filename": "60171.png"
    },
    "60172": {
        "code": 60172,
        "name": "pepe_money",
        "filename": "60172.png"
    },
    "60173": {
        "code": 60173,
        "name": "pepe_nailbiting",
        "filename": "60173.png"
    },
    "60174": {
        "code": 60174,
        "name": "pepe_nani",
        "filename": "60174.png"
    },
    "60175": {
        "code": 60175,
        "name": "pepe_netherite_sword",
        "filename": "60175.png"
    },
    "60176": {
        "code": 60176,
        "name": "pepe_nice_dude",
        "filename": "60176.png"
    },
    "60177": {
        "code": 60177,
        "name": "pepe_nintendo",
        "filename": "60177.png"
    },
    "60178": {
        "code": 60178,
        "name": "pepe_nitro",
        "filename": "60178.png"
    },
    "60179": {
        "code": 60179,
        "name": "pepe_no",
        "filename": "60179.png"
    },
    "60180": {
        "code": 60180,
        "name": "pepe_no_wifi",
        "filename": "60180.png"
    },
    "60181": {
        "code": 60181,
        "name": "pepe_no_you",
        "filename": "60181.png"
    },
    "60182": {
        "code": 60182,
        "name": "pepe_noice",
        "filename": "60182.png"
    },
    "60183": {
        "code": 60183,
        "name": "pepe_noob",
        "filename": "60183.png"
    },
    "60184": {
        "code": 60184,
        "name": "pepe_nopes",
        "filename": "60184.png"
    },
    "60185": {
        "code": 60185,
        "name": "pepe_noted",
        "filename": "60185.png"
    },
    "60186": {
        "code": 60186,
        "name": "pepe_notlikethis",
        "filename": "60186.png"
    },
    "60187": {
        "code": 60187,
        "name": "pepe_nou",
        "filename": "60187.png"
    },
    "60188": {
        "code": 60188,
        "name": "pepe_oh",
        "filename": "60188.png"
    },
    "60189": {
        "code": 60189,
        "name": "pepe_ohgodno",
        "filename": "60189.png"
    },
    "60190": {
        "code": 60190,
        "name": "pepe_ok",
        "filename": "60190.png"
    },
    "60191": {
        "code": 60191,
        "name": "pepe_omg",
        "filename": "60191.png"
    },
    "60192": {
        "code": 60192,
        "name": "pepe_out",
        "filename": "60192.png"
    },
    "60193": {
        "code": 60193,
        "name": "pepe_panda",
        "filename": "60193.png"
    },
    "60194": {
        "code": 60194,
        "name": "pepe_paper",
        "filename": "60194.png"
    },
    "60195": {
        "code": 60195,
        "name": "pepe_partner_king",
        "filename": "60195.png"
    },
    "60196": {
        "code": 60196,
        "name": "pepe_party",
        "filename": "60196.png"
    },
    "60197": {
        "code": 60197,
        "name": "pepe_pat_sad",
        "filename": "60197.png"
    },
    "60198": {
        "code": 60198,
        "name": "pepe_peace",
        "filename": "60198.png"
    },
    "60199": {
        "code": 60199,
        "name": "pepe_peaceout",
        "filename": "60199.png"
    },
    "60200": {
        "code": 60200,
        "name": "pepe_peek",
        "filename": "60200.png"
    },
    "60201": {
        "code": 60201,
        "name": "pepe_pet",
        "filename": "60201.png"
    },
    "60202": {
        "code": 60202,
        "name": "pepe_petpet",
        "filename": "60202.png"
    },
    "60203": {
        "code": 60203,
        "name": "pepe_phone202",
        "filename": "60203.png"
    },
    "60204": {
        "code": 60204,
        "name": "pepe_photographer",
        "filename": "60204.png"
    },
    "60205": {
        "code": 60205,
        "name": "pepe_piano",
        "filename": "60205.png"
    },
    "60206": {
        "code": 60206,
        "name": "pepe_pillow",
        "filename": "60206.png"
    },
    "60207": {
        "code": 60207,
        "name": "pepe_pirate",
        "filename": "60207.png"
    },
    "60208": {
        "code": 60208,
        "name": "pepe_pizza",
        "filename": "60208.png"
    },
    "60209": {
        "code": 60209,
        "name": "pepe_pleaseshutup",
        "filename": "60209.png"
    },
    "60210": {
        "code": 60210,
        "name": "pepe_pls",
        "filename": "60210.png"
    },
    "60211": {
        "code": 60211,
        "name": "pepe_po",
        "filename": "60211.png"
    },
    "60212": {
        "code": 60212,
        "name": "pepe_pog",
        "filename": "60212.png"
    },
    "60213": {
        "code": 60213,
        "name": "pepe_police",
        "filename": "60213.png"
    },
    "60214": {
        "code": 60214,
        "name": "pepe_police_dog",
        "filename": "60214.png"
    },
    "60215": {
        "code": 60215,
        "name": "pepe_poooooopoo",
        "filename": "60215.png"
    },
    "60216": {
        "code": 60216,
        "name": "pepe_popcorn",
        "filename": "60216.png"
    },
    "60217": {
        "code": 60217,
        "name": "pepe_pray",
        "filename": "60217.png"
    },
    "60218": {
        "code": 60218,
        "name": "pepe_present",
        "filename": "60218.png"
    },
    "60219": {
        "code": 60219,
        "name": "pepe_pride",
        "filename": "60219.png"
    },
    "60220": {
        "code": 60220,
        "name": "pepe_prideheart",
        "filename": "60220.png"
    },
    "60221": {
        "code": 60221,
        "name": "pepe_prisonmike",
        "filename": "60221.png"
    },
    "60222": {
        "code": 60222,
        "name": "pepe_puke",
        "filename": "60222.png"
    },
    "60223": {
        "code": 60223,
        "name": "pepe_punch",
        "filename": "60223.png"
    },
    "60224": {
        "code": 60224,
        "name": "pepe_purplecrown",
        "filename": "60224.png"
    },
    "60225": {
        "code": 60225,
        "name": "pepe_rage",
        "filename": "60225.png"
    },
    "60226": {
        "code": 60226,
        "name": "pepe_rain",
        "filename": "60226.png"
    },
    "60227": {
        "code": 60227,
        "name": "pepe_rainbow_lgbt",
        "filename": "60227.png"
    },
    "60228": {
        "code": 60228,
        "name": "pepe_raincoat",
        "filename": "60228.png"
    },
    "60229": {
        "code": 60229,
        "name": "pepe_redfury",
        "filename": "60229.png"
    },
    "60230": {
        "code": 60230,
        "name": "pepe_reeeeeeeeeeeee",
        "filename": "60230.png"
    },
    "60231": {
        "code": 60231,
        "name": "pepe_respected",
        "filename": "60231.png"
    },
    "60232": {
        "code": 60232,
        "name": "pepe_ride_dog",
        "filename": "60232.png"
    },
    "60233": {
        "code": 60233,
        "name": "pepe_saber_1",
        "filename": "60233.png"
    },
    "60234": {
        "code": 60234,
        "name": "pepe_saber_2",
        "filename": "60234.png"
    },
    "60235": {
        "code": 60235,
        "name": "pepe_sad",
        "filename": "60235.png"
    },
    "60236": {
        "code": 60236,
        "name": "pepe_sadhugs",
        "filename": "60236.png"
    },
    "60237": {
        "code": 60237,
        "name": "pepe_sadschrug",
        "filename": "60237.png"
    },
    "60238": {
        "code": 60238,
        "name": "pepe_salute",
        "filename": "60238.png"
    },
    "60239": {
        "code": 60239,
        "name": "pepe_sausage",
        "filename": "60239.png"
    },
    "60240": {
        "code": 60240,
        "name": "pepe_sheesh",
        "filename": "60240.png"
    },
    "60241": {
        "code": 60241,
        "name": "pepe_shine_eyes",
        "filename": "60241.png"
    },
    "60242": {
        "code": 60242,
        "name": "pepe_shirt",
        "filename": "60242.png"
    },
    "60243": {
        "code": 60243,
        "name": "pepe_shock",
        "filename": "60243.png"
    },
    "60244": {
        "code": 60244,
        "name": "pepe_shoot1",
        "filename": "60244.png"
    },
    "60245": {
        "code": 60245,
        "name": "pepe_shooting",
        "filename": "60245.png"
    },
    "60246": {
        "code": 60246,
        "name": "pepe_shotgun",
        "filename": "60246.png"
    },
    "60247": {
        "code": 60247,
        "name": "pepe_shots",
        "filename": "60247.png"
    },
    "60248": {
        "code": 60248,
        "name": "pepe_shutup",
        "filename": "60248.png"
    },
    "60249": {
        "code": 60249,
        "name": "pepe_shy",
        "filename": "60249.png"
    },
    "60250": {
        "code": 60250,
        "name": "pepe_simp",
        "filename": "60250.png"
    },
    "60251": {
        "code": 60251,
        "name": "pepe_sing",
        "filename": "60251.png"
    },
    "60252": {
        "code": 60252,
        "name": "pepe_sipspin",
        "filename": "60252.png"
    },
    "60253": {
        "code": 60253,
        "name": "pepe_sit",
        "filename": "60253.png"
    },
    "60254": {
        "code": 60254,
        "name": "pepe_sith",
        "filename": "60254.png"
    },
    "60255": {
        "code": 60255,
        "name": "pepe_slam",
        "filename": "60255.png"
    },
    "60256": {
        "code": 60256,
        "name": "pepe_sleep",
        "filename": "60256.png"
    },
    "60257": {
        "code": 60257,
        "name": "pepe_smile",
        "filename": "60257.png"
    },
    "60258": {
        "code": 60258,
        "name": "pepe_smirk",
        "filename": "60258.png"
    },
    "60259": {
        "code": 60259,
        "name": "pepe_smoke",
        "filename": "60259.png"
    },
    "60260": {
        "code": 60260,
        "name": "pepe_smug",
        "filename": "60260.png"
    },
    "60261": {
        "code": 60261,
        "name": "pepe_sorry",
        "filename": "60261.png"
    },
    "60262": {
        "code": 60262,
        "name": "pepe_spell_book",
        "filename": "60262.png"
    },
    "60263": {
        "code": 60263,
        "name": "pepe_spongebob",
        "filename": "60263.png"
    },
    "60264": {
        "code": 60264,
        "name": "pepe_star",
        "filename": "60264.png"
    },
    "60265": {
        "code": 60265,
        "name": "pepe_stare",
        "filename": "60265.png"
    },
    "60266": {
        "code": 60266,
        "name": "pepe_stareyes",
        "filename": "60266.png"
    },
    "60267": {
        "code": 60267,
        "name": "pepe_stop",
        "filename": "60267.png"
    },
    "60268": {
        "code": 60268,
        "name": "pepe_stop_gender",
        "filename": "60268.png"
    },
    "60269": {
        "code": 60269,
        "name": "pepe_studying",
        "filename": "60269.png"
    },
    "60270": {
        "code": 60270,
        "name": "pepe_suatmm",
        "filename": "60270.png"
    },
    "60271": {
        "code": 60271,
        "name": "pepe_suffering",
        "filename": "60271.png"
    },
    "60272": {
        "code": 60272,
        "name": "pepe_sunbaby",
        "filename": "60272.png"
    },
    "60273": {
        "code": 60273,
        "name": "pepe_sunglasses",
        "filename": "60273.png"
    },
    "60274": {
        "code": 60274,
        "name": "pepe_sunglasses_sit",
        "filename": "60274.png"
    },
    "60275": {
        "code": 60275,
        "name": "pepe_sus",
        "filename": "60275.png"
    },
    "60276": {
        "code": 60276,
        "name": "pepe_swag",
        "filename": "60276.png"
    },
    "60277": {
        "code": 60277,
        "name": "pepe_swat",
        "filename": "60277.png"
    },
    "60279": {
        "code": 60279,
        "name": "pepe_sweatsmile",
        "filename": "60279.png"
    },
    "60280": {
        "code": 60280,
        "name": "pepe_tada",
        "filename": "60280.png"
    },
    "60281": {
        "code": 60281,
        "name": "pepe_thankful",
        "filename": "60281.png"
    },
    "60282": {
        "code": 60282,
        "name": "pepe_thats_nice",
        "filename": "60282.png"
    },
    "60283": {
        "code": 60283,
        "name": "pepe_think",
        "filename": "60283.png"
    },
    "60284": {
        "code": 60284,
        "name": "pepe_think_light",
        "filename": "60284.png"
    },
    "60285": {
        "code": 60285,
        "name": "pepe_think_omega",
        "filename": "60285.png"
    },
    "60286": {
        "code": 60286,
        "name": "pepe_thinking",
        "filename": "60286.png"
    },
    "60287": {
        "code": 60287,
        "name": "pepe_thug",
        "filename": "60287.png"
    },
    "60288": {
        "code": 60288,
        "name": "pepe_thumbsdown",
        "filename": "60288.png"
    },
    "60289": {
        "code": 60289,
        "name": "pepe_thumbsup",
        "filename": "60289.png"
    },
    "60290": {
        "code": 60290,
        "name": "pepe_thumpup",
        "filename": "60290.png"
    },
    "60291": {
        "code": 60291,
        "name": "pepe_time",
        "filename": "60291.png"
    },
    "60292": {
        "code": 60292,
        "name": "pepe_tinkywinky",
        "filename": "60292.png"
    },
    "60293": {
        "code": 60293,
        "name": "pepe_tinyviolin",
        "filename": "60293.png"
    },
    "60294": {
        "code": 60294,
        "name": "pepe_tipsfedora",
        "filename": "60294.png"
    },
    "60295": {
        "code": 60295,
        "name": "pepe_toilet",
        "filename": "60295.png"
    },
    "60296": {
        "code": 60296,
        "name": "pepe_tomato",
        "filename": "60296.png"
    },
    "60297": {
        "code": 60297,
        "name": "pepe_tos",
        "filename": "60297.png"
    },
    "60298": {
        "code": 60298,
        "name": "pepe_toxic",
        "filename": "60298.png"
    },
    "60299": {
        "code": 60299,
        "name": "pepe_tradeoffer",
        "filename": "60299.png"
    },
    "60300": {
        "code": 60300,
        "name": "pepe_transform",
        "filename": "60300.png"
    },
    "60301": {
        "code": 60301,
        "name": "pepe_trollface",
        "filename": "60301.png"
    },
    "60302": {
        "code": 60302,
        "name": "pepe_trophy",
        "filename": "60302.png"
    },
    "60303": {
        "code": 60303,
        "name": "pepe_true",
        "filename": "60303.png"
    },
    "60304": {
        "code": 60304,
        "name": "pepe_trumpet",
        "filename": "60304.png"
    },
    "60305": {
        "code": 60305,
        "name": "pepe_tub",
        "filename": "60305.png"
    },
    "60306": {
        "code": 60306,
        "name": "pepe_twerk",
        "filename": "60306.png"
    },
    "60307": {
        "code": 60307,
        "name": "pepe_twitter",
        "filename": "60307.png"
    },
    "60308": {
        "code": 60308,
        "name": "pepe_uhh",
        "filename": "60308.png"
    },
    "60309": {
        "code": 60309,
        "name": "pepe_underwear",
        "filename": "60309.png"
    },
    "60310": {
        "code": 60310,
        "name": "pepe_unfair",
        "filename": "60310.png"
    },
    "60311": {
        "code": 60311,
        "name": "pepe_upsidedownsmile",
        "filename": "60311.png"
    },
    "60312": {
        "code": 60312,
        "name": "pepe_upvote",
        "filename": "60312.png"
    },
    "60313": {
        "code": 60313,
        "name": "pepe_uunga_buunga",
        "filename": "60313.png"
    },
    "60314": {
        "code": 60314,
        "name": "pepe_valid",
        "filename": "60314.png"
    },
    "60315": {
        "code": 60315,
        "name": "pepe_vanish",
        "filename": "60315.png"
    },
    "60316": {
        "code": 60316,
        "name": "pepe_vibin",
        "filename": "60316.png"
    },
    "60317": {
        "code": 60317,
        "name": "pepe_vomit",
        "filename": "60317.png"
    },
    "60318": {
        "code": 60318,
        "name": "pepe_walk",
        "filename": "60318.png"
    },
    "60319": {
        "code": 60319,
        "name": "pepe_walkout",
        "filename": "60319.png"
    },
    "60320": {
        "code": 60320,
        "name": "pepe_wannahug",
        "filename": "60320.png"
    },
    "60321": {
        "code": 60321,
        "name": "pepe_wave",
        "filename": "60321.png"
    },
    "60322": {
        "code": 60322,
        "name": "pepe_wealthy",
        "filename": "60322.png"
    },
    "60323": {
        "code": 60323,
        "name": "pepe_what",
        "filename": "60323.png"
    },
    "60324": {
        "code": 60324,
        "name": "pepe_whip",
        "filename": "60324.png"
    },
    "60325": {
        "code": 60325,
        "name": "pepe_whiteeyes",
        "filename": "60325.png"
    },
    "60326": {
        "code": 60326,
        "name": "pepe_why",
        "filename": "60326.png"
    },
    "60327": {
        "code": 60327,
        "name": "pepe_wine",
        "filename": "60327.png"
    },
    "60328": {
        "code": 60328,
        "name": "pepe_wine_cry",
        "filename": "60328.png"
    },
    "60329": {
        "code": 60329,
        "name": "pepe_wink",
        "filename": "60329.png"
    },
    "60330": {
        "code": 60330,
        "name": "pepe_with_jesus",
        "filename": "60330.png"
    },
    "60331": {
        "code": 60331,
        "name": "pepe_wtf",
        "filename": "60331.png"
    },
    "60332": {
        "code": 60332,
        "name": "pepe_yah_right",
        "filename": "60332.png"
    },
    "60333": {
        "code": 60333,
        "name": "pepe_yay",
        "filename": "60333.png"
    },
    "60334": {
        "code": 60334,
        "name": "pepe_yeaa",
        "filename": "60334.png"
    },
    "60335": {
        "code": 60335,
        "name": "pepe_yes",
        "filename": "60335.png"
    },
    "60336": {
        "code": 60336,
        "name": "pepe_yessir",
        "filename": "60336.png"
    },
    "60337": {
        "code": 60337,
        "name": "pepe_yikes",
        "filename": "60337.png"
    },
    "60338": {
        "code": 60338,
        "name": "pepe_you_are_a_gay",
        "filename": "60338.png"
    },
    "60339": {
        "code": 60339,
        "name": "pepe_youcantseeme",
        "filename": "60339.png"
    },
    "60340": {
        "code": 60340,
        "name": "pepeagony",
        "filename": "60340.png"
    },
    "60341": {
        "code": 60341,
        "name": "pepeameteur",
        "filename": "60341.png"
    },
    "60342": {
        "code": 60342,
        "name": "pepeangel",
        "filename": "60342.png"
    },
    "60343": {
        "code": 60343,
        "name": "pepeangeryspin",
        "filename": "60343.png"
    },
    "60344": {
        "code": 60344,
        "name": "pepeangry",
        "filename": "60344.png"
    },
    "60345": {
        "code": 60345,
        "name": "pepeangryaussie",
        "filename": "60345.png"
    },
    "60346": {
        "code": 60346,
        "name": "pepearabexplode",
        "filename": "60346.png"
    },
    "60347": {
        "code": 60347,
        "name": "pepearmchair",
        "filename": "60347.png"
    },
    "60348": {
        "code": 60348,
        "name": "pepeban",
        "filename": "60348.png"
    },
    "60349": {
        "code": 60349,
        "name": "pepebanned",
        "filename": "60349.png"
    },
    "60350": {
        "code": 60350,
        "name": "pepebass",
        "filename": "60350.png"
    },
    "60351": {
        "code": 60351,
        "name": "pepebean",
        "filename": "60351.png"
    },
    "60352": {
        "code": 60352,
        "name": "pepebigsmile",
        "filename": "60352.png"
    },
    "60353": {
        "code": 60353,
        "name": "pepeblanketrun",
        "filename": "60353.png"
    },
    "60354": {
        "code": 60354,
        "name": "pepeblink",
        "filename": "60354.png"
    },
    "60355": {
        "code": 60355,
        "name": "pepebloodypanties",
        "filename": "60355.png"
    },
    "60356": {
        "code": 60356,
        "name": "pepeblushed",
        "filename": "60356.png"
    },
    "60357": {
        "code": 60357,
        "name": "pepeboomer",
        "filename": "60357.png"
    },
    "60358": {
        "code": 60358,
        "name": "pepeboosting",
        "filename": "60358.png"
    },
    "60359": {
        "code": 60359,
        "name": "pepebooty",
        "filename": "60359.png"
    },
    "60360": {
        "code": 60360,
        "name": "pepebored",
        "filename": "60360.png"
    },
    "60361": {
        "code": 60361,
        "name": "pepebozosign",
        "filename": "60361.png"
    },
    "60362": {
        "code": 60362,
        "name": "pepebread",
        "filename": "60362.png"
    },
    "60363": {
        "code": 60363,
        "name": "pepebrim",
        "filename": "60363.png"
    },
    "60364": {
        "code": 60364,
        "name": "pepebubz",
        "filename": "60364.png"
    },
    "60365": {
        "code": 60365,
        "name": "pepebubzfaceblush",
        "filename": "60365.png"
    },
    "60366": {
        "code": 60366,
        "name": "pepebubzfacejam",
        "filename": "60366.png"
    },
    "60367": {
        "code": 60367,
        "name": "pepebuffclown",
        "filename": "60367.png"
    },
    "60368": {
        "code": 60368,
        "name": "pepebunny",
        "filename": "60368.png"
    },
    "60369": {
        "code": 60369,
        "name": "pepebye",
        "filename": "60369.png"
    },
    "60370": {
        "code": 60370,
        "name": "pepecake",
        "filename": "60370.png"
    },
    "60371": {
        "code": 60371,
        "name": "pepechamber",
        "filename": "60371.png"
    },
    "60372": {
        "code": 60372,
        "name": "pepecheers",
        "filename": "60372.png"
    },
    "60373": {
        "code": 60373,
        "name": "pepechu",
        "filename": "60373.png"
    },
    "60374": {
        "code": 60374,
        "name": "pepecinnamon",
        "filename": "60374.png"
    },
    "60375": {
        "code": 60375,
        "name": "pepeclown",
        "filename": "60375.png"
    },
    "60376": {
        "code": 60376,
        "name": "pepecoffee",
        "filename": "60376.png"
    },
    "60377": {
        "code": 60377,
        "name": "pepecoin",
        "filename": "60377.png"
    },
    "60378": {
        "code": 60378,
        "name": "pepecool",
        "filename": "60378.png"
    },
    "60379": {
        "code": 60379,
        "name": "pepecopter",
        "filename": "60379.png"
    },
    "60380": {
        "code": 60380,
        "name": "pepecough",
        "filename": "60380.png"
    },
    "60381": {
        "code": 60381,
        "name": "pepecowboy",
        "filename": "60381.png"
    },
    "60382": {
        "code": 60382,
        "name": "pepecringe",
        "filename": "60382.png"
    },
    "60383": {
        "code": 60383,
        "name": "pepecringe1",
        "filename": "60383.png"
    },
    "60384": {
        "code": 60384,
        "name": "pepecross",
        "filename": "60384.png"
    },
    "60385": {
        "code": 60385,
        "name": "pepecrowded",
        "filename": "60385.png"
    },
    "60386": {
        "code": 60386,
        "name": "pepecry",
        "filename": "60386.png"
    },
    "60387": {
        "code": 60387,
        "name": "pepecryaboutit",
        "filename": "60387.png"
    },
    "60388": {
        "code": 60388,
        "name": "pepecryhands",
        "filename": "60388.png"
    },
    "60389": {
        "code": 60389,
        "name": "pepecuddle",
        "filename": "60389.png"
    },
    "60390": {
        "code": 60390,
        "name": "pepecuerda",
        "filename": "60390.png"
    },
    "60391": {
        "code": 60391,
        "name": "pepecursed",
        "filename": "60391.png"
    },
    "60392": {
        "code": 60392,
        "name": "pepecutescooter",
        "filename": "60392.png"
    },
    "60393": {
        "code": 60393,
        "name": "pepedance",
        "filename": "60393.png"
    },
    "60394": {
        "code": 60394,
        "name": "pepedance_happy",
        "filename": "60394.png"
    },
    "60395": {
        "code": 60395,
        "name": "pepedance_troll",
        "filename": "60395.png"
    },
    "60396": {
        "code": 60396,
        "name": "pepedeletedis",
        "filename": "60396.png"
    },
    "60397": {
        "code": 60397,
        "name": "pepedevil",
        "filename": "60397.png"
    },
    "60398": {
        "code": 60398,
        "name": "pepedick",
        "filename": "60398.png"
    },
    "60399": {
        "code": 60399,
        "name": "pepedisappear_png",
        "filename": "60399.png"
    },
    "60400": {
        "code": 60400,
        "name": "pepedrink",
        "filename": "60400.png"
    },
    "60401": {
        "code": 60401,
        "name": "pepedumb",
        "filename": "60401.png"
    },
    "60402": {
        "code": 60402,
        "name": "pepedunno",
        "filename": "60402.png"
    },
    "60403": {
        "code": 60403,
        "name": "pepeeathaha",
        "filename": "60403.png"
    },
    "60404": {
        "code": 60404,
        "name": "pepeenlightenment",
        "filename": "60404.png"
    },
    "60405": {
        "code": 60405,
        "name": "pepeenter",
        "filename": "60405.png"
    },
    "60406": {
        "code": 60406,
        "name": "pepeexit",
        "filename": "60406.png"
    },
    "60407": {
        "code": 60407,
        "name": "pepeeyepoppin",
        "filename": "60407.png"
    },
    "60408": {
        "code": 60408,
        "name": "pepef",
        "filename": "60408.png"
    },
    "60409": {
        "code": 60409,
        "name": "pepefacepalm2",
        "filename": "60409.png"
    },
    "60410": {
        "code": 60410,
        "name": "pepefacepalm3",
        "filename": "60410.png"
    },
    "60411": {
        "code": 60411,
        "name": "pepefbi",
        "filename": "60411.png"
    },
    "60412": {
        "code": 60412,
        "name": "pepefeelsgoodman",
        "filename": "60412.png"
    },
    "60413": {
        "code": 60413,
        "name": "pepefeelssportsman",
        "filename": "60413.png"
    },
    "60414": {
        "code": 60414,
        "name": "pepefight",
        "filename": "60414.png"
    },
    "60415": {
        "code": 60415,
        "name": "pepefinger",
        "filename": "60415.png"
    },
    "60416": {
        "code": 60416,
        "name": "pepefingergun",
        "filename": "60416.png"
    },
    "60417": {
        "code": 60417,
        "name": "pepefingerguns",
        "filename": "60417.png"
    },
    "60418": {
        "code": 60418,
        "name": "pepeflex",
        "filename": "60418.png"
    },
    "60419": {
        "code": 60419,
        "name": "pepefloat",
        "filename": "60419.png"
    },
    "60420": {
        "code": 60420,
        "name": "pepefuck",
        "filename": "60420.png"
    },
    "60421": {
        "code": 60421,
        "name": "pepefuckoffleave",
        "filename": "60421.png"
    },
    "60422": {
        "code": 60422,
        "name": "pepefuckyou",
        "filename": "60422.png"
    },
    "60423": {
        "code": 60423,
        "name": "pepega_original_style",
        "filename": "60423.png"
    },
    "60424": {
        "code": 60424,
        "name": "pepegaaim",
        "filename": "60424.png"
    },
    "60425": {
        "code": 60425,
        "name": "pepegagun",
        "filename": "60425.png"
    },
    "60426": {
        "code": 60426,
        "name": "pepegasrun",
        "filename": "60426.png"
    },
    "60427": {
        "code": 60427,
        "name": "pepegay",
        "filename": "60427.png"
    },
    "60428": {
        "code": 60428,
        "name": "pepegeorgie",
        "filename": "60428.png"
    },
    "60429": {
        "code": 60429,
        "name": "pepeghostface",
        "filename": "60429.png"
    },
    "60430": {
        "code": 60430,
        "name": "pepegreece",
        "filename": "60430.png"
    },
    "60432": {
        "code": 60432,
        "name": "pepegunl",
        "filename": "60432.png"
    },
    "60433": {
        "code": 60433,
        "name": "pepegunr",
        "filename": "60433.png"
    },
    "60434": {
        "code": 60434,
        "name": "pepehabibisign",
        "filename": "60434.png"
    },
    "60435": {
        "code": 60435,
        "name": "pepehands",
        "filename": "60435.png"
    },
    "60436": {
        "code": 60436,
        "name": "pepehandsdestorted",
        "filename": "60436.png"
    },
    "60437": {
        "code": 60437,
        "name": "pepehang",
        "filename": "60437.png"
    },
    "60438": {
        "code": 60438,
        "name": "pepehappycry",
        "filename": "60438.png"
    },
    "60439": {
        "code": 60439,
        "name": "pepehappyhands",
        "filename": "60439.png"
    },
    "60440": {
        "code": 60440,
        "name": "pepehappyping",
        "filename": "60440.png"
    },
    "60441": {
        "code": 60441,
        "name": "pepehein",
        "filename": "60441.png"
    },
    "60442": {
        "code": 60442,
        "name": "pepehmm",
        "filename": "60442.png"
    },
    "60443": {
        "code": 60443,
        "name": "pepehmmm",
        "filename": "60443.png"
    },
    "60444": {
        "code": 60444,
        "name": "pepeholy",
        "filename": "60444.png"
    },
    "60445": {
        "code": 60445,
        "name": "pepehug",
        "filename": "60445.png"
    },
    "60446": {
        "code": 60446,
        "name": "pepehuhwtf",
        "filename": "60446.png"
    },
    "60447": {
        "code": 60447,
        "name": "pepeindia",
        "filename": "60447.png"
    },
    "60448": {
        "code": 60448,
        "name": "pepeinspect",
        "filename": "60448.png"
    },
    "60449": {
        "code": 60449,
        "name": "pepejam",
        "filename": "60449.png"
    },
    "60450": {
        "code": 60450,
        "name": "pepejamsides",
        "filename": "60450.png"
    },
    "60451": {
        "code": 60451,
        "name": "pepejeer",
        "filename": "60451.png"
    },
    "60452": {
        "code": 60452,
        "name": "pepejett",
        "filename": "60452.png"
    },
    "60453": {
        "code": 60453,
        "name": "pepejuicespin",
        "filename": "60453.png"
    },
    "60454": {
        "code": 60454,
        "name": "pepekek",
        "filename": "60454.png"
    },
    "60455": {
        "code": 60455,
        "name": "pepekeke",
        "filename": "60455.png"
    },
    "60456": {
        "code": 60456,
        "name": "pepekekw",
        "filename": "60456.png"
    },
    "60457": {
        "code": 60457,
        "name": "pepekimcool",
        "filename": "60457.png"
    },
    "60458": {
        "code": 60458,
        "name": "pepekimcozy",
        "filename": "60458.png"
    },
    "60459": {
        "code": 60459,
        "name": "pepekimdetective",
        "filename": "60459.png"
    },
    "60460": {
        "code": 60460,
        "name": "pepekimlove",
        "filename": "60460.png"
    },
    "60461": {
        "code": 60461,
        "name": "pepekimlovecry",
        "filename": "60461.png"
    },
    "60462": {
        "code": 60462,
        "name": "pepekimshock",
        "filename": "60462.png"
    },
    "60463": {
        "code": 60463,
        "name": "pepekimyay",
        "filename": "60463.png"
    },
    "60464": {
        "code": 60464,
        "name": "pepeking",
        "filename": "60464.png"
    },
    "60465": {
        "code": 60465,
        "name": "pepeknife",
        "filename": "60465.png"
    },
    "60466": {
        "code": 60466,
        "name": "pepeknifed",
        "filename": "60466.png"
    },
    "60467": {
        "code": 60467,
        "name": "pepekraken",
        "filename": "60467.png"
    },
    "60468": {
        "code": 60468,
        "name": "pepelachen",
        "filename": "60468.png"
    },
    "60469": {
        "code": 60469,
        "name": "pepelaf",
        "filename": "60469.png"
    },
    "60470": {
        "code": 60470,
        "name": "pepelaptop",
        "filename": "60470.png"
    },
    "60471": {
        "code": 60471,
        "name": "pepeleave",
        "filename": "60471.png"
    },
    "60472": {
        "code": 60472,
        "name": "pepelick",
        "filename": "60472.png"
    },
    "60473": {
        "code": 60473,
        "name": "pepelmao",
        "filename": "60473.png"
    },
    "60474": {
        "code": 60474,
        "name": "pepelmfao",
        "filename": "60474.png"
    },
    "60475": {
        "code": 60475,
        "name": "pepelook",
        "filename": "60475.png"
    },
    "60476": {
        "code": 60476,
        "name": "pepelookingyou",
        "filename": "60476.png"
    },
    "60477": {
        "code": 60477,
        "name": "pepeloveleaf",
        "filename": "60477.png"
    },
    "60478": {
        "code": 60478,
        "name": "pepelovepat",
        "filename": "60478.png"
    },
    "60479": {
        "code": 60479,
        "name": "pepemaybe",
        "filename": "60479.png"
    },
    "60480": {
        "code": 60480,
        "name": "pepemiddlefingers",
        "filename": "60480.png"
    },
    "60481": {
        "code": 60481,
        "name": "pepemods",
        "filename": "60481.png"
    },
    "60482": {
        "code": 60482,
        "name": "pepemoin",
        "filename": "60482.png"
    },
    "60483": {
        "code": 60483,
        "name": "pepemonk",
        "filename": "60483.png"
    },
    "60484": {
        "code": 60484,
        "name": "pepemugshot",
        "filename": "60484.png"
    },
    "60485": {
        "code": 60485,
        "name": "pepenarutorun",
        "filename": "60485.png"
    },
    "60486": {
        "code": 60486,
        "name": "pepenervoussweat",
        "filename": "60486.png"
    },
    "60487": {
        "code": 60487,
        "name": "pepeno",
        "filename": "60487.png"
    },
    "60488": {
        "code": 60488,
        "name": "pepenod",
        "filename": "60488.png"
    },
    "60489": {
        "code": 60489,
        "name": "pepenosign",
        "filename": "60489.png"
    },
    "60490": {
        "code": 60490,
        "name": "pepenoted",
        "filename": "60490.png"
    },
    "60491": {
        "code": 60491,
        "name": "pepenotes",
        "filename": "60491.png"
    },
    "60492": {
        "code": 60492,
        "name": "pepenou",
        "filename": "60492.png"
    },
    "60493": {
        "code": 60493,
        "name": "pepeo_fuk_u",
        "filename": "60493.png"
    },
    "60494": {
        "code": 60494,
        "name": "pepeohshit",
        "filename": "60494.png"
    },
    "60495": {
        "code": 60495,
        "name": "pepeold",
        "filename": "60495.png"
    },
    "60496": {
        "code": 60496,
        "name": "pepeomen",
        "filename": "60496.png"
    },
    "60497": {
        "code": 60497,
        "name": "pepeondrugs",
        "filename": "60497.png"
    },
    "60498": {
        "code": 60498,
        "name": "pepeoverthink",
        "filename": "60498.png"
    },
    "60499": {
        "code": 60499,
        "name": "pepeowo",
        "filename": "60499.png"
    },
    "60500": {
        "code": 60500,
        "name": "pepepeasant",
        "filename": "60500.png"
    },
    "60501": {
        "code": 60501,
        "name": "pepepee",
        "filename": "60501.png"
    },
    "60502": {
        "code": 60502,
        "name": "pepepeek",
        "filename": "60502.png"
    },
    "60503": {
        "code": 60503,
        "name": "pepeperry",
        "filename": "60503.png"
    },
    "60504": {
        "code": 60504,
        "name": "pepephoenix",
        "filename": "60504.png"
    },
    "60505": {
        "code": 60505,
        "name": "pepepig",
        "filename": "60505.png"
    },
    "60506": {
        "code": 60506,
        "name": "pepepika",
        "filename": "60506.png"
    },
    "60507": {
        "code": 60507,
        "name": "pepepleased",
        "filename": "60507.png"
    },
    "60508": {
        "code": 60508,
        "name": "pepepog",
        "filename": "60508.png"
    },
    "60509": {
        "code": 60509,
        "name": "pepepoggerditto",
        "filename": "60509.png"
    },
    "60510": {
        "code": 60510,
        "name": "pepepoggerschains",
        "filename": "60510.png"
    },
    "60511": {
        "code": 60511,
        "name": "pepepolicedog",
        "filename": "60511.png"
    },
    "60512": {
        "code": 60512,
        "name": "pepepoop",
        "filename": "60512.png"
    },
    "60513": {
        "code": 60513,
        "name": "pepepopcorn",
        "filename": "60513.png"
    },
    "60514": {
        "code": 60514,
        "name": "pepepopsicle",
        "filename": "60514.png"
    },
    "60515": {
        "code": 60515,
        "name": "pepepray",
        "filename": "60515.png"
    },
    "60516": {
        "code": 60516,
        "name": "pepepridesing",
        "filename": "60516.png"
    },
    "60517": {
        "code": 60517,
        "name": "pepeprison",
        "filename": "60517.png"
    },
    "60518": {
        "code": 60518,
        "name": "pepepumpkin",
        "filename": "60518.png"
    },
    "60519": {
        "code": 60519,
        "name": "pepepunch",
        "filename": "60519.png"
    },
    "60520": {
        "code": 60520,
        "name": "peperazzi",
        "filename": "60520.png"
    },
    "60521": {
        "code": 60521,
        "name": "peperee",
        "filename": "60521.png"
    },
    "60522": {
        "code": 60522,
        "name": "peperickroll",
        "filename": "60522.png"
    },
    "60523": {
        "code": 60523,
        "name": "peperocketleague",
        "filename": "60523.png"
    },
    "60524": {
        "code": 60524,
        "name": "peperuncry",
        "filename": "60524.png"
    },
    "60525": {
        "code": 60525,
        "name": "pepes",
        "filename": "60525.png"
    },
    "60526": {
        "code": 60526,
        "name": "pepes_on_bed",
        "filename": "60526.png"
    },
    "60527": {
        "code": 60527,
        "name": "pepes_x",
        "filename": "60527.png"
    },
    "60528": {
        "code": 60528,
        "name": "pepesad",
        "filename": "60528.png"
    },
    "60529": {
        "code": 60529,
        "name": "pepesadcry",
        "filename": "60529.png"
    },
    "60530": {
        "code": 60530,
        "name": "pepesaddrawing",
        "filename": "60530.png"
    },
    "60531": {
        "code": 60531,
        "name": "pepesadge",
        "filename": "60531.png"
    },
    "60532": {
        "code": 60532,
        "name": "pepesadjam",
        "filename": "60532.png"
    },
    "60533": {
        "code": 60533,
        "name": "pepesadpet",
        "filename": "60533.png"
    },
    "60534": {
        "code": 60534,
        "name": "pepesadrain",
        "filename": "60534.png"
    },
    "60535": {
        "code": 60535,
        "name": "pepesage",
        "filename": "60535.png"
    },
    "60536": {
        "code": 60536,
        "name": "pepescream",
        "filename": "60536.png"
    },
    "60537": {
        "code": 60537,
        "name": "pepesharingan",
        "filename": "60537.png"
    },
    "60538": {
        "code": 60538,
        "name": "pepesimpsign",
        "filename": "60538.png"
    },
    "60539": {
        "code": 60539,
        "name": "pepesip",
        "filename": "60539.png"
    },
    "60540": {
        "code": 60540,
        "name": "pepesleep",
        "filename": "60540.png"
    },
    "60541": {
        "code": 60541,
        "name": "pepesmd",
        "filename": "60541.png"
    },
    "60542": {
        "code": 60542,
        "name": "pepesmexy",
        "filename": "60542.png"
    },
    "60543": {
        "code": 60543,
        "name": "pepesmile",
        "filename": "60543.png"
    },
    "60544": {
        "code": 60544,
        "name": "pepesmoke",
        "filename": "60544.png"
    },
    "60545": {
        "code": 60545,
        "name": "pepesmoke2",
        "filename": "60545.png"
    },
    "60546": {
        "code": 60546,
        "name": "pepesmug",
        "filename": "60546.png"
    },
    "60547": {
        "code": 60547,
        "name": "pepesneakyevil",
        "filename": "60547.png"
    },
    "60548": {
        "code": 60548,
        "name": "pepesob",
        "filename": "60548.png"
    },
    "60549": {
        "code": 60549,
        "name": "pepesoldier",
        "filename": "60549.png"
    },
    "60550": {
        "code": 60550,
        "name": "pepesorry",
        "filename": "60550.png"
    },
    "60551": {
        "code": 60551,
        "name": "pepesova",
        "filename": "60551.png"
    },
    "60552": {
        "code": 60552,
        "name": "pepespeechless",
        "filename": "60552.png"
    },
    "60553": {
        "code": 60553,
        "name": "pepespit",
        "filename": "60553.png"
    },
    "60554": {
        "code": 60554,
        "name": "pepestalk",
        "filename": "60554.png"
    },
    "60555": {
        "code": 60555,
        "name": "pepestream",
        "filename": "60555.png"
    },
    "60556": {
        "code": 60556,
        "name": "pepesus",
        "filename": "60556.png"
    },
    "60557": {
        "code": 60557,
        "name": "pepesuspicious",
        "filename": "60557.png"
    },
    "60558": {
        "code": 60558,
        "name": "pepesusthink",
        "filename": "60558.png"
    },
    "60559": {
        "code": 60559,
        "name": "pepeswag",
        "filename": "60559.png"
    },
    "60560": {
        "code": 60560,
        "name": "pepetakethel",
        "filename": "60560.png"
    },
    "60561": {
        "code": 60561,
        "name": "pepetearsofjoy",
        "filename": "60561.png"
    },
    "60562": {
        "code": 60562,
        "name": "pepetequiero",
        "filename": "60562.png"
    },
    "60563": {
        "code": 60563,
        "name": "pepethetoad",
        "filename": "60563.png"
    },
    "60565": {
        "code": 60565,
        "name": "pepethumbsup",
        "filename": "60565.png"
    },
    "60566": {
        "code": 60566,
        "name": "pepetler",
        "filename": "60566.png"
    },
    "60567": {
        "code": 60567,
        "name": "pepetoiletpaper",
        "filename": "60567.png"
    },
    "60568": {
        "code": 60568,
        "name": "pepetriggered",
        "filename": "60568.png"
    },
    "60569": {
        "code": 60569,
        "name": "pepeukraine",
        "filename": "60569.png"
    },
    "60570": {
        "code": 60570,
        "name": "pepeumm",
        "filename": "60570.png"
    },
    "60571": {
        "code": 60571,
        "name": "pepeupset",
        "filename": "60571.png"
    },
    "60572": {
        "code": 60572,
        "name": "pepeviper",
        "filename": "60572.png"
    },
    "60573": {
        "code": 60573,
        "name": "pepewave",
        "filename": "60573.png"
    },
    "60574": {
        "code": 60574,
        "name": "pepewhale",
        "filename": "60574.png"
    },
    "60575": {
        "code": 60575,
        "name": "pepewhiteclothes",
        "filename": "60575.png"
    },
    "60576": {
        "code": 60576,
        "name": "pepewideawake",
        "filename": "60576.png"
    },
    "60577": {
        "code": 60577,
        "name": "pepewine",
        "filename": "60577.png"
    },
    "60578": {
        "code": 60578,
        "name": "pepewobble",
        "filename": "60578.png"
    },
    "60579": {
        "code": 60579,
        "name": "pepewut",
        "filename": "60579.png"
    },
    "60580": {
        "code": 60580,
        "name": "pepexxx",
        "filename": "60580.png"
    },
    "60581": {
        "code": 60581,
        "name": "pepeyessign",
        "filename": "60581.png"
    },
    "60582": {
        "code": 60582,
        "name": "pepeyoru",
        "filename": "60582.png"
    },
    "60583": {
        "code": 60583,
        "name": "pepezoom",
        "filename": "60583.png"
    },
    "60584": {
        "code": 60584,
        "name": "pepgun",
        "filename": "60584.png"
    },
    "60585": {
        "code": 60585,
        "name": "peplease",
        "filename": "60585.png"
    },
    "60586": {
        "code": 60586,
        "name": "pepowtdrink",
        "filename": "60586.png"
    },
    "60587": {
        "code": 60587,
        "name": "pepo_sweg",
        "filename": "60587.png"
    },
    "60588": {
        "code": 60588,
        "name": "pepoflex_wide1",
        "filename": "60588.png"
    },
    "60589": {
        "code": 60589,
        "name": "pepoflex_wide2",
        "filename": "60589.png"
    },
    "60590": {
        "code": 60590,
        "name": "pepoflex_wide3",
        "filename": "60590.png"
    },
    "60591": {
        "code": 60591,
        "name": "pepsi_pepe",
        "filename": "60591.png"
    },
    "60592": {
        "code": 60592,
        "name": "perfect_pepe",
        "filename": "60592.png"
    },
    "60593": {
        "code": 60593,
        "name": "pes_joy1",
        "filename": "60593.png"
    },
    "60594": {
        "code": 60594,
        "name": "pet_dank_memer",
        "filename": "60594.png"
    },
    "60595": {
        "code": 60595,
        "name": "pet_emojigg",
        "filename": "60595.png"
    },
    "60596": {
        "code": 60596,
        "name": "pink_calculator",
        "filename": "60596.png"
    },
    "60597": {
        "code": 60597,
        "name": "piratepeped",
        "filename": "60597.png"
    },
    "60598": {
        "code": 60598,
        "name": "pmj",
        "filename": "60598.png"
    },
    "60599": {
        "code": 60599,
        "name": "pogchampoo",
        "filename": "60599.png"
    },
    "60600": {
        "code": 60600,
        "name": "pogslide",
        "filename": "60600.png"
    },
    "60601": {
        "code": 60601,
        "name": "poo_poo_head",
        "filename": "60601.png"
    },
    "60602": {
        "code": 60602,
        "name": "poopemoji",
        "filename": "60602.png"
    },
    "60603": {
        "code": 60603,
        "name": "popcornpeped",
        "filename": "60603.png"
    },
    "60604": {
        "code": 60604,
        "name": "ppoverheat",
        "filename": "60604.png"
    },
    "60605": {
        "code": 60605,
        "name": "radovan_je_nejlepsi",
        "filename": "60605.png"
    },
    "60606": {
        "code": 60606,
        "name": "rainbow_pepe",
        "filename": "60606.png"
    },
    "60607": {
        "code": 60607,
        "name": "rainbow_pepe_2",
        "filename": "60607.png"
    },
    "60608": {
        "code": 60608,
        "name": "rainbow_wtf",
        "filename": "60608.png"
    },
    "60609": {
        "code": 60609,
        "name": "ratpeped",
        "filename": "60609.png"
    },
    "60610": {
        "code": 60610,
        "name": "reademote",
        "filename": "60610.png"
    },
    "60611": {
        "code": 60611,
        "name": "redcard",
        "filename": "60611.png"
    },
    "60612": {
        "code": 60612,
        "name": "revivedge",
        "filename": "60612.png"
    },
    "60613": {
        "code": 60613,
        "name": "riotpeped",
        "filename": "60613.png"
    },
    "60614": {
        "code": 60614,
        "name": "robotpeped",
        "filename": "60614.png"
    },
    "60615": {
        "code": 60615,
        "name": "rolling_meme_frog",
        "filename": "60615.png"
    },
    "60616": {
        "code": 60616,
        "name": "rollpeped",
        "filename": "60616.png"
    },
    "60617": {
        "code": 60617,
        "name": "rulenumberoneifitsaboutmeatmeso",
        "filename": "60617.png"
    },
    "60618": {
        "code": 60618,
        "name": "runpepega",
        "filename": "60618.png"
    },
    "60619": {
        "code": 60619,
        "name": "sad_8kpepe",
        "filename": "60619.png"
    },
    "60620": {
        "code": 60620,
        "name": "sad_pepe",
        "filename": "60620.png"
    },
    "60621": {
        "code": 60621,
        "name": "sad_pepe_amongus",
        "filename": "60621.png"
    },
    "60622": {
        "code": 60622,
        "name": "sad_pepe_cat",
        "filename": "60622.png"
    },
    "60623": {
        "code": 60623,
        "name": "sad_yep",
        "filename": "60623.png"
    },
    "60625": {
        "code": 60625,
        "name": "sadge_pray",
        "filename": "60625.png"
    },
    "60626": {
        "code": 60626,
        "name": "sadgeegg",
        "filename": "60626.png"
    },
    "60627": {
        "code": 60627,
        "name": "sadke",
        "filename": "60627.png"
    },
    "60628": {
        "code": 60628,
        "name": "sadpepe",
        "filename": "60628.png"
    },
    "60629": {
        "code": 60629,
        "name": "sadpepecrypet",
        "filename": "60629.png"
    },
    "60630": {
        "code": 60630,
        "name": "santapepebubzface",
        "filename": "60630.png"
    },
    "60631": {
        "code": 60631,
        "name": "satan_pepe",
        "filename": "60631.png"
    },
    "60632": {
        "code": 60632,
        "name": "sheeshers",
        "filename": "60632.png"
    },
    "60633": {
        "code": 60633,
        "name": "shhh",
        "filename": "60633.png"
    },
    "60635": {
        "code": 60635,
        "name": "shut",
        "filename": "60635.png"
    },
    "60636": {
        "code": 60636,
        "name": "sisge",
        "filename": "60636.png"
    },
    "60637": {
        "code": 60637,
        "name": "skatepeped",
        "filename": "60637.png"
    },
    "60638": {
        "code": 60638,
        "name": "sleepge",
        "filename": "60638.png"
    },
    "60639": {
        "code": 60639,
        "name": "smoge",
        "filename": "60639.png"
    },
    "60640": {
        "code": 60640,
        "name": "smug",
        "filename": "60640.png"
    },
    "60641": {
        "code": 60641,
        "name": "sombreopeped",
        "filename": "60641.png"
    },
    "60642": {
        "code": 60642,
        "name": "spinninghonker",
        "filename": "60642.png"
    },
    "60643": {
        "code": 60643,
        "name": "spongebob_broken",
        "filename": "60643.png"
    },
    "60644": {
        "code": 60644,
        "name": "squid_pepe",
        "filename": "60644.png"
    },
    "60645": {
        "code": 60645,
        "name": "stalin_pepe",
        "filename": "60645.png"
    },
    "60646": {
        "code": 60646,
        "name": "starege",
        "filename": "60646.png"
    },
    "60647": {
        "code": 60647,
        "name": "sukuna_pepe_kek",
        "filename": "60647.png"
    },
    "60648": {
        "code": 60648,
        "name": "susge",
        "filename": "60648.png"
    },
    "60649": {
        "code": 60649,
        "name": "swordfish",
        "filename": "60649.png"
    },
    "60650": {
        "code": 60650,
        "name": "thanos_cheeks",
        "filename": "60650.png"
    },
    "60651": {
        "code": 60651,
        "name": "the_rock_rap_pepe",
        "filename": "60651.png"
    },
    "60652": {
        "code": 60652,
        "name": "the_weeknd_pepe",
        "filename": "60652.png"
    },
    "60654": {
        "code": 60654,
        "name": "thumbsup",
        "filename": "60654.png"
    },
    "60655": {
        "code": 60655,
        "name": "tiredge",
        "filename": "60655.png"
    },
    "60656": {
        "code": 60656,
        "name": "toadgirl_huh",
        "filename": "60656.png"
    },
    "60657": {
        "code": 60657,
        "name": "trippepe",
        "filename": "60657.png"
    },
    "60658": {
        "code": 60658,
        "name": "twerkingpepe",
        "filename": "60658.png"
    },
    "60659": {
        "code": 60659,
        "name": "typing_bean",
        "filename": "60659.png"
    },
    "60660": {
        "code": 60660,
        "name": "typingpeped",
        "filename": "60660.png"
    },
    "60661": {
        "code": 60661,
        "name": "ukrainepeeposmiling",
        "filename": "60661.png"
    },
    "60662": {
        "code": 60662,
        "name": "urcute",
        "filename": "60662.png"
    },
    "60663": {
        "code": 60663,
        "name": "vibepepe",
        "filename": "60663.png"
    },
    "60664": {
        "code": 60664,
        "name": "violenpepe",
        "filename": "60664.png"
    },
    "60665": {
        "code": 60665,
        "name": "wankge",
        "filename": "60665.png"
    },
    "60666": {
        "code": 60666,
        "name": "washingmachinepepebubz",
        "filename": "60666.png"
    },
    "60667": {
        "code": 60667,
        "name": "whiteflagpeped",
        "filename": "60667.png"
    },
    "60668": {
        "code": 60668,
        "name": "why_do_you_gay",
        "filename": "60668.png"
    },
    "60669": {
        "code": 60669,
        "name": "wicked_leave",
        "filename": "60669.png"
    },
    "60670": {
        "code": 60670,
        "name": "widepeepoglad1",
        "filename": "60670.png"
    },
    "60671": {
        "code": 60671,
        "name": "widepeepoglad2",
        "filename": "60671.png"
    },
    "60672": {
        "code": 60672,
        "name": "wokegeshot",
        "filename": "60672.png"
    },
    "60673": {
        "code": 60673,
        "name": "worry_hidden_technical",
        "filename": "60673.png"
    },
    "60674": {
        "code": 60674,
        "name": "worry_smoking_vape",
        "filename": "60674.png"
    },
    "60675": {
        "code": 60675,
        "name": "wrary_or_logo",
        "filename": "60675.png"
    },
    "60676": {
        "code": 60676,
        "name": "wtf",
        "filename": "60676.png"
    },
    "60677": {
        "code": 60677,
        "name": "x_pepe_jet",
        "filename": "60677.png"
    },
    "60678": {
        "code": 60678,
        "name": "xmas_bauble",
        "filename": "60678.png"
    },
    "60679": {
        "code": 60679,
        "name": "xmas_flute",
        "filename": "60679.png"
    },
    "60680": {
        "code": 60680,
        "name": "xmas_hacker",
        "filename": "60680.png"
    },
    "60681": {
        "code": 60681,
        "name": "yeauhuhok",
        "filename": "60681.png"
    },
    "60682": {
        "code": 60682,
        "name": "yellowhappypepe",
        "filename": "60682.png"
    },
    "60683": {
        "code": 60683,
        "name": "yep",
        "filename": "60683.png"
    },
    "60684": {
        "code": 60684,
        "name": "yessir",
        "filename": "60684.png"
    },
    "60685": {
        "code": 60685,
        "name": "yo_pepe",
        "filename": "60685.png"
    },
    "60686": {
        "code": 60686,
        "name": "youarespecial",
        "filename": "60686.png"
    },
    "60928": {
        "code": 60928,
        "name": "01motion",
        "filename": "60928.png"
    },
    "60929": {
        "code": 60929,
        "name": "02microbe",
        "filename": "60929.png"
    },
    "60930": {
        "code": 60930,
        "name": "03electro",
        "filename": "60930.png"
    },
    "60931": {
        "code": 60931,
        "name": "04science",
        "filename": "60931.png"
    },
    "60932": {
        "code": 60932,
        "name": "05oddity",
        "filename": "60932.png"
    },
    "60933": {
        "code": 60933,
        "name": "06futuristic",
        "filename": "60933.png"
    },
    "60934": {
        "code": 60934,
        "name": "08chaos",
        "filename": "60934.png"
    },
    "60935": {
        "code": 60935,
        "name": "09gold",
        "filename": "60935.png"
    },
    "60936": {
        "code": 60936,
        "name": "1000",
        "filename": "60936.png"
    },
    "60937": {
        "code": 60937,
        "name": "10mage",
        "filename": "60937.png"
    },
    "60938": {
        "code": 60938,
        "name": "11slime",
        "filename": "60938.png"
    },
    "60939": {
        "code": 60939,
        "name": "11x11",
        "filename": "60939.png"
    },
    "60940": {
        "code": 60940,
        "name": "12abomination",
        "filename": "60940.png"
    },
    "60941": {
        "code": 60941,
        "name": "13",
        "filename": "60941.png"
    },
    "60942": {
        "code": 60942,
        "name": "13western",
        "filename": "60942.png"
    },
    "60943": {
        "code": 60943,
        "name": "14robotic",
        "filename": "60943.png"
    },
    "60944": {
        "code": 60944,
        "name": "15abyssal",
        "filename": "60944.png"
    },
    "60945": {
        "code": 60945,
        "name": "16pixel",
        "filename": "60945.png"
    },
    "60946": {
        "code": 60946,
        "name": "17trash",
        "filename": "60946.png"
    },
    "60947": {
        "code": 60947,
        "name": "18void",
        "filename": "60947.png"
    },
    "60948": {
        "code": 60948,
        "name": "19figment",
        "filename": "60948.png"
    },
    "60949": {
        "code": 60949,
        "name": "1stanniversarybadge",
        "filename": "60949.png"
    },
    "60950": {
        "code": 60950,
        "name": "20toy",
        "filename": "60950.png"
    },
    "60951": {
        "code": 60951,
        "name": "21spirit",
        "filename": "60951.png"
    },
    "60952": {
        "code": 60952,
        "name": "22chrome",
        "filename": "60952.png"
    },
    "60953": {
        "code": 60953,
        "name": "22x22",
        "filename": "60953.png"
    },
    "60954": {
        "code": 60954,
        "name": "23chiptune",
        "filename": "60954.png"
    },
    "60955": {
        "code": 60955,
        "name": "24lumin",
        "filename": "60955.png"
    },
    "60956": {
        "code": 60956,
        "name": "25lunar",
        "filename": "60956.png"
    },
    "60957": {
        "code": 60957,
        "name": "26gem",
        "filename": "60957.png"
    },
    "60958": {
        "code": 60958,
        "name": "27crawly",
        "filename": "60958.png"
    },
    "60959": {
        "code": 60959,
        "name": "28halloween",
        "filename": "60959.png"
    },
    "60960": {
        "code": 60960,
        "name": "29christmas",
        "filename": "60960.png"
    },
    "60961": {
        "code": 60961,
        "name": "2koolsudowoodo",
        "filename": "60961.png"
    },
    "60962": {
        "code": 60962,
        "name": "30valentines",
        "filename": "60962.png"
    },
    "60963": {
        "code": 60963,
        "name": "31easter",
        "filename": "60963.png"
    },
    "60964": {
        "code": 60964,
        "name": "32summer",
        "filename": "60964.png"
    },
    "60965": {
        "code": 60965,
        "name": "33x33",
        "filename": "60965.png"
    },
    "60966": {
        "code": 60966,
        "name": "44x44",
        "filename": "60966.png"
    },
    "60967": {
        "code": 60967,
        "name": "506023",
        "filename": "60967.png"
    },
    "60968": {
        "code": 60968,
        "name": "55x55",
        "filename": "60968.png"
    },
    "60969": {
        "code": 60969,
        "name": "5743beedotpng",
        "filename": "60969.png"
    },
    "60970": {
        "code": 60970,
        "name": "5_screens",
        "filename": "60970.png"
    },
    "60971": {
        "code": 60971,
        "name": "6112supahot",
        "filename": "60971.png"
    },
    "60972": {
        "code": 60972,
        "name": "6205pepesad",
        "filename": "60972.png"
    },
    "60973": {
        "code": 60973,
        "name": "9thhamsterflag",
        "filename": "60973.png"
    },
    "60974": {
        "code": 60974,
        "name": "ahaha_no",
        "filename": "60974.png"
    },
    "60975": {
        "code": 60975,
        "name": "ayaya",
        "filename": "60975.png"
    },
    "60976": {
        "code": 60976,
        "name": "adminping",
        "filename": "60976.png"
    },
    "60977": {
        "code": 60977,
        "name": "animegirlgat",
        "filename": "60977.png"
    },
    "60978": {
        "code": 60978,
        "name": "attackshiny",
        "filename": "60978.png"
    },
    "60979": {
        "code": 60979,
        "name": "aurora",
        "filename": "60979.png"
    },
    "60980": {
        "code": 60980,
        "name": "btc",
        "filename": "60980.png"
    },
    "60981": {
        "code": 60981,
        "name": "barrier",
        "filename": "60981.png"
    },
    "60982": {
        "code": 60982,
        "name": "blitzleshiny",
        "filename": "60982.png"
    },
    "60983": {
        "code": 60983,
        "name": "blockhound",
        "filename": "60983.png"
    },
    "60984": {
        "code": 60984,
        "name": "bulbagat",
        "filename": "60984.png"
    },
    "60985": {
        "code": 60985,
        "name": "bulbashiny",
        "filename": "60985.png"
    },
    "60986": {
        "code": 60986,
        "name": "bulbatwins",
        "filename": "60986.png"
    },
    "60987": {
        "code": 60987,
        "name": "bulletugh",
        "filename": "60987.png"
    },
    "60988": {
        "code": 60988,
        "name": "ca",
        "filename": "60988.png"
    },
    "60989": {
        "code": 60989,
        "name": "cacneashiny",
        "filename": "60989.png"
    },
    "60990": {
        "code": 60990,
        "name": "catnap",
        "filename": "60990.png"
    },
    "60991": {
        "code": 60991,
        "name": "challenging_smite",
        "filename": "60991.png"
    },
    "60992": {
        "code": 60992,
        "name": "chilling_smite",
        "filename": "60992.png"
    },
    "60993": {
        "code": 60993,
        "name": "clarity",
        "filename": "60993.png"
    },
    "60994": {
        "code": 60994,
        "name": "cleanse",
        "filename": "60994.png"
    },
    "60995": {
        "code": 60995,
        "name": "cock",
        "filename": "60995.png"
    },
    "60996": {
        "code": 60996,
        "name": "criedaboutit",
        "filename": "60996.png"
    },
    "60997": {
        "code": 60997,
        "name": "croagunkshiny",
        "filename": "60997.png"
    },
    "60998": {
        "code": 60998,
        "name": "crux",
        "filename": "60998.png"
    },
    "60999": {
        "code": 60999,
        "name": "cthulu",
        "filename": "60999.png"
    },
    "61000": {
        "code": 61000,
        "name": "d_",
        "filename": "61000.png"
    },
    "61001": {
        "code": 61001,
        "name": "dash",
        "filename": "61001.png"
    },
    "61002": {
        "code": 61002,
        "name": "defenseshiny2",
        "filename": "61002.png"
    },
    "61003": {
        "code": 61003,
        "name": "deoxysshiny",
        "filename": "61003.png"
    },
    "61004": {
        "code": 61004,
        "name": "developerbadge",
        "filename": "61004.png"
    },
    "61005": {
        "code": 61005,
        "name": "donpepe",
        "filename": "61005.png"
    },
    "61006": {
        "code": 61006,
        "name": "eth",
        "filename": "61006.png"
    },
    "61007": {
        "code": 61007,
        "name": "ez",
        "filename": "61007.png"
    },
    "61008": {
        "code": 61008,
        "name": "e_",
        "filename": "61008.png"
    },
    "61009": {
        "code": 61009,
        "name": "empowered_recall",
        "filename": "61009.png"
    },
    "61010": {
        "code": 61010,
        "name": "exhaust",
        "filename": "61010.png"
    },
    "61011": {
        "code": 61011,
        "name": "facepaw",
        "filename": "61011.png"
    },
    "61012": {
        "code": 61012,
        "name": "fearful",
        "filename": "61012.png"
    },
    "61013": {
        "code": 61013,
        "name": "feelstensebutsmiling",
        "filename": "61013.png"
    },
    "61014": {
        "code": 61014,
        "name": "flash",
        "filename": "61014.png"
    },
    "61015": {
        "code": 61015,
        "name": "flygonshiny",
        "filename": "61015.png"
    },
    "61016": {
        "code": 61016,
        "name": "forgedcore8",
        "filename": "61016.png"
    },
    "61017": {
        "code": 61017,
        "name": "frickoff",
        "filename": "61017.png"
    },
    "61018": {
        "code": 61018,
        "name": "garchompshiny",
        "filename": "61018.png"
    },
    "61019": {
        "code": 61019,
        "name": "ghost",
        "filename": "61019.png"
    },
    "61020": {
        "code": 61020,
        "name": "giratinashiny",
        "filename": "61020.png"
    },
    "61021": {
        "code": 61021,
        "name": "giresrbottled",
        "filename": "61021.png"
    },
    "61022": {
        "code": 61022,
        "name": "goodmorning",
        "filename": "61022.png"
    },
    "61023": {
        "code": 61023,
        "name": "goodnight",
        "filename": "61023.png"
    },
    "61024": {
        "code": 61024,
        "name": "grovyleshiny",
        "filename": "61024.png"
    },
    "61025": {
        "code": 61025,
        "name": "hypers",
        "filename": "61025.png"
    },
    "61026": {
        "code": 61026,
        "name": "hz_shrug",
        "filename": "61026.png"
    },
    "61027": {
        "code": 61027,
        "name": "happ",
        "filename": "61027.png"
    },
    "61028": {
        "code": 61028,
        "name": "happyshinx",
        "filename": "61028.png"
    },
    "61029": {
        "code": 61029,
        "name": "harold",
        "filename": "61029.png"
    },
    "61030": {
        "code": 61030,
        "name": "haruez",
        "filename": "61030.png"
    },
    "61031": {
        "code": 61031,
        "name": "heal",
        "filename": "61031.png"
    },
    "61032": {
        "code": 61032,
        "name": "hexflash",
        "filename": "61032.png"
    },
    "61033": {
        "code": 61033,
        "name": "hilbert",
        "filename": "61033.png"
    },
    "61034": {
        "code": 61034,
        "name": "hugh",
        "filename": "61034.png"
    },
    "61035": {
        "code": 61035,
        "name": "hydreigonshiny",
        "filename": "61035.png"
    },
    "61036": {
        "code": 61036,
        "name": "i_see",
        "filename": "61036.png"
    },
    "61037": {
        "code": 61037,
        "name": "ignite",
        "filename": "61037.png"
    },
    "61038": {
        "code": 61038,
        "name": "illegalgaslightingghost",
        "filename": "61038.png"
    },
    "61039": {
        "code": 61039,
        "name": "inaoi",
        "filename": "61039.png"
    },
    "61040": {
        "code": 61040,
        "name": "jonesy_pog",
        "filename": "61040.png"
    },
    "61041": {
        "code": 61041,
        "name": "kekw",
        "filename": "61041.png"
    },
    "61042": {
        "code": 61042,
        "name": "keknervous",
        "filename": "61042.png"
    },
    "61043": {
        "code": 61043,
        "name": "kekwtf",
        "filename": "61043.png"
    },
    "61044": {
        "code": 61044,
        "name": "kerbalhappy",
        "filename": "61044.png"
    },
    "61045": {
        "code": 61045,
        "name": "konatatexas",
        "filename": "61045.png"
    },
    "61046": {
        "code": 61046,
        "name": "lain",
        "filename": "61046.png"
    },
    "61047": {
        "code": 61047,
        "name": "ltc",
        "filename": "61047.png"
    },
    "61048": {
        "code": 61048,
        "name": "lunimpressed",
        "filename": "61048.png"
    },
    "61049": {
        "code": 61049,
        "name": "luxray",
        "filename": "61049.png"
    },
    "61050": {
        "code": 61050,
        "name": "materialjoker",
        "filename": "61050.png"
    },
    "61051": {
        "code": 61051,
        "name": "ma_yikesyeahnahnope",
        "filename": "61051.png"
    },
    "61052": {
        "code": 61052,
        "name": "madcat",
        "filename": "61052.png"
    },
    "61053": {
        "code": 61053,
        "name": "mankey",
        "filename": "61053.png"
    },
    "61054": {
        "code": 61054,
        "name": "margsmile",
        "filename": "61054.png"
    },
    "61055": {
        "code": 61055,
        "name": "mariesigh",
        "filename": "61055.png"
    },
    "61056": {
        "code": 61056,
        "name": "mark",
        "filename": "61056.png"
    },
    "61057": {
        "code": 61057,
        "name": "michael",
        "filename": "61057.png"
    },
    "61058": {
        "code": 61058,
        "name": "nobu",
        "filename": "61058.png"
    },
    "61059": {
        "code": 61059,
        "name": "nakeysquirt",
        "filename": "61059.png"
    },
    "61060": {
        "code": 61060,
        "name": "nanab",
        "filename": "61060.png"
    },
    "61061": {
        "code": 61061,
        "name": "nani",
        "filename": "61061.png"
    },
    "61063": {
        "code": 61063,
        "name": "normalshiny",
        "filename": "61063.png"
    },
    "61064": {
        "code": 61064,
        "name": "ogu",
        "filename": "61064.png"
    },
    "61065": {
        "code": 61065,
        "name": "omegalul",
        "filename": "61065.png"
    },
    "61066": {
        "code": 61066,
        "name": "oo",
        "filename": "61066.png"
    },
    "61067": {
        "code": 61067,
        "name": "okinamatara",
        "filename": "61067.png"
    },
    "61068": {
        "code": 61068,
        "name": "owo",
        "filename": "61068.png"
    },
    "61069": {
        "code": 61069,
        "name": "ppup",
        "filename": "61069.png"
    },
    "61070": {
        "code": 61070,
        "name": "pausechamp",
        "filename": "61070.png"
    },
    "61071": {
        "code": 61071,
        "name": "peepotexas",
        "filename": "61071.png"
    },
    "61072": {
        "code": 61072,
        "name": "pepega",
        "filename": "61072.png"
    },
    "61073": {
        "code": 61073,
        "name": "pepepains",
        "filename": "61073.png"
    },
    "61074": {
        "code": 61074,
        "name": "permissionerror",
        "filename": "61074.png"
    },
    "61075": {
        "code": 61075,
        "name": "pickael",
        "filename": "61075.png"
    },
    "61076": {
        "code": 61076,
        "name": "picklo",
        "filename": "61076.png"
    },
    "61077": {
        "code": 61077,
        "name": "piplupfried",
        "filename": "61077.png"
    },
    "61078": {
        "code": 61078,
        "name": "plaguebird",
        "filename": "61078.png"
    },
    "61079": {
        "code": 61079,
        "name": "poketrainerclown",
        "filename": "61079.png"
    },
    "61080": {
        "code": 61080,
        "name": "pourup",
        "filename": "61080.png"
    },
    "61081": {
        "code": 61081,
        "name": "psyeyeeye",
        "filename": "61081.png"
    },
    "61082": {
        "code": 61082,
        "name": "psyemoji",
        "filename": "61082.png"
    },
    "61083": {
        "code": 61083,
        "name": "recall",
        "filename": "61083.png"
    },
    "61084": {
        "code": 61084,
        "name": "residentcoolguy",
        "filename": "61084.png"
    },
    "61085": {
        "code": 61085,
        "name": "rollone",
        "filename": "61085.png"
    },
    "61086": {
        "code": 61086,
        "name": "snn_logo",
        "filename": "61086.png"
    },
    "61088": {
        "code": 61088,
        "name": "sheeeeeeesh",
        "filename": "61088.png"
    },
    "61089": {
        "code": 61089,
        "name": "sheeshblush",
        "filename": "61089.png"
    },
    "61090": {
        "code": 61090,
        "name": "shinxangy",
        "filename": "61090.png"
    },
    "61091": {
        "code": 61091,
        "name": "shinxblush",
        "filename": "61091.png"
    },
    "61092": {
        "code": 61092,
        "name": "shinxheart",
        "filename": "61092.png"
    },
    "61093": {
        "code": 61093,
        "name": "shinxsweet",
        "filename": "61093.png"
    },
    "61094": {
        "code": 61094,
        "name": "shinymank",
        "filename": "61094.png"
    },
    "61095": {
        "code": 61095,
        "name": "shit",
        "filename": "61095.png"
    },
    "61096": {
        "code": 61096,
        "name": "sitpuppo",
        "filename": "61096.png"
    },
    "61097": {
        "code": 61097,
        "name": "smite",
        "filename": "61097.png"
    },
    "61098": {
        "code": 61098,
        "name": "smugexplain",
        "filename": "61098.png"
    },
    "61099": {
        "code": 61099,
        "name": "soblank",
        "filename": "61099.png"
    },
    "61100": {
        "code": 61100,
        "name": "soditto",
        "filename": "61100.png"
    },
    "61101": {
        "code": 61101,
        "name": "sodone",
        "filename": "61101.png"
    },
    "61102": {
        "code": 61102,
        "name": "soglans",
        "filename": "61102.png"
    },
    "61103": {
        "code": 61103,
        "name": "sohappy",
        "filename": "61103.png"
    },
    "61104": {
        "code": 61104,
        "name": "sohuggie",
        "filename": "61104.png"
    },
    "61105": {
        "code": 61105,
        "name": "sohype",
        "filename": "61105.png"
    },
    "61106": {
        "code": 61106,
        "name": "sojammin",
        "filename": "61106.png"
    },
    "61107": {
        "code": 61107,
        "name": "somadr",
        "filename": "61107.png"
    },
    "61108": {
        "code": 61108,
        "name": "somad",
        "filename": "61108.png"
    },
    "61109": {
        "code": 61109,
        "name": "sorude",
        "filename": "61109.png"
    },
    "61110": {
        "code": 61110,
        "name": "sosad",
        "filename": "61110.png"
    },
    "61111": {
        "code": 61111,
        "name": "soshiny",
        "filename": "61111.png"
    },
    "61112": {
        "code": 61112,
        "name": "soshocked",
        "filename": "61112.png"
    },
    "61113": {
        "code": 61113,
        "name": "sosmug",
        "filename": "61113.png"
    },
    "61114": {
        "code": 61114,
        "name": "sosmuggo",
        "filename": "61114.png"
    },
    "61115": {
        "code": 61115,
        "name": "sostoned",
        "filename": "61115.png"
    },
    "61116": {
        "code": 61116,
        "name": "sosussy",
        "filename": "61116.png"
    },
    "61117": {
        "code": 61117,
        "name": "southerchocolate",
        "filename": "61117.png"
    },
    "61118": {
        "code": 61118,
        "name": "speedshiny",
        "filename": "61118.png"
    },
    "61119": {
        "code": 61119,
        "name": "staryushiny",
        "filename": "61119.png"
    },
    "61120": {
        "code": 61120,
        "name": "swinubshiny",
        "filename": "61120.png"
    },
    "61121": {
        "code": 61121,
        "name": "ten",
        "filename": "61121.png"
    },
    "61122": {
        "code": 61122,
        "name": "takodespair",
        "filename": "61122.png"
    },
    "61123": {
        "code": 61123,
        "name": "teleport",
        "filename": "61123.png"
    },
    "61124": {
        "code": 61124,
        "name": "thehaven",
        "filename": "61124.png"
    },
    "61125": {
        "code": 61125,
        "name": "topic",
        "filename": "61125.png"
    },
    "61126": {
        "code": 61126,
        "name": "veteranbadge",
        "filename": "61126.png"
    },
    "61127": {
        "code": 61127,
        "name": "veterantrainer",
        "filename": "61127.png"
    },
    "61128": {
        "code": 61128,
        "name": "whimsicottshiny",
        "filename": "61128.png"
    },
    "61129": {
        "code": 61129,
        "name": "whimsicott",
        "filename": "61129.png"
    },
    "61130": {
        "code": 61130,
        "name": "yippee",
        "filename": "61130.png"
    },
    "61131": {
        "code": 61131,
        "name": "zebstrikashiny",
        "filename": "61131.png"
    },
    "61132": {
        "code": 61132,
        "name": "_e_",
        "filename": "61132.png"
    },
    "61133": {
        "code": 61133,
        "name": "__",
        "filename": "61133.png"
    },
    "61134": {
        "code": 61134,
        "name": "aaaaahhhhhh",
        "filename": "61134.png"
    },
    "61135": {
        "code": 61135,
        "name": "abelsmp",
        "filename": "61135.png"
    },
    "61136": {
        "code": 61136,
        "name": "ack",
        "filename": "61136.png"
    },
    "61137": {
        "code": 61137,
        "name": "alwayshas",
        "filename": "61137.png"
    },
    "61138": {
        "code": 61138,
        "name": "amogus",
        "filename": "61138.png"
    },
    "61139": {
        "code": 61139,
        "name": "amogushinx",
        "filename": "61139.png"
    },
    "61140": {
        "code": 61140,
        "name": "analise_excessiva",
        "filename": "61140.png"
    },
    "61141": {
        "code": 61141,
        "name": "angryclown",
        "filename": "61141.png"
    },
    "61142": {
        "code": 61142,
        "name": "angryfrog",
        "filename": "61142.png"
    },
    "61143": {
        "code": 61143,
        "name": "angrykirby",
        "filename": "61143.png"
    },
    "61144": {
        "code": 61144,
        "name": "animeglasses1",
        "filename": "61144.png"
    },
    "61145": {
        "code": 61145,
        "name": "animeglasses2",
        "filename": "61145.png"
    },
    "61146": {
        "code": 61146,
        "name": "ants_in_my_eyes",
        "filename": "61146.png"
    },
    "61147": {
        "code": 61147,
        "name": "antsinmyeyesjohnson",
        "filename": "61147.png"
    },
    "61148": {
        "code": 61148,
        "name": "anxious",
        "filename": "61148.png"
    },
    "61149": {
        "code": 61149,
        "name": "ararar",
        "filename": "61149.png"
    },
    "61150": {
        "code": 61150,
        "name": "arg_cat",
        "filename": "61150.png"
    },
    "61151": {
        "code": 61151,
        "name": "autism",
        "filename": "61151.png"
    },
    "61152": {
        "code": 61152,
        "name": "aviators",
        "filename": "61152.png"
    },
    "61153": {
        "code": 61153,
        "name": "awareness",
        "filename": "61153.png"
    },
    "61154": {
        "code": 61154,
        "name": "awesomedog",
        "filename": "61154.png"
    },
    "61155": {
        "code": 61155,
        "name": "ayoo",
        "filename": "61155.png"
    },
    "61156": {
        "code": 61156,
        "name": "babypat",
        "filename": "61156.png"
    },
    "61157": {
        "code": 61157,
        "name": "badpokerface",
        "filename": "61157.png"
    },
    "61158": {
        "code": 61158,
        "name": "beacon",
        "filename": "61158.png"
    },
    "61159": {
        "code": 61159,
        "name": "belkathumb",
        "filename": "61159.png"
    },
    "61160": {
        "code": 61160,
        "name": "bird_person",
        "filename": "61160.png"
    },
    "61161": {
        "code": 61161,
        "name": "bite",
        "filename": "61161.png"
    },
    "61162": {
        "code": 61162,
        "name": "blob_sendhelp",
        "filename": "61162.png"
    },
    "61163": {
        "code": 61163,
        "name": "blobaww",
        "filename": "61163.png"
    },
    "61164": {
        "code": 61164,
        "name": "blobcat_caged",
        "filename": "61164.png"
    },
    "61165": {
        "code": 61165,
        "name": "blobfail",
        "filename": "61165.png"
    },
    "61166": {
        "code": 61166,
        "name": "blobgo",
        "filename": "61166.png"
    },
    "61167": {
        "code": 61167,
        "name": "blobgtfo",
        "filename": "61167.png"
    },
    "61168": {
        "code": 61168,
        "name": "blobmindblown",
        "filename": "61168.png"
    },
    "61169": {
        "code": 61169,
        "name": "blobsleepless",
        "filename": "61169.png"
    },
    "61170": {
        "code": 61170,
        "name": "blobthinkingglare",
        "filename": "61170.png"
    },
    "61171": {
        "code": 61171,
        "name": "blockmachinebroke",
        "filename": "61171.png"
    },
    "61172": {
        "code": 61172,
        "name": "blueorigin",
        "filename": "61172.png"
    },
    "61173": {
        "code": 61173,
        "name": "boiii",
        "filename": "61173.png"
    },
    "61174": {
        "code": 61174,
        "name": "book_rtx_off",
        "filename": "61174.png"
    },
    "61175": {
        "code": 61175,
        "name": "book_rtx_on",
        "filename": "61175.png"
    },
    "61176": {
        "code": 61176,
        "name": "boooo",
        "filename": "61176.png"
    },
    "61177": {
        "code": 61177,
        "name": "brthink",
        "filename": "61177.png"
    },
    "61178": {
        "code": 61178,
        "name": "bruh",
        "filename": "61178.png"
    },
    "61179": {
        "code": 61179,
        "name": "bruh_you_ok",
        "filename": "61179.png"
    },
    "61180": {
        "code": 61180,
        "name": "bruhwaht",
        "filename": "61180.png"
    },
    "61181": {
        "code": 61181,
        "name": "bruv",
        "filename": "61181.png"
    },
    "61182": {
        "code": 61182,
        "name": "buff_spongebob",
        "filename": "61182.png"
    },
    "61183": {
        "code": 61183,
        "name": "butters_ohshit",
        "filename": "61183.png"
    },
    "61184": {
        "code": 61184,
        "name": "bye",
        "filename": "61184.png"
    },
    "61185": {
        "code": 61185,
        "name": "cappremovebgpreviewmodified",
        "filename": "61185.png"
    },
    "61186": {
        "code": 61186,
        "name": "carl_aint_fuckin_around",
        "filename": "61186.png"
    },
    "61187": {
        "code": 61187,
        "name": "carlmfao",
        "filename": "61187.png"
    },
    "61188": {
        "code": 61188,
        "name": "cathover",
        "filename": "61188.png"
    },
    "61189": {
        "code": 61189,
        "name": "catnotamused",
        "filename": "61189.png"
    },
    "61190": {
        "code": 61190,
        "name": "cheems",
        "filename": "61190.png"
    },
    "61191": {
        "code": 61191,
        "name": "cheemsburguesa",
        "filename": "61191.png"
    },
    "61192": {
        "code": 61192,
        "name": "cheemscry",
        "filename": "61192.png"
    },
    "61193": {
        "code": 61193,
        "name": "cheers_ill_drink",
        "filename": "61193.png"
    },
    "61194": {
        "code": 61194,
        "name": "cheeseysmirk",
        "filename": "61194.png"
    },
    "61195": {
        "code": 61195,
        "name": "clown_champion",
        "filename": "61195.png"
    },
    "61196": {
        "code": 61196,
        "name": "clown_sir",
        "filename": "61196.png"
    },
    "61197": {
        "code": 61197,
        "name": "clownskull",
        "filename": "61197.png"
    },
    "61198": {
        "code": 61198,
        "name": "confusedcat",
        "filename": "61198.png"
    },
    "61199": {
        "code": 61199,
        "name": "confusion",
        "filename": "61199.png"
    },
    "61200": {
        "code": 61200,
        "name": "cool",
        "filename": "61200.png"
    },
    "61201": {
        "code": 61201,
        "name": "coolbetcha",
        "filename": "61201.png"
    },
    "61202": {
        "code": 61202,
        "name": "courier_flaps",
        "filename": "61202.png"
    },
    "61203": {
        "code": 61203,
        "name": "cringe",
        "filename": "61203.png"
    },
    "61204": {
        "code": 61204,
        "name": "croagunk",
        "filename": "61204.png"
    },
    "61205": {
        "code": 61205,
        "name": "crossgerman",
        "filename": "61205.png"
    },
    "61206": {
        "code": 61206,
        "name": "crumpet_intensifies",
        "filename": "61206.png"
    },
    "61207": {
        "code": 61207,
        "name": "crusade_upgrade",
        "filename": "61207.png"
    },
    "61208": {
        "code": 61208,
        "name": "cryaboutit",
        "filename": "61208.png"
    },
    "61209": {
        "code": 61209,
        "name": "cubecake",
        "filename": "61209.png"
    },
    "61210": {
        "code": 61210,
        "name": "cubecake_lit_black",
        "filename": "61210.png"
    },
    "61211": {
        "code": 61211,
        "name": "cubecake_lit_orange",
        "filename": "61211.png"
    },
    "61212": {
        "code": 61212,
        "name": "cubecake_lit_purple",
        "filename": "61212.png"
    },
    "61213": {
        "code": 61213,
        "name": "cursed_1",
        "filename": "61213.png"
    },
    "61214": {
        "code": 61214,
        "name": "cursed_2",
        "filename": "61214.png"
    },
    "61215": {
        "code": 61215,
        "name": "cursed",
        "filename": "61215.png"
    },
    "61216": {
        "code": 61216,
        "name": "cursedtorres",
        "filename": "61216.png"
    },
    "61217": {
        "code": 61217,
        "name": "cutter",
        "filename": "61217.png"
    },
    "61218": {
        "code": 61218,
        "name": "dabward",
        "filename": "61218.png"
    },
    "61219": {
        "code": 61219,
        "name": "damper",
        "filename": "61219.png"
    },
    "61220": {
        "code": 61220,
        "name": "danny_laugh",
        "filename": "61220.png"
    },
    "61221": {
        "code": 61221,
        "name": "darkwiz",
        "filename": "61221.png"
    },
    "61222": {
        "code": 61222,
        "name": "demoman",
        "filename": "61222.png"
    },
    "61223": {
        "code": 61223,
        "name": "derp_blush2",
        "filename": "61223.png"
    },
    "61224": {
        "code": 61224,
        "name": "derp_blush",
        "filename": "61224.png"
    },
    "61225": {
        "code": 61225,
        "name": "derp_cash",
        "filename": "61225.png"
    },
    "61226": {
        "code": 61226,
        "name": "derp_cold",
        "filename": "61226.png"
    },
    "61227": {
        "code": 61227,
        "name": "derp_cool",
        "filename": "61227.png"
    },
    "61228": {
        "code": 61228,
        "name": "derp_cowboy",
        "filename": "61228.png"
    },
    "61229": {
        "code": 61229,
        "name": "derp_derp",
        "filename": "61229.png"
    },
    "61230": {
        "code": 61230,
        "name": "derp_disguise",
        "filename": "61230.png"
    },
    "61231": {
        "code": 61231,
        "name": "derp_eyebrow",
        "filename": "61231.png"
    },
    "61232": {
        "code": 61232,
        "name": "derp_frown",
        "filename": "61232.png"
    },
    "61233": {
        "code": 61233,
        "name": "derp_gasp",
        "filename": "61233.png"
    },
    "61234": {
        "code": 61234,
        "name": "derp_grin",
        "filename": "61234.png"
    },
    "61235": {
        "code": 61235,
        "name": "derp_halo",
        "filename": "61235.png"
    },
    "61236": {
        "code": 61236,
        "name": "derp_hearts1",
        "filename": "61236.png"
    },
    "61237": {
        "code": 61237,
        "name": "derp_hearts2",
        "filename": "61237.png"
    },
    "61238": {
        "code": 61238,
        "name": "derp_hmm",
        "filename": "61238.png"
    },
    "61239": {
        "code": 61239,
        "name": "derp_joytears",
        "filename": "61239.png"
    },
    "61240": {
        "code": 61240,
        "name": "derp_mindblown",
        "filename": "61240.png"
    },
    "61241": {
        "code": 61241,
        "name": "derp_nerd",
        "filename": "61241.png"
    },
    "61242": {
        "code": 61242,
        "name": "derp_nonameyet",
        "filename": "61242.png"
    },
    "61243": {
        "code": 61243,
        "name": "derp_party",
        "filename": "61243.png"
    },
    "61244": {
        "code": 61244,
        "name": "derp_shh",
        "filename": "61244.png"
    },
    "61245": {
        "code": 61245,
        "name": "derp_smile",
        "filename": "61245.png"
    },
    "61246": {
        "code": 61246,
        "name": "derp_smooch",
        "filename": "61246.png"
    },
    "61247": {
        "code": 61247,
        "name": "derp_superderp",
        "filename": "61247.png"
    },
    "61248": {
        "code": 61248,
        "name": "derp_tongue",
        "filename": "61248.png"
    },
    "61249": {
        "code": 61249,
        "name": "derp_zzz",
        "filename": "61249.png"
    },
    "61250": {
        "code": 61250,
        "name": "derpo",
        "filename": "61250.png"
    },
    "61251": {
        "code": 61251,
        "name": "derpo_frog",
        "filename": "61251.png"
    },
    "61252": {
        "code": 61252,
        "name": "develop_an_app",
        "filename": "61252.png"
    },
    "61253": {
        "code": 61253,
        "name": "diamondhelmpeepo",
        "filename": "61253.png"
    },
    "61254": {
        "code": 61254,
        "name": "disgusted",
        "filename": "61254.png"
    },
    "61255": {
        "code": 61255,
        "name": "dogegun",
        "filename": "61255.png"
    },
    "61256": {
        "code": 61256,
        "name": "dogewink",
        "filename": "61256.png"
    },
    "61257": {
        "code": 61257,
        "name": "doggok",
        "filename": "61257.png"
    },
    "61258": {
        "code": 61258,
        "name": "dokiemoji",
        "filename": "61258.png"
    },
    "61259": {
        "code": 61259,
        "name": "donttouchmeimsterile",
        "filename": "61259.png"
    },
    "61260": {
        "code": 61260,
        "name": "doofus_rick",
        "filename": "61260.png"
    },
    "61261": {
        "code": 61261,
        "name": "drake_ban",
        "filename": "61261.png"
    },
    "61262": {
        "code": 61262,
        "name": "drank",
        "filename": "61262.png"
    },
    "61263": {
        "code": 61263,
        "name": "dubious",
        "filename": "61263.png"
    },
    "61264": {
        "code": 61264,
        "name": "duogun",
        "filename": "61264.png"
    },
    "61265": {
        "code": 61265,
        "name": "e1",
        "filename": "61265.png"
    },
    "61266": {
        "code": 61266,
        "name": "e2",
        "filename": "61266.png"
    },
    "61267": {
        "code": 61267,
        "name": "e3",
        "filename": "61267.png"
    },
    "61268": {
        "code": 61268,
        "name": "e4",
        "filename": "61268.png"
    },
    "61269": {
        "code": 61269,
        "name": "emoji_10",
        "filename": "61269.png"
    },
    "61270": {
        "code": 61270,
        "name": "emoji_11",
        "filename": "61270.png"
    },
    "61271": {
        "code": 61271,
        "name": "emoji_12",
        "filename": "61271.png"
    },
    "61272": {
        "code": 61272,
        "name": "emoji_14",
        "filename": "61272.png"
    },
    "61273": {
        "code": 61273,
        "name": "emoji_15",
        "filename": "61273.png"
    },
    "61274": {
        "code": 61274,
        "name": "emoji_266",
        "filename": "61274.png"
    },
    "61275": {
        "code": 61275,
        "name": "emoji_267",
        "filename": "61275.png"
    },
    "61276": {
        "code": 61276,
        "name": "emoji_268",
        "filename": "61276.png"
    },
    "61277": {
        "code": 61277,
        "name": "emoji_270",
        "filename": "61277.png"
    },
    "61278": {
        "code": 61278,
        "name": "emoji_271",
        "filename": "61278.png"
    },
    "61279": {
        "code": 61279,
        "name": "emoji_273",
        "filename": "61279.png"
    },
    "61280": {
        "code": 61280,
        "name": "emoji_274",
        "filename": "61280.png"
    },
    "61281": {
        "code": 61281,
        "name": "emoji_275",
        "filename": "61281.png"
    },
    "61282": {
        "code": 61282,
        "name": "emoji_276",
        "filename": "61282.png"
    },
    "61283": {
        "code": 61283,
        "name": "emoji_278",
        "filename": "61283.png"
    },
    "61284": {
        "code": 61284,
        "name": "emoji_32",
        "filename": "61284.png"
    },
    "61285": {
        "code": 61285,
        "name": "emoji_3",
        "filename": "61285.png"
    },
    "61286": {
        "code": 61286,
        "name": "emoji_4",
        "filename": "61286.png"
    },
    "61287": {
        "code": 61287,
        "name": "emoji_5",
        "filename": "61287.png"
    },
    "61288": {
        "code": 61288,
        "name": "emoji_6",
        "filename": "61288.png"
    },
    "61289": {
        "code": 61289,
        "name": "emoji_8",
        "filename": "61289.png"
    },
    "61290": {
        "code": 61290,
        "name": "emoji_9",
        "filename": "61290.png"
    },
    "61291": {
        "code": 61291,
        "name": "ermehgerd",
        "filename": "61291.png"
    },
    "61292": {
        "code": 61292,
        "name": "everywhere",
        "filename": "61292.png"
    },
    "61293": {
        "code": 61293,
        "name": "evillaugh",
        "filename": "61293.png"
    },
    "61294": {
        "code": 61294,
        "name": "eyebleach",
        "filename": "61294.png"
    },
    "61295": {
        "code": 61295,
        "name": "eyerollvom",
        "filename": "61295.png"
    },
    "61296": {
        "code": 61296,
        "name": "f_to_pay_respects",
        "filename": "61296.png"
    },
    "61297": {
        "code": 61297,
        "name": "family_gone",
        "filename": "61297.png"
    },
    "61298": {
        "code": 61298,
        "name": "family_yes",
        "filename": "61298.png"
    },
    "61299": {
        "code": 61299,
        "name": "findhelp",
        "filename": "61299.png"
    },
    "61300": {
        "code": 61300,
        "name": "fisheyedoggo",
        "filename": "61300.png"
    },
    "61301": {
        "code": 61301,
        "name": "flag_sov",
        "filename": "61301.png"
    },
    "61302": {
        "code": 61302,
        "name": "flan_scare",
        "filename": "61302.png"
    },
    "61303": {
        "code": 61303,
        "name": "forgor",
        "filename": "61303.png"
    },
    "61304": {
        "code": 61304,
        "name": "freemano",
        "filename": "61304.png"
    },
    "61305": {
        "code": 61305,
        "name": "freshplus",
        "filename": "61305.png"
    },
    "61306": {
        "code": 61306,
        "name": "fry_panic",
        "filename": "61306.png"
    },
    "61307": {
        "code": 61307,
        "name": "fry_squint",
        "filename": "61307.png"
    },
    "61308": {
        "code": 61308,
        "name": "fuck",
        "filename": "61308.png"
    },
    "61309": {
        "code": 61309,
        "name": "gamers_rise_up",
        "filename": "61309.png"
    },
    "61310": {
        "code": 61310,
        "name": "get_in",
        "filename": "61310.png"
    },
    "61311": {
        "code": 61311,
        "name": "ghost_in_a_jar",
        "filename": "61311.png"
    },
    "61312": {
        "code": 61312,
        "name": "giddygun",
        "filename": "61312.png"
    },
    "61313": {
        "code": 61313,
        "name": "giga",
        "filename": "61313.png"
    },
    "61314": {
        "code": 61314,
        "name": "gigacheems",
        "filename": "61314.png"
    },
    "61315": {
        "code": 61315,
        "name": "gladge",
        "filename": "61315.png"
    },
    "61316": {
        "code": 61316,
        "name": "glassespush",
        "filename": "61316.png"
    },
    "61317": {
        "code": 61317,
        "name": "go_on",
        "filename": "61317.png"
    },
    "61318": {
        "code": 61318,
        "name": "good_boi",
        "filename": "61318.png"
    },
    "61319": {
        "code": 61319,
        "name": "goodnews",
        "filename": "61319.png"
    },
    "61320": {
        "code": 61320,
        "name": "guess_ill_die",
        "filename": "61320.png"
    },
    "61321": {
        "code": 61321,
        "name": "gunpoint",
        "filename": "61321.png"
    },
    "61322": {
        "code": 61322,
        "name": "gunthink",
        "filename": "61322.png"
    },
    "61323": {
        "code": 61323,
        "name": "haaaaaaa",
        "filename": "61323.png"
    },
    "61324": {
        "code": 61324,
        "name": "hackerman",
        "filename": "61324.png"
    },
    "61325": {
        "code": 61325,
        "name": "hammerandsickle",
        "filename": "61325.png"
    },
    "61326": {
        "code": 61326,
        "name": "happy",
        "filename": "61326.png"
    },
    "61327": {
        "code": 61327,
        "name": "happythumb",
        "filename": "61327.png"
    },
    "61328": {
        "code": 61328,
        "name": "hardbully",
        "filename": "61328.png"
    },
    "61329": {
        "code": 61329,
        "name": "hardsame",
        "filename": "61329.png"
    },
    "61330": {
        "code": 61330,
        "name": "heavybreathing",
        "filename": "61330.png"
    },
    "61331": {
        "code": 61331,
        "name": "heh",
        "filename": "61331.png"
    },
    "61332": {
        "code": 61332,
        "name": "hellagay",
        "filename": "61332.png"
    },
    "61333": {
        "code": 61333,
        "name": "hide_the_pain",
        "filename": "61333.png"
    },
    "61334": {
        "code": 61334,
        "name": "hm_emote1",
        "filename": "61334.png"
    },
    "61335": {
        "code": 61335,
        "name": "hm_emote",
        "filename": "61335.png"
    },
    "61336": {
        "code": 61336,
        "name": "hmm_mouthgun",
        "filename": "61336.png"
    },
    "61337": {
        "code": 61337,
        "name": "hmm_smirk",
        "filename": "61337.png"
    },
    "61338": {
        "code": 61338,
        "name": "hmmfish",
        "filename": "61338.png"
    },
    "61339": {
        "code": 61339,
        "name": "hmmmmhh",
        "filename": "61339.png"
    },
    "61340": {
        "code": 61340,
        "name": "hololiver",
        "filename": "61340.png"
    },
    "61341": {
        "code": 61341,
        "name": "horror",
        "filename": "61341.png"
    },
    "61342": {
        "code": 61342,
        "name": "hot",
        "filename": "61342.png"
    },
    "61343": {
        "code": 61343,
        "name": "hug",
        "filename": "61343.png"
    },
    "61344": {
        "code": 61344,
        "name": "i_dont_even",
        "filename": "61344.png"
    },
    "61345": {
        "code": 61345,
        "name": "i_know_that",
        "filename": "61345.png"
    },
    "61346": {
        "code": 61346,
        "name": "idkduderick",
        "filename": "61346.png"
    },
    "61347": {
        "code": 61347,
        "name": "ifyouknowwhatimeme",
        "filename": "61347.png"
    },
    "61348": {
        "code": 61348,
        "name": "ijustwantedthis",
        "filename": "61348.png"
    },
    "61349": {
        "code": 61349,
        "name": "imageedit_5_2965106301",
        "filename": "61349.png"
    },
    "61350": {
        "code": 61350,
        "name": "imagine",
        "filename": "61350.png"
    },
    "61351": {
        "code": 61351,
        "name": "immaheadout",
        "filename": "61351.png"
    },
    "61352": {
        "code": 61352,
        "name": "isleep",
        "filename": "61352.png"
    },
    "61353": {
        "code": 61353,
        "name": "jokedog",
        "filename": "61353.png"
    },
    "61354": {
        "code": 61354,
        "name": "jpegdog",
        "filename": "61354.png"
    },
    "61355": {
        "code": 61355,
        "name": "judgemorty",
        "filename": "61355.png"
    },
    "61356": {
        "code": 61356,
        "name": "justright",
        "filename": "61356.png"
    },
    "61357": {
        "code": 61357,
        "name": "kijij",
        "filename": "61357.png"
    },
    "61358": {
        "code": 61358,
        "name": "kirby_rick",
        "filename": "61358.png"
    },
    "61359": {
        "code": 61359,
        "name": "kloomp",
        "filename": "61359.png"
    },
    "61360": {
        "code": 61360,
        "name": "knifepepe",
        "filename": "61360.png"
    },
    "61361": {
        "code": 61361,
        "name": "kys",
        "filename": "61361.png"
    },
    "61362": {
        "code": 61362,
        "name": "light_skinenergy",
        "filename": "61362.png"
    },
    "61363": {
        "code": 61363,
        "name": "lmao",
        "filename": "61363.png"
    },
    "61364": {
        "code": 61364,
        "name": "lmaoooo",
        "filename": "61364.png"
    },
    "61365": {
        "code": 61365,
        "name": "lmfao",
        "filename": "61365.png"
    },
    "61366": {
        "code": 61366,
        "name": "looool",
        "filename": "61366.png"
    },
    "61367": {
        "code": 61367,
        "name": "love",
        "filename": "61367.png"
    },
    "61368": {
        "code": 61368,
        "name": "lurking",
        "filename": "61368.png"
    },
    "61369": {
        "code": 61369,
        "name": "mockingsb",
        "filename": "61369.png"
    },
    "61370": {
        "code": 61370,
        "name": "math_ptsd_dog",
        "filename": "61370.png"
    },
    "61371": {
        "code": 61371,
        "name": "mc_diamond",
        "filename": "61371.png"
    },
    "61372": {
        "code": 61372,
        "name": "mcbread",
        "filename": "61372.png"
    },
    "61373": {
        "code": 61373,
        "name": "megusta",
        "filename": "61373.png"
    },
    "61374": {
        "code": 61374,
        "name": "messed_up",
        "filename": "61374.png"
    },
    "61375": {
        "code": 61375,
        "name": "miaeyes",
        "filename": "61375.png"
    },
    "61376": {
        "code": 61376,
        "name": "mightycheems",
        "filename": "61376.png"
    },
    "61377": {
        "code": 61377,
        "name": "misamisa",
        "filename": "61377.png"
    },
    "61378": {
        "code": 61378,
        "name": "mobile",
        "filename": "61378.png"
    },
    "61379": {
        "code": 61379,
        "name": "momomo",
        "filename": "61379.png"
    },
    "61380": {
        "code": 61380,
        "name": "money",
        "filename": "61380.png"
    },
    "61381": {
        "code": 61381,
        "name": "monkas",
        "filename": "61381.png"
    },
    "61382": {
        "code": 61382,
        "name": "morgano",
        "filename": "61382.png"
    },
    "61383": {
        "code": 61383,
        "name": "mspepeexplain",
        "filename": "61383.png"
    },
    "61384": {
        "code": 61384,
        "name": "muscle_duck",
        "filename": "61384.png"
    },
    "61385": {
        "code": 61385,
        "name": "myyyy_man",
        "filename": "61385.png"
    },
    "61386": {
        "code": 61386,
        "name": "naoya",
        "filename": "61386.png"
    },
    "61387": {
        "code": 61387,
        "name": "nbbawhat",
        "filename": "61387.png"
    },
    "61388": {
        "code": 61388,
        "name": "netd_16",
        "filename": "61388.png"
    },
    "61389": {
        "code": 61389,
        "name": "nibba",
        "filename": "61389.png"
    },
    "61390": {
        "code": 61390,
        "name": "nipples",
        "filename": "61390.png"
    },
    "61391": {
        "code": 61391,
        "name": "no",
        "filename": "61391.png"
    },
    "61392": {
        "code": 61392,
        "name": "no_derps",
        "filename": "61392.png"
    },
    "61393": {
        "code": 61393,
        "name": "noanimepls",
        "filename": "61393.png"
    },
    "61394": {
        "code": 61394,
        "name": "noice",
        "filename": "61394.png"
    },
    "61395": {
        "code": 61395,
        "name": "noob_noob",
        "filename": "61395.png"
    },
    "61396": {
        "code": 61396,
        "name": "nope",
        "filename": "61396.png"
    },
    "61397": {
        "code": 61397,
        "name": "notamused",
        "filename": "61397.png"
    },
    "61398": {
        "code": 61398,
        "name": "ohfuuuuck",
        "filename": "61398.png"
    },
    "61399": {
        "code": 61399,
        "name": "ohshit",
        "filename": "61399.png"
    },
    "61400": {
        "code": 61400,
        "name": "ohshit_puppet",
        "filename": "61400.png"
    },
    "61401": {
        "code": 61401,
        "name": "ohyeah",
        "filename": "61401.png"
    },
    "61402": {
        "code": 61402,
        "name": "okaylib",
        "filename": "61402.png"
    },
    "61403": {
        "code": 61403,
        "name": "omegameganom",
        "filename": "61403.png"
    },
    "61404": {
        "code": 61404,
        "name": "oooooooh_weeeeee",
        "filename": "61404.png"
    },
    "61405": {
        "code": 61405,
        "name": "painbot",
        "filename": "61405.png"
    },
    "61406": {
        "code": 61406,
        "name": "panik",
        "filename": "61406.png"
    },
    "61407": {
        "code": 61407,
        "name": "pat",
        "filename": "61407.png"
    },
    "61408": {
        "code": 61408,
        "name": "peaceamongworlds",
        "filename": "61408.png"
    },
    "61409": {
        "code": 61409,
        "name": "peepohug",
        "filename": "61409.png"
    },
    "61410": {
        "code": 61410,
        "name": "peepohypers",
        "filename": "61410.png"
    },
    "61411": {
        "code": 61411,
        "name": "peeposadblankie",
        "filename": "61411.png"
    },
    "61412": {
        "code": 61412,
        "name": "peeposlav",
        "filename": "61412.png"
    },
    "61413": {
        "code": 61413,
        "name": "peeposleep",
        "filename": "61413.png"
    },
    "61414": {
        "code": 61414,
        "name": "peeposmile",
        "filename": "61414.png"
    },
    "61415": {
        "code": 61415,
        "name": "pencilvester",
        "filename": "61415.png"
    },
    "61416": {
        "code": 61416,
        "name": "pensive_clown",
        "filename": "61416.png"
    },
    "61417": {
        "code": 61417,
        "name": "pepe4k",
        "filename": "61417.png"
    },
    "61418": {
        "code": 61418,
        "name": "pepelaugh",
        "filename": "61418.png"
    },
    "61419": {
        "code": 61419,
        "name": "pepe_knife",
        "filename": "61419.png"
    },
    "61420": {
        "code": 61420,
        "name": "pepe_nerd",
        "filename": "61420.png"
    },
    "61421": {
        "code": 61421,
        "name": "pepe_ragelaser",
        "filename": "61421.png"
    },
    "61422": {
        "code": 61422,
        "name": "pepe_sweat",
        "filename": "61422.png"
    },
    "61423": {
        "code": 61423,
        "name": "pepebusinessfrog",
        "filename": "61423.png"
    },
    "61424": {
        "code": 61424,
        "name": "pepedinnerparty",
        "filename": "61424.png"
    },
    "61425": {
        "code": 61425,
        "name": "pepegun",
        "filename": "61425.png"
    },
    "61426": {
        "code": 61426,
        "name": "pepehorrified",
        "filename": "61426.png"
    },
    "61427": {
        "code": 61427,
        "name": "pepesuffering",
        "filename": "61427.png"
    },
    "61428": {
        "code": 61428,
        "name": "pepesweatsmile",
        "filename": "61428.png"
    },
    "61429": {
        "code": 61429,
        "name": "pepethink",
        "filename": "61429.png"
    },
    "61430": {
        "code": 61430,
        "name": "pepowoah",
        "filename": "61430.png"
    },
    "61431": {
        "code": 61431,
        "name": "pepward",
        "filename": "61431.png"
    },
    "61432": {
        "code": 61432,
        "name": "perhaps",
        "filename": "61432.png"
    },
    "61433": {
        "code": 61433,
        "name": "peter",
        "filename": "61433.png"
    },
    "61434": {
        "code": 61434,
        "name": "phat",
        "filename": "61434.png"
    },
    "61435": {
        "code": 61435,
        "name": "pika_aint_fuckin_around",
        "filename": "61435.png"
    },
    "61436": {
        "code": 61436,
        "name": "pika_gasp",
        "filename": "61436.png"
    },
    "61437": {
        "code": 61437,
        "name": "pikablush",
        "filename": "61437.png"
    },
    "61438": {
        "code": 61438,
        "name": "pikagun",
        "filename": "61438.png"
    },
    "61439": {
        "code": 61439,
        "name": "placticknifepepe",
        "filename": "61439.png"
    },
    "61440": {
        "code": 61440,
        "name": "pneis",
        "filename": "61440.png"
    },
    "61441": {
        "code": 61441,
        "name": "pog",
        "filename": "61441.png"
    },
    "61442": {
        "code": 61442,
        "name": "pokerface",
        "filename": "61442.png"
    },
    "61443": {
        "code": 61443,
        "name": "poppy",
        "filename": "61443.png"
    },
    "61444": {
        "code": 61444,
        "name": "porygonshiny",
        "filename": "61444.png"
    },
    "61445": {
        "code": 61445,
        "name": "ptsd_dog",
        "filename": "61445.png"
    },
    "61446": {
        "code": 61446,
        "name": "quitcapping",
        "filename": "61446.png"
    },
    "61447": {
        "code": 61447,
        "name": "raccnveder",
        "filename": "61447.png"
    },
    "61448": {
        "code": 61448,
        "name": "rainbow_armor",
        "filename": "61448.png"
    },
    "61449": {
        "code": 61449,
        "name": "rape",
        "filename": "61449.png"
    },
    "61450": {
        "code": 61450,
        "name": "raygirlfriend",
        "filename": "61450.png"
    },
    "61451": {
        "code": 61451,
        "name": "realism_skull",
        "filename": "61451.png"
    },
    "61452": {
        "code": 61452,
        "name": "realshit",
        "filename": "61452.png"
    },
    "61453": {
        "code": 61453,
        "name": "ren",
        "filename": "61453.png"
    },
    "61454": {
        "code": 61454,
        "name": "ricecake",
        "filename": "61454.png"
    },
    "61455": {
        "code": 61455,
        "name": "ripinpeace",
        "filename": "61455.png"
    },
    "61456": {
        "code": 61456,
        "name": "rofl_facepalm",
        "filename": "61456.png"
    },
    "61457": {
        "code": 61457,
        "name": "roses",
        "filename": "61457.png"
    },
    "61458": {
        "code": 61458,
        "name": "ruh_roh",
        "filename": "61458.png"
    },
    "61459": {
        "code": 61459,
        "name": "runningupthatchicken",
        "filename": "61459.png"
    },
    "61460": {
        "code": 61460,
        "name": "sadboi",
        "filename": "61460.png"
    },
    "61461": {
        "code": 61461,
        "name": "sadcat_thumbsup",
        "filename": "61461.png"
    },
    "61462": {
        "code": 61462,
        "name": "sadge1",
        "filename": "61462.png"
    },
    "61463": {
        "code": 61463,
        "name": "sadge2",
        "filename": "61463.png"
    },
    "61464": {
        "code": 61464,
        "name": "sadge3",
        "filename": "61464.png"
    },
    "61465": {
        "code": 61465,
        "name": "sadge4",
        "filename": "61465.png"
    },
    "61466": {
        "code": 61466,
        "name": "sadge",
        "filename": "61466.png"
    },
    "61467": {
        "code": 61467,
        "name": "sadlad",
        "filename": "61467.png"
    },
    "61468": {
        "code": 61468,
        "name": "saw_that",
        "filename": "61468.png"
    },
    "61469": {
        "code": 61469,
        "name": "sb_wallet",
        "filename": "61469.png"
    },
    "61470": {
        "code": 61470,
        "name": "sbtriuhhuib",
        "filename": "61470.png"
    },
    "61471": {
        "code": 61471,
        "name": "scientist_myself",
        "filename": "61471.png"
    },
    "61472": {
        "code": 61472,
        "name": "screamemoji",
        "filename": "61472.png"
    },
    "61473": {
        "code": 61473,
        "name": "screaming_sun",
        "filename": "61473.png"
    },
    "61474": {
        "code": 61474,
        "name": "shell_shocked",
        "filename": "61474.png"
    },
    "61475": {
        "code": 61475,
        "name": "shinxing",
        "filename": "61475.png"
    },
    "61476": {
        "code": 61476,
        "name": "shinxpix",
        "filename": "61476.png"
    },
    "61477": {
        "code": 61477,
        "name": "shinxroar",
        "filename": "61477.png"
    },
    "61478": {
        "code": 61478,
        "name": "shinxsleep",
        "filename": "61478.png"
    },
    "61479": {
        "code": 61479,
        "name": "shinxwut",
        "filename": "61479.png"
    },
    "61480": {
        "code": 61480,
        "name": "shinxyeah",
        "filename": "61480.png"
    },
    "61481": {
        "code": 61481,
        "name": "shitsmirk",
        "filename": "61481.png"
    },
    "61482": {
        "code": 61482,
        "name": "shrug",
        "filename": "61482.png"
    },
    "61483": {
        "code": 61483,
        "name": "sic_wolf",
        "filename": "61483.png"
    },
    "61484": {
        "code": 61484,
        "name": "simpleusericon_5f3407053cf89",
        "filename": "61484.png"
    },
    "61485": {
        "code": 61485,
        "name": "sipsip",
        "filename": "61485.png"
    },
    "61486": {
        "code": 61486,
        "name": "slo_______poke",
        "filename": "61486.png"
    },
    "61487": {
        "code": 61487,
        "name": "smokin",
        "filename": "61487.png"
    },
    "61488": {
        "code": 61488,
        "name": "snowball",
        "filename": "61488.png"
    },
    "61489": {
        "code": 61489,
        "name": "soontm",
        "filename": "61489.png"
    },
    "61490": {
        "code": 61490,
        "name": "spacexemote",
        "filename": "61490.png"
    },
    "61491": {
        "code": 61491,
        "name": "spit_take",
        "filename": "61491.png"
    },
    "61492": {
        "code": 61492,
        "name": "startedblasting",
        "filename": "61492.png"
    },
    "61493": {
        "code": 61493,
        "name": "straightface_gun",
        "filename": "61493.png"
    },
    "61494": {
        "code": 61494,
        "name": "stronk",
        "filename": "61494.png"
    },
    "61495": {
        "code": 61495,
        "name": "stuckinvim",
        "filename": "61495.png"
    },
    "61496": {
        "code": 61496,
        "name": "summer_and_tinkles",
        "filename": "61496.png"
    },
    "61497": {
        "code": 61497,
        "name": "sussy",
        "filename": "61497.png"
    },
    "61498": {
        "code": 61498,
        "name": "swoon",
        "filename": "61498.png"
    },
    "61499": {
        "code": 61499,
        "name": "tatsuya",
        "filename": "61499.png"
    },
    "61500": {
        "code": 61500,
        "name": "tbh_same",
        "filename": "61500.png"
    },
    "61501": {
        "code": 61501,
        "name": "tendies",
        "filename": "61501.png"
    },
    "61502": {
        "code": 61502,
        "name": "texture_missing",
        "filename": "61502.png"
    },
    "61503": {
        "code": 61503,
        "name": "the_look",
        "filename": "61503.png"
    },
    "61504": {
        "code": 61504,
        "name": "thicc",
        "filename": "61504.png"
    },
    "61505": {
        "code": 61505,
        "name": "this",
        "filename": "61505.png"
    },
    "61506": {
        "code": 61506,
        "name": "this_raoh",
        "filename": "61506.png"
    },
    "61507": {
        "code": 61507,
        "name": "thisfuckinguy",
        "filename": "61507.png"
    },
    "61508": {
        "code": 61508,
        "name": "timeforacrusade",
        "filename": "61508.png"
    },
    "61509": {
        "code": 61509,
        "name": "tinyderpface",
        "filename": "61509.png"
    },
    "61510": {
        "code": 61510,
        "name": "tired",
        "filename": "61510.png"
    },
    "61511": {
        "code": 61511,
        "name": "trollmoji",
        "filename": "61511.png"
    },
    "61512": {
        "code": 61512,
        "name": "trololol",
        "filename": "61512.png"
    },
    "61513": {
        "code": 61513,
        "name": "trudge_tomahawk",
        "filename": "61513.png"
    },
    "61514": {
        "code": 61514,
        "name": "truestamp",
        "filename": "61514.png"
    },
    "61515": {
        "code": 61515,
        "name": "trunk_person",
        "filename": "61515.png"
    },
    "61516": {
        "code": 61516,
        "name": "ugh",
        "filename": "61516.png"
    },
    "61517": {
        "code": 61517,
        "name": "upside_down_bucket",
        "filename": "61517.png"
    },
    "61518": {
        "code": 61518,
        "name": "vault_mad",
        "filename": "61518.png"
    },
    "61519": {
        "code": 61519,
        "name": "vault_thumb",
        "filename": "61519.png"
    },
    "61520": {
        "code": 61520,
        "name": "vault_wanderer",
        "filename": "61520.png"
    },
    "61521": {
        "code": 61521,
        "name": "vaultsalt",
        "filename": "61521.png"
    },
    "61522": {
        "code": 61522,
        "name": "verypolite",
        "filename": "61522.png"
    },
    "61523": {
        "code": 61523,
        "name": "vindictivepat",
        "filename": "61523.png"
    },
    "61524": {
        "code": 61524,
        "name": "waitwhat",
        "filename": "61524.png"
    },
    "61525": {
        "code": 61525,
        "name": "waminut",
        "filename": "61525.png"
    },
    "61526": {
        "code": 61526,
        "name": "watching",
        "filename": "61526.png"
    },
    "61527": {
        "code": 61527,
        "name": "why",
        "filename": "61527.png"
    },
    "61528": {
        "code": 61528,
        "name": "why_did_i_eat_this_lemon",
        "filename": "61528.png"
    },
    "61529": {
        "code": 61529,
        "name": "why_the_ski_mask_tho",
        "filename": "61529.png"
    },
    "61530": {
        "code": 61530,
        "name": "whynotzoidberg",
        "filename": "61530.png"
    },
    "61531": {
        "code": 61531,
        "name": "whyyy",
        "filename": "61531.png"
    },
    "61532": {
        "code": 61532,
        "name": "win_key",
        "filename": "61532.png"
    },
    "61533": {
        "code": 61533,
        "name": "windows",
        "filename": "61533.png"
    },
    "61534": {
        "code": 61534,
        "name": "wrench",
        "filename": "61534.png"
    },
    "61535": {
        "code": 61535,
        "name": "wtf_carl",
        "filename": "61535.png"
    },
    "61536": {
        "code": 61536,
        "name": "wtfdidijustread",
        "filename": "61536.png"
    },
    "61537": {
        "code": 61537,
        "name": "x_to_doubt",
        "filename": "61537.png"
    },
    "61538": {
        "code": 61538,
        "name": "yeah_ok_fuckoff",
        "filename": "61538.png"
    },
    "61539": {
        "code": 61539,
        "name": "yessss",
        "filename": "61539.png"
    },
    "61540": {
        "code": 61540,
        "name": "you_betcha",
        "filename": "61540.png"
    },
    "61541": {
        "code": 61541,
        "name": "you_gun",
        "filename": "61541.png"
    },
    "61542": {
        "code": 61542,
        "name": "you_totem",
        "filename": "61542.png"
    },
    "61543": {
        "code": 61543,
        "name": "yourcrownking",
        "filename": "61543.png"
    },
    "61544": {
        "code": 61544,
        "name": "yu",
        "filename": "61544.png"
    },
    "61545": {
        "code": 61545,
        "name": "yuumi",
        "filename": "61545.png"
    },
    "61546": {
        "code": 61546,
        "name": "zewo_to",
        "filename": "61546.png"
    },
    "61547": {
        "code": 61547,
        "name": "zzzzzzzzzzzzz",
        "filename": "61547.png"
    }
}
},{}],16:[function(require,module,exports){
module.exports={
    "13": {
        "code": 60941,
        "name": "13",
        "filename": "60941.png"
    },
    "1000": {
        "code": 60936,
        "name": "1000",
        "filename": "60936.png"
    },
    "506023": {
        "code": 60967,
        "name": "506023",
        "filename": "60967.png"
    },
    "1080p_pepe": {
        "code": 59648,
        "name": "1080p_pepe",
        "filename": "59648.png"
    },
    "blade_pepe": {
        "code": 59649,
        "name": "blade_pepe",
        "filename": "59649.png"
    },
    "bob_the_pepe_builder": {
        "code": 59650,
        "name": "bob_the_pepe_builder",
        "filename": "59650.png"
    },
    "peepofaku": {
        "code": 59651,
        "name": "peepofaku",
        "filename": "59651.png"
    },
    "peeposnack": {
        "code": 59652,
        "name": "peeposnack",
        "filename": "59652.png"
    },
    "pepebigbrain": {
        "code": 59653,
        "name": "pepebigbrain",
        "filename": "59653.png"
    },
    "pepeevil": {
        "code": 59654,
        "name": "pepeevil",
        "filename": "59654.png"
    },
    "pepefrance": {
        "code": 59655,
        "name": "pepefrance",
        "filename": "59655.png"
    },
    "pepehola": {
        "code": 59656,
        "name": "pepehola",
        "filename": "59656.png"
    },
    "pepeknight": {
        "code": 59657,
        "name": "pepeknight",
        "filename": "59657.png"
    },
    "pepelaugh": {
        "code": 61418,
        "name": "pepelaugh",
        "filename": "61418.png"
    },
    "pepethonk": {
        "code": 59659,
        "name": "pepethonk",
        "filename": "59659.png"
    },
    "pepeyikes": {
        "code": 59660,
        "name": "pepeyikes",
        "filename": "59660.png"
    },
    "pepe_toxic2008": {
        "code": 59661,
        "name": "pepe_toxic2008",
        "filename": "59661.png"
    },
    "pepega": {
        "code": 61072,
        "name": "pepega",
        "filename": "61072.png"
    },
    "plord": {
        "code": 59663,
        "name": "plord",
        "filename": "59663.png"
    },
    "police_pepe": {
        "code": 59664,
        "name": "police_pepe",
        "filename": "59664.png"
    },
    "purple_pepe": {
        "code": 59665,
        "name": "purple_pepe",
        "filename": "59665.png"
    },
    "soul_consumer_pepe": {
        "code": 59666,
        "name": "soul_consumer_pepe",
        "filename": "59666.png"
    },
    "themanbehindthepepe": {
        "code": 59667,
        "name": "themanbehindthepepe",
        "filename": "59667.png"
    },
    "ak_pepe": {
        "code": 59668,
        "name": "ak_pepe",
        "filename": "59668.png"
    },
    "alphinaud_pepe": {
        "code": 59669,
        "name": "alphinaud_pepe",
        "filename": "59669.png"
    },
    "amongus_thumbsup": {
        "code": 59670,
        "name": "amongus_thumbsup",
        "filename": "59670.png"
    },
    "anakinlove": {
        "code": 59671,
        "name": "anakinlove",
        "filename": "59671.png"
    },
    "angerydiamondsword": {
        "code": 59672,
        "name": "angerydiamondsword",
        "filename": "59672.png"
    },
    "angeryfuckoff": {
        "code": 59673,
        "name": "angeryfuckoff",
        "filename": "59673.png"
    },
    "angerykid": {
        "code": 59674,
        "name": "angerykid",
        "filename": "59674.png"
    },
    "angeryping": {
        "code": 59675,
        "name": "angeryping",
        "filename": "59675.png"
    },
    "angerypolice": {
        "code": 59676,
        "name": "angerypolice",
        "filename": "59676.png"
    },
    "angeryscimitar": {
        "code": 59677,
        "name": "angeryscimitar",
        "filename": "59677.png"
    },
    "angerysip": {
        "code": 59678,
        "name": "angerysip",
        "filename": "59678.png"
    },
    "angerytuxedo": {
        "code": 59679,
        "name": "angerytuxedo",
        "filename": "59679.png"
    },
    "angerywut": {
        "code": 59680,
        "name": "angerywut",
        "filename": "59680.png"
    },
    "angrypepeak47": {
        "code": 59681,
        "name": "angrypepeak47",
        "filename": "59681.png"
    },
    "anime": {
        "code": 59682,
        "name": "anime",
        "filename": "59682.png"
    },
    "anime_girl_pepe": {
        "code": 59683,
        "name": "anime_girl_pepe",
        "filename": "59683.png"
    },
    "arab": {
        "code": 59684,
        "name": "arab",
        "filename": "59684.png"
    },
    "astropepe": {
        "code": 59685,
        "name": "astropepe",
        "filename": "59685.png"
    },
    "b_a_n_h_a_m_m_e_r_p_e_p_e": {
        "code": 59686,
        "name": "b_a_n_h_a_m_m_e_r_p_e_p_e",
        "filename": "59686.png"
    },
    "baguette": {
        "code": 59687,
        "name": "baguette",
        "filename": "59687.png"
    },
    "baked": {
        "code": 59688,
        "name": "baked",
        "filename": "59688.png"
    },
    "ban": {
        "code": 59689,
        "name": "ban",
        "filename": "59689.png"
    },
    "bandpepe": {
        "code": 59690,
        "name": "bandpepe",
        "filename": "59690.png"
    },
    "banned": {
        "code": 59691,
        "name": "banned",
        "filename": "59691.png"
    },
    "bartdge": {
        "code": 59692,
        "name": "bartdge",
        "filename": "59692.png"
    },
    "basedcigar": {
        "code": 59693,
        "name": "basedcigar",
        "filename": "59693.png"
    },
    "batman": {
        "code": 59694,
        "name": "batman",
        "filename": "59694.png"
    },
    "bear_pink_cute": {
        "code": 59695,
        "name": "bear_pink_cute",
        "filename": "59695.png"
    },
    "bedge": {
        "code": 59696,
        "name": "bedge",
        "filename": "59696.png"
    },
    "bingus_amongus": {
        "code": 59697,
        "name": "bingus_amongus",
        "filename": "59697.png"
    },
    "birthday": {
        "code": 59698,
        "name": "birthday",
        "filename": "59698.png"
    },
    "black_pepe_clown": {
        "code": 59699,
        "name": "black_pepe_clown",
        "filename": "59699.png"
    },
    "blob_controller": {
        "code": 59700,
        "name": "blob_controller",
        "filename": "59700.png"
    },
    "blueflower": {
        "code": 59701,
        "name": "blueflower",
        "filename": "59701.png"
    },
    "boca_juniors_escudo": {
        "code": 59702,
        "name": "boca_juniors_escudo",
        "filename": "59702.png"
    },
    "boost_pls": {
        "code": 59703,
        "name": "boost_pls",
        "filename": "59703.png"
    },
    "boost_plz": {
        "code": 59704,
        "name": "boost_plz",
        "filename": "59704.png"
    },
    "bskek": {
        "code": 59705,
        "name": "bskek",
        "filename": "59705.png"
    },
    "bunnyletter_b": {
        "code": 59706,
        "name": "bunnyletter_b",
        "filename": "59706.png"
    },
    "bunnypeped": {
        "code": 59707,
        "name": "bunnypeped",
        "filename": "59707.png"
    },
    "cat_scratch": {
        "code": 59708,
        "name": "cat_scratch",
        "filename": "59708.png"
    },
    "catpepecry": {
        "code": 59709,
        "name": "catpepecry",
        "filename": "59709.png"
    },
    "chestopen": {
        "code": 59710,
        "name": "chestopen",
        "filename": "59710.png"
    },
    "christmas_pepe_riding_a_goose": {
        "code": 59711,
        "name": "christmas_pepe_riding_a_goose",
        "filename": "59711.png"
    },
    "christmaspepeno": {
        "code": 59712,
        "name": "christmaspepeno",
        "filename": "59712.png"
    },
    "chunguspepe_sad": {
        "code": 59713,
        "name": "chunguspepe_sad",
        "filename": "59713.png"
    },
    "chunkypepe": {
        "code": 59714,
        "name": "chunkypepe",
        "filename": "59714.png"
    },
    "clown_peepo": {
        "code": 59715,
        "name": "clown_peepo",
        "filename": "59715.png"
    },
    "clownge": {
        "code": 59716,
        "name": "clownge",
        "filename": "59716.png"
    },
    "clowngewave": {
        "code": 59717,
        "name": "clowngewave",
        "filename": "59717.png"
    },
    "cocka": {
        "code": 59718,
        "name": "cocka",
        "filename": "59718.png"
    },
    "coffeepepe": {
        "code": 59719,
        "name": "coffeepepe",
        "filename": "59719.png"
    },
    "comfy_panda_pepe": {
        "code": 59720,
        "name": "comfy_panda_pepe",
        "filename": "59720.png"
    },
    "comfy_pepe_cat": {
        "code": 59721,
        "name": "comfy_pepe_cat",
        "filename": "59721.png"
    },
    "comfypepe": {
        "code": 59722,
        "name": "comfypepe",
        "filename": "59722.png"
    },
    "comfypepered": {
        "code": 59723,
        "name": "comfypepered",
        "filename": "59723.png"
    },
    "conco_pepe_chad": {
        "code": 59724,
        "name": "conco_pepe_chad",
        "filename": "59724.png"
    },
    "cool_pepe": {
        "code": 59725,
        "name": "cool_pepe",
        "filename": "59725.png"
    },
    "coolpepe": {
        "code": 59726,
        "name": "coolpepe",
        "filename": "59726.png"
    },
    "copege": {
        "code": 59727,
        "name": "copege",
        "filename": "59727.png"
    },
    "copium": {
        "code": 59728,
        "name": "copium",
        "filename": "59728.png"
    },
    "cozyblush": {
        "code": 59729,
        "name": "cozyblush",
        "filename": "59729.png"
    },
    "cozypepebubzface": {
        "code": 59730,
        "name": "cozypepebubzface",
        "filename": "59730.png"
    },
    "crazy": {
        "code": 59731,
        "name": "crazy",
        "filename": "59731.png"
    },
    "cursed_pepe": {
        "code": 59732,
        "name": "cursed_pepe",
        "filename": "59732.png"
    },
    "cutepepe": {
        "code": 59733,
        "name": "cutepepe",
        "filename": "59733.png"
    },
    "cutepepeomg": {
        "code": 59734,
        "name": "cutepepeomg",
        "filename": "59734.png"
    },
    "dankegirl": {
        "code": 59735,
        "name": "dankegirl",
        "filename": "59735.png"
    },
    "dankest_pepe": {
        "code": 59736,
        "name": "dankest_pepe",
        "filename": "59736.png"
    },
    "dankies_pepe": {
        "code": 59737,
        "name": "dankies_pepe",
        "filename": "59737.png"
    },
    "darthpepe": {
        "code": 59738,
        "name": "darthpepe",
        "filename": "59738.png"
    },
    "died": {
        "code": 59739,
        "name": "died",
        "filename": "59739.png"
    },
    "dittopeped": {
        "code": 59740,
        "name": "dittopeped",
        "filename": "59740.png"
    },
    "djpeepo": {
        "code": 59741,
        "name": "djpeepo",
        "filename": "59741.png"
    },
    "donald_trump_pepe": {
        "code": 59742,
        "name": "donald_trump_pepe",
        "filename": "59742.png"
    },
    "donetsk": {
        "code": 59743,
        "name": "donetsk",
        "filename": "59743.png"
    },
    "donkpls": {
        "code": 59744,
        "name": "donkpls",
        "filename": "59744.png"
    },
    "doorpepebubzface": {
        "code": 59745,
        "name": "doorpepebubzface",
        "filename": "59745.png"
    },
    "drugs": {
        "code": 59746,
        "name": "drugs",
        "filename": "59746.png"
    },
    "elegant_human_pepe": {
        "code": 59747,
        "name": "elegant_human_pepe",
        "filename": "59747.png"
    },
    "empty_pepe": {
        "code": 59748,
        "name": "empty_pepe",
        "filename": "59748.png"
    },
    "epicownersignpepe": {
        "code": 59749,
        "name": "epicownersignpepe",
        "filename": "59749.png"
    },
    "evil_pepe": {
        "code": 59750,
        "name": "evil_pepe",
        "filename": "59750.png"
    },
    "exhaustedpepe": {
        "code": 59751,
        "name": "exhaustedpepe",
        "filename": "59751.png"
    },
    "fatfuck": {
        "code": 59752,
        "name": "fatfuck",
        "filename": "59752.png"
    },
    "fatpepe": {
        "code": 59753,
        "name": "fatpepe",
        "filename": "59753.png"
    },
    "feelsbadmane": {
        "code": 59754,
        "name": "feelsbadmane",
        "filename": "59754.png"
    },
    "feelsbirthdayman": {
        "code": 59755,
        "name": "feelsbirthdayman",
        "filename": "59755.png"
    },
    "feelsbussinfam": {
        "code": 59756,
        "name": "feelsbussinfam",
        "filename": "59756.png"
    },
    "feelsgoodman": {
        "code": 59757,
        "name": "feelsgoodman",
        "filename": "59757.png"
    },
    "feelsokman": {
        "code": 59758,
        "name": "feelsokman",
        "filename": "59758.png"
    },
    "feelsweakman": {
        "code": 59759,
        "name": "feelsweakman",
        "filename": "59759.png"
    },
    "floppawicked": {
        "code": 59760,
        "name": "floppawicked",
        "filename": "59760.png"
    },
    "flushed_pepe": {
        "code": 59761,
        "name": "flushed_pepe",
        "filename": "59761.png"
    },
    "flushedge": {
        "code": 59762,
        "name": "flushedge",
        "filename": "59762.png"
    },
    "frog_stare": {
        "code": 59763,
        "name": "frog_stare",
        "filename": "59763.png"
    },
    "froglaugh": {
        "code": 59764,
        "name": "froglaugh",
        "filename": "59764.png"
    },
    "frograisedeyes": {
        "code": 59765,
        "name": "frograisedeyes",
        "filename": "59765.png"
    },
    "frogsalut": {
        "code": 59766,
        "name": "frogsalut",
        "filename": "59766.png"
    },
    "fuck_off": {
        "code": 59767,
        "name": "fuck_off",
        "filename": "59767.png"
    },
    "fumardge": {
        "code": 59768,
        "name": "fumardge",
        "filename": "59768.png"
    },
    "funny_cat_smashed_face_girl": {
        "code": 59769,
        "name": "funny_cat_smashed_face_girl",
        "filename": "59769.png"
    },
    "funny_cat_smashed_face_hawtf": {
        "code": 59770,
        "name": "funny_cat_smashed_face_hawtf",
        "filename": "59770.png"
    },
    "galaxypepe_cry": {
        "code": 59771,
        "name": "galaxypepe_cry",
        "filename": "59771.png"
    },
    "galaxypepe_middlefinger": {
        "code": 59772,
        "name": "galaxypepe_middlefinger",
        "filename": "59772.png"
    },
    "garman_pepe": {
        "code": 59773,
        "name": "garman_pepe",
        "filename": "59773.png"
    },
    "gay_parrot": {
        "code": 59774,
        "name": "gay_parrot",
        "filename": "59774.png"
    },
    "gentlemanpepe": {
        "code": 59775,
        "name": "gentlemanpepe",
        "filename": "59775.png"
    },
    "givemeadminpeeposign": {
        "code": 59776,
        "name": "givemeadminpeeposign",
        "filename": "59776.png"
    },
    "gloomypepe": {
        "code": 59777,
        "name": "gloomypepe",
        "filename": "59777.png"
    },
    "gold_pepe": {
        "code": 59778,
        "name": "gold_pepe",
        "filename": "59778.png"
    },
    "googlechromepepe": {
        "code": 59779,
        "name": "googlechromepepe",
        "filename": "59779.png"
    },
    "gunscared": {
        "code": 59780,
        "name": "gunscared",
        "filename": "59780.png"
    },
    "h_e_l_p": {
        "code": 59781,
        "name": "h_e_l_p",
        "filename": "59781.png"
    },
    "hackerpepe": {
        "code": 59782,
        "name": "hackerpepe",
        "filename": "59782.png"
    },
    "happy_pepe": {
        "code": 59783,
        "name": "happy_pepe",
        "filename": "59783.png"
    },
    "happy_pepe_like_a_child": {
        "code": 59784,
        "name": "happy_pepe_like_a_child",
        "filename": "59784.png"
    },
    "haramgun": {
        "code": 59785,
        "name": "haramgun",
        "filename": "59785.png"
    },
    "harrowpcross": {
        "code": 59786,
        "name": "harrowpcross",
        "filename": "59786.png"
    },
    "heartu": {
        "code": 59787,
        "name": "heartu",
        "filename": "59787.png"
    },
    "hecker_pepe": {
        "code": 59788,
        "name": "hecker_pepe",
        "filename": "59788.png"
    },
    "help": {
        "code": 59789,
        "name": "help",
        "filename": "59789.png"
    },
    "hmm": {
        "code": 59790,
        "name": "hmm",
        "filename": "59790.png"
    },
    "hmm1": {
        "code": 59791,
        "name": "hmm1",
        "filename": "59791.png"
    },
    "hmmge": {
        "code": 59792,
        "name": "hmmge",
        "filename": "59792.png"
    },
    "hmmrun": {
        "code": 59793,
        "name": "hmmrun",
        "filename": "59793.png"
    },
    "hollowpeped": {
        "code": 59794,
        "name": "hollowpeped",
        "filename": "59794.png"
    },
    "homdge": {
        "code": 59795,
        "name": "homdge",
        "filename": "59795.png"
    },
    "homerpepe": {
        "code": 59796,
        "name": "homerpepe",
        "filename": "59796.png"
    },
    "hugers": {
        "code": 59797,
        "name": "hugers",
        "filename": "59797.png"
    },
    "hyperslpink": {
        "code": 59798,
        "name": "hyperslpink",
        "filename": "59798.png"
    },
    "inspect": {
        "code": 59799,
        "name": "inspect",
        "filename": "59799.png"
    },
    "invert_happy_pepe": {
        "code": 59800,
        "name": "invert_happy_pepe",
        "filename": "59800.png"
    },
    "jacked_pepe": {
        "code": 59801,
        "name": "jacked_pepe",
        "filename": "59801.png"
    },
    "jailpepe": {
        "code": 59802,
        "name": "jailpepe",
        "filename": "59802.png"
    },
    "jammies": {
        "code": 59803,
        "name": "jammies",
        "filename": "59803.png"
    },
    "jiggle": {
        "code": 59804,
        "name": "jiggle",
        "filename": "59804.png"
    },
    "kekamid": {
        "code": 59805,
        "name": "kekamid",
        "filename": "59805.png"
    },
    "kekega": {
        "code": 59806,
        "name": "kekega",
        "filename": "59806.png"
    },
    "kekexplode": {
        "code": 59807,
        "name": "kekexplode",
        "filename": "59807.png"
    },
    "kekwpain": {
        "code": 59808,
        "name": "kekwpain",
        "filename": "59808.png"
    },
    "killerkoalas": {
        "code": 59809,
        "name": "killerkoalas",
        "filename": "59809.png"
    },
    "lightblue_heartspin": {
        "code": 59810,
        "name": "lightblue_heartspin",
        "filename": "59810.png"
    },
    "lisamadge": {
        "code": 59811,
        "name": "lisamadge",
        "filename": "59811.png"
    },
    "loliguess": {
        "code": 59812,
        "name": "loliguess",
        "filename": "59812.png"
    },
    "lurkingpepe": {
        "code": 59813,
        "name": "lurkingpepe",
        "filename": "59813.png"
    },
    "madge": {
        "code": 59814,
        "name": "madge",
        "filename": "59814.png"
    },
    "maracaspeped": {
        "code": 59815,
        "name": "maracaspeped",
        "filename": "59815.png"
    },
    "maradona_angry": {
        "code": 59816,
        "name": "maradona_angry",
        "filename": "59816.png"
    },
    "mardgye": {
        "code": 59817,
        "name": "mardgye",
        "filename": "59817.png"
    },
    "me": {
        "code": 59818,
        "name": "me",
        "filename": "59818.png"
    },
    "monaks": {
        "code": 59819,
        "name": "monaks",
        "filename": "59819.png"
    },
    "monkasweat": {
        "code": 59820,
        "name": "monkasweat",
        "filename": "59820.png"
    },
    "monkathink": {
        "code": 59821,
        "name": "monkathink",
        "filename": "59821.png"
    },
    "neko_pepe": {
        "code": 59822,
        "name": "neko_pepe",
        "filename": "59822.png"
    },
    "nerdge": {
        "code": 59823,
        "name": "nerdge",
        "filename": "59823.png"
    },
    "nezupepe": {
        "code": 59824,
        "name": "nezupepe",
        "filename": "59824.png"
    },
    "nitro_classic": {
        "code": 59825,
        "name": "nitro_classic",
        "filename": "59825.png"
    },
    "no_maidens": {
        "code": 59826,
        "name": "no_maidens",
        "filename": "59826.png"
    },
    "no_u_pepe_sign": {
        "code": 59827,
        "name": "no_u_pepe_sign",
        "filename": "59827.png"
    },
    "nobody_cares_pepe": {
        "code": 59828,
        "name": "nobody_cares_pepe",
        "filename": "59828.png"
    },
    "noppers": {
        "code": 59829,
        "name": "noppers",
        "filename": "59829.png"
    },
    "ok_boomer": {
        "code": 59830,
        "name": "ok_boomer",
        "filename": "59830.png"
    },
    "okayeg": {
        "code": 59831,
        "name": "okayeg",
        "filename": "59831.png"
    },
    "okayge": {
        "code": 59832,
        "name": "okayge",
        "filename": "59832.png"
    },
    "okayman": {
        "code": 59833,
        "name": "okayman",
        "filename": "59833.png"
    },
    "omegaluliguess": {
        "code": 59834,
        "name": "omegaluliguess",
        "filename": "59834.png"
    },
    "paimonshootpepe": {
        "code": 59835,
        "name": "paimonshootpepe",
        "filename": "59835.png"
    },
    "palpzap": {
        "code": 59836,
        "name": "palpzap",
        "filename": "59836.png"
    },
    "pancakepepe": {
        "code": 59837,
        "name": "pancakepepe",
        "filename": "59837.png"
    },
    "pangel": {
        "code": 59838,
        "name": "pangel",
        "filename": "59838.png"
    },
    "pangry": {
        "code": 59839,
        "name": "pangry",
        "filename": "59839.png"
    },
    "peepo4kleave": {
        "code": 59840,
        "name": "peepo4kleave",
        "filename": "59840.png"
    },
    "peepocoffeehiss": {
        "code": 59841,
        "name": "peepocoffeehiss",
        "filename": "59841.png"
    },
    "peepocroche": {
        "code": 59842,
        "name": "peepocroche",
        "filename": "59842.png"
    },
    "peepoteddydreaming": {
        "code": 59843,
        "name": "peepoteddydreaming",
        "filename": "59843.png"
    },
    "peepo_ban": {
        "code": 59844,
        "name": "peepo_ban",
        "filename": "59844.png"
    },
    "peepo_creepy": {
        "code": 59845,
        "name": "peepo_creepy",
        "filename": "59845.png"
    },
    "peepo_cry_swim": {
        "code": 59846,
        "name": "peepo_cry_swim",
        "filename": "59846.png"
    },
    "peepo_happy": {
        "code": 59847,
        "name": "peepo_happy",
        "filename": "59847.png"
    },
    "peepo_hi": {
        "code": 59848,
        "name": "peepo_hi",
        "filename": "59848.png"
    },
    "peepo_mute": {
        "code": 59849,
        "name": "peepo_mute",
        "filename": "59849.png"
    },
    "peepo_no": {
        "code": 59850,
        "name": "peepo_no",
        "filename": "59850.png"
    },
    "peepo_ok_admins": {
        "code": 59851,
        "name": "peepo_ok_admins",
        "filename": "59851.png"
    },
    "peepo_pixel_art": {
        "code": 59852,
        "name": "peepo_pixel_art",
        "filename": "59852.png"
    },
    "peepo_pumpkin_dance": {
        "code": 59853,
        "name": "peepo_pumpkin_dance",
        "filename": "59853.png"
    },
    "peepo_run": {
        "code": 59854,
        "name": "peepo_run",
        "filename": "59854.png"
    },
    "peepo_toxic": {
        "code": 59855,
        "name": "peepo_toxic",
        "filename": "59855.png"
    },
    "peepo_yes": {
        "code": 59856,
        "name": "peepo_yes",
        "filename": "59856.png"
    },
    "peepoangel": {
        "code": 59857,
        "name": "peepoangel",
        "filename": "59857.png"
    },
    "peepoangerydownvote": {
        "code": 59858,
        "name": "peepoangerydownvote",
        "filename": "59858.png"
    },
    "peepoanimecaught": {
        "code": 59859,
        "name": "peepoanimecaught",
        "filename": "59859.png"
    },
    "peepoarrive": {
        "code": 59860,
        "name": "peepoarrive",
        "filename": "59860.png"
    },
    "peepoaxe": {
        "code": 59861,
        "name": "peepoaxe",
        "filename": "59861.png"
    },
    "peepobackflip": {
        "code": 59862,
        "name": "peepobackflip",
        "filename": "59862.png"
    },
    "peepoballa": {
        "code": 59863,
        "name": "peepoballa",
        "filename": "59863.png"
    },
    "peepoban": {
        "code": 59864,
        "name": "peepoban",
        "filename": "59864.png"
    },
    "peepobanana": {
        "code": 59865,
        "name": "peepobanana",
        "filename": "59865.png"
    },
    "peepobeanbag": {
        "code": 59866,
        "name": "peepobeanbag",
        "filename": "59866.png"
    },
    "peepoberry": {
        "code": 59867,
        "name": "peepoberry",
        "filename": "59867.png"
    },
    "peepoblankethd": {
        "code": 59868,
        "name": "peepoblankethd",
        "filename": "59868.png"
    },
    "peepoblanketshare": {
        "code": 59869,
        "name": "peepoblanketshare",
        "filename": "59869.png"
    },
    "peepoblink": {
        "code": 59870,
        "name": "peepoblink",
        "filename": "59870.png"
    },
    "peepobonk": {
        "code": 59871,
        "name": "peepobonk",
        "filename": "59871.png"
    },
    "peepobusinesstux": {
        "code": 59872,
        "name": "peepobusinesstux",
        "filename": "59872.png"
    },
    "peepocandy": {
        "code": 59873,
        "name": "peepocandy",
        "filename": "59873.png"
    },
    "peepochomky": {
        "code": 59874,
        "name": "peepochomky",
        "filename": "59874.png"
    },
    "peepocomfy": {
        "code": 59875,
        "name": "peepocomfy",
        "filename": "59875.png"
    },
    "peepoconfetti": {
        "code": 59876,
        "name": "peepoconfetti",
        "filename": "59876.png"
    },
    "peepocry": {
        "code": 59877,
        "name": "peepocry",
        "filename": "59877.png"
    },
    "peepocryingban": {
        "code": 59878,
        "name": "peepocryingban",
        "filename": "59878.png"
    },
    "peepocute": {
        "code": 59879,
        "name": "peepocute",
        "filename": "59879.png"
    },
    "peepodababy": {
        "code": 59880,
        "name": "peepodababy",
        "filename": "59880.png"
    },
    "peepodancingduck": {
        "code": 59881,
        "name": "peepodancingduck",
        "filename": "59881.png"
    },
    "peepodetective": {
        "code": 59882,
        "name": "peepodetective",
        "filename": "59882.png"
    },
    "peepodino": {
        "code": 59883,
        "name": "peepodino",
        "filename": "59883.png"
    },
    "peepoenlighten": {
        "code": 59884,
        "name": "peepoenlighten",
        "filename": "59884.png"
    },
    "peepoenter": {
        "code": 59885,
        "name": "peepoenter",
        "filename": "59885.png"
    },
    "peepoevil": {
        "code": 59886,
        "name": "peepoevil",
        "filename": "59886.png"
    },
    "peepofetish": {
        "code": 59887,
        "name": "peepofetish",
        "filename": "59887.png"
    },
    "peepoflame": {
        "code": 59888,
        "name": "peepoflame",
        "filename": "59888.png"
    },
    "peepofloshed": {
        "code": 59889,
        "name": "peepofloshed",
        "filename": "59889.png"
    },
    "peepogun": {
        "code": 59890,
        "name": "peepogun",
        "filename": "59890.png"
    },
    "peepohands": {
        "code": 59891,
        "name": "peepohands",
        "filename": "59891.png"
    },
    "peepohandsup": {
        "code": 59892,
        "name": "peepohandsup",
        "filename": "59892.png"
    },
    "peepohappy": {
        "code": 59893,
        "name": "peepohappy",
        "filename": "59893.png"
    },
    "peepohappygun": {
        "code": 59894,
        "name": "peepohappygun",
        "filename": "59894.png"
    },
    "peepoheart": {
        "code": 59895,
        "name": "peepoheart",
        "filename": "59895.png"
    },
    "peepohey": {
        "code": 59896,
        "name": "peepohey",
        "filename": "59896.png"
    },
    "peepohurensohn": {
        "code": 59897,
        "name": "peepohurensohn",
        "filename": "59897.png"
    },
    "peepohypers": {
        "code": 61410,
        "name": "peepohypers",
        "filename": "61410.png"
    },
    "peepoinstitutions": {
        "code": 59899,
        "name": "peepoinstitutions",
        "filename": "59899.png"
    },
    "peepoinvestigate": {
        "code": 59900,
        "name": "peepoinvestigate",
        "filename": "59900.png"
    },
    "peepojam": {
        "code": 59901,
        "name": "peepojam",
        "filename": "59901.png"
    },
    "peepolove": {
        "code": 59902,
        "name": "peepolove",
        "filename": "59902.png"
    },
    "peepomenacing": {
        "code": 59903,
        "name": "peepomenacing",
        "filename": "59903.png"
    },
    "peepominecraft": {
        "code": 59904,
        "name": "peepominecraft",
        "filename": "59904.png"
    },
    "peepomoney": {
        "code": 59905,
        "name": "peepomoney",
        "filename": "59905.png"
    },
    "peeponewyear": {
        "code": 59906,
        "name": "peeponewyear",
        "filename": "59906.png"
    },
    "peeponoob": {
        "code": 59907,
        "name": "peeponoob",
        "filename": "59907.png"
    },
    "peeponotstonks": {
        "code": 59908,
        "name": "peeponotstonks",
        "filename": "59908.png"
    },
    "peepookayzoomer": {
        "code": 59909,
        "name": "peepookayzoomer",
        "filename": "59909.png"
    },
    "peepoonly2genders": {
        "code": 59910,
        "name": "peepoonly2genders",
        "filename": "59910.png"
    },
    "peepopillow": {
        "code": 59911,
        "name": "peepopillow",
        "filename": "59911.png"
    },
    "peeporich": {
        "code": 59912,
        "name": "peeporich",
        "filename": "59912.png"
    },
    "peeporiot": {
        "code": 59913,
        "name": "peeporiot",
        "filename": "59913.png"
    },
    "peeporomania": {
        "code": 59914,
        "name": "peeporomania",
        "filename": "59914.png"
    },
    "peeporose": {
        "code": 59915,
        "name": "peeporose",
        "filename": "59915.png"
    },
    "peeporules": {
        "code": 59916,
        "name": "peeporules",
        "filename": "59916.png"
    },
    "peeporunsanta": {
        "code": 59917,
        "name": "peeporunsanta",
        "filename": "59917.png"
    },
    "peeposad": {
        "code": 59918,
        "name": "peeposad",
        "filename": "59918.png"
    },
    "peeposadblanket": {
        "code": 59919,
        "name": "peeposadblanket",
        "filename": "59919.png"
    },
    "peeposanta": {
        "code": 59920,
        "name": "peeposanta",
        "filename": "59920.png"
    },
    "peeposcam": {
        "code": 59921,
        "name": "peeposcam",
        "filename": "59921.png"
    },
    "peeposhy": {
        "code": 59922,
        "name": "peeposhy",
        "filename": "59922.png"
    },
    "peeposignboobs": {
        "code": 59923,
        "name": "peeposignboobs",
        "filename": "59923.png"
    },
    "peeposimp": {
        "code": 59924,
        "name": "peeposimp",
        "filename": "59924.png"
    },
    "peeposleep": {
        "code": 61413,
        "name": "peeposleep",
        "filename": "61413.png"
    },
    "peepostonks": {
        "code": 59926,
        "name": "peepostonks",
        "filename": "59926.png"
    },
    "peeposuspiciouswithbeard": {
        "code": 59927,
        "name": "peeposuspiciouswithbeard",
        "filename": "59927.png"
    },
    "peeposusshoot": {
        "code": 59928,
        "name": "peeposusshoot",
        "filename": "59928.png"
    },
    "peepotalk": {
        "code": 59929,
        "name": "peepotalk",
        "filename": "59929.png"
    },
    "peepoteddycrying": {
        "code": 59930,
        "name": "peepoteddycrying",
        "filename": "59930.png"
    },
    "peepotired": {
        "code": 59931,
        "name": "peepotired",
        "filename": "59931.png"
    },
    "peepotoilet": {
        "code": 59932,
        "name": "peepotoilet",
        "filename": "59932.png"
    },
    "peepoukraine": {
        "code": 59933,
        "name": "peepoukraine",
        "filename": "59933.png"
    },
    "peepouno": {
        "code": 59934,
        "name": "peepouno",
        "filename": "59934.png"
    },
    "peepoupvote": {
        "code": 59935,
        "name": "peepoupvote",
        "filename": "59935.png"
    },
    "peepoveryhappy": {
        "code": 59936,
        "name": "peepoveryhappy",
        "filename": "59936.png"
    },
    "peepowait": {
        "code": 59937,
        "name": "peepowait",
        "filename": "59937.png"
    },
    "peepowave": {
        "code": 59938,
        "name": "peepowave",
        "filename": "59938.png"
    },
    "peepoweary": {
        "code": 59939,
        "name": "peepoweary",
        "filename": "59939.png"
    },
    "peepoweirdlooking": {
        "code": 59940,
        "name": "peepoweirdlooking",
        "filename": "59940.png"
    },
    "peepowhyareyoudum": {
        "code": 59941,
        "name": "peepowhyareyoudum",
        "filename": "59941.png"
    },
    "peepowicked": {
        "code": 59942,
        "name": "peepowicked",
        "filename": "59942.png"
    },
    "peepowow": {
        "code": 59943,
        "name": "peepowow",
        "filename": "59943.png"
    },
    "peepoyeet": {
        "code": 59944,
        "name": "peepoyeet",
        "filename": "59944.png"
    },
    "peepoyes": {
        "code": 59945,
        "name": "peepoyes",
        "filename": "59945.png"
    },
    "peepoyessir": {
        "code": 59946,
        "name": "peepoyessir",
        "filename": "59946.png"
    },
    "peepoyum": {
        "code": 59947,
        "name": "peepoyum",
        "filename": "59947.png"
    },
    "pep_army": {
        "code": 59948,
        "name": "pep_army",
        "filename": "59948.png"
    },
    "pep_high_five_1": {
        "code": 59949,
        "name": "pep_high_five_1",
        "filename": "59949.png"
    },
    "pep_stab": {
        "code": 59950,
        "name": "pep_stab",
        "filename": "59950.png"
    },
    "pepe": {
        "code": 59951,
        "name": "pepe",
        "filename": "59951.png"
    },
    "pepe4k": {
        "code": 61417,
        "name": "pepe4k",
        "filename": "61417.png"
    },
    "peped": {
        "code": 59953,
        "name": "peped",
        "filename": "59953.png"
    },
    "pepe_1": {
        "code": 59954,
        "name": "pepe_1",
        "filename": "59954.png"
    },
    "pepe_10": {
        "code": 59955,
        "name": "pepe_10",
        "filename": "59955.png"
    },
    "pepe_11": {
        "code": 59956,
        "name": "pepe_11",
        "filename": "59956.png"
    },
    "pepe_12": {
        "code": 59957,
        "name": "pepe_12",
        "filename": "59957.png"
    },
    "pepe_13": {
        "code": 59958,
        "name": "pepe_13",
        "filename": "59958.png"
    },
    "pepe_14": {
        "code": 59959,
        "name": "pepe_14",
        "filename": "59959.png"
    },
    "pepe_15": {
        "code": 59960,
        "name": "pepe_15",
        "filename": "59960.png"
    },
    "pepe_16": {
        "code": 59961,
        "name": "pepe_16",
        "filename": "59961.png"
    },
    "pepe_17": {
        "code": 59962,
        "name": "pepe_17",
        "filename": "59962.png"
    },
    "pepe_18": {
        "code": 59963,
        "name": "pepe_18",
        "filename": "59963.png"
    },
    "pepe_19": {
        "code": 59964,
        "name": "pepe_19",
        "filename": "59964.png"
    },
    "pepe_2": {
        "code": 59965,
        "name": "pepe_2",
        "filename": "59965.png"
    },
    "pepe_20": {
        "code": 59966,
        "name": "pepe_20",
        "filename": "59966.png"
    },
    "pepe_21": {
        "code": 59967,
        "name": "pepe_21",
        "filename": "59967.png"
    },
    "pepe_22": {
        "code": 59968,
        "name": "pepe_22",
        "filename": "59968.png"
    },
    "pepe_23": {
        "code": 59969,
        "name": "pepe_23",
        "filename": "59969.png"
    },
    "pepe_24": {
        "code": 59970,
        "name": "pepe_24",
        "filename": "59970.png"
    },
    "pepe_25": {
        "code": 59971,
        "name": "pepe_25",
        "filename": "59971.png"
    },
    "pepe_3": {
        "code": 59972,
        "name": "pepe_3",
        "filename": "59972.png"
    },
    "pepe_3dsmirk": {
        "code": 59973,
        "name": "pepe_3dsmirk",
        "filename": "59973.png"
    },
    "pepe_3dspin": {
        "code": 59974,
        "name": "pepe_3dspin",
        "filename": "59974.png"
    },
    "pepe_4": {
        "code": 59975,
        "name": "pepe_4",
        "filename": "59975.png"
    },
    "pepe_4k": {
        "code": 59976,
        "name": "pepe_4k",
        "filename": "59976.png"
    },
    "pepe_5": {
        "code": 59977,
        "name": "pepe_5",
        "filename": "59977.png"
    },
    "pepe_6": {
        "code": 59978,
        "name": "pepe_6",
        "filename": "59978.png"
    },
    "pepe_60": {
        "code": 59979,
        "name": "pepe_60",
        "filename": "59979.png"
    },
    "pepe_7": {
        "code": 59980,
        "name": "pepe_7",
        "filename": "59980.png"
    },
    "pepe_8": {
        "code": 59981,
        "name": "pepe_8",
        "filename": "59981.png"
    },
    "pepe_9": {
        "code": 59982,
        "name": "pepe_9",
        "filename": "59982.png"
    },
    "pepe_adolf": {
        "code": 59983,
        "name": "pepe_adolf",
        "filename": "59983.png"
    },
    "pepe_agiota": {
        "code": 59984,
        "name": "pepe_agiota",
        "filename": "59984.png"
    },
    "pepe_ahaa": {
        "code": 59985,
        "name": "pepe_ahaa",
        "filename": "59985.png"
    },
    "pepe_ahegao": {
        "code": 59986,
        "name": "pepe_ahegao",
        "filename": "59986.png"
    },
    "pepe_angel": {
        "code": 59987,
        "name": "pepe_angel",
        "filename": "59987.png"
    },
    "pepe_angry": {
        "code": 59988,
        "name": "pepe_angry",
        "filename": "59988.png"
    },
    "pepe_angry_communist": {
        "code": 59989,
        "name": "pepe_angry_communist",
        "filename": "59989.png"
    },
    "pepe_angry_kid": {
        "code": 59990,
        "name": "pepe_angry_kid",
        "filename": "59990.png"
    },
    "pepe_angry_ping": {
        "code": 59991,
        "name": "pepe_angry_ping",
        "filename": "59991.png"
    },
    "pepe_angry_police": {
        "code": 59992,
        "name": "pepe_angry_police",
        "filename": "59992.png"
    },
    "pepe_angry_scimitar": {
        "code": 59993,
        "name": "pepe_angry_scimitar",
        "filename": "59993.png"
    },
    "pepe_anime": {
        "code": 59994,
        "name": "pepe_anime",
        "filename": "59994.png"
    },
    "pepe_annoyed": {
        "code": 59995,
        "name": "pepe_annoyed",
        "filename": "59995.png"
    },
    "pepe_argento": {
        "code": 59996,
        "name": "pepe_argento",
        "filename": "59996.png"
    },
    "pepe_aussie": {
        "code": 59997,
        "name": "pepe_aussie",
        "filename": "59997.png"
    },
    "pepe_awkward": {
        "code": 59998,
        "name": "pepe_awkward",
        "filename": "59998.png"
    },
    "pepe_back_off": {
        "code": 59999,
        "name": "pepe_back_off",
        "filename": "59999.png"
    },
    "pepe_baguette": {
        "code": 60000,
        "name": "pepe_baguette",
        "filename": "60000.png"
    },
    "pepe_baguetteberet": {
        "code": 60001,
        "name": "pepe_baguetteberet",
        "filename": "60001.png"
    },
    "pepe_ban": {
        "code": 60002,
        "name": "pepe_ban",
        "filename": "60002.png"
    },
    "pepe_band": {
        "code": 60003,
        "name": "pepe_band",
        "filename": "60003.png"
    },
    "pepe_banned": {
        "code": 60004,
        "name": "pepe_banned",
        "filename": "60004.png"
    },
    "pepe_batman": {
        "code": 60005,
        "name": "pepe_batman",
        "filename": "60005.png"
    },
    "pepe_big_brain": {
        "code": 60006,
        "name": "pepe_big_brain",
        "filename": "60006.png"
    },
    "pepe_big_eyes": {
        "code": 60007,
        "name": "pepe_big_eyes",
        "filename": "60007.png"
    },
    "pepe_blackmetal": {
        "code": 60008,
        "name": "pepe_blackmetal",
        "filename": "60008.png"
    },
    "pepe_blanket": {
        "code": 60009,
        "name": "pepe_blanket",
        "filename": "60009.png"
    },
    "pepe_bloodshot": {
        "code": 60010,
        "name": "pepe_bloodshot",
        "filename": "60010.png"
    },
    "pepe_bonk": {
        "code": 60011,
        "name": "pepe_bonk",
        "filename": "60011.png"
    },
    "pepe_boost": {
        "code": 60012,
        "name": "pepe_boost",
        "filename": "60012.png"
    },
    "pepe_bored_toy": {
        "code": 60013,
        "name": "pepe_bored_toy",
        "filename": "60013.png"
    },
    "pepe_box": {
        "code": 60014,
        "name": "pepe_box",
        "filename": "60014.png"
    },
    "pepe_boxer": {
        "code": 60015,
        "name": "pepe_boxer",
        "filename": "60015.png"
    },
    "pepe_bruh": {
        "code": 60016,
        "name": "pepe_bruh",
        "filename": "60016.png"
    },
    "pepe_business": {
        "code": 60017,
        "name": "pepe_business",
        "filename": "60017.png"
    },
    "pepe_call": {
        "code": 60018,
        "name": "pepe_call",
        "filename": "60018.png"
    },
    "pepe_car": {
        "code": 60019,
        "name": "pepe_car",
        "filename": "60019.png"
    },
    "pepe_cardgreen": {
        "code": 60020,
        "name": "pepe_cardgreen",
        "filename": "60020.png"
    },
    "pepe_cardred": {
        "code": 60021,
        "name": "pepe_cardred",
        "filename": "60021.png"
    },
    "pepe_cardyellow": {
        "code": 60022,
        "name": "pepe_cardyellow",
        "filename": "60022.png"
    },
    "pepe_cat_cry": {
        "code": 60023,
        "name": "pepe_cat_cry",
        "filename": "60023.png"
    },
    "pepe_cat_cry_2": {
        "code": 60024,
        "name": "pepe_cat_cry_2",
        "filename": "60024.png"
    },
    "pepe_cat_roll": {
        "code": 60025,
        "name": "pepe_cat_roll",
        "filename": "60025.png"
    },
    "pepe_caughtin4k": {
        "code": 60026,
        "name": "pepe_caughtin4k",
        "filename": "60026.png"
    },
    "pepe_celebrate_confetti": {
        "code": 60027,
        "name": "pepe_celebrate_confetti",
        "filename": "60027.png"
    },
    "pepe_cheer": {
        "code": 60028,
        "name": "pepe_cheer",
        "filename": "60028.png"
    },
    "pepe_chips": {
        "code": 60029,
        "name": "pepe_chips",
        "filename": "60029.png"
    },
    "pepe_chrome": {
        "code": 60030,
        "name": "pepe_chrome",
        "filename": "60030.png"
    },
    "pepe_chubby": {
        "code": 60031,
        "name": "pepe_chubby",
        "filename": "60031.png"
    },
    "pepe_cia": {
        "code": 60032,
        "name": "pepe_cia",
        "filename": "60032.png"
    },
    "pepe_cigarette": {
        "code": 60033,
        "name": "pepe_cigarette",
        "filename": "60033.png"
    },
    "pepe_cigarettesmoke": {
        "code": 60034,
        "name": "pepe_cigarettesmoke",
        "filename": "60034.png"
    },
    "pepe_clap": {
        "code": 60035,
        "name": "pepe_clap",
        "filename": "60035.png"
    },
    "pepe_cookie": {
        "code": 60036,
        "name": "pepe_cookie",
        "filename": "60036.png"
    },
    "pepe_cool": {
        "code": 60037,
        "name": "pepe_cool",
        "filename": "60037.png"
    },
    "pepe_coolclap": {
        "code": 60038,
        "name": "pepe_coolclap",
        "filename": "60038.png"
    },
    "pepe_copium": {
        "code": 60039,
        "name": "pepe_copium",
        "filename": "60039.png"
    },
    "pepe_copter": {
        "code": 60040,
        "name": "pepe_copter",
        "filename": "60040.png"
    },
    "pepe_cough": {
        "code": 60041,
        "name": "pepe_cough",
        "filename": "60041.png"
    },
    "pepe_cowboy": {
        "code": 60042,
        "name": "pepe_cowboy",
        "filename": "60042.png"
    },
    "pepe_crazy_write": {
        "code": 60043,
        "name": "pepe_crazy_write",
        "filename": "60043.png"
    },
    "pepe_cross": {
        "code": 60044,
        "name": "pepe_cross",
        "filename": "60044.png"
    },
    "pepe_crown": {
        "code": 60045,
        "name": "pepe_crown",
        "filename": "60045.png"
    },
    "pepe_crown_flip": {
        "code": 60046,
        "name": "pepe_crown_flip",
        "filename": "60046.png"
    },
    "pepe_cry": {
        "code": 60047,
        "name": "pepe_cry",
        "filename": "60047.png"
    },
    "pepe_cry_groovin": {
        "code": 60048,
        "name": "pepe_cry_groovin",
        "filename": "60048.png"
    },
    "pepe_crydrink": {
        "code": 60049,
        "name": "pepe_crydrink",
        "filename": "60049.png"
    },
    "pepe_crying": {
        "code": 60050,
        "name": "pepe_crying",
        "filename": "60050.png"
    },
    "pepe_dab": {
        "code": 60051,
        "name": "pepe_dab",
        "filename": "60051.png"
    },
    "pepe_dababy": {
        "code": 60052,
        "name": "pepe_dababy",
        "filename": "60052.png"
    },
    "pepe_damn": {
        "code": 60053,
        "name": "pepe_damn",
        "filename": "60053.png"
    },
    "pepe_dance": {
        "code": 60054,
        "name": "pepe_dance",
        "filename": "60054.png"
    },
    "pepe_danceru": {
        "code": 60055,
        "name": "pepe_danceru",
        "filename": "60055.png"
    },
    "pepe_deformed": {
        "code": 60056,
        "name": "pepe_deformed",
        "filename": "60056.png"
    },
    "pepe_deletethis": {
        "code": 60057,
        "name": "pepe_deletethis",
        "filename": "60057.png"
    },
    "pepe_deppresed": {
        "code": 60058,
        "name": "pepe_deppresed",
        "filename": "60058.png"
    },
    "pepe_derp": {
        "code": 60059,
        "name": "pepe_derp",
        "filename": "60059.png"
    },
    "pepe_devil": {
        "code": 60060,
        "name": "pepe_devil",
        "filename": "60060.png"
    },
    "pepe_diamond_sword": {
        "code": 60061,
        "name": "pepe_diamond_sword",
        "filename": "60061.png"
    },
    "pepe_dipsy": {
        "code": 60062,
        "name": "pepe_dipsy",
        "filename": "60062.png"
    },
    "pepe_disabled_poggers": {
        "code": 60063,
        "name": "pepe_disabled_poggers",
        "filename": "60063.png"
    },
    "pepe_disco_dance": {
        "code": 60064,
        "name": "pepe_disco_dance",
        "filename": "60064.png"
    },
    "pepe_driver": {
        "code": 60065,
        "name": "pepe_driver",
        "filename": "60065.png"
    },
    "pepe_drums": {
        "code": 60066,
        "name": "pepe_drums",
        "filename": "60066.png"
    },
    "pepe_eggplant": {
        "code": 60067,
        "name": "pepe_eggplant",
        "filename": "60067.png"
    },
    "pepe_elon_musk": {
        "code": 60068,
        "name": "pepe_elon_musk",
        "filename": "60068.png"
    },
    "pepe_emoji_sign": {
        "code": 60069,
        "name": "pepe_emoji_sign",
        "filename": "60069.png"
    },
    "pepe_enchanted_diamond_sword": {
        "code": 60070,
        "name": "pepe_enchanted_diamond_sword",
        "filename": "60070.png"
    },
    "pepe_enchanted_netherite_sword": {
        "code": 60071,
        "name": "pepe_enchanted_netherite_sword",
        "filename": "60071.png"
    },
    "pepe_excited": {
        "code": 60072,
        "name": "pepe_excited",
        "filename": "60072.png"
    },
    "pepe_explode": {
        "code": 60073,
        "name": "pepe_explode",
        "filename": "60073.png"
    },
    "pepe_eye_fat": {
        "code": 60074,
        "name": "pepe_eye_fat",
        "filename": "60074.png"
    },
    "pepe_eyeroll": {
        "code": 60075,
        "name": "pepe_eyeroll",
        "filename": "60075.png"
    },
    "pepe_ez": {
        "code": 60076,
        "name": "pepe_ez",
        "filename": "60076.png"
    },
    "pepe_facepalm": {
        "code": 60077,
        "name": "pepe_facepalm",
        "filename": "60077.png"
    },
    "pepe_fansniff": {
        "code": 60078,
        "name": "pepe_fansniff",
        "filename": "60078.png"
    },
    "pepe_fast_run": {
        "code": 60079,
        "name": "pepe_fast_run",
        "filename": "60079.png"
    },
    "pepe_fbi_dumb": {
        "code": 60080,
        "name": "pepe_fbi_dumb",
        "filename": "60080.png"
    },
    "pepe_fcku": {
        "code": 60081,
        "name": "pepe_fcku",
        "filename": "60081.png"
    },
    "pepe_feelsadman": {
        "code": 60082,
        "name": "pepe_feelsadman",
        "filename": "60082.png"
    },
    "pepe_feelsbadman": {
        "code": 60083,
        "name": "pepe_feelsbadman",
        "filename": "60083.png"
    },
    "pepe_feelsgoodman": {
        "code": 60084,
        "name": "pepe_feelsgoodman",
        "filename": "60084.png"
    },
    "pepe_fisherman": {
        "code": 60085,
        "name": "pepe_fisherman",
        "filename": "60085.png"
    },
    "pepe_fla": {
        "code": 60086,
        "name": "pepe_fla",
        "filename": "60086.png"
    },
    "pepe_flame": {
        "code": 60087,
        "name": "pepe_flame",
        "filename": "60087.png"
    },
    "pepe_flex": {
        "code": 60088,
        "name": "pepe_flex",
        "filename": "60088.png"
    },
    "pepe_flower": {
        "code": 60089,
        "name": "pepe_flower",
        "filename": "60089.png"
    },
    "pepe_flushed": {
        "code": 60090,
        "name": "pepe_flushed",
        "filename": "60090.png"
    },
    "pepe_forever_alone": {
        "code": 60091,
        "name": "pepe_forever_alone",
        "filename": "60091.png"
    },
    "pepe_fuck_you": {
        "code": 60092,
        "name": "pepe_fuck_you",
        "filename": "60092.png"
    },
    "pepe_fury": {
        "code": 60093,
        "name": "pepe_fury",
        "filename": "60093.png"
    },
    "pepe_gimme_corona": {
        "code": 60094,
        "name": "pepe_gimme_corona",
        "filename": "60094.png"
    },
    "pepe_glare": {
        "code": 60095,
        "name": "pepe_glare",
        "filename": "60095.png"
    },
    "pepe_goose_ride": {
        "code": 60096,
        "name": "pepe_goose_ride",
        "filename": "60096.png"
    },
    "pepe_goosed_out": {
        "code": 60097,
        "name": "pepe_goosed_out",
        "filename": "60097.png"
    },
    "pepe_gostface_red_evil": {
        "code": 60098,
        "name": "pepe_gostface_red_evil",
        "filename": "60098.png"
    },
    "pepe_graduate": {
        "code": 60099,
        "name": "pepe_graduate",
        "filename": "60099.png"
    },
    "pepe_grin_reaper": {
        "code": 60100,
        "name": "pepe_grin_reaper",
        "filename": "60100.png"
    },
    "pepe_guitar": {
        "code": 60101,
        "name": "pepe_guitar",
        "filename": "60101.png"
    },
    "pepe_gun": {
        "code": 60102,
        "name": "pepe_gun",
        "filename": "60102.png"
    },
    "pepe_guns": {
        "code": 60103,
        "name": "pepe_guns",
        "filename": "60103.png"
    },
    "pepe_hack": {
        "code": 60104,
        "name": "pepe_hack",
        "filename": "60104.png"
    },
    "pepe_hacker": {
        "code": 60105,
        "name": "pepe_hacker",
        "filename": "60105.png"
    },
    "pepe_haha_noob": {
        "code": 60106,
        "name": "pepe_haha_noob",
        "filename": "60106.png"
    },
    "pepe_halloween": {
        "code": 60107,
        "name": "pepe_halloween",
        "filename": "60107.png"
    },
    "pepe_hamburger": {
        "code": 60108,
        "name": "pepe_hamburger",
        "filename": "60108.png"
    },
    "pepe_hammer": {
        "code": 60109,
        "name": "pepe_hammer",
        "filename": "60109.png"
    },
    "pepe_happy": {
        "code": 60110,
        "name": "pepe_happy",
        "filename": "60110.png"
    },
    "pepe_happyeyes": {
        "code": 60111,
        "name": "pepe_happyeyes",
        "filename": "60111.png"
    },
    "pepe_headphones": {
        "code": 60112,
        "name": "pepe_headphones",
        "filename": "60112.png"
    },
    "pepe_headset": {
        "code": 60113,
        "name": "pepe_headset",
        "filename": "60113.png"
    },
    "pepe_heart": {
        "code": 60114,
        "name": "pepe_heart",
        "filename": "60114.png"
    },
    "pepe_hearts": {
        "code": 60115,
        "name": "pepe_hearts",
        "filename": "60115.png"
    },
    "pepe_heartstruck": {
        "code": 60116,
        "name": "pepe_heartstruck",
        "filename": "60116.png"
    },
    "pepe_hellfire": {
        "code": 60117,
        "name": "pepe_hellfire",
        "filename": "60117.png"
    },
    "pepe_high": {
        "code": 60118,
        "name": "pepe_high",
        "filename": "60118.png"
    },
    "pepe_high_five_2": {
        "code": 60119,
        "name": "pepe_high_five_2",
        "filename": "60119.png"
    },
    "pepe_hmhmm": {
        "code": 60120,
        "name": "pepe_hmhmm",
        "filename": "60120.png"
    },
    "pepe_hmm": {
        "code": 60121,
        "name": "pepe_hmm",
        "filename": "60121.png"
    },
    "pepe_hoes_mad": {
        "code": 60122,
        "name": "pepe_hoes_mad",
        "filename": "60122.png"
    },
    "pepe_holy_scared": {
        "code": 60123,
        "name": "pepe_holy_scared",
        "filename": "60123.png"
    },
    "pepe_hoodie_blue": {
        "code": 60124,
        "name": "pepe_hoodie_blue",
        "filename": "60124.png"
    },
    "pepe_hoodie_red": {
        "code": 60125,
        "name": "pepe_hoodie_red",
        "filename": "60125.png"
    },
    "pepe_hug": {
        "code": 60126,
        "name": "pepe_hug",
        "filename": "60126.png"
    },
    "pepe_hype": {
        "code": 60127,
        "name": "pepe_hype",
        "filename": "60127.png"
    },
    "pepe_hyped": {
        "code": 60128,
        "name": "pepe_hyped",
        "filename": "60128.png"
    },
    "pepe_iloveyou": {
        "code": 60129,
        "name": "pepe_iloveyou",
        "filename": "60129.png"
    },
    "pepe_inspect": {
        "code": 60130,
        "name": "pepe_inspect",
        "filename": "60130.png"
    },
    "pepe_jamming": {
        "code": 60131,
        "name": "pepe_jamming",
        "filename": "60131.png"
    },
    "pepe_jet_bubbles": {
        "code": 60132,
        "name": "pepe_jet_bubbles",
        "filename": "60132.png"
    },
    "pepe_joeycreepy": {
        "code": 60133,
        "name": "pepe_joeycreepy",
        "filename": "60133.png"
    },
    "pepe_joy": {
        "code": 60134,
        "name": "pepe_joy",
        "filename": "60134.png"
    },
    "pepe_juice": {
        "code": 60135,
        "name": "pepe_juice",
        "filename": "60135.png"
    },
    "pepe_jump": {
        "code": 60136,
        "name": "pepe_jump",
        "filename": "60136.png"
    },
    "pepe_karen": {
        "code": 60137,
        "name": "pepe_karen",
        "filename": "60137.png"
    },
    "pepe_kek": {
        "code": 60138,
        "name": "pepe_kek",
        "filename": "60138.png"
    },
    "pepe_kekw": {
        "code": 60139,
        "name": "pepe_kekw",
        "filename": "60139.png"
    },
    "pepe_king": {
        "code": 60140,
        "name": "pepe_king",
        "filename": "60140.png"
    },
    "pepe_kiss": {
        "code": 60141,
        "name": "pepe_kiss",
        "filename": "60141.png"
    },
    "pepe_knickers_pink": {
        "code": 60142,
        "name": "pepe_knickers_pink",
        "filename": "60142.png"
    },
    "pepe_knife": {
        "code": 61419,
        "name": "pepe_knife",
        "filename": "61419.png"
    },
    "pepe_kraken": {
        "code": 60144,
        "name": "pepe_kraken",
        "filename": "60144.png"
    },
    "pepe_krytoi": {
        "code": 60145,
        "name": "pepe_krytoi",
        "filename": "60145.png"
    },
    "pepe_kys": {
        "code": 60146,
        "name": "pepe_kys",
        "filename": "60146.png"
    },
    "pepe_l": {
        "code": 60147,
        "name": "pepe_l",
        "filename": "60147.png"
    },
    "pepe_laalaa": {
        "code": 60148,
        "name": "pepe_laalaa",
        "filename": "60148.png"
    },
    "pepe_laugh": {
        "code": 60149,
        "name": "pepe_laugh",
        "filename": "60149.png"
    },
    "pepe_legit": {
        "code": 60150,
        "name": "pepe_legit",
        "filename": "60150.png"
    },
    "pepe_lex": {
        "code": 60151,
        "name": "pepe_lex",
        "filename": "60151.png"
    },
    "pepe_lgbtq_bandana": {
        "code": 60152,
        "name": "pepe_lgbtq_bandana",
        "filename": "60152.png"
    },
    "pepe_lgbtq_flag": {
        "code": 60153,
        "name": "pepe_lgbtq_flag",
        "filename": "60153.png"
    },
    "pepe_lgbtq_sign": {
        "code": 60154,
        "name": "pepe_lgbtq_sign",
        "filename": "60154.png"
    },
    "pepe_like": {
        "code": 60155,
        "name": "pepe_like",
        "filename": "60155.png"
    },
    "pepe_lipbite": {
        "code": 60156,
        "name": "pepe_lipbite",
        "filename": "60156.png"
    },
    "pepe_love": {
        "code": 60157,
        "name": "pepe_love",
        "filename": "60157.png"
    },
    "pepe_love_you": {
        "code": 60158,
        "name": "pepe_love_you",
        "filename": "60158.png"
    },
    "pepe_loves_anime": {
        "code": 60159,
        "name": "pepe_loves_anime",
        "filename": "60159.png"
    },
    "pepe_low_cost": {
        "code": 60160,
        "name": "pepe_low_cost",
        "filename": "60160.png"
    },
    "pepe_lurk": {
        "code": 60161,
        "name": "pepe_lurk",
        "filename": "60161.png"
    },
    "pepe_machete": {
        "code": 60162,
        "name": "pepe_machete",
        "filename": "60162.png"
    },
    "pepe_mad": {
        "code": 60163,
        "name": "pepe_mad",
        "filename": "60163.png"
    },
    "pepe_mad_angry": {
        "code": 60164,
        "name": "pepe_mad_angry",
        "filename": "60164.png"
    },
    "pepe_mad_jam": {
        "code": 60165,
        "name": "pepe_mad_jam",
        "filename": "60165.png"
    },
    "pepe_mexican": {
        "code": 60166,
        "name": "pepe_mexican",
        "filename": "60166.png"
    },
    "pepe_middlefinger": {
        "code": 60167,
        "name": "pepe_middlefinger",
        "filename": "60167.png"
    },
    "pepe_millionaire": {
        "code": 60168,
        "name": "pepe_millionaire",
        "filename": "60168.png"
    },
    "pepe_mindblown": {
        "code": 60169,
        "name": "pepe_mindblown",
        "filename": "60169.png"
    },
    "pepe_mirror_vamp": {
        "code": 60170,
        "name": "pepe_mirror_vamp",
        "filename": "60170.png"
    },
    "pepe_mods": {
        "code": 60171,
        "name": "pepe_mods",
        "filename": "60171.png"
    },
    "pepe_money": {
        "code": 60172,
        "name": "pepe_money",
        "filename": "60172.png"
    },
    "pepe_nailbiting": {
        "code": 60173,
        "name": "pepe_nailbiting",
        "filename": "60173.png"
    },
    "pepe_nani": {
        "code": 60174,
        "name": "pepe_nani",
        "filename": "60174.png"
    },
    "pepe_netherite_sword": {
        "code": 60175,
        "name": "pepe_netherite_sword",
        "filename": "60175.png"
    },
    "pepe_nice_dude": {
        "code": 60176,
        "name": "pepe_nice_dude",
        "filename": "60176.png"
    },
    "pepe_nintendo": {
        "code": 60177,
        "name": "pepe_nintendo",
        "filename": "60177.png"
    },
    "pepe_nitro": {
        "code": 60178,
        "name": "pepe_nitro",
        "filename": "60178.png"
    },
    "pepe_no": {
        "code": 60179,
        "name": "pepe_no",
        "filename": "60179.png"
    },
    "pepe_no_wifi": {
        "code": 60180,
        "name": "pepe_no_wifi",
        "filename": "60180.png"
    },
    "pepe_no_you": {
        "code": 60181,
        "name": "pepe_no_you",
        "filename": "60181.png"
    },
    "pepe_noice": {
        "code": 60182,
        "name": "pepe_noice",
        "filename": "60182.png"
    },
    "pepe_noob": {
        "code": 60183,
        "name": "pepe_noob",
        "filename": "60183.png"
    },
    "pepe_nopes": {
        "code": 60184,
        "name": "pepe_nopes",
        "filename": "60184.png"
    },
    "pepe_noted": {
        "code": 60185,
        "name": "pepe_noted",
        "filename": "60185.png"
    },
    "pepe_notlikethis": {
        "code": 60186,
        "name": "pepe_notlikethis",
        "filename": "60186.png"
    },
    "pepe_nou": {
        "code": 60187,
        "name": "pepe_nou",
        "filename": "60187.png"
    },
    "pepe_oh": {
        "code": 60188,
        "name": "pepe_oh",
        "filename": "60188.png"
    },
    "pepe_ohgodno": {
        "code": 60189,
        "name": "pepe_ohgodno",
        "filename": "60189.png"
    },
    "pepe_ok": {
        "code": 60190,
        "name": "pepe_ok",
        "filename": "60190.png"
    },
    "pepe_omg": {
        "code": 60191,
        "name": "pepe_omg",
        "filename": "60191.png"
    },
    "pepe_out": {
        "code": 60192,
        "name": "pepe_out",
        "filename": "60192.png"
    },
    "pepe_panda": {
        "code": 60193,
        "name": "pepe_panda",
        "filename": "60193.png"
    },
    "pepe_paper": {
        "code": 60194,
        "name": "pepe_paper",
        "filename": "60194.png"
    },
    "pepe_partner_king": {
        "code": 60195,
        "name": "pepe_partner_king",
        "filename": "60195.png"
    },
    "pepe_party": {
        "code": 60196,
        "name": "pepe_party",
        "filename": "60196.png"
    },
    "pepe_pat_sad": {
        "code": 60197,
        "name": "pepe_pat_sad",
        "filename": "60197.png"
    },
    "pepe_peace": {
        "code": 60198,
        "name": "pepe_peace",
        "filename": "60198.png"
    },
    "pepe_peaceout": {
        "code": 60199,
        "name": "pepe_peaceout",
        "filename": "60199.png"
    },
    "pepe_peek": {
        "code": 60200,
        "name": "pepe_peek",
        "filename": "60200.png"
    },
    "pepe_pet": {
        "code": 60201,
        "name": "pepe_pet",
        "filename": "60201.png"
    },
    "pepe_petpet": {
        "code": 60202,
        "name": "pepe_petpet",
        "filename": "60202.png"
    },
    "pepe_phone202": {
        "code": 60203,
        "name": "pepe_phone202",
        "filename": "60203.png"
    },
    "pepe_photographer": {
        "code": 60204,
        "name": "pepe_photographer",
        "filename": "60204.png"
    },
    "pepe_piano": {
        "code": 60205,
        "name": "pepe_piano",
        "filename": "60205.png"
    },
    "pepe_pillow": {
        "code": 60206,
        "name": "pepe_pillow",
        "filename": "60206.png"
    },
    "pepe_pirate": {
        "code": 60207,
        "name": "pepe_pirate",
        "filename": "60207.png"
    },
    "pepe_pizza": {
        "code": 60208,
        "name": "pepe_pizza",
        "filename": "60208.png"
    },
    "pepe_pleaseshutup": {
        "code": 60209,
        "name": "pepe_pleaseshutup",
        "filename": "60209.png"
    },
    "pepe_pls": {
        "code": 60210,
        "name": "pepe_pls",
        "filename": "60210.png"
    },
    "pepe_po": {
        "code": 60211,
        "name": "pepe_po",
        "filename": "60211.png"
    },
    "pepe_pog": {
        "code": 60212,
        "name": "pepe_pog",
        "filename": "60212.png"
    },
    "pepe_police": {
        "code": 60213,
        "name": "pepe_police",
        "filename": "60213.png"
    },
    "pepe_police_dog": {
        "code": 60214,
        "name": "pepe_police_dog",
        "filename": "60214.png"
    },
    "pepe_poooooopoo": {
        "code": 60215,
        "name": "pepe_poooooopoo",
        "filename": "60215.png"
    },
    "pepe_popcorn": {
        "code": 60216,
        "name": "pepe_popcorn",
        "filename": "60216.png"
    },
    "pepe_pray": {
        "code": 60217,
        "name": "pepe_pray",
        "filename": "60217.png"
    },
    "pepe_present": {
        "code": 60218,
        "name": "pepe_present",
        "filename": "60218.png"
    },
    "pepe_pride": {
        "code": 60219,
        "name": "pepe_pride",
        "filename": "60219.png"
    },
    "pepe_prideheart": {
        "code": 60220,
        "name": "pepe_prideheart",
        "filename": "60220.png"
    },
    "pepe_prisonmike": {
        "code": 60221,
        "name": "pepe_prisonmike",
        "filename": "60221.png"
    },
    "pepe_puke": {
        "code": 60222,
        "name": "pepe_puke",
        "filename": "60222.png"
    },
    "pepe_punch": {
        "code": 60223,
        "name": "pepe_punch",
        "filename": "60223.png"
    },
    "pepe_purplecrown": {
        "code": 60224,
        "name": "pepe_purplecrown",
        "filename": "60224.png"
    },
    "pepe_rage": {
        "code": 60225,
        "name": "pepe_rage",
        "filename": "60225.png"
    },
    "pepe_rain": {
        "code": 60226,
        "name": "pepe_rain",
        "filename": "60226.png"
    },
    "pepe_rainbow_lgbt": {
        "code": 60227,
        "name": "pepe_rainbow_lgbt",
        "filename": "60227.png"
    },
    "pepe_raincoat": {
        "code": 60228,
        "name": "pepe_raincoat",
        "filename": "60228.png"
    },
    "pepe_redfury": {
        "code": 60229,
        "name": "pepe_redfury",
        "filename": "60229.png"
    },
    "pepe_reeeeeeeeeeeee": {
        "code": 60230,
        "name": "pepe_reeeeeeeeeeeee",
        "filename": "60230.png"
    },
    "pepe_respected": {
        "code": 60231,
        "name": "pepe_respected",
        "filename": "60231.png"
    },
    "pepe_ride_dog": {
        "code": 60232,
        "name": "pepe_ride_dog",
        "filename": "60232.png"
    },
    "pepe_saber_1": {
        "code": 60233,
        "name": "pepe_saber_1",
        "filename": "60233.png"
    },
    "pepe_saber_2": {
        "code": 60234,
        "name": "pepe_saber_2",
        "filename": "60234.png"
    },
    "pepe_sad": {
        "code": 60235,
        "name": "pepe_sad",
        "filename": "60235.png"
    },
    "pepe_sadhugs": {
        "code": 60236,
        "name": "pepe_sadhugs",
        "filename": "60236.png"
    },
    "pepe_sadschrug": {
        "code": 60237,
        "name": "pepe_sadschrug",
        "filename": "60237.png"
    },
    "pepe_salute": {
        "code": 60238,
        "name": "pepe_salute",
        "filename": "60238.png"
    },
    "pepe_sausage": {
        "code": 60239,
        "name": "pepe_sausage",
        "filename": "60239.png"
    },
    "pepe_sheesh": {
        "code": 60240,
        "name": "pepe_sheesh",
        "filename": "60240.png"
    },
    "pepe_shine_eyes": {
        "code": 60241,
        "name": "pepe_shine_eyes",
        "filename": "60241.png"
    },
    "pepe_shirt": {
        "code": 60242,
        "name": "pepe_shirt",
        "filename": "60242.png"
    },
    "pepe_shock": {
        "code": 60243,
        "name": "pepe_shock",
        "filename": "60243.png"
    },
    "pepe_shoot1": {
        "code": 60244,
        "name": "pepe_shoot1",
        "filename": "60244.png"
    },
    "pepe_shooting": {
        "code": 60245,
        "name": "pepe_shooting",
        "filename": "60245.png"
    },
    "pepe_shotgun": {
        "code": 60246,
        "name": "pepe_shotgun",
        "filename": "60246.png"
    },
    "pepe_shots": {
        "code": 60247,
        "name": "pepe_shots",
        "filename": "60247.png"
    },
    "pepe_shutup": {
        "code": 60248,
        "name": "pepe_shutup",
        "filename": "60248.png"
    },
    "pepe_shy": {
        "code": 60249,
        "name": "pepe_shy",
        "filename": "60249.png"
    },
    "pepe_simp": {
        "code": 60250,
        "name": "pepe_simp",
        "filename": "60250.png"
    },
    "pepe_sing": {
        "code": 60251,
        "name": "pepe_sing",
        "filename": "60251.png"
    },
    "pepe_sipspin": {
        "code": 60252,
        "name": "pepe_sipspin",
        "filename": "60252.png"
    },
    "pepe_sit": {
        "code": 60253,
        "name": "pepe_sit",
        "filename": "60253.png"
    },
    "pepe_sith": {
        "code": 60254,
        "name": "pepe_sith",
        "filename": "60254.png"
    },
    "pepe_slam": {
        "code": 60255,
        "name": "pepe_slam",
        "filename": "60255.png"
    },
    "pepe_sleep": {
        "code": 60256,
        "name": "pepe_sleep",
        "filename": "60256.png"
    },
    "pepe_smile": {
        "code": 60257,
        "name": "pepe_smile",
        "filename": "60257.png"
    },
    "pepe_smirk": {
        "code": 60258,
        "name": "pepe_smirk",
        "filename": "60258.png"
    },
    "pepe_smoke": {
        "code": 60259,
        "name": "pepe_smoke",
        "filename": "60259.png"
    },
    "pepe_smug": {
        "code": 60260,
        "name": "pepe_smug",
        "filename": "60260.png"
    },
    "pepe_sorry": {
        "code": 60261,
        "name": "pepe_sorry",
        "filename": "60261.png"
    },
    "pepe_spell_book": {
        "code": 60262,
        "name": "pepe_spell_book",
        "filename": "60262.png"
    },
    "pepe_spongebob": {
        "code": 60263,
        "name": "pepe_spongebob",
        "filename": "60263.png"
    },
    "pepe_star": {
        "code": 60264,
        "name": "pepe_star",
        "filename": "60264.png"
    },
    "pepe_stare": {
        "code": 60265,
        "name": "pepe_stare",
        "filename": "60265.png"
    },
    "pepe_stareyes": {
        "code": 60266,
        "name": "pepe_stareyes",
        "filename": "60266.png"
    },
    "pepe_stop": {
        "code": 60267,
        "name": "pepe_stop",
        "filename": "60267.png"
    },
    "pepe_stop_gender": {
        "code": 60268,
        "name": "pepe_stop_gender",
        "filename": "60268.png"
    },
    "pepe_studying": {
        "code": 60269,
        "name": "pepe_studying",
        "filename": "60269.png"
    },
    "pepe_suatmm": {
        "code": 60270,
        "name": "pepe_suatmm",
        "filename": "60270.png"
    },
    "pepe_suffering": {
        "code": 60271,
        "name": "pepe_suffering",
        "filename": "60271.png"
    },
    "pepe_sunbaby": {
        "code": 60272,
        "name": "pepe_sunbaby",
        "filename": "60272.png"
    },
    "pepe_sunglasses": {
        "code": 60273,
        "name": "pepe_sunglasses",
        "filename": "60273.png"
    },
    "pepe_sunglasses_sit": {
        "code": 60274,
        "name": "pepe_sunglasses_sit",
        "filename": "60274.png"
    },
    "pepe_sus": {
        "code": 60275,
        "name": "pepe_sus",
        "filename": "60275.png"
    },
    "pepe_swag": {
        "code": 60276,
        "name": "pepe_swag",
        "filename": "60276.png"
    },
    "pepe_swat": {
        "code": 60277,
        "name": "pepe_swat",
        "filename": "60277.png"
    },
    "pepe_sweat": {
        "code": 61422,
        "name": "pepe_sweat",
        "filename": "61422.png"
    },
    "pepe_sweatsmile": {
        "code": 60279,
        "name": "pepe_sweatsmile",
        "filename": "60279.png"
    },
    "pepe_tada": {
        "code": 60280,
        "name": "pepe_tada",
        "filename": "60280.png"
    },
    "pepe_thankful": {
        "code": 60281,
        "name": "pepe_thankful",
        "filename": "60281.png"
    },
    "pepe_thats_nice": {
        "code": 60282,
        "name": "pepe_thats_nice",
        "filename": "60282.png"
    },
    "pepe_think": {
        "code": 60283,
        "name": "pepe_think",
        "filename": "60283.png"
    },
    "pepe_think_light": {
        "code": 60284,
        "name": "pepe_think_light",
        "filename": "60284.png"
    },
    "pepe_think_omega": {
        "code": 60285,
        "name": "pepe_think_omega",
        "filename": "60285.png"
    },
    "pepe_thinking": {
        "code": 60286,
        "name": "pepe_thinking",
        "filename": "60286.png"
    },
    "pepe_thug": {
        "code": 60287,
        "name": "pepe_thug",
        "filename": "60287.png"
    },
    "pepe_thumbsdown": {
        "code": 60288,
        "name": "pepe_thumbsdown",
        "filename": "60288.png"
    },
    "pepe_thumbsup": {
        "code": 60289,
        "name": "pepe_thumbsup",
        "filename": "60289.png"
    },
    "pepe_thumpup": {
        "code": 60290,
        "name": "pepe_thumpup",
        "filename": "60290.png"
    },
    "pepe_time": {
        "code": 60291,
        "name": "pepe_time",
        "filename": "60291.png"
    },
    "pepe_tinkywinky": {
        "code": 60292,
        "name": "pepe_tinkywinky",
        "filename": "60292.png"
    },
    "pepe_tinyviolin": {
        "code": 60293,
        "name": "pepe_tinyviolin",
        "filename": "60293.png"
    },
    "pepe_tipsfedora": {
        "code": 60294,
        "name": "pepe_tipsfedora",
        "filename": "60294.png"
    },
    "pepe_toilet": {
        "code": 60295,
        "name": "pepe_toilet",
        "filename": "60295.png"
    },
    "pepe_tomato": {
        "code": 60296,
        "name": "pepe_tomato",
        "filename": "60296.png"
    },
    "pepe_tos": {
        "code": 60297,
        "name": "pepe_tos",
        "filename": "60297.png"
    },
    "pepe_toxic": {
        "code": 60298,
        "name": "pepe_toxic",
        "filename": "60298.png"
    },
    "pepe_tradeoffer": {
        "code": 60299,
        "name": "pepe_tradeoffer",
        "filename": "60299.png"
    },
    "pepe_transform": {
        "code": 60300,
        "name": "pepe_transform",
        "filename": "60300.png"
    },
    "pepe_trollface": {
        "code": 60301,
        "name": "pepe_trollface",
        "filename": "60301.png"
    },
    "pepe_trophy": {
        "code": 60302,
        "name": "pepe_trophy",
        "filename": "60302.png"
    },
    "pepe_true": {
        "code": 60303,
        "name": "pepe_true",
        "filename": "60303.png"
    },
    "pepe_trumpet": {
        "code": 60304,
        "name": "pepe_trumpet",
        "filename": "60304.png"
    },
    "pepe_tub": {
        "code": 60305,
        "name": "pepe_tub",
        "filename": "60305.png"
    },
    "pepe_twerk": {
        "code": 60306,
        "name": "pepe_twerk",
        "filename": "60306.png"
    },
    "pepe_twitter": {
        "code": 60307,
        "name": "pepe_twitter",
        "filename": "60307.png"
    },
    "pepe_uhh": {
        "code": 60308,
        "name": "pepe_uhh",
        "filename": "60308.png"
    },
    "pepe_underwear": {
        "code": 60309,
        "name": "pepe_underwear",
        "filename": "60309.png"
    },
    "pepe_unfair": {
        "code": 60310,
        "name": "pepe_unfair",
        "filename": "60310.png"
    },
    "pepe_upsidedownsmile": {
        "code": 60311,
        "name": "pepe_upsidedownsmile",
        "filename": "60311.png"
    },
    "pepe_upvote": {
        "code": 60312,
        "name": "pepe_upvote",
        "filename": "60312.png"
    },
    "pepe_uunga_buunga": {
        "code": 60313,
        "name": "pepe_uunga_buunga",
        "filename": "60313.png"
    },
    "pepe_valid": {
        "code": 60314,
        "name": "pepe_valid",
        "filename": "60314.png"
    },
    "pepe_vanish": {
        "code": 60315,
        "name": "pepe_vanish",
        "filename": "60315.png"
    },
    "pepe_vibin": {
        "code": 60316,
        "name": "pepe_vibin",
        "filename": "60316.png"
    },
    "pepe_vomit": {
        "code": 60317,
        "name": "pepe_vomit",
        "filename": "60317.png"
    },
    "pepe_walk": {
        "code": 60318,
        "name": "pepe_walk",
        "filename": "60318.png"
    },
    "pepe_walkout": {
        "code": 60319,
        "name": "pepe_walkout",
        "filename": "60319.png"
    },
    "pepe_wannahug": {
        "code": 60320,
        "name": "pepe_wannahug",
        "filename": "60320.png"
    },
    "pepe_wave": {
        "code": 60321,
        "name": "pepe_wave",
        "filename": "60321.png"
    },
    "pepe_wealthy": {
        "code": 60322,
        "name": "pepe_wealthy",
        "filename": "60322.png"
    },
    "pepe_what": {
        "code": 60323,
        "name": "pepe_what",
        "filename": "60323.png"
    },
    "pepe_whip": {
        "code": 60324,
        "name": "pepe_whip",
        "filename": "60324.png"
    },
    "pepe_whiteeyes": {
        "code": 60325,
        "name": "pepe_whiteeyes",
        "filename": "60325.png"
    },
    "pepe_why": {
        "code": 60326,
        "name": "pepe_why",
        "filename": "60326.png"
    },
    "pepe_wine": {
        "code": 60327,
        "name": "pepe_wine",
        "filename": "60327.png"
    },
    "pepe_wine_cry": {
        "code": 60328,
        "name": "pepe_wine_cry",
        "filename": "60328.png"
    },
    "pepe_wink": {
        "code": 60329,
        "name": "pepe_wink",
        "filename": "60329.png"
    },
    "pepe_with_jesus": {
        "code": 60330,
        "name": "pepe_with_jesus",
        "filename": "60330.png"
    },
    "pepe_wtf": {
        "code": 60331,
        "name": "pepe_wtf",
        "filename": "60331.png"
    },
    "pepe_yah_right": {
        "code": 60332,
        "name": "pepe_yah_right",
        "filename": "60332.png"
    },
    "pepe_yay": {
        "code": 60333,
        "name": "pepe_yay",
        "filename": "60333.png"
    },
    "pepe_yeaa": {
        "code": 60334,
        "name": "pepe_yeaa",
        "filename": "60334.png"
    },
    "pepe_yes": {
        "code": 60335,
        "name": "pepe_yes",
        "filename": "60335.png"
    },
    "pepe_yessir": {
        "code": 60336,
        "name": "pepe_yessir",
        "filename": "60336.png"
    },
    "pepe_yikes": {
        "code": 60337,
        "name": "pepe_yikes",
        "filename": "60337.png"
    },
    "pepe_you_are_a_gay": {
        "code": 60338,
        "name": "pepe_you_are_a_gay",
        "filename": "60338.png"
    },
    "pepe_youcantseeme": {
        "code": 60339,
        "name": "pepe_youcantseeme",
        "filename": "60339.png"
    },
    "pepeagony": {
        "code": 60340,
        "name": "pepeagony",
        "filename": "60340.png"
    },
    "pepeameteur": {
        "code": 60341,
        "name": "pepeameteur",
        "filename": "60341.png"
    },
    "pepeangel": {
        "code": 60342,
        "name": "pepeangel",
        "filename": "60342.png"
    },
    "pepeangeryspin": {
        "code": 60343,
        "name": "pepeangeryspin",
        "filename": "60343.png"
    },
    "pepeangry": {
        "code": 60344,
        "name": "pepeangry",
        "filename": "60344.png"
    },
    "pepeangryaussie": {
        "code": 60345,
        "name": "pepeangryaussie",
        "filename": "60345.png"
    },
    "pepearabexplode": {
        "code": 60346,
        "name": "pepearabexplode",
        "filename": "60346.png"
    },
    "pepearmchair": {
        "code": 60347,
        "name": "pepearmchair",
        "filename": "60347.png"
    },
    "pepeban": {
        "code": 60348,
        "name": "pepeban",
        "filename": "60348.png"
    },
    "pepebanned": {
        "code": 60349,
        "name": "pepebanned",
        "filename": "60349.png"
    },
    "pepebass": {
        "code": 60350,
        "name": "pepebass",
        "filename": "60350.png"
    },
    "pepebean": {
        "code": 60351,
        "name": "pepebean",
        "filename": "60351.png"
    },
    "pepebigsmile": {
        "code": 60352,
        "name": "pepebigsmile",
        "filename": "60352.png"
    },
    "pepeblanketrun": {
        "code": 60353,
        "name": "pepeblanketrun",
        "filename": "60353.png"
    },
    "pepeblink": {
        "code": 60354,
        "name": "pepeblink",
        "filename": "60354.png"
    },
    "pepebloodypanties": {
        "code": 60355,
        "name": "pepebloodypanties",
        "filename": "60355.png"
    },
    "pepeblushed": {
        "code": 60356,
        "name": "pepeblushed",
        "filename": "60356.png"
    },
    "pepeboomer": {
        "code": 60357,
        "name": "pepeboomer",
        "filename": "60357.png"
    },
    "pepeboosting": {
        "code": 60358,
        "name": "pepeboosting",
        "filename": "60358.png"
    },
    "pepebooty": {
        "code": 60359,
        "name": "pepebooty",
        "filename": "60359.png"
    },
    "pepebored": {
        "code": 60360,
        "name": "pepebored",
        "filename": "60360.png"
    },
    "pepebozosign": {
        "code": 60361,
        "name": "pepebozosign",
        "filename": "60361.png"
    },
    "pepebread": {
        "code": 60362,
        "name": "pepebread",
        "filename": "60362.png"
    },
    "pepebrim": {
        "code": 60363,
        "name": "pepebrim",
        "filename": "60363.png"
    },
    "pepebubz": {
        "code": 60364,
        "name": "pepebubz",
        "filename": "60364.png"
    },
    "pepebubzfaceblush": {
        "code": 60365,
        "name": "pepebubzfaceblush",
        "filename": "60365.png"
    },
    "pepebubzfacejam": {
        "code": 60366,
        "name": "pepebubzfacejam",
        "filename": "60366.png"
    },
    "pepebuffclown": {
        "code": 60367,
        "name": "pepebuffclown",
        "filename": "60367.png"
    },
    "pepebunny": {
        "code": 60368,
        "name": "pepebunny",
        "filename": "60368.png"
    },
    "pepebye": {
        "code": 60369,
        "name": "pepebye",
        "filename": "60369.png"
    },
    "pepecake": {
        "code": 60370,
        "name": "pepecake",
        "filename": "60370.png"
    },
    "pepechamber": {
        "code": 60371,
        "name": "pepechamber",
        "filename": "60371.png"
    },
    "pepecheers": {
        "code": 60372,
        "name": "pepecheers",
        "filename": "60372.png"
    },
    "pepechu": {
        "code": 60373,
        "name": "pepechu",
        "filename": "60373.png"
    },
    "pepecinnamon": {
        "code": 60374,
        "name": "pepecinnamon",
        "filename": "60374.png"
    },
    "pepeclown": {
        "code": 60375,
        "name": "pepeclown",
        "filename": "60375.png"
    },
    "pepecoffee": {
        "code": 60376,
        "name": "pepecoffee",
        "filename": "60376.png"
    },
    "pepecoin": {
        "code": 60377,
        "name": "pepecoin",
        "filename": "60377.png"
    },
    "pepecool": {
        "code": 60378,
        "name": "pepecool",
        "filename": "60378.png"
    },
    "pepecopter": {
        "code": 60379,
        "name": "pepecopter",
        "filename": "60379.png"
    },
    "pepecough": {
        "code": 60380,
        "name": "pepecough",
        "filename": "60380.png"
    },
    "pepecowboy": {
        "code": 60381,
        "name": "pepecowboy",
        "filename": "60381.png"
    },
    "pepecringe": {
        "code": 60382,
        "name": "pepecringe",
        "filename": "60382.png"
    },
    "pepecringe1": {
        "code": 60383,
        "name": "pepecringe1",
        "filename": "60383.png"
    },
    "pepecross": {
        "code": 60384,
        "name": "pepecross",
        "filename": "60384.png"
    },
    "pepecrowded": {
        "code": 60385,
        "name": "pepecrowded",
        "filename": "60385.png"
    },
    "pepecry": {
        "code": 60386,
        "name": "pepecry",
        "filename": "60386.png"
    },
    "pepecryaboutit": {
        "code": 60387,
        "name": "pepecryaboutit",
        "filename": "60387.png"
    },
    "pepecryhands": {
        "code": 60388,
        "name": "pepecryhands",
        "filename": "60388.png"
    },
    "pepecuddle": {
        "code": 60389,
        "name": "pepecuddle",
        "filename": "60389.png"
    },
    "pepecuerda": {
        "code": 60390,
        "name": "pepecuerda",
        "filename": "60390.png"
    },
    "pepecursed": {
        "code": 60391,
        "name": "pepecursed",
        "filename": "60391.png"
    },
    "pepecutescooter": {
        "code": 60392,
        "name": "pepecutescooter",
        "filename": "60392.png"
    },
    "pepedance": {
        "code": 60393,
        "name": "pepedance",
        "filename": "60393.png"
    },
    "pepedance_happy": {
        "code": 60394,
        "name": "pepedance_happy",
        "filename": "60394.png"
    },
    "pepedance_troll": {
        "code": 60395,
        "name": "pepedance_troll",
        "filename": "60395.png"
    },
    "pepedeletedis": {
        "code": 60396,
        "name": "pepedeletedis",
        "filename": "60396.png"
    },
    "pepedevil": {
        "code": 60397,
        "name": "pepedevil",
        "filename": "60397.png"
    },
    "pepedick": {
        "code": 60398,
        "name": "pepedick",
        "filename": "60398.png"
    },
    "pepedisappear_png": {
        "code": 60399,
        "name": "pepedisappear_png",
        "filename": "60399.png"
    },
    "pepedrink": {
        "code": 60400,
        "name": "pepedrink",
        "filename": "60400.png"
    },
    "pepedumb": {
        "code": 60401,
        "name": "pepedumb",
        "filename": "60401.png"
    },
    "pepedunno": {
        "code": 60402,
        "name": "pepedunno",
        "filename": "60402.png"
    },
    "pepeeathaha": {
        "code": 60403,
        "name": "pepeeathaha",
        "filename": "60403.png"
    },
    "pepeenlightenment": {
        "code": 60404,
        "name": "pepeenlightenment",
        "filename": "60404.png"
    },
    "pepeenter": {
        "code": 60405,
        "name": "pepeenter",
        "filename": "60405.png"
    },
    "pepeexit": {
        "code": 60406,
        "name": "pepeexit",
        "filename": "60406.png"
    },
    "pepeeyepoppin": {
        "code": 60407,
        "name": "pepeeyepoppin",
        "filename": "60407.png"
    },
    "pepef": {
        "code": 60408,
        "name": "pepef",
        "filename": "60408.png"
    },
    "pepefacepalm2": {
        "code": 60409,
        "name": "pepefacepalm2",
        "filename": "60409.png"
    },
    "pepefacepalm3": {
        "code": 60410,
        "name": "pepefacepalm3",
        "filename": "60410.png"
    },
    "pepefbi": {
        "code": 60411,
        "name": "pepefbi",
        "filename": "60411.png"
    },
    "pepefeelsgoodman": {
        "code": 60412,
        "name": "pepefeelsgoodman",
        "filename": "60412.png"
    },
    "pepefeelssportsman": {
        "code": 60413,
        "name": "pepefeelssportsman",
        "filename": "60413.png"
    },
    "pepefight": {
        "code": 60414,
        "name": "pepefight",
        "filename": "60414.png"
    },
    "pepefinger": {
        "code": 60415,
        "name": "pepefinger",
        "filename": "60415.png"
    },
    "pepefingergun": {
        "code": 60416,
        "name": "pepefingergun",
        "filename": "60416.png"
    },
    "pepefingerguns": {
        "code": 60417,
        "name": "pepefingerguns",
        "filename": "60417.png"
    },
    "pepeflex": {
        "code": 60418,
        "name": "pepeflex",
        "filename": "60418.png"
    },
    "pepefloat": {
        "code": 60419,
        "name": "pepefloat",
        "filename": "60419.png"
    },
    "pepefuck": {
        "code": 60420,
        "name": "pepefuck",
        "filename": "60420.png"
    },
    "pepefuckoffleave": {
        "code": 60421,
        "name": "pepefuckoffleave",
        "filename": "60421.png"
    },
    "pepefuckyou": {
        "code": 60422,
        "name": "pepefuckyou",
        "filename": "60422.png"
    },
    "pepega_original_style": {
        "code": 60423,
        "name": "pepega_original_style",
        "filename": "60423.png"
    },
    "pepegaaim": {
        "code": 60424,
        "name": "pepegaaim",
        "filename": "60424.png"
    },
    "pepegagun": {
        "code": 60425,
        "name": "pepegagun",
        "filename": "60425.png"
    },
    "pepegasrun": {
        "code": 60426,
        "name": "pepegasrun",
        "filename": "60426.png"
    },
    "pepegay": {
        "code": 60427,
        "name": "pepegay",
        "filename": "60427.png"
    },
    "pepegeorgie": {
        "code": 60428,
        "name": "pepegeorgie",
        "filename": "60428.png"
    },
    "pepeghostface": {
        "code": 60429,
        "name": "pepeghostface",
        "filename": "60429.png"
    },
    "pepegreece": {
        "code": 60430,
        "name": "pepegreece",
        "filename": "60430.png"
    },
    "pepegun": {
        "code": 61425,
        "name": "pepegun",
        "filename": "61425.png"
    },
    "pepegunl": {
        "code": 60432,
        "name": "pepegunl",
        "filename": "60432.png"
    },
    "pepegunr": {
        "code": 60433,
        "name": "pepegunr",
        "filename": "60433.png"
    },
    "pepehabibisign": {
        "code": 60434,
        "name": "pepehabibisign",
        "filename": "60434.png"
    },
    "pepehands": {
        "code": 60435,
        "name": "pepehands",
        "filename": "60435.png"
    },
    "pepehandsdestorted": {
        "code": 60436,
        "name": "pepehandsdestorted",
        "filename": "60436.png"
    },
    "pepehang": {
        "code": 60437,
        "name": "pepehang",
        "filename": "60437.png"
    },
    "pepehappycry": {
        "code": 60438,
        "name": "pepehappycry",
        "filename": "60438.png"
    },
    "pepehappyhands": {
        "code": 60439,
        "name": "pepehappyhands",
        "filename": "60439.png"
    },
    "pepehappyping": {
        "code": 60440,
        "name": "pepehappyping",
        "filename": "60440.png"
    },
    "pepehein": {
        "code": 60441,
        "name": "pepehein",
        "filename": "60441.png"
    },
    "pepehmm": {
        "code": 60442,
        "name": "pepehmm",
        "filename": "60442.png"
    },
    "pepehmmm": {
        "code": 60443,
        "name": "pepehmmm",
        "filename": "60443.png"
    },
    "pepeholy": {
        "code": 60444,
        "name": "pepeholy",
        "filename": "60444.png"
    },
    "pepehug": {
        "code": 60445,
        "name": "pepehug",
        "filename": "60445.png"
    },
    "pepehuhwtf": {
        "code": 60446,
        "name": "pepehuhwtf",
        "filename": "60446.png"
    },
    "pepeindia": {
        "code": 60447,
        "name": "pepeindia",
        "filename": "60447.png"
    },
    "pepeinspect": {
        "code": 60448,
        "name": "pepeinspect",
        "filename": "60448.png"
    },
    "pepejam": {
        "code": 60449,
        "name": "pepejam",
        "filename": "60449.png"
    },
    "pepejamsides": {
        "code": 60450,
        "name": "pepejamsides",
        "filename": "60450.png"
    },
    "pepejeer": {
        "code": 60451,
        "name": "pepejeer",
        "filename": "60451.png"
    },
    "pepejett": {
        "code": 60452,
        "name": "pepejett",
        "filename": "60452.png"
    },
    "pepejuicespin": {
        "code": 60453,
        "name": "pepejuicespin",
        "filename": "60453.png"
    },
    "pepekek": {
        "code": 60454,
        "name": "pepekek",
        "filename": "60454.png"
    },
    "pepekeke": {
        "code": 60455,
        "name": "pepekeke",
        "filename": "60455.png"
    },
    "pepekekw": {
        "code": 60456,
        "name": "pepekekw",
        "filename": "60456.png"
    },
    "pepekimcool": {
        "code": 60457,
        "name": "pepekimcool",
        "filename": "60457.png"
    },
    "pepekimcozy": {
        "code": 60458,
        "name": "pepekimcozy",
        "filename": "60458.png"
    },
    "pepekimdetective": {
        "code": 60459,
        "name": "pepekimdetective",
        "filename": "60459.png"
    },
    "pepekimlove": {
        "code": 60460,
        "name": "pepekimlove",
        "filename": "60460.png"
    },
    "pepekimlovecry": {
        "code": 60461,
        "name": "pepekimlovecry",
        "filename": "60461.png"
    },
    "pepekimshock": {
        "code": 60462,
        "name": "pepekimshock",
        "filename": "60462.png"
    },
    "pepekimyay": {
        "code": 60463,
        "name": "pepekimyay",
        "filename": "60463.png"
    },
    "pepeking": {
        "code": 60464,
        "name": "pepeking",
        "filename": "60464.png"
    },
    "pepeknife": {
        "code": 60465,
        "name": "pepeknife",
        "filename": "60465.png"
    },
    "pepeknifed": {
        "code": 60466,
        "name": "pepeknifed",
        "filename": "60466.png"
    },
    "pepekraken": {
        "code": 60467,
        "name": "pepekraken",
        "filename": "60467.png"
    },
    "pepelachen": {
        "code": 60468,
        "name": "pepelachen",
        "filename": "60468.png"
    },
    "pepelaf": {
        "code": 60469,
        "name": "pepelaf",
        "filename": "60469.png"
    },
    "pepelaptop": {
        "code": 60470,
        "name": "pepelaptop",
        "filename": "60470.png"
    },
    "pepeleave": {
        "code": 60471,
        "name": "pepeleave",
        "filename": "60471.png"
    },
    "pepelick": {
        "code": 60472,
        "name": "pepelick",
        "filename": "60472.png"
    },
    "pepelmao": {
        "code": 60473,
        "name": "pepelmao",
        "filename": "60473.png"
    },
    "pepelmfao": {
        "code": 60474,
        "name": "pepelmfao",
        "filename": "60474.png"
    },
    "pepelook": {
        "code": 60475,
        "name": "pepelook",
        "filename": "60475.png"
    },
    "pepelookingyou": {
        "code": 60476,
        "name": "pepelookingyou",
        "filename": "60476.png"
    },
    "pepeloveleaf": {
        "code": 60477,
        "name": "pepeloveleaf",
        "filename": "60477.png"
    },
    "pepelovepat": {
        "code": 60478,
        "name": "pepelovepat",
        "filename": "60478.png"
    },
    "pepemaybe": {
        "code": 60479,
        "name": "pepemaybe",
        "filename": "60479.png"
    },
    "pepemiddlefingers": {
        "code": 60480,
        "name": "pepemiddlefingers",
        "filename": "60480.png"
    },
    "pepemods": {
        "code": 60481,
        "name": "pepemods",
        "filename": "60481.png"
    },
    "pepemoin": {
        "code": 60482,
        "name": "pepemoin",
        "filename": "60482.png"
    },
    "pepemonk": {
        "code": 60483,
        "name": "pepemonk",
        "filename": "60483.png"
    },
    "pepemugshot": {
        "code": 60484,
        "name": "pepemugshot",
        "filename": "60484.png"
    },
    "pepenarutorun": {
        "code": 60485,
        "name": "pepenarutorun",
        "filename": "60485.png"
    },
    "pepenervoussweat": {
        "code": 60486,
        "name": "pepenervoussweat",
        "filename": "60486.png"
    },
    "pepeno": {
        "code": 60487,
        "name": "pepeno",
        "filename": "60487.png"
    },
    "pepenod": {
        "code": 60488,
        "name": "pepenod",
        "filename": "60488.png"
    },
    "pepenosign": {
        "code": 60489,
        "name": "pepenosign",
        "filename": "60489.png"
    },
    "pepenoted": {
        "code": 60490,
        "name": "pepenoted",
        "filename": "60490.png"
    },
    "pepenotes": {
        "code": 60491,
        "name": "pepenotes",
        "filename": "60491.png"
    },
    "pepenou": {
        "code": 60492,
        "name": "pepenou",
        "filename": "60492.png"
    },
    "pepeo_fuk_u": {
        "code": 60493,
        "name": "pepeo_fuk_u",
        "filename": "60493.png"
    },
    "pepeohshit": {
        "code": 60494,
        "name": "pepeohshit",
        "filename": "60494.png"
    },
    "pepeold": {
        "code": 60495,
        "name": "pepeold",
        "filename": "60495.png"
    },
    "pepeomen": {
        "code": 60496,
        "name": "pepeomen",
        "filename": "60496.png"
    },
    "pepeondrugs": {
        "code": 60497,
        "name": "pepeondrugs",
        "filename": "60497.png"
    },
    "pepeoverthink": {
        "code": 60498,
        "name": "pepeoverthink",
        "filename": "60498.png"
    },
    "pepeowo": {
        "code": 60499,
        "name": "pepeowo",
        "filename": "60499.png"
    },
    "pepepeasant": {
        "code": 60500,
        "name": "pepepeasant",
        "filename": "60500.png"
    },
    "pepepee": {
        "code": 60501,
        "name": "pepepee",
        "filename": "60501.png"
    },
    "pepepeek": {
        "code": 60502,
        "name": "pepepeek",
        "filename": "60502.png"
    },
    "pepeperry": {
        "code": 60503,
        "name": "pepeperry",
        "filename": "60503.png"
    },
    "pepephoenix": {
        "code": 60504,
        "name": "pepephoenix",
        "filename": "60504.png"
    },
    "pepepig": {
        "code": 60505,
        "name": "pepepig",
        "filename": "60505.png"
    },
    "pepepika": {
        "code": 60506,
        "name": "pepepika",
        "filename": "60506.png"
    },
    "pepepleased": {
        "code": 60507,
        "name": "pepepleased",
        "filename": "60507.png"
    },
    "pepepog": {
        "code": 60508,
        "name": "pepepog",
        "filename": "60508.png"
    },
    "pepepoggerditto": {
        "code": 60509,
        "name": "pepepoggerditto",
        "filename": "60509.png"
    },
    "pepepoggerschains": {
        "code": 60510,
        "name": "pepepoggerschains",
        "filename": "60510.png"
    },
    "pepepolicedog": {
        "code": 60511,
        "name": "pepepolicedog",
        "filename": "60511.png"
    },
    "pepepoop": {
        "code": 60512,
        "name": "pepepoop",
        "filename": "60512.png"
    },
    "pepepopcorn": {
        "code": 60513,
        "name": "pepepopcorn",
        "filename": "60513.png"
    },
    "pepepopsicle": {
        "code": 60514,
        "name": "pepepopsicle",
        "filename": "60514.png"
    },
    "pepepray": {
        "code": 60515,
        "name": "pepepray",
        "filename": "60515.png"
    },
    "pepepridesing": {
        "code": 60516,
        "name": "pepepridesing",
        "filename": "60516.png"
    },
    "pepeprison": {
        "code": 60517,
        "name": "pepeprison",
        "filename": "60517.png"
    },
    "pepepumpkin": {
        "code": 60518,
        "name": "pepepumpkin",
        "filename": "60518.png"
    },
    "pepepunch": {
        "code": 60519,
        "name": "pepepunch",
        "filename": "60519.png"
    },
    "peperazzi": {
        "code": 60520,
        "name": "peperazzi",
        "filename": "60520.png"
    },
    "peperee": {
        "code": 60521,
        "name": "peperee",
        "filename": "60521.png"
    },
    "peperickroll": {
        "code": 60522,
        "name": "peperickroll",
        "filename": "60522.png"
    },
    "peperocketleague": {
        "code": 60523,
        "name": "peperocketleague",
        "filename": "60523.png"
    },
    "peperuncry": {
        "code": 60524,
        "name": "peperuncry",
        "filename": "60524.png"
    },
    "pepes": {
        "code": 60525,
        "name": "pepes",
        "filename": "60525.png"
    },
    "pepes_on_bed": {
        "code": 60526,
        "name": "pepes_on_bed",
        "filename": "60526.png"
    },
    "pepes_x": {
        "code": 60527,
        "name": "pepes_x",
        "filename": "60527.png"
    },
    "pepesad": {
        "code": 60528,
        "name": "pepesad",
        "filename": "60528.png"
    },
    "pepesadcry": {
        "code": 60529,
        "name": "pepesadcry",
        "filename": "60529.png"
    },
    "pepesaddrawing": {
        "code": 60530,
        "name": "pepesaddrawing",
        "filename": "60530.png"
    },
    "pepesadge": {
        "code": 60531,
        "name": "pepesadge",
        "filename": "60531.png"
    },
    "pepesadjam": {
        "code": 60532,
        "name": "pepesadjam",
        "filename": "60532.png"
    },
    "pepesadpet": {
        "code": 60533,
        "name": "pepesadpet",
        "filename": "60533.png"
    },
    "pepesadrain": {
        "code": 60534,
        "name": "pepesadrain",
        "filename": "60534.png"
    },
    "pepesage": {
        "code": 60535,
        "name": "pepesage",
        "filename": "60535.png"
    },
    "pepescream": {
        "code": 60536,
        "name": "pepescream",
        "filename": "60536.png"
    },
    "pepesharingan": {
        "code": 60537,
        "name": "pepesharingan",
        "filename": "60537.png"
    },
    "pepesimpsign": {
        "code": 60538,
        "name": "pepesimpsign",
        "filename": "60538.png"
    },
    "pepesip": {
        "code": 60539,
        "name": "pepesip",
        "filename": "60539.png"
    },
    "pepesleep": {
        "code": 60540,
        "name": "pepesleep",
        "filename": "60540.png"
    },
    "pepesmd": {
        "code": 60541,
        "name": "pepesmd",
        "filename": "60541.png"
    },
    "pepesmexy": {
        "code": 60542,
        "name": "pepesmexy",
        "filename": "60542.png"
    },
    "pepesmile": {
        "code": 60543,
        "name": "pepesmile",
        "filename": "60543.png"
    },
    "pepesmoke": {
        "code": 60544,
        "name": "pepesmoke",
        "filename": "60544.png"
    },
    "pepesmoke2": {
        "code": 60545,
        "name": "pepesmoke2",
        "filename": "60545.png"
    },
    "pepesmug": {
        "code": 60546,
        "name": "pepesmug",
        "filename": "60546.png"
    },
    "pepesneakyevil": {
        "code": 60547,
        "name": "pepesneakyevil",
        "filename": "60547.png"
    },
    "pepesob": {
        "code": 60548,
        "name": "pepesob",
        "filename": "60548.png"
    },
    "pepesoldier": {
        "code": 60549,
        "name": "pepesoldier",
        "filename": "60549.png"
    },
    "pepesorry": {
        "code": 60550,
        "name": "pepesorry",
        "filename": "60550.png"
    },
    "pepesova": {
        "code": 60551,
        "name": "pepesova",
        "filename": "60551.png"
    },
    "pepespeechless": {
        "code": 60552,
        "name": "pepespeechless",
        "filename": "60552.png"
    },
    "pepespit": {
        "code": 60553,
        "name": "pepespit",
        "filename": "60553.png"
    },
    "pepestalk": {
        "code": 60554,
        "name": "pepestalk",
        "filename": "60554.png"
    },
    "pepestream": {
        "code": 60555,
        "name": "pepestream",
        "filename": "60555.png"
    },
    "pepesus": {
        "code": 60556,
        "name": "pepesus",
        "filename": "60556.png"
    },
    "pepesuspicious": {
        "code": 60557,
        "name": "pepesuspicious",
        "filename": "60557.png"
    },
    "pepesusthink": {
        "code": 60558,
        "name": "pepesusthink",
        "filename": "60558.png"
    },
    "pepeswag": {
        "code": 60559,
        "name": "pepeswag",
        "filename": "60559.png"
    },
    "pepetakethel": {
        "code": 60560,
        "name": "pepetakethel",
        "filename": "60560.png"
    },
    "pepetearsofjoy": {
        "code": 60561,
        "name": "pepetearsofjoy",
        "filename": "60561.png"
    },
    "pepetequiero": {
        "code": 60562,
        "name": "pepetequiero",
        "filename": "60562.png"
    },
    "pepethetoad": {
        "code": 60563,
        "name": "pepethetoad",
        "filename": "60563.png"
    },
    "pepethink": {
        "code": 61429,
        "name": "pepethink",
        "filename": "61429.png"
    },
    "pepethumbsup": {
        "code": 60565,
        "name": "pepethumbsup",
        "filename": "60565.png"
    },
    "pepetler": {
        "code": 60566,
        "name": "pepetler",
        "filename": "60566.png"
    },
    "pepetoiletpaper": {
        "code": 60567,
        "name": "pepetoiletpaper",
        "filename": "60567.png"
    },
    "pepetriggered": {
        "code": 60568,
        "name": "pepetriggered",
        "filename": "60568.png"
    },
    "pepeukraine": {
        "code": 60569,
        "name": "pepeukraine",
        "filename": "60569.png"
    },
    "pepeumm": {
        "code": 60570,
        "name": "pepeumm",
        "filename": "60570.png"
    },
    "pepeupset": {
        "code": 60571,
        "name": "pepeupset",
        "filename": "60571.png"
    },
    "pepeviper": {
        "code": 60572,
        "name": "pepeviper",
        "filename": "60572.png"
    },
    "pepewave": {
        "code": 60573,
        "name": "pepewave",
        "filename": "60573.png"
    },
    "pepewhale": {
        "code": 60574,
        "name": "pepewhale",
        "filename": "60574.png"
    },
    "pepewhiteclothes": {
        "code": 60575,
        "name": "pepewhiteclothes",
        "filename": "60575.png"
    },
    "pepewideawake": {
        "code": 60576,
        "name": "pepewideawake",
        "filename": "60576.png"
    },
    "pepewine": {
        "code": 60577,
        "name": "pepewine",
        "filename": "60577.png"
    },
    "pepewobble": {
        "code": 60578,
        "name": "pepewobble",
        "filename": "60578.png"
    },
    "pepewut": {
        "code": 60579,
        "name": "pepewut",
        "filename": "60579.png"
    },
    "pepexxx": {
        "code": 60580,
        "name": "pepexxx",
        "filename": "60580.png"
    },
    "pepeyessign": {
        "code": 60581,
        "name": "pepeyessign",
        "filename": "60581.png"
    },
    "pepeyoru": {
        "code": 60582,
        "name": "pepeyoru",
        "filename": "60582.png"
    },
    "pepezoom": {
        "code": 60583,
        "name": "pepezoom",
        "filename": "60583.png"
    },
    "pepgun": {
        "code": 60584,
        "name": "pepgun",
        "filename": "60584.png"
    },
    "peplease": {
        "code": 60585,
        "name": "peplease",
        "filename": "60585.png"
    },
    "pepowtdrink": {
        "code": 60586,
        "name": "pepowtdrink",
        "filename": "60586.png"
    },
    "pepo_sweg": {
        "code": 60587,
        "name": "pepo_sweg",
        "filename": "60587.png"
    },
    "pepoflex_wide1": {
        "code": 60588,
        "name": "pepoflex_wide1",
        "filename": "60588.png"
    },
    "pepoflex_wide2": {
        "code": 60589,
        "name": "pepoflex_wide2",
        "filename": "60589.png"
    },
    "pepoflex_wide3": {
        "code": 60590,
        "name": "pepoflex_wide3",
        "filename": "60590.png"
    },
    "pepsi_pepe": {
        "code": 60591,
        "name": "pepsi_pepe",
        "filename": "60591.png"
    },
    "perfect_pepe": {
        "code": 60592,
        "name": "perfect_pepe",
        "filename": "60592.png"
    },
    "pes_joy1": {
        "code": 60593,
        "name": "pes_joy1",
        "filename": "60593.png"
    },
    "pet_dank_memer": {
        "code": 60594,
        "name": "pet_dank_memer",
        "filename": "60594.png"
    },
    "pet_emojigg": {
        "code": 60595,
        "name": "pet_emojigg",
        "filename": "60595.png"
    },
    "pink_calculator": {
        "code": 60596,
        "name": "pink_calculator",
        "filename": "60596.png"
    },
    "piratepeped": {
        "code": 60597,
        "name": "piratepeped",
        "filename": "60597.png"
    },
    "pmj": {
        "code": 60598,
        "name": "pmj",
        "filename": "60598.png"
    },
    "pogchampoo": {
        "code": 60599,
        "name": "pogchampoo",
        "filename": "60599.png"
    },
    "pogslide": {
        "code": 60600,
        "name": "pogslide",
        "filename": "60600.png"
    },
    "poo_poo_head": {
        "code": 60601,
        "name": "poo_poo_head",
        "filename": "60601.png"
    },
    "poopemoji": {
        "code": 60602,
        "name": "poopemoji",
        "filename": "60602.png"
    },
    "popcornpeped": {
        "code": 60603,
        "name": "popcornpeped",
        "filename": "60603.png"
    },
    "ppoverheat": {
        "code": 60604,
        "name": "ppoverheat",
        "filename": "60604.png"
    },
    "radovan_je_nejlepsi": {
        "code": 60605,
        "name": "radovan_je_nejlepsi",
        "filename": "60605.png"
    },
    "rainbow_pepe": {
        "code": 60606,
        "name": "rainbow_pepe",
        "filename": "60606.png"
    },
    "rainbow_pepe_2": {
        "code": 60607,
        "name": "rainbow_pepe_2",
        "filename": "60607.png"
    },
    "rainbow_wtf": {
        "code": 60608,
        "name": "rainbow_wtf",
        "filename": "60608.png"
    },
    "ratpeped": {
        "code": 60609,
        "name": "ratpeped",
        "filename": "60609.png"
    },
    "reademote": {
        "code": 60610,
        "name": "reademote",
        "filename": "60610.png"
    },
    "redcard": {
        "code": 60611,
        "name": "redcard",
        "filename": "60611.png"
    },
    "revivedge": {
        "code": 60612,
        "name": "revivedge",
        "filename": "60612.png"
    },
    "riotpeped": {
        "code": 60613,
        "name": "riotpeped",
        "filename": "60613.png"
    },
    "robotpeped": {
        "code": 60614,
        "name": "robotpeped",
        "filename": "60614.png"
    },
    "rolling_meme_frog": {
        "code": 60615,
        "name": "rolling_meme_frog",
        "filename": "60615.png"
    },
    "rollpeped": {
        "code": 60616,
        "name": "rollpeped",
        "filename": "60616.png"
    },
    "rulenumberoneifitsaboutmeatmeso": {
        "code": 60617,
        "name": "rulenumberoneifitsaboutmeatmeso",
        "filename": "60617.png"
    },
    "runpepega": {
        "code": 60618,
        "name": "runpepega",
        "filename": "60618.png"
    },
    "sad_8kpepe": {
        "code": 60619,
        "name": "sad_8kpepe",
        "filename": "60619.png"
    },
    "sad_pepe": {
        "code": 60620,
        "name": "sad_pepe",
        "filename": "60620.png"
    },
    "sad_pepe_amongus": {
        "code": 60621,
        "name": "sad_pepe_amongus",
        "filename": "60621.png"
    },
    "sad_pepe_cat": {
        "code": 60622,
        "name": "sad_pepe_cat",
        "filename": "60622.png"
    },
    "sad_yep": {
        "code": 60623,
        "name": "sad_yep",
        "filename": "60623.png"
    },
    "sadge": {
        "code": 61466,
        "name": "sadge",
        "filename": "61466.png"
    },
    "sadge_pray": {
        "code": 60625,
        "name": "sadge_pray",
        "filename": "60625.png"
    },
    "sadgeegg": {
        "code": 60626,
        "name": "sadgeegg",
        "filename": "60626.png"
    },
    "sadke": {
        "code": 60627,
        "name": "sadke",
        "filename": "60627.png"
    },
    "sadpepe": {
        "code": 60628,
        "name": "sadpepe",
        "filename": "60628.png"
    },
    "sadpepecrypet": {
        "code": 60629,
        "name": "sadpepecrypet",
        "filename": "60629.png"
    },
    "santapepebubzface": {
        "code": 60630,
        "name": "santapepebubzface",
        "filename": "60630.png"
    },
    "satan_pepe": {
        "code": 60631,
        "name": "satan_pepe",
        "filename": "60631.png"
    },
    "sheeshers": {
        "code": 60632,
        "name": "sheeshers",
        "filename": "60632.png"
    },
    "shhh": {
        "code": 60633,
        "name": "shhh",
        "filename": "60633.png"
    },
    "shrug": {
        "code": 61482,
        "name": "shrug",
        "filename": "61482.png"
    },
    "shut": {
        "code": 60635,
        "name": "shut",
        "filename": "60635.png"
    },
    "sisge": {
        "code": 60636,
        "name": "sisge",
        "filename": "60636.png"
    },
    "skatepeped": {
        "code": 60637,
        "name": "skatepeped",
        "filename": "60637.png"
    },
    "sleepge": {
        "code": 60638,
        "name": "sleepge",
        "filename": "60638.png"
    },
    "smoge": {
        "code": 60639,
        "name": "smoge",
        "filename": "60639.png"
    },
    "smug": {
        "code": 60640,
        "name": "smug",
        "filename": "60640.png"
    },
    "sombreopeped": {
        "code": 60641,
        "name": "sombreopeped",
        "filename": "60641.png"
    },
    "spinninghonker": {
        "code": 60642,
        "name": "spinninghonker",
        "filename": "60642.png"
    },
    "spongebob_broken": {
        "code": 60643,
        "name": "spongebob_broken",
        "filename": "60643.png"
    },
    "squid_pepe": {
        "code": 60644,
        "name": "squid_pepe",
        "filename": "60644.png"
    },
    "stalin_pepe": {
        "code": 60645,
        "name": "stalin_pepe",
        "filename": "60645.png"
    },
    "starege": {
        "code": 60646,
        "name": "starege",
        "filename": "60646.png"
    },
    "sukuna_pepe_kek": {
        "code": 60647,
        "name": "sukuna_pepe_kek",
        "filename": "60647.png"
    },
    "susge": {
        "code": 60648,
        "name": "susge",
        "filename": "60648.png"
    },
    "swordfish": {
        "code": 60649,
        "name": "swordfish",
        "filename": "60649.png"
    },
    "thanos_cheeks": {
        "code": 60650,
        "name": "thanos_cheeks",
        "filename": "60650.png"
    },
    "the_rock_rap_pepe": {
        "code": 60651,
        "name": "the_rock_rap_pepe",
        "filename": "60651.png"
    },
    "the_weeknd_pepe": {
        "code": 60652,
        "name": "the_weeknd_pepe",
        "filename": "60652.png"
    },
    "this": {
        "code": 61505,
        "name": "this",
        "filename": "61505.png"
    },
    "thumbsup": {
        "code": 60654,
        "name": "thumbsup",
        "filename": "60654.png"
    },
    "tiredge": {
        "code": 60655,
        "name": "tiredge",
        "filename": "60655.png"
    },
    "toadgirl_huh": {
        "code": 60656,
        "name": "toadgirl_huh",
        "filename": "60656.png"
    },
    "trippepe": {
        "code": 60657,
        "name": "trippepe",
        "filename": "60657.png"
    },
    "twerkingpepe": {
        "code": 60658,
        "name": "twerkingpepe",
        "filename": "60658.png"
    },
    "typing_bean": {
        "code": 60659,
        "name": "typing_bean",
        "filename": "60659.png"
    },
    "typingpeped": {
        "code": 60660,
        "name": "typingpeped",
        "filename": "60660.png"
    },
    "ukrainepeeposmiling": {
        "code": 60661,
        "name": "ukrainepeeposmiling",
        "filename": "60661.png"
    },
    "urcute": {
        "code": 60662,
        "name": "urcute",
        "filename": "60662.png"
    },
    "vibepepe": {
        "code": 60663,
        "name": "vibepepe",
        "filename": "60663.png"
    },
    "violenpepe": {
        "code": 60664,
        "name": "violenpepe",
        "filename": "60664.png"
    },
    "wankge": {
        "code": 60665,
        "name": "wankge",
        "filename": "60665.png"
    },
    "washingmachinepepebubz": {
        "code": 60666,
        "name": "washingmachinepepebubz",
        "filename": "60666.png"
    },
    "whiteflagpeped": {
        "code": 60667,
        "name": "whiteflagpeped",
        "filename": "60667.png"
    },
    "why_do_you_gay": {
        "code": 60668,
        "name": "why_do_you_gay",
        "filename": "60668.png"
    },
    "wicked_leave": {
        "code": 60669,
        "name": "wicked_leave",
        "filename": "60669.png"
    },
    "widepeepoglad1": {
        "code": 60670,
        "name": "widepeepoglad1",
        "filename": "60670.png"
    },
    "widepeepoglad2": {
        "code": 60671,
        "name": "widepeepoglad2",
        "filename": "60671.png"
    },
    "wokegeshot": {
        "code": 60672,
        "name": "wokegeshot",
        "filename": "60672.png"
    },
    "worry_hidden_technical": {
        "code": 60673,
        "name": "worry_hidden_technical",
        "filename": "60673.png"
    },
    "worry_smoking_vape": {
        "code": 60674,
        "name": "worry_smoking_vape",
        "filename": "60674.png"
    },
    "wrary_or_logo": {
        "code": 60675,
        "name": "wrary_or_logo",
        "filename": "60675.png"
    },
    "wtf": {
        "code": 60676,
        "name": "wtf",
        "filename": "60676.png"
    },
    "x_pepe_jet": {
        "code": 60677,
        "name": "x_pepe_jet",
        "filename": "60677.png"
    },
    "xmas_bauble": {
        "code": 60678,
        "name": "xmas_bauble",
        "filename": "60678.png"
    },
    "xmas_flute": {
        "code": 60679,
        "name": "xmas_flute",
        "filename": "60679.png"
    },
    "xmas_hacker": {
        "code": 60680,
        "name": "xmas_hacker",
        "filename": "60680.png"
    },
    "yeauhuhok": {
        "code": 60681,
        "name": "yeauhuhok",
        "filename": "60681.png"
    },
    "yellowhappypepe": {
        "code": 60682,
        "name": "yellowhappypepe",
        "filename": "60682.png"
    },
    "yep": {
        "code": 60683,
        "name": "yep",
        "filename": "60683.png"
    },
    "yessir": {
        "code": 60684,
        "name": "yessir",
        "filename": "60684.png"
    },
    "yo_pepe": {
        "code": 60685,
        "name": "yo_pepe",
        "filename": "60685.png"
    },
    "youarespecial": {
        "code": 60686,
        "name": "youarespecial",
        "filename": "60686.png"
    },
    "01motion": {
        "code": 60928,
        "name": "01motion",
        "filename": "60928.png"
    },
    "02microbe": {
        "code": 60929,
        "name": "02microbe",
        "filename": "60929.png"
    },
    "03electro": {
        "code": 60930,
        "name": "03electro",
        "filename": "60930.png"
    },
    "04science": {
        "code": 60931,
        "name": "04science",
        "filename": "60931.png"
    },
    "05oddity": {
        "code": 60932,
        "name": "05oddity",
        "filename": "60932.png"
    },
    "06futuristic": {
        "code": 60933,
        "name": "06futuristic",
        "filename": "60933.png"
    },
    "08chaos": {
        "code": 60934,
        "name": "08chaos",
        "filename": "60934.png"
    },
    "09gold": {
        "code": 60935,
        "name": "09gold",
        "filename": "60935.png"
    },
    "10mage": {
        "code": 60937,
        "name": "10mage",
        "filename": "60937.png"
    },
    "11slime": {
        "code": 60938,
        "name": "11slime",
        "filename": "60938.png"
    },
    "11x11": {
        "code": 60939,
        "name": "11x11",
        "filename": "60939.png"
    },
    "12abomination": {
        "code": 60940,
        "name": "12abomination",
        "filename": "60940.png"
    },
    "13western": {
        "code": 60942,
        "name": "13western",
        "filename": "60942.png"
    },
    "14robotic": {
        "code": 60943,
        "name": "14robotic",
        "filename": "60943.png"
    },
    "15abyssal": {
        "code": 60944,
        "name": "15abyssal",
        "filename": "60944.png"
    },
    "16pixel": {
        "code": 60945,
        "name": "16pixel",
        "filename": "60945.png"
    },
    "17trash": {
        "code": 60946,
        "name": "17trash",
        "filename": "60946.png"
    },
    "18void": {
        "code": 60947,
        "name": "18void",
        "filename": "60947.png"
    },
    "19figment": {
        "code": 60948,
        "name": "19figment",
        "filename": "60948.png"
    },
    "1stanniversarybadge": {
        "code": 60949,
        "name": "1stanniversarybadge",
        "filename": "60949.png"
    },
    "20toy": {
        "code": 60950,
        "name": "20toy",
        "filename": "60950.png"
    },
    "21spirit": {
        "code": 60951,
        "name": "21spirit",
        "filename": "60951.png"
    },
    "22chrome": {
        "code": 60952,
        "name": "22chrome",
        "filename": "60952.png"
    },
    "22x22": {
        "code": 60953,
        "name": "22x22",
        "filename": "60953.png"
    },
    "23chiptune": {
        "code": 60954,
        "name": "23chiptune",
        "filename": "60954.png"
    },
    "24lumin": {
        "code": 60955,
        "name": "24lumin",
        "filename": "60955.png"
    },
    "25lunar": {
        "code": 60956,
        "name": "25lunar",
        "filename": "60956.png"
    },
    "26gem": {
        "code": 60957,
        "name": "26gem",
        "filename": "60957.png"
    },
    "27crawly": {
        "code": 60958,
        "name": "27crawly",
        "filename": "60958.png"
    },
    "28halloween": {
        "code": 60959,
        "name": "28halloween",
        "filename": "60959.png"
    },
    "29christmas": {
        "code": 60960,
        "name": "29christmas",
        "filename": "60960.png"
    },
    "2koolsudowoodo": {
        "code": 60961,
        "name": "2koolsudowoodo",
        "filename": "60961.png"
    },
    "30valentines": {
        "code": 60962,
        "name": "30valentines",
        "filename": "60962.png"
    },
    "31easter": {
        "code": 60963,
        "name": "31easter",
        "filename": "60963.png"
    },
    "32summer": {
        "code": 60964,
        "name": "32summer",
        "filename": "60964.png"
    },
    "33x33": {
        "code": 60965,
        "name": "33x33",
        "filename": "60965.png"
    },
    "44x44": {
        "code": 60966,
        "name": "44x44",
        "filename": "60966.png"
    },
    "55x55": {
        "code": 60968,
        "name": "55x55",
        "filename": "60968.png"
    },
    "5743beedotpng": {
        "code": 60969,
        "name": "5743beedotpng",
        "filename": "60969.png"
    },
    "5_screens": {
        "code": 60970,
        "name": "5_screens",
        "filename": "60970.png"
    },
    "6112supahot": {
        "code": 60971,
        "name": "6112supahot",
        "filename": "60971.png"
    },
    "6205pepesad": {
        "code": 60972,
        "name": "6205pepesad",
        "filename": "60972.png"
    },
    "9thhamsterflag": {
        "code": 60973,
        "name": "9thhamsterflag",
        "filename": "60973.png"
    },
    "ahaha_no": {
        "code": 60974,
        "name": "ahaha_no",
        "filename": "60974.png"
    },
    "ayaya": {
        "code": 60975,
        "name": "ayaya",
        "filename": "60975.png"
    },
    "adminping": {
        "code": 60976,
        "name": "adminping",
        "filename": "60976.png"
    },
    "animegirlgat": {
        "code": 60977,
        "name": "animegirlgat",
        "filename": "60977.png"
    },
    "attackshiny": {
        "code": 60978,
        "name": "attackshiny",
        "filename": "60978.png"
    },
    "aurora": {
        "code": 60979,
        "name": "aurora",
        "filename": "60979.png"
    },
    "btc": {
        "code": 60980,
        "name": "btc",
        "filename": "60980.png"
    },
    "barrier": {
        "code": 60981,
        "name": "barrier",
        "filename": "60981.png"
    },
    "blitzleshiny": {
        "code": 60982,
        "name": "blitzleshiny",
        "filename": "60982.png"
    },
    "blockhound": {
        "code": 60983,
        "name": "blockhound",
        "filename": "60983.png"
    },
    "bulbagat": {
        "code": 60984,
        "name": "bulbagat",
        "filename": "60984.png"
    },
    "bulbashiny": {
        "code": 60985,
        "name": "bulbashiny",
        "filename": "60985.png"
    },
    "bulbatwins": {
        "code": 60986,
        "name": "bulbatwins",
        "filename": "60986.png"
    },
    "bulletugh": {
        "code": 60987,
        "name": "bulletugh",
        "filename": "60987.png"
    },
    "ca": {
        "code": 60988,
        "name": "ca",
        "filename": "60988.png"
    },
    "cacneashiny": {
        "code": 60989,
        "name": "cacneashiny",
        "filename": "60989.png"
    },
    "catnap": {
        "code": 60990,
        "name": "catnap",
        "filename": "60990.png"
    },
    "challenging_smite": {
        "code": 60991,
        "name": "challenging_smite",
        "filename": "60991.png"
    },
    "chilling_smite": {
        "code": 60992,
        "name": "chilling_smite",
        "filename": "60992.png"
    },
    "clarity": {
        "code": 60993,
        "name": "clarity",
        "filename": "60993.png"
    },
    "cleanse": {
        "code": 60994,
        "name": "cleanse",
        "filename": "60994.png"
    },
    "cock": {
        "code": 60995,
        "name": "cock",
        "filename": "60995.png"
    },
    "criedaboutit": {
        "code": 60996,
        "name": "criedaboutit",
        "filename": "60996.png"
    },
    "croagunkshiny": {
        "code": 60997,
        "name": "croagunkshiny",
        "filename": "60997.png"
    },
    "crux": {
        "code": 60998,
        "name": "crux",
        "filename": "60998.png"
    },
    "cthulu": {
        "code": 60999,
        "name": "cthulu",
        "filename": "60999.png"
    },
    "d_": {
        "code": 61000,
        "name": "d_",
        "filename": "61000.png"
    },
    "dash": {
        "code": 61001,
        "name": "dash",
        "filename": "61001.png"
    },
    "defenseshiny2": {
        "code": 61002,
        "name": "defenseshiny2",
        "filename": "61002.png"
    },
    "deoxysshiny": {
        "code": 61003,
        "name": "deoxysshiny",
        "filename": "61003.png"
    },
    "developerbadge": {
        "code": 61004,
        "name": "developerbadge",
        "filename": "61004.png"
    },
    "donpepe": {
        "code": 61005,
        "name": "donpepe",
        "filename": "61005.png"
    },
    "eth": {
        "code": 61006,
        "name": "eth",
        "filename": "61006.png"
    },
    "ez": {
        "code": 61007,
        "name": "ez",
        "filename": "61007.png"
    },
    "e_": {
        "code": 61008,
        "name": "e_",
        "filename": "61008.png"
    },
    "empowered_recall": {
        "code": 61009,
        "name": "empowered_recall",
        "filename": "61009.png"
    },
    "exhaust": {
        "code": 61010,
        "name": "exhaust",
        "filename": "61010.png"
    },
    "facepaw": {
        "code": 61011,
        "name": "facepaw",
        "filename": "61011.png"
    },
    "fearful": {
        "code": 61012,
        "name": "fearful",
        "filename": "61012.png"
    },
    "feelstensebutsmiling": {
        "code": 61013,
        "name": "feelstensebutsmiling",
        "filename": "61013.png"
    },
    "flash": {
        "code": 61014,
        "name": "flash",
        "filename": "61014.png"
    },
    "flygonshiny": {
        "code": 61015,
        "name": "flygonshiny",
        "filename": "61015.png"
    },
    "forgedcore8": {
        "code": 61016,
        "name": "forgedcore8",
        "filename": "61016.png"
    },
    "frickoff": {
        "code": 61017,
        "name": "frickoff",
        "filename": "61017.png"
    },
    "garchompshiny": {
        "code": 61018,
        "name": "garchompshiny",
        "filename": "61018.png"
    },
    "ghost": {
        "code": 61019,
        "name": "ghost",
        "filename": "61019.png"
    },
    "giratinashiny": {
        "code": 61020,
        "name": "giratinashiny",
        "filename": "61020.png"
    },
    "giresrbottled": {
        "code": 61021,
        "name": "giresrbottled",
        "filename": "61021.png"
    },
    "goodmorning": {
        "code": 61022,
        "name": "goodmorning",
        "filename": "61022.png"
    },
    "goodnight": {
        "code": 61023,
        "name": "goodnight",
        "filename": "61023.png"
    },
    "grovyleshiny": {
        "code": 61024,
        "name": "grovyleshiny",
        "filename": "61024.png"
    },
    "hypers": {
        "code": 61025,
        "name": "hypers",
        "filename": "61025.png"
    },
    "hz_shrug": {
        "code": 61026,
        "name": "hz_shrug",
        "filename": "61026.png"
    },
    "happ": {
        "code": 61027,
        "name": "happ",
        "filename": "61027.png"
    },
    "happyshinx": {
        "code": 61028,
        "name": "happyshinx",
        "filename": "61028.png"
    },
    "harold": {
        "code": 61029,
        "name": "harold",
        "filename": "61029.png"
    },
    "haruez": {
        "code": 61030,
        "name": "haruez",
        "filename": "61030.png"
    },
    "heal": {
        "code": 61031,
        "name": "heal",
        "filename": "61031.png"
    },
    "hexflash": {
        "code": 61032,
        "name": "hexflash",
        "filename": "61032.png"
    },
    "hilbert": {
        "code": 61033,
        "name": "hilbert",
        "filename": "61033.png"
    },
    "hugh": {
        "code": 61034,
        "name": "hugh",
        "filename": "61034.png"
    },
    "hydreigonshiny": {
        "code": 61035,
        "name": "hydreigonshiny",
        "filename": "61035.png"
    },
    "i_see": {
        "code": 61036,
        "name": "i_see",
        "filename": "61036.png"
    },
    "ignite": {
        "code": 61037,
        "name": "ignite",
        "filename": "61037.png"
    },
    "illegalgaslightingghost": {
        "code": 61038,
        "name": "illegalgaslightingghost",
        "filename": "61038.png"
    },
    "inaoi": {
        "code": 61039,
        "name": "inaoi",
        "filename": "61039.png"
    },
    "jonesy_pog": {
        "code": 61040,
        "name": "jonesy_pog",
        "filename": "61040.png"
    },
    "kekw": {
        "code": 61041,
        "name": "kekw",
        "filename": "61041.png"
    },
    "keknervous": {
        "code": 61042,
        "name": "keknervous",
        "filename": "61042.png"
    },
    "kekwtf": {
        "code": 61043,
        "name": "kekwtf",
        "filename": "61043.png"
    },
    "kerbalhappy": {
        "code": 61044,
        "name": "kerbalhappy",
        "filename": "61044.png"
    },
    "konatatexas": {
        "code": 61045,
        "name": "konatatexas",
        "filename": "61045.png"
    },
    "lain": {
        "code": 61046,
        "name": "lain",
        "filename": "61046.png"
    },
    "ltc": {
        "code": 61047,
        "name": "ltc",
        "filename": "61047.png"
    },
    "lunimpressed": {
        "code": 61048,
        "name": "lunimpressed",
        "filename": "61048.png"
    },
    "luxray": {
        "code": 61049,
        "name": "luxray",
        "filename": "61049.png"
    },
    "materialjoker": {
        "code": 61050,
        "name": "materialjoker",
        "filename": "61050.png"
    },
    "ma_yikesyeahnahnope": {
        "code": 61051,
        "name": "ma_yikesyeahnahnope",
        "filename": "61051.png"
    },
    "madcat": {
        "code": 61052,
        "name": "madcat",
        "filename": "61052.png"
    },
    "mankey": {
        "code": 61053,
        "name": "mankey",
        "filename": "61053.png"
    },
    "margsmile": {
        "code": 61054,
        "name": "margsmile",
        "filename": "61054.png"
    },
    "mariesigh": {
        "code": 61055,
        "name": "mariesigh",
        "filename": "61055.png"
    },
    "mark": {
        "code": 61056,
        "name": "mark",
        "filename": "61056.png"
    },
    "michael": {
        "code": 61057,
        "name": "michael",
        "filename": "61057.png"
    },
    "nobu": {
        "code": 61058,
        "name": "nobu",
        "filename": "61058.png"
    },
    "nakeysquirt": {
        "code": 61059,
        "name": "nakeysquirt",
        "filename": "61059.png"
    },
    "nanab": {
        "code": 61060,
        "name": "nanab",
        "filename": "61060.png"
    },
    "nani": {
        "code": 61061,
        "name": "nani",
        "filename": "61061.png"
    },
    "no": {
        "code": 61391,
        "name": "no",
        "filename": "61391.png"
    },
    "normalshiny": {
        "code": 61063,
        "name": "normalshiny",
        "filename": "61063.png"
    },
    "ogu": {
        "code": 61064,
        "name": "ogu",
        "filename": "61064.png"
    },
    "omegalul": {
        "code": 61065,
        "name": "omegalul",
        "filename": "61065.png"
    },
    "oo": {
        "code": 61066,
        "name": "oo",
        "filename": "61066.png"
    },
    "okinamatara": {
        "code": 61067,
        "name": "okinamatara",
        "filename": "61067.png"
    },
    "owo": {
        "code": 61068,
        "name": "owo",
        "filename": "61068.png"
    },
    "ppup": {
        "code": 61069,
        "name": "ppup",
        "filename": "61069.png"
    },
    "pausechamp": {
        "code": 61070,
        "name": "pausechamp",
        "filename": "61070.png"
    },
    "peepotexas": {
        "code": 61071,
        "name": "peepotexas",
        "filename": "61071.png"
    },
    "pepepains": {
        "code": 61073,
        "name": "pepepains",
        "filename": "61073.png"
    },
    "permissionerror": {
        "code": 61074,
        "name": "permissionerror",
        "filename": "61074.png"
    },
    "pickael": {
        "code": 61075,
        "name": "pickael",
        "filename": "61075.png"
    },
    "picklo": {
        "code": 61076,
        "name": "picklo",
        "filename": "61076.png"
    },
    "piplupfried": {
        "code": 61077,
        "name": "piplupfried",
        "filename": "61077.png"
    },
    "plaguebird": {
        "code": 61078,
        "name": "plaguebird",
        "filename": "61078.png"
    },
    "poketrainerclown": {
        "code": 61079,
        "name": "poketrainerclown",
        "filename": "61079.png"
    },
    "pourup": {
        "code": 61080,
        "name": "pourup",
        "filename": "61080.png"
    },
    "psyeyeeye": {
        "code": 61081,
        "name": "psyeyeeye",
        "filename": "61081.png"
    },
    "psyemoji": {
        "code": 61082,
        "name": "psyemoji",
        "filename": "61082.png"
    },
    "recall": {
        "code": 61083,
        "name": "recall",
        "filename": "61083.png"
    },
    "residentcoolguy": {
        "code": 61084,
        "name": "residentcoolguy",
        "filename": "61084.png"
    },
    "rollone": {
        "code": 61085,
        "name": "rollone",
        "filename": "61085.png"
    },
    "snn_logo": {
        "code": 61086,
        "name": "snn_logo",
        "filename": "61086.png"
    },
    "sheeeeeeesh": {
        "code": 61088,
        "name": "sheeeeeeesh",
        "filename": "61088.png"
    },
    "sheeshblush": {
        "code": 61089,
        "name": "sheeshblush",
        "filename": "61089.png"
    },
    "shinxangy": {
        "code": 61090,
        "name": "shinxangy",
        "filename": "61090.png"
    },
    "shinxblush": {
        "code": 61091,
        "name": "shinxblush",
        "filename": "61091.png"
    },
    "shinxheart": {
        "code": 61092,
        "name": "shinxheart",
        "filename": "61092.png"
    },
    "shinxsweet": {
        "code": 61093,
        "name": "shinxsweet",
        "filename": "61093.png"
    },
    "shinymank": {
        "code": 61094,
        "name": "shinymank",
        "filename": "61094.png"
    },
    "shit": {
        "code": 61095,
        "name": "shit",
        "filename": "61095.png"
    },
    "sitpuppo": {
        "code": 61096,
        "name": "sitpuppo",
        "filename": "61096.png"
    },
    "smite": {
        "code": 61097,
        "name": "smite",
        "filename": "61097.png"
    },
    "smugexplain": {
        "code": 61098,
        "name": "smugexplain",
        "filename": "61098.png"
    },
    "soblank": {
        "code": 61099,
        "name": "soblank",
        "filename": "61099.png"
    },
    "soditto": {
        "code": 61100,
        "name": "soditto",
        "filename": "61100.png"
    },
    "sodone": {
        "code": 61101,
        "name": "sodone",
        "filename": "61101.png"
    },
    "soglans": {
        "code": 61102,
        "name": "soglans",
        "filename": "61102.png"
    },
    "sohappy": {
        "code": 61103,
        "name": "sohappy",
        "filename": "61103.png"
    },
    "sohuggie": {
        "code": 61104,
        "name": "sohuggie",
        "filename": "61104.png"
    },
    "sohype": {
        "code": 61105,
        "name": "sohype",
        "filename": "61105.png"
    },
    "sojammin": {
        "code": 61106,
        "name": "sojammin",
        "filename": "61106.png"
    },
    "somadr": {
        "code": 61107,
        "name": "somadr",
        "filename": "61107.png"
    },
    "somad": {
        "code": 61108,
        "name": "somad",
        "filename": "61108.png"
    },
    "sorude": {
        "code": 61109,
        "name": "sorude",
        "filename": "61109.png"
    },
    "sosad": {
        "code": 61110,
        "name": "sosad",
        "filename": "61110.png"
    },
    "soshiny": {
        "code": 61111,
        "name": "soshiny",
        "filename": "61111.png"
    },
    "soshocked": {
        "code": 61112,
        "name": "soshocked",
        "filename": "61112.png"
    },
    "sosmug": {
        "code": 61113,
        "name": "sosmug",
        "filename": "61113.png"
    },
    "sosmuggo": {
        "code": 61114,
        "name": "sosmuggo",
        "filename": "61114.png"
    },
    "sostoned": {
        "code": 61115,
        "name": "sostoned",
        "filename": "61115.png"
    },
    "sosussy": {
        "code": 61116,
        "name": "sosussy",
        "filename": "61116.png"
    },
    "southerchocolate": {
        "code": 61117,
        "name": "southerchocolate",
        "filename": "61117.png"
    },
    "speedshiny": {
        "code": 61118,
        "name": "speedshiny",
        "filename": "61118.png"
    },
    "staryushiny": {
        "code": 61119,
        "name": "staryushiny",
        "filename": "61119.png"
    },
    "swinubshiny": {
        "code": 61120,
        "name": "swinubshiny",
        "filename": "61120.png"
    },
    "ten": {
        "code": 61121,
        "name": "ten",
        "filename": "61121.png"
    },
    "takodespair": {
        "code": 61122,
        "name": "takodespair",
        "filename": "61122.png"
    },
    "teleport": {
        "code": 61123,
        "name": "teleport",
        "filename": "61123.png"
    },
    "thehaven": {
        "code": 61124,
        "name": "thehaven",
        "filename": "61124.png"
    },
    "topic": {
        "code": 61125,
        "name": "topic",
        "filename": "61125.png"
    },
    "veteranbadge": {
        "code": 61126,
        "name": "veteranbadge",
        "filename": "61126.png"
    },
    "veterantrainer": {
        "code": 61127,
        "name": "veterantrainer",
        "filename": "61127.png"
    },
    "whimsicottshiny": {
        "code": 61128,
        "name": "whimsicottshiny",
        "filename": "61128.png"
    },
    "whimsicott": {
        "code": 61129,
        "name": "whimsicott",
        "filename": "61129.png"
    },
    "yippee": {
        "code": 61130,
        "name": "yippee",
        "filename": "61130.png"
    },
    "zebstrikashiny": {
        "code": 61131,
        "name": "zebstrikashiny",
        "filename": "61131.png"
    },
    "_e_": {
        "code": 61132,
        "name": "_e_",
        "filename": "61132.png"
    },
    "__": {
        "code": 61133,
        "name": "__",
        "filename": "61133.png"
    },
    "aaaaahhhhhh": {
        "code": 61134,
        "name": "aaaaahhhhhh",
        "filename": "61134.png"
    },
    "abelsmp": {
        "code": 61135,
        "name": "abelsmp",
        "filename": "61135.png"
    },
    "ack": {
        "code": 61136,
        "name": "ack",
        "filename": "61136.png"
    },
    "alwayshas": {
        "code": 61137,
        "name": "alwayshas",
        "filename": "61137.png"
    },
    "amogus": {
        "code": 61138,
        "name": "amogus",
        "filename": "61138.png"
    },
    "amogushinx": {
        "code": 61139,
        "name": "amogushinx",
        "filename": "61139.png"
    },
    "analise_excessiva": {
        "code": 61140,
        "name": "analise_excessiva",
        "filename": "61140.png"
    },
    "angryclown": {
        "code": 61141,
        "name": "angryclown",
        "filename": "61141.png"
    },
    "angryfrog": {
        "code": 61142,
        "name": "angryfrog",
        "filename": "61142.png"
    },
    "angrykirby": {
        "code": 61143,
        "name": "angrykirby",
        "filename": "61143.png"
    },
    "animeglasses1": {
        "code": 61144,
        "name": "animeglasses1",
        "filename": "61144.png"
    },
    "animeglasses2": {
        "code": 61145,
        "name": "animeglasses2",
        "filename": "61145.png"
    },
    "ants_in_my_eyes": {
        "code": 61146,
        "name": "ants_in_my_eyes",
        "filename": "61146.png"
    },
    "antsinmyeyesjohnson": {
        "code": 61147,
        "name": "antsinmyeyesjohnson",
        "filename": "61147.png"
    },
    "anxious": {
        "code": 61148,
        "name": "anxious",
        "filename": "61148.png"
    },
    "ararar": {
        "code": 61149,
        "name": "ararar",
        "filename": "61149.png"
    },
    "arg_cat": {
        "code": 61150,
        "name": "arg_cat",
        "filename": "61150.png"
    },
    "autism": {
        "code": 61151,
        "name": "autism",
        "filename": "61151.png"
    },
    "aviators": {
        "code": 61152,
        "name": "aviators",
        "filename": "61152.png"
    },
    "awareness": {
        "code": 61153,
        "name": "awareness",
        "filename": "61153.png"
    },
    "awesomedog": {
        "code": 61154,
        "name": "awesomedog",
        "filename": "61154.png"
    },
    "ayoo": {
        "code": 61155,
        "name": "ayoo",
        "filename": "61155.png"
    },
    "babypat": {
        "code": 61156,
        "name": "babypat",
        "filename": "61156.png"
    },
    "badpokerface": {
        "code": 61157,
        "name": "badpokerface",
        "filename": "61157.png"
    },
    "beacon": {
        "code": 61158,
        "name": "beacon",
        "filename": "61158.png"
    },
    "belkathumb": {
        "code": 61159,
        "name": "belkathumb",
        "filename": "61159.png"
    },
    "bird_person": {
        "code": 61160,
        "name": "bird_person",
        "filename": "61160.png"
    },
    "bite": {
        "code": 61161,
        "name": "bite",
        "filename": "61161.png"
    },
    "blob_sendhelp": {
        "code": 61162,
        "name": "blob_sendhelp",
        "filename": "61162.png"
    },
    "blobaww": {
        "code": 61163,
        "name": "blobaww",
        "filename": "61163.png"
    },
    "blobcat_caged": {
        "code": 61164,
        "name": "blobcat_caged",
        "filename": "61164.png"
    },
    "blobfail": {
        "code": 61165,
        "name": "blobfail",
        "filename": "61165.png"
    },
    "blobgo": {
        "code": 61166,
        "name": "blobgo",
        "filename": "61166.png"
    },
    "blobgtfo": {
        "code": 61167,
        "name": "blobgtfo",
        "filename": "61167.png"
    },
    "blobmindblown": {
        "code": 61168,
        "name": "blobmindblown",
        "filename": "61168.png"
    },
    "blobsleepless": {
        "code": 61169,
        "name": "blobsleepless",
        "filename": "61169.png"
    },
    "blobthinkingglare": {
        "code": 61170,
        "name": "blobthinkingglare",
        "filename": "61170.png"
    },
    "blockmachinebroke": {
        "code": 61171,
        "name": "blockmachinebroke",
        "filename": "61171.png"
    },
    "blueorigin": {
        "code": 61172,
        "name": "blueorigin",
        "filename": "61172.png"
    },
    "boiii": {
        "code": 61173,
        "name": "boiii",
        "filename": "61173.png"
    },
    "book_rtx_off": {
        "code": 61174,
        "name": "book_rtx_off",
        "filename": "61174.png"
    },
    "book_rtx_on": {
        "code": 61175,
        "name": "book_rtx_on",
        "filename": "61175.png"
    },
    "boooo": {
        "code": 61176,
        "name": "boooo",
        "filename": "61176.png"
    },
    "brthink": {
        "code": 61177,
        "name": "brthink",
        "filename": "61177.png"
    },
    "bruh": {
        "code": 61178,
        "name": "bruh",
        "filename": "61178.png"
    },
    "bruh_you_ok": {
        "code": 61179,
        "name": "bruh_you_ok",
        "filename": "61179.png"
    },
    "bruhwaht": {
        "code": 61180,
        "name": "bruhwaht",
        "filename": "61180.png"
    },
    "bruv": {
        "code": 61181,
        "name": "bruv",
        "filename": "61181.png"
    },
    "buff_spongebob": {
        "code": 61182,
        "name": "buff_spongebob",
        "filename": "61182.png"
    },
    "butters_ohshit": {
        "code": 61183,
        "name": "butters_ohshit",
        "filename": "61183.png"
    },
    "bye": {
        "code": 61184,
        "name": "bye",
        "filename": "61184.png"
    },
    "cappremovebgpreviewmodified": {
        "code": 61185,
        "name": "cappremovebgpreviewmodified",
        "filename": "61185.png"
    },
    "carl_aint_fuckin_around": {
        "code": 61186,
        "name": "carl_aint_fuckin_around",
        "filename": "61186.png"
    },
    "carlmfao": {
        "code": 61187,
        "name": "carlmfao",
        "filename": "61187.png"
    },
    "cathover": {
        "code": 61188,
        "name": "cathover",
        "filename": "61188.png"
    },
    "catnotamused": {
        "code": 61189,
        "name": "catnotamused",
        "filename": "61189.png"
    },
    "cheems": {
        "code": 61190,
        "name": "cheems",
        "filename": "61190.png"
    },
    "cheemsburguesa": {
        "code": 61191,
        "name": "cheemsburguesa",
        "filename": "61191.png"
    },
    "cheemscry": {
        "code": 61192,
        "name": "cheemscry",
        "filename": "61192.png"
    },
    "cheers_ill_drink": {
        "code": 61193,
        "name": "cheers_ill_drink",
        "filename": "61193.png"
    },
    "cheeseysmirk": {
        "code": 61194,
        "name": "cheeseysmirk",
        "filename": "61194.png"
    },
    "clown_champion": {
        "code": 61195,
        "name": "clown_champion",
        "filename": "61195.png"
    },
    "clown_sir": {
        "code": 61196,
        "name": "clown_sir",
        "filename": "61196.png"
    },
    "clownskull": {
        "code": 61197,
        "name": "clownskull",
        "filename": "61197.png"
    },
    "confusedcat": {
        "code": 61198,
        "name": "confusedcat",
        "filename": "61198.png"
    },
    "confusion": {
        "code": 61199,
        "name": "confusion",
        "filename": "61199.png"
    },
    "cool": {
        "code": 61200,
        "name": "cool",
        "filename": "61200.png"
    },
    "coolbetcha": {
        "code": 61201,
        "name": "coolbetcha",
        "filename": "61201.png"
    },
    "courier_flaps": {
        "code": 61202,
        "name": "courier_flaps",
        "filename": "61202.png"
    },
    "cringe": {
        "code": 61203,
        "name": "cringe",
        "filename": "61203.png"
    },
    "croagunk": {
        "code": 61204,
        "name": "croagunk",
        "filename": "61204.png"
    },
    "crossgerman": {
        "code": 61205,
        "name": "crossgerman",
        "filename": "61205.png"
    },
    "crumpet_intensifies": {
        "code": 61206,
        "name": "crumpet_intensifies",
        "filename": "61206.png"
    },
    "crusade_upgrade": {
        "code": 61207,
        "name": "crusade_upgrade",
        "filename": "61207.png"
    },
    "cryaboutit": {
        "code": 61208,
        "name": "cryaboutit",
        "filename": "61208.png"
    },
    "cubecake": {
        "code": 61209,
        "name": "cubecake",
        "filename": "61209.png"
    },
    "cubecake_lit_black": {
        "code": 61210,
        "name": "cubecake_lit_black",
        "filename": "61210.png"
    },
    "cubecake_lit_orange": {
        "code": 61211,
        "name": "cubecake_lit_orange",
        "filename": "61211.png"
    },
    "cubecake_lit_purple": {
        "code": 61212,
        "name": "cubecake_lit_purple",
        "filename": "61212.png"
    },
    "cursed_1": {
        "code": 61213,
        "name": "cursed_1",
        "filename": "61213.png"
    },
    "cursed_2": {
        "code": 61214,
        "name": "cursed_2",
        "filename": "61214.png"
    },
    "cursed": {
        "code": 61215,
        "name": "cursed",
        "filename": "61215.png"
    },
    "cursedtorres": {
        "code": 61216,
        "name": "cursedtorres",
        "filename": "61216.png"
    },
    "cutter": {
        "code": 61217,
        "name": "cutter",
        "filename": "61217.png"
    },
    "dabward": {
        "code": 61218,
        "name": "dabward",
        "filename": "61218.png"
    },
    "damper": {
        "code": 61219,
        "name": "damper",
        "filename": "61219.png"
    },
    "danny_laugh": {
        "code": 61220,
        "name": "danny_laugh",
        "filename": "61220.png"
    },
    "darkwiz": {
        "code": 61221,
        "name": "darkwiz",
        "filename": "61221.png"
    },
    "demoman": {
        "code": 61222,
        "name": "demoman",
        "filename": "61222.png"
    },
    "derp_blush2": {
        "code": 61223,
        "name": "derp_blush2",
        "filename": "61223.png"
    },
    "derp_blush": {
        "code": 61224,
        "name": "derp_blush",
        "filename": "61224.png"
    },
    "derp_cash": {
        "code": 61225,
        "name": "derp_cash",
        "filename": "61225.png"
    },
    "derp_cold": {
        "code": 61226,
        "name": "derp_cold",
        "filename": "61226.png"
    },
    "derp_cool": {
        "code": 61227,
        "name": "derp_cool",
        "filename": "61227.png"
    },
    "derp_cowboy": {
        "code": 61228,
        "name": "derp_cowboy",
        "filename": "61228.png"
    },
    "derp_derp": {
        "code": 61229,
        "name": "derp_derp",
        "filename": "61229.png"
    },
    "derp_disguise": {
        "code": 61230,
        "name": "derp_disguise",
        "filename": "61230.png"
    },
    "derp_eyebrow": {
        "code": 61231,
        "name": "derp_eyebrow",
        "filename": "61231.png"
    },
    "derp_frown": {
        "code": 61232,
        "name": "derp_frown",
        "filename": "61232.png"
    },
    "derp_gasp": {
        "code": 61233,
        "name": "derp_gasp",
        "filename": "61233.png"
    },
    "derp_grin": {
        "code": 61234,
        "name": "derp_grin",
        "filename": "61234.png"
    },
    "derp_halo": {
        "code": 61235,
        "name": "derp_halo",
        "filename": "61235.png"
    },
    "derp_hearts1": {
        "code": 61236,
        "name": "derp_hearts1",
        "filename": "61236.png"
    },
    "derp_hearts2": {
        "code": 61237,
        "name": "derp_hearts2",
        "filename": "61237.png"
    },
    "derp_hmm": {
        "code": 61238,
        "name": "derp_hmm",
        "filename": "61238.png"
    },
    "derp_joytears": {
        "code": 61239,
        "name": "derp_joytears",
        "filename": "61239.png"
    },
    "derp_mindblown": {
        "code": 61240,
        "name": "derp_mindblown",
        "filename": "61240.png"
    },
    "derp_nerd": {
        "code": 61241,
        "name": "derp_nerd",
        "filename": "61241.png"
    },
    "derp_nonameyet": {
        "code": 61242,
        "name": "derp_nonameyet",
        "filename": "61242.png"
    },
    "derp_party": {
        "code": 61243,
        "name": "derp_party",
        "filename": "61243.png"
    },
    "derp_shh": {
        "code": 61244,
        "name": "derp_shh",
        "filename": "61244.png"
    },
    "derp_smile": {
        "code": 61245,
        "name": "derp_smile",
        "filename": "61245.png"
    },
    "derp_smooch": {
        "code": 61246,
        "name": "derp_smooch",
        "filename": "61246.png"
    },
    "derp_superderp": {
        "code": 61247,
        "name": "derp_superderp",
        "filename": "61247.png"
    },
    "derp_tongue": {
        "code": 61248,
        "name": "derp_tongue",
        "filename": "61248.png"
    },
    "derp_zzz": {
        "code": 61249,
        "name": "derp_zzz",
        "filename": "61249.png"
    },
    "derpo": {
        "code": 61250,
        "name": "derpo",
        "filename": "61250.png"
    },
    "derpo_frog": {
        "code": 61251,
        "name": "derpo_frog",
        "filename": "61251.png"
    },
    "develop_an_app": {
        "code": 61252,
        "name": "develop_an_app",
        "filename": "61252.png"
    },
    "diamondhelmpeepo": {
        "code": 61253,
        "name": "diamondhelmpeepo",
        "filename": "61253.png"
    },
    "disgusted": {
        "code": 61254,
        "name": "disgusted",
        "filename": "61254.png"
    },
    "dogegun": {
        "code": 61255,
        "name": "dogegun",
        "filename": "61255.png"
    },
    "dogewink": {
        "code": 61256,
        "name": "dogewink",
        "filename": "61256.png"
    },
    "doggok": {
        "code": 61257,
        "name": "doggok",
        "filename": "61257.png"
    },
    "dokiemoji": {
        "code": 61258,
        "name": "dokiemoji",
        "filename": "61258.png"
    },
    "donttouchmeimsterile": {
        "code": 61259,
        "name": "donttouchmeimsterile",
        "filename": "61259.png"
    },
    "doofus_rick": {
        "code": 61260,
        "name": "doofus_rick",
        "filename": "61260.png"
    },
    "drake_ban": {
        "code": 61261,
        "name": "drake_ban",
        "filename": "61261.png"
    },
    "drank": {
        "code": 61262,
        "name": "drank",
        "filename": "61262.png"
    },
    "dubious": {
        "code": 61263,
        "name": "dubious",
        "filename": "61263.png"
    },
    "duogun": {
        "code": 61264,
        "name": "duogun",
        "filename": "61264.png"
    },
    "e1": {
        "code": 61265,
        "name": "e1",
        "filename": "61265.png"
    },
    "e2": {
        "code": 61266,
        "name": "e2",
        "filename": "61266.png"
    },
    "e3": {
        "code": 61267,
        "name": "e3",
        "filename": "61267.png"
    },
    "e4": {
        "code": 61268,
        "name": "e4",
        "filename": "61268.png"
    },
    "emoji_10": {
        "code": 61269,
        "name": "emoji_10",
        "filename": "61269.png"
    },
    "emoji_11": {
        "code": 61270,
        "name": "emoji_11",
        "filename": "61270.png"
    },
    "emoji_12": {
        "code": 61271,
        "name": "emoji_12",
        "filename": "61271.png"
    },
    "emoji_14": {
        "code": 61272,
        "name": "emoji_14",
        "filename": "61272.png"
    },
    "emoji_15": {
        "code": 61273,
        "name": "emoji_15",
        "filename": "61273.png"
    },
    "emoji_266": {
        "code": 61274,
        "name": "emoji_266",
        "filename": "61274.png"
    },
    "emoji_267": {
        "code": 61275,
        "name": "emoji_267",
        "filename": "61275.png"
    },
    "emoji_268": {
        "code": 61276,
        "name": "emoji_268",
        "filename": "61276.png"
    },
    "emoji_270": {
        "code": 61277,
        "name": "emoji_270",
        "filename": "61277.png"
    },
    "emoji_271": {
        "code": 61278,
        "name": "emoji_271",
        "filename": "61278.png"
    },
    "emoji_273": {
        "code": 61279,
        "name": "emoji_273",
        "filename": "61279.png"
    },
    "emoji_274": {
        "code": 61280,
        "name": "emoji_274",
        "filename": "61280.png"
    },
    "emoji_275": {
        "code": 61281,
        "name": "emoji_275",
        "filename": "61281.png"
    },
    "emoji_276": {
        "code": 61282,
        "name": "emoji_276",
        "filename": "61282.png"
    },
    "emoji_278": {
        "code": 61283,
        "name": "emoji_278",
        "filename": "61283.png"
    },
    "emoji_32": {
        "code": 61284,
        "name": "emoji_32",
        "filename": "61284.png"
    },
    "emoji_3": {
        "code": 61285,
        "name": "emoji_3",
        "filename": "61285.png"
    },
    "emoji_4": {
        "code": 61286,
        "name": "emoji_4",
        "filename": "61286.png"
    },
    "emoji_5": {
        "code": 61287,
        "name": "emoji_5",
        "filename": "61287.png"
    },
    "emoji_6": {
        "code": 61288,
        "name": "emoji_6",
        "filename": "61288.png"
    },
    "emoji_8": {
        "code": 61289,
        "name": "emoji_8",
        "filename": "61289.png"
    },
    "emoji_9": {
        "code": 61290,
        "name": "emoji_9",
        "filename": "61290.png"
    },
    "ermehgerd": {
        "code": 61291,
        "name": "ermehgerd",
        "filename": "61291.png"
    },
    "everywhere": {
        "code": 61292,
        "name": "everywhere",
        "filename": "61292.png"
    },
    "evillaugh": {
        "code": 61293,
        "name": "evillaugh",
        "filename": "61293.png"
    },
    "eyebleach": {
        "code": 61294,
        "name": "eyebleach",
        "filename": "61294.png"
    },
    "eyerollvom": {
        "code": 61295,
        "name": "eyerollvom",
        "filename": "61295.png"
    },
    "f_to_pay_respects": {
        "code": 61296,
        "name": "f_to_pay_respects",
        "filename": "61296.png"
    },
    "family_gone": {
        "code": 61297,
        "name": "family_gone",
        "filename": "61297.png"
    },
    "family_yes": {
        "code": 61298,
        "name": "family_yes",
        "filename": "61298.png"
    },
    "findhelp": {
        "code": 61299,
        "name": "findhelp",
        "filename": "61299.png"
    },
    "fisheyedoggo": {
        "code": 61300,
        "name": "fisheyedoggo",
        "filename": "61300.png"
    },
    "flag_sov": {
        "code": 61301,
        "name": "flag_sov",
        "filename": "61301.png"
    },
    "flan_scare": {
        "code": 61302,
        "name": "flan_scare",
        "filename": "61302.png"
    },
    "forgor": {
        "code": 61303,
        "name": "forgor",
        "filename": "61303.png"
    },
    "freemano": {
        "code": 61304,
        "name": "freemano",
        "filename": "61304.png"
    },
    "freshplus": {
        "code": 61305,
        "name": "freshplus",
        "filename": "61305.png"
    },
    "fry_panic": {
        "code": 61306,
        "name": "fry_panic",
        "filename": "61306.png"
    },
    "fry_squint": {
        "code": 61307,
        "name": "fry_squint",
        "filename": "61307.png"
    },
    "fuck": {
        "code": 61308,
        "name": "fuck",
        "filename": "61308.png"
    },
    "gamers_rise_up": {
        "code": 61309,
        "name": "gamers_rise_up",
        "filename": "61309.png"
    },
    "get_in": {
        "code": 61310,
        "name": "get_in",
        "filename": "61310.png"
    },
    "ghost_in_a_jar": {
        "code": 61311,
        "name": "ghost_in_a_jar",
        "filename": "61311.png"
    },
    "giddygun": {
        "code": 61312,
        "name": "giddygun",
        "filename": "61312.png"
    },
    "giga": {
        "code": 61313,
        "name": "giga",
        "filename": "61313.png"
    },
    "gigacheems": {
        "code": 61314,
        "name": "gigacheems",
        "filename": "61314.png"
    },
    "gladge": {
        "code": 61315,
        "name": "gladge",
        "filename": "61315.png"
    },
    "glassespush": {
        "code": 61316,
        "name": "glassespush",
        "filename": "61316.png"
    },
    "go_on": {
        "code": 61317,
        "name": "go_on",
        "filename": "61317.png"
    },
    "good_boi": {
        "code": 61318,
        "name": "good_boi",
        "filename": "61318.png"
    },
    "goodnews": {
        "code": 61319,
        "name": "goodnews",
        "filename": "61319.png"
    },
    "guess_ill_die": {
        "code": 61320,
        "name": "guess_ill_die",
        "filename": "61320.png"
    },
    "gunpoint": {
        "code": 61321,
        "name": "gunpoint",
        "filename": "61321.png"
    },
    "gunthink": {
        "code": 61322,
        "name": "gunthink",
        "filename": "61322.png"
    },
    "haaaaaaa": {
        "code": 61323,
        "name": "haaaaaaa",
        "filename": "61323.png"
    },
    "hackerman": {
        "code": 61324,
        "name": "hackerman",
        "filename": "61324.png"
    },
    "hammerandsickle": {
        "code": 61325,
        "name": "hammerandsickle",
        "filename": "61325.png"
    },
    "happy": {
        "code": 61326,
        "name": "happy",
        "filename": "61326.png"
    },
    "happythumb": {
        "code": 61327,
        "name": "happythumb",
        "filename": "61327.png"
    },
    "hardbully": {
        "code": 61328,
        "name": "hardbully",
        "filename": "61328.png"
    },
    "hardsame": {
        "code": 61329,
        "name": "hardsame",
        "filename": "61329.png"
    },
    "heavybreathing": {
        "code": 61330,
        "name": "heavybreathing",
        "filename": "61330.png"
    },
    "heh": {
        "code": 61331,
        "name": "heh",
        "filename": "61331.png"
    },
    "hellagay": {
        "code": 61332,
        "name": "hellagay",
        "filename": "61332.png"
    },
    "hide_the_pain": {
        "code": 61333,
        "name": "hide_the_pain",
        "filename": "61333.png"
    },
    "hm_emote1": {
        "code": 61334,
        "name": "hm_emote1",
        "filename": "61334.png"
    },
    "hm_emote": {
        "code": 61335,
        "name": "hm_emote",
        "filename": "61335.png"
    },
    "hmm_mouthgun": {
        "code": 61336,
        "name": "hmm_mouthgun",
        "filename": "61336.png"
    },
    "hmm_smirk": {
        "code": 61337,
        "name": "hmm_smirk",
        "filename": "61337.png"
    },
    "hmmfish": {
        "code": 61338,
        "name": "hmmfish",
        "filename": "61338.png"
    },
    "hmmmmhh": {
        "code": 61339,
        "name": "hmmmmhh",
        "filename": "61339.png"
    },
    "hololiver": {
        "code": 61340,
        "name": "hololiver",
        "filename": "61340.png"
    },
    "horror": {
        "code": 61341,
        "name": "horror",
        "filename": "61341.png"
    },
    "hot": {
        "code": 61342,
        "name": "hot",
        "filename": "61342.png"
    },
    "hug": {
        "code": 61343,
        "name": "hug",
        "filename": "61343.png"
    },
    "i_dont_even": {
        "code": 61344,
        "name": "i_dont_even",
        "filename": "61344.png"
    },
    "i_know_that": {
        "code": 61345,
        "name": "i_know_that",
        "filename": "61345.png"
    },
    "idkduderick": {
        "code": 61346,
        "name": "idkduderick",
        "filename": "61346.png"
    },
    "ifyouknowwhatimeme": {
        "code": 61347,
        "name": "ifyouknowwhatimeme",
        "filename": "61347.png"
    },
    "ijustwantedthis": {
        "code": 61348,
        "name": "ijustwantedthis",
        "filename": "61348.png"
    },
    "imageedit_5_2965106301": {
        "code": 61349,
        "name": "imageedit_5_2965106301",
        "filename": "61349.png"
    },
    "imagine": {
        "code": 61350,
        "name": "imagine",
        "filename": "61350.png"
    },
    "immaheadout": {
        "code": 61351,
        "name": "immaheadout",
        "filename": "61351.png"
    },
    "isleep": {
        "code": 61352,
        "name": "isleep",
        "filename": "61352.png"
    },
    "jokedog": {
        "code": 61353,
        "name": "jokedog",
        "filename": "61353.png"
    },
    "jpegdog": {
        "code": 61354,
        "name": "jpegdog",
        "filename": "61354.png"
    },
    "judgemorty": {
        "code": 61355,
        "name": "judgemorty",
        "filename": "61355.png"
    },
    "justright": {
        "code": 61356,
        "name": "justright",
        "filename": "61356.png"
    },
    "kijij": {
        "code": 61357,
        "name": "kijij",
        "filename": "61357.png"
    },
    "kirby_rick": {
        "code": 61358,
        "name": "kirby_rick",
        "filename": "61358.png"
    },
    "kloomp": {
        "code": 61359,
        "name": "kloomp",
        "filename": "61359.png"
    },
    "knifepepe": {
        "code": 61360,
        "name": "knifepepe",
        "filename": "61360.png"
    },
    "kys": {
        "code": 61361,
        "name": "kys",
        "filename": "61361.png"
    },
    "light_skinenergy": {
        "code": 61362,
        "name": "light_skinenergy",
        "filename": "61362.png"
    },
    "lmao": {
        "code": 61363,
        "name": "lmao",
        "filename": "61363.png"
    },
    "lmaoooo": {
        "code": 61364,
        "name": "lmaoooo",
        "filename": "61364.png"
    },
    "lmfao": {
        "code": 61365,
        "name": "lmfao",
        "filename": "61365.png"
    },
    "looool": {
        "code": 61366,
        "name": "looool",
        "filename": "61366.png"
    },
    "love": {
        "code": 61367,
        "name": "love",
        "filename": "61367.png"
    },
    "lurking": {
        "code": 61368,
        "name": "lurking",
        "filename": "61368.png"
    },
    "mockingsb": {
        "code": 61369,
        "name": "mockingsb",
        "filename": "61369.png"
    },
    "math_ptsd_dog": {
        "code": 61370,
        "name": "math_ptsd_dog",
        "filename": "61370.png"
    },
    "mc_diamond": {
        "code": 61371,
        "name": "mc_diamond",
        "filename": "61371.png"
    },
    "mcbread": {
        "code": 61372,
        "name": "mcbread",
        "filename": "61372.png"
    },
    "megusta": {
        "code": 61373,
        "name": "megusta",
        "filename": "61373.png"
    },
    "messed_up": {
        "code": 61374,
        "name": "messed_up",
        "filename": "61374.png"
    },
    "miaeyes": {
        "code": 61375,
        "name": "miaeyes",
        "filename": "61375.png"
    },
    "mightycheems": {
        "code": 61376,
        "name": "mightycheems",
        "filename": "61376.png"
    },
    "misamisa": {
        "code": 61377,
        "name": "misamisa",
        "filename": "61377.png"
    },
    "mobile": {
        "code": 61378,
        "name": "mobile",
        "filename": "61378.png"
    },
    "momomo": {
        "code": 61379,
        "name": "momomo",
        "filename": "61379.png"
    },
    "money": {
        "code": 61380,
        "name": "money",
        "filename": "61380.png"
    },
    "monkas": {
        "code": 61381,
        "name": "monkas",
        "filename": "61381.png"
    },
    "morgano": {
        "code": 61382,
        "name": "morgano",
        "filename": "61382.png"
    },
    "mspepeexplain": {
        "code": 61383,
        "name": "mspepeexplain",
        "filename": "61383.png"
    },
    "muscle_duck": {
        "code": 61384,
        "name": "muscle_duck",
        "filename": "61384.png"
    },
    "myyyy_man": {
        "code": 61385,
        "name": "myyyy_man",
        "filename": "61385.png"
    },
    "naoya": {
        "code": 61386,
        "name": "naoya",
        "filename": "61386.png"
    },
    "nbbawhat": {
        "code": 61387,
        "name": "nbbawhat",
        "filename": "61387.png"
    },
    "netd_16": {
        "code": 61388,
        "name": "netd_16",
        "filename": "61388.png"
    },
    "nibba": {
        "code": 61389,
        "name": "nibba",
        "filename": "61389.png"
    },
    "nipples": {
        "code": 61390,
        "name": "nipples",
        "filename": "61390.png"
    },
    "no_derps": {
        "code": 61392,
        "name": "no_derps",
        "filename": "61392.png"
    },
    "noanimepls": {
        "code": 61393,
        "name": "noanimepls",
        "filename": "61393.png"
    },
    "noice": {
        "code": 61394,
        "name": "noice",
        "filename": "61394.png"
    },
    "noob_noob": {
        "code": 61395,
        "name": "noob_noob",
        "filename": "61395.png"
    },
    "nope": {
        "code": 61396,
        "name": "nope",
        "filename": "61396.png"
    },
    "notamused": {
        "code": 61397,
        "name": "notamused",
        "filename": "61397.png"
    },
    "ohfuuuuck": {
        "code": 61398,
        "name": "ohfuuuuck",
        "filename": "61398.png"
    },
    "ohshit": {
        "code": 61399,
        "name": "ohshit",
        "filename": "61399.png"
    },
    "ohshit_puppet": {
        "code": 61400,
        "name": "ohshit_puppet",
        "filename": "61400.png"
    },
    "ohyeah": {
        "code": 61401,
        "name": "ohyeah",
        "filename": "61401.png"
    },
    "okaylib": {
        "code": 61402,
        "name": "okaylib",
        "filename": "61402.png"
    },
    "omegameganom": {
        "code": 61403,
        "name": "omegameganom",
        "filename": "61403.png"
    },
    "oooooooh_weeeeee": {
        "code": 61404,
        "name": "oooooooh_weeeeee",
        "filename": "61404.png"
    },
    "painbot": {
        "code": 61405,
        "name": "painbot",
        "filename": "61405.png"
    },
    "panik": {
        "code": 61406,
        "name": "panik",
        "filename": "61406.png"
    },
    "pat": {
        "code": 61407,
        "name": "pat",
        "filename": "61407.png"
    },
    "peaceamongworlds": {
        "code": 61408,
        "name": "peaceamongworlds",
        "filename": "61408.png"
    },
    "peepohug": {
        "code": 61409,
        "name": "peepohug",
        "filename": "61409.png"
    },
    "peeposadblankie": {
        "code": 61411,
        "name": "peeposadblankie",
        "filename": "61411.png"
    },
    "peeposlav": {
        "code": 61412,
        "name": "peeposlav",
        "filename": "61412.png"
    },
    "peeposmile": {
        "code": 61414,
        "name": "peeposmile",
        "filename": "61414.png"
    },
    "pencilvester": {
        "code": 61415,
        "name": "pencilvester",
        "filename": "61415.png"
    },
    "pensive_clown": {
        "code": 61416,
        "name": "pensive_clown",
        "filename": "61416.png"
    },
    "pepe_nerd": {
        "code": 61420,
        "name": "pepe_nerd",
        "filename": "61420.png"
    },
    "pepe_ragelaser": {
        "code": 61421,
        "name": "pepe_ragelaser",
        "filename": "61421.png"
    },
    "pepebusinessfrog": {
        "code": 61423,
        "name": "pepebusinessfrog",
        "filename": "61423.png"
    },
    "pepedinnerparty": {
        "code": 61424,
        "name": "pepedinnerparty",
        "filename": "61424.png"
    },
    "pepehorrified": {
        "code": 61426,
        "name": "pepehorrified",
        "filename": "61426.png"
    },
    "pepesuffering": {
        "code": 61427,
        "name": "pepesuffering",
        "filename": "61427.png"
    },
    "pepesweatsmile": {
        "code": 61428,
        "name": "pepesweatsmile",
        "filename": "61428.png"
    },
    "pepowoah": {
        "code": 61430,
        "name": "pepowoah",
        "filename": "61430.png"
    },
    "pepward": {
        "code": 61431,
        "name": "pepward",
        "filename": "61431.png"
    },
    "perhaps": {
        "code": 61432,
        "name": "perhaps",
        "filename": "61432.png"
    },
    "peter": {
        "code": 61433,
        "name": "peter",
        "filename": "61433.png"
    },
    "phat": {
        "code": 61434,
        "name": "phat",
        "filename": "61434.png"
    },
    "pika_aint_fuckin_around": {
        "code": 61435,
        "name": "pika_aint_fuckin_around",
        "filename": "61435.png"
    },
    "pika_gasp": {
        "code": 61436,
        "name": "pika_gasp",
        "filename": "61436.png"
    },
    "pikablush": {
        "code": 61437,
        "name": "pikablush",
        "filename": "61437.png"
    },
    "pikagun": {
        "code": 61438,
        "name": "pikagun",
        "filename": "61438.png"
    },
    "placticknifepepe": {
        "code": 61439,
        "name": "placticknifepepe",
        "filename": "61439.png"
    },
    "pneis": {
        "code": 61440,
        "name": "pneis",
        "filename": "61440.png"
    },
    "pog": {
        "code": 61441,
        "name": "pog",
        "filename": "61441.png"
    },
    "pokerface": {
        "code": 61442,
        "name": "pokerface",
        "filename": "61442.png"
    },
    "poppy": {
        "code": 61443,
        "name": "poppy",
        "filename": "61443.png"
    },
    "porygonshiny": {
        "code": 61444,
        "name": "porygonshiny",
        "filename": "61444.png"
    },
    "ptsd_dog": {
        "code": 61445,
        "name": "ptsd_dog",
        "filename": "61445.png"
    },
    "quitcapping": {
        "code": 61446,
        "name": "quitcapping",
        "filename": "61446.png"
    },
    "raccnveder": {
        "code": 61447,
        "name": "raccnveder",
        "filename": "61447.png"
    },
    "rainbow_armor": {
        "code": 61448,
        "name": "rainbow_armor",
        "filename": "61448.png"
    },
    "rape": {
        "code": 61449,
        "name": "rape",
        "filename": "61449.png"
    },
    "raygirlfriend": {
        "code": 61450,
        "name": "raygirlfriend",
        "filename": "61450.png"
    },
    "realism_skull": {
        "code": 61451,
        "name": "realism_skull",
        "filename": "61451.png"
    },
    "realshit": {
        "code": 61452,
        "name": "realshit",
        "filename": "61452.png"
    },
    "ren": {
        "code": 61453,
        "name": "ren",
        "filename": "61453.png"
    },
    "ricecake": {
        "code": 61454,
        "name": "ricecake",
        "filename": "61454.png"
    },
    "ripinpeace": {
        "code": 61455,
        "name": "ripinpeace",
        "filename": "61455.png"
    },
    "rofl_facepalm": {
        "code": 61456,
        "name": "rofl_facepalm",
        "filename": "61456.png"
    },
    "roses": {
        "code": 61457,
        "name": "roses",
        "filename": "61457.png"
    },
    "ruh_roh": {
        "code": 61458,
        "name": "ruh_roh",
        "filename": "61458.png"
    },
    "runningupthatchicken": {
        "code": 61459,
        "name": "runningupthatchicken",
        "filename": "61459.png"
    },
    "sadboi": {
        "code": 61460,
        "name": "sadboi",
        "filename": "61460.png"
    },
    "sadcat_thumbsup": {
        "code": 61461,
        "name": "sadcat_thumbsup",
        "filename": "61461.png"
    },
    "sadge1": {
        "code": 61462,
        "name": "sadge1",
        "filename": "61462.png"
    },
    "sadge2": {
        "code": 61463,
        "name": "sadge2",
        "filename": "61463.png"
    },
    "sadge3": {
        "code": 61464,
        "name": "sadge3",
        "filename": "61464.png"
    },
    "sadge4": {
        "code": 61465,
        "name": "sadge4",
        "filename": "61465.png"
    },
    "sadlad": {
        "code": 61467,
        "name": "sadlad",
        "filename": "61467.png"
    },
    "saw_that": {
        "code": 61468,
        "name": "saw_that",
        "filename": "61468.png"
    },
    "sb_wallet": {
        "code": 61469,
        "name": "sb_wallet",
        "filename": "61469.png"
    },
    "sbtriuhhuib": {
        "code": 61470,
        "name": "sbtriuhhuib",
        "filename": "61470.png"
    },
    "scientist_myself": {
        "code": 61471,
        "name": "scientist_myself",
        "filename": "61471.png"
    },
    "screamemoji": {
        "code": 61472,
        "name": "screamemoji",
        "filename": "61472.png"
    },
    "screaming_sun": {
        "code": 61473,
        "name": "screaming_sun",
        "filename": "61473.png"
    },
    "shell_shocked": {
        "code": 61474,
        "name": "shell_shocked",
        "filename": "61474.png"
    },
    "shinxing": {
        "code": 61475,
        "name": "shinxing",
        "filename": "61475.png"
    },
    "shinxpix": {
        "code": 61476,
        "name": "shinxpix",
        "filename": "61476.png"
    },
    "shinxroar": {
        "code": 61477,
        "name": "shinxroar",
        "filename": "61477.png"
    },
    "shinxsleep": {
        "code": 61478,
        "name": "shinxsleep",
        "filename": "61478.png"
    },
    "shinxwut": {
        "code": 61479,
        "name": "shinxwut",
        "filename": "61479.png"
    },
    "shinxyeah": {
        "code": 61480,
        "name": "shinxyeah",
        "filename": "61480.png"
    },
    "shitsmirk": {
        "code": 61481,
        "name": "shitsmirk",
        "filename": "61481.png"
    },
    "sic_wolf": {
        "code": 61483,
        "name": "sic_wolf",
        "filename": "61483.png"
    },
    "simpleusericon_5f3407053cf89": {
        "code": 61484,
        "name": "simpleusericon_5f3407053cf89",
        "filename": "61484.png"
    },
    "sipsip": {
        "code": 61485,
        "name": "sipsip",
        "filename": "61485.png"
    },
    "slo_______poke": {
        "code": 61486,
        "name": "slo_______poke",
        "filename": "61486.png"
    },
    "smokin": {
        "code": 61487,
        "name": "smokin",
        "filename": "61487.png"
    },
    "snowball": {
        "code": 61488,
        "name": "snowball",
        "filename": "61488.png"
    },
    "soontm": {
        "code": 61489,
        "name": "soontm",
        "filename": "61489.png"
    },
    "spacexemote": {
        "code": 61490,
        "name": "spacexemote",
        "filename": "61490.png"
    },
    "spit_take": {
        "code": 61491,
        "name": "spit_take",
        "filename": "61491.png"
    },
    "startedblasting": {
        "code": 61492,
        "name": "startedblasting",
        "filename": "61492.png"
    },
    "straightface_gun": {
        "code": 61493,
        "name": "straightface_gun",
        "filename": "61493.png"
    },
    "stronk": {
        "code": 61494,
        "name": "stronk",
        "filename": "61494.png"
    },
    "stuckinvim": {
        "code": 61495,
        "name": "stuckinvim",
        "filename": "61495.png"
    },
    "summer_and_tinkles": {
        "code": 61496,
        "name": "summer_and_tinkles",
        "filename": "61496.png"
    },
    "sussy": {
        "code": 61497,
        "name": "sussy",
        "filename": "61497.png"
    },
    "swoon": {
        "code": 61498,
        "name": "swoon",
        "filename": "61498.png"
    },
    "tatsuya": {
        "code": 61499,
        "name": "tatsuya",
        "filename": "61499.png"
    },
    "tbh_same": {
        "code": 61500,
        "name": "tbh_same",
        "filename": "61500.png"
    },
    "tendies": {
        "code": 61501,
        "name": "tendies",
        "filename": "61501.png"
    },
    "texture_missing": {
        "code": 61502,
        "name": "texture_missing",
        "filename": "61502.png"
    },
    "the_look": {
        "code": 61503,
        "name": "the_look",
        "filename": "61503.png"
    },
    "thicc": {
        "code": 61504,
        "name": "thicc",
        "filename": "61504.png"
    },
    "this_raoh": {
        "code": 61506,
        "name": "this_raoh",
        "filename": "61506.png"
    },
    "thisfuckinguy": {
        "code": 61507,
        "name": "thisfuckinguy",
        "filename": "61507.png"
    },
    "timeforacrusade": {
        "code": 61508,
        "name": "timeforacrusade",
        "filename": "61508.png"
    },
    "tinyderpface": {
        "code": 61509,
        "name": "tinyderpface",
        "filename": "61509.png"
    },
    "tired": {
        "code": 61510,
        "name": "tired",
        "filename": "61510.png"
    },
    "trollmoji": {
        "code": 61511,
        "name": "trollmoji",
        "filename": "61511.png"
    },
    "trololol": {
        "code": 61512,
        "name": "trololol",
        "filename": "61512.png"
    },
    "trudge_tomahawk": {
        "code": 61513,
        "name": "trudge_tomahawk",
        "filename": "61513.png"
    },
    "truestamp": {
        "code": 61514,
        "name": "truestamp",
        "filename": "61514.png"
    },
    "trunk_person": {
        "code": 61515,
        "name": "trunk_person",
        "filename": "61515.png"
    },
    "ugh": {
        "code": 61516,
        "name": "ugh",
        "filename": "61516.png"
    },
    "upside_down_bucket": {
        "code": 61517,
        "name": "upside_down_bucket",
        "filename": "61517.png"
    },
    "vault_mad": {
        "code": 61518,
        "name": "vault_mad",
        "filename": "61518.png"
    },
    "vault_thumb": {
        "code": 61519,
        "name": "vault_thumb",
        "filename": "61519.png"
    },
    "vault_wanderer": {
        "code": 61520,
        "name": "vault_wanderer",
        "filename": "61520.png"
    },
    "vaultsalt": {
        "code": 61521,
        "name": "vaultsalt",
        "filename": "61521.png"
    },
    "verypolite": {
        "code": 61522,
        "name": "verypolite",
        "filename": "61522.png"
    },
    "vindictivepat": {
        "code": 61523,
        "name": "vindictivepat",
        "filename": "61523.png"
    },
    "waitwhat": {
        "code": 61524,
        "name": "waitwhat",
        "filename": "61524.png"
    },
    "waminut": {
        "code": 61525,
        "name": "waminut",
        "filename": "61525.png"
    },
    "watching": {
        "code": 61526,
        "name": "watching",
        "filename": "61526.png"
    },
    "why": {
        "code": 61527,
        "name": "why",
        "filename": "61527.png"
    },
    "why_did_i_eat_this_lemon": {
        "code": 61528,
        "name": "why_did_i_eat_this_lemon",
        "filename": "61528.png"
    },
    "why_the_ski_mask_tho": {
        "code": 61529,
        "name": "why_the_ski_mask_tho",
        "filename": "61529.png"
    },
    "whynotzoidberg": {
        "code": 61530,
        "name": "whynotzoidberg",
        "filename": "61530.png"
    },
    "whyyy": {
        "code": 61531,
        "name": "whyyy",
        "filename": "61531.png"
    },
    "win_key": {
        "code": 61532,
        "name": "win_key",
        "filename": "61532.png"
    },
    "windows": {
        "code": 61533,
        "name": "windows",
        "filename": "61533.png"
    },
    "wrench": {
        "code": 61534,
        "name": "wrench",
        "filename": "61534.png"
    },
    "wtf_carl": {
        "code": 61535,
        "name": "wtf_carl",
        "filename": "61535.png"
    },
    "wtfdidijustread": {
        "code": 61536,
        "name": "wtfdidijustread",
        "filename": "61536.png"
    },
    "x_to_doubt": {
        "code": 61537,
        "name": "x_to_doubt",
        "filename": "61537.png"
    },
    "yeah_ok_fuckoff": {
        "code": 61538,
        "name": "yeah_ok_fuckoff",
        "filename": "61538.png"
    },
    "yessss": {
        "code": 61539,
        "name": "yessss",
        "filename": "61539.png"
    },
    "you_betcha": {
        "code": 61540,
        "name": "you_betcha",
        "filename": "61540.png"
    },
    "you_gun": {
        "code": 61541,
        "name": "you_gun",
        "filename": "61541.png"
    },
    "you_totem": {
        "code": 61542,
        "name": "you_totem",
        "filename": "61542.png"
    },
    "yourcrownking": {
        "code": 61543,
        "name": "yourcrownking",
        "filename": "61543.png"
    },
    "yu": {
        "code": 61544,
        "name": "yu",
        "filename": "61544.png"
    },
    "yuumi": {
        "code": 61545,
        "name": "yuumi",
        "filename": "61545.png"
    },
    "zewo_to": {
        "code": 61546,
        "name": "zewo_to",
        "filename": "61546.png"
    },
    "zzzzzzzzzzzzz": {
        "code": 61547,
        "name": "zzzzzzzzzzzzz",
        "filename": "61547.png"
    }
}
},{}],"isotope-layout":[function(require,module,exports){
/*!
 * Isotope v3.0.6
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * https://isotope.metafizzy.co
 * Copyright 2010-2018 Metafizzy
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        'outlayer/outlayer',
        'get-size/get-size',
        'desandro-matches-selector/matches-selector',
        'fizzy-ui-utils/utils',
        './item',
        './layout-mode',
        // include default layout modes
        './layout-modes/masonry',
        './layout-modes/fit-rows',
        './layout-modes/vertical'
      ],
      function( Outlayer, getSize, matchesSelector, utils, Item, LayoutMode ) {
        return factory( window, Outlayer, getSize, matchesSelector, utils, Item, LayoutMode );
      });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('outlayer'),
      require('get-size'),
      require('desandro-matches-selector'),
      require('fizzy-ui-utils'),
      require('./item'),
      require('./layout-mode'),
      // include default layout modes
      require('./layout-modes/masonry'),
      require('./layout-modes/fit-rows'),
      require('./layout-modes/vertical')
    );
  } else {
    // browser global
    window.Isotope = factory(
      window,
      window.Outlayer,
      window.getSize,
      window.matchesSelector,
      window.fizzyUIUtils,
      window.Isotope.Item,
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( window, Outlayer, getSize, matchesSelector, utils,
  Item, LayoutMode ) {

'use strict';

// -------------------------- vars -------------------------- //

var jQuery = window.jQuery;

// -------------------------- helpers -------------------------- //

var trim = String.prototype.trim ?
  function( str ) {
    return str.trim();
  } :
  function( str ) {
    return str.replace( /^\s+|\s+$/g, '' );
  };

// -------------------------- isotopeDefinition -------------------------- //

  // create an Outlayer layout class
  var Isotope = Outlayer.create( 'isotope', {
    layoutMode: 'masonry',
    isJQueryFiltering: true,
    sortAscending: true
  });

  Isotope.Item = Item;
  Isotope.LayoutMode = LayoutMode;

  var proto = Isotope.prototype;

  proto._create = function() {
    this.itemGUID = 0;
    // functions that sort items
    this._sorters = {};
    this._getSorters();
    // call super
    Outlayer.prototype._create.call( this );

    // create layout modes
    this.modes = {};
    // start filteredItems with all items
    this.filteredItems = this.items;
    // keep of track of sortBys
    this.sortHistory = [ 'original-order' ];
    // create from registered layout modes
    for ( var name in LayoutMode.modes ) {
      this._initLayoutMode( name );
    }
  };

  proto.reloadItems = function() {
    // reset item ID counter
    this.itemGUID = 0;
    // call super
    Outlayer.prototype.reloadItems.call( this );
  };

  proto._itemize = function() {
    var items = Outlayer.prototype._itemize.apply( this, arguments );
    // assign ID for original-order
    for ( var i=0; i < items.length; i++ ) {
      var item = items[i];
      item.id = this.itemGUID++;
    }
    this._updateItemsSortData( items );
    return items;
  };


  // -------------------------- layout -------------------------- //

  proto._initLayoutMode = function( name ) {
    var Mode = LayoutMode.modes[ name ];
    // set mode options
    // HACK extend initial options, back-fill in default options
    var initialOpts = this.options[ name ] || {};
    this.options[ name ] = Mode.options ?
      utils.extend( Mode.options, initialOpts ) : initialOpts;
    // init layout mode instance
    this.modes[ name ] = new Mode( this );
  };


  proto.layout = function() {
    // if first time doing layout, do all magic
    if ( !this._isLayoutInited && this._getOption('initLayout') ) {
      this.arrange();
      return;
    }
    this._layout();
  };

  // private method to be used in layout() & magic()
  proto._layout = function() {
    // don't animate first layout
    var isInstant = this._getIsInstant();
    // layout flow
    this._resetLayout();
    this._manageStamps();
    this.layoutItems( this.filteredItems, isInstant );

    // flag for initalized
    this._isLayoutInited = true;
  };

  // filter + sort + layout
  proto.arrange = function( opts ) {
    // set any options pass
    this.option( opts );
    this._getIsInstant();
    // filter, sort, and layout

    // filter
    var filtered = this._filter( this.items );
    this.filteredItems = filtered.matches;

    this._bindArrangeComplete();

    if ( this._isInstant ) {
      this._noTransition( this._hideReveal, [ filtered ] );
    } else {
      this._hideReveal( filtered );
    }

    this._sort();
    this._layout();
  };
  // alias to _init for main plugin method
  proto._init = proto.arrange;

  proto._hideReveal = function( filtered ) {
    this.reveal( filtered.needReveal );
    this.hide( filtered.needHide );
  };

  // HACK
  // Don't animate/transition first layout
  // Or don't animate/transition other layouts
  proto._getIsInstant = function() {
    var isLayoutInstant = this._getOption('layoutInstant');
    var isInstant = isLayoutInstant !== undefined ? isLayoutInstant :
      !this._isLayoutInited;
    this._isInstant = isInstant;
    return isInstant;
  };

  // listen for layoutComplete, hideComplete and revealComplete
  // to trigger arrangeComplete
  proto._bindArrangeComplete = function() {
    // listen for 3 events to trigger arrangeComplete
    var isLayoutComplete, isHideComplete, isRevealComplete;
    var _this = this;
    function arrangeParallelCallback() {
      if ( isLayoutComplete && isHideComplete && isRevealComplete ) {
        _this.dispatchEvent( 'arrangeComplete', null, [ _this.filteredItems ] );
      }
    }
    this.once( 'layoutComplete', function() {
      isLayoutComplete = true;
      arrangeParallelCallback();
    });
    this.once( 'hideComplete', function() {
      isHideComplete = true;
      arrangeParallelCallback();
    });
    this.once( 'revealComplete', function() {
      isRevealComplete = true;
      arrangeParallelCallback();
    });
  };

  // -------------------------- filter -------------------------- //

  proto._filter = function( items ) {
    var filter = this.options.filter;
    filter = filter || '*';
    var matches = [];
    var hiddenMatched = [];
    var visibleUnmatched = [];

    var test = this._getFilterTest( filter );

    // test each item
    for ( var i=0; i < items.length; i++ ) {
      var item = items[i];
      if ( item.isIgnored ) {
        continue;
      }
      // add item to either matched or unmatched group
      var isMatched = test( item );
      // item.isFilterMatched = isMatched;
      // add to matches if its a match
      if ( isMatched ) {
        matches.push( item );
      }
      // add to additional group if item needs to be hidden or revealed
      if ( isMatched && item.isHidden ) {
        hiddenMatched.push( item );
      } else if ( !isMatched && !item.isHidden ) {
        visibleUnmatched.push( item );
      }
    }

    // return collections of items to be manipulated
    return {
      matches: matches,
      needReveal: hiddenMatched,
      needHide: visibleUnmatched
    };
  };

  // get a jQuery, function, or a matchesSelector test given the filter
  proto._getFilterTest = function( filter ) {
    if ( jQuery && this.options.isJQueryFiltering ) {
      // use jQuery
      return function( item ) {
        return jQuery( item.element ).is( filter );
      };
    }
    if ( typeof filter == 'function' ) {
      // use filter as function
      return function( item ) {
        return filter( item.element );
      };
    }
    // default, use filter as selector string
    return function( item ) {
      return matchesSelector( item.element, filter );
    };
  };

  // -------------------------- sorting -------------------------- //

  /**
   * @params {Array} elems
   * @public
   */
  proto.updateSortData = function( elems ) {
    // get items
    var items;
    if ( elems ) {
      elems = utils.makeArray( elems );
      items = this.getItems( elems );
    } else {
      // update all items if no elems provided
      items = this.items;
    }

    this._getSorters();
    this._updateItemsSortData( items );
  };

  proto._getSorters = function() {
    var getSortData = this.options.getSortData;
    for ( var key in getSortData ) {
      var sorter = getSortData[ key ];
      this._sorters[ key ] = mungeSorter( sorter );
    }
  };

  /**
   * @params {Array} items - of Isotope.Items
   * @private
   */
  proto._updateItemsSortData = function( items ) {
    // do not update if no items
    var len = items && items.length;

    for ( var i=0; len && i < len; i++ ) {
      var item = items[i];
      item.updateSortData();
    }
  };

  // ----- munge sorter ----- //

  // encapsulate this, as we just need mungeSorter
  // other functions in here are just for munging
  var mungeSorter = ( function() {
    // add a magic layer to sorters for convienent shorthands
    // `.foo-bar` will use the text of .foo-bar querySelector
    // `[foo-bar]` will use attribute
    // you can also add parser
    // `.foo-bar parseInt` will parse that as a number
    function mungeSorter( sorter ) {
      // if not a string, return function or whatever it is
      if ( typeof sorter != 'string' ) {
        return sorter;
      }
      // parse the sorter string
      var args = trim( sorter ).split(' ');
      var query = args[0];
      // check if query looks like [an-attribute]
      var attrMatch = query.match( /^\[(.+)\]$/ );
      var attr = attrMatch && attrMatch[1];
      var getValue = getValueGetter( attr, query );
      // use second argument as a parser
      var parser = Isotope.sortDataParsers[ args[1] ];
      // parse the value, if there was a parser
      sorter = parser ? function( elem ) {
        return elem && parser( getValue( elem ) );
      } :
      // otherwise just return value
      function( elem ) {
        return elem && getValue( elem );
      };

      return sorter;
    }

    // get an attribute getter, or get text of the querySelector
    function getValueGetter( attr, query ) {
      // if query looks like [foo-bar], get attribute
      if ( attr ) {
        return function getAttribute( elem ) {
          return elem.getAttribute( attr );
        };
      }

      // otherwise, assume its a querySelector, and get its text
      return function getChildText( elem ) {
        var child = elem.querySelector( query );
        return child && child.textContent;
      };
    }

    return mungeSorter;
  })();

  // parsers used in getSortData shortcut strings
  Isotope.sortDataParsers = {
    'parseInt': function( val ) {
      return parseInt( val, 10 );
    },
    'parseFloat': function( val ) {
      return parseFloat( val );
    }
  };

  // ----- sort method ----- //

  // sort filteredItem order
  proto._sort = function() {
    if ( !this.options.sortBy ) {
      return;
    }
    // keep track of sortBy History
    var sortBys = utils.makeArray( this.options.sortBy );
    if ( !this._getIsSameSortBy( sortBys ) ) {
      // concat all sortBy and sortHistory, add to front, oldest goes in last
      this.sortHistory = sortBys.concat( this.sortHistory );
    }
    // sort magic
    var itemSorter = getItemSorter( this.sortHistory, this.options.sortAscending );
    this.filteredItems.sort( itemSorter );
  };

  // check if sortBys is same as start of sortHistory
  proto._getIsSameSortBy = function( sortBys ) {
    for ( var i=0; i < sortBys.length; i++ ) {
      if ( sortBys[i] != this.sortHistory[i] ) {
        return false;
      }
    }
    return true;
  };

  // returns a function used for sorting
  function getItemSorter( sortBys, sortAsc ) {
    return function sorter( itemA, itemB ) {
      // cycle through all sortKeys
      for ( var i = 0; i < sortBys.length; i++ ) {
        var sortBy = sortBys[i];
        var a = itemA.sortData[ sortBy ];
        var b = itemB.sortData[ sortBy ];
        if ( a > b || a < b ) {
          // if sortAsc is an object, use the value given the sortBy key
          var isAscending = sortAsc[ sortBy ] !== undefined ? sortAsc[ sortBy ] : sortAsc;
          var direction = isAscending ? 1 : -1;
          return ( a > b ? 1 : -1 ) * direction;
        }
      }
      return 0;
    };
  }

  // -------------------------- methods -------------------------- //

  // get layout mode
  proto._mode = function() {
    var layoutMode = this.options.layoutMode;
    var mode = this.modes[ layoutMode ];
    if ( !mode ) {
      // TODO console.error
      throw new Error( 'No layout mode: ' + layoutMode );
    }
    // HACK sync mode's options
    // any options set after init for layout mode need to be synced
    mode.options = this.options[ layoutMode ];
    return mode;
  };

  proto._resetLayout = function() {
    // trigger original reset layout
    Outlayer.prototype._resetLayout.call( this );
    this._mode()._resetLayout();
  };

  proto._getItemLayoutPosition = function( item  ) {
    return this._mode()._getItemLayoutPosition( item );
  };

  proto._manageStamp = function( stamp ) {
    this._mode()._manageStamp( stamp );
  };

  proto._getContainerSize = function() {
    return this._mode()._getContainerSize();
  };

  proto.needsResizeLayout = function() {
    return this._mode().needsResizeLayout();
  };

  // -------------------------- adding & removing -------------------------- //

  // HEADS UP overwrites default Outlayer appended
  proto.appended = function( elems ) {
    var items = this.addItems( elems );
    if ( !items.length ) {
      return;
    }
    // filter, layout, reveal new items
    var filteredItems = this._filterRevealAdded( items );
    // add to filteredItems
    this.filteredItems = this.filteredItems.concat( filteredItems );
  };

  // HEADS UP overwrites default Outlayer prepended
  proto.prepended = function( elems ) {
    var items = this._itemize( elems );
    if ( !items.length ) {
      return;
    }
    // start new layout
    this._resetLayout();
    this._manageStamps();
    // filter, layout, reveal new items
    var filteredItems = this._filterRevealAdded( items );
    // layout previous items
    this.layoutItems( this.filteredItems );
    // add to items and filteredItems
    this.filteredItems = filteredItems.concat( this.filteredItems );
    this.items = items.concat( this.items );
  };

  proto._filterRevealAdded = function( items ) {
    var filtered = this._filter( items );
    this.hide( filtered.needHide );
    // reveal all new items
    this.reveal( filtered.matches );
    // layout new items, no transition
    this.layoutItems( filtered.matches, true );
    return filtered.matches;
  };

  /**
   * Filter, sort, and layout newly-appended item elements
   * @param {Array or NodeList or Element} elems
   */
  proto.insert = function( elems ) {
    var items = this.addItems( elems );
    if ( !items.length ) {
      return;
    }
    // append item elements
    var i, item;
    var len = items.length;
    for ( i=0; i < len; i++ ) {
      item = items[i];
      this.element.appendChild( item.element );
    }
    // filter new stuff
    var filteredInsertItems = this._filter( items ).matches;
    // set flag
    for ( i=0; i < len; i++ ) {
      items[i].isLayoutInstant = true;
    }
    this.arrange();
    // reset flag
    for ( i=0; i < len; i++ ) {
      delete items[i].isLayoutInstant;
    }
    this.reveal( filteredInsertItems );
  };

  var _remove = proto.remove;
  proto.remove = function( elems ) {
    elems = utils.makeArray( elems );
    var removeItems = this.getItems( elems );
    // do regular thing
    _remove.call( this, elems );
    // bail if no items to remove
    var len = removeItems && removeItems.length;
    // remove elems from filteredItems
    for ( var i=0; len && i < len; i++ ) {
      var item = removeItems[i];
      // remove item from collection
      utils.removeFrom( this.filteredItems, item );
    }
  };

  proto.shuffle = function() {
    // update random sortData
    for ( var i=0; i < this.items.length; i++ ) {
      var item = this.items[i];
      item.sortData.random = Math.random();
    }
    this.options.sortBy = 'random';
    this._sort();
    this._layout();
  };

  /**
   * trigger fn without transition
   * kind of hacky to have this in the first place
   * @param {Function} fn
   * @param {Array} args
   * @returns ret
   * @private
   */
  proto._noTransition = function( fn, args ) {
    // save transitionDuration before disabling
    var transitionDuration = this.options.transitionDuration;
    // disable transition
    this.options.transitionDuration = 0;
    // do it
    var returnValue = fn.apply( this, args );
    // re-enable transition for reveal
    this.options.transitionDuration = transitionDuration;
    return returnValue;
  };

  // ----- helper methods ----- //

  /**
   * getter method for getting filtered item elements
   * @returns {Array} elems - collection of item elements
   */
  proto.getFilteredItemElements = function() {
    return this.filteredItems.map( function( item ) {
      return item.element;
    });
  };

  // -----  ----- //

  return Isotope;

}));

},{"./item":6,"./layout-mode":7,"./layout-modes/fit-rows":8,"./layout-modes/masonry":9,"./layout-modes/vertical":10,"desandro-matches-selector":2,"fizzy-ui-utils":4,"get-size":5,"outlayer":13}],"jquery":[function(require,module,exports){
/*!
 * jQuery JavaScript Library v3.6.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2022-08-26T17:52Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket trac-14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.6.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.6
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2021-02-16
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem && elem.namespaceURI,
		docElem = elem && ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (trac-9521)
	// Strict HTML recognition (trac-11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See trac-6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (trac-9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see trac-8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (trac-14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (trac-11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (trac-14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (trac-13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (trac-15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (trac-12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (trac-13208)
				// Don't process clicks on disabled elements (trac-6911, trac-8165, trac-11382, trac-11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (trac-13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						// Support: Chrome 86+
						// In Chrome, if an element having a focusout handler is blurred by
						// clicking outside of it, it invokes the handler synchronously. If
						// that handler calls `.remove()` on the element, the data is cleared,
						// leaving `result` undefined. We need to guard against this.
						return result && result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (trac-504, trac-13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		// Suppress native focus or blur if we're currently inside
		// a leveraged native-event stack
		_default: function( event ) {
			return dataPriv.get( event.target, type );
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

	rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (trac-8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {

							// Unwrap a CDATA section containing script contents. This shouldn't be
							// needed as in XML documents they're already not visible when
							// inspecting element contents and in HTML documents they have no
							// meaning but we're preserving that logic for backwards compatibility.
							// This will be removed completely in 4.0. See gh-4904.
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var rcustomProp = /^--/;


var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (trac-15098, trac-14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );

var whitespace = "[\\x20\\t\\r\\n\\f]";


var rtrimCSS = new RegExp(
	"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
	"g"
);




( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (trac-8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is display: block
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		isCustomProp = rcustomProp.test( name ),

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, trac-12537)
	//   .css('--customProperty) (gh-3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		// trim whitespace for custom property (issue gh-4926)
		if ( isCustomProp ) {

			// rtrim treats U+000D CARRIAGE RETURN and U+000C FORM FEED
			// as whitespace while CSS does not, but this is not a problem
			// because CSS preprocessing replaces them with U+000A LINE FEED
			// (which *is* CSS whitespace)
			// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
			ret = ret.replace( rtrimCSS, "$1" );
		}

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (trac-7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug trac-9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (trac-7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (trac-12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// Use proper attribute retrieval (trac-12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];
						if ( cur.indexOf( " " + className + " " ) < 0 ) {
							cur += className + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );

				// This expression is here for better compressibility (see addClass)
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];

						// Remove *all* instances
						while ( cur.indexOf( " " + className + " " ) > -1 ) {
							cur = cur.replace( " " + className + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var classNames, className, i, self,
			type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		classNames = classesToArray( value );

		return this.each( function() {
			if ( isValidValue ) {

				// Toggle individual class names
				self = jQuery( this );

				for ( i = 0; i < classNames.length; i++ ) {
					className = classNames[ i ];

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (trac-14686, trac-14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (trac-2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (trac-9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (trac-9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (trac-6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// trac-7653, trac-8125, trac-8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (trac-10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes trac-9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (trac-10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket trac-12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (trac-15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// trac-9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (trac-11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// trac-1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see trac-8605, trac-14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// trac-14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
// Require that the "whitespace run" starts from a non-whitespace
// to avoid O(N^2) behavior when the engine would try matching "\s+$" at each space position.
var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "$1" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (trac-7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (trac-13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{}]},{},[14]);
