window.require.register('adapters/Canvas', function(require, module) {
var CanvasAdapter;

CanvasAdapter = (function() {

  function CanvasAdapter(rawOptions) {
    var $canvasEl, options;
    if (rawOptions == null) {
      rawOptions = {};
    }
    options = _.defaults(rawOptions, this.DEFAULT_OPTIONS);
    $canvasEl = $('<canvas>');
    $canvasEl.attr({
      width: options.width * options.devicePixelRatio,
      height: options.height * options.devicePixelRatio
    });
    $canvasEl.css({
      width: options.width,
      height: options.height
    });
    $(options.selector).append($canvasEl);
    this.el = $canvasEl.get(0);
  }

  CanvasAdapter.prototype.DEFAULT_OPTIONS = {
    width: 480,
    height: 320,
    selector: 'body',
    devicePixelRatio: 1
  };

  CanvasAdapter.prototype.dispose = function() {
    return this.el.remove();
  };

  return CanvasAdapter;

})();

module.exports = CanvasAdapter;

});

window.require.register('config', function(require, module) {
var config, utils;

utils = require('utils');

config = {
  debug: false,
  development: true,
  fps: 60,
  tileWidth: 16,
  tileHeight: 16,
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  width: $(window).width(),
  height: $(window).height(),
  namespace: 'com.idlesync.prismr.0.5.0',
  devicePixelRatio: window.devicePixelRatio || 1,
  loadManifest: []
};

config.loadManifest = [
  {
    id: 'error',
    src: 'sounds/ui-error-chime.ogg'
  }, {
    id: 'select',
    src: 'sounds/ui-select-chime.ogg'
  }, {
    id: 'tileset',
    src: "images/prismr-" + config.devicePixelRatio + "x.png"
  }
];

if (!config.isMobile) {
  if (config.debug) {
    config.width = 320;
    config.height = 480;
  } else {
    config.width = 320;
    config.height = 480;
  }
}

config.isLevelAnswerScene = utils.getQueryVariable('levelAnswer');

if (config.isLevelAnswerScene) {
  config.debug = true;
  config.development = true;
  config.width = 320;
  config.height = 480 - 96;
}

config.canvasAdapterOptions = {
  selector: '#canvas-container',
  width: config.width,
  height: config.height,
  devicePixelRatio: config.devicePixelRatio
};

module.exports = config;

});

window.require.register('index', function(require, module) {
var CanvasAdapter, StageView, config, playerModel, tracker, utils;

CanvasAdapter = require('adapters/Canvas');

StageView = require('views/Stage');

config = require('config');

utils = require('utils');

playerModel = require('models/player');

tracker = require('tracker');

utils.loadAssets(config.loadManifest, function() {
  var canvasAdapter, level, options, sceneLocation, stageView;
  canvasAdapter = new CanvasAdapter(config.canvasAdapterOptions);
  stageView = new StageView(canvasAdapter.el);
  if (playerModel.getLevel() == null) {
    playerModel.setLevel(0);
  }
  sceneLocation = 'scenes/MainMenu';
  options = {};
  level = utils.getQueryVariable('levelAnswer');
  if (level) {
    sceneLocation = 'scenes/LevelBuilder';
    config.debug = true;
    options.level = level - 1;
  }
  EventBus.dispatch('!scene:load', this, {
    sceneLocation: sceneLocation,
    options: options
  });
  return tracker.track('Load Images');
});

tracker.register({
  isMobile: config.isMobile,
  width: config.width,
  height: config.height,
  namespace: config.namespace,
  devicePixelRatio: config.devicePixelRatio,
  isLevelAnswerScene: config.isLevelAnswerScene
});

tracker.track('Page Load');

});

window.require.register('levels/all', function(require, module) {

module.exports = [
  {
    "width": 320,
    "height": 480,
    "prism": {
      "x": 160,
      "y": 240
    },
    "orbs": [
      {
        "x": 126,
        "y": 410,
        "color": "violet"
      }
    ],
    "obstacles": [
      {
        "x": 160,
        "y": 331,
        "vertices": [[1, 30], [-31, 11], [-41, -14], [32, -5]]
      }
    ]
  }, {
    "width": 320,
    "height": 480,
    "prism": {
      "x": 178,
      "y": 118
    },
    "orbs": [
      {
        "x": 52,
        "y": 362,
        "color": "violet"
      }, {
        "x": 107,
        "y": 234,
        "color": "blue"
      }
    ],
    "obstacles": [
      {
        "x": 145,
        "y": 262,
        "vertices": [[37, 43], [-34, 12], [23, -40]]
      }
    ]
  }, {
    "width": 320,
    "height": 480,
    "prism": {
      "x": 140,
      "y": 113
    },
    "orbs": [
      {
        "x": 105,
        "y": 311,
        "color": "red"
      }, {
        "x": 283,
        "y": 267,
        "color": "orange"
      }
    ],
    "obstacles": [
      {
        "x": 174,
        "y": 233,
        "vertices": [[31, 45], [-48, -5], [20, -13]]
      }
    ]
  }, {
    "width": 320,
    "height": 480,
    "prism": {
      "x": 284,
      "y": 25
    },
    "orbs": [
      {
        "x": 49,
        "y": 105,
        "color": "red"
      }, {
        "x": 296,
        "y": 328,
        "color": "yellow"
      }, {
        "x": 260,
        "y": 100,
        "color": "violet"
      }
    ],
    "obstacles": [
      {
        "x": 62,
        "y": 362,
        "vertices": [[33, 20], [-1, 56], [-5, -41], [31, -6]]
      }, {
        "x": 215,
        "y": 108,
        "vertices": [[45, 29], [-44, -19], [35, -31]]
      }
    ]
  }, {
    "width": 320,
    "height": 480,
    "prism": {
      "x": 137,
      "y": 37
    },
    "orbs": [
      {
        "x": 17,
        "y": 268,
        "color": "red"
      }, {
        "x": 61,
        "y": 100,
        "color": "orange"
      }, {
        "x": 249,
        "y": 176,
        "color": "yellow"
      }, {
        "x": 125,
        "y": 77,
        "color": "green"
      }
    ],
    "obstacles": [
      {
        "x": 270,
        "y": 323,
        "vertices": [[7, 24], [-54, -3], [28, -15]]
      }, {
        "x": 88,
        "y": 351,
        "vertices": [[37, 1], [-21, 48], [-15, -21], [24, -1]]
      }, {
        "x": 128,
        "y": 194,
        "vertices": [[37, 46], [-39, 7], [-5, -24], [25, -43]]
      }
    ]
  }, {
    "width": 480,
    "height": 528,
    "prism": {
      "x": 172,
      "y": 79
    },
    "orbs": [
      {
        "x": 234,
        "y": 284,
        "color": 'red'
      }, {
        "x": 54,
        "y": 106,
        "color": 'orange'
      }, {
        "x": 37,
        "y": 168,
        "color": 'yellow'
      }, {
        "x": 315,
        "y": 20,
        "color": 'green'
      }, {
        "x": 7,
        "y": 256,
        "color": 'blue'
      }, {
        "x": 145,
        "y": 429,
        "color": 'violet'
      }
    ],
    "obstacles": [
      {
        "x": 88,
        "y": 270,
        "vertices": [[28, 84], [-48, 6], [-7, -80], [50, -3]]
      }, {
        "x": 272,
        "y": 136,
        "vertices": [[33, 46], [-38, 6], [-16, -28], [15, -77]]
      }, {
        "x": 173,
        "y": 381,
        "vertices": [[36, 32], [0, 79], [-15, -69], [37, -41]]
      }, {
        "x": 403,
        "y": 325,
        "vertices": [[-10, 83], [-64, 9], [67, -35]]
      }
    ]
  }, {
    "width": 480,
    "height": 528,
    "prism": {
      "x": 241,
      "y": 256
    },
    "orbs": [
      {
        "x": 19,
        "y": 337,
        "color": "red"
      }, {
        "x": 70,
        "y": 32,
        "color": "orange"
      }, {
        "x": 111,
        "y": 172,
        "color": "yellow"
      }, {
        "x": 175,
        "y": 356,
        "color": "green"
      }, {
        "x": 281,
        "y": 172,
        "color": "blue"
      }, {
        "x": 251,
        "y": 49,
        "color": "violet"
      }
    ],
    "obstacles": [
      {
        "x": 94,
        "y": 399,
        "vertices": [[63, 26], [-41, 36], [-42, -69], [31, -11]]
      }, {
        "x": 336,
        "y": 142,
        "vertices": [[80, 31], [-37, 61], [-20, -41]]
      }, {
        "x": 210,
        "y": 148,
        "vertices": [[18, 48], [-3, 72], [-43, -71], [15, -26]]
      }, {
        "x": 323,
        "y": 383,
        "vertices": [[4, 39], [-27, -15], [59, -43]]
      }
    ]
  }, {
    "width": 480,
    "height": 528,
    "prism": {
      "x": 447,
      "y": 339
    },
    "orbs": [
      {
        "x": 257,
        "y": 456,
        "color": 'red'
      }, {
        "x": 213,
        "y": 460,
        "color": 'orange'
      }, {
        "x": 460,
        "y": 407,
        "color": 'yellow'
      }, {
        "x": 80,
        "y": 417,
        "color": 'green'
      }, {
        "x": 420,
        "y": 33,
        "color": 'blue'
      }, {
        "x": 399,
        "y": 495,
        "color": 'violet'
      }
    ],
    "obstacles": [
      {
        "x": 375,
        "y": 81,
        "vertices": [[28, 61], [-48, -45], [25, -50]]
      }, {
        "x": 138,
        "y": 99,
        "vertices": [[20, 48], [-39, 40], [-81, -10], [10, -35]]
      }, {
        "x": 388,
        "y": 435,
        "vertices": [[-10, 54], [-56, 26], [16, -63]]
      }, {
        "x": 120,
        "y": 363,
        "vertices": [[75, 5], [-40, -39], [27, -84]]
      }
    ]
  }, {
    "width": 480,
    "height": 528,
    "prism": {
      "x": 371,
      "y": 280
    },
    "orbs": [
      {
        "x": 190,
        "y": 396,
        "color": 'red'
      }, {
        "x": 325,
        "y": 417,
        "color": 'orange'
      }, {
        "x": 239,
        "y": 74,
        "color": 'yellow'
      }, {
        "x": 362,
        "y": 83,
        "color": 'green'
      }, {
        "x": 38,
        "y": 110,
        "color": 'blue'
      }, {
        "x": 331,
        "y": 31,
        "color": 'violet'
      }
    ],
    "obstacles": [
      {
        "x": 292,
        "y": 440,
        "vertices": [[13, 33], [-57, -23], [-18, -61]]
      }, {
        "x": 179,
        "y": 109,
        "vertices": [[63, 36], [-38, 45], [16, -48]]
      }, {
        "x": 330,
        "y": 158,
        "vertices": [[0, 35], [-37, -17], [1, -63]]
      }, {
        "x": 69,
        "y": 185,
        "vertices": [[28, 24], [-47, 37], [-13, -53], [38, -25]]
      }
    ]
  }, {
    "width": 480,
    "height": 528,
    "prism": {
      "x": 430,
      "y": 61
    },
    "orbs": [
      {
        "x": 235,
        "y": 232,
        "color": 'red'
      }, {
        "x": 459,
        "y": 395,
        "color": 'orange'
      }, {
        "x": 7,
        "y": 354,
        "color": 'yellow'
      }, {
        "x": 347,
        "y": 15,
        "color": 'green'
      }, {
        "x": 249,
        "y": 33,
        "color": 'blue'
      }, {
        "x": 14,
        "y": 404,
        "color": 'violet'
      }
    ],
    "obstacles": [
      {
        "x": 264,
        "y": 78,
        "vertices": [[79, 23], [-12, 47], [-84, -5], [85, -22]]
      }, {
        "x": 120,
        "y": 351,
        "vertices": [[53, 23], [-44, 74], [-34, -11], [75, -23]]
      }, {
        "x": 362,
        "y": 454,
        "vertices": [[30, 20], [-33, 18], [14, -83]]
      }
    ]
  }, {
    "width": 320,
    "height": 384,
    "prism": {
      "x": 210,
      "y": 279
    },
    "orbs": [
      {
        "x": 293,
        "y": 364,
        "color": "red"
      }, {
        "x": 275,
        "y": 159,
        "color": "orange"
      }, {
        "x": 131,
        "y": 112,
        "color": "yellow"
      }, {
        "x": 281,
        "y": 201,
        "color": "green"
      }, {
        "x": 278,
        "y": 22,
        "color": "blue"
      }, {
        "x": 101,
        "y": 213,
        "color": "violet"
      }
    ],
    "obstacles": [
      {
        "x": 254,
        "y": 240,
        "vertices": [[4, 53], [-18, 9], [-28, -10], [1, -22]]
      }, {
        "x": 113,
        "y": 271,
        "vertices": [[-1, 34], [-27, -22], [17, -44]]
      }, {
        "x": 98,
        "y": 63,
        "vertices": [[17, 52], [-58, -8], [30, -14]]
      }, {
        "x": 272,
        "y": 99,
        "vertices": [[-12, 34], [-43, -24], [1, -24]]
      }
    ]
  }, {
    "width": 320,
    "height": 384,
    "prism": {
      "x": 187,
      "y": 281
    },
    "orbs": [
      {
        "x": 289,
        "y": 10,
        "color": "red"
      }, {
        "x": 13,
        "y": 93,
        "color": "orange"
      }, {
        "x": 267,
        "y": 246,
        "color": "yellow"
      }, {
        "x": 35,
        "y": 176,
        "color": "green"
      }, {
        "x": 263,
        "y": 296,
        "color": "blue"
      }, {
        "x": 48,
        "y": 352,
        "color": "violet"
      }
    ],
    "obstacles": [
      {
        "x": 193,
        "y": 223,
        "vertices": [[0, 21], [-48, 29], [11, -34]]
      }, {
        "x": 50,
        "y": 125,
        "vertices": [[19, 16], [-25, 24], [-2, -21], [12, -26]]
      }, {
        "x": 242,
        "y": 126,
        "vertices": [[27, 49], [-43, 35], [-35, -11], [46, -6]]
      }, {
        "x": 81,
        "y": 327,
        "vertices": [[51, 2], [-32, 11], [-28, -44], [34, -40]]
      }
    ]
  }, {
    "width": 320,
    "height": 384,
    "prism": {
      "x": 165,
      "y": 21
    },
    "orbs": [
      {
        "x": 22,
        "y": 181,
        "color": "red"
      }, {
        "x": 287,
        "y": 309,
        "color": "orange"
      }, {
        "x": 130,
        "y": 143,
        "color": "yellow"
      }, {
        "x": 17,
        "y": 348,
        "color": "green"
      }, {
        "x": 289,
        "y": 48,
        "color": "blue"
      }, {
        "x": 223,
        "y": 362,
        "color": "violet"
      }
    ],
    "obstacles": [
      {
        "x": 241,
        "y": 292,
        "vertices": [[6, 31], [-19, 20], [-31, -29], [27, -5]]
      }, {
        "x": 147,
        "y": 167,
        "vertices": [[26, 9], [-44, 3], [34, -10]]
      }, {
        "x": 124,
        "y": 294,
        "vertices": [[25, 27], [-53, 24], [55, -7]]
      }, {
        "x": 253,
        "y": 72,
        "vertices": [[40, 25], [-28, 40], [11, -23]]
      }
    ]
  }, {
    "width": 320,
    "height": 384,
    "prism": {
      "x": 224,
      "y": 309
    },
    "orbs": [
      {
        "x": 221,
        "y": 147,
        "color": "red"
      }, {
        "x": 70,
        "y": 325,
        "color": "orange"
      }, {
        "x": 58,
        "y": 178,
        "color": "yellow"
      }, {
        "x": 271,
        "y": 44,
        "color": "green"
      }, {
        "x": 64,
        "y": 33,
        "color": "blue"
      }, {
        "x": 132,
        "y": 122,
        "color": "violet"
      }
    ],
    "obstacles": [
      {
        "x": 268,
        "y": 114,
        "vertices": [[37, 44], [-45, -20], [29, -12]]
      }, {
        "x": 121,
        "y": 263,
        "vertices": [[-14, 33], [-30, 28], [22, -42]]
      }, {
        "x": 101,
        "y": 130,
        "vertices": [[18, 8], [-41, -35], [15, -26]]
      }
    ]
  }, {
    "width": 320,
    "height": 480,
    "prism": {
      "x": 237.5,
      "y": 421
    },
    "orbs": [
      {
        "x": 261.5,
        "y": 139,
        "color": "red"
      }, {
        "x": 43.5,
        "y": 182,
        "color": "orange"
      }, {
        "x": 242.5,
        "y": 374,
        "color": "yellow"
      }, {
        "x": 131.5,
        "y": 63,
        "color": "green"
      }, {
        "x": 63.5,
        "y": 293,
        "color": "blue"
      }, {
        "x": 71.5,
        "y": 410,
        "color": "violet"
      }
    ],
    "obstacles": [
      {
        "x": 96.5,
        "y": 363,
        "vertices": [[48, 26], [-46, -25], [20, -25]]
      }, {
        "x": 81.5,
        "y": 252,
        "vertices": [[34, 2], [-41, 2], [-50, -30], [52, -3]]
      }, {
        "x": 230.5,
        "y": 298,
        "vertices": [[40, 17], [-47, 1], [53, -12]]
      }, {
        "x": 113.5,
        "y": 127,
        "vertices": [[6, 57], [-21, 0], [19, -24]]
      }, {
        "x": 270.5,
        "y": 211,
        "vertices": [[18, 52], [-10, 23], [-19, -34], [14, -20]]
      }, {
        "x": 209.5,
        "y": 67,
        "vertices": [[42, 6], [-21, 26], [-12, -38]]
      }, {
        "x": 189.5,
        "y": 185,
        "vertices": [[24, 11], [-34, 43], [-25, -23], [45, -17]]
      }, {
        "x": 59.5,
        "y": 70,
        "vertices": [[23, 6], [-38, 9], [-10, -29], [2, -54]]
      }
    ]
  }
];

});

window.require.register('lib/Visibility', function(require, module) {
var Block, EndPoint, Point, Segment, Visibility, endpointCompare, interpolate, leftOf, lineIntersection, segmentInFrontOf,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Visibility = (function() {

  function Visibility() {
    this.segments = [];
    this.endpoints = [];
    this.open = [];
    this.center = new Point(0, 0);
    this.output = [];
  }

  Visibility.prototype.loadMap = function(width, height, margin, blocks, walls) {
    var p1, p2, r, x, y, _i, _j, _len, _len1, _ref, _ref1, _results;
    this.segments = [];
    this.endpoints = [];
    this.loadEdgeOfMap(width, height, margin);
    for (_i = 0, _len = blocks.length; _i < _len; _i++) {
      _ref = blocks[_i], x = _ref.x, y = _ref.y, r = _ref.r;
      this.addSegment(x - r, y - r, x - r, y + r);
      this.addSegment(x - r, y + r, x + r, y + r);
      this.addSegment(x + r, y + r, x + r, y - r);
      this.addSegment(x + r, y - r, x - r, y - r);
    }
    _results = [];
    for (_j = 0, _len1 = walls.length; _j < _len1; _j++) {
      _ref1 = walls[_j], p1 = _ref1.p1, p2 = _ref1.p2;
      _results.push(this.addSegment(p1.x, p1.y, p2.x, p2.y));
    }
    return _results;
  };

  Visibility.prototype.loadEdgeOfMap = function(width, height, margin) {
    this.addSegment(margin, margin, margin, height - margin);
    this.addSegment(margin, height - margin, width - margin, height - margin);
    this.addSegment(width - margin, height - margin, width - margin, margin);
    return this.addSegment(width - margin, margin, margin, margin);
  };

  Visibility.prototype.addSegment = function(x1, y1, x2, y2) {
    var p1, p2, segment;
    segment = null;
    p1 = new EndPoint(0, 0);
    p1.segment = segment;
    p1.visualize = true;
    p2 = new EndPoint(0, 0);
    p2.segment = segment;
    p2.visualize = false;
    segment = new Segment;
    p1.x = x1;
    p1.y = y1;
    p2.x = x2;
    p2.y = y2;
    p1.segment = segment;
    p2.segment = segment;
    segment.p1 = p1;
    segment.p2 = p2;
    segment.d = 0;
    this.segments.push(segment);
    this.endpoints.push(p1);
    return this.endpoints.push(p2);
  };

  Visibility.prototype.setLightLocation = function(x, y) {
    var dAngle, dx, dy, segment, _i, _len, _ref, _results;
    this.center.x = x;
    this.center.y = y;
    _ref = this.segments;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      segment = _ref[_i];
      dx = 0.5 * (segment.p1.x + segment.p2.x) - x;
      dy = 0.5 * (segment.p1.y + segment.p2.y) - y;
      segment.d = dx * dx + dy * dy;
      segment.p1.angle = Math.atan2(segment.p1.y - y, segment.p1.x - x);
      segment.p2.angle = Math.atan2(segment.p2.y - y, segment.p2.x - x);
      dAngle = segment.p2.angle - segment.p1.angle;
      if (dAngle <= 0 - Math.PI) {
        dAngle += 2 * Math.PI;
      }
      if (dAngle > Math.PI) {
        dAngle -= 2 * Math.PI;
      }
      segment.p1.begin = dAngle > 0;
      _results.push(segment.p2.begin = !segment.p1.begin);
    }
    return _results;
  };

  Visibility.prototype.sweep = function(maxAngle) {
    var beginAngle, currentNew, currentOld, node, nodeIndex, p, pass, segmentIndex, _i, _results;
    if (maxAngle == null) {
      maxAngle = 999;
    }
    this.output = [];
    this.endpoints.sort(endpointCompare);
    this.open = [];
    beginAngle = 0;
    _results = [];
    for (pass = _i = 0; _i < 2; pass = ++_i) {
      _results.push((function() {
        var _j, _len, _ref, _results1;
        _ref = this.endpoints;
        _results1 = [];
        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
          p = _ref[_j];
          if (pass === 1 && p.angle > maxAngle) {
            break;
          }
          currentOld = this.open.length === 0 ? null : this.open[0];
          if (p.begin) {
            node = this.open[0];
            nodeIndex = 0;
            while (node && segmentInFrontOf(p.segment, node, this.center)) {
              nodeIndex++;
              node = this.open[nodeIndex];
            }
            if (!node) {
              this.open.push(p.segment);
            } else {
              this.open.splice(nodeIndex, 0, p.segment);
            }
          } else {
            segmentIndex = this.open.indexOf(p.segment);
            this.open.splice(segmentIndex, 1);
          }
          currentNew = this.open.length === 0 ? null : this.open[0];
          if (currentOld !== currentNew) {
            if (pass === 1) {
              this.addTriangle(beginAngle, p.angle, currentOld);
            }
            _results1.push(beginAngle = p.angle);
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Visibility.prototype.addTriangle = function(angle1, angle2, segment) {
    var p1, p2, p3, p4, pBegin, pEnd;
    p1 = this.center;
    p2 = new Point(this.center.x + Math.cos(angle1), this.center.y + Math.sin(angle1));
    p3 = new Point(0, 0);
    p4 = new Point(0, 0);
    if (segment) {
      p3.x = segment.p1.x;
      p3.y = segment.p1.y;
      p4.x = segment.p2.x;
      p4.y = segment.p2.y;
    } else {
      p3.x = this.center.x + Math.cos(angle1) * 500;
      p3.y = this.center.y + Math.sin(angle1) * 500;
      p4.x = this.center.x + Math.cos(angle2) * 500;
      p4.y = this.center.y + Math.sin(angle2) * 500;
    }
    pBegin = lineIntersection(p3, p4, p1, p2);
    p2.x = this.center.x + Math.cos(angle2);
    p2.y = this.center.y + Math.sin(angle2);
    pEnd = lineIntersection(p3, p4, p1, p2);
    this.output.push(pBegin);
    return this.output.push(pEnd);
  };

  return Visibility;

})();

Block = (function() {

  function Block() {}

  return Block;

})();

Point = (function() {

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  return Point;

})();

EndPoint = (function(_super) {

  __extends(EndPoint, _super);

  function EndPoint(x, y) {
    EndPoint.__super__.constructor.call(this, x, y);
    this.begin = false;
    this.angle = 0;
    this.visualize = false;
  }

  return EndPoint;

})(Point);

Segment = (function() {

  function Segment() {}

  return Segment;

})();

endpointCompare = function(a, b) {
  if (a.angle > b.angle) {
    return 1;
  }
  if (a.angle < b.angle) {
    return 0 - 1;
  }
  if (!a.begin && b.begin) {
    return 1;
  }
  if (a.begin && !b.begin) {
    return 0 - 1;
  }
  return 0;
};

segmentInFrontOf = function(a, b, relativeTo) {
  var A1, A2, A3, B1, B2, B3;
  A1 = leftOf(a, interpolate(b.p1, b.p2, 0.01));
  A2 = leftOf(a, interpolate(b.p2, b.p1, 0.01));
  A3 = leftOf(a, relativeTo);
  B1 = leftOf(b, interpolate(a.p1, a.p2, 0.01));
  B2 = leftOf(b, interpolate(a.p2, a.p1, 0.01));
  B3 = leftOf(b, relativeTo);
  if (B1 === B2 && B2 !== B3) {
    return true;
  }
  if (A1 === A2 && A2 === A3) {
    return true;
  }
  if (A1 === A2 && A2 !== A3) {
    return false;
  }
  if (B1 === B2 && B2 === B3) {
    return false;
  }
  return false;
};

lineIntersection = function(p1, p2, p3, p4) {
  var s;
  s = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / ((p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y));
  return new Point(p1.x + s * (p2.x - p1.x), p1.y + s * (p2.y - p1.y));
};

leftOf = function(s, p) {
  var cross;
  cross = (s.p2.x - s.p1.x) * (p.y - s.p1.y) - (s.p2.y - s.p1.y) * (p.x - s.p1.x);
  return cross < 0;
};

interpolate = function(p, q, f) {
  return new Point(p.x * (1 - f) + q.x * f, p.y * (1 - f) + q.y * f);
};

module.exports = Visibility;

});

window.require.register('models/Orb', function(require, module) {
var ORB_STATES, OrbModel, SPECTRUM_COLORS;

ORB_STATES = {
  active: 'Active',
  idle: 'Idle'
};

SPECTRUM_COLORS = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'white'];

OrbModel = (function() {

  function OrbModel(color) {
    this.color = color;
    this.state = ORB_STATES.idle;
  }

  OrbModel.prototype.setActive = function() {
    if (this.state === ORB_STATES.active) {
      return;
    }
    this.state = ORB_STATES.active;
    return this.onStateChange();
  };

  OrbModel.prototype.setIdle = function() {
    if (this.state === ORB_STATES.idle) {
      return;
    }
    this.state = ORB_STATES.idle;
    return this.onStateChange();
  };

  OrbModel.prototype.upgrade = function() {
    var nextColor, nextIndex;
    if (this.color === 'white') {
      return;
    }
    nextIndex = SPECTRUM_COLORS.indexOf(this.color) + 1;
    nextColor = SPECTRUM_COLORS[nextIndex];
    return this.setColor(nextColor);
  };

  OrbModel.prototype.downgrade = function() {
    var previousColor, previousIndex;
    if (this.color === 'black') {
      return;
    }
    previousIndex = SPECTRUM_COLORS.indexOf(this.color) - 1;
    previousColor = SPECTRUM_COLORS[previousIndex];
    return this.setColor(previousColor);
  };

  OrbModel.prototype.setColor = function(newColor) {
    this.color = newColor;
    this.onStateChange();
    if (this.color === 'black') {
      EventBus.dispatch('!game:fail', this);
    }
  };

  OrbModel.prototype.onColorChange = function() {};

  OrbModel.prototype.dispose = function() {};

  return OrbModel;

})();

module.exports = OrbModel;

});

window.require.register('models/Polygon', function(require, module) {
var PolygonModel;

PolygonModel = (function() {

  function PolygonModel(x, y, verticesArray, ignorePiP) {
    this.x = x;
    this.y = y;
    this.ignorePiP = ignorePiP != null ? ignorePiP : false;
    this.vertices = verticesArray.map(function(_arg) {
      var x, y;
      x = _arg[0], y = _arg[1];
      return {
        x: x,
        y: y
      };
    });
    this.computePointsAndSegments();
  }

  PolygonModel.prototype.computePointsAndSegments = function() {
    var _ref;
    return _ref = this.gatherPointsAndSegments(), this.points = _ref[0], this.segments = _ref[1], _ref;
  };

  PolygonModel.prototype.computeSegments = function() {
    var index, lastVertex, segments, vertex, _i, _ref;
    segments = [];
    if (!this.vertices.length) {
      return segments;
    }
    lastVertex = this.vertices[0];
    for (index = _i = 1, _ref = this.vertices.length - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; index = 1 <= _ref ? ++_i : --_i) {
      vertex = this.vertices[index];
      segments.push({
        a: lastVertex,
        b: vertex
      });
      lastVertex = vertex;
    }
    segments.push({
      a: lastVertex,
      b: this.vertices[0]
    });
    return segments;
  };

  PolygonModel.prototype.gatherPointsAndSegments = function() {
    var absoluteA, absoluteB, pointA, pointB, points, segment, segments, vertex, x, y, _i, _j, _len, _len1, _ref, _ref1;
    segments = [];
    points = [];
    x = this.x;
    y = this.y;
    _ref = this.computeSegments();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      segment = _ref[_i];
      pointA = segment.a;
      pointB = segment.b;
      absoluteA = {
        x: pointA.x + x,
        y: pointA.y + y
      };
      absoluteB = {
        x: pointB.x + x,
        y: pointB.y + y
      };
      segments.push({
        a: absoluteA,
        b: absoluteB
      });
    }
    _ref1 = this.vertices;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      vertex = _ref1[_j];
      points.push({
        x: x + vertex.x,
        y: y + vertex.y
      });
    }
    return [points, segments];
  };

  PolygonModel.prototype.dispose = function() {};

  return PolygonModel;

})();

module.exports = PolygonModel;

});

window.require.register('models/Prism', function(require, module) {
var PrismModel;

PrismModel = (function() {

  function PrismModel(x, y, prismControlModel) {
    this.x = x;
    this.y = y;
    this.prismControlModel = prismControlModel;
    this.color = this.prismControlModel.color;
  }

  PrismModel.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
    return this.onPositionUpdate();
  };

  PrismModel.prototype.onPositionUpdate = function() {};

  PrismModel.prototype.dispose = function() {
    return this.onPositionUpdate = void 0;
  };

  return PrismModel;

})();

module.exports = PrismModel;

});

window.require.register('models/PrismControl', function(require, module) {
var PrismControlModel;

PrismControlModel = (function() {

  function PrismControlModel(color) {
    this.color = color;
  }

  PrismControlModel.prototype.setColor = function(color) {
    this.color = color;
    return EventBus.dispatch('!prismControl:activate', this, {
      color: this.color
    });
  };

  PrismControlModel.prototype.dispose = function() {};

  return PrismControlModel;

})();

module.exports = PrismControlModel;

});

window.require.register('models/player', function(require, module) {
var PlayerModel, config;

config = require('config');

PlayerModel = (function() {

  function PlayerModel() {}

  PlayerModel.prototype.setLevel = function(level, override) {
    if ((level > this.getLevel()) || override) {
      return localStorage.setItem("" + config.namespace + ".level", level);
    }
  };

  PlayerModel.prototype.getLevel = function() {
    return parseInt(localStorage.getItem("" + config.namespace + ".level") || 0, 10);
  };

  PlayerModel.prototype.dispose = function() {};

  return PlayerModel;

})();

module.exports = new PlayerModel;

});

window.require.register('scenes/Complete', function(require, module) {
var ButtonView, CompleteScene, config, playerModel, tracker,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

config = require('config');

playerModel = require('models/player');

tracker = require('tracker');

ButtonView = require('views/Button');

CompleteScene = (function() {

  function CompleteScene(_arg) {
    this.level = _arg.level, this.message = _arg.message, this.success = _arg.success, this.score = _arg.score;
    this.onNextClick = __bind(this.onNextClick, this);

    this.el = new createjs.Container;
    this.createOutcomeText();
    this.createMessageText();
    this.createButton();
    playerModel.setLevel(this.level);
    tracker.track('Complete Scene', {
      success: this.success,
      level: this.level,
      message: this.message,
      score: this.score
    });
  }

  CompleteScene.prototype.createMessageText = function() {
    var textEl;
    textEl = new createjs.Text(this.message, '26px Arial', '#333333');
    textEl.x = 10;
    textEl.y = 20;
    return this.el.addChild(textEl);
  };

  CompleteScene.prototype.createOutcomeText = function() {
    var text, textEl;
    text = 'You Won!';
    if (!this.success) {
      text = 'You Lost!';
    }
    textEl = new createjs.Text(text, '26px Arial', '#333333');
    textEl.x = 10;
    textEl.y = 90;
    return this.el.addChild(textEl);
  };

  CompleteScene.prototype.createButton = function() {
    var text;
    text = 'Next Level';
    if (!this.success) {
      text = 'Retry';
    }
    this.buttonView = new ButtonView(text, this.onNextClick);
    this.buttonView.el.x = config.width / 2 - this.buttonView.width / 2;
    this.buttonView.el.y = 190;
    return this.el.addChild(this.buttonView.el);
  };

  CompleteScene.prototype.onNextClick = function() {
    var options, sceneLocation;
    sceneLocation = 'scenes/Play';
    options = {
      level: this.level
    };
    return EventBus.dispatch('!scene:load', this, {
      sceneLocation: sceneLocation,
      options: options
    });
  };

  CompleteScene.prototype.dispose = function() {
    return this.buttonView.dispose();
  };

  return CompleteScene;

})();

module.exports = CompleteScene;

});

window.require.register('scenes/LevelBuilder', function(require, module) {
var IlluminationView, LevelBuilder, OrbModel, OrbView, PolygonModel, PolygonView, PrismModel, PrismView, SPECTRUM_COLORS, allLevels, config, solutionColors, utils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

config = require('config');

utils = require('utils');

PolygonModel = require('models/Polygon');

PolygonView = require('views/Polygon');

IlluminationView = require('views/Illumination');

PrismModel = require('models/Prism');

PrismView = require('views/Prism');

OrbModel = require('models/Orb');

OrbView = require('views/Orb');

allLevels = require('levels/all');

SPECTRUM_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

solutionColors = {
  'red': ['235,92,72,25', [230, 94, 76, 128]],
  'orange': ['240,117,54,48', [245, 140, 34, 128]],
  'yellow': ['240,147,45,68', [230, 216, 34, 128]],
  'green': ['220,167,69,86', [134, 235, 149, 128]],
  'blue': ['204,169,97,103', [133, 192, 255, 128]],
  'violet': ['197,158,109,118', [153, 93, 179, 128]]
};

LevelBuilder = (function() {

  function LevelBuilder(_arg) {
    var level;
    level = _arg.level;
    this.onPrismPressMove = __bind(this.onPrismPressMove, this);

    this.loadLevel = __bind(this.loadLevel, this);

    if (level != null) {
      this.viewOnly = true;
    }
    this.el = new createjs.Container;
    this.orbLookup = {};
    this.illuminationLookup = {};
    this.polygonModels = [];
    this.polygonLayerEl = new createjs.Container;
    this.el.addChild(this.polygonLayerEl);
    this.createBorder();
    this.createPrism();
    this.createOrbs();
    this.createIlluminations();
    if (level == null) {
      this.doDraw();
    }
    this.setDepths();
    this.addKeyboardEvents();
    if (level != null) {
      this.loadLevel(level);
    }
  }

  LevelBuilder.prototype.loadLevel = function(levelIndex) {
    var color, orbData, polygonData, x, y, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    this.currentLevel = allLevels[levelIndex];
    this.width = config.width;
    this.height = config.height;
    _ref = this.currentLevel.obstacles;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      polygonData = _ref[_i];
      this.loadPolygon(polygonData);
    }
    _ref1 = this.currentLevel.orbs;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      orbData = _ref1[_j];
      _ref2 = this.scalePoint(orbData.x, orbData.y), x = _ref2[0], y = _ref2[1];
      this.loadOrb(x, y, orbData.color);
      color = orbData.color;
      this.illuminationLookup[color].el.visible = true;
    }
    return this.doDraw();
  };

  LevelBuilder.prototype.addKeyboardEvents = function() {
    var _this = this;
    console.log('`p` to add polygon');
    console.log('`l` to log level data');
    console.log('`1`-`6` to toggle orb illumination');
    console.log('`0` to toggle prism illumination');
    console.log('`s` to show solution regions');
    return $(window).keypress(function(event) {
      var el, index, keyCode;
      keyCode = event.keyCode;
      if (keyCode === 48) {
        el = _this.illuminationViews[_this.illuminationViews.length - 1].el;
        el.visible = !el.visible;
      }
      if ((49 <= keyCode && keyCode <= 54)) {
        index = keyCode - 49;
        el = _this.illuminationViews[index].el;
        el.visible = !el.visible;
      }
      if (keyCode === 108) {
        _this.logLevel();
      }
      if (keyCode === 112) {
        _this.createPolygon();
      }
      if (keyCode === 115) {
        return _this.displaySolutions();
      }
    });
  };

  LevelBuilder.prototype.displaySolutions = function() {
    var a, b, bitmap, canvasHeight, canvasWidth, g, i, illuminationView, imageData, key, keyFound, matchesFound, orbModel, r, solution, _i, _j, _len, _ref, _ref1, _ref2;
    canvasWidth = config.width;
    canvasHeight = config.height;
    this.illuminationContainerEl.cache(0, 0, config.width, config.height);
    imageData = this.illuminationContainerEl.cacheCanvas.getContext('2d').getImageData(0, 0, canvasWidth, canvasHeight);
    bitmap = new Uint8ClampedArray(imageData.data);
    matchesFound = false;
    for (i = _i = 0, _ref = bitmap.length; _i < _ref; i = _i += 4) {
      r = bitmap[i + 0];
      g = bitmap[i + 1];
      b = bitmap[i + 2];
      a = bitmap[i + 3];
      keyFound = false;
      _ref1 = this.illuminationViews;
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        illuminationView = _ref1[_j];
        if (!illuminationView.el.visible) {
          continue;
        }
        orbModel = illuminationView.prismModel;
        _ref2 = solutionColors[orbModel.color], key = _ref2[0], solution = _ref2[1];
        if (key === ("" + r + "," + g + "," + b + "," + a)) {
          matchesFound = true;
          keyFound = true;
          bitmap[i + 0] = solution[0];
          bitmap[i + 1] = solution[1];
          bitmap[i + 2] = solution[2];
          bitmap[i + 3] = solution[3];
        }
      }
      if (!keyFound) {
        bitmap[i + 0] = 0;
        bitmap[i + 1] = 0;
        bitmap[i + 2] = 0;
        bitmap[i + 3] = 0;
      }
    }
    if (matchesFound) {
      imageData.data.set(bitmap);
      return this.illuminationContainerEl.cacheCanvas.getContext('2d').putImageData(imageData, 0, 0, 0, 0, canvasWidth, canvasHeight);
    }
  };

  LevelBuilder.prototype.logLevel = function() {
    var illuminationView, level, orbModel, orbView, polygonModels, _i, _len, _ref;
    level = {
      width: config.width,
      height: config.height,
      prism: {
        x: this.prismModel.x,
        y: this.prismModel.y
      }
    };
    level.orbs = [];
    _ref = this.illuminationViews;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      illuminationView = _ref[_i];
      if (!illuminationView.el.visible) {
        continue;
      }
      orbModel = illuminationView.prismModel;
      orbView = orbModel.view;
      level.orbs.push({
        x: orbView.el.x,
        y: orbView.el.y,
        color: orbModel.color
      });
    }
    level.obstacles = [];
    polygonModels = this.polygonModels.slice();
    polygonModels.shift();
    level.obstacles = polygonModels.map(function(polygonModel) {
      var vertices;
      vertices = polygonModel.vertices.map(function(_arg) {
        var x, y;
        x = _arg.x, y = _arg.y;
        x = x | 0;
        y = y | 0;
        return [x, y];
      });
      return {
        x: polygonModel.x,
        y: polygonModel.y,
        vertices: vertices
      };
    });
    return console.log(JSON.stringify(level));
  };

  LevelBuilder.prototype.loadPolygon = function(polygonData) {
    var polygonModel, polygonView, vertices, x, y, _ref,
      _this = this;
    _ref = this.scalePoint(polygonData.x, polygonData.y), x = _ref[0], y = _ref[1];
    vertices = this.scaleVertices(polygonData.vertices);
    polygonModel = new PolygonModel(x, y, vertices);
    this.polygonModels.push(polygonModel);
    polygonView = new PolygonView(polygonModel);
    this.polygonLayerEl.addChild(polygonView.el);
    return (function(polygonModel) {
      return polygonView.el.addEventListener('pressmove', function(event) {
        polygonModel.x = event.stageX;
        polygonModel.y = event.stageY;
        polygonModel.computePointsAndSegments();
        event.target.x = event.stageX;
        event.target.y = event.stageY;
        return _this.doDraw();
      });
    })(polygonModel);
  };

  LevelBuilder.prototype.createPolygon = function() {
    var polygonModel, polygonView, radius, side, sides, step, theta, vertices, _i, _ref,
      _this = this;
    vertices = [];
    sides = (Math.random() * 2 + 3) | 0;
    step = (Math.PI * 2) / sides;
    vertices = [];
    for (side = _i = 0, _ref = sides - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; side = 0 <= _ref ? ++_i : --_i) {
      theta = (step * side) + (Math.random() * step);
      radius = Math.random() * 40 + 20;
      vertices.push([(radius * Math.cos(theta)) | 0, (radius * Math.sin(theta)) | 0]);
    }
    polygonModel = new PolygonModel(config.width / 2, config.height / 2, vertices);
    this.polygonModels.push(polygonModel);
    polygonView = new PolygonView(polygonModel);
    this.polygonLayerEl.addChild(polygonView.el);
    (function(polygonModel) {
      return polygonView.el.addEventListener('pressmove', function(event) {
        polygonModel.x = event.stageX;
        polygonModel.y = event.stageY;
        polygonModel.computePointsAndSegments();
        event.target.x = event.stageX;
        event.target.y = event.stageY;
        return _this.doDraw();
      });
    })(polygonModel);
    return this.doDraw();
  };

  LevelBuilder.prototype.scaleVertices = function(vertices) {
    var scaledVertex, scaledVertices, vertex, _i, _len;
    scaledVertices = [];
    for (_i = 0, _len = vertices.length; _i < _len; _i++) {
      vertex = vertices[_i];
      scaledVertex = this.scalePoint(vertex[0], vertex[1]);
      scaledVertices.push(scaledVertex);
    }
    return scaledVertices;
  };

  LevelBuilder.prototype.scalePoint = function(x, y) {
    var levelHeight, levelWidth, scaledX, scaledY;
    levelWidth = this.currentLevel.width;
    levelHeight = this.currentLevel.height;
    scaledX = (x * this.width) / levelWidth;
    scaledY = (y * this.height) / levelHeight;
    return [scaledX, scaledY];
  };

  LevelBuilder.prototype.loadOrb = function(x, y, color) {
    var orbModel, orbView;
    orbModel = this.orbLookup[color].model;
    orbView = this.orbLookup[color].view;
    orbView.el.visible = true;
    orbView.el.x = x;
    orbView.el.y = y;
    orbModel.x = x;
    return orbModel.y = y;
  };

  LevelBuilder.prototype.createOrbs = function() {
    var color, orbModel, orbView, x, y, _fn, _i, _len, _ref, _results,
      _this = this;
    this.orbModels = [];
    this.orbViews = [];
    _ref = SPECTRUM_COLORS.reverse();
    _fn = function(orbModel) {
      return orbView.el.addEventListener('pressmove', function(event) {
        orbModel.x = event.stageX;
        orbModel.y = event.stageY;
        event.target.x = orbModel.x;
        event.target.y = orbModel.y;
        return _this.doDraw();
      });
    };
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      color = _ref[_i];
      x = config.width / 2 - config.tileWidth / 2;
      y = config.height - config.tileHeight;
      orbModel = new PrismModel(x, y, {
        color: color
      });
      orbView = new PrismView(orbModel, color);
      orbView.el.x = x;
      orbView.el.y = y;
      orbModel.view = orbView;
      if (this.viewOnly) {
        orbView.el.visible = false;
      }
      this.orbViews.push(orbView);
      this.el.addChild(orbView.el);
      _fn(orbModel);
      this.orbModels.push(orbModel);
      _results.push(this.orbLookup[color] = {
        model: orbModel,
        view: orbView
      });
    }
    return _results;
  };

  LevelBuilder.prototype.setDepths = function() {
    return this.el.swapChildren(this.illuminationContainerEl, this.prismView.el);
  };

  LevelBuilder.prototype.mouseInteraction = function(stageX, stageY) {
    this.prismModel.setPosition(stageX, stageY);
    return this.doDraw();
  };

  LevelBuilder.prototype.doDraw = function() {
    var illuminationView, _i, _len, _ref,
      _this = this;
    _ref = this.illuminationViews;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      illuminationView = _ref[_i];
      illuminationView.drawVisibility();
    }
    if (this.displaySolutionTimeout) {
      clearTimeout(this.displaySolutionTimeout);
    }
    return this.displaySolutionTimeout = setTimeout(function() {
      return _this.displaySolutions();
    }, 1000);
  };

  LevelBuilder.prototype.createBorder = function() {
    return this.addPolygon(0, 0, [[0, 0], [config.width, 0], [config.width, config.height], [0, config.height]], true);
  };

  LevelBuilder.prototype.createPrism = function() {
    var prismX, prismY, _ref;
    _ref = [config.width / 2, config.height / 2], prismX = _ref[0], prismY = _ref[1];
    this.prismModel = new PrismModel(prismX, prismY, {
      color: 'black'
    });
    this.prismView = new PrismView(this.prismModel);
    this.prismView.el.x = this.prismModel.x;
    this.prismView.el.y = this.prismModel.y;
    this.el.addChild(this.prismView.el);
    this.prismView.el.addEventListener('pressmove', this.onPrismPressMove);
    if (this.viewOnly) {
      return this.prismView.el.visible = false;
    }
  };

  LevelBuilder.prototype.onPrismPressMove = function(event) {
    return this.mouseInteraction(event.stageX, event.stageY);
  };

  LevelBuilder.prototype.addPolygon = function(x, y, vertices, ignorePiP) {
    var polygonModel, polygonView;
    if (ignorePiP == null) {
      ignorePiP = false;
    }
    polygonModel = new PolygonModel(x, y, vertices, ignorePiP);
    polygonView = new PolygonView(polygonModel);
    this.polygonModels.push(polygonModel);
    return this.el.addChild(polygonView.el);
  };

  LevelBuilder.prototype.createIlluminations = function() {
    var illuminationView, orbModel, _i, _len, _ref;
    this.illuminationViews = [];
    this.illuminationContainerEl = new createjs.Container;
    _ref = this.orbModels;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      orbModel = _ref[_i];
      illuminationView = new IlluminationView(this.polygonModels, orbModel, config.width, config.height, orbModel.color);
      this.illuminationLookup[orbModel.color] = illuminationView;
      illuminationView.el.visible = false;
      this.illuminationViews.push(illuminationView);
      this.illuminationContainerEl.addChild(illuminationView.el);
    }
    this.illuminationViews = this.illuminationViews.reverse();
    illuminationView = new IlluminationView(this.polygonModels, this.prismModel, config.width, config.height, 'black');
    illuminationView.el.visible = false;
    this.illuminationViews.push(illuminationView);
    this.illuminationContainerEl.addChild(illuminationView.el);
    return this.el.addChild(this.illuminationContainerEl);
  };

  LevelBuilder.prototype.dispose = function() {};

  return LevelBuilder;

})();

module.exports = LevelBuilder;

});

window.require.register('scenes/LevelSelect', function(require, module) {
var ButtonView, LevelButton, LevelSelectScene, allLevels, config, playerModel, tracker,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

allLevels = require('levels/all');

config = require('config');

playerModel = require('models/player');

tracker = require('tracker');

ButtonView = require('views/Button');

LevelSelectScene = (function() {

  function LevelSelectScene() {
    this.onButtonClick = __bind(this.onButtonClick, this);
    this.maxLevel = playerModel.getLevel();
    this.el = new createjs.Container;
    this.createInstructionText();
    this.createLevelButtons();
    tracker.track('Level Select Scene', {
      maxLevel: this.maxLevel
    });
  }

  LevelSelectScene.prototype.createInstructionText = function() {
    var instructionText;
    instructionText = new createjs.Text("Select A Level", '26px Arial', '#333333');
    instructionText.x = 25;
    instructionText.y = 25;
    return this.el.addChild(instructionText);
  };

  LevelSelectScene.prototype.createLevelButtons = function() {
    var buttonColumns, index, _fn, _i, _ref,
      _this = this;
    this.buttonContainerEl = new createjs.Container;
    this.levelButtons = [];
    buttonColumns = Math.floor((config.width - 22 * 2) / 56 + 1);
    this.buttonContainerEl.x = 22;
    this.buttonContainerEl.y = 65;
    _fn = function(index) {
      var buttonView, callback, isSubdued, isUnlocked;
      isUnlocked = _this.maxLevel >= index;
      callback = (function() {
        return (function(index) {
          return _this.onButtonClick(index);
        })(index);
      });
      if (!isUnlocked) {
        callback = function() {};
      }
      isSubdued = _this.maxLevel > index;
      isSubdued = _this.maxLevel !== index;
      buttonView = new LevelButton(index + 1, callback, isUnlocked, isSubdued);
      buttonView.el.x = (index % buttonColumns) * 56 + 22;
      buttonView.el.y = Math.floor(index / buttonColumns) * 50 + 22;
      _this.buttonContainerEl.addChild(buttonView.el);
      return _this.levelButtons.push(buttonView);
    };
    for (index = _i = 0, _ref = allLevels.length; 0 <= _ref ? _i < _ref : _i > _ref; index = 0 <= _ref ? ++_i : --_i) {
      _fn(index);
    }
    return this.el.addChild(this.buttonContainerEl);
  };

  LevelSelectScene.prototype.onButtonClick = function(index) {
    var options, sceneLocation;
    sceneLocation = 'scenes/Play';
    options = {
      level: index
    };
    return EventBus.dispatch('!scene:load', this, {
      sceneLocation: sceneLocation,
      options: options
    });
  };

  LevelSelectScene.prototype.dispose = function() {
    var levelButton, _i, _len, _ref, _results;
    _ref = this.levelButtons;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      levelButton = _ref[_i];
      _results.push(levelButton.dispose());
    }
    return _results;
  };

  return LevelSelectScene;

})();

LevelButton = (function() {

  function LevelButton(text, callback, isActive, isSubdued) {
    var pulserActive;
    this.text = text;
    this.callback = callback;
    this.isActive = isActive;
    this.isSubdued = isSubdued;
    this.width = 40;
    this.height = 30;
    this.color = '#888888';
    pulserActive = this.isActive;
    if (this.isActive) {
      this.color = '#f58c22';
      if (this.isSubdued) {
        this.color = '#e65e4c';
        pulserActive = false;
      }
    }
    this.el = new createjs.Container;
    this.timestops = [200, 1200];
    this.scaleSize = 1.5;
    this.createBackground();
    if (pulserActive) {
      this.createScaleTween();
    }
    this.createText();
  }

  LevelButton.prototype.createBackground = function() {
    var graphics;
    graphics = new createjs.Graphics;
    graphics.c().f(this.color).dr(0, 0, this.width, this.height).cp().ef();
    this.backgroundEl = new createjs.Shape(graphics);
    this.backgroundEl.regX = this.width / 2;
    this.backgroundEl.regY = this.height / 2;
    this.el.addChild(this.backgroundEl);
    return this.el.addEventListener('click', this.callback);
  };

  LevelButton.prototype.createText = function() {
    var height, hitEl, width;
    this.textEl = new createjs.Text("" + this.text, '26px Arial', '#ffffff');
    width = this.textEl.getMeasuredWidth();
    height = this.textEl.getMeasuredHeight();
    hitEl = new createjs.Shape;
    hitEl.graphics.beginFill('#000000').drawRect(0, 0, this.width, this.height);
    this.textEl.hitArea = hitEl;
    this.textEl.regX = this.width / 2;
    this.textEl.regY = this.height / 2;
    this.textEl.x = this.width / 2 - width / 2;
    this.textEl.y = this.height / 2 - height / 2 - 2;
    return this.el.addChild(this.textEl);
  };

  LevelButton.prototype.createScaleTween = function() {
    this.scaleTween = new createjs.Tween.get(this.backgroundEl).to({
      scaleX: this.scaleSize,
      scaleY: this.scaleSize
    }, this.timestops[0]).to({
      scaleX: 1,
      scaleY: 1
    }, this.timestops[1]);
    return this.scaleTween.loop = true;
  };

  LevelButton.prototype.dispose = function() {
    return this.el.removeEventListener('click', this.callback);
  };

  return LevelButton;

})();

module.exports = LevelSelectScene;

});

window.require.register('scenes/Loading', function(require, module) {
var LoadingScene, config,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

config = require('config');

LoadingScene = (function() {

  function LoadingScene(options, callbackFn) {
    this.options = options;
    this.callbackFn = callbackFn;
    this.onTick = __bind(this.onTick, this);

    this.el = new createjs.Container;
    this.el.addEventListener('tick', this.onTick);
    this.createLoadingText();
    this.el.cache(0, 0, config.width, config.height);
    this.timer = void 0;
    this.onTick();
  }

  LoadingScene.prototype.createLoadingText = function() {
    var loadingEl;
    loadingEl = new createjs.Text('Loading...', '26px Arial', '#333333');
    loadingEl.x = 10;
    loadingEl.y = 10;
    return this.el.addChild(loadingEl);
  };

  LoadingScene.prototype.onTick = function() {
    var _this = this;
    if (this.timer) {
      return;
    }
    return this.timer = setTimeout(function() {
      _this.callbackFn(_this.options);
      return _this.timer = void 0;
    }, 1000 / 2);
  };

  LoadingScene.prototype.dispose = function() {
    this.el.uncache();
    return createjs.Ticker.removeEventListener('tick', this.onTick);
  };

  return LoadingScene;

})();

module.exports = LoadingScene;

});

window.require.register('scenes/MainMenu', function(require, module) {
var ButtonView, LOGO_SPRITE_SHEET_OPTIONS, MainMenuScene, config, playerModel, tracker, utils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

config = require('config');

utils = require('utils');

playerModel = require('models/player');

ButtonView = require('views/Button');

tracker = require('tracker');

LOGO_SPRITE_SHEET_OPTIONS = {
  images: [utils.loadQueue.getResult('tileset')],
  frames: {
    width: 163 * config.devicePixelRatio,
    height: 35 * config.devicePixelRatio
  },
  animations: {
    logo: 3
  }
};

MainMenuScene = (function() {

  function MainMenuScene() {
    this.onProgressResetClick = __bind(this.onProgressResetClick, this);

    this.onPlayClick = __bind(this.onPlayClick, this);
    this.el = new createjs.Container;
    this.createLogo();
    this.createPlayButton();
    if (config.development) {
      this.createProgressResetButton();
    }
    tracker.track('Main Menu Scene');
  }

  MainMenuScene.prototype.createLogo = function() {
    var logoEl, logoSpriteSheet;
    logoSpriteSheet = new createjs.SpriteSheet(LOGO_SPRITE_SHEET_OPTIONS);
    logoEl = new createjs.Sprite(logoSpriteSheet, 'logo');
    logoEl.x = (config.width / 2) - (163 / 2);
    logoEl.y = 120;
    logoEl.scaleX = logoEl.scaleY = 1 / config.devicePixelRatio;
    return this.el.addChild(logoEl);
  };

  MainMenuScene.prototype.createProgressResetButton = function() {
    var currentLevel, hitEl, textHeight, textWidth;
    this.progressResetButtonEl = new createjs.Text("[ Reset Progress ]", '26px Arial', '#880000');
    textWidth = this.progressResetButtonEl.getMeasuredWidth();
    textHeight = this.progressResetButtonEl.getMeasuredHeight();
    this.progressResetButtonEl.x = (config.width / 2) - (textWidth / 2);
    this.progressResetButtonEl.y = config.height - textHeight - 48;
    hitEl = new createjs.Shape;
    hitEl.graphics.beginFill('#000000').drawRect(0, 0, textWidth, textHeight);
    this.progressResetButtonEl.hitArea = hitEl;
    this.el.addChild(this.progressResetButtonEl);
    this.progressResetButtonEl.addEventListener('click', this.onProgressResetClick);
    currentLevel = playerModel.getLevel();
    if (!currentLevel) {
      return this.progressResetButtonEl.visible = false;
    }
  };

  MainMenuScene.prototype.createPlayButton = function() {
    this.playButton = new ButtonView('Press To Play', this.onPlayClick);
    this.playButton.el.x = (config.width / 2) - (this.playButton.width / 2);
    this.playButton.el.y = (config.height / 2) - (this.playButton.height / 2);
    return this.el.addChild(this.playButton.el);
  };

  MainMenuScene.prototype.onPlayClick = function() {
    var options, sceneLocation;
    sceneLocation = 'scenes/LevelSelect';
    options = {};
    return EventBus.dispatch('!scene:load', this, {
      sceneLocation: sceneLocation,
      options: options
    });
  };

  MainMenuScene.prototype.onProgressResetClick = function() {
    playerModel.setLevel(0, true);
    return this.progressResetButtonEl.visible = false;
  };

  MainMenuScene.prototype.dispose = function() {
    this.playButton.dispose();
    if (config.development) {
      return this.progressResetButtonEl.removeEventListener('click', this.onProgressResetClick);
    }
  };

  return MainMenuScene;

})();

module.exports = MainMenuScene;

});

window.require.register('scenes/Play', function(require, module) {
var ControlsView, LevelView, PlayScene, PrismControlModel, allLevels, config, controlsHeight, controlsWidth, levelHeight, levelWidth, levelY, tracker, utils;

LevelView = require('views/Level');

PrismControlModel = require('models/PrismControl');

ControlsView = require('views/Controls');

config = require('config');

utils = require('utils');

allLevels = require('levels/all');

tracker = require('tracker');

controlsWidth = config.width;

controlsHeight = 48;

levelY = controlsHeight;

levelWidth = config.width;

levelHeight = config.height - controlsHeight * 2;

PlayScene = (function() {

  function PlayScene(_arg) {
    this.level = _arg.level;
    this.el = new createjs.Container;
    this.createControls();
    this.createLevel();
    this.addEventListeners();
    tracker.track('Play Scene', {
      level: this.level
    });
  }

  PlayScene.prototype.addEventListeners = function() {
    EventBus.addEventListener('!game:won', this.onGameWon, this);
    EventBus.addEventListener('!game:fail', this.onGameFail, this);
    return EventBus.addEventListener('!game:restart', this.onGameRestart, this);
  };

  PlayScene.prototype.onGameRestart = function() {
    var options, sceneLocation;
    sceneLocation = 'scenes/Play';
    options = {
      level: this.level
    };
    if (this.gameOverTimeout != null) {
      clearTimeout(this.gameOverTimeout);
    }
    EventBus.dispatch('!scene:load', this, {
      sceneLocation: sceneLocation,
      options: options
    });
    return tracker.track('Game Restart', {
      level: this.level
    });
  };

  PlayScene.prototype.createLevel = function() {
    this.levelView = new LevelView(this.level, levelWidth, levelHeight, this.prismControlModel);
    this.levelView.el.y = levelY;
    return this.el.addChild(this.levelView.el);
  };

  PlayScene.prototype.createControls = function() {
    this.prismControlModel = new PrismControlModel('violet');
    this.controlsView = new ControlsView(this.prismControlModel, controlsWidth, controlsHeight, levelHeight + levelY, this.level);
    return this.el.addChild(this.controlsView.el);
  };

  PlayScene.prototype.onGameFail = function() {
    var options, sceneLocation,
      _this = this;
    sceneLocation = 'scenes/Complete';
    options = {
      level: this.level,
      message: 'You created a black orb!',
      success: false,
      score: this.levelView.score
    };
    if (this.gameOverTimeout != null) {
      clearTimeout(this.gameOverTimeout);
    }
    return this.gameOverTimeout = setTimeout(function() {
      return EventBus.dispatch('!scene:load', _this, {
        sceneLocation: sceneLocation,
        options: options
      });
    }, 1000);
  };

  PlayScene.prototype.onGameWon = function() {
    var nextLevelIndex, options, sceneLocation,
      _this = this;
    nextLevelIndex = this.level + 1;
    if (nextLevelIndex >= allLevels.length) {
      nextLevelIndex = 0;
    }
    sceneLocation = 'scenes/Complete';
    options = {
      level: nextLevelIndex,
      message: 'All orbs are white!',
      success: true,
      score: this.levelView.score
    };
    if (this.gameOverTimeout != null) {
      clearTimeout(this.gameOverTimeout);
    }
    return this.gameOverTimeout = setTimeout(function() {
      return EventBus.dispatch('!scene:load', _this, {
        sceneLocation: sceneLocation,
        options: options
      });
    }, 1000);
  };

  PlayScene.prototype.dispose = function() {
    this.levelView.dispose();
    this.prismControlModel.dispose();
    this.controlsView.dispose();
    EventBus.removeEventListener('!game:won', this.onGameWon, this);
    EventBus.removeEventListener('!game:fail', this.onGameFail, this);
    return EventBus.removeEventListener('!game:restart', this.onGameRestart, this);
  };

  return PlayScene;

})();

module.exports = PlayScene;

});

window.require.register('tracker', function(require, module) {

module.exports = {
  track: function() {},
  register: function() {}
};

});

window.require.register('utils', function(require, module) {
var componentToHex, utils;

componentToHex = function(c) {
  var hex;
  hex = c.toString(16);
  if (hex.length === 1) {
    return '0' + hex;
  } else {
    return hex;
  }
};

utils = {
  loadAssets: function(loadManifest, callback) {
    this.loadQueue = new createjs.LoadQueue;
    createjs.Sound.alternateExtensions = ['mp3'];
    this.loadQueue.installPlugin(createjs.Sound);
    this.loadQueue.addEventListener('complete', callback);
    return this.loadQueue.loadManifest(loadManifest);
  },
  rgbToHex: function(r, g, b) {
    r = r | 0;
    g = g | 0;
    b = b | 0;
    return "#" + (componentToHex(r)) + (componentToHex(g)) + (componentToHex(b));
  },
  getQueryVariable: function(variable) {
    var key, query, v, value, vars, _i, _len, _ref;
    if (!window.location || !window.location.search) {
      return false;
    }
    query = window.location.search.substring(1);
    vars = query.split('&');
    for (_i = 0, _len = vars.length; _i < _len; _i++) {
      v = vars[_i];
      _ref = v.split('='), key = _ref[0], value = _ref[1];
      if (key === variable) {
        return value;
      }
    }
    return false;
  },
  pointInPolygon: function(_arg, vertices) {
    var i, iX, iY, intersect, isInside, j, jX, jY, pointX, pointY;
    pointX = _arg[0], pointY = _arg[1];
    isInside = false;
    i = 0;
    j = vertices.length - 1;
    while (i < vertices.length) {
      iX = vertices[i].x;
      iY = vertices[i].y;
      jX = vertices[j].x;
      jY = vertices[j].y;
      intersect = ((iY > pointY) !== (jY > pointY)) && (pointX < (jX - iX) * (pointY - iY) / (jY - iY) + iX);
      if (intersect) {
        isInside = !isInside;
      }
      j = i++;
    }
    return isInside;
  }
};

module.exports = utils;

});

window.require.register('views/Button', function(require, module) {
var ButtonView, PulserView;

PulserView = require('views/Pulser');

ButtonView = (function() {

  function ButtonView(text, callback, isActive, isSubdued) {
    this.text = text;
    this.callback = callback;
    this.isActive = isActive != null ? isActive : true;
    this.isSubdued = isSubdued != null ? isSubdued : false;
    this.el = new createjs.Container;
    this.buildText();
    this.buildPulser();
    this.el.addEventListener('click', this.callback);
  }

  ButtonView.prototype.buildPulser = function() {
    var currentColor, pulserActive;
    currentColor = '#888888';
    pulserActive = this.isActive;
    if (this.isActive) {
      currentColor = '#f58c22';
      if (this.isSubdued) {
        currentColor = '#e65e4c';
        pulserActive = false;
      }
    }
    this.pulserView = new PulserView(this.width, this.height, currentColor, [200, 1200], 1.2, pulserActive);
    this.pulserView.el.x = this.width / 2;
    this.pulserView.el.y = this.height / 2 + 4;
    this.el.addChild(this.pulserView.el);
    return this.el.swapChildren(this.pulserView.el, this.textEl);
  };

  ButtonView.prototype.buildText = function() {
    var hitEl;
    this.textEl = new createjs.Text("" + this.text, '26px Arial', '#ffffff');
    this.width = this.textEl.getMeasuredWidth();
    this.height = this.textEl.getMeasuredHeight();
    hitEl = new createjs.Shape;
    hitEl.graphics.beginFill('#000000').drawRect(0, 0, this.width, this.height);
    this.textEl.hitArea = hitEl;
    return this.el.addChild(this.textEl);
  };

  ButtonView.prototype.dispose = function() {
    this.pulserView.dispose();
    return this.el.removeEventListener('click', this.callback);
  };

  return ButtonView;

})();

module.exports = ButtonView;

});

window.require.register('views/Controls', function(require, module) {
var COLORS, ControlsView, PrismButtonView, SPRITE_SHEET_OPTIONS, config, tracker, utils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

utils = require('utils');

config = require('config');

tracker = require('tracker');

PrismButtonView = require('views/PrismButton');

SPRITE_SHEET_OPTIONS = {
  images: [utils.loadQueue.getResult('tileset')],
  frames: {
    width: config.tileWidth * config.devicePixelRatio,
    height: config.tileHeight * config.devicePixelRatio,
    spacing: 2 * config.devicePixelRatio,
    margin: 1 * config.devicePixelRatio
  },
  animations: {
    red: 16,
    orange: 17,
    yellow: 18,
    green: 19,
    blue: 20,
    violet: 21,
    restart: 23
  }
};

COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

ControlsView = (function() {

  function ControlsView(prismControlModel, width, height, lowerOffset, level) {
    this.prismControlModel = prismControlModel;
    this.width = width;
    this.height = height;
    this.lowerOffset = lowerOffset;
    this.level = level;
    this.onPrismButtonClick = __bind(this.onPrismButtonClick, this);

    this.onRestartButtonClick = __bind(this.onRestartButtonClick, this);

    this.score = 0;
    this.el = new createjs.Container;
    this.spriteSheet = new createjs.SpriteSheet(SPRITE_SHEET_OPTIONS);
    this.colorIndex = 0;
    this.createPrismButtons();
    this.createRestartButton();
    this.createLevelIndicator();
    this.createPointsIndicator();
    EventBus.addEventListener('!score:change', this.onScoreChange, this);
  }

  ControlsView.prototype.onScoreChange = function(event, _arg) {
    this.score = _arg.score;
    return this.updatePoints();
  };

  ControlsView.prototype.createLevelIndicator = function() {
    var textEl, textHeight;
    this.textContainer = new createjs.Container;
    textEl = new createjs.Text("Level " + (this.level + 1), '26px Arial', '#333333');
    textHeight = textEl.getMeasuredHeight();
    textEl.x = 48;
    textEl.y = (this.height / 2) - (textHeight / 2);
    this.textContainer.addChild(textEl);
    this.textContainer.cache(0, 0, this.width, this.height);
    return this.el.addChild(this.textContainer);
  };

  ControlsView.prototype.createPointsIndicator = function() {
    var textHeight, textWidth;
    this.pointsContainer = new createjs.Container;
    this.scoreEl = new createjs.Text("Score: " + this.score, '26px Arial', '#333333');
    textWidth = this.scoreEl.getMeasuredWidth();
    textHeight = this.scoreEl.getMeasuredHeight();
    this.scoreEl.x = this.width - textWidth - 48;
    this.scoreEl.y = (this.height / 2) - (textHeight / 2);
    this.pointsContainer.addChild(this.scoreEl);
    this.pointsContainer.cache(0, 0, this.width, this.height);
    return this.el.addChild(this.pointsContainer);
  };

  ControlsView.prototype.updatePoints = function() {
    var textWidth;
    this.scoreEl.text = "Score: " + this.score;
    textWidth = this.scoreEl.getMeasuredWidth();
    this.scoreEl.x = this.width - textWidth - 48;
    return this.pointsContainer.updateCache();
  };

  ControlsView.prototype.createRestartButton = function() {
    var hitEl, offsetX, offsetY, verticalSpacing;
    verticalSpacing = this.height / 2;
    offsetX = config.tileWidth / 2;
    offsetY = config.tileHeight / 2;
    hitEl = this.createHitEl();
    this.restartButtonEl = new createjs.Sprite(this.spriteSheet, 'restart');
    this.restartButtonEl.scaleX = this.restartButtonEl.scaleY = 1 / config.devicePixelRatio;
    this.restartButtonEl.x = this.width - 48;
    this.restartButtonEl.y = verticalSpacing - offsetY + this.lowerOffset;
    this.restartButtonEl.hitArea = hitEl;
    this.restartButtonEl.addEventListener('click', this.onRestartButtonClick);
    return this.el.addChild(this.restartButtonEl);
  };

  ControlsView.prototype.createPrismButtons = function() {
    var colorName, index, offsetX, offsetY, verticalSpacing, _fn, _i, _len,
      _this = this;
    this.prismButtons = [];
    this.prismButtonsContainerEl = new createjs.Container;
    verticalSpacing = this.height / 2;
    offsetX = 0;
    offsetY = 0;
    index = 0;
    _fn = function(colorName) {
      var callback, prismButtonView;
      callback = (function() {
        return (function(colorName) {
          return _this.onPrismButtonClick(colorName);
        })(colorName);
      });
      prismButtonView = new PrismButtonView(colorName, callback);
      prismButtonView.el.x = (_this.width / (6 + 2)) * (index + 1) + offsetX;
      prismButtonView.el.y = verticalSpacing + offsetY + _this.lowerOffset;
      _this.prismButtons.push(prismButtonView);
      _this.prismButtonsContainerEl.addChild(prismButtonView.el);
      return index++;
    };
    for (_i = 0, _len = COLORS.length; _i < _len; _i++) {
      colorName = COLORS[_i];
      _fn(colorName);
    }
    return this.el.addChild(this.prismButtonsContainerEl);
  };

  ControlsView.prototype.createHitEl = function() {
    var hitEl, pos, size;
    hitEl = new createjs.Shape;
    pos = (0 - 14) * config.devicePixelRatio;
    size = 44 * config.devicePixelRatio;
    hitEl.graphics.beginFill('#000000').drawRect(pos, pos, size, size);
    return hitEl;
  };

  ControlsView.prototype.onRestartButtonClick = function() {
    return EventBus.dispatch('!game:restart', this);
  };

  ControlsView.prototype.onPrismButtonClick = function(color) {
    this.prismControlModel.setColor(color);
    return tracker.track('Prism Button Click', {
      color: color,
      level: this.level
    });
  };

  ControlsView.prototype.dispose = function() {
    var prismButtonView, _i, _len, _ref, _results;
    this.textContainer.uncache();
    this.pointsContainer.uncache();
    EventBus.removeEventListener('!score:change', this.onScoreChange, this);
    _ref = this.prismButtons;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      prismButtonView = _ref[_i];
      _results.push(prismButtonView.dispose());
    }
    return _results;
  };

  return ControlsView;

})();

module.exports = ControlsView;

});

window.require.register('views/Illumination', function(require, module) {
var IlluminationView, SPECTURM_COLORS, VisibilityLib, alpha, config, utils;

VisibilityLib = require('lib/Visibility');

utils = require('utils');

config = require('config');

alpha = 1;

if (config.debug) {
  alpha = 0.1;
}

SPECTURM_COLORS = {
  red: [230, 94, 76, alpha],
  orange: [245, 140, 34, alpha],
  yellow: [230, 216, 34, alpha],
  green: [134, 235, 149, alpha],
  blue: [133, 192, 255, alpha],
  violet: [153, 93, 179, alpha],
  black: [0, 0, 0, alpha],
  white: [255, 255, 255, alpha]
};

IlluminationView = (function() {

  function IlluminationView(polygonModels, prismModel, width, height, primaryColor) {
    var index, polygonModel, segment, wallPoints, _i, _j, _len, _ref, _ref1;
    this.polygonModels = polygonModels;
    this.prismModel = prismModel;
    this.width = width;
    this.height = height;
    this.primaryColor = primaryColor != null ? primaryColor : 'white';
    this.g = new createjs.Graphics;
    this.el = new createjs.Shape(this.g);
    this.visibility = new VisibilityLib;
    wallPoints = [];
    _ref = this.polygonModels;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      polygonModel = _ref[_i];
      for (index = _j = 0, _ref1 = polygonModel.segments.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; index = 0 <= _ref1 ? ++_j : --_j) {
        segment = polygonModel.segments[index];
        wallPoints.push({
          p1: {
            x: segment.a.x,
            y: segment.a.y
          },
          p2: {
            x: segment.b.x,
            y: segment.b.y
          }
        });
      }
    }
    this.visibility.loadMap(this.width, this.height, 0, [], wallPoints);
    this.currentColor = {};
    this.currentColor.red = SPECTURM_COLORS[this.primaryColor][0];
    this.currentColor.green = SPECTURM_COLORS[this.primaryColor][1];
    this.currentColor.blue = SPECTURM_COLORS[this.primaryColor][2];
    this.currentColor.alpha = SPECTURM_COLORS[this.primaryColor][3];
    EventBus.addEventListener('!prismControl:activate', this.onPrismActivate, this);
  }

  IlluminationView.prototype.currentColorToRGBA = function() {
    var blue, green, red;
    red = this.currentColor.red | 0;
    green = this.currentColor.green | 0;
    blue = this.currentColor.blue | 0;
    alpha = this.currentColor.alpha;
    return "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
  };

  IlluminationView.prototype.currentColorToHex = function() {
    var blue, green, red;
    red = this.currentColor.red | 0;
    green = this.currentColor.green | 0;
    blue = this.currentColor.blue | 0;
    return utils.rgbToHex(red, green, blue);
  };

  IlluminationView.prototype.onPrismActivate = function(_event, _arg) {
    var blue, color, green, red, _ref, _ref1,
      _this = this;
    color = _arg.color;
    _ref = SPECTURM_COLORS[color], red = _ref[0], green = _ref[1], blue = _ref[2], alpha = _ref[3];
    this.currentColor = {
      red: red,
      green: green,
      blue: blue,
      alpha: alpha
    };
    _ref1 = SPECTURM_COLORS[this.primaryColor], red = _ref1[0], green = _ref1[1], blue = _ref1[2], alpha = _ref1[3];
    return createjs.Tween.get(this.currentColor).to({
      red: red,
      green: green,
      blue: blue,
      alpha: alpha
    }, 1000).addEventListener('change', function() {
      _this.drawVisibility(false);
      return _this.el.updateCache();
    });
  };

  IlluminationView.prototype.drawVisibility = function(doCalculations) {
    var paths;
    if (doCalculations == null) {
      doCalculations = true;
    }
    if (doCalculations) {
      this.visibility.setLightLocation(this.prismModel.x, this.prismModel.y);
      this.visibility.sweep(Math.PI);
    }
    paths = this.computeVisibleAreaPaths(this.visibility.output);
    this.vertices = this.visibility.output;
    this.g.c();
    this.drawFloor(paths.floor);
    this.drawWalls(paths.walls);
    return this.el.cache(0, 0, this.width, this.height);
  };

  IlluminationView.prototype.interpretSvg = function(path) {
    var i, _results;
    i = 0;
    _results = [];
    while (i < path.length) {
      if (path[i] === 'M') {
        this.g.mt(path[i + 1], path[i + 2]);
        i += 2;
      }
      if (path[i] === 'L') {
        this.g.lt(path[i + 1], path[i + 2]);
        i += 2;
      }
      _results.push(i++);
    }
    return _results;
  };

  IlluminationView.prototype.computeVisibleAreaPaths = function(output) {
    var i, p1, p2, path1, path2, path3;
    path1 = [];
    path2 = [];
    path3 = [];
    i = 0;
    while (i < output.length) {
      p1 = output[i];
      p2 = output[i + 1];
      if (isNaN(p1.x) || isNaN(p1.y) || isNaN(p2.x) || isNaN(p2.y)) {
        i += 2;
        continue;
      }
      path1.push('L', p1.x, p1.y, 'L', p2.x, p2.y);
      path2.push('M', this.prismModel.x, this.prismModel.y, 'L', p1.x, p1.y, 'M', this.prismModel.x, this.prismModel.y, 'L', p2.x, p2.y);
      path3.push('M', p1.x, p1.y, 'L', p2.x, p2.y);
      i += 2;
    }
    return {
      floor: path1,
      triangles: path2,
      walls: path3
    };
  };

  IlluminationView.prototype.drawFloor = function(path) {
    var currentColor;
    currentColor = this.currentColorToHex();
    this.g.f(currentColor);
    this.g.mt(this.prismModel.x, this.prismModel.y);
    this.interpretSvg(path);
    this.g.lt(this.prismModel.x, this.prismModel.y);
    return this.g.cp();
  };

  IlluminationView.prototype.drawWalls = function(path) {
    this.g.s('#9c9a94');
    this.g.ss(2);
    this.interpretSvg(path);
    return this.g.cp();
  };

  IlluminationView.prototype.dispose = function() {
    return EventBus.removeEventListener('!prismControl:activate', this.onPrismActivate, this);
  };

  return IlluminationView;

})();

module.exports = IlluminationView;

});

window.require.register('views/Level', function(require, module) {
var COLOR_ORDER, IlluminationView, LevelView, OrbModel, OrbView, PolygonModel, PolygonView, PrismModel, PrismView, allLevels, config, utils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PolygonModel = require('models/Polygon');

PolygonView = require('views/Polygon');

OrbModel = require('models/Orb');

OrbView = require('views/Orb');

IlluminationView = require('views/Illumination');

PrismModel = require('models/Prism');

PrismView = require('views/Prism');

config = require('config');

utils = require('utils');

allLevels = require('levels/all');

COLOR_ORDER = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

LevelView = (function() {

  function LevelView(level, width, height, prismControlModel) {
    this.level = level;
    this.width = width;
    this.height = height;
    this.prismControlModel = prismControlModel;
    this.onPrismPressMove = __bind(this.onPrismPressMove, this);

    this.score = 0;
    this.el = new createjs.Container;
    this.currentLevel = allLevels[this.level];
    this.createPolygons();
    this.createPrism();
    this.createOrbs();
    this.createIllumination();
    this.setDepths();
    this.doDraw();
    this.checkOrbIlluminations();
    this.addEventListeners();
  }

  LevelView.prototype.addEventListeners = function() {
    if (config.isMobile) {
      EventBus.addEventListener('!mouse:move', this.onMouseMove, this);
    }
    EventBus.addEventListener('!mouse:down', this.onMouseDown, this);
    return EventBus.addEventListener('!prismControl:activate', this.onPrismActivate, this);
  };

  LevelView.prototype.onPrismActivate = function() {
    var activeColor, allWhite, offsetX, offsetY, orbView, orbsActivated, pointsGained, soundToPlay, x, y, _i, _len, _ref;
    activeColor = this.prismControlModel.color;
    offsetX = 0;
    offsetY = 0;
    allWhite = true;
    pointsGained = 0;
    orbsActivated = 0;
    soundToPlay = false;
    _ref = this.orbViews;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      orbView = _ref[_i];
      x = orbView.el.x + offsetX;
      y = orbView.el.y + offsetY;
      if (utils.pointInPolygon([x, y], this.illuminationView.vertices)) {
        if (orbView.model.color === activeColor) {
          pointsGained += 10;
          if (orbsActivated) {
            pointsGained += 5;
          }
          orbsActivated++;
          orbView.model.upgrade();
          if (soundToPlay !== 'error') {
            soundToPlay = 'select';
          }
        } else {
          pointsGained -= 10;
          orbView.model.downgrade();
          soundToPlay = 'error';
        }
      }
      if (orbView.model.color !== 'white') {
        allWhite = false;
      }
    }
    if (allWhite) {
      EventBus.dispatch('!game:won', this);
    }
    if (pointsGained !== 0) {
      this.score += pointsGained;
      EventBus.dispatch('!score:change', this, {
        score: this.score
      });
    }
    this.checkOrbIlluminations();
    if (soundToPlay) {
      return createjs.Sound.play(soundToPlay);
    }
  };

  LevelView.prototype.setDepths = function() {
    return this.el.swapChildren(this.prismView.el, this.illuminationContainerEl);
  };

  LevelView.prototype.checkOrbIlluminations = function() {
    var activeColor, activeColors, index, isActive, isVisible, lowestFound, offsetX, offsetY, orbView, x, y, _i, _len, _ref;
    offsetX = 0;
    offsetY = 0;
    activeColors = {};
    _ref = this.orbViews;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      orbView = _ref[_i];
      x = orbView.el.x + offsetX;
      y = orbView.el.y + offsetY;
      activeColor = activeColors[orbView.model.color];
      isActive = false;
      isVisible = false;
      if (utils.pointInPolygon([x, y], this.illuminationView.vertices)) {
        orbView.model.setActive();
        isActive = true;
        isVisible = true;
      } else {
        orbView.model.setIdle();
        isActive = false;
      }
      if (activeColor) {
        activeColor.active = activeColor.active || isActive;
      } else {
        activeColor = {
          active: isActive
        };
      }
      activeColor.visible = isVisible;
      activeColors[orbView.model.color] = activeColor;
    }
    lowestFound = COLOR_ORDER.length + 1;
    for (activeColor in activeColors) {
      index = COLOR_ORDER.indexOf(activeColor);
      if (index < lowestFound) {
        lowestFound = index;
      }
    }
    for (activeColor in activeColors) {
      if (COLOR_ORDER.indexOf(activeColor) !== lowestFound) {
        activeColors[activeColor].isDanger = true;
      } else {
        activeColors[activeColor].isDanger = false;
      }
    }
    return EventBus.dispatch('!orb:activeColors', this, {
      activeColors: activeColors
    });
  };

  LevelView.prototype.onMouseMove = function(_event, _arg) {
    var stageX, stageY;
    stageX = _arg.stageX, stageY = _arg.stageY;
    stageX /= config.devicePixelRatio;
    stageY /= config.devicePixelRatio;
    return this.mouseInteraction(stageX - this.el.x, stageY - this.el.y);
  };

  LevelView.prototype.onPrismPressMove = function(_arg) {
    var stageX, stageY;
    stageX = _arg.stageX, stageY = _arg.stageY;
    stageX /= config.devicePixelRatio;
    stageY /= config.devicePixelRatio;
    return this.mouseInteraction(stageX - this.el.x, stageY - this.el.y);
  };

  LevelView.prototype.onMouseDown = function(_event, _arg) {
    var stageX, stageY;
    stageX = _arg.stageX, stageY = _arg.stageY;
    stageX /= config.devicePixelRatio;
    stageY /= config.devicePixelRatio;
    return this.mouseInteraction(stageX - this.el.x, stageY - this.el.y);
  };

  LevelView.prototype.mouseInPolygon = function(mouseX, mouseY) {
    var pointX, pointY, polygonModel, _i, _len, _ref;
    _ref = this.polygonModels;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      polygonModel = _ref[_i];
      if (polygonModel.ignorePiP) {
        continue;
      }
      pointX = mouseX - polygonModel.x;
      pointY = mouseY - polygonModel.y;
      if (utils.pointInPolygon([pointX, pointY], polygonModel.vertices)) {
        return true;
      }
    }
    return false;
  };

  LevelView.prototype.mouseInteraction = function(stageX, stageY) {
    var halfTileHeight, halfTileWidth;
    halfTileWidth = config.tileWidth / 2;
    halfTileHeight = config.tileHeight / 2;
    if (stageX <= halfTileWidth) {
      return;
    }
    if (stageY <= halfTileHeight) {
      return;
    }
    if (stageX >= this.width - halfTileWidth) {
      return;
    }
    if (stageY >= this.height - halfTileHeight) {
      return;
    }
    if (this.mouseInPolygon(stageX, stageY)) {
      return;
    }
    this.prismModel.setPosition(stageX, stageY);
    this.doDraw();
    return this.checkOrbIlluminations();
  };

  LevelView.prototype.doDraw = function() {
    return this.illuminationView.drawVisibility();
  };

  LevelView.prototype.createPrism = function() {
    var prismX, prismY, _ref;
    _ref = this.getPrismStartPosition(), prismX = _ref[0], prismY = _ref[1];
    this.prismModel = new PrismModel(prismX, prismY, this.prismControlModel);
    this.prismView = new PrismView(this.prismModel);
    this.prismView.el.x = this.prismModel.x - config.tileWidth / 2;
    this.prismView.el.y = this.prismModel.y - config.tileHeight / 2;
    this.el.addChild(this.prismView.el);
    if (!config.isMobile) {
      return this.prismView.el.addEventListener('pressmove', this.onPrismPressMove);
    }
  };

  LevelView.prototype.createIllumination = function() {
    var borderEl;
    this.illuminationContainerEl = new createjs.Container;
    this.illuminationView = new IlluminationView(this.polygonModels, this.prismModel, this.width, this.height);
    this.illuminationContainerEl.addChild(this.illuminationView.el);
    borderEl = new createjs.Shape;
    borderEl.graphics.s('#e6e6e6').mt(0, 0).lt(this.width, 0).mt(0, this.height).lt(this.width, this.height);
    this.illuminationContainerEl.addChild(borderEl);
    return this.el.addChild(this.illuminationContainerEl);
  };

  LevelView.prototype.createPolygons = function() {
    this.polygonContainerEl = new createjs.Container;
    this.polygonViews = [];
    this.polygonModels = [];
    this.createBorder();
    this.createObstacles();
    this.el.addChild(this.polygonContainerEl);
    return this.polygonContainerEl.cache(0, 0, this.width, this.height);
  };

  LevelView.prototype.createOrbs = function() {
    this.orbContainer = new createjs.Container;
    this.addOrbs();
    return this.el.addChild(this.orbContainer);
  };

  LevelView.prototype.addOrbs = function() {
    var orb, orbModel, orbView, x, y, _i, _len, _ref, _ref1, _results;
    this.orbModels = [];
    this.orbViews = [];
    _ref = this.currentLevel.orbs;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      orb = _ref[_i];
      orbModel = new OrbModel(orb.color);
      orbView = new OrbView(orbModel);
      _ref1 = this.scalePoint(orb.x, orb.y), x = _ref1[0], y = _ref1[1];
      orbView.el.x = x;
      orbView.el.y = y;
      this.orbContainer.addChild(orbView.el);
      this.orbModels.push(orbModel);
      _results.push(this.orbViews.push(orbView));
    }
    return _results;
  };

  LevelView.prototype.createBorder = function() {
    return this.addPolygon(0, 0, [[0, 0], [this.width, 0], [this.width, this.height], [0, this.height]], true);
  };

  LevelView.prototype.createObstacles = function() {
    var obstacle, vertices, x, y, _i, _len, _ref, _ref1, _results;
    _ref = this.currentLevel.obstacles;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obstacle = _ref[_i];
      vertices = this.scaleVertices(obstacle.vertices);
      _ref1 = this.scalePoint(obstacle.x, obstacle.y), x = _ref1[0], y = _ref1[1];
      _results.push(this.addPolygon(x, y, vertices));
    }
    return _results;
  };

  LevelView.prototype.scaleVertices = function(vertices) {
    var scaledVertex, scaledVertices, vertex, _i, _len;
    scaledVertices = [];
    for (_i = 0, _len = vertices.length; _i < _len; _i++) {
      vertex = vertices[_i];
      scaledVertex = this.scalePoint(vertex[0], vertex[1]);
      scaledVertices.push(scaledVertex);
    }
    return scaledVertices;
  };

  LevelView.prototype.getPrismStartPosition = function() {
    return this.scalePoint(this.currentLevel.prism.x, this.currentLevel.prism.y);
  };

  LevelView.prototype.scalePoint = function(x, y) {
    var levelHeight, levelWidth, scaledX, scaledY;
    levelWidth = this.currentLevel.width;
    levelHeight = this.currentLevel.height;
    scaledX = (x * this.width) / levelWidth;
    scaledY = (y * this.height) / levelHeight;
    return [scaledX, scaledY];
  };

  LevelView.prototype.addPolygon = function(x, y, vertices, ignorePiP) {
    var polygonModel, polygonView;
    if (ignorePiP == null) {
      ignorePiP = false;
    }
    polygonModel = new PolygonModel(x, y, vertices, ignorePiP);
    polygonView = new PolygonView(polygonModel);
    if (ignorePiP) {
      this.polygonContainerEl.addChild(polygonView.el);
    }
    this.polygonViews.push(polygonView);
    return this.polygonModels.push(polygonModel);
  };

  LevelView.prototype.dispose = function() {
    var orbView, polygonModel, polygonView, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    delete this.currentLevel;
    this.illuminationView.dispose();
    _ref = this.polygonViews;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      polygonView = _ref[_i];
      polygonView.dispose();
    }
    _ref1 = this.polygonModels;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      polygonModel = _ref1[_j];
      polygonModel.dispose();
    }
    _ref2 = this.orbViews;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      orbView = _ref2[_k];
      orbView.model.dispose();
      orbView.dispose();
    }
    if (config.isMobile) {
      EventBus.removeEventListener('!mouse:move', this.onMouseMove, this);
    } else {
      this.prismView.el.removeEventListener('pressmove', this.onPrismPressMove);
    }
    EventBus.removeEventListener('!mouse:down', this.onMouseDown, this);
    EventBus.removeEventListener('!prismControl:activate', this.onPrismActivate, this);
    this.prismModel.dispose();
    return this.prismView.dispose();
  };

  return LevelView;

})();

module.exports = LevelView;

});

window.require.register('views/Orb', function(require, module) {
var OrbView, RipplerView, SPECTURM_COLORS, config, utils;

utils = require('utils');

config = require('config');

SPECTURM_COLORS = {
  black: '#000000',
  white: '#ffffff',
  red: '#e65e4c',
  orange: '#f58c22',
  yellow: '#e6d822',
  green: '#86eb95',
  blue: '#85c0ff',
  violet: '#995db3',
  blackIdle: '#000000',
  whiteIdle: '#ffffff',
  redIdle: '#b8311f',
  orangeIdle: '#c75d00',
  yellowIdle: '#b8a500',
  greenIdle: '#5bbd66',
  blueIdle: '#5f8ccf',
  violetIdle: '#693185'
};

OrbView = (function() {

  function OrbView(model) {
    var _this = this;
    this.model = model;
    this.graphics = new createjs.Graphics;
    this.el = new createjs.Container;
    this.size = 16;
    this.scaleSize = 1.5;
    this.timestops = [200, 1200];
    this.setRipplerView();
    this.shapeEl = new createjs.Shape(this.graphics);
    this.el.addChild(this.shapeEl);
    this.isDanger = false;
    this.isActive = false;
    this.setGraphics();
    this.onStateChange();
    this.model.onStateChange = function() {
      return _this.onStateChange();
    };
    EventBus.addEventListener('!orb:activeColors', this.onOrbActiveColors, this);
  }

  OrbView.prototype.setRipplerView = function() {
    this.ripplerView = new RipplerView([255, 255, 255], [204, 204, 204], this.size, this.timestops);
    return this.el.addChild(this.ripplerView.el);
  };

  OrbView.prototype.onOrbActiveColors = function(_event, _arg) {
    var activeColor, activeColors, oldActive, oldDanger;
    activeColors = _arg.activeColors;
    activeColor = activeColors[this.model.color];
    if (!activeColor) {
      return;
    }
    oldDanger = this.isDanger;
    oldActive = this.isActive;
    this.isDanger = activeColor.isDanger;
    this.isActive = activeColor.active;
    if (oldDanger !== this.isDanger || oldActive !== this.isActive) {
      this.ripplerView.timeline.setPaused(true);
      if (this.isActive && !this.isDanger) {
        this.ripplerView.timeline.setPaused(false);
      } else {
        this.ripplerView.el.scaleX = this.ripplerView.el.scaleY = 0;
      }
      return this.setGraphics();
    }
  };

  OrbView.prototype.setScaleTween = function() {
    this.scaleTween = createjs.Tween.get(this.shapeEl).to({
      scaleX: this.scaleSize,
      scaleY: this.scaleSize
    }, this.timestops[0]).to({
      scaleX: 1,
      scaleY: 1
    }, this.timestops[1]);
    return this.scaleTween.loop = true;
  };

  OrbView.prototype.setGraphics = function() {
    var color, colorName, radius;
    this.shapeEl.scaleX = this.shapeEl.scaleY = 1;
    colorName = this.model.color;
    if (this.model.state === 'Idle') {
      colorName = "" + this.model.color + "Idle";
      this.shapeEl.visible = false;
    } else {
      this.shapeEl.visible = true;
    }
    color = SPECTURM_COLORS[colorName];
    radius = this.size / 2;
    this.graphics.c();
    this.graphics.s('#000000').ss(0.5);
    if (this.model.color !== 'white') {
      this.graphics.s('#000000').ss(0.5);
    }
    if (this.isDanger && this.isActive) {
      this.graphics.s('#ff0000').ss(3);
    }
    return this.graphics.f(color).dc(0, 0, radius).cp().ef();
  };

  OrbView.prototype.onStateChange = function() {
    return this.setGraphics();
  };

  OrbView.prototype.dispose = function() {
    return EventBus.removeEventListener('!orb:activeColors', this.onOrbActiveColors, this);
  };

  return OrbView;

})();

RipplerView = (function() {

  function RipplerView(startingColor, endingColor, size, timestops) {
    var b, g, r;
    this.size = size;
    this.timestops = timestops;
    this.graphics = new createjs.Graphics;
    this.el = new createjs.Shape(this.graphics);
    this.startingColor = (r = startingColor.r, g = startingColor.g, b = startingColor.b, startingColor);
    this.endingColor = (r = endingColor.r, g = endingColor.g, b = endingColor.b, endingColor);
    this.currentColor = this.startingColor;
    this.setGraphics();
    this.setTimeline();
    createjs.Ticker.addEventListener('tick', this.setGraphics.bind(this));
  }

  RipplerView.prototype.setTimeline = function() {
    this.setScaleTween();
    this.setColorTween();
    return this.timeline = new createjs.Timeline([this.scaleTween, this.colorTween], {}, {
      loop: true
    });
  };

  RipplerView.prototype.setColorTween = function() {
    var t;
    t = new createjs.Tween.get(this.currentColor);
    t = t.to(this.endingColor, this.timestops[1]);
    t = t.to(this.startingColor, 0);
    return this.colorTween = t;
  };

  RipplerView.prototype.setScaleTween = function() {
    var t;
    t = new createjs.Tween.get(this.el);
    t = t.to({
      scaleX: 3,
      scaleY: 3
    }, this.timestops[1]);
    t = t.to({
      scaleX: 1,
      scaleY: 1
    }, 0);
    return this.scaleTween = t;
  };

  RipplerView.prototype.setGraphics = function() {
    var b, color, g, r, _ref;
    _ref = this.currentColor, r = _ref[0], g = _ref[1], b = _ref[2];
    color = utils.rgbToHex(r, g, b);
    g = this.graphics;
    g.c();
    g.s(color);
    g.ss(2);
    g.dc(0, 0, this.size / 2);
    return g.cp();
  };

  return RipplerView;

})();

module.exports = OrbView;

});

window.require.register('views/Polygon', function(require, module) {
var PolygonView, config;

config = require('config');

PolygonView = (function() {

  function PolygonView(model) {
    this.model = model;
    this.graphics = new createjs.Graphics;
    this.el = new createjs.Shape(this.graphics);
    this.el.x = model.x;
    this.el.y = model.y;
    this.plotVertices();
  }

  PolygonView.prototype.plotVertices = function() {
    var index, vertex, vertices, _i, _ref;
    vertices = this.model.vertices;
    if (!vertices.length) {
      return;
    }
    if (config.debug) {
      if (this.model.ignorePiP) {
        this.graphics.beginStroke('#999999');
      } else {
        this.graphics.beginFill('#999999');
      }
    } else {
      if (this.model.ignorePiP) {
        this.graphics.beginFill('#cccccc');
      } else {
        this.graphics.beginFill('#9c9a94');
      }
    }
    this.graphics.moveTo(vertices[0].x, vertices[0].y);
    for (index = _i = 1, _ref = vertices.length - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; index = 1 <= _ref ? ++_i : --_i) {
      vertex = vertices[index];
      this.graphics.lineTo(vertex.x, vertex.y);
    }
    return this.graphics.lineTo(vertices[0].x, vertices[0].y);
  };

  PolygonView.prototype.dispose = function() {};

  return PolygonView;

})();

module.exports = PolygonView;

});

window.require.register('views/Prism', function(require, module) {
var PrismView, SPRITE_SHEET_OPTIONS, config, utils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

utils = require('utils');

config = require('config');

SPRITE_SHEET_OPTIONS = {
  images: [utils.loadQueue.getResult('tileset')],
  frames: {
    width: config.tileWidth * config.devicePixelRatio,
    height: config.tileHeight * config.devicePixelRatio,
    spacing: 2 * config.devicePixelRatio,
    margin: 1 * config.devicePixelRatio
  },
  animations: {
    main: 22,
    black: 15,
    red: 8,
    orange: 9,
    yellow: 10,
    green: 11,
    blue: 12,
    violet: 13,
    white: 14
  }
};

PrismView = (function() {

  function PrismView(model, animation) {
    var hitEl;
    this.model = model;
    if (animation == null) {
      animation = 'main';
    }
    this.onPositionUpdate = __bind(this.onPositionUpdate, this);

    this.spriteSheet = new createjs.SpriteSheet(this.spriteSheetOptions);
    this.el = new createjs.Sprite(this.spriteSheet, animation);
    this.el.scaleX = this.el.scaleY = 1 / config.devicePixelRatio;
    hitEl = new createjs.Shape;
    hitEl.graphics.beginFill('#000000').drawRect(0 - 14, 0 - 14, 44, 44);
    this.el.hitArea = hitEl;
    this.model.onPositionUpdate = this.onPositionUpdate;
  }

  PrismView.prototype.spriteSheetOptions = SPRITE_SHEET_OPTIONS;

  PrismView.prototype.onPositionUpdate = function() {
    this.el.x = this.model.x - config.tileWidth / 2;
    return this.el.y = this.model.y - config.tileHeight / 2;
  };

  PrismView.prototype.dispose = function() {
    return delete this.model.onPositionUpdate;
  };

  return PrismView;

})();

module.exports = PrismView;

});

window.require.register('views/PrismButton', function(require, module) {
var PrismButtonView, SPECTURM_COLORS, config;

config = require('config');

SPECTURM_COLORS = {
  red: '#e65e4c',
  orange: '#f58c22',
  yellow: '#e6d822',
  green: '#86eb95',
  blue: '#85c0ff',
  violet: '#995db3',
  redIdle: '#a82311',
  orangeIdle: '#b84d00',
  yellowIdle: '#b8a200',
  greenIdle: '#4ead58',
  blueIdle: '#507fbf',
  violetIdle: '#5a2275'
};

PrismButtonView = (function() {

  function PrismButtonView(colorName, callback) {
    this.colorName = colorName;
    this.callback = callback;
    this.currentColor = this.colorName;
    this.width = 16;
    this.height = 16;
    this.isActive = false;
    this.scaleSize = 1.5;
    this.isDanger = false;
    this.timestops = [200, 1200];
    this.graphics = new createjs.Graphics;
    this.el = new createjs.Container;
    this.shapeEl = new createjs.Shape(this.graphics);
    this.shapeEl.regX = this.width / 2;
    this.shapeEl.regY = this.height / 2;
    this.setHitEl();
    this.el.addChild(this.shapeEl);
    this.setScaleTween();
    this.setTimeline();
    this.setGraphics();
    this.el.addEventListener('click', this.callback);
    EventBus.addEventListener('!orb:activeColors', this.onOrbActiveColors, this);
  }

  PrismButtonView.prototype.onOrbActiveColors = function(_event, _arg) {
    var activeColor, activeColors, currColor, newState, oldActive, oldDanger;
    activeColors = _arg.activeColors;
    newState = "" + this.colorName + "Idle";
    currColor = this.currentColor;
    oldDanger = this.isDanger;
    oldActive = this.isActive;
    activeColor = activeColors[this.colorName];
    this.isActive = false;
    if (activeColor) {
      if (activeColor.active) {
        newState = this.colorName;
      }
      this.isDanger = activeColor.isDanger;
      this.isActive = activeColor.active;
    }
    this.currentColor = newState;
    if (currColor !== newState || this.isDanger !== oldDanger || this.isActive !== oldActive) {
      this.timeline.setPaused(true);
      if (!this.isActive) {
        this.shapeEl.scaleX = this.shapeEl.scaleY = 1;
      } else {
        this.timeline.setPaused(false);
      }
      return this.setGraphics();
    }
  };

  PrismButtonView.prototype.setTimeline = function() {
    return this.timeline = new createjs.Timeline([this.scaleTween], {}, {
      loop: true
    });
  };

  PrismButtonView.prototype.setScaleTween = function() {
    return this.scaleTween = createjs.Tween.get(this.shapeEl).to({
      scaleX: this.scaleSize,
      scaleY: this.scaleSize
    }, this.timestops[0]).to({
      scaleX: 1,
      scaleY: 1
    }, this.timestops[1]);
  };

  PrismButtonView.prototype.setGraphics = function() {
    var color;
    color = SPECTURM_COLORS[this.currentColor];
    this.graphics.c();
    this.graphics.s('#cccccc').ss(2);
    if (this.isActive) {
      this.graphics.s(color).ss(2);
      if (this.isDanger) {
        this.graphics.s('#ff0000').ss(2);
      }
    }
    this.graphics.f(color).dr(0, 0, this.width, this.height).cp().ef();
    return this.graphics.es();
  };

  PrismButtonView.prototype.setHitEl = function() {
    var hitEl, width;
    width = config.width / 8 - 2;
    hitEl = new createjs.Shape;
    hitEl.graphics.beginFill('#000000').drawRect(0, 0, width, 44);
    hitEl.regX = width / 2;
    hitEl.regY = 22;
    return this.el.hitArea = hitEl;
  };

  PrismButtonView.prototype.dispose = function() {
    this.el.removeEventListener('click', this.callback);
    return EventBus.removeEventListener('!orb:activeColors', this.onOrbActiveColors, this);
  };

  return PrismButtonView;

})();

module.exports = PrismButtonView;

});

window.require.register('views/Pulser', function(require, module) {
var PulserView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PulserView = (function() {

  function PulserView(width, height, color, timestops, scaleSize, isActive) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.timestops = timestops;
    this.scaleSize = scaleSize;
    this.isActive = isActive != null ? isActive : true;
    this.setGraphics = __bind(this.setGraphics, this);

    this.width += 8;
    this.height += 8;
    this.shadowBlur = {
      size: 0
    };
    this.graphics = new createjs.Graphics;
    this.el = new createjs.Shape(this.graphics);
    this.el.regX = this.width / 2;
    this.el.regY = this.height / 2;
    this.setGraphics();
    if (this.isActive) {
      this.setScaleTween();
    }
  }

  PulserView.prototype.setScaleTween = function() {
    this.scaleTween = createjs.Tween.get(this.el).to({
      scaleX: this.scaleSize,
      scaleY: this.scaleSize
    }, this.timestops[0]).to({
      scaleX: 1,
      scaleY: 1
    }, this.timestops[1]);
    return this.scaleTween.loop = true;
  };

  PulserView.prototype.setGraphics = function() {
    return this.graphics.c().f(this.color).dr(0, 0, this.width, this.height).cp().ef();
  };

  PulserView.prototype.dispose = function() {};

  return PulserView;

})();

module.exports = PulserView;

});

window.require.register('views/Stage', function(require, module) {
var LoadingScene, StageView, config,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

config = require('config');

LoadingScene = require('scenes/Loading');

StageView = (function() {

  function StageView(canvasEl) {
    this.doUpdate = __bind(this.doUpdate, this);
    this.el = new createjs.Stage(canvasEl);
    this.el.scaleX = this.el.scaleY = config.devicePixelRatio;
    createjs.Ticker.setFPS(config.fps);
    createjs.Ticker.useRAF = true;
    createjs.Touch.enable(this.el);
    this.createBackground();
    this.el.on('stagemousemove', this.onStageMouseMove);
    this.el.on('stagemousedown', this.onStageMouseDown);
    createjs.Ticker.addEventListener('tick', this.doUpdate);
    EventBus.addEventListener('!scene:load', this.onSceneLoad, this);
    if (!config.isMobile) {
      this.el.enableMouseOver(10);
    }
  }

  StageView.prototype.createBackground = function() {
    this.backgroundEl = new createjs.Shape;
    this.backgroundEl.graphics.beginFill('#ffffff');
    this.backgroundEl.graphics.drawRect(0, 0, config.width, config.height);
    return this.el.addChild(this.backgroundEl);
  };

  StageView.prototype.onSceneLoad = function(event, _arg) {
    var options, sceneLocation;
    sceneLocation = _arg.sceneLocation, options = _arg.options;
    return this.loadScene(sceneLocation, options);
  };

  StageView.prototype.loadScene = function(sceneLocation, options) {
    var loadingScene,
      _this = this;
    this.disposeScene(this.scene);
    loadingScene = new LoadingScene({
      sceneLocation: sceneLocation,
      options: options
    }, function(_arg) {
      var Scene, options, sceneLocation;
      sceneLocation = _arg.sceneLocation, options = _arg.options;
      _this.disposeScene(loadingScene);
      Scene = require(sceneLocation);
      _this.scene = new Scene(options);
      return _this.el.addChild(_this.scene.el);
    });
    return this.el.addChild(loadingScene.el);
  };

  StageView.prototype.doUpdate = function() {
    return this.el.update();
  };

  StageView.prototype.onStageMouseMove = function(_arg) {
    var stageX, stageY;
    stageX = _arg.stageX, stageY = _arg.stageY;
    return EventBus.dispatch('!mouse:move', {}, {
      stageX: stageX,
      stageY: stageY
    });
  };

  StageView.prototype.onStageMouseDown = function(_arg) {
    var stageX, stageY;
    stageX = _arg.stageX, stageY = _arg.stageY;
    return EventBus.dispatch('!mouse:down', {}, {
      stageX: stageX,
      stageY: stageY
    });
  };

  StageView.prototype.disposeScene = function(scene) {
    if (scene) {
      this.el.removeChild(scene.el);
      return scene.dispose();
    }
  };

  StageView.prototype.dispose = function() {
    this.el.off('stagemousemove', this.onStageMouseMove);
    createjs.Stage.disable(this.el);
    this.disposeScene(this.scene);
    createjs.Ticker.removeEventListener('tick', this.doUpdate);
    return EventBus.removeEventListener('!scene:load', this.onSceneLoad, this);
  };

  return StageView;

})();

module.exports = StageView;

});
