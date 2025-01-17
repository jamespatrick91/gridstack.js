"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDUtils = void 0;
/**
 * dd-utils.ts 5.0.0-dev
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */
var DDUtils = /** @class */ (function () {
    function DDUtils() {
    }
    DDUtils.clone = function (el) {
        var node = el.cloneNode(true);
        node.removeAttribute('id');
        return node;
    };
    DDUtils.appendTo = function (el, parent) {
        var parentNode;
        if (typeof parent === 'string') {
            parentNode = document.querySelector(parent);
        }
        else {
            parentNode = parent;
        }
        if (parentNode) {
            parentNode.appendChild(el);
        }
    };
    DDUtils.setPositionRelative = function (el) {
        if (!(/^(?:r|a|f)/).test(window.getComputedStyle(el).position)) {
            el.style.position = "relative";
        }
    };
    DDUtils.addElStyles = function (el, styles) {
        if (styles instanceof Object) {
            var _loop_1 = function (s) {
                if (styles.hasOwnProperty(s)) {
                    if (Array.isArray(styles[s])) {
                        // support fallback value
                        styles[s].forEach(function (val) {
                            el.style[s] = val;
                        });
                    }
                    else {
                        el.style[s] = styles[s];
                    }
                }
            };
            for (var s in styles) {
                _loop_1(s);
            }
        }
    };
    DDUtils.initEvent = function (e, info) {
        var evt = { type: info.type };
        var obj = {
            button: 0,
            which: 0,
            buttons: 1,
            bubbles: true,
            cancelable: true,
            target: info.target ? info.target : e.target
        };
        // don't check for `instanceof DragEvent` as Safari use MouseEvent #1540
        if (e.dataTransfer) {
            evt['dataTransfer'] = e.dataTransfer; // workaround 'readonly' field.
        }
        ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].forEach(function (p) { return evt[p] = e[p]; }); // keys
        ['pageX', 'pageY', 'clientX', 'clientY', 'screenX', 'screenY'].forEach(function (p) { return evt[p] = e[p]; }); // point info
        return __assign(__assign({}, evt), obj);
    };
    /** returns true if event is inside the given element rectangle */
    // Note: Safari Mac has null event.relatedTarget which causes #1684 so check if DragEvent is inside the coordinates instead
    //    this.el.contains(event.relatedTarget as HTMLElement)
    DDUtils.inside = function (e, el) {
        // srcElement, toElement, target: all set to placeholder when leaving simple grid, so we can't use that (Chrome)
        var target = e.relatedTarget || e.fromElement;
        if (!target) {
            var _a = el.getBoundingClientRect(), bottom = _a.bottom, left = _a.left, right = _a.right, top_1 = _a.top;
            return (e.x < right && e.x > left && e.y < bottom && e.y > top_1);
        }
        return el.contains(target);
    };
    DDUtils.isEventSupportPassiveOption = ((function () {
        var supportsPassive = false;
        var passiveTest = function () {
            // do nothing
        };
        // document.addEventListener('test', passiveTest, {
        //   get passive() {
        //     supportsPassive = true;
        //     return true;
        //   }
        // });
        // document.removeEventListener('test', passiveTest);
        return supportsPassive;
    })());
    return DDUtils;
}());
exports.DDUtils = DDUtils;
//# sourceMappingURL=dd-utils.js.map