! function t(e, n, i) {
    function o(s, a) {
        if (!n[s]) {
            if (!e[s]) {
                var l = "function" == typeof require && require;
                if (!a && l) return l(s, !0);
                if (r) return r(s, !0);
                var c = new Error("Cannot find module '" + s + "'");
                throw c.code = "MODULE_NOT_FOUND", c
            }
            var u = n[s] = {
                exports: {}
            };
            e[s][0].call(u.exports, function(t) {
                var n = e[s][1][t];
                return o(n ? n : t)
            }, u, u.exports, t, e, n, i)
        }
        return n[s].exports
    }
    for (var r = "function" == typeof require && require, s = 0; s < i.length; s++) o(i[s]);
    return o
}({
    1: [function(t, e, n) {
        var i = {
            EventEmitter: t("./lib/BaseEventEmitter"),
            EmitterSubscription: t("./lib/EmitterSubscription")
        };
        e.exports = i
    }, {
        "./lib/BaseEventEmitter": 2,
        "./lib/EmitterSubscription": 3
    }],
    2: [function(t, e, n) {
        (function(n) {
            "use strict";

            function i(t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }
            var o = t("./EmitterSubscription"),
                r = t("./EventSubscriptionVendor"),
                s = t("fbjs/lib/emptyFunction"),
                a = t("fbjs/lib/invariant"),
                l = function() {
                    function t() {
                        i(this, t), this._subscriber = new r, this._currentSubscription = null
                    }
                    return t.prototype.addListener = function(t, e, n) {
                        return this._subscriber.addSubscription(t, new o(this._subscriber, e, n))
                    }, t.prototype.once = function(t, e, n) {
                        var i = this;
                        return this.addListener(t, function() {
                            i.removeCurrentListener(), e.apply(n, arguments)
                        })
                    }, t.prototype.removeAllListeners = function(t) {
                        this._subscriber.removeAllSubscriptions(t)
                    }, t.prototype.removeCurrentListener = function() {
                        this._currentSubscription || ("production" !== n.env.NODE_ENV ? a(!1, "Not in an emitting cycle; there is no current subscription") : a(!1)), this._subscriber.removeSubscription(this._currentSubscription)
                    }, t.prototype.listeners = function(t) {
                        var e = this._subscriber.getSubscriptionsForType(t);
                        return e ? e.filter(s.thatReturnsTrue).map(function(t) {
                            return t.listener
                        }) : []
                    }, t.prototype.emit = function(t) {
                        var e = this._subscriber.getSubscriptionsForType(t);
                        if (e) {
                            for (var n = Object.keys(e), i = 0; i < n.length; i++) {
                                var o = n[i],
                                    r = e[o];
                                r && (this._currentSubscription = r, this.__emitToSubscription.apply(this, [r].concat(Array.prototype.slice.call(arguments))))
                            }
                            this._currentSubscription = null
                        }
                    }, t.prototype.__emitToSubscription = function(t, e) {
                        var n = Array.prototype.slice.call(arguments, 2);
                        t.listener.apply(t.context, n)
                    }, t
                }();
            e.exports = l
        }).call(this, t("_process"))
    }, {
        "./EmitterSubscription": 3,
        "./EventSubscriptionVendor": 5,
        _process: 8,
        "fbjs/lib/emptyFunction": 6,
        "fbjs/lib/invariant": 7
    }],
    3: [function(t, e, n) {
        "use strict";

        function i(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function o(t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }
        var r = t("./EventSubscription"),
            s = function(t) {
                function e(n, o, r) {
                    i(this, e), t.call(this, n), this.listener = o, this.context = r
                }
                return o(e, t), e
            }(r);
        e.exports = s
    }, {
        "./EventSubscription": 4
    }],
    4: [function(t, e, n) {
        "use strict";

        function i(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }
        var o = function() {
            function t(e) {
                i(this, t), this.subscriber = e
            }
            return t.prototype.remove = function() {
                this.subscriber && (this.subscriber.removeSubscription(this), this.subscriber = null)
            }, t
        }();
        e.exports = o
    }, {}],
    5: [function(t, e, n) {
        (function(n) {
            "use strict";

            function i(t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }
            var o = t("fbjs/lib/invariant"),
                r = function() {
                    function t() {
                        i(this, t), this._subscriptionsForType = {}, this._currentSubscription = null
                    }
                    return t.prototype.addSubscription = function(t, e) {
                        e.subscriber !== this && ("production" !== n.env.NODE_ENV ? o(!1, "The subscriber of the subscription is incorrectly set.") : o(!1)), this._subscriptionsForType[t] || (this._subscriptionsForType[t] = []);
                        var i = this._subscriptionsForType[t].length;
                        return this._subscriptionsForType[t].push(e), e.eventType = t, e.key = i, e
                    }, t.prototype.removeAllSubscriptions = function(t) {
                        void 0 === t ? this._subscriptionsForType = {} : delete this._subscriptionsForType[t]
                    }, t.prototype.removeSubscription = function(t) {
                        var e = t.eventType,
                            n = t.key,
                            i = this._subscriptionsForType[e];
                        i && delete i[n]
                    }, t.prototype.getSubscriptionsForType = function(t) {
                        return this._subscriptionsForType[t]
                    }, t
                }();
            e.exports = r
        }).call(this, t("_process"))
    }, {
        _process: 8,
        "fbjs/lib/invariant": 7
    }],
    6: [function(t, e, n) {
        "use strict";

        function i(t) {
            return function() {
                return t
            }
        }
        var o = function() {};
        o.thatReturns = i, o.thatReturnsFalse = i(!1), o.thatReturnsTrue = i(!0), o.thatReturnsNull = i(null), o.thatReturnsThis = function() {
            return this
        }, o.thatReturnsArgument = function(t) {
            return t
        }, e.exports = o
    }, {}],
    7: [function(t, e, n) {
        (function(t) {
            "use strict";

            function n(t, e, n, o, r, s, a, l) {
                if (i(e), !t) {
                    var c;
                    if (void 0 === e) c = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
                    else {
                        var u = [n, o, r, s, a, l],
                            f = 0;
                        c = new Error(e.replace(/%s/g, function() {
                            return u[f++]
                        })), c.name = "Invariant Violation"
                    }
                    throw c.framesToPop = 1, c
                }
            }
            var i = function(t) {};
            "production" !== t.env.NODE_ENV && (i = function(t) {
                if (void 0 === t) throw new Error("invariant requires an error message argument")
            }), e.exports = n
        }).call(this, t("_process"))
    }, {
        _process: 8
    }],
    8: [function(t, e, n) {
        function i() {
            throw new Error("setTimeout has not been defined")
        }

        function o() {
            throw new Error("clearTimeout has not been defined")
        }

        function r(t) {
            if (f === setTimeout) return setTimeout(t, 0);
            if ((f === i || !f) && setTimeout) return f = setTimeout, setTimeout(t, 0);
            try {
                return f(t, 0)
            } catch (e) {
                try {
                    return f.call(null, t, 0)
                } catch (e) {
                    return f.call(this, t, 0)
                }
            }
        }

        function s(t) {
            if (d === clearTimeout) return clearTimeout(t);
            if ((d === o || !d) && clearTimeout) return d = clearTimeout, clearTimeout(t);
            try {
                return d(t)
            } catch (e) {
                try {
                    return d.call(null, t)
                } catch (e) {
                    return d.call(this, t)
                }
            }
        }

        function a() {
            g && p && (g = !1, p.length ? m = p.concat(m) : v = -1, m.length && l())
        }

        function l() {
            if (!g) {
                var t = r(a);
                g = !0;
                for (var e = m.length; e;) {
                    for (p = m, m = []; ++v < e;) p && p[v].run();
                    v = -1, e = m.length
                }
                p = null, g = !1, s(t)
            }
        }

        function c(t, e) {
            this.fun = t, this.array = e
        }

        function u() {}
        var f, d, h = e.exports = {};
        ! function() {
            try {
                f = "function" == typeof setTimeout ? setTimeout : i
            } catch (t) {
                f = i
            }
            try {
                d = "function" == typeof clearTimeout ? clearTimeout : o
            } catch (t) {
                d = o
            }
        }();
        var p, m = [],
            g = !1,
            v = -1;
        h.nextTick = function(t) {
            var e = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
            m.push(new c(t, e)), 1 !== m.length || g || r(l)
        }, c.prototype.run = function() {
            this.fun.apply(null, this.array)
        }, h.title = "browser", h.browser = !0, h.env = {}, h.argv = [], h.version = "", h.versions = {}, h.on = u, h.addListener = u, h.once = u, h.off = u, h.removeListener = u, h.removeAllListeners = u, h.emit = u, h.binding = function(t) {
            throw new Error("process.binding is not supported")
        }, h.cwd = function() {
            return "/"
        }, h.chdir = function(t) {
            throw new Error("process.chdir is not supported")
        }, h.umask = function() {
            return 0
        }
    }, {}],
    9: [function(t, e, n) {
        ! function(i, o) {
            "function" == typeof define && define.amd ? define(o) : "object" == typeof n ? e.exports = o(t, n, e) : i.Tether = o()
        }(this, function(t, e, n) {
            "use strict";

            function i(t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }

            function o(t) {
                var e = t.getBoundingClientRect(),
                    n = {};
                for (var i in e) n[i] = e[i];
                if (t.ownerDocument !== document) {
                    var r = t.ownerDocument.defaultView.frameElement;
                    if (r) {
                        var s = o(r);
                        n.top += s.top, n.bottom += s.top, n.left += s.left, n.right += s.left
                    }
                }
                return n
            }

            function r(t) {
                var e = getComputedStyle(t) || {},
                    n = e.position,
                    i = [];
                if ("fixed" === n) return [t];
                for (var o = t;
                    (o = o.parentNode) && o && 1 === o.nodeType;) {
                    var r = void 0;
                    try {
                        r = getComputedStyle(o)
                    } catch (t) {}
                    if (void 0 === r || null === r) return i.push(o), i;
                    var s = r,
                        a = s.overflow,
                        l = s.overflowX,
                        c = s.overflowY;
                    /(auto|scroll)/.test(a + c + l) && ("absolute" !== n || ["relative", "absolute", "fixed"].indexOf(r.position) >= 0) && i.push(o)
                }
                return i.push(t.ownerDocument.body), t.ownerDocument !== document && i.push(t.ownerDocument.defaultView), i
            }

            function s() {
                O && document.body.removeChild(O), O = null
            }

            function a(t) {
                var e = void 0;
                t === document ? (e = document, t = document.documentElement) : e = t.ownerDocument;
                var n = e.documentElement,
                    i = o(t),
                    r = S();
                return i.top -= r.top, i.left -= r.left, void 0 === i.width && (i.width = document.body.scrollWidth - i.left - i.right), void 0 === i.height && (i.height = document.body.scrollHeight - i.top - i.bottom), i.top = i.top - n.clientTop, i.left = i.left - n.clientLeft, i.right = e.body.clientWidth - i.width - i.left, i.bottom = e.body.clientHeight - i.height - i.top, i
            }

            function l(t) {
                return t.offsetParent || document.documentElement
            }

            function c() {
                if (j) return j;
                var t = document.createElement("div");
                t.style.width = "100%", t.style.height = "200px";
                var e = document.createElement("div");
                u(e.style, {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                    visibility: "hidden",
                    width: "200px",
                    height: "150px",
                    overflow: "hidden"
                }), e.appendChild(t), document.body.appendChild(e);
                var n = t.offsetWidth;
                e.style.overflow = "scroll";
                var i = t.offsetWidth;
                n === i && (i = e.clientWidth), document.body.removeChild(e);
                var o = n - i;
                return j = {
                    width: o,
                    height: o
                }
            }

            function u() {
                var t = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
                    e = [];
                return Array.prototype.push.apply(e, arguments), e.slice(1).forEach(function(e) {
                    if (e)
                        for (var n in e)({}).hasOwnProperty.call(e, n) && (t[n] = e[n])
                }), t
            }

            function f(t, e) {
                if (void 0 !== t.classList) e.split(" ").forEach(function(e) {
                    e.trim() && t.classList.remove(e)
                });
                else {
                    var n = new RegExp("(^| )" + e.split(" ").join("|") + "( |$)", "gi");
                    m(t, p(t).replace(n, " "))
                }
            }

            function d(t, e) {
                if (void 0 !== t.classList) e.split(" ").forEach(function(e) {
                    e.trim() && t.classList.add(e)
                });
                else {
                    f(t, e);
                    m(t, p(t) + " " + e)
                }
            }

            function h(t, e) {
                if (void 0 !== t.classList) return t.classList.contains(e);
                var n = p(t);
                return new RegExp("(^| )" + e + "( |$)", "gi").test(n)
            }

            function p(t) {
                return t.className instanceof t.ownerDocument.defaultView.SVGAnimatedString ? t.className.baseVal : t.className
            }

            function m(t, e) {
                t.setAttribute("class", e)
            }

            function g(t, e, n) {
                n.forEach(function(n) {
                    e.indexOf(n) === -1 && h(t, n) && f(t, n)
                }), e.forEach(function(e) {
                    h(t, e) || d(t, e)
                })
            }

            function i(t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }

            function v(t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
            }

            function b(t, e) {
                var n = arguments.length <= 2 || void 0 === arguments[2] ? 1 : arguments[2];
                return t + n >= e && e >= t - n
            }

            function y() {
                return "undefined" != typeof performance && void 0 !== performance.now ? performance.now() : +new Date
            }

            function w() {
                for (var t = {
                        top: 0,
                        left: 0
                    }, e = arguments.length, n = Array(e), i = 0; i < e; i++) n[i] = arguments[i];
                return n.forEach(function(e) {
                    var n = e.top,
                        i = e.left;
                    "string" == typeof n && (n = parseFloat(n, 10)), "string" == typeof i && (i = parseFloat(i, 10)), t.top += n, t.left += i
                }), t
            }

            function E(t, e) {
                return "string" == typeof t.left && t.left.indexOf("%") !== -1 && (t.left = parseFloat(t.left, 10) / 100 * e.width), "string" == typeof t.top && t.top.indexOf("%") !== -1 && (t.top = parseFloat(t.top, 10) / 100 * e.height), t
            }

            function C(t, e) {
                return "scrollParent" === e ? e = t.scrollParents[0] : "window" === e && (e = [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset]), e === document && (e = e.documentElement), void 0 !== e.nodeType && function() {
                    var t = e,
                        n = a(e),
                        i = n,
                        o = getComputedStyle(e);
                    if (e = [i.left, i.top, n.width + i.left, n.height + i.top], t.ownerDocument !== document) {
                        var r = t.ownerDocument.defaultView;
                        e[0] += r.pageXOffset, e[1] += r.pageYOffset, e[2] += r.pageXOffset, e[3] += r.pageYOffset
                    }
                    J.forEach(function(t, n) {
                        t = t[0].toUpperCase() + t.substr(1), "Top" === t || "Left" === t ? e[n] += parseFloat(o["border" + t + "Width"]) : e[n] -= parseFloat(o["border" + t + "Width"])
                    })
                }(), e
            }
            var _ = function() {
                    function t(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var i = e[n];
                            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                        }
                    }
                    return function(e, n, i) {
                        return n && t(e.prototype, n), i && t(e, i), e
                    }
                }(),
                T = void 0;
            void 0 === T && (T = {
                modules: []
            });
            var O = null,
                x = function() {
                    var t = 0;
                    return function() {
                        return ++t
                    }
                }(),
                L = {},
                S = function() {
                    var t = O;
                    t && document.body.contains(t) || (t = document.createElement("div"), t.setAttribute("data-tether-id", x()), u(t.style, {
                        top: 0,
                        left: 0,
                        position: "absolute"
                    }), document.body.appendChild(t), O = t);
                    var e = t.getAttribute("data-tether-id");
                    return void 0 === L[e] && (L[e] = o(t), A(function() {
                        delete L[e]
                    })), L[e]
                },
                j = null,
                k = [],
                A = function(t) {
                    k.push(t)
                },
                M = function() {
                    for (var t = void 0; t = k.pop();) t()
                },
                P = function() {
                    function t() {
                        i(this, t)
                    }
                    return _(t, [{
                        key: "on",
                        value: function(t, e, n) {
                            var i = !(arguments.length <= 3 || void 0 === arguments[3]) && arguments[3];
                            void 0 === this.bindings && (this.bindings = {}), void 0 === this.bindings[t] && (this.bindings[t] = []), this.bindings[t].push({
                                handler: e,
                                ctx: n,
                                once: i
                            })
                        }
                    }, {
                        key: "once",
                        value: function(t, e, n) {
                            this.on(t, e, n, !0)
                        }
                    }, {
                        key: "off",
                        value: function(t, e) {
                            if (void 0 !== this.bindings && void 0 !== this.bindings[t])
                                if (void 0 === e) delete this.bindings[t];
                                else
                                    for (var n = 0; n < this.bindings[t].length;) this.bindings[t][n].handler === e ? this.bindings[t].splice(n, 1) : ++n
                        }
                    }, {
                        key: "trigger",
                        value: function(t) {
                            if (void 0 !== this.bindings && this.bindings[t]) {
                                for (var e = 0, n = arguments.length, i = Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) i[o - 1] = arguments[o];
                                for (; e < this.bindings[t].length;) {
                                    var r = this.bindings[t][e],
                                        s = r.handler,
                                        a = r.ctx,
                                        l = r.once,
                                        c = a;
                                    void 0 === c && (c = this), s.apply(c, i), l ? this.bindings[t].splice(e, 1) : ++e
                                }
                            }
                        }
                    }]), t
                }();
            T.Utils = {
                getActualBoundingClientRect: o,
                getScrollParents: r,
                getBounds: a,
                getOffsetParent: l,
                extend: u,
                addClass: d,
                removeClass: f,
                hasClass: h,
                updateClasses: g,
                defer: A,
                flush: M,
                uniqueId: x,
                Evented: P,
                getScrollBarSize: c,
                removeUtilElements: s
            };
            var q = function() {
                    function t(t, e) {
                        var n = [],
                            i = !0,
                            o = !1,
                            r = void 0;
                        try {
                            for (var s, a = t[Symbol.iterator](); !(i = (s = a.next()).done) && (n.push(s.value), !e || n.length !== e); i = !0);
                        } catch (t) {
                            o = !0, r = t
                        } finally {
                            try {
                                !i && a.return && a.return()
                            } finally {
                                if (o) throw r
                            }
                        }
                        return n
                    }
                    return function(e, n) {
                        if (Array.isArray(e)) return e;
                        if (Symbol.iterator in Object(e)) return t(e, n);
                        throw new TypeError("Invalid attempt to destructure non-iterable instance")
                    }
                }(),
                _ = function() {
                    function t(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var i = e[n];
                            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                        }
                    }
                    return function(e, n, i) {
                        return n && t(e.prototype, n), i && t(e, i), e
                    }
                }(),
                H = function(t, e, n) {
                    for (var i = !0; i;) {
                        var o = t,
                            r = e,
                            s = n;
                        i = !1, null === o && (o = Function.prototype);
                        var a = Object.getOwnPropertyDescriptor(o, r);
                        if (void 0 !== a) {
                            if ("value" in a) return a.value;
                            var l = a.get;
                            if (void 0 === l) return;
                            return l.call(s)
                        }
                        var c = Object.getPrototypeOf(o);
                        if (null === c) return;
                        t = c, e = r, n = s, i = !0, a = c = void 0
                    }
                };
            if (void 0 === T) throw new Error("You must include the utils.js file before tether.js");
            var F = T.Utils,
                r = F.getScrollParents,
                a = F.getBounds,
                l = F.getOffsetParent,
                u = F.extend,
                d = F.addClass,
                f = F.removeClass,
                g = F.updateClasses,
                A = F.defer,
                M = F.flush,
                c = F.getScrollBarSize,
                s = F.removeUtilElements,
                z = function() {
                    if ("undefined" == typeof document) return "";
                    for (var t = document.createElement("div"), e = ["transform", "WebkitTransform", "OTransform", "MozTransform", "msTransform"], n = 0; n < e.length; ++n) {
                        var i = e[n];
                        if (void 0 !== t.style[i]) return i
                    }
                }(),
                N = [],
                B = function() {
                    N.forEach(function(t) {
                        t.position(!1)
                    }), M()
                };
            ! function() {
                var t = null,
                    e = null,
                    n = null,
                    i = function i() {
                        if (void 0 !== e && e > 16) return e = Math.min(e - 16, 250), void(n = setTimeout(i, 250));
                        void 0 !== t && y() - t < 10 || (null != n && (clearTimeout(n), n = null), t = y(), B(), e = y() - t)
                    };
                "undefined" != typeof window && void 0 !== window.addEventListener && ["resize", "scroll", "touchmove"].forEach(function(t) {
                    window.addEventListener(t, i)
                })
            }();
            var D = {
                    center: "center",
                    left: "right",
                    right: "left"
                },
                W = {
                    middle: "middle",
                    top: "bottom",
                    bottom: "top"
                },
                R = {
                    top: 0,
                    left: 0,
                    middle: "50%",
                    center: "50%",
                    bottom: "100%",
                    right: "100%"
                },
                X = function(t, e) {
                    var n = t.left,
                        i = t.top;
                    return "auto" === n && (n = D[e.left]), "auto" === i && (i = W[e.top]), {
                        left: n,
                        top: i
                    }
                },
                I = function(t) {
                    var e = t.left,
                        n = t.top;
                    return void 0 !== R[t.left] && (e = R[t.left]), void 0 !== R[t.top] && (n = R[t.top]), {
                        left: e,
                        top: n
                    }
                },
                Y = function(t) {
                    var e = t.split(" "),
                        n = q(e, 2);
                    return {
                        top: n[0],
                        left: n[1]
                    }
                },
                V = Y,
                U = function(t) {
                    function e(t) {
                        var n = this;
                        i(this, e), H(Object.getPrototypeOf(e.prototype), "constructor", this).call(this), this.position = this.position.bind(this), N.push(this), this.history = [], this.setOptions(t, !1), T.modules.forEach(function(t) {
                            void 0 !== t.initialize && t.initialize.call(n)
                        }), this.position()
                    }
                    return v(e, t), _(e, [{
                        key: "getClass",
                        value: function() {
                            var t = arguments.length <= 0 || void 0 === arguments[0] ? "" : arguments[0],
                                e = this.options.classes;
                            return void 0 !== e && e[t] ? this.options.classes[t] : this.options.classPrefix ? this.options.classPrefix + "-" + t : t
                        }
                    }, {
                        key: "setOptions",
                        value: function(t) {
                            var e = this,
                                n = arguments.length <= 1 || void 0 === arguments[1] || arguments[1],
                                i = {
                                    offset: "0 0",
                                    targetOffset: "0 0",
                                    targetAttachment: "auto auto",
                                    classPrefix: "tether"
                                };
                            this.options = u(i, t);
                            var o = this.options,
                                s = o.element,
                                a = o.target,
                                l = o.targetModifier;
                            if (this.element = s, this.target = a, this.targetModifier = l, "viewport" === this.target ? (this.target = document.body, this.targetModifier = "visible") : "scroll-handle" === this.target && (this.target = document.body, this.targetModifier = "scroll-handle"), ["element", "target"].forEach(function(t) {
                                    if (void 0 === e[t]) throw new Error("Tether Error: Both element and target must be defined");
                                    void 0 !== e[t].jquery ? e[t] = e[t][0] : "string" == typeof e[t] && (e[t] = document.querySelector(e[t]))
                                }), d(this.element, this.getClass("element")), this.options.addTargetClasses !== !1 && d(this.target, this.getClass("target")), !this.options.attachment) throw new Error("Tether Error: You must provide an attachment");
                            this.targetAttachment = V(this.options.targetAttachment), this.attachment = V(this.options.attachment), this.offset = Y(this.options.offset), this.targetOffset = Y(this.options.targetOffset), void 0 !== this.scrollParents && this.disable(), "scroll-handle" === this.targetModifier ? this.scrollParents = [this.target] : this.scrollParents = r(this.target), this.options.enabled !== !1 && this.enable(n)
                        }
                    }, {
                        key: "getTargetBounds",
                        value: function() {
                            if (void 0 === this.targetModifier) return a(this.target);
                            if ("visible" === this.targetModifier) {
                                if (this.target === document.body) return {
                                    top: pageYOffset,
                                    left: pageXOffset,
                                    height: innerHeight,
                                    width: innerWidth
                                };
                                var t = a(this.target),
                                    e = {
                                        height: t.height,
                                        width: t.width,
                                        top: t.top,
                                        left: t.left
                                    };
                                return e.height = Math.min(e.height, t.height - (pageYOffset - t.top)), e.height = Math.min(e.height, t.height - (t.top + t.height - (pageYOffset + innerHeight))), e.height = Math.min(innerHeight, e.height), e.height -= 2, e.width = Math.min(e.width, t.width - (pageXOffset - t.left)), e.width = Math.min(e.width, t.width - (t.left + t.width - (pageXOffset + innerWidth))), e.width = Math.min(innerWidth, e.width), e.width -= 2, e.top < pageYOffset && (e.top = pageYOffset), e.left < pageXOffset && (e.left = pageXOffset), e
                            }
                            if ("scroll-handle" === this.targetModifier) {
                                var t = void 0,
                                    n = this.target;
                                n === document.body ? (n = document.documentElement, t = {
                                    left: pageXOffset,
                                    top: pageYOffset,
                                    height: innerHeight,
                                    width: innerWidth
                                }) : t = a(n);
                                var i = getComputedStyle(n),
                                    o = n.scrollWidth > n.clientWidth || [i.overflow, i.overflowX].indexOf("scroll") >= 0 || this.target !== document.body,
                                    r = 0;
                                o && (r = 15);
                                var s = t.height - parseFloat(i.borderTopWidth) - parseFloat(i.borderBottomWidth) - r,
                                    e = {
                                        width: 15,
                                        height: .975 * s * (s / n.scrollHeight),
                                        left: t.left + t.width - parseFloat(i.borderLeftWidth) - 15
                                    },
                                    l = 0;
                                s < 408 && this.target === document.body && (l = -11e-5 * Math.pow(s, 2) - .00727 * s + 22.58), this.target !== document.body && (e.height = Math.max(e.height, 24));
                                var c = this.target.scrollTop / (n.scrollHeight - s);
                                return e.top = c * (s - e.height - l) + t.top + parseFloat(i.borderTopWidth), this.target === document.body && (e.height = Math.max(e.height, 24)), e
                            }
                        }
                    }, {
                        key: "clearCache",
                        value: function() {
                            this._cache = {}
                        }
                    }, {
                        key: "cache",
                        value: function(t, e) {
                            return void 0 === this._cache && (this._cache = {}), void 0 === this._cache[t] && (this._cache[t] = e.call(this)), this._cache[t]
                        }
                    }, {
                        key: "enable",
                        value: function() {
                            var t = this,
                                e = arguments.length <= 0 || void 0 === arguments[0] || arguments[0];
                            this.options.addTargetClasses !== !1 && d(this.target, this.getClass("enabled")), d(this.element, this.getClass("enabled")), this.enabled = !0, this.scrollParents.forEach(function(e) {
                                e !== t.target.ownerDocument && e.addEventListener("scroll", t.position)
                            }), e && this.position()
                        }
                    }, {
                        key: "disable",
                        value: function() {
                            var t = this;
                            f(this.target, this.getClass("enabled")), f(this.element, this.getClass("enabled")), this.enabled = !1, void 0 !== this.scrollParents && this.scrollParents.forEach(function(e) {
                                e.removeEventListener("scroll", t.position)
                            })
                        }
                    }, {
                        key: "destroy",
                        value: function() {
                            var t = this;
                            this.disable(), N.forEach(function(e, n) {
                                e === t && N.splice(n, 1)
                            }), 0 === N.length && s()
                        }
                    }, {
                        key: "updateAttachClasses",
                        value: function(t, e) {
                            var n = this;
                            t = t || this.attachment, e = e || this.targetAttachment;
                            var i = ["left", "top", "bottom", "right", "middle", "center"];
                            void 0 !== this._addAttachClasses && this._addAttachClasses.length && this._addAttachClasses.splice(0, this._addAttachClasses.length), void 0 === this._addAttachClasses && (this._addAttachClasses = []);
                            var o = this._addAttachClasses;
                            t.top && o.push(this.getClass("element-attached") + "-" + t.top), t.left && o.push(this.getClass("element-attached") + "-" + t.left), e.top && o.push(this.getClass("target-attached") + "-" + e.top), e.left && o.push(this.getClass("target-attached") + "-" + e.left);
                            var r = [];
                            i.forEach(function(t) {
                                r.push(n.getClass("element-attached") + "-" + t), r.push(n.getClass("target-attached") + "-" + t)
                            }), A(function() {
                                void 0 !== n._addAttachClasses && (g(n.element, n._addAttachClasses, r), n.options.addTargetClasses !== !1 && g(n.target, n._addAttachClasses, r), delete n._addAttachClasses)
                            })
                        }
                    }, {
                        key: "position",
                        value: function() {
                            var t = this,
                                e = arguments.length <= 0 || void 0 === arguments[0] || arguments[0];
                            if (this.enabled) {
                                this.clearCache();
                                var n = X(this.targetAttachment, this.attachment);
                                this.updateAttachClasses(this.attachment, n);
                                var i = this.cache("element-bounds", function() {
                                        return a(t.element)
                                    }),
                                    o = i.width,
                                    r = i.height;
                                if (0 === o && 0 === r && void 0 !== this.lastSize) {
                                    var s = this.lastSize;
                                    o = s.width, r = s.height
                                } else this.lastSize = {
                                    width: o,
                                    height: r
                                };
                                var u = this.cache("target-bounds", function() {
                                        return t.getTargetBounds()
                                    }),
                                    f = u,
                                    d = E(I(this.attachment), {
                                        width: o,
                                        height: r
                                    }),
                                    h = E(I(n), f),
                                    p = E(this.offset, {
                                        width: o,
                                        height: r
                                    }),
                                    m = E(this.targetOffset, f);
                                d = w(d, p), h = w(h, m);
                                for (var g = u.left + h.left - d.left, v = u.top + h.top - d.top, b = 0; b < T.modules.length; ++b) {
                                    var y = T.modules[b],
                                        C = y.position.call(this, {
                                            left: g,
                                            top: v,
                                            targetAttachment: n,
                                            targetPos: u,
                                            elementPos: i,
                                            offset: d,
                                            targetOffset: h,
                                            manualOffset: p,
                                            manualTargetOffset: m,
                                            scrollbarSize: L,
                                            attachment: this.attachment
                                        });
                                    if (C === !1) return !1;
                                    void 0 !== C && "object" == typeof C && (v = C.top, g = C.left)
                                }
                                var _ = {
                                        page: {
                                            top: v,
                                            left: g
                                        },
                                        viewport: {
                                            top: v - pageYOffset,
                                            bottom: pageYOffset - v - r + innerHeight,
                                            left: g - pageXOffset,
                                            right: pageXOffset - g - o + innerWidth
                                        }
                                    },
                                    O = this.target.ownerDocument,
                                    x = O.defaultView,
                                    L = void 0;
                                return x.innerHeight > O.documentElement.clientHeight && (L = this.cache("scrollbar-size", c), _.viewport.bottom -= L.height), x.innerWidth > O.documentElement.clientWidth && (L = this.cache("scrollbar-size", c), _.viewport.right -= L.width), ["", "static"].indexOf(O.body.style.position) !== -1 && ["", "static"].indexOf(O.body.parentElement.style.position) !== -1 || (_.page.bottom = O.body.scrollHeight - v - r, _.page.right = O.body.scrollWidth - g - o), void 0 !== this.options.optimizations && this.options.optimizations.moveElement !== !1 && void 0 === this.targetModifier && function() {
                                    var e = t.cache("target-offsetparent", function() {
                                            return l(t.target)
                                        }),
                                        n = t.cache("target-offsetparent-bounds", function() {
                                            return a(e)
                                        }),
                                        i = getComputedStyle(e),
                                        o = n,
                                        r = {};
                                    if (["Top", "Left", "Bottom", "Right"].forEach(function(t) {
                                            r[t.toLowerCase()] = parseFloat(i["border" + t + "Width"])
                                        }), n.right = O.body.scrollWidth - n.left - o.width + r.right, n.bottom = O.body.scrollHeight - n.top - o.height + r.bottom, _.page.top >= n.top + r.top && _.page.bottom >= n.bottom && _.page.left >= n.left + r.left && _.page.right >= n.right) {
                                        var s = e.scrollTop,
                                            c = e.scrollLeft;
                                        _.offset = {
                                            top: _.page.top - n.top + s - r.top,
                                            left: _.page.left - n.left + c - r.left
                                        }
                                    }
                                }(), this.move(_), this.history.unshift(_), this.history.length > 3 && this.history.pop(), e && M(), !0
                            }
                        }
                    }, {
                        key: "move",
                        value: function(t) {
                            var e = this;
                            if (void 0 !== this.element.parentNode) {
                                var n = {};
                                for (var i in t) {
                                    n[i] = {};
                                    for (var o in t[i]) {
                                        for (var r = !1, s = 0; s < this.history.length; ++s) {
                                            var a = this.history[s];
                                            if (void 0 !== a[i] && !b(a[i][o], t[i][o])) {
                                                r = !0;
                                                break
                                            }
                                        }
                                        r || (n[i][o] = !0)
                                    }
                                }
                                var c = {
                                        top: "",
                                        left: "",
                                        right: "",
                                        bottom: ""
                                    },
                                    f = function(t, n) {
                                        if ((void 0 !== e.options.optimizations ? e.options.optimizations.gpu : null) !== !1) {
                                            var i = void 0,
                                                o = void 0;
                                            t.top ? (c.top = 0, i = n.top) : (c.bottom = 0, i = -n.bottom), t.left ? (c.left = 0, o = n.left) : (c.right = 0, o = -n.right), window.matchMedia && (window.matchMedia("only screen and (min-resolution: 1.3dppx)").matches || window.matchMedia("only screen and (-webkit-min-device-pixel-ratio: 1.3)").matches || (o = Math.round(o), i = Math.round(i))), c[z] = "translateX(" + o + "px) translateY(" + i + "px)", "msTransform" !== z && (c[z] += " translateZ(0)")
                                        } else t.top ? c.top = n.top + "px" : c.bottom = n.bottom + "px", t.left ? c.left = n.left + "px" : c.right = n.right + "px"
                                    },
                                    d = !1;
                                if ((n.page.top || n.page.bottom) && (n.page.left || n.page.right) ? (c.position = "absolute", f(n.page, t.page)) : (n.viewport.top || n.viewport.bottom) && (n.viewport.left || n.viewport.right) ? (c.position = "fixed", f(n.viewport, t.viewport)) : void 0 !== n.offset && n.offset.top && n.offset.left ? function() {
                                        c.position = "absolute";
                                        var i = e.cache("target-offsetparent", function() {
                                            return l(e.target)
                                        });
                                        l(e.element) !== i && A(function() {
                                            e.element.parentNode.removeChild(e.element), i.appendChild(e.element)
                                        }), f(n.offset, t.offset), d = !0
                                    }() : (c.position = "absolute", f({
                                        top: !0,
                                        left: !0
                                    }, t.page)), !d)
                                    if (this.options.bodyElement) this.options.bodyElement.appendChild(this.element);
                                    else {
                                        for (var h = !0, p = this.element.parentNode; p && 1 === p.nodeType && "BODY" !== p.tagName;) {
                                            if ("static" !== getComputedStyle(p).position) {
                                                h = !1;
                                                break
                                            }
                                            p = p.parentNode
                                        }
                                        h || (this.element.parentNode.removeChild(this.element), this.element.ownerDocument.body.appendChild(this.element))
                                    }
                                var m = {},
                                    g = !1;
                                for (var o in c) {
                                    var v = c[o];
                                    this.element.style[o] !== v && (g = !0, m[o] = v)
                                }
                                g && A(function() {
                                    u(e.element.style, m), e.trigger("repositioned")
                                })
                            }
                        }
                    }]), e
                }(P);
            U.modules = [], T.position = B;
            var G = u(U, T),
                q = function() {
                    function t(t, e) {
                        var n = [],
                            i = !0,
                            o = !1,
                            r = void 0;
                        try {
                            for (var s, a = t[Symbol.iterator](); !(i = (s = a.next()).done) && (n.push(s.value), !e || n.length !== e); i = !0);
                        } catch (t) {
                            o = !0, r = t
                        } finally {
                            try {
                                !i && a.return && a.return()
                            } finally {
                                if (o) throw r
                            }
                        }
                        return n
                    }
                    return function(e, n) {
                        if (Array.isArray(e)) return e;
                        if (Symbol.iterator in Object(e)) return t(e, n);
                        throw new TypeError("Invalid attempt to destructure non-iterable instance")
                    }
                }(),
                F = T.Utils,
                a = F.getBounds,
                u = F.extend,
                g = F.updateClasses,
                A = F.defer,
                J = ["left", "top", "right", "bottom"];
            T.modules.push({
                position: function(t) {
                    var e = this,
                        n = t.top,
                        i = t.left,
                        o = t.targetAttachment;
                    if (!this.options.constraints) return !0;
                    var r = this.cache("element-bounds", function() {
                            return a(e.element)
                        }),
                        s = r.height,
                        l = r.width;
                    if (0 === l && 0 === s && void 0 !== this.lastSize) {
                        var c = this.lastSize;
                        l = c.width, s = c.height
                    }
                    var f = this.cache("target-bounds", function() {
                            return e.getTargetBounds()
                        }),
                        d = f.height,
                        h = f.width,
                        p = [this.getClass("pinned"), this.getClass("out-of-bounds")];
                    this.options.constraints.forEach(function(t) {
                        var e = t.outOfBoundsClass,
                            n = t.pinnedClass;
                        e && p.push(e), n && p.push(n)
                    }), p.forEach(function(t) {
                        ["left", "top", "right", "bottom"].forEach(function(e) {
                            p.push(t + "-" + e)
                        })
                    });
                    var m = [],
                        v = u({}, o),
                        b = u({}, this.attachment);
                    return this.options.constraints.forEach(function(t) {
                        var r = t.to,
                            a = t.attachment,
                            c = t.pin;
                        void 0 === a && (a = "");
                        var u = void 0,
                            f = void 0;
                        if (a.indexOf(" ") >= 0) {
                            var p = a.split(" "),
                                g = q(p, 2);
                            f = g[0], u = g[1]
                        } else u = f = a;
                        var y = C(e, r);
                        "target" !== f && "both" !== f || (n < y[1] && "top" === v.top && (n += d, v.top = "bottom"), n + s > y[3] && "bottom" === v.top && (n -= d, v.top = "top")), "together" === f && ("top" === v.top && ("bottom" === b.top && n < y[1] ? (n += d, v.top = "bottom", n += s, b.top = "top") : "top" === b.top && n + s > y[3] && n - (s - d) >= y[1] && (n -= s - d, v.top = "bottom", b.top = "bottom")), "bottom" === v.top && ("top" === b.top && n + s > y[3] ? (n -= d, v.top = "top", n -= s, b.top = "bottom") : "bottom" === b.top && n < y[1] && n + (2 * s - d) <= y[3] && (n += s - d, v.top = "top", b.top = "top")), "middle" === v.top && (n + s > y[3] && "top" === b.top ? (n -= s, b.top = "bottom") : n < y[1] && "bottom" === b.top && (n += s, b.top = "top"))), "target" !== u && "both" !== u || (i < y[0] && "left" === v.left && (i += h, v.left = "right"), i + l > y[2] && "right" === v.left && (i -= h, v.left = "left")), "together" === u && (i < y[0] && "left" === v.left ? "right" === b.left ? (i += h, v.left = "right", i += l, b.left = "left") : "left" === b.left && (i += h, v.left = "right", i -= l, b.left = "right") : i + l > y[2] && "right" === v.left ? "left" === b.left ? (i -= h, v.left = "left", i -= l, b.left = "right") : "right" === b.left && (i -= h, v.left = "left", i += l, b.left = "left") : "center" === v.left && (i + l > y[2] && "left" === b.left ? (i -= l, b.left = "right") : i < y[0] && "right" === b.left && (i += l, b.left = "left"))), "element" !== f && "both" !== f || (n < y[1] && "bottom" === b.top && (n += s, b.top = "top"), n + s > y[3] && "top" === b.top && (n -= s, b.top = "bottom")), "element" !== u && "both" !== u || (i < y[0] && ("right" === b.left ? (i += l, b.left = "left") : "center" === b.left && (i += l / 2, b.left = "left")), i + l > y[2] && ("left" === b.left ? (i -= l, b.left = "right") : "center" === b.left && (i -= l / 2, b.left = "right"))), "string" == typeof c ? c = c.split(",").map(function(t) {
                            return t.trim()
                        }) : c === !0 && (c = ["top", "left", "right", "bottom"]), c = c || [];
                        var w = [],
                            E = [];
                        n < y[1] && (c.indexOf("top") >= 0 ? (n = y[1], w.push("top")) : E.push("top")), n + s > y[3] && (c.indexOf("bottom") >= 0 ? (n = y[3] - s, w.push("bottom")) : E.push("bottom")), i < y[0] && (c.indexOf("left") >= 0 ? (i = y[0], w.push("left")) : E.push("left")), i + l > y[2] && (c.indexOf("right") >= 0 ? (i = y[2] - l, w.push("right")) : E.push("right")), w.length && function() {
                            var t = void 0;
                            t = void 0 !== e.options.pinnedClass ? e.options.pinnedClass : e.getClass("pinned"), m.push(t), w.forEach(function(e) {
                                m.push(t + "-" + e)
                            })
                        }(), E.length && function() {
                            var t = void 0;
                            t = void 0 !== e.options.outOfBoundsClass ? e.options.outOfBoundsClass : e.getClass("out-of-bounds"), m.push(t), E.forEach(function(e) {
                                m.push(t + "-" + e)
                            })
                        }(), (w.indexOf("left") >= 0 || w.indexOf("right") >= 0) && (b.left = v.left = !1), (w.indexOf("top") >= 0 || w.indexOf("bottom") >= 0) && (b.top = v.top = !1), v.top === o.top && v.left === o.left && b.top === e.attachment.top && b.left === e.attachment.left || (e.updateAttachClasses(b, v), e.trigger("update", {
                            attachment: b,
                            targetAttachment: v
                        }))
                    }), A(function() {
                        e.options.addTargetClasses !== !1 && g(e.target, m, p), g(e.element, m, p)
                    }), {
                        top: n,
                        left: i
                    }
                }
            });
            var F = T.Utils,
                a = F.getBounds,
                g = F.updateClasses,
                A = F.defer;
            T.modules.push({
                position: function(t) {
                    var e = this,
                        n = t.top,
                        i = t.left,
                        o = this.cache("element-bounds", function() {
                            return a(e.element)
                        }),
                        r = o.height,
                        s = o.width,
                        l = this.getTargetBounds(),
                        c = n + r,
                        u = i + s,
                        f = [];
                    n <= l.bottom && c >= l.top && ["left", "right"].forEach(function(t) {
                        var e = l[t];
                        e !== i && e !== u || f.push(t)
                    }), i <= l.right && u >= l.left && ["top", "bottom"].forEach(function(t) {
                        var e = l[t];
                        e !== n && e !== c || f.push(t)
                    });
                    var d = [],
                        h = [],
                        p = ["left", "top", "right", "bottom"];
                    return d.push(this.getClass("abutted")), p.forEach(function(t) {
                        d.push(e.getClass("abutted") + "-" + t)
                    }), f.length && h.push(this.getClass("abutted")), f.forEach(function(t) {
                        h.push(e.getClass("abutted") + "-" + t)
                    }), A(function() {
                        e.options.addTargetClasses !== !1 && g(e.target, h, d), g(e.element, h, d)
                    }), !0
                }
            });
            var q = function() {
                function t(t, e) {
                    var n = [],
                        i = !0,
                        o = !1,
                        r = void 0;
                    try {
                        for (var s, a = t[Symbol.iterator](); !(i = (s = a.next()).done) && (n.push(s.value), !e || n.length !== e); i = !0);
                    } catch (t) {
                        o = !0, r = t
                    } finally {
                        try {
                            !i && a.return && a.return()
                        } finally {
                            if (o) throw r
                        }
                    }
                    return n
                }
                return function(e, n) {
                    if (Array.isArray(e)) return e;
                    if (Symbol.iterator in Object(e)) return t(e, n);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }();
            return T.modules.push({
                position: function(t) {
                    var e = t.top,
                        n = t.left;
                    if (this.options.shift) {
                        var i = this.options.shift;
                        "function" == typeof this.options.shift && (i = this.options.shift.call(this, {
                            top: e,
                            left: n
                        }));
                        var o = void 0,
                            r = void 0;
                        if ("string" == typeof i) {
                            i = i.split(" "), i[1] = i[1] || i[0];
                            var s = i,
                                a = q(s, 2);
                            o = a[0], r = a[1], o = parseFloat(o, 10), r = parseFloat(r, 10)
                        } else o = i.top, r = i.left;
                        return e += o, n += r, {
                            top: e,
                            left: n
                        }
                    }
                }
            }), G
        })
    }, {}],
    10: [function(t, e, n) {
        "use strict";
        var i = "EmojiPanel";
        e.exports = {
            panel: i,
            open: i + "--open",
            trigger: i + "--trigger",
            emoji: "emoji",
            svg: i + "__svg",
            tooltip: i + "__tooltip",
            content: i + "__content",
            header: i + "__header",
            query: i + "__query",
            searchInput: i + "__queryInput",
            searchTitle: i + "__searchTitle",
            frequentTitle: i + "__frequentTitle",
            results: i + "__results",
            noResults: i + "__noResults",
            category: i + "__category",
            categories: i + "__categories",
            footer: i + "__footer",
            brand: i + "__brand",
            btnModifier: i + "__btnModifier",
            btnModifierToggle: i + "__btnModifierToggle",
            modifierDropdown: i + "__modifierDropdown"
        }
    }, {}],
    11: [function(t, e, n) {
        "use strict";
        var i = t("tether"),
            o = t("./emojis"),
            r = function(t, e, n) {
                if (t.editable) {
                    var r = function(e) {
                        t.editable.dataset.offset = s(t.editable)
                    };
                    t.editable.addEventListener("keyup", r), t.editable.addEventListener("change", r),
                        t.editable.addEventListener("click", r)
                }
                var a = document.createElement("div");
                a.classList.add(t.classnames.panel);
                var l = document.createElement("div");
                l.classList.add(t.classnames.content), a.appendChild(l);
                var c = void 0,
                    u = void 0,
                    f = void 0,
                    d = void 0;
                if (t.trigger) {
                    a.classList.add(t.classnames.trigger), t.trigger.addEventListener("click", function() {
                        return n()
                    }), t.trigger.setAttribute("title", t.locale.add);
                    var h = document.createElement("span");
                    h.classList.add(t.classnames.tooltip), h.innerHTML = t.locale.add, t.trigger.appendChild(h)
                }
                var p = document.createElement("header");
                p.classList.add(t.classnames.header), l.appendChild(p);
                var m = document.createElement("div");
                m.classList.add(t.classnames.categories), p.appendChild(m);
                for (var g = 0; g < 9; g++) {
                    var v = document.createElement("button");
                    v.classList.add("temp"), m.appendChild(v)
                }
                if (u = document.createElement("div"), u.classList.add(t.classnames.results), l.appendChild(u), 1 == t.search) {
                    var b = document.createElement("div");
                    b.classList.add(t.classnames.query), p.appendChild(b), c = document.createElement("input"), c.classList.add(t.classnames.searchInput), c.setAttribute("type", "text"), c.setAttribute("autoComplete", "off"), c.setAttribute("placeholder", t.locale.search), b.appendChild(c);
                    var y = document.createElement("div");
                    y.innerHTML = t.icons.search, b.appendChild(y);
                    var w = document.createElement("p");
                    w.classList.add(t.classnames.category, t.classnames.searchTitle), w.style.display = "none", w.innerHTML = t.locale.search_results, u.appendChild(w), f = document.createElement("span"), f.classList.add(t.classnames.noResults), f.innerHTML = t.locale.no_results, u.appendChild(f)
                }
                if (1 == t.frequent) {
                    var E = localStorage.getItem("EmojiPanel-frequent");
                    E = E ? JSON.parse(E) : [], d = document.createElement("p"), d.classList.add(t.classnames.category, t.classnames.frequentTitle), d.innerHTML = t.locale.frequent, 0 == E.length && (d.style.display = "none"), u.appendChild(d);
                    var C = document.createElement("div");
                    C.classList.add("EmojiPanel-frequent"), E.forEach(function(n) {
                        C.appendChild(o.createButton(n, t, e))
                    }), u.appendChild(C)
                }
                var _ = document.createElement("p");
                _.classList.add(t.classnames.category), _.textContent = t.locale.loading, u.appendChild(_);
                for (var T = 0; T < 72; T++) {
                    var O = document.createElement("button");
                    O.classList.add("temp"), u.appendChild(O)
                }
                var x = document.createElement("footer");
                if (x.classList.add(t.classnames.footer), a.appendChild(x), t.locale.brand) {
                    var L = document.createElement("a");
                    L.classList.add(t.classnames.brand), L.setAttribute("href", "https://emojipanel.js.org"), L.textContent = t.locale.brand, x.appendChild(L)
                }
                var cont=document.getElementById('emoji');
                console.log(cont);
                // t.container = cont;
                // var trigger=document.getElementById('emojiTrigger');
                // t.trigger = trigger;
                // var editable = document.getElementById('inputData');
                // t.editable = editable;
                console.log(t,t.container);
                t.container.appendChild(a);
                var S = void 0;
                if (t.trigger && t.tether) {
                    var j = ["top", "right", "bottom", "left"];
                    if (j.indexOf(t.placement) == -1) throw new Error("Invalid attachment '" + t.placement + "'. Valid placements are '" + j.join("', '") + "'.");
                    var k = void 0,
                        A = void 0;
                    switch (t.placement) {
                        case j[0]:
                        case j[2]:
                            k = (t.placement == j[0] ? j[2] : j[0]) + " center", A = (t.placement == j[0] ? j[0] : j[2]) + " center";
                            break;
                        case j[1]:
                        case j[3]:
                            k = "top " + (t.placement == j[1] ? j[3] : j[1]), A = "top " + (t.placement == j[1] ? j[1] : j[3])
                    }
                    S = new i({
                        element: a,
                        target: t.trigger,
                        attachment: k,
                        targetAttachment: A
                    })
                }
                return {
                    panel: a,
                    tether: S
                }
            },
            s = function(t) {
                var e = 0,
                    n = t.ownerDocument || t.document,
                    i = n.defaultView || n.parentWindow,
                    o = void 0;
                if (void 0 !== i.getSelection) {
                    if (o = i.getSelection(), o.rangeCount > 0) {
                        var r = i.getSelection().getRangeAt(0),
                            s = r.cloneRange();
                        s.selectNodeContents(t), s.setEnd(r.endContainer, r.endOffset), e = s.toString().length
                    }
                } else if ((o = n.selection) && "Control" != o.type) {
                    var a = o.createRange(),
                        l = n.body.createTextRange();
                    l.moveToElementText(t), l.setEndPoint("EndToEnd", a), e = l.text.length
                }
                return e
            };
        e.exports = r
    }, {
        "./emojis": 12,
        tether: 9
    }],
    12: [function(t, e, n) {
        "use strict";
        var i = t("./modifiers"),
            o = {
                load: function(t) {
                    var e = Promise.resolve();
                    t.pack_url && !document.querySelector(t.classnames.svg) && (e = new Promise(function(e) {
                        var n = new XMLHttpRequest;
                        n.open("GET", t.pack_url, !0), n.onload = function() {
                            var i = document.createElement("div");
                            i.classList.add(t.classnames.svg), i.style.display = "none", i.innerHTML = n.responseText, document.body.appendChild(i), e()
                        }, n.send()
                    }));
                    var n = localStorage.getItem("EmojiPanel-json"),
                        i = Promise.resolve(n);
                    return null == n && (i = new Promise(function(e) {
                        var n = new XMLHttpRequest;
                        n.open("GET", t.json_url, !0), n.onreadystatechange = function() {
                            if (n.readyState == XMLHttpRequest.DONE && 200 == n.status) {
                                e(JSON.parse(n.responseText))
                            }
                        }, n.send()
                    })), Promise.all([e, i])
                },
                createEl: function(t, e) {
                    return e.pack_url && document.querySelector("." + e.classnames.svg + ' [id="' + t.unicode + '"') ? '<svg viewBox="0 0 20 20"><use xlink:href="#' + t.unicode + '"></use></svg>' : t.char
                },
                createButton: function(t, e, n) {
                    t.fitzpatrick && e.fitzpatrick && (Object.keys(i).forEach(function(e) {
                        return t.unicode = t.unicode.replace(i[e].unicode, "")
                    }), Object.keys(i).forEach(function(e) {
                        return t.char = t.char.replace(i[e].char, "")
                    }), t.unicode += i[e.fitzpatrick].unicode, t.char += i[e.fitzpatrick].char);
                    var r = document.createElement("button");
                    return r.setAttribute("type", "button"), r.innerHTML = o.createEl(t, e), r.classList.add("emoji"), r.dataset.unicode = t.unicode, r.dataset.char = t.char, r.dataset.category = t.category, r.dataset.name = t.name, t.fitzpatrick && (r.dataset.fitzpatrick = t.fitzpatrick), n && r.addEventListener("click", function() {
                        n("select", t), e.editable && o.write(t, e)
                    }), r
                },
                write: function(t, e) {
                    var n = e.editable;
                    if (n) {
                        var i = n.textContent.length;
                        n.dataset.offset && (i = n.dataset.offset);
                        var r = n.parentNode.querySelector(".EmojiPanel__pictographs"),
                            s = "https://abs.twimg.com/emoji/v2/72x72/" + t.unicode + ".png",
                            a = document.createElement("img");
                        a.classList.add("RichEditor-pictographImage"), a.setAttribute("src", s), a.setAttribute("draggable", !1), r.appendChild(a);
                        var l = document.createElement("span");
                        l.classList.add("EmojiPanel__pictographText"), l.setAttribute("title", t.name), l.setAttribute("aria-label", t.name), l.dataset.pictographText = t.char, l.dataset.pictographImage = s, l.innerHTML = "&emsp;";
                        var c = n.querySelector("div");
                        "<br>" == c.innerHTML && (c.innerHTML = "");
                        var u = c.querySelectorAll(".EmojiPanel__pictographText");
                        [].forEach.call(u, function(t) {
                            c.replaceChild(document.createTextNode(t.dataset.pictographText), t)
                        });
                        var f = emojiAware.split(c.textContent);
                        f.splice(i, 0, t.char), f = f.join(""), c.textContent = f;
                        var d = document.createEvent("HTMLEvents");
                        d.initEvent("mousedown", !1, !0), n.dispatchEvent(d), n.dataset.offset = parseInt(n.dataset.offset, 10) + 1, 1 == e.frequent && Frequent.add(t, o.createButton)
                    }
                }
            };
        e.exports = o
    }, {
        "./modifiers": 15
    }],
    13: [function(t, e, n) {
        "use strict";

        function i(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function o(t, e) {
            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e || "object" != typeof e && "function" != typeof e ? t : e
        }

        function r(t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var s = function() {
                function t(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var i = e[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                    }
                }
                return function(e, n, i) {
                    return n && t(e.prototype, n), i && t(e, i), e
                }
            }(),
            a = t("fbemitter"),
            l = a.EventEmitter,
            c = t("./create"),
            u = t("./emojis"),
            f = t("./list"),
            d = t("./classnames"),
            h = {
                search: !0,
                frequent: !0,
                fitzpatrick: "a",
                hidden_categories: [],
                pack_url: null,
                json_url: "./assets/js/emojis.json",
                tether: !0,
                placement: "bottom",
                locale: {
                    add: "Add emoji",
                    brand: "EmojiPanel",
                    frequent: "Frequently used",
                    loading: "Loading...",
                    no_results: "No results",
                    search: "Search",
                    search_results: "Search results"
                },
                icons: {
                    search: '<span class="fa fa-search"></span>'
                },
                classnames: d
            },
            p = function(t) {
                function e(t) {
                    i(this, e);
                    var n = o(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
                    n.options = Object.assign({}, h, t), ["container", "trigger", "editable"].forEach(function(t) {
                        "string" == typeof n.options[t] && (n.options[t] = document.querySelector(n.options[t]))
                    });
                    var r = c(n.options, n.emit.bind(n), n.toggle.bind(n));
                    return n.panel = r.panel, n.tether = r.tether, u.load(n.options).then(function(t) {
                        f(n.options, n.panel, t[1], n.emit.bind(n))
                    }), n
                }
                return r(e, t), s(e, [{
                    key: "toggle",
                    value: function() {
                    	console.log(this.panel);
                        var t = this.panel.classList.toggle(this.options.classnames.open),
                            e = this.panel.querySelector("." + this.options.classnames.searchInput);
                        this.emit("toggle", t), t && this.options.search && e && e.focus()
                    }
                }, {
                    key: "reposition",
                    value: function() {
                        this.tether && this.tether.position()
                    }
                }]), e
            }(l);
        n.default = p, "undefined" != typeof window && (window.EmojiPanel = p)
    }, {
        "./classnames": 10,
        "./create": 11,
        "./emojis": 12,
        "./list": 14,
        fbemitter: 1
    }],
    14: [function(t, e, n) {
        "use strict";
        var i = t("./emojis"),
            o = t("./modifiers"),
            r = function(t, e, n, r) {
                for (var s = e.querySelector("." + t.classnames.categories), a = e.querySelector("." + t.classnames.searchInput), l = e.querySelector("." + t.classnames.searchTitle), c = e.querySelector("." + t.classnames.frequentTitle), u = e.querySelector("." + t.classnames.results), f = e.querySelector("." + t.classnames.noResults), d = e.querySelector("." + t.classnames.footer); s.firstChild;) s.removeChild(s.firstChild);
                for (Object.keys(n).forEach(function(e) {
                        var o = n[e];
                        if (!(t.hidden_categories.indexOf(o.name) > -1)) {
                            var r = document.createElement("button");
                            r.classList.add(t.classnames.emoji), r.setAttribute("title", o.name), r.innerHTML = i.createEl(o.icon, t), r.addEventListener("click", function(e) {
                                var n = t.container.querySelector("#" + o.name);
                                u.scrollTop = n.offsetTop - u.offsetTop
                            }), s.appendChild(r)
                        }
                    }), 1 == t.search && a.addEventListener("input", function(e) {
                        var i = u.querySelectorAll("." + t.classnames.emoji),
                            o = u.querySelectorAll("." + t.classnames.category),
                            s = localStorage.getItem("EmojiPanel-frequent");
                        s = s ? JSON.parse(s) : [];
                        var a = e.target.value.replace(/-/g, "").toLowerCase();
                        if (a.length > 0) {
                            var d = [];
                            Object.keys(n).forEach(function(t) {
                                n[t].emojis.forEach(function(t) {
                                    t.keywords.find(function(t) {
                                        return t = t.replace(/-/g, "").toLowerCase(), t.indexOf(a) > -1
                                    }) && d.push(t.unicode)
                                })
                            }), 0 == d.length ? f.style.display = "block" : f.style.display = "none", r("search", {
                                value: a,
                                matched: d
                            }), [].forEach.call(i, function(t) {
                                d.indexOf(t.dataset.unicode) == -1 ? t.style.display = "none" : t.style.display = "inline-block"
                            }), [].forEach.call(o, function(t) {
                                t.style.display = "none"
                            }), l.style.display = "block", 1 == t.frequent && (c.style.display = "none")
                        } else [].forEach.call(i, function(t) {
                            t.style.display = "inline-block"
                        }), [].forEach.call(o, function(t) {
                            t.style.display = "block"
                        }), l.style.display = "none", f.style.display = "none", 1 == t.frequent && (s.length > 0 ? c.style.display = "block" : c.style.display = "none")
                    }); u.firstChild;) u.removeChild(u.firstChild);
                if (Object.keys(n).forEach(function(e) {
                        var o = n[e];
                        if (!(t.hidden_categories.indexOf(o.name) > -1 || "modifier" == o.name)) {
                            var s = document.createElement("p");
                            s.classList.add(t.classnames.category), s.id = o.name;
                            var a = o.name.replace(/_/g, " ").replace(/\w\S*/g, function(t) {
                                return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
                            }).replace("And", "&amp;");
                            s.innerHTML = a, u.appendChild(s), o.emojis.forEach(function(e) {
                                return u.appendChild(i.createButton(e, t, r))
                            })
                        }
                    }), t.fitzpatrick) {
                    var h = {
                            unicode: "270b" + o[t.fitzpatrick].unicode,
                            char: "✋"
                        },
                        p = void 0,
                        m = document.createElement("button");
                    m.setAttribute("type", "button"), m.classList.add(t.classnames.btnModifier, t.classnames.btnModifierToggle, t.classnames.emoji), m.innerHTML = i.createEl(h, t), m.addEventListener("click", function() {
                        p.classList.toggle("active"), m.classList.toggle("active")
                    }), d.appendChild(m), p = document.createElement("div"), p.classList.add(t.classnames.modifierDropdown), Object.keys(o).forEach(function(e) {
                        var n = Object.assign({}, o[e]);
                        n.unicode = "270b" + n.unicode, n.char = "✋" + n.char;
                        var s = document.createElement("button");
                        s.setAttribute("type", "button"), s.classList.add(t.classnames.btnModifier, t.classnames.emoji), s.dataset.modifier = e, s.innerHTML = i.createEl(n, t), s.addEventListener("click", function(e) {
                            e.stopPropagation(), e.preventDefault(), m.classList.remove("active"), m.innerHTML = i.createEl(n, t), t.fitzpatrick = s.dataset.modifier, p.classList.remove("active");
                            [].forEach.call(t.container.querySelectorAll("." + t.classnames.results + "  ." + t.classnames.emoji), function(e) {
                                if (e.dataset.fitzpatrick) {
                                    var n = {
                                        unicode: e.dataset.unicode,
                                        char: e.dataset.char,
                                        fitzpatrick: !0,
                                        category: e.dataset.category,
                                        name: e.dataset.name
                                    };
                                    e.parentNode.replaceChild(i.createButton(n, t, r), e)
                                }
                            })
                        }), p.appendChild(s)
                    }), d.appendChild(p)
                }
            };
        e.exports = r
    }, {
        "./emojis": 12,
        "./modifiers": 15
    }],
    15: [function(t, e, n) {
        "use strict";
        e.exports = {
            a: {
                unicode: "",
                char: ""
            },
            b: {
                unicode: "-1f3fb",
                char: "🏻"
            },
            c: {
                unicode: "-1f3fc",
                char: "🏼"
            },
            d: {
                unicode: "-1f3fd",
                char: "🏽"
            },
            e: {
                unicode: "-1f3fe",
                char: "🏾"
            },
            f: {
                unicode: "-1f3ff",
                char: "🏿"
            }
        }
    }, {}]
}, {}, [13]);