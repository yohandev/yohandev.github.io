/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = paper;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StackShape_1 = __webpack_require__(26);
var ReporterShape_1 = __webpack_require__(27);
var BooleanShape_1 = __webpack_require__(28);
var HatShape_1 = __webpack_require__(29);
var Shapes = /** @class */ (function () {
    function Shapes() {
    }
    Object.defineProperty(Shapes, "STACK", {
        get: function () {
            return new StackShape_1.default('stack');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shapes, "REPORTER", {
        get: function () {
            return new ReporterShape_1.default('reporter');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shapes, "BOOLEAN", {
        get: function () {
            return new BooleanShape_1.default('boolean');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shapes, "HAT", {
        get: function () {
            return new HatShape_1.default('hat');
        },
        enumerable: true,
        configurable: true
    });
    return Shapes;
}());
exports.default = Shapes;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Cursor_1 = __webpack_require__(13);
var paper_1 = __webpack_require__(0);
var Editor_1 = __webpack_require__(3);
var Workspace = /** @class */ (function () {
    function Workspace() {
        this.blocks = [];
        this.group = new paper_1.Group();
    }
    Workspace.prototype.add = function (b) {
        this.blocks.push(b);
        b.draw();
        b.group.position = this.group.parent.bounds.center; // center view
        b.shape.path.onMouseDrag = function (e) { return Cursor_1.default.drag(b, e); }; // draggable
        this.group.addChild(b.group); // scroll & clip
    };
    Workspace.prototype.disconnect = function (block) {
        if (block.disconnect()) {
            this.blocks.push(block); // add to loose blocks
            return true;
        }
        return false;
    };
    Workspace.prototype.connect = function (block) {
        var _this = this;
        var bounds = block.shape.path.bounds.clone().expand(Cursor_1.default.threshold);
        var found = false;
        for (var _i = 0, _a = this.blocks; _i < _a.length; _i++) {
            var blo = _a[_i];
            if (blo === block) // don't connect to yourself
             {
                continue;
            }
            blo.visit(function (b) {
                if (found) {
                    return;
                }
                if (b.intersects(bounds)) // interesect within threshold
                 {
                    if (block.connect(b)) {
                        var index = _this.blocks.indexOf(block);
                        if (index >= 0) {
                            _this.blocks.splice(index, 1); // rm from loose blocks
                        }
                        found = true; // connected ;; done
                    }
                }
            });
        }
        return found;
    };
    Workspace.prototype.load = function () {
        var _this = this;
        this.group.visible = true;
        window.onwheel = function (e) {
            if (Workspace.active !== _this) {
                return;
            }
            // @ts-ignore
            if (!Editor_1.default.script_pane.bounds.intersects(new paper_1.Rectangle([e.x, e.y], [1, 1]))) {
                return;
            }
            // @ts-ignore
            _this.group.translate([-e.deltaX, -e.deltaY]);
        };
    };
    Workspace.prototype.unload = function () {
        this.group.visible = false;
    };
    Workspace.prototype.highlight_loose = function () {
        this.blocks.forEach(function (b) { return b.shape.colour({ fill: b.colour.fill, stroke: 'white' }); });
    };
    Workspace.prototype.unhighlight_loose = function () {
        this.blocks.forEach(function (b) { return b.shape.colour(b.colour); });
    };
    Object.defineProperty(Workspace, "active", {
        get: function () {
            return this.m_active;
        },
        set: function (a) {
            if (!a) {
                throw new Error("active workspace cannot be null!");
            }
            if (this.m_active) {
                this.m_active.unload();
            }
            (this.m_active = a).load();
        },
        enumerable: true,
        configurable: true
    });
    return Workspace;
}());
exports.default = Workspace;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Class_1 = __webpack_require__(10);
var paper_1 = __webpack_require__(0);
var Workspace_1 = __webpack_require__(2);
var Colour_1 = __webpack_require__(5);
var Palette_1 = __webpack_require__(14);
var Sprite_1 = __webpack_require__(35);
var BlockEditor_1 = __webpack_require__(20);
var Editor = /** @class */ (function () {
    function Editor() {
    }
    Editor.init = function () {
        this.m_sprite_class = new Sprite_1.default();
        this.m_classes = [new Class_1.default("Player", this.m_sprite_class), new Class_1.default("Enemy", this.m_sprite_class)];
        this.active = this.m_classes[0];
    };
    Editor.draw = function () {
        /* CLASS */
        var header = new paper_1.Path.Rectangle({
            x: this.padding + 1.75,
            y: this.padding + 1.75,
            width: this.palette_width - 3.5,
            height: this.header_height,
            radius: 10,
            strokeColor: Editor.Colours.LIGHT,
            fillColor: Editor.Colours.DARK,
            strokeWidth: 3.5
        });
        var size = '1.2em';
        var txt0 = new paper_1.PointText({
            point: [0, 0],
            content: "class ",
            fillColor: Editor.Colours.SUBTEXT,
            fontFamily: 'Roboto',
            fontWeight: '700',
            fontSize: size
        });
        var txt1 = new paper_1.PointText({
            point: [txt0.bounds.right, 0],
            content: this.active.name,
            fillColor: Editor.Colours.TEXT,
            fontFamily: 'Roboto',
            fontSize: size
        });
        var txt2 = new paper_1.PointText({
            point: [txt1.bounds.right, 0],
            content: " extends ",
            fillColor: Editor.Colours.SUBTEXT,
            fontFamily: 'Roboto',
            fontWeight: 'italic 700',
            fontSize: size
        });
        var txt3 = new paper_1.PointText({
            point: [txt2.bounds.right, 0],
            content: this.active.extends.name,
            fillColor: Editor.Colours.TEXT,
            fontFamily: 'Roboto',
            fontSize: size
        });
        var txts = new paper_1.Group([txt0, txt1, txt2, txt3]);
        txts.bounds.leftCenter = new paper_1.Point(this.padding * 2, header.bounds.center.y);
        var circ = new paper_1.Path.Circle({
            center: [header.bounds.right - 10 - this.padding, header.bounds.center.y],
            radius: 10,
            fillColor: Editor.Colours.DARK,
            strokeColor: Editor.Colours.LIGHT,
            strokeWidth: 3
        });
        var plus = new paper_1.CompoundPath({
            children: [
                new paper_1.Path.Rectangle({ position: [0, 0], width: 10, height: 3, radius: 1 }),
                new paper_1.Path.Rectangle({ position: [0, 0], width: 3, height: 10, radius: 1 }),
            ],
            fillColor: Editor.Colours.LIGHT
        });
        plus.bounds.center = circ.bounds.center;
        var btn = new paper_1.Group([circ, plus]);
        btn.onMouseDown = function (e) { return BlockEditor_1.default.show(); };
        /* SCRIPT */
        var cross = new paper_1.Symbol(new paper_1.CompoundPath({
            children: [
                new paper_1.Path.Rectangle({ position: [0, 0], width: 20, height: 2, radius: 3 }),
                new paper_1.Path.Rectangle({ position: [0, 0], width: 2, height: 20, radius: 3 }),
            ],
            fillColor: Editor.Colours.LIGHT,
            rotation: 45
        }));
        var rect = new paper_1.Path.Rectangle({
            x: this.palette_width + this.padding * 2,
            y: this.padding,
            width: this.width() - this.palette_width - this.player_width - this.padding * 3,
            height: this.height() - this.padding * 2,
            radius: 10,
            strokeColor: Editor.Colours.LIGHT,
            fillColor: Editor.Colours.DARK,
            strokeWidth: 7
        });
        var crosses = new paper_1.Group();
        for (var x = rect.bounds.left + 3; x <= rect.bounds.right + 70; x += 70) {
            for (var y_1 = rect.bounds.top + 3; y_1 <= rect.bounds.bottom + 70; y_1 += 70) {
                // @ts-ignore
                crosses.addChild(cross.place([x, y_1]));
            }
        }
        this.m_script_pane = new paper_1.Group({
            children: [
                /* clipping */ rect,
                /* border */ rect.clone(),
                /* pattern */ crosses,
                /* scripts */ Workspace_1.default.active.group
            ],
            clipped: true
        });
        /* PALETTE */
        var rect2 = new paper_1.Path.Rectangle({
            x: this.padding,
            y: this.header_height + this.padding * 2,
            width: this.palette_width,
            height: this.height() - this.header_height - this.padding * 3,
            radius: 10,
            strokeColor: Editor.Colours.LIGHT,
            fillColor: Editor.Colours.DARK,
            strokeWidth: 7
        });
        var tabs = new paper_1.Path.Rectangle({
            x: this.padding,
            y: this.padding,
            width: 60,
            height: this.height() - this.padding * 2,
            fillColor: Editor.Colours.LIGHT,
        });
        var circs = new paper_1.Group();
        var dy = rect2.bounds.height / 8;
        var y = rect2.bounds.top - dy / 2;
        for (var col in Colour_1.Colours) {
            var c = Colour_1.Colours[col];
            circs.addChild(new paper_1.Path.Circle({
                center: [tabs.bounds.center.x, y += dy],
                radius: 15,
                fillColor: c.fill,
                strokeColor: c.stroke,
                strokeWidth: 2
            }));
            circs.addChild(new paper_1.PointText({
                point: [tabs.bounds.center.x, y + 30],
                content: col.toLowerCase(),
                fillColor: Editor.Colours.TEXT,
                justification: 'center',
                fontFamily: 'Roboto',
                fontSize: '0.7em'
            }));
        }
        this.m_palette_pane = new paper_1.Group({
            children: [
                /* clipping */ rect2,
                /* border */ rect2.clone(),
                /* tabs bg */ tabs,
                /* tabs*/ circs
            ],
            clipped: true
        });
        this.m_palette_pane.moveBelow(Palette_1.default.active.group);
    };
    Editor.width = function () {
        return paper.project.view.size.width;
    };
    Editor.height = function () {
        return paper.project.view.size.height;
    };
    Object.defineProperty(Editor, "script_pane", {
        get: function () {
            return this.m_script_pane;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor, "palette_pane", {
        get: function () {
            return this.m_palette_pane;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor, "active", {
        get: function () {
            return this.m_active;
        },
        set: function (c) {
            this.m_active = c;
            this.m_active.show();
            this.draw();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor, "classes", {
        get: function () {
            return this.m_classes;
        },
        enumerable: true,
        configurable: true
    });
    Editor.padding = 10;
    Editor.palette_width = 300;
    Editor.player_width = 480 / 2;
    Editor.header_height = 50;
    Editor.Colours = {
        DARK: '#26282e',
        LIGHT: '#303840',
        TEXT: 'white',
        SUBTEXT: '#aaaeb3'
    };
    return Editor;
}());
exports.default = Editor;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var StackedBlock_1 = __webpack_require__(11);
var Shapes_1 = __webpack_require__(1);
var Colour_1 = __webpack_require__(5);
var ReporterBlock_1 = __webpack_require__(16);
var BooleanBlock_1 = __webpack_require__(30);
var TextProp_1 = __webpack_require__(9);
var ReporterInputProp_1 = __webpack_require__(31);
var BooleanInputProp_1 = __webpack_require__(32);
var DropdownProp_1 = __webpack_require__(18);
var Blocks;
(function (Blocks) {
    /**
     * Generic Block Format ;; Example for the 'go to' block
     *
     *  {
     *      shape: 'STACK',
     *      category: 'MOTION',
     *      props:
     *      [
     *          { type: 'text', args: ['go to'] },
     *          { type: 'text', args: ['x:'] },
     *          { type: 'reporter' }
     *          { type: 'text', args: ['y:'] },
     *          { type: 'reporter' }
     *      ]
     *  }
     */
    function create(desc) {
        var parsed = parse(desc);
        var block = mkshape(parsed.shape, parsed.colour);
        for (var _i = 0, _a = parsed.props; _i < _a.length; _i++) {
            var prop = _a[_i];
            mkprop(block, prop);
        }
        return block;
    }
    Blocks.create = create;
    function parse(desc) {
        var parsed = eval("(" + desc + ")");
        var shape = parsed["shape"].toLowerCase().trim();
        var category = parsed["category"];
        var props = parsed["props"];
        var virtual = parsed["virtual"] || false;
        var js = parsed["js"];
        var colour = Colour_1.Colours[category];
        return { shape: shape, colour: colour, props: props, virtual: virtual };
    }
    Blocks.parse = parse;
    function mkshape(shape, colour) {
        switch (shape) {
            case "stack": return new Stack(colour);
            case "boolean": return new Boolean(colour);
            case "reporter": return new Reporter(colour);
            case "hat": return new Hat(colour);
            case "cap": return new Cap(colour);
            default: throw new Error("Couldn't parse shape \"" + shape + "\"");
        }
    }
    function mkprop(block, desc) {
        switch (desc.type.toLowerCase()) {
            case "text": return block["add"].apply(block, [TextProp_1.default].concat(desc.args));
            case "reporter": return block["add"].apply(block, [ReporterInputProp_1.default].concat(desc.args));
            case "boolean": return block["add"].apply(block, [BooleanInputProp_1.default].concat(desc.args));
            case "dropdown": return block["add"].apply(block, [DropdownProp_1.default].concat(desc.args));
            default: throw new Error("Couldn't parse prop \"" + desc.type + "\"");
        }
    }
    var Stack = /** @class */ (function (_super) {
        __extends(Stack, _super);
        function Stack(colour) {
            return _super.call(this, Shapes_1.default.STACK, colour) || this;
        }
        return Stack;
    }(StackedBlock_1.default));
    var Reporter = /** @class */ (function (_super) {
        __extends(Reporter, _super);
        function Reporter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Reporter;
    }(ReporterBlock_1.default));
    var Boolean = /** @class */ (function (_super) {
        __extends(Boolean, _super);
        function Boolean() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Boolean;
    }(BooleanBlock_1.default));
    var Hat = /** @class */ (function (_super) {
        __extends(Hat, _super);
        function Hat(colour) {
            return _super.call(this, Shapes_1.default.STACK, colour, true) || this;
        }
        return Hat;
    }(StackedBlock_1.default));
    var Cap = /** @class */ (function (_super) {
        __extends(Cap, _super);
        function Cap(colour) {
            return _super.call(this, Shapes_1.default.STACK, colour, false, true) || this;
        }
        return Cap;
    }(StackedBlock_1.default));
})(Blocks = exports.Blocks || (exports.Blocks = {}));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Colours = {
    MOTION: { fill: '#4C97FF', stroke: '#3373CC' },
    LOOKS: { fill: '#9966ff', stroke: '#774dcb' },
    EVENTS: { fill: '#ffbf00', stroke: '#cc9900' },
    CONTROL: { fill: '#ffab19', stroke: '#cf8b17' },
    SENSING: { fill: '#5cb1d6', stroke: '#2e8eb8' },
    OPERATORS: { fill: '#59c059', stroke: '#389438' },
    VARIABLES: { fill: '#ff8c1a', stroke: '#db6e00' },
    OBJECT: { fill: '#ff6680', stroke: '#f35' }
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var paper_1 = __webpack_require__(0);
//import Workspace from "./Workspace";
var Block = /** @class */ (function () {
    function Block(shape, colour, js) {
        this.shape = shape;
        this.colour = colour;
        this.js = js;
        this.props = [];
    }
    Block.prototype.transpile = function (t) {
        this.js(t, this);
    };
    Block.prototype.draw = function () {
        var pos = new paper_1.Point(0, 0);
        var drag = undefined;
        if (this.m_group) {
            pos = this.m_group.bounds.topLeft; // previous position
            drag = this.shape.path.onMouseDrag; // previous drag behaviour
        }
        this.draw_display(); // draw display
        this.m_group.bounds.topLeft = pos; // adjust self previous position
        this.shape.path.onMouseDrag = drag; // adjust self drag behaviour
    };
    Block.prototype.draw_display = function () {
        this.shape.erase(); // erase itself(important: clears events)
        var workspace = undefined; //  workspace group
        if (this.m_group) {
            workspace = this.m_group.parent;
            this.m_group.onMouseDrag = undefined;
            this.m_group.remove();
        }
        this.m_group = new paper_1.Group();
        this.shape.draw(); // draw self
        this.m_group.addChild(this.shape.path);
        var maxh = this.shape.height - 2 * Block.v_padding; // max height
        var offset = Block.h_padding;
        for (var _i = 0, _a = this.props; _i < _a.length; _i++) {
            var prop = _a[_i];
            prop.erase();
            prop.draw(); // draw prop
            this.m_group.addChild(prop.path); // group prop
            maxh = Math.max(maxh, prop.height); // update maxh
            offset += prop.width + Block.h_padding; // grow
        }
        maxh += 2 * Block.v_padding;
        offset = Block.h_padding;
        for (var _b = 0, _c = this.props; _b < _c.length; _b++) {
            var prop = _c[_b];
            prop.path.position.x = offset + prop.width / 2; // horizontal adjust
            prop.path.position.y = maxh / 2; // vertical adjust
            offset += prop.width + Block.h_padding; // grow
        }
        this.m_group.position.y = maxh / 2; // vertical adjust self
        this.shape.width = offset; // width adjust self
        this.shape.height = maxh; // height adjust self
        this.shape.colour(this.colour); // color self
        if (workspace) {
            workspace.addChild(this.m_group); // add back to workspace
        }
    };
    Block.prototype.add = function (prop) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.props.push(new prop(this, args));
    };
    Object.defineProperty(Block.prototype, "group", {
        get: function () {
            return this.m_group;
        },
        enumerable: true,
        configurable: true
    });
    Block.prototype.visit = function (func) {
        func(this);
        this.props.forEach(function (p) { return p.visit(func); });
    };
    Block.prototype.intersects = function (b) {
        return this.shape.path.bounds.intersects(b);
    };
    Block.h_padding = 10;
    Block.v_padding = 10;
    return Block;
}());
exports.default = Block;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Drawable_1 = __webpack_require__(15);
var Shape = /** @class */ (function (_super) {
    __extends(Shape, _super);
    function Shape(type) {
        var _this = _super.call(this) || this;
        _this.type = type;
        return _this;
    }
    Shape.prototype.colour = function (c) {
        this.path.fillColor = c.fill;
        this.path.strokeColor = c.stroke;
    };
    Shape.prototype.range = function (lo, hi) {
        var out = [];
        for (var i = lo; i <= hi; i++) {
            out.push(i);
        }
        return out;
    };
    return Shape;
}(Drawable_1.default));
exports.default = Shape;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Drawable_1 = __webpack_require__(15);
var Prop = /** @class */ (function (_super) {
    __extends(Prop, _super);
    function Prop(parent) {
        var _this = _super.call(this) || this;
        _this.m_parent = parent;
        return _this;
    }
    Object.defineProperty(Prop.prototype, "parent", {
        get: function () {
            return this.m_parent;
        },
        enumerable: true,
        configurable: true
    });
    return Prop;
}(Drawable_1.default));
exports.default = Prop;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Prop_1 = __webpack_require__(8);
var paper_1 = __webpack_require__(0);
var TextProp = /** @class */ (function (_super) {
    __extends(TextProp, _super);
    function TextProp(parent, args) {
        var _this = _super.call(this, parent) || this;
        _this.content = args[0] || 'label';
        _this.style = args[1] || 'normal';
        return _this;
    }
    TextProp.prototype.draw = function () {
        this.text = new paper_1.PointText({
            point: [0, 0],
            content: this.content,
            fontSize: '1em',
            fillColor: 'white',
            fontFamily: 'Roboto',
            fontWeight: this.style
        });
    };
    Object.defineProperty(TextProp.prototype, "path", {
        get: function () {
            return this.text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextProp.prototype, "width", {
        get: function () {
            return this.text.bounds.width;
        },
        set: function (n) {
            // skipping impl ;; text doesn't need to scale
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextProp.prototype, "height", {
        get: function () {
            return this.text.bounds.height;
        },
        set: function (n) {
            // skipping impl ;; text doesn't need to scale
        },
        enumerable: true,
        configurable: true
    });
    TextProp.prototype.visit = function (func) {
        func(this);
    };
    TextProp.prototype.intersects = function (b) {
        return false;
    };
    return TextProp;
}(Prop_1.default));
exports.default = TextProp;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Workspace_1 = __webpack_require__(2);
var Palette_1 = __webpack_require__(14);
var Class = /** @class */ (function () {
    function Class(name, extend) {
        this.m_name = name;
        this.m_extends = extend;
        this.m_blocks = [];
        this.m_palette = new Palette_1.default(this);
        this.m_workspace = new Workspace_1.default();
    }
    Class.prototype.show = function () {
        Workspace_1.default.active = this.m_workspace;
        Palette_1.default.active = this.m_palette;
    };
    Class.prototype.add = function (desc) {
        this.m_blocks.push(desc);
        this.m_palette.draw();
    };
    Object.defineProperty(Class.prototype, "blocks", {
        get: function () {
            var _this = this;
            var mine = this.m_blocks.map(function (d) { return { desc: d, owner: _this.name }; });
            if (this.m_extends) {
                return this.m_extends.blocks.concat(mine);
            }
            return mine;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Class.prototype, "extends", {
        get: function () {
            return this.m_extends;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Class.prototype, "name", {
        get: function () {
            return this.m_name;
        },
        enumerable: true,
        configurable: true
    });
    Class.prototype.transpile = function (t) {
        t.push_class(this.name, this.extends.name);
        for (var _i = 0, _a = this.m_workspace["blocks"]; _i < _a.length; _i++) {
            var block = _a[_i];
            //block.transpile(t);
            t.pop_method();
        }
        t.pop_class();
    };
    return Class;
}());
exports.default = Class;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Block_1 = __webpack_require__(6);
var StackedBlock = /** @class */ (function (_super) {
    __extends(StackedBlock, _super);
    function StackedBlock(shape, colour, hat, cap) {
        if (hat === void 0) { hat = false; }
        if (cap === void 0) { cap = false; }
        var _this = _super.call(this, shape, colour, undefined) || this;
        _this.hat = hat;
        _this.cap = cap;
        return _this;
    }
    StackedBlock.prototype.draw = function () {
        _super.prototype.draw.call(this);
        if (this.m_next) {
            this.m_next.draw(); // draw next
            this.m_next.group.bounds.topLeft = this.group.bounds.topLeft; // adjust position
            this.m_next.group.position.y += this.shape.height; // 'stack' below
            this.group.addChild(this.m_next.group); // group
        }
    };
    Object.defineProperty(StackedBlock.prototype, "next", {
        get: function () {
            return this.m_next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackedBlock.prototype, "top", {
        get: function () {
            if (this.m_prev === undefined) {
                return this;
            }
            if (this.m_prev === this) {
                console.warn("somehow connected to itself");
                return this.m_prev = undefined;
            }
            return this.m_prev.top;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackedBlock.prototype, "bottom", {
        get: function () {
            if (!this.m_next) {
                return this;
            }
            return this.m_next.bottom;
        },
        enumerable: true,
        configurable: true
    });
    StackedBlock.prototype.connect = function (b) {
        if (!(b instanceof StackedBlock)) {
            return false; // only connects to stack
        }
        if (b.cap || this.hat) {
            return false; // hat or cap prevention
        }
        if (this.m_prev) {
            this.disconnect();
        }
        if (b.m_next) // place block in between
         {
            var n = b.m_next;
            n.disconnect();
            n.connect(this.bottom);
        }
        b.m_next = this; // this -> b
        this.m_prev = b; // b <- this
        this.top.draw();
        return true;
    };
    StackedBlock.prototype.disconnect = function () {
        if (!this.m_prev) // no previous, can't disconnect
         {
            return false;
        }
        this.m_prev.m_next = undefined; // prev no longer knows about this
        this.top.draw(); // redraw entire script except this
        this.m_prev = undefined; // this no longer knows about prev
        this.draw(); // redraw this
        return true;
    };
    StackedBlock.prototype.visit = function (func) {
        _super.prototype.visit.call(this, func);
        if (this.m_next) {
            this.m_next.visit(func);
        }
    };
    return StackedBlock;
}(Block_1.default));
exports.default = StackedBlock;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Prop_1 = __webpack_require__(8);
var InputProp = /** @class */ (function (_super) {
    __extends(InputProp, _super);
    function InputProp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InputProp.prototype.draw = function () {
        if (this.m_value) {
            this.m_value.draw();
        }
        else {
            var e = this.empty;
            this.m_empty = e.shape;
            this.m_empty.draw();
            this.m_empty.colour(e.colour);
        }
    };
    InputProp.prototype.erase = function () {
        _super.prototype.erase.call(this);
        if (this.m_empty) {
            this.m_empty.erase();
        }
        if (this.m_value) {
            this.m_value.shape.erase();
        }
    };
    Object.defineProperty(InputProp.prototype, "path", {
        get: function () {
            if (this.m_value) {
                return this.m_value.group;
            }
            else if (this.m_empty) {
                return this.m_empty.path;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputProp.prototype, "width", {
        get: function () {
            if (this.m_value) {
                return this.m_value.shape.width;
            }
            else {
                return this.m_empty.width;
            }
        },
        set: function (n) {
            if (this.m_value) {
                this.m_value.shape.width = n;
            }
            else {
                this.m_empty.width = n;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputProp.prototype, "height", {
        get: function () {
            if (this.m_value) {
                return this.m_value.shape.height;
            }
            else {
                return this.m_empty.height;
            }
        },
        set: function (n) {
            if (this.m_value) {
                this.m_value.shape.height = n;
            }
            else {
                this.m_empty.height = n;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputProp.prototype, "value", {
        get: function () {
            return this.m_value;
        },
        set: function (a) {
            this.m_value = a;
            if (a) {
                this.m_value.container = this;
            }
        },
        enumerable: true,
        configurable: true
    });
    InputProp.prototype.visit = function (func) {
        if (this.m_value) {
            this.m_value.visit(func);
        }
        else {
            func(this);
        }
    };
    InputProp.prototype.intersects = function (b) {
        return this.path.bounds.intersects(b);
    };
    return InputProp;
}(Prop_1.default));
exports.default = InputProp;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Workspace_1 = __webpack_require__(2);
var Cursor = /** @class */ (function () {
    function Cursor() {
    }
    Cursor.init = function () {
        paper.project.view.onMouseUp = function (e) { return Cursor.stop(e); }; // register
        paper.project.view.onMouseMove = function (e) { return Cursor.move(e); };
    };
    Cursor.drag = function (target, e) {
        if (this.active && this.active !== target) // already dragging
         {
            return;
        }
        else if (!this.active) // new drag
         {
            this.active = target;
            this.start = e.point;
        }
    };
    Cursor.move = function (e) {
        if (!this.active) {
            return; // no drag
        }
        this.active.group.translate(e.delta); // move
        if (this.distance(e) > this.threshold) // drag away
         {
            if (Workspace_1.default.active.disconnect(this.active)) {
                console.log("disconnected blocks!");
            }
        }
    };
    Cursor.stop = function (e) {
        if (!this.active) {
            return; // no drag
        }
        if (Workspace_1.default.active.connect(this.active)) // connect
         {
        }
        else if (this.active.top !== this.active && this.distance(e) < this.threshold) // 'snap' back
         {
            this.active.top.draw();
        }
        this.active = undefined;
    };
    Cursor.distance = function (e) {
        return this.start.getDistance(e.point);
    };
    Cursor.threshold = 30;
    return Cursor;
}());
exports.default = Cursor;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var paper_1 = __webpack_require__(0);
var Editor_1 = __webpack_require__(3);
var Blocks_1 = __webpack_require__(4);
var Workspace_1 = __webpack_require__(2);
var OverrideBlock_1 = __webpack_require__(33);
var NewBlock_1 = __webpack_require__(34);
var Palette = /** @class */ (function () {
    function Palette(target) {
        this.target = target;
    }
    Palette.prototype.draw = function () {
        if (this.m_scroll_pane) {
            this.m_scroll_pane.remove();
        }
        this.m_scroll_pane = new paper_1.Group();
        var pos = new paper_1.Point(Editor_1.default.padding * 2 + 60, Editor_1.default.header_height + Editor_1.default.padding * 3);
        var _loop_1 = function (b) {
            var parsed = Blocks_1.Blocks.parse(b.desc);
            var block_1 = Blocks_1.Blocks.create(b.desc);
            block_1["draw_display"]();
            block_1.group.scale(0.7);
            block_1.group.bounds.topLeft = pos;
            block_1.shape.path.onMouseDown = function (e) { return Workspace_1.default.active.add(Blocks_1.Blocks.create(b.desc)); };
            this_1.m_scroll_pane.addChild(block_1.group);
            pos.y += block_1.shape.height + Editor_1.default.padding * 2;
            if (parsed.virtual === true && b.owner !== this_1.target.name) {
                block_1 = new OverrideBlock_1.default(b.desc);
                block_1["draw_display"]();
                block_1.group.scale(0.7);
                block_1.group.bounds.topLeft = pos;
                block_1.shape.path.onMouseDown = function (e) { return Workspace_1.default.active.add(new OverrideBlock_1.default(b.desc)); };
                this_1.m_scroll_pane.addChild(block_1.group);
                pos.y += block_1.shape.height + Editor_1.default.padding * 2;
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.target.blocks; _i < _a.length; _i++) {
            var b = _a[_i];
            _loop_1(b);
        }
        var block = new NewBlock_1.default();
        block["draw_display"]();
        block.group.scale(0.7);
        block.group.bounds.topLeft = pos;
        block.shape.path.onMouseDown = function (e) { return Workspace_1.default.active.add(new NewBlock_1.default()); };
        this.m_scroll_pane.addChild(block.group);
        pos.y += block.shape.height + Editor_1.default.padding * 2;
    };
    Palette.prototype.load = function () {
        if (!this.m_scroll_pane) {
            this.draw();
        }
        this.m_scroll_pane.visible = true;
    };
    Palette.prototype.unload = function () {
        this.m_scroll_pane.visible = false;
    };
    Object.defineProperty(Palette.prototype, "group", {
        get: function () {
            return this.m_scroll_pane;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Palette, "active", {
        get: function () {
            return this.m_active;
        },
        set: function (p) {
            this.m_active = p;
            this.m_active.load();
        },
        enumerable: true,
        configurable: true
    });
    return Palette;
}());
exports.default = Palette;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Drawable = /** @class */ (function () {
    function Drawable() {
    }
    Drawable.prototype.erase = function () {
        if (this.path) {
            this.path.onMouseDown = undefined;
            this.path.onMouseDrag = undefined;
            this.path.remove();
        }
    };
    return Drawable;
}());
exports.default = Drawable;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var NestedBlock_1 = __webpack_require__(17);
var Shapes_1 = __webpack_require__(1);
var ReporterBlock = /** @class */ (function (_super) {
    __extends(ReporterBlock, _super);
    function ReporterBlock(colour) {
        return _super.call(this, Shapes_1.default.REPORTER, colour, undefined) || this;
    }
    return ReporterBlock;
}(NestedBlock_1.default));
exports.default = ReporterBlock;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Block_1 = __webpack_require__(6);
var InputProp_1 = __webpack_require__(12);
var NestedBlock = /** @class */ (function (_super) {
    __extends(NestedBlock, _super);
    function NestedBlock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NestedBlock.prototype.disconnect = function () {
        if (!this.m_container) {
            return false;
        }
        this.m_container.value = undefined; // container no longer knows about this
        this.top.draw(); // redraw parent block of container prop
        this.m_container = undefined; // this no longer knows about container
        this.draw(); // redraw this
        return true;
    };
    NestedBlock.prototype.connect = function (b) {
        if (this.m_container) {
            return false; // already connected
        }
        if (!(b instanceof InputProp_1.default)) {
            return false;
        }
        var inp = b;
        if (!inp.compatible(this.shape.type)) {
            return false;
        }
        inp.value = this; // todo check reporter or boolean 
        inp.parent.top.draw();
        return true;
    };
    Object.defineProperty(NestedBlock.prototype, "container", {
        set: function (c) {
            this.m_container = c;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NestedBlock.prototype, "top", {
        get: function () {
            if (!this.m_container) {
                return this;
            }
            return this.m_container.parent.top;
        },
        enumerable: true,
        configurable: true
    });
    return NestedBlock;
}(Block_1.default));
exports.default = NestedBlock;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Prop_1 = __webpack_require__(8);
var paper_1 = __webpack_require__(0);
var Block_1 = __webpack_require__(6);
var DropdownProp = /** @class */ (function (_super) {
    __extends(DropdownProp, _super);
    function DropdownProp(parent, args) {
        var _this = _super.call(this, parent) || this;
        _this.m_options = args[0];
        _this.m_selected = 0;
        return _this;
    }
    DropdownProp.prototype.draw = function () {
        var _this = this;
        var text = new paper_1.PointText({
            content: this.m_options()[this.m_selected],
            fillColor: 'white',
            justification: 'center',
            fontFamily: 'Roboto',
            fontSize: '1em'
        });
        var arrow = new paper_1.Path.RegularPolygon({
            center: [text.bounds.right + 7 + Block_1.default.h_padding, text.bounds.center.y + 3.5],
            sides: 3,
            radius: 7,
            fillColor: this.parent.colour.fill,
            rotation: 180
        });
        var ta = new paper_1.Group([text, arrow]);
        var rect = new paper_1.Path.Rectangle({
            width: ta.bounds.width + Block_1.default.h_padding * 2,
            height: ta.bounds.height + Block_1.default.v_padding * 2,
            fillColor: this.parent.colour.stroke,
            radius: 4
        });
        rect.bounds.center = ta.bounds.center;
        this.m_group = new paper_1.Group([rect, ta]);
        this.m_group.onClick = function (e) {
            console.log(_this.m_options());
            if (++_this.m_selected >= _this.m_options().length) {
                _this.m_selected = 0;
            }
            _this.m_group.children[1].children[0].content = _this.m_options()[_this.m_selected];
        };
    };
    Object.defineProperty(DropdownProp.prototype, "path", {
        get: function () {
            return this.m_group;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropdownProp.prototype, "width", {
        get: function () {
            return this.m_group.bounds.width;
        },
        set: function (n) {
            return; // skipping impl ;; dropdown doesn't scale
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropdownProp.prototype, "height", {
        get: function () {
            return this.m_group.bounds.height;
        },
        set: function (n) {
            return; // skipping impl ;; dropdown doesn't scale
        },
        enumerable: true,
        configurable: true
    });
    DropdownProp.prototype.visit = function (func) {
        func(this);
    };
    DropdownProp.prototype.intersects = function (b) {
        return b.intersects(this.m_group.bounds);
    };
    return DropdownProp;
}(Prop_1.default));
exports.default = DropdownProp;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Prop_1 = __webpack_require__(8);
var paper_1 = __webpack_require__(0);
var Block_1 = __webpack_require__(6);
var Workspace_1 = __webpack_require__(2);
var Blocks_1 = __webpack_require__(4);
var Colour_1 = __webpack_require__(5);
var DispenserProp = /** @class */ (function (_super) {
    __extends(DispenserProp, _super);
    function DispenserProp(parent, args) {
        var _this = _super.call(this, parent) || this;
        _this.m_shape = args[0];
        _this.content = args[1] || "n";
        return _this;
    }
    DispenserProp.prototype.visit = function (func) {
        return; // can't visit dispensers
    };
    DispenserProp.prototype.intersects = function (b) {
        return false; // can't intersect dispensers
    };
    DispenserProp.prototype.draw = function () {
        var _this = this;
        this.m_group = new paper_1.Group();
        this.m_shape.draw(); // shape
        this.m_shape.colour(this.parent.colour);
        this.m_group.addChild(this.m_shape.path);
        var text = new paper_1.PointText // text
        ({
            point: [0, 0],
            content: this.content,
            fontSize: '1em',
            fillColor: 'white',
            fontFamily: 'Roboto'
        });
        this.m_group.addChild(text);
        this.m_shape.width = Math.max(50, text.bounds.width + Block_1.default.h_padding * 2);
        this.m_shape.height = text.bounds.height + Block_1.default.v_padding * 2;
        text.bounds.center = this.m_shape.path.bounds.center; // align
        this.m_shape.path.onMouseDown = function (e) {
            Workspace_1.default.active.add(Blocks_1.Blocks.create(_this.desc()));
        };
    };
    Object.defineProperty(DispenserProp.prototype, "path", {
        get: function () {
            return this.m_group;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DispenserProp.prototype, "width", {
        get: function () {
            return this.m_shape.width;
        },
        set: function (n) {
            this.m_shape.width = n;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DispenserProp.prototype, "height", {
        get: function () {
            return this.m_shape.height;
        },
        set: function (n) {
            this.m_shape.height = n;
        },
        enumerable: true,
        configurable: true
    });
    DispenserProp.prototype.desc = function () {
        return "\n        {\n            shape: '" + this.m_shape.type + "',\n            category: '" + this.colour() + "',\n            props:\n            [\n                { type: 'text', args: ['" + this.content + "'] }\n            ]\n        }";
    };
    DispenserProp.prototype.colour = function () {
        for (var c in Colour_1.Colours) {
            if (Colour_1.Colours[c] === this.parent.colour) {
                return c;
            }
        }
    };
    return DispenserProp;
}(Prop_1.default));
exports.default = DispenserProp;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var paper_1 = __webpack_require__(0);
var Editor_1 = __webpack_require__(3);
var Blocks_1 = __webpack_require__(4);
var Colour_1 = __webpack_require__(5);
var Shapes_1 = __webpack_require__(1);
var Workspace_1 = __webpack_require__(2);
var DefineBlock_1 = __webpack_require__(36);
var BlockEditor = /** @class */ (function () {
    function BlockEditor() {
    }
    BlockEditor.draw = function () {
        var _this = this;
        this.first = paper_1.project.activeLayer;
        this.layer = new paper_1.Layer(); // draw above
        this.layer.activate();
        // dark overlay
        var bg = new paper_1.Path.Rectangle({
            x: 0,
            y: 0,
            width: paper_1.project.view.size.width,
            height: paper_1.project.view.size.height,
            fillColor: Editor_1.default.Colours.DARK,
            opacity: 0.8
        });
        // light grey bg
        var bg2 = new paper_1.Path.Rectangle({
            width: Math.max(700, paper_1.project.view.size.width / 2),
            height: Math.max(500, paper_1.project.view.size.height / 2),
            fillColor: Editor_1.default.Colours.LIGHT,
            radius: 10
        });
        bg2.bounds.center = paper_1.project.view.center;
        this.pane = bg2.bounds;
        // category circles
        var circs = new paper_1.Group();
        var pos = 0;
        var _loop_1 = function (col) {
            var c = Colour_1.Colours[col];
            circs.addChild(new paper_1.Path.Circle({
                center: [pos += 70, 0],
                radius: 15,
                fillColor: c.fill,
                strokeColor: c.stroke,
                strokeWidth: 2
            }));
            circs.lastChild.onMouseDown = function (e) {
                _this.category = col;
                _this.refresh_block();
            };
            circs.addChild(new paper_1.PointText({
                point: [pos, 30],
                content: col.toLowerCase(),
                fillColor: Editor_1.default.Colours.TEXT,
                justification: 'center',
                fontFamily: 'Roboto',
                fontSize: '0.7em'
            }));
        };
        for (var col in Colour_1.Colours) {
            _loop_1(col);
        }
        circs.bounds.center = this.pane.topCenter.clone().add([0, 200]);
        // prop btns
        var rect = new paper_1.Path.Rectangle({
            width: 100,
            height: 80,
            fillColor: Editor_1.default.Colours.LIGHT,
            strokeColor: Editor_1.default.Colours.DARK,
            strokeWidth: 3.5,
            radius: 10
        });
        // text btn
        var txt = new paper_1.PointText({
            content: "text",
            fillColor: Editor_1.default.Colours.TEXT,
            justification: 'center',
            fontFamily: 'Roboto',
            fontSize: '1.5em'
        });
        txt.bounds.center = rect.bounds.center;
        var text_btn = new paper_1.Group([rect.clone(), txt]);
        text_btn.onClick = function (e) {
            _this.props.push({ type: 'text', args: [window.prompt("text label", "describe your block!")] });
            _this.refresh_block();
        };
        // boolean btn
        var shape = Shapes_1.default.BOOLEAN;
        shape.draw();
        shape.colour({ fill: Editor_1.default.Colours.LIGHT, stroke: Editor_1.default.Colours.DARK });
        shape.path.bounds.center = rect.bounds.center;
        shape.path.strokeWidth = 3.5;
        var bool_btn = new paper_1.Group([rect.clone(), shape.path]);
        bool_btn.position.x += 150;
        bool_btn.onClick = function (e) {
            _this.props.push({ type: 'boolean', args: [window.prompt("add an input", "true or false")] });
            _this.refresh_block();
        };
        // reporter btn
        var shape2 = Shapes_1.default.REPORTER;
        shape2.draw();
        shape2.colour({ fill: Editor_1.default.Colours.LIGHT, stroke: Editor_1.default.Colours.DARK });
        shape2.path.bounds.center = rect.bounds.center;
        shape2.path.strokeWidth = 3.5;
        var rep_btn = new paper_1.Group([rect, shape2.path]);
        rep_btn.position.x += 150 * 2;
        rep_btn.onClick = function (e) {
            _this.props.push({ type: 'reporter', args: [window.prompt("add an input", "number, text, or object")] });
            _this.refresh_block();
        };
        this.btns = new paper_1.Group([text_btn, rep_btn, bool_btn]);
        this.btns.bounds.center = this.pane.topCenter.clone().add([0, 300]);
        var rect2 = new paper_1.Path.Rectangle({
            width: 120,
            height: 50,
            fillColor: Editor_1.default.Colours.SUBTEXT,
            radius: 4,
        });
        var ok = new paper_1.PointText({
            content: "✔",
            fillColor: Editor_1.default.Colours.TEXT,
            justification: 'center',
            fontFamily: 'Roboto',
            fontSize: '1em'
        });
        ok.bounds.center = rect2.bounds.clone().center;
        var ok_btn = new paper_1.Group([rect2.clone(), ok]);
        ok_btn.bounds.bottomRight = this.pane.bottomRight.clone().add([-20, -20]);
        ok_btn.onClick = function (e) {
            _this.hide();
            var d = _this.desc();
            Editor_1.default.active.add(d);
            Workspace_1.default.active.add(new DefineBlock_1.default(d));
        };
        this.btns.addChild(ok_btn);
        var cancel = new paper_1.PointText({
            content: "cancel",
            fillColor: Editor_1.default.Colours.TEXT,
            justification: 'center',
            fontFamily: 'Roboto',
            fontSize: '1em'
        });
        cancel.bounds.center = rect2.bounds.clone().center;
        var cancel_btn = new paper_1.Group([rect2.clone(), cancel]);
        cancel_btn.bounds.bottomRight = this.pane.bottomRight.clone().add([-150, -20]);
        cancel_btn.onClick = function (e) {
            _this.hide();
        };
        var variable = new paper_1.PointText({
            content: "create variable",
            fillColor: Editor_1.default.Colours.TEXT,
            justification: 'center',
            fontFamily: 'Roboto',
            fontSize: '1em'
        });
        rect2.fillColor = Colour_1.Colours.VARIABLES.fill;
        variable.bounds.center = rect2.bounds.center;
        var var_btn = new paper_1.Group([rect2, variable]);
        var_btn.bounds.bottomLeft = this.pane.bottomLeft.clone().add([20, -20]);
        var_btn.onClick = function (e) {
            var name = window.prompt("create a variable", "my variable");
            var desc = "\n            {\n                shape: 'REPORTER',\n                category: 'VARIABLES',\n                props:\n                [\n                    { type: 'text', args: ['" + name + "'] },\n                ]\n            }\n            ";
            _this.hide();
            Editor_1.default.active.add(desc);
        };
        // close btn
        var x = new paper_1.CompoundPath({
            children: [
                new paper_1.Path.Rectangle({ position: [paper_1.project.view.size.width - 30, 30], width: 20, height: 4, radius: 3 }),
                new paper_1.Path.Rectangle({ position: [paper_1.project.view.size.width - 30, 30], width: 4, height: 20, radius: 3 }),
            ],
            fillColor: Editor_1.default.Colours.TEXT,
            rotation: 45
        });
        x.onClick = function (e) { return _this.hide(); };
        this.first.activate();
    };
    BlockEditor.show = function () {
        if (!this.layer) {
            this.draw();
        }
        this.layer.visible = true;
        this.layer.activate();
        this.props = [];
        this.category = 'OBJECT';
        this.refresh_block();
    };
    BlockEditor.desc = function () {
        return "\n        {\n            shape: 'STACK',\n            category: '" + this.category + "',\n            props:\n            [\n                " + this.props.map(function (p) { return "{ type: '" + p.type + "', args: [" + p.args.map(function (s) { return "\"" + s + "\""; }).join(',') + "] }"; }).join(',') + "\n            ],\n            virtual: true\n        }";
    };
    BlockEditor.refresh_block = function () {
        var _this = this;
        if (this.block) {
            this.block.group.remove();
        }
        this.block = Blocks_1.Blocks.create(this.desc());
        this.block.draw_display();
        this.block.group.bounds.topCenter = this.pane.topCenter.clone().add([0, 60]);
        // update btns
        this.btns.children.forEach(function (c) {
            var fill = Colour_1.Colours[_this.category].fill;
            var stroke = Colour_1.Colours[_this.category].stroke;
            if (!(c.children[1] instanceof paper_1.PointText)) // text
             {
                c.children[1].fillColor = '#0000000F';
                c.children[1].strokeColor = stroke;
            }
            c.children[0].fillColor = fill;
            c.children[0].strokeColor = stroke;
        });
    };
    BlockEditor.hide = function () {
        this.first.activate();
        this.layer.visible = false;
    };
    return BlockEditor;
}());
exports.default = BlockEditor;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(22);
var Cursor_1 = __webpack_require__(13);
var Workspace_1 = __webpack_require__(2);
var Editor_1 = __webpack_require__(3);
var BlockEditor_1 = __webpack_require__(20);
var Class_1 = __webpack_require__(10);
function init() {
    window.alert("Hey there! Welcome to soop. This is an early alpha version, and there's a lot of bugs, so please bear with me. I made this alone in six days, though the current version is made entirely in 48 hours. If something breaks just reload. You can't quite drag blocks out to create them yet, instead, just click them once. Press F4 to toggle the \'Gamer\' class that extends the Player one(works once, it's a debug tool :P).");
    paper.setup($("#editor")[0]); // init paperjs
    Cursor_1.default.init();
    Editor_1.default.init();
    //COMMENTED OUT CODE BELOW IS DEV TOOL TO FIND WHICH VERTICES IN THE SVG PATHS HAVE TO DO WITH SCALING
    // const path = new Path(`M.5,20.5a20,20,0,0,1,20-20h92a20,20,0,0,1,20,20v52a4,4,0,0,1-4,4h-80a5.2,5.2,0,0,0-4,2l-4,4a5.2,5.2,0,0,1-4,2h-12a5.2,5.2,0,0,1-4-2l-4-4a5.2,5.2,0,0,0-4-2h-8a4,4,0,0,1-4-4Z`);
    // path.fillColor = 'green';
    // let i = 0;
    // path.segments[i].point.selected = true;
    // window.onkeypress = (evt: KeyboardEvent) =>
    // {
    // 	if (evt.key == ' ')
    // 	{
    // 		path.segments[i].point.selected = false;
    // 		path.segments[++i].point.selected = true;
    // 		console.log(i);
    // 	}
    // }
}
window.onload = init;
window.onkeydown = function (e) {
    if (e.key == 'F1') {
        Workspace_1.default.active.highlight_loose();
    }
    if (e.key == 'F2') {
        Workspace_1.default.active.unload();
    }
    if (e.key == 'F3') {
        window.prompt("current block", BlockEditor_1.default.desc());
    }
    if (e.key == 'F4') {
        Editor_1.default.classes.push(new Class_1.default("Gamer", Editor_1.default.classes[0]));
        Editor_1.default.active = Editor_1.default.classes[2];
    }
};
window.onkeyup = function (e) {
    if (e.key == 'F1') {
        Workspace_1.default.active.unhighlight_loose();
    }
    if (e.key == 'F2') {
        Workspace_1.default.active.load();
    }
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(23);
            var content = __webpack_require__(24);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : null;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(25);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "html, body\n{\n\tmargin: 0;\n\theight: 100%;\n\toverflow: hidden\n}\n\n#editor\n{\n\tposition: fixed;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: #26282e;\n}\n\n#fontload\n{\n\tfont-family: 'Roboto', sans-serif;\n    font-size: 0;\n}", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Shape_1 = __webpack_require__(7);
var paper_1 = __webpack_require__(0);
var StackShape = /** @class */ (function (_super) {
    __extends(StackShape, _super);
    function StackShape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackShape.prototype.draw = function () {
        this.m_path = new paper_1.Path("M.5,4.5a4,4,0,0,1,4-4h8a5.2,5.2,0,0,1,4,2l4,4a5.2,5.2,0,0,0,4,2h12a5.2,5.2,0,0,0,4-2l4-4a5.2,5.2,0,0,1,4-2h131a4,4,0,0,1,4,4v40a4,4,0,0,1-4,4H48.5a5.2,5.2,0,0,0-4,2l-4,4a5.2,5.2,0,0,1-4,2h-12a5.2,5.2,0,0,1-4-2l-4-4a5.2,5.2,0,0,0-4-2h-8a4,4,0,0,1-4-4Z");
    };
    Object.defineProperty(StackShape.prototype, "path", {
        get: function () {
            return this.m_path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackShape.prototype, "width", {
        get: function () {
            return this.m_path.bounds.width;
        },
        set: function (n) {
            var _this = this;
            var a = Math.max(n, 60) - this.width;
            this.range(10, 13).forEach(function (n) { return _this.m_path.segments[n].point.x += a; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackShape.prototype, "height", {
        get: function () {
            return this.m_path.segments[13].point.y - this.m_path.segments[10].point.y; // ignore btm notch
        },
        set: function (n) {
            var _this = this;
            var a = n - this.height;
            this.range(12, 23).forEach(function (n) { return _this.m_path.segments[n].point.y += a; });
        },
        enumerable: true,
        configurable: true
    });
    return StackShape;
}(Shape_1.default));
exports.default = StackShape;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var paper_1 = __webpack_require__(0);
var Shape_1 = __webpack_require__(7);
var ReporterShape = /** @class */ (function (_super) {
    __extends(ReporterShape, _super);
    function ReporterShape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReporterShape.prototype.draw = function () {
        this.m_path = new paper_1.Path("M20.5.5h45a20,20,0,0,1,20,20h0a20,20,0,0,1-20,20h-45a20,20,0,0,1-20-20h0A20,20,0,0,1,20.5.5Z");
        this.width = 50;
    };
    Object.defineProperty(ReporterShape.prototype, "path", {
        get: function () {
            return this.m_path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReporterShape.prototype, "width", {
        get: function () {
            return this.m_path.bounds.width;
        },
        set: function (n) {
            var _this = this;
            var a = Math.max(50, n) - this.width;
            this.range(1, 4).forEach(function (n) { return _this.m_path.segments[n].point.x += a; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReporterShape.prototype, "height", {
        get: function () {
            return this.m_path.bounds.height;
        },
        set: function (n) {
            var _this = this;
            var a = n - this.height;
            this.range(3, 6).forEach(function (n) { return _this.m_path.segments[n].point.y += a; });
        },
        enumerable: true,
        configurable: true
    });
    return ReporterShape;
}(Shape_1.default));
exports.default = ReporterShape;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var paper_1 = __webpack_require__(0);
var Shape_1 = __webpack_require__(7);
var BooleanShape = /** @class */ (function (_super) {
    __extends(BooleanShape, _super);
    function BooleanShape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BooleanShape.prototype.draw = function () {
        this.m_path = new paper_1.Path("M20.71.5h105l20,20h0l-20,20h-105l-20-20h0Z");
        this.width = 70;
    };
    Object.defineProperty(BooleanShape.prototype, "path", {
        get: function () {
            return this.m_path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BooleanShape.prototype, "width", {
        get: function () {
            return this.m_path.bounds.width;
        },
        set: function (n) {
            var _this = this;
            var a = Math.max(70, n) - this.width;
            this.range(1, 4).forEach(function (n) { return _this.m_path.segments[n].point.x += a; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BooleanShape.prototype, "height", {
        get: function () {
            return this.m_path.bounds.height;
        },
        set: function (n) {
            var _this = this;
            var a = n - this.height;
            this.range(3, 6).forEach(function (n) { return _this.m_path.segments[n].point.y += a; });
        },
        enumerable: true,
        configurable: true
    });
    return BooleanShape;
}(Shape_1.default));
exports.default = BooleanShape;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var paper_1 = __webpack_require__(0);
var Shape_1 = __webpack_require__(7);
var HatShape = /** @class */ (function (_super) {
    __extends(HatShape, _super);
    function HatShape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HatShape.prototype.draw = function () {
        this.m_path = new paper_1.Path("M.5,20.5a20,20,0,0,1,20-20h92a20,20,0,0,1,20,20v52a4,4,0,0,1-4,4h-80a5.2,5.2,0,0,0-4,2l-4,4a5.2,5.2,0,0,1-4,2h-12a5.2,5.2,0,0,1-4-2l-4-4a5.2,5.2,0,0,0-4-2h-8a4,4,0,0,1-4-4Z");
    };
    Object.defineProperty(HatShape.prototype, "path", {
        get: function () {
            return this.m_path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HatShape.prototype, "width", {
        get: function () {
            return this.m_path.bounds.width;
        },
        set: function (n) {
            var _this = this;
            var a = n - this.width;
            this.range(2, 5).forEach(function (n) { return _this.m_path.segments[n].point.x += a; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HatShape.prototype, "height", {
        get: function () {
            return this.m_path.segments[5].point.y - this.m_path.segments[2].point.y;
        },
        set: function (n) {
            var _this = this;
            var a = n - this.height;
            this.range(4, 15).forEach(function (n) { return _this.m_path.segments[n].point.y += a; });
        },
        enumerable: true,
        configurable: true
    });
    return HatShape;
}(Shape_1.default));
exports.default = HatShape;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var NestedBlock_1 = __webpack_require__(17);
var Shapes_1 = __webpack_require__(1);
var BooleanBlock = /** @class */ (function (_super) {
    __extends(BooleanBlock, _super);
    function BooleanBlock(colour) {
        return _super.call(this, Shapes_1.default.BOOLEAN, colour, undefined) || this;
    }
    return BooleanBlock;
}(NestedBlock_1.default));
exports.default = BooleanBlock;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var InputProp_1 = __webpack_require__(12);
var Shapes_1 = __webpack_require__(1);
var ReporterInputProp = /** @class */ (function (_super) {
    __extends(ReporterInputProp, _super);
    function ReporterInputProp(parent) {
        return _super.call(this, parent) || this;
    }
    Object.defineProperty(ReporterInputProp.prototype, "empty", {
        get: function () {
            return { shape: Shapes_1.default.REPORTER, colour: { fill: 'white', stroke: this.parent.colour.stroke } };
        },
        enumerable: true,
        configurable: true
    });
    ReporterInputProp.prototype.compatible = function (s) {
        return s === 'reporter' || s === 'boolean';
    };
    return ReporterInputProp;
}(InputProp_1.default));
exports.default = ReporterInputProp;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var InputProp_1 = __webpack_require__(12);
var Shapes_1 = __webpack_require__(1);
var BooleanInputProp = /** @class */ (function (_super) {
    __extends(BooleanInputProp, _super);
    function BooleanInputProp(parent) {
        return _super.call(this, parent) || this;
    }
    Object.defineProperty(BooleanInputProp.prototype, "empty", {
        get: function () {
            return { shape: Shapes_1.default.BOOLEAN, colour: { fill: this.parent.colour.stroke, stroke: this.parent.colour.fill } };
        },
        enumerable: true,
        configurable: true
    });
    BooleanInputProp.prototype.compatible = function (s) {
        return s === 'boolean';
    };
    return BooleanInputProp;
}(InputProp_1.default));
exports.default = BooleanInputProp;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var StackedBlock_1 = __webpack_require__(11);
var Shapes_1 = __webpack_require__(1);
var TextProp_1 = __webpack_require__(9);
var Blocks_1 = __webpack_require__(4);
var DispenserProp_1 = __webpack_require__(19);
var OverrideBlock = /** @class */ (function (_super) {
    __extends(OverrideBlock, _super);
    function OverrideBlock(desc) {
        var _this = this;
        var parsed = Blocks_1.Blocks.parse(desc);
        _this = _super.call(this, Shapes_1.default.HAT, parsed.colour, true) || this;
        _this.add(TextProp_1.default, "override", "italic 700");
        //this.add(TextProp, "v");
        for (var _i = 0, _a = parsed.props; _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop.type) {
                case "text":
                    _this.add.apply(_this, [TextProp_1.default].concat(prop.args));
                    break;
                case "reporter":
                    _this.add.apply(_this, [DispenserProp_1.default, Shapes_1.default.REPORTER].concat(prop.args));
                    break;
                case "boolean":
                    _this.add.apply(_this, [DispenserProp_1.default, Shapes_1.default.BOOLEAN].concat(prop.args));
                    break;
                default:
                    break;
            }
        }
        return _this;
    }
    return OverrideBlock;
}(StackedBlock_1.default));
exports.default = OverrideBlock;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReporterBlock_1 = __webpack_require__(16);
var Colour_1 = __webpack_require__(5);
var TextProp_1 = __webpack_require__(9);
var DropdownProp_1 = __webpack_require__(18);
var Editor_1 = __webpack_require__(3);
var NewBlock = /** @class */ (function (_super) {
    __extends(NewBlock, _super);
    function NewBlock() {
        var _this = _super.call(this, Colour_1.Colours.OBJECT) || this;
        _this.add(TextProp_1.default, "new");
        _this.add(DropdownProp_1.default, function () { return Editor_1.default.classes.map(function (c) { return c.name; }); });
        return _this;
    }
    return NewBlock;
}(ReporterBlock_1.default));
exports.default = NewBlock;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Class_1 = __webpack_require__(10);
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite() {
        return _super.call(this, "Sprite", undefined) || this;
    }
    Object.defineProperty(Sprite.prototype, "blocks", {
        get: function () {
            var _this = this;
            return [
                /* MOTION */
                "{\n    shape: 'STACK',\n    category: 'MOTION',\n    props:\n    [\n        { type: 'text', args: ['go to'] },\n        { type: 'text', args: ['x:'] },\n        { type: 'reporter', args: ['x'] },\n        { type: 'text', args: ['y:'] },\n        { type: 'reporter', args: ['y'] }\n    ],\n    virtual: true,\n    js: " + "(t, obj) =>\n    {\n        console.log(\"hellooo\");\n        // t.write(\"(\");\n        // obj.props[0].transpile(t);\n        // t.write(\" && \");\n        // obj.props[2].transpile(t);\n        // t.write(\")\");\n    }" + "\n}",
                "{\n    shape: 'STACK',\n    category: 'MOTION',\n    props:\n    [\n        { type: 'text', args: ['set'] },\n        { type: 'text', args: ['x:'] },\n        { type: 'reporter', args: ['x'] },\n    ]\n}",
                "{\n    shape: 'STACK',\n    category: 'MOTION',\n    props:\n    [\n        { type: 'text', args: ['set'] },\n        { type: 'text', args: ['y:'] },\n        { type: 'reporter', args: ['y'] },\n    ]\n}",
                "{\n    shape: 'BOOLEAN',\n    category: 'OPERATORS',\n    props:\n    [\n        { type: 'boolean', args: [\"a\"] },{ type: 'text', args: [\"and\"] },{ type: 'boolean', args: [\"b\"] }\n    ],\n    virtual: false\n}",
                "{\n    shape: 'REPORTER',\n    category: 'OPERATORS',\n    props:\n    [\n        { type: 'reporter', args: [\"a\"] },{ type: 'text', args: [\"+\"] },{ type: 'reporter', args: [\"b\"] }\n    ],\n    virtual: false\n}",
                "{\n    shape: 'REPORTER',\n    category: 'OPERATORS',\n    props:\n    [\n        { type: 'reporter', args: [\"a\"] },{ type: 'text', args: [\"-\"] },{ type: 'reporter', args: [\"b\"] }\n    ],\n    virtual: false\n}",
                "{\n    shape: 'REPORTER',\n    category: 'VARIABLES',\n    props:\n    [\n        { type: 'text', args: [\"health\"] }\n    ],\n    virtual: false\n}",
                "{\n    shape: 'STACK',\n    category: 'VARIABLES',\n    props:\n    [\n        { type: 'text', args: ['set'] },\n        { type: 'dropdown', args: [() => [\"select\", \"health\"]] },\n        { type: 'text', args: ['to'] },\n        { type: 'reporter', args: ['val'] },\n    ]\n}",
            ].map(function (d) { return { desc: d, owner: _this.name }; });
        },
        enumerable: true,
        configurable: true
    });
    return Sprite;
}(Class_1.default));
exports.default = Sprite;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var StackedBlock_1 = __webpack_require__(11);
var Shapes_1 = __webpack_require__(1);
var TextProp_1 = __webpack_require__(9);
var Blocks_1 = __webpack_require__(4);
var DispenserProp_1 = __webpack_require__(19);
var DefineBlock = /** @class */ (function (_super) {
    __extends(DefineBlock, _super);
    function DefineBlock(desc) {
        var _this = this;
        var parsed = Blocks_1.Blocks.parse(desc);
        _this = _super.call(this, Shapes_1.default.HAT, parsed.colour, true) || this;
        _this.add(TextProp_1.default, "define", "italic 700");
        for (var _i = 0, _a = parsed.props; _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop.type) {
                case "text":
                    _this.add.apply(_this, [TextProp_1.default].concat(prop.args));
                    break;
                case "reporter":
                    _this.add.apply(_this, [DispenserProp_1.default, Shapes_1.default.REPORTER].concat(prop.args));
                    break;
                case "boolean":
                    _this.add.apply(_this, [DispenserProp_1.default, Shapes_1.default.BOOLEAN].concat(prop.args));
                    break;
                default:
                    break;
            }
        }
        return _this;
    }
    return DefineBlock;
}(StackedBlock_1.default));
exports.default = DefineBlock;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map