! function (e, t) {
	"use strict";
	var n;
	if ("object" == typeof exports) {
		try {
			n = require("moment")
		} catch (e) { }
		module.exports = t(n)
	} else "function" == typeof define && define.amd ? define(function (e) {
		try {
			n = e("moment")
		} catch (e) { }
		return t(n)
	}) : e.Pikaday = t(e.moment)
}(this, function (L) {
	"use strict";

	function s(e, t, n, a) {
		r ? e.addEventListener(t, n, !!a) : e.attachEvent("on" + t, n)
	}

	function t(e, t, n, a) {
		r ? e.removeEventListener(t, n, !!a) : e.detachEvent("on" + t, n)
	}

	function o(e, t) {
		return -1 !== (" " + e.className + " ").indexOf(" " + t + " ")
	}

	function c(e, t) {
		o(e, t) || (e.className = "" === e.className ? t : e.className + " " + t)
	}

	function f(e, t) {
		var n;
		e.className = (n = (" " + e.className + " ").replace(" " + t + " ", " ")).trim ? n.trim() : n.replace(/^\s+|\s+$/g, "")
	}

	function y(e) {
		return /Array/.test(Object.prototype.toString.call(e))
	}

	function P(e) {
		return /Date/.test(Object.prototype.toString.call(e)) && !isNaN(e.getTime())
	}

	function H(e, t) {
		return [31, (n = e) % 4 == 0 && n % 100 != 0 || n % 400 == 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t];
		var n
	}

	function B(e) {
		P(e) && e.setHours(0, 0, 0, 0)
	}

	function V(e, t) {
		return e.getTime() === t.getTime()
	}

	function i(e, t, n) {
		var a;
		g.createEvent ? ((a = g.createEvent("HTMLEvents")).initEvent(t, !0, !1), a = l(a, n), e.dispatchEvent(a)) : g.createEventObject && (a = g.createEventObject(), a = l(a, n), e.fireEvent("on" + t, a))
	}

	function n(e) {
		return e.month < 0 && (e.year -= Math.ceil(Math.abs(e.month) / 12), e.month += 12), 11 < e.month && (e.year += Math.floor(Math.abs(e.month) / 12), e.month -= 12), e
	}

	function a(e, t, n) {
		for (t += e.firstDay; 7 <= t;) t -= 7;
		return n ? e.i18n.weekdaysShort[t] : e.i18n.weekdays[t]
	}

	function J(e) {
		var t = [],
			n = "false";
		if (e.isEmpty) {
			if (!e.showDaysInNextAndPreviousMonths) return '<td class="is-empty"></td>';
			t.push("is-outside-current-month"), e.enableSelectionDaysInNextAndPreviousMonths || t.push("is-selection-disabled")
		}
		return e.isDisabled && t.push("is-disabled"), e.isToday && t.push("is-today"), e.isSelected && (t.push("is-selected"), n = "true"), e.hasEvent && t.push("has-event"), e.isInRange && t.push("is-inrange"), e.isStartRange && t.push("is-startrange"), e.isEndRange && t.push("is-endrange"), '<td data-day="' + e.day + '" class="' + t.join(" ") + '" aria-selected="' + n + '"><button class="pika-button pika-day" type="button" data-pika-year="' + e.year + '" data-pika-month="' + e.month + '" data-pika-day="' + e.day + '">' + e.day + "</button></td>"
	}

	function K(e, t) {
		function n(e) {
			return (e + 7 - 1) % 7
		}
		e.setHours(0, 0, 0, 0);
		var a = e.getDate(),
			i = e.getDay(),
			s = t,
			o = s - 1;
		e.setDate(a + o - n(i));
		var r = new Date(e.getFullYear(), 0, s),
			l = (e.getTime() - r.getTime()) / 864e5;
		return 1 + Math.round((l - o + n(r.getDay())) / 7)
	}

	function h(e, t, n, a, i, s) {
		for (var o, r, l, h = e._o, d = n === h.minYear, u = n === h.maxYear, c = '<div id="' + s + '" class="pika-title" role="heading" aria-live="assertive">', f = !0, g = !0, m = [], p = 0; p < 12; p++) m.push('<option value="' + (n === i ? p - t : 12 + p - t) + '"' + (p === a ? ' selected="selected"' : "") + (d && p < h.minMonth || u && p > h.maxMonth ? ' disabled="disabled"' : "") + ">" + h.i18n.months[p] + "</option>");
		for (r = '<div class="pika-label">' + h.i18n.months[a] + '<select class="pika-select pika-select-month" tabindex="-1">' + m.join("") + "</select></div>", o = y(h.yearRange) ? (p = h.yearRange[0], h.yearRange[1] + 1) : (p = n - h.yearRange, 1 + n + h.yearRange), m = []; p < o && p <= h.maxYear; p++) p >= h.minYear && m.push('<option value="' + p + '"' + (p === n ? ' selected="selected"' : "") + ">" + p + "</option>");
		return l = '<div class="pika-label">' + n + h.yearSuffix + '<select class="pika-select pika-select-year" tabindex="-1">' + m.join("") + "</select></div>", h.showMonthAfterYear ? c += l + r : c += r + l, d && (0 === a || h.minMonth >= a) && (f = !1), u && (11 === a || h.maxMonth <= a) && (g = !1), 0 === t && (c += '<button class="pika-prev' + (f ? "" : " is-disabled") + '" type="button">' + h.i18n.previousMonth + "</button>"), t === e._o.numberOfMonths - 1 && (c += '<button class="pika-next' + (g ? "" : " is-disabled") + '" type="button">' + h.i18n.nextMonth + "</button>"), c + "</div>"
	}

	function q(e, t, n) {
		return '<table cellpadding="0" cellspacing="0" class="pika-table" role="grid" aria-labelledby="' + n + '">' + function (e) {
			var t, n = [];
			for (e.showWeekNumber && n.push("<th></th>"), t = 0; t < 7; t++) n.push('<th scope="col"><abbr title="' + a(e, t) + '">' + a(e, t, !0) + "</abbr></th>");
			return "<thead><tr>" + (e.isRTL ? n.reverse() : n).join("") + "</tr></thead>"
		}(e) + ("<tbody>" + t.join("") + "</tbody>") + "</table>"
	}

	function e(e) {
		var a = this,
			i = a.config(e);
		a._onMouseDown = function (e) {
			if (a._v) {
				var t = (e = e || window.event).target || e.srcElement;
				if (t)
					if (o(t, "is-disabled") || (!o(t, "pika-button") || o(t, "is-empty") || o(t.parentNode, "is-disabled") ? o(t, "pika-prev") ? a.prevMonth() : o(t, "pika-next") && a.nextMonth() : (a.setDate(new Date(t.getAttribute("data-pika-year"), t.getAttribute("data-pika-month"), t.getAttribute("data-pika-day"))), i.bound && d(function () {
						a.hide(), i.blurFieldOnSelect && i.field && i.field.blur()
					}, 100))), o(t, "pika-select")) a._c = !0;
					else {
						if (!e.preventDefault) return e.returnValue = !1;
						e.preventDefault()
					}
			}
		}, a._onChange = function (e) {
			var t = (e = e || window.event).target || e.srcElement;
			t && (o(t, "pika-select-month") ? a.gotoMonth(t.value) : o(t, "pika-select-year") && a.gotoYear(t.value))
		}, a._onKeyChange = function (e) {
			if (e = e || window.event, a.isVisible()) switch (e.keyCode) {
				case 13:
				case 27:
					i.field && i.field.blur();
					break;
				case 37:
					a.adjustDate("subtract", 1);
					break;
				case 38:
					a.adjustDate("subtract", 7);
					break;
				case 39:
					a.adjustDate("add", 1);
					break;
				case 40:
					a.adjustDate("add", 7);
					break;
				case 8:
				case 46:
					a.setDate(null)
			}
		}, a._parseFieldValue = function () {
			if (!i.field || !i.field.value) return null;

			if (i.parse) return i.parse(i.field.value, i.format);
			if (z) {
				var e = L(i.field.value, i.format, i.formatStrict);
				return e && e.isValid() ? e.toDate() : null;
			}
			return new Date(Date.parse(i.field.value));
		}, a._onInputChange = function (e) {
			var t;
			e.firedBy !== a && (t = a._parseFieldValue(), P(t) && a.setDate(t), a._v || a.show())
		}, a._onInputFocus = function () {
			a.show()
		}, a._onInputClick = function () {
			a.show()
		}, a._onInputBlur = function () {
			var e = g.activeElement;
			do {
				if (o(e, "pika-single")) return
			} while (e = e.parentNode);
			a._c || (a._b = d(function () {
				a.hide()
			}, 50)), a._c = !1
		}, a._onClick = function (e) {
			var t = (e = e || window.event).target || e.srcElement,
				n = t;
			if (t) {
				!r && o(t, "pika-select") && (t.onchange || (t.setAttribute("onchange", "return;"), s(t, "change", a._onChange)));
				do {
					if (o(n, "pika-single") || n === i.trigger) return
				} while (n = n.parentNode);
				a._v && t !== i.trigger && n !== i.trigger && a.hide()
			}
		}, a.el = g.createElement("div"), a.el.className = "pika-single" + (i.isRTL ? " is-rtl" : "") + (i.theme ? " " + i.theme : ""), s(a.el, "mousedown", a._onMouseDown, !0), s(a.el, "touchend", a._onMouseDown, !0), s(a.el, "change", a._onChange), i.keyboardInput && s(g, "keydown", a._onKeyChange), i.field && (i.container ? i.container.appendChild(a.el) : i.bound ? g.body.appendChild(a.el) : i.field.parentNode.insertBefore(a.el, i.field.nextSibling), s(i.field, "change", a._onInputChange), i.defaultDate || (i.defaultDate = a._parseFieldValue(), i.setDefaultDate = !0));
		var t = i.defaultDate;
		P(t) ? i.setDefaultDate ? a.setDate(t, !0) : a.gotoDate(t) : a.gotoDate(new Date), i.bound ? (this.hide(), a.el.className += " is-bound", s(i.trigger, "click", a._onInputClick), s(i.trigger, "focus", a._onInputFocus), s(i.trigger, "blur", a._onInputBlur)) : this.show()
	}
	var z = "function" == typeof L,
		r = !!window.addEventListener,
		g = window.document,
		d = window.setTimeout,
		l = function (e, t, n) {
			var a, i;
			for (a in t) (i = void 0 !== e[a]) && "object" == typeof t[a] && null !== t[a] && void 0 === t[a].nodeName ? P(t[a]) ? n && (e[a] = new Date(t[a].getTime())) : y(t[a]) ? n && (e[a] = t[a].slice(0)) : e[a] = l({}, t[a], n) : !n && i || (e[a] = t[a]);
			return e
		},
		u = {
			field: null,
			bound: void 0,
			ariaLabel: "Use the arrow keys to pick a date",
			position: "bottom left",
			reposition: !0,
			format: "YYYY-MM-DD",
			toString: null,
			parse: null,
			defaultDate: null,
			setDefaultDate: !1,
			firstDay: 0,
			firstWeekOfYearMinDays: 4,
			formatStrict: !1,
			minDate: null,
			maxDate: null,
			yearRange: 10,
			showWeekNumber: !1,
			pickWholeWeek: !1,
			minYear: 0,
			maxYear: 9999,
			minMonth: void 0,
			maxMonth: void 0,
			startRange: null,
			endRange: null,
			isRTL: !1,
			yearSuffix: "",
			showMonthAfterYear: !1,
			showDaysInNextAndPreviousMonths: !1,
			enableSelectionDaysInNextAndPreviousMonths: !1,
			numberOfMonths: 1,
			mainCalendar: "left",
			container: void 0,
			blurFieldOnSelect: !0,
			i18n: {
				previousMonth: "Previous Month",
				nextMonth: "Next Month",
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
			},
			theme: null,
			events: [],
			onSelect: null,
			onOpen: null,
			onClose: null,
			onDraw: null,
			keyboardInput: !0
		};
	return e.prototype = {
		config: function (e) {
			this._o || (this._o = l({}, u, !0));
			var t = l(this._o, e, !0);
			t.isRTL = !!t.isRTL, t.field = t.field && t.field.nodeName ? t.field : null, t.theme = "string" == typeof t.theme && t.theme ? t.theme : null, t.bound = !!(void 0 !== t.bound ? t.field && t.bound : t.field), t.trigger = t.trigger && t.trigger.nodeName ? t.trigger : t.field, t.disableWeekends = !!t.disableWeekends, t.disableDayFn = "function" == typeof t.disableDayFn ? t.disableDayFn : null;
			var n, a = parseInt(t.numberOfMonths, 10) || 1;
			return t.numberOfMonths = 4 < a ? 4 : a, P(t.minDate) || (t.minDate = !1), P(t.maxDate) || (t.maxDate = !1), t.minDate && t.maxDate && t.maxDate < t.minDate && (t.maxDate = t.minDate = !1), t.minDate && this.setMinDate(t.minDate), t.maxDate && this.setMaxDate(t.maxDate), y(t.yearRange) ? (n = (new Date).getFullYear() - 10, t.yearRange[0] = parseInt(t.yearRange[0], 10) || n, t.yearRange[1] = parseInt(t.yearRange[1], 10) || n) : (t.yearRange = Math.abs(parseInt(t.yearRange, 10)) || u.yearRange, 100 < t.yearRange && (t.yearRange = 100)), t
		},
		toString: function (e) {
			return e = e || this._o.format, P(this._d) ? this._o.toString ? this._o.toString(this._d, e) : z ? L(this._d).format(e) : this._d.toDateString() : ""
		},
		getMoment: function () {
			return z ? L(this._d) : null
		},
		setMoment: function (e, t) {
			z && L.isMoment(e) && this.setDate(e.toDate(), t)
		},
		getDate: function () {
			return P(this._d) ? new Date(this._d.getTime()) : null
		},
		setDate: function (e, t) {
			if (!e) {
				this._d = null;
				if (this._o.field) {
					this._o.field.value = "";
					i(this._o.field, "change", { firedBy: this });
				}
				return this.draw();
			}

			var n, a;

			if (typeof e === "string") {
				var match = e.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
				if (match) {
					e = new Date(match[3], match[2] - 1, match[1]);
				} else {
					e = new Date(Date.parse(e));
				}
			}

			if (P(e)) {
				n = this._o.minDate;
				a = this._o.maxDate;
				if (P(n) && e < n) e = n;
				else if (P(a) && a < e) e = a;

				this._d = new Date(e.getTime());
				B(this._d);
				this.gotoDate(this._d);

				if (this._o.field) {
					const parts = this.toString('yyyy-MM-dd').split('.');
					this._o.field.value = `${parts[2]}-${parts[1]}-${parts[0]}`
					i(this._o.field, "change", { firedBy: this });
				}

				if (!t && typeof this._o.onSelect === "function") {
					this._o.onSelect.call(this, this.getDate());
				}
			}
		},
		clear: function () {
			this.setDate(null)
		},
		gotoDate: function (e) {
			var t, n, a, i = !0;
			P(e) && (this.calendars && (t = new Date(this.calendars[0].year, this.calendars[0].month, 1), n = new Date(this.calendars[this.calendars.length - 1].year, this.calendars[this.calendars.length - 1].month, 1), a = e.getTime(), n.setMonth(n.getMonth() + 1), n.setDate(n.getDate() - 1), i = a < t.getTime() || n.getTime() < a), i && (this.calendars = [{
				month: e.getMonth(),
				year: e.getFullYear()
			}], "right" === this._o.mainCalendar && (this.calendars[0].month += 1 - this._o.numberOfMonths)), this.adjustCalendars())
		},
		adjustDate: function (e, t) {
			var n, a = this.getDate() || new Date,
				i = 24 * parseInt(t) * 60 * 60 * 1e3;
			"add" === e ? n = new Date(a.valueOf() + i) : "subtract" === e && (n = new Date(a.valueOf() - i)), this.setDate(n)
		},
		adjustCalendars: function () {
			this.calendars[0] = n(this.calendars[0]);
			for (var e = 1; e < this._o.numberOfMonths; e++) this.calendars[e] = n({
				month: this.calendars[0].month + e,
				year: this.calendars[0].year
			});
			this.draw()
		},
		gotoToday: function () {
			this.gotoDate(new Date)
		},
		gotoMonth: function (e) {
			isNaN(e) || (this.calendars[0].month = parseInt(e, 10), this.adjustCalendars())
		},
		nextMonth: function () {
			this.calendars[0].month++, this.adjustCalendars()
		},
		prevMonth: function () {
			this.calendars[0].month--, this.adjustCalendars()
		},
		gotoYear: function (e) {
			isNaN(e) || (this.calendars[0].year = parseInt(e, 10), this.adjustCalendars())
		},
		setMinDate: function (e) {
			e instanceof Date ? (B(e), this._o.minDate = e, this._o.minYear = e.getFullYear(), this._o.minMonth = e.getMonth()) : (this._o.minDate = u.minDate, this._o.minYear = u.minYear, this._o.minMonth = u.minMonth, this._o.startRange = u.startRange), this.draw()
		},
		setMaxDate: function (e) {
			e instanceof Date ? (B(e), this._o.maxDate = e, this._o.maxYear = e.getFullYear(), this._o.maxMonth = e.getMonth()) : (this._o.maxDate = u.maxDate, this._o.maxYear = u.maxYear, this._o.maxMonth = u.maxMonth, this._o.endRange = u.endRange), this.draw()
		},
		setStartRange: function (e) {
			this._o.startRange = e
		},
		setEndRange: function (e) {
			this._o.endRange = e
		},
		draw: function (e) {
			if (this._v || e) {
				var t, n = this._o,
					a = n.minYear,
					i = n.maxYear,
					s = n.minMonth,
					o = n.maxMonth,
					r = "";
				this._y <= a && (this._y = a, !isNaN(s) && this._m < s && (this._m = s)), this._y >= i && (this._y = i, !isNaN(o) && this._m > o && (this._m = o));
				for (var l = 0; l < n.numberOfMonths; l++) t = "pika-title-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 2), r += '<div class="pika-lendar">' + h(this, l, this.calendars[l].year, this.calendars[l].month, this.calendars[0].year, t) + this.render(this.calendars[l].year, this.calendars[l].month, t) + "</div>";
				this.el.innerHTML = r, n.bound && "hidden" !== n.field.type && d(function () {
					n.trigger.focus()
				}, 1), "function" == typeof this._o.onDraw && this._o.onDraw(this), n.bound && n.field.setAttribute("aria-label", n.ariaLabel)
			}
		},
		adjustPosition: function () {
			var e, t, n, a, i, s, o, r, l, h, d, u;
			if (!this._o.container) {
				if (this.el.style.position = "absolute", t = e = this._o.trigger, n = this.el.offsetWidth, a = this.el.offsetHeight, i = window.innerWidth || g.documentElement.clientWidth, s = window.innerHeight || g.documentElement.clientHeight, o = window.pageYOffset || g.body.scrollTop || g.documentElement.scrollTop, u = d = !0, "function" == typeof e.getBoundingClientRect) r = (h = e.getBoundingClientRect()).left + window.pageXOffset, l = h.bottom + window.pageYOffset;
				else
					for (r = t.offsetLeft, l = t.offsetTop + t.offsetHeight; t = t.offsetParent;) r += t.offsetLeft, l += t.offsetTop;
				(this._o.reposition && i < r + n || -1 < this._o.position.indexOf("right") && 0 < r - n + e.offsetWidth) && (r = r - n + e.offsetWidth, d = !1), (this._o.reposition && s + o < l + a || -1 < this._o.position.indexOf("top") && 0 < l - a - e.offsetHeight) && (l = l - a - e.offsetHeight, u = !1), this.el.style.left = r + "px", this.el.style.top = l + "px", c(this.el, d ? "left-aligned" : "right-aligned"), c(this.el, u ? "bottom-aligned" : "top-aligned"), f(this.el, d ? "right-aligned" : "left-aligned"), f(this.el, u ? "top-aligned" : "bottom-aligned")
			}
		},
		render: function (e, t, n) {
			var a = this._o,
				i = new Date,
				s = H(e, t),
				o = new Date(e, t, 1).getDay(),
				r = [],
				l = [];
			B(i), 0 < a.firstDay && (o -= a.firstDay) < 0 && (o += 7);
			for (var h = 0 === t ? 11 : t - 1, d = 11 === t ? 0 : t + 1, u = 0 === t ? e - 1 : e, c = 11 === t ? e + 1 : e, f = H(u, h), g = s + o, m = g; 7 < m;) m -= 7;
			g += 7 - m;
			for (var p, y, D, b, v, _, w, k, M = !1, x = 0, R = 0; x < g; x++) {
				var N = new Date(e, t, x - o + 1),
					S = !!P(this._d) && V(N, this._d),
					C = V(N, i),
					I = -1 !== a.events.indexOf(N.toDateString()),
					T = x < o || s + o <= x,
					Y = x - o + 1,
					E = t,
					O = e,
					j = a.startRange && V(a.startRange, N),
					W = a.endRange && V(a.endRange, N),
					F = a.startRange && a.endRange && a.startRange < N && N < a.endRange;
				T && (O = x < o ? (Y = f + Y, E = h, u) : (Y -= s, E = d, c));
				var A = {
					day: Y,
					month: E,
					year: O,
					hasEvent: I,
					isSelected: S,
					isToday: C,
					isDisabled: a.minDate && N < a.minDate || a.maxDate && N > a.maxDate || a.disableWeekends && (0 === (k = N.getDay()) || 6 === k) || a.disableDayFn && a.disableDayFn(N),
					isEmpty: T,
					isStartRange: j,
					isEndRange: W,
					isInRange: F,
					showDaysInNextAndPreviousMonths: a.showDaysInNextAndPreviousMonths,
					enableSelectionDaysInNextAndPreviousMonths: a.enableSelectionDaysInNextAndPreviousMonths
				};
				a.pickWholeWeek && S && (M = !0), l.push(J(A)), 7 == ++R && (a.showWeekNumber && l.unshift((D = x - o, b = t, v = e, _ = a.firstWeekOfYearMinDays, w = new Date(v, b, D), '<td class="pika-week">' + (z ? L(w).isoWeek() : K(w, _)) + "</td>")), r.push((p = l, y = a.isRTL, '<tr class="pika-row' + (a.pickWholeWeek ? " pick-whole-week" : "") + (M ? " is-selected" : "") + '">' + (y ? p.reverse() : p).join("") + "</tr>")), R = 0, M = !(l = []))
			}
			return q(a, r, n)
		},
		isVisible: function () {
			return this._v
		},
		show: function () {
			this.isVisible() || (this._v = !0, this.draw(), f(this.el, "is-hidden"), this._o.bound && (s(g, "click", this._onClick), this.adjustPosition()), "function" == typeof this._o.onOpen && this._o.onOpen.call(this))
		},
		hide: function () {
			var e = this._v;
			!1 !== e && (this._o.bound && t(g, "click", this._onClick), this._o.container || (this.el.style.position = "static", this.el.style.left = "auto", this.el.style.top = "auto"), c(this.el, "is-hidden"), this._v = !1, void 0 !== e && "function" == typeof this._o.onClose && this._o.onClose.call(this))
		},
		destroy: function () {
			var e = this._o;
			this.hide(), t(this.el, "mousedown", this._onMouseDown, !0), t(this.el, "touchend", this._onMouseDown, !0), t(this.el, "change", this._onChange), e.keyboardInput && t(g, "keydown", this._onKeyChange), e.field && (t(e.field, "change", this._onInputChange), e.bound && (t(e.trigger, "click", this._onInputClick), t(e.trigger, "focus", this._onInputFocus), t(e.trigger, "blur", this._onInputBlur))), this.el.parentNode && this.el.parentNode.removeChild(this.el)
		}
	}, e
});


let inputDate = document.querySelectorAll('.input-date input');

function formatDate(date) {
	const d = new Date(date);
	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const year = d.getFullYear();
	return `${day}.${month}.${year}`;
}

if (inputDate) {
	inputDate.forEach(input => {
		new Pikaday({
			field: input,
			firstDay: 1,
			minDate: new Date(),
			maxDate: new Date(2100, 12 - 1, 31), // месяц 11 = декабрь
			yearRange: [new Date().getFullYear(), 2100],
			i18n: {
				previousMonth: 'Предыдущий месяц',
				nextMonth: 'Следующий месяц',
				months: [
					'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
					'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
				],
				weekdays: [
					'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
					'Четверг', 'Пятница', 'Суббота'
				],
				weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
			},
			onSelect: function (date) {
				this._o.field.classList.add('selected')
				console.log(this._o.field.value);
			},
			toString(date, format) {
				const day = ('0' + date.getDate()).slice(-2);
				const month = ('0' + (date.getMonth() + 1)).slice(-2);
				const year = date.getFullYear();
				return `${day}.${month}.${year}`;
			},
			parse(dateString, format) {
				const parts = dateString.split('.');
				const day = parseInt(parts[0], 10);
				const month = parseInt(parts[1], 10) - 1;
				const year = parseInt(parts[2], 10);
				return new Date(year, month, day);
			}
		})
	})

}

