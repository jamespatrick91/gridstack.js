"use strict";
/**
 * utils.ts 5.0.0-dev
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = exports.obsoleteAttr = exports.obsoleteOptsDel = exports.obsoleteOpts = exports.obsolete = void 0;
/** checks for obsolete method names */
// eslint-disable-next-line
function obsolete(self, f, oldName, newName, rev) {
    var wrapper = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.warn('gridstack.js: Function `' + oldName + '` is deprecated in ' + rev + ' and has been replaced ' +
            'with `' + newName + '`. It will be **completely** removed in v1.0');
        return f.apply(self, args);
    };
    wrapper.prototype = f.prototype;
    return wrapper;
}
exports.obsolete = obsolete;
/** checks for obsolete grid options (can be used for any fields, but msg is about options) */
function obsoleteOpts(opts, oldName, newName, rev) {
    if (opts[oldName] !== undefined) {
        opts[newName] = opts[oldName];
        console.warn('gridstack.js: Option `' + oldName + '` is deprecated in ' + rev + ' and has been replaced with `' +
            newName + '`. It will be **completely** removed in v1.0');
    }
}
exports.obsoleteOpts = obsoleteOpts;
/** checks for obsolete grid options which are gone */
function obsoleteOptsDel(opts, oldName, rev, info) {
    if (opts[oldName] !== undefined) {
        console.warn('gridstack.js: Option `' + oldName + '` is deprecated in ' + rev + info);
    }
}
exports.obsoleteOptsDel = obsoleteOptsDel;
/** checks for obsolete Jquery element attributes */
function obsoleteAttr(el, oldName, newName, rev) {
    var oldAttr = el.getAttribute(oldName);
    if (oldAttr !== null) {
        el.setAttribute(newName, oldAttr);
        console.warn('gridstack.js: attribute `' + oldName + '`=' + oldAttr + ' is deprecated on this object in ' + rev + ' and has been replaced with `' +
            newName + '`. It will be **completely** removed in v1.0');
    }
}
exports.obsoleteAttr = obsoleteAttr;
/**
 * Utility methods
 */
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /** convert a potential selector into actual list of html elements */
    Utils.getElements = function (els) {
        if (typeof els === 'string') {
            var list = document.querySelectorAll(els);
            if (!list.length && els[0] !== '.' && els[0] !== '#') {
                list = document.querySelectorAll('.' + els);
                if (!list.length) {
                    list = document.querySelectorAll('#' + els);
                }
            }
            return Array.from(list);
        }
        return [els];
    };
    /** convert a potential selector into actual single element */
    Utils.getElement = function (els) {
        if (typeof els === 'string') {
            if (!els.length)
                return null;
            if (els[0] === '#') {
                return document.getElementById(els.substring(1));
            }
            if (els[0] === '.' || els[0] === '[') {
                return document.querySelector(els);
            }
            // if we start with a digit, assume it's an id (error calling querySelector('#1')) as class are not valid CSS
            if (!isNaN(+els[0])) { // start with digit
                return document.getElementById(els);
            }
            // finally try string, then id then class
            var el = document.querySelector(els);
            if (!el) {
                el = document.getElementById(els);
            }
            if (!el) {
                el = document.querySelector('.' + els);
            }
            return el;
        }
        return els;
    };
    /** returns true if a and b overlap */
    Utils.isIntercepted = function (a, b) {
        return !(a.y >= b.y + b.h || a.y + a.h <= b.y || a.x + a.w <= b.x || a.x >= b.x + b.w);
    };
    /** returns true if a and b touch edges or corners */
    Utils.isTouching = function (a, b) {
        return Utils.isIntercepted(a, { x: b.x - 0.5, y: b.y - 0.5, w: b.w + 1, h: b.h + 1 });
    };
    /**
     * Sorts array of nodes
     * @param nodes array to sort
     * @param dir 1 for asc, -1 for desc (optional)
     * @param width width of the grid. If undefined the width will be calculated automatically (optional).
     **/
    Utils.sort = function (nodes, dir, column) {
        column = column || nodes.reduce(function (col, n) { return Math.max(n.x + n.w, col); }, 0) || 12;
        if (dir === -1)
            return nodes.sort(function (a, b) { return (b.x + b.y * column) - (a.x + a.y * column); });
        else
            return nodes.sort(function (b, a) { return (b.x + b.y * column) - (a.x + a.y * column); });
    };
    /**
     * creates a style sheet with style id under given parent
     * @param id will set the 'gs-style-id' attribute to that id
     * @param parent to insert the stylesheet as first child,
     * if none supplied it will be appended to the document head instead.
     */
    Utils.createStylesheet = function (id, parent) {
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.setAttribute('gs-style-id', id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (style.styleSheet) { // TODO: only CSSImportRule have that and different beast ??
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style.styleSheet.cssText = '';
        }
        else {
            style.appendChild(document.createTextNode('')); // WebKit hack
        }
        if (!parent) {
            // default to head
            parent = document.getElementsByTagName('head')[0];
            parent.appendChild(style);
        }
        else {
            parent.insertBefore(style, parent.firstChild);
        }
        return style.sheet;
    };
    /** removed the given stylesheet id */
    Utils.removeStylesheet = function (id) {
        var el = document.querySelector('STYLE[gs-style-id=' + id + ']');
        if (el && el.parentNode)
            el.remove();
    };
    /** inserts a CSS rule */
    Utils.addCSSRule = function (sheet, selector, rules) {
        if (typeof sheet.addRule === 'function') {
            sheet.addRule(selector, rules);
        }
        else if (typeof sheet.insertRule === 'function') {
            sheet.insertRule(selector + "{" + rules + "}");
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Utils.toBool = function (v) {
        if (typeof v === 'boolean') {
            return v;
        }
        if (typeof v === 'string') {
            v = v.toLowerCase();
            return !(v === '' || v === 'no' || v === 'false' || v === '0');
        }
        return Boolean(v);
    };
    Utils.toNumber = function (value) {
        return (value === null || value.length === 0) ? undefined : Number(value);
    };
    Utils.parseHeight = function (val) {
        var h;
        var unit = 'px';
        if (typeof val === 'string') {
            var match = val.match(/^(-[0-9]+\.[0-9]+|[0-9]*\.[0-9]+|-[0-9]+|[0-9]+)(px|em|rem|vh|vw|%)?$/);
            if (!match) {
                throw new Error('Invalid height');
            }
            unit = match[2] || 'px';
            h = parseFloat(match[1]);
        }
        else {
            h = val;
        }
        return { h: h, unit: unit };
    };
    /** copies unset fields in target to use the given default sources values */
    // eslint-disable-next-line
    Utils.defaults = function (target) {
        var _this = this;
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        sources.forEach(function (source) {
            for (var key in source) {
                if (!source.hasOwnProperty(key))
                    return;
                if (target[key] === null || target[key] === undefined) {
                    target[key] = source[key];
                }
                else if (typeof source[key] === 'object' && typeof target[key] === 'object') {
                    // property is an object, recursively add it's field over... #1373
                    _this.defaults(target[key], source[key]);
                }
            }
        });
        return target;
    };
    /** given 2 objects return true if they have the same values. Checks for Object {} having same fields and values (just 1 level down) */
    Utils.same = function (a, b) {
        if (typeof a !== 'object')
            return a == b;
        if (typeof a !== typeof b)
            return false;
        // else we have object, check just 1 level deep for being same things...
        if (Object.keys(a).length !== Object.keys(b).length)
            return false;
        for (var key in a) {
            if (a[key] !== b[key])
                return false;
        }
        return true;
    };
    /** copies over b size & position (GridStackPosition), and possibly min/max as well */
    Utils.copyPos = function (a, b, doMinMax) {
        if (doMinMax === void 0) { doMinMax = false; }
        a.x = b.x;
        a.y = b.y;
        a.w = b.w;
        a.h = b.h;
        if (doMinMax) {
            if (b.minW)
                a.minW = b.minW;
            if (b.minH)
                a.minH = b.minH;
            if (b.maxW)
                a.maxW = b.maxW;
            if (b.maxH)
                a.maxH = b.maxH;
        }
        return a;
    };
    /** true if a and b has same size & position */
    Utils.samePos = function (a, b) {
        return a && b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
    };
    /** removes field from the first object if same as the second objects (like diffing) and internal '_' for saving */
    Utils.removeInternalAndSame = function (a, b) {
        if (typeof a !== 'object' || typeof b !== 'object')
            return;
        for (var key in a) {
            var val = a[key];
            if (key[0] === '_' || val === b[key]) {
                delete a[key];
            }
            else if (val && typeof val === 'object' && b[key] !== undefined) {
                for (var i in val) {
                    if (val[i] === b[key][i] || i[0] === '_') {
                        delete val[i];
                    }
                }
                if (!Object.keys(val).length) {
                    delete a[key];
                }
            }
        }
    };
    /** return the closest parent (or itself) matching the given class */
    Utils.closestByClass = function (el, name) {
        while (el) {
            if (el.classList.contains(name))
                return el;
            el = el.parentElement;
        }
        return null;
    };
    /** delay calling the given function for given delay, preventing new calls from happening while waiting */
    Utils.throttle = function (func, delay) {
        var isWaiting = false;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!isWaiting) {
                isWaiting = true;
                setTimeout(function () { func.apply(void 0, args); isWaiting = false; }, delay);
            }
        };
    };
    Utils.removePositioningStyles = function (el) {
        var style = el.style;
        if (style.position) {
            style.removeProperty('position');
        }
        if (style.left) {
            style.removeProperty('left');
        }
        if (style.top) {
            style.removeProperty('top');
        }
        if (style.width) {
            style.removeProperty('width');
        }
        if (style.height) {
            style.removeProperty('height');
        }
    };
    /** @internal returns the passed element if scrollable, else the closest parent that will, up to the entire document scrolling element */
    Utils.getScrollElement = function (el) {
        if (!el)
            return document.scrollingElement || document.documentElement; // IE support
        var style = getComputedStyle(el);
        var overflowRegex = /(auto|scroll)/;
        if (overflowRegex.test(style.overflow + style.overflowY)) {
            return el;
        }
        else {
            return this.getScrollElement(el.parentElement);
        }
    };
    /** @internal */
    Utils.updateScrollPosition = function (el, position, distance) {
        // is widget in view?
        var rect = el.getBoundingClientRect();
        var innerHeightOrClientHeight = (window.innerHeight || document.documentElement.clientHeight);
        if (rect.top < 0 ||
            rect.bottom > innerHeightOrClientHeight) {
            // set scrollTop of first parent that scrolls
            // if parent is larger than el, set as low as possible
            // to get entire widget on screen
            var offsetDiffDown = rect.bottom - innerHeightOrClientHeight;
            var offsetDiffUp = rect.top;
            var scrollEl = this.getScrollElement(el);
            if (scrollEl !== null) {
                var prevScroll = scrollEl.scrollTop;
                if (rect.top < 0 && distance < 0) {
                    // moving up
                    if (el.offsetHeight > innerHeightOrClientHeight) {
                        scrollEl.scrollTop += distance;
                    }
                    else {
                        scrollEl.scrollTop += Math.abs(offsetDiffUp) > Math.abs(distance) ? distance : offsetDiffUp;
                    }
                }
                else if (distance > 0) {
                    // moving down
                    if (el.offsetHeight > innerHeightOrClientHeight) {
                        scrollEl.scrollTop += distance;
                    }
                    else {
                        scrollEl.scrollTop += offsetDiffDown > distance ? distance : offsetDiffDown;
                    }
                }
                // move widget y by amount scrolled
                position.top += scrollEl.scrollTop - prevScroll;
            }
        }
    };
    /**
     * @internal Function used to scroll the page.
     *
     * @param event `MouseEvent` that triggers the resize
     * @param el `HTMLElement` that's being resized
     * @param distance Distance from the V edges to start scrolling
     */
    Utils.updateScrollResize = function (event, el, distance) {
        var scrollEl = this.getScrollElement(el);
        var height = scrollEl.clientHeight;
        // #1727 event.clientY is relative to viewport, so must compare this against position of scrollEl getBoundingClientRect().top
        // #1745 Special situation if scrollEl is document 'html': here browser spec states that
        // clientHeight is height of viewport, but getBoundingClientRect() is rectangle of html element;
        // this discrepancy arises because in reality scrollbar is attached to viewport, not html element itself.
        var offsetTop = (scrollEl === this.getScrollElement()) ? 0 : scrollEl.getBoundingClientRect().top;
        var pointerPosY = event.clientY - offsetTop;
        var top = pointerPosY < distance;
        var bottom = pointerPosY > height - distance;
        if (top) {
            // This also can be done with a timeout to keep scrolling while the mouse is
            // in the scrolling zone. (will have smoother behavior)
            scrollEl.scrollBy({ behavior: 'smooth', top: pointerPosY - distance });
        }
        else if (bottom) {
            scrollEl.scrollBy({ behavior: 'smooth', top: distance - (height - pointerPosY) });
        }
    };
    /** single level clone, returning a new object with same top fields. This will share sub objects and arrays */
    Utils.clone = function (obj) {
        if (obj === null || obj === undefined || typeof (obj) !== 'object') {
            return obj;
        }
        // return Object.assign({}, obj);
        if (obj instanceof Array) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return __spreadArrays(obj);
        }
        return __assign({}, obj);
    };
    /**
     * Recursive clone version that returns a full copy, checking for nested objects and arrays ONLY.
     * Note: this will use as-is any key starting with double __ (and not copy inside) some lib have circular dependencies.
     */
    Utils.cloneDeep = function (obj) {
        // return JSON.parse(JSON.stringify(obj)); // doesn't work with date format ?
        var ret = Utils.clone(obj);
        var _loop_1 = function (key) {
            // NOTE: we don't support function/circular dependencies so skip those properties for now...
            if (ret.hasOwnProperty(key) && typeof (ret[key]) === 'object' && key.substring(0, 2) !== '__' && !skipFields.find(function (k) { return k === key; })) {
                ret[key] = Utils.cloneDeep(obj[key]);
            }
        };
        for (var key in ret) {
            _loop_1(key);
        }
        return ret;
    };
    return Utils;
}());
exports.Utils = Utils;
// list of fields we will skip during cloneDeep (nested objects, other internal)
var skipFields = ['_isNested', 'el', 'grid', 'subGrid', 'engine'];
//# sourceMappingURL=utils.js.map