/**
 * 自定义事件（摘自 Backbone.Events）
 * evt = event_support();
 * evt.listen(my_object, function(){  });
 *
 * @author jameszuo
 * @date 13-1-23
 */
define(function (require, exports, module) {
    var $ = require('$'),
        collections = require('./collections'),

        console = require('./console'),

        array = [],
        slice = array.slice,

        _ = {}, // underscore

        undefined;


    // Backbone.Events
    // ---------------

    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;

    // Implement fancy features of the Events API such as multiple event
    // names `"change blur"` and jQuery-style event maps `{change: action}`
    // in terms of the existing API.
    var eventsApi = function (obj, action, name, rest) {
        if (!name) return true;
        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
        } else if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, l = names.length; i < l; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
        } else {
            return true;
        }
    };

    // Optimized internal dispatch function for triggering events. Tries to
    // keep the usual cases speedy (most Backbone events have 3 arguments).

    // @jameszuo 对这里做了一些改动，使其可以返回 false 供判断
    // 如果有任何一个回调返回了false，即返回false，否则返回最后一个值
    var triggerEvents = function (events, args) {
        var ev, ret, i = -1, l = events.length/*, hasFalse = false*/;
        while (++i < l) {
            ret = (ev = events[i]).callback.apply(ev.ctx, args);
            if (false === ret) {
                return false;
            }
        }
        return ret;
    };

    _.once = function(func) {
        var ran = false, memo;
        return function() {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
        };
    };

    // Retrieve the names of an object's properties.
    _.keys = function(obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj)
            if (obj.hasOwnProperty(key))
                keys[keys.length] = key;
        return keys;
    };

    // A module that can be mixed in to *any object* in order to provide it with
    // custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = {};
    //     _.extend(object, Backbone.Events);
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    var Events = {

        // Bind one or more space separated events, or an events map,
        // to a `callback` function. Passing `"all"` will bind the callback to
        // all events fired.
        on:function (name, callback, context) {
            if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
            this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            events.push({callback:callback, context:context, ctx:context || this});
            return this;
        },

        // Bind events to only be triggered a single time. After the first time
        // the callback is invoked, it will be removed.
        once:function (name, callback, context) {
            if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
            var self = this;
            var once = _.once(function () {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.on(name, once, context);
        },

        // Remove one or many callbacks. If `context` is null, removes all
        // callbacks with that function. If `callback` is null, removes all
        // callbacks for the event. If `name` is null, removes all bound
        // callbacks for all events.
        off:function (name, callback, context) {
            var retain, ev, events, names, i, l, j, k;
            if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
            if (!name && !callback && !context) {
                this._events = {};
                return this;
            }

            names = name ? [name] : _.keys(this._events);
            for (i = 0, l = names.length; i < l; i++) {
                name = names[i];
                if (events = this._events[name]) {
                    this._events[name] = retain = [];
                    if (callback || context) {
                        for (j = 0, k = events.length; j < k; j++) {
                            ev = events[j];
                            if ((callback && callback !== ev.callback &&
                                callback !== ev.callback._callback) ||
                                (context && context !== ev.context)) {
                                retain.push(ev);
                            }
                        }
                    }
                    if (!retain.length) delete this._events[name];
                }
            }

            return this;
        },

        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback to
        // receive the true name of the event as the first argument).
        trigger:function (name) {
            if (!this._events) return this;
            var args = slice.call(arguments, 1);
            if (!eventsApi(this, 'trigger', name, args)) return this;
            var events = this._events[name];
            // var allEvents = this._events.all; //@james

            var retVal;
            if (events)
                retVal = triggerEvents(events, args);
            // if (allEvents) triggerEvents(allEvents, arguments); //@james
            // return this; //@james

            return retVal;
        },

        // Tell this object to stop listening to either specific events ... or
        // to every object it's currently listening to.
        stopListening:function (obj, name, callback) {
            var listeners = this._listeners;
            if (!listeners) return this;
            if (obj) {
                obj.off(name, typeof name === 'object' ? this : callback, this);
                if (!name && !callback) delete listeners[obj._listenerId];
            } else {
                if (typeof name === 'object') callback = this;
                for (var id in listeners) {
                    listeners[id].off(name, callback, this);
                }
                this._listeners = {};
            }
            return this;
        }
    };

    var listenMethods = {listenTo:'on', listenToOnce:'once'};

    // An inversion-of-control versions of `on` and `once`. Tell *this* object to listen to
    // an event in another object ... keeping track of what it's listening to.
    $.each(listenMethods, function (method, implementation) {
        Events[method] = function (obj, name, callback) {
            var me = this,
                listeners = me._listeners || (me._listeners = {}),
                id = obj._listenerId || (obj._listenerId = uniqueId());

            listeners[id] = obj;

            if (typeof name === 'string' && typeof callback === 'function') {
                obj[implementation](name, typeof name === 'object' ? me : callback, me);
            } else if (typeof name === 'object') {
                var map = name;
                $.each(map, function (name, callback) {
                    obj[implementation](name, callback, me);
                });
            }
            return me;
        };
    });

    var once = function (func) {
        var ran = false, memo;
        return function () {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
        };
    };

    var idCounter = 0;
    var uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    return Events;

});