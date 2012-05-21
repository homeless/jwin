var jwin = function() {
	var jw = this;

	// Standard Toolbar bitmaps
	IDB_STD_SMALL_COLOR = 0;
	IDB_STD_LARGE_COLOR = 1;
	IDB_VIEW_SMALL_COLOR = 4;
	IDB_VIEW_LARGE_COLOR = 5;
	IDB_HIST_SMALL_COLOR = 8;
	IDB_HIST_LARGE_COLOR = 9;
	
	var nc_border = "nc_border_";
	var themeRoot = "/jwin/themes"
	var themeBlue = function() {
		var _that = this;
        var our_border = "/Blue/active_" + nc_border;
		_that.active = {
			nc_border_top_left_0: our_border+"top_left_0.gif",
			nc_border_top_left_1: our_border+"top_left_1.gif",
			nc_border_top: our_border+"top.gif",
			nc_button_min: "/Blue/active_nc_button_minimize.gif",
			nc_button_max: "/Blue/active_nc_button_maximize.gif",
			nc_button_close: "/Blue/active_nc_button_close.gif",
			nc_border_top_right_1: our_border+"top_right_1.gif",
			nc_border_top_right_0: our_border+"top_right_0.gif",
			nc_border_left: our_border+"left.gif",
			nc_border_right: our_border+"right.gif",
			nc_border_bottom_left: our_border+"bottom_left.gif",
			nc_border_bottom: our_border+"bottom.gif",
			nc_border_bottom_right: our_border+"bottom_right.gif",
			nc_menu: "/Blue/active_nc_menu.gif",
			nc_menu_hover: "/Blue/active_nc_menu_hover.gif",
			drop_down: "/Blue/drop_down.gif"
		};
        our_border = "/Blue/inactive_" + nc_border;
		_that.inactive = {
			nc_border_top_left_0: our_border+"top_left_0.gif",
			nc_border_top_left_1: our_border+"top_left_1.gif",
			nc_border_top: our_border+"top.gif",
			nc_button_min: "/Blue/inactive_nc_button_minimize.gif",
			nc_button_max: "/Blue/inactive_nc_button_maximize.gif",
			nc_button_close: "/Blue/inactive_nc_button_close.gif",
			nc_border_top_right_1: our_border+"top_right_1.gif",
			nc_border_top_right_0: our_border+"top_right_0.gif",
			nc_border_left: our_border+"left.gif",
			nc_border_right: our_border+"right.gif",
			nc_border_bottom_left: our_border+"bottom_left.gif",
			nc_border_bottom: our_border+"bottom.gif",
			nc_border_bottom_right: our_border+"bottom_right.gif",
			nc_menu: "/Blue/inactive_nc_menu.gif",
			drop_down: "/Blue/drop_down.gif"
		}
		_that.toolbars = [];
		_that.toolbars[IDB_STD_SMALL_COLOR] = themeRoot+"/Blue/toolbar_std.gif";
		return _that;
	}();

	// ***********************
	// Rest (internal).
	// ***********************

	var MakeXmlHttpRequest = function() {
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	}

	var _HttpRequest = function(url, async, oncomplete) {
		var that = this;
		that.oncomplete = oncomplete;
		that._XmlHttpRequest = MakeXmlHttpRequest();
		var req = that._XmlHttpRequest;
		req.open("GET", url, async);
		var _oncomplete = function (dr) {
			that.responseText = req.responseText;
			if (that.oncomplete) {
				that.oncomplete(that);
			}
		}
		this._XmlHttpRequest.onreadystatechange = function () {
			var req = that._XmlHttpRequest;
			switch (req.readyState) {
			case 4:
				that.status = req.readyState;
				that.statusText = req.statusText;
				_oncomplete(that);
				break;
			};
		}
		req.send(null);
		if (!async) {
			_oncomplete(that);
		}
	};

	var _JsRequest = function(url, async, oncomplete) {
		// TODO: We should wrap DataRequest this neatly.  Also, does DataRequest really need to be public?
		var that = this;
		that.oncomplete = oncomplete;
		var _oncomplete = function (req) {
			// TODO: Check for that.statusText = "Not Found" and other errors.
			var data = eval(req.responseText);
			if (that.oncomplete) {
				that.oncomplete(that);
			}
		}
		that._HttpRequest = new _HttpRequest(url, async, _oncomplete);
	};

	RunJs = function(url) {
		var req = new _JsRequest(url, true, null);
	}

	_LoadLibrary = function(url) {
		// TODO: Asynchrify this.
		var req = new _JsRequest(url, false, null);
	}

	RunJwinApp = function(url) {
		var Main = function() { return WinMain() };
		var req = new _JsRequest(url, true, Main);
	}

	DataRequest = function(url, async, oncomplete) {
		var that = this;
		that.oncomplete = oncomplete;
		that._XmlHttpRequest = MakeXmlHttpRequest();
		var req = that._XmlHttpRequest;
		req.open("GET", url, async);
		var _oncomplete = function (dr) {
			var data = eval(req.responseText)[0];
			that.columns = data.Content.Columns;
			that.rows = data.Content.Rows;
			that.columnIndex = function (columnName) {
				var n = that.columns.length;
				for (var i=0; i<n; i++) {
					if (that.columns[i]==columnName) {
						return i;
					}
				}
				return -1;
			};
			if (that.oncomplete) {
				that.oncomplete(that);
			}
		}
		this._XmlHttpRequest.onreadystatechange = function () {
			var req = that._XmlHttpRequest;
			switch (req.readyState) {
			case 4:
				that.status = req.readyState;
				that.statusText = req.statusText;
				_oncomplete(that);
				break;
			};
		}
		this.objectFromRow = function (rowIndex) {
			var r = {};
			var n = this.columns.length;
			var row = this.rows[rowIndex];
			for (var i=0; i<n; i++) {
				r[this.columns[i]] = row[i];
			}
			return r;
		}
		this.toArray = function () {
			var r = [];
			var n = this.rows.length;
			for (var i=0; i<n; i++) {
				r.push(this.objectFromRow(i));
			}
			return r;
		}
		req.send(null);
		if (!async) {
			_oncomplete(that);
		}
	}	


	// ***********************
	// JWin.
	// ***********************
	
	// Misc "Constants".
	TRUE = 1;
	FALSE = 0;
	VARIANT_TRUE = -1;
	VARIANT_FALSE = 0;
	
	// "Constants" for the dwStyle parameter of the CreateWindow and CreateWindowEx functions.
	WS_BORDER = 0x800000;
	WS_CAPTION = 0xC00000; // WS_BORDER Or WS_DLGFRAME
	WS_CHILD = 0x40000000;
	WS_CLIPCHILDREN = 0x2000000;
	WS_CLIPSIBLINGS = 0x4000000;
	WS_DISABLED = 0x8000000;
	WS_DLGFRAME = 0x400000;
	WS_GROUP = 0x20000;
	WS_HSCROLL = 0x100000;
	WS_MAXIMIZE = 0x1000000;
	WS_MAXIMIZEBOX = 0x10000;
	WS_MINIMIZE = 0x20000000;
	WS_MINIMIZEBOX = 0x20000;
	WS_POPUP = 0x80000000;
	WS_SYSMENU = 0x80000;
	WS_TABSTOP = 0x10000;
	WS_THICKFRAME = 0x40000;
	WS_VISIBLE = 0x10000000;
	WS_VSCROLL = 0x200000;
	WS_OVERLAPPED = 0;
	WS_POPUPWINDOW = WS_POPUP | WS_BORDER | WS_SYSMENU;
	WS_CHILDWINDOW = WS_CHILD;
	WS_SIZEBOX = WS_THICKFRAME;
	WS_OVERLAPPEDWINDOW = WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_THICKFRAME | WS_MINIMIZEBOX | WS_MAXIMIZEBOX;
	WS_TILED = WS_OVERLAPPED;
	WS_TILEDWINDOW = WS_OVERLAPPEDWINDOW;

	// "Constants" for the dwExStyle parameter of the CreateWindowEx function.
	WS_EX_DLGMODALFRAME = 0x00000001;
	WS_EX_TOPMOST = 0x00000008;
	WS_EX_ACCEPTFILES = 0x00000010;
	WS_EX_MDICHILD = 0x00000040;
	WS_EX_TOOLWINDOW = 0x00000080;
	WS_EX_WINDOWEDGE = 0x00000100;
	WS_EX_CLIENTEDGE = 0x00000200;
	WS_EX_CONTEXTHELP = 0x00000400;
	WS_EX_RIGHT = 0x00001000;
	WS_EX_LEFT = 0x00000000;
	WS_EX_RTLREADING = 0x00002000;
	WS_EX_LTRREADING = 0;
	WS_EX_RIGHTSCROLLBAR = 0x00000000;
	WS_EX_CONTROLPARENT = 0x00010000;
	WS_EX_STATICEDGE = 0x00020000;
	WS_EX_APPWINDOW = 0x00040000;
	WS_EX_LAYERED = 0x00080000;
	WS_EX_NOACTIVATE = 0x08000000;
	WS_EX_OVERLAPPEDWINDOW = WS_EX_WINDOWEDGE | WS_EX_CLIENTEDGE;
	WS_EX_PALETTEWINDOW = WS_EX_WINDOWEDGE | WS_EX_TOOLWINDOW | WS_EX_TOPMOST;
	
	// "Constants" for the nIndex parameter of the GetSysColor function.
	COLOR_ACTIVEBORDER = 10;
	COLOR_ACTIVECAPTION = 2;
	COLOR_APPWORKSPACE = 12;
	COLOR_BACKGROUND = 1;
	COLOR_DESKTOP = 1;
	COLOR_BTNFACE = 15;
	COLOR_BTNHIGHLIGHT = 20;
	COLOR_3DHILIGHT = 20;
	COLOR_3DHIGHLIGHT = 20;
	COLOR_BTNHILIGHT = 20;
	COLOR_BTNSHADOW = 16;
	COLOR_3DSHADOW = 16;
	COLOR_BTNTEXT = 18;
	COLOR_CAPTIONTEXT = 9;
	COLOR_GRAYTEXT = 17;
	COLOR_HIGHLIGHT = 13;
	COLOR_HIGHLIGHTTEXT = 14;
	COLOR_INACTIVEBORDER = 11;
	COLOR_INACTIVECAPTION = 3;
	COLOR_INACTIVECAPTIONTEXT = 19;
	COLOR_MENUTEXT = 7;
	COLOR_MENU = 4;
	COLOR_SCROLLBAR = 0;
	COLOR_WINDOW = 5;
	COLOR_WINDOWFRAME = 6;
	COLOR_WINDOWTEXT = 8;
	
	// "Constants" for the hWndInsertAfter paramter of the SetWindowPos function.
	HWND_BOTTOM = 0x00000001;
	HWND_NOTOPMOST = 0xFFFFFFFE;
	HWND_TOP = 0x00000000;
	HWND_TOPMOST = 0xFFFFFFFF;
	
	// "Constants" for the uFlags parameter of the SetWindowPos function.
	SWP_FRAMECHANGED = 0x20; // The frame changed: send WM_NCCALCSIZE
	SWP_DRAWFRAME = SWP_FRAMECHANGED;
	SWP_HIDEWINDOW = 0x80;
	SWP_NOACTIVATE = 0x10;
	SWP_NOCOPYBITS = 0x100;
	SWP_NOMOVE = 0x2;
	SWP_NOOWNERZORDER = 0x200; // Don't do owner Z ordering
	SWP_NOREDRAW = 0x8;
	SWP_NOREPOSITION = SWP_NOOWNERZORDER;
	SWP_NOSIZE = 0x1;
	SWP_NOZORDER = 0x4;
	SWP_SHOWWINDOW = 0x40;
	
	// "Constants" for the nCmdShow parameter of the ShowWindow function.
	SW_HIDE = 0;
	SW_MAXIMIZE = 3;
	SW_MINIMIZE = 6;
	SW_RESTORE = 9;
	SW_SHOW = 5;
	SW_SHOWDEFAULT = 10;
	SW_SHOWMAXIMIZED = 3;
	SW_SHOWMINIMIZED = 2;
	SW_SHOWMINNOACTIVE = 7;
	SW_SHOWNA = 8;
	SW_SHOWNOACTIVATE = 4;
	SW_SHOWNORMAL = 1;
	
	// "Constants" for the uFlags parameter of the AppendMenu function.
	MF_STRING = 0x00;
	MF_ENABLED = 0x00;
	MF_GRAYED = 0x01;
	MF_POPUP = 0x10;
	MF_SEPARATOR = 0x800;

	// "Constants" for RemoveMenuItem.
	MF_BYCOMMAND = 0;
	MF_BYPOSITION = 0x400;
	
	// "Constants" for WM_NCHITTEST return values.
	HTERROR = -2;
	HTTRANSPARENT = -1;
	HTNOWHERE = 0;
	HTCLIENT = 1;
	HTCAPTION = 2;
	HTSYSMENU = 3;
	HTGROWBOX = 4;
	HTSIZE = HTGROWBOX;
	HTMENU = 5;
	HTHSCROLL = 6;
	HTVSCROLL = 7;
	HTMINBUTTON = 8;
	HTMAXBUTTON = 9;
	HTLEFT = 10;
	HTRIGHT = 11;
	HTTOP = 12;
	HTTOPLEFT = 13;
	HTTOPRIGHT = 14;
	HTBOTTOM = 15;
	HTBOTTOMLEFT = 16;
	HTBOTTOMRIGHT = 17;
	HTBORDER = 18;
	HTSIZEFIRST = HTLEFT;
	HTSIZELAST = HTBOTTOMRIGHT;
	HTOBJECT = 19;
	HTCLOSE = 20;
	HTHELP = 21;
	
	// "Constants" for WM_ACTIVATE.
	WA_ACTIVE = 1;
	WA_CLICKACTIVE = 2;
	WA_INACTIVE = 0;
	
	// "Constants" for WM_SIZE.
	SIZE_RESTORED = 0;
	SIZE_MINIMIZED = 1;
	SIZE_MAXIMIZED = 2;
	SIZE_MAXSHOW = 3;
	SIZE_MAXHIDE = 4;
	
	// "Constants" for clipboard data formats.
	CF_TEXT = 0x1;
	CF_BITMAP = 0x2;
	CF_WAVE = 0x12;
	CF_UNICODETEXT = 0x13;
	CF_HDROP = 0x15;
	CF_DSPMETAFILEPICT = 0x83;

	// Brush Styles.
	BS_SOLID = 0x0;
	BS_NULL = 0x1;
	BS_HATCHED = 0x2;
	BS_PATTERN = 0x3;
	BS_DIBPATTERN = 0x5;

	// Hatch Styles.
	HS_HORIZONTAL = 0x0;
	HS_VERTICAL = 0x1;
	HS_FDIAGONAL = 0x2; // Downhill.
	HS_BDIAGONAL = 0x3; // Uphill.
	HS_CROSS = 0x4; // Grid lines.
	HS_DIAGCROSS = 0x5;

	// Pen Styles.
	PS_SOLID = 0;
	PS_NULL = 5;
	PS_INSIDEFRAME = 6;
  
	PS_COSMETIC = 0x00000000;
	PS_GEOMETRIC = 0x00010000;
	PS_TYPE_MASK = 0x000F0000;

	// "Constants" for GetStockObject.
	WHITE_BRUSH = 0x0;
	GRAY_BRUSH = 0x2;
	BLACK_BRUSH = 0x4;
	NULL_BRUSH = 0x5;
	WHITE_PEN = 0x6;
	BLACK_PEN = 0x7;
	NULL_PEN = 0x8;
	
	// "Constants" for window messages.
	WM_ACTIVATE = 0x6;
	WM_ACTIVATEAPP = 0x1C;
	WM_CHAR = 0x102;
	WM_CHILDACTIVATE = 0x22;
	WM_CLEAR = 0x303;
	WM_CLOSE = 0x10;
	WM_COMMAND = 0x111;
	WM_COMPACTING = 0x41;
	WM_COPY = 0x301;
	WM_CREATE = 0x1;
	WM_CUT = 0x300;
	WM_DESTROY = 0x2;
	WM_ENABLE = 0xA;
	WM_ENTERMENULOOP = 0x211;
	WM_EXITMENULOOP = 0x212;
	WM_GETMINMAXINFO = 0x24;
	WM_GETTEXT = 0xD;
	WM_HSCROLL = 0x114;
	WM_INITMENU = 0x116;
	WM_INITMENUPOPUP = 0x117;
	WM_KEYDOWN = 0x100;
	WM_KEYUP = 0x101;
	WM_LBUTTONDBLCLK = 0x203;
	WM_LBUTTONDOWN = 0x201;
	WM_LBUTTONUP = 0x202;
	WM_MBUTTONDBLCLK = 0x209;
	WM_MBUTTONDOWN = 0x207;
	WM_MBUTTONUP = 0x208;
	WM_MDIACTIVATE = 0x222;
	WM_MDICREATE = 0x220;
	WM_MDIDESTROY = 0x221;
	WM_MDIGETACTIVE = 0x229;
	WM_MDIMAXIMIZE = 0x225;
	WM_MDIREFRESHMENU = 0x234;
	WM_MDIRESTORE = 0x223;
	WM_MENUCHAR = 0x120;
	WM_MENUSELECT = 0x11F;
	WM_MOUSEACTIVATE = 0x21;
	WM_MOUSELEAVE = 0x02A3;
	WM_MOUSEMOVE = 0x200;
	WM_MOVE = 0x3;
	WM_NCACTIVATE = 0x86;
	WM_NCCALCSIZE = 0x83;
	WM_NCCREATE = 0x81;
	WM_NCDESTROY = 0x82;
	WM_NCHITTEST = 0x84;
	WM_NCLBUTTONDBLCLK = 0xA3;
	WM_NCLBUTTONDOWN = 0xA1;
	WM_NCLBUTTONUP = 0xA2;
	WM_PASTE = 0x302;
	WM_RBUTTONDBLCLK = 0x206;
	WM_RBUTTONDOWN = 0x204;
	WM_RBUTTONUP = 0x205;
	WM_SETFOCUS = 0x7;
	WM_SETTEXT = 0xC;
	WM_SHOWWINDOW = 0x18;
	WM_SIZE = 0x5;
	WM_SIZING = 0x0214;
	WM_UNDO = 0x304;
	WM_USER = 0x0400;
	WM_VSCROLL = 0x115;
	WM_WINDOWPOSCHANGED = 0x47;
	WM_WINDOWPOSCHANGING = 0x46;

	// "Constants" for GetWindowLong
	GWL_WNDPROC = -4;
    GWL_USERDATA = -21;
	
	// Internal State
	var _GlobalClassList = [];
	var _GlobalWindowList = [];
	var _GlobalMenuList = [];
	var _GlobalWindowsInZOrder = [];
	var _GlobalWindowCount = 0;
	var _GlobalMenuCount = 0;
	var _GlobalActiveWindow = null;
	var _GlobalActiveButton = null;
	var _GlobalTheme = themeBlue;
	var _hwndNextWindow = 1;
	var _GlobalGdiObjectList = [];
	var _hNextGdiObject = 32;
	var _GlobalBitmapList = [];
	var _hNextBitmap = 1;
	
	var _ModeNone = 0;
	var _ModeSize = 1;
	var _ModeMove = 2;
	var _ModeDialog = 3;
	
	var _modalWindow = null;
	var _mode = _ModeNone;
	
	var _SysColors = [];
	var _StockObjects = [];
	
	var _hwndWindowBeingDragged = 0;
	var _DragMode = HTNOWHERE;
	var _GlobalCursorBeforeDrag = "";
	var _MousePreviousPositionX = 0;
	var _MousePreviousPositionY = 0;
	var _inMenuLoop = false;
	var _activeMenuSequence = []; // Sequence of selected menu items, eg. File >> Recent >> x.txt. 
	var _debug_caption;
	var _taClipboard;
	
	LOWORD = function(w) {
		return w & 0xffff;
	}
	
	HIWORD = function(w) {
		return (w & 0xffff0000) / (0x10000);
	}
	
	MAKEWPARAM = function(wLow, wHigh) {
		return wLow + wHigh * (0x10000);
	}

    _isSet = function(expectedBits, value) {
        return (expectedBits == (value & expectedBits));		
	}
		
	var _createTextNode = function(text) {
		return document.createTextNode(text);
	}
	
	var _appendTextNode = function(parent, text) {
		return parent.appendChild(_createTextNode(text));
	}
	
	var print = function(x) {
		if (!_debug_caption) {
			_debug_caption = _createTextNode("debug output goes here");
			document.body.appendChild(_debug_caption);
		}
		var new_output = _createTextNode(x);
		document.body.insertBefore(new_output, _debug_caption)
		_debug_caption = new_output;
	}
	
	var _dontEven = function() {
		return false;
	}
	
	var _onlyForInput = function(e) {
		var targ = _getEventTarget(e, "_inputStyle");
		if (targ && targ._inputStyle) {
			return true;
		}
		
		return false;
	}
	
	var _getAbsoluteX = function(v) {
		var r = v.offsetLeft;
		while (v.offsetParent) {
			v = v.offsetParent;
			r = r + v.offsetLeft;
		}
		return r;
	}
	
	var _getAbsoluteY = function(v) {
		var r = v.offsetTop;
		while (v.offsetParent) {
			v = v.offsetParent;
			r = r + v.offsetTop;
		}
		return r;
	}
	
	var createElement = function(x) {
		return document.createElement(x);
	}
	
	var _getClipboardTA = function() {
		if (!_taClipboard) {
			var ta = createElement("textarea");
			ta.id = "_clippy";
			ta.name = ta.id;
			ta.style.display = "none";
			ta.value = "";
			ta._inputStyle = "x"; // Used by _getEventTarget		
			document.body.appendChild(ta);
			_taClipboard = ta;
		}
		return _taClipboard;
	}
	
	SetClipboardData = function(uFormat, hMem) {
		// uFormat is ignored.  CF_TEXT or CF_UNICODETEXT is assumed.
		var taClipboard = _getClipboardTA();
		taClipboard.innerText = hMem;
		if (taClipboard.createTextRange) {
			var tr = taClipboard.createTextRange();
			tr.execCommand("Copy");
		}
	}
	
	GetClipboardData = function(uFormat) {
		// uFormat is ignored.  CF_TEXT or CF_UNICODETEXT is assumed.
		var taClipboard = _getClipboardTA();
		var previousContent = taClipboard.innerText;
		taClipboard.innerText = "";
		if (taClipboard.createTextRange) {
			var tr = taClipboard.createTextRange();
			tr.execCommand("Paste");
			if (taClipboard.innerText.length == 0) {
				taClipboard.innerText = previousContent;
			}
		} else {
			taClipboard.innerText = previousContent;
		}
		return taClipboard.innerText;
	}
	
	var _initSysColors = function() {
		_SysColors[COLOR_WINDOW] = "white";
		_SysColors[COLOR_WINDOWTEXT] = "black";
		_SysColors[COLOR_CAPTIONTEXT] = "#2D4673";
		_SysColors[COLOR_INACTIVECAPTIONTEXT] = "#1D2C47" //"#A5A2A5";
		_SysColors[COLOR_BTNFACE] = "#E7DFE7";
		_SysColors[COLOR_APPWORKSPACE] = "#878787";
		_SysColors[COLOR_DESKTOP] = "#5284BF";
		_SysColors[COLOR_MENU] = "#E7DFE7";
		_SysColors[COLOR_MENUTEXT] = "black";
		_SysColors[COLOR_HIGHLIGHT] = "#5A89D8";
		_SysColors[COLOR_HIGHLIGHTTEXT] = "#FAFAFA";
	}
	
	GetSysColor = function(nIndex) {
		return _SysColors[nIndex];
	}
	
	_createTable = function(nWidth) {
		var r = createElement("table");
		r.cellSpacing = 0;
		r.cellPadding = 0;
		r.style.width = nWidth;
		r.border = 0;
		return r;
	}
	
	var _escapeHtml = function(text) {
		var r = escape(text);
		// Following line only works because escape is doing the same thing as encodeURI!
		r = r.replace("%20", "&nbsp;");
		r = r.replace("%22", "&quot;");
		r = r.replace("%EB", "&euml;");
		r = r.replace("%3C", "&lt;");
		r = r.replace("%3E", "&gt;");
		r = r.replace("%26", "&amp;");
		r = r.replace("%27", "'");
		r = r.replace("%28", "(");
		r = r.replace("%29", ")");
		r = r.replace("%5B", "[");
		r = r.replace("%5D", "]");
		return r;
	}
	
	var _createLink = function(href, text) {
		var r = createElement("a");
		r.href = encodeURI(href);
		if (text) {
			//r.innerHTML = _escapeHtml(text);
			_appendTextNode(r, text);
		};
		return r;
	}
	
	var _createListItem = function(content) {
		var r = createElement("li");
		if (content) {
			r.appendChild(content);
		}
		return r;
	}
	
	var _createImg = function(strUrl, nWidth, nHeight) {
		var r = createElement("img");
		var s = r.style;
		s.width = nWidth;
		s.height = nHeight;
		r.border = 0;
		r.galleryImg = false;
		s.paddingLeft = 0;
		s.paddingTop = 0;
		s.paddingRight = 0;
		s.paddingBottom = 0;
		r.src = strUrl;
		return r;
	}

	_CreateImg = _createImg;

	var _createElementFromBitmap = function(tag, bm) {
		var r = createElement(tag);
		var s = r.style;
		s.paddingLeft = 0;
		s.paddingTop = 0;
		s.paddingRight = 0;
		s.paddingBottom = 0;
		s.width = bm.cx;
		s.height = bm.cy;
		s.background = "url(" + bm.url + ") no-repeat -" + bm.x + "px -" + bm.y + "px";
		return r;
	}

	var _createImgFromBitmap = function(bm) {
		return _createElementFromBitmap("div", bm);
	}
	
	_getBitmap = function(hBitmap) {
		if (hBitmap) {
			return _GlobalBitmapList[hBitmap];
		}
	}
	
	var _Bitmap = function(url, cx, cy, x, y) {
		// x & y here refer to a position within the image at the url.
		// The bitmap represents a portion of that image, with dimensions (cx, cy).
		this.url = url;
		this.cx = cx;
		this.cy = cy;
		this.x = x;
		this.y = y;
	}

	var _Bitmap_LoadFromUrl = function(url, cx, cy, x, y) {
		var bm = new _Bitmap(url, cx, cy, x, y);
		var hbm = _hNextBitmap;
		_hNextBitmap++;
		_GlobalBitmapList[hbm] = bm;
		return hbm;
	}
	
	var _getWindow = function(hwnd) {
		if (hwnd) {
			return _GlobalWindowList[hwnd];
		} else {
			return document.body;
		}
	}

	_GetWindow = function(hwnd) {
		return _getWindow(hwnd);
	}

//	var _forEachChildWindow = function(winParent, f) {
//		var winChild = win.clientArea.firstChild;
//		while (winChild) {
//			if (winChild.hwnd) {
//				f(winChild);
//			}
//			winChild = winChild.nextSibling;
//		}		
//	}

    GetParent = function(hWnd) {
		if (hwnd) {
			var win = getWindow(hWnd);
			var r = win._hwndParent;
			return r?r:0;
		}
	}
	
	_getParent = function(win) {
		return _getWindow(win._hwndParent);
	}
	
	var _getMenu = function(hMenu) {
		if (hMenu) {
			return _GlobalMenuList[hMenu];
		} else {
			return null;
		}
	}
  
	var _getGdiObject = function(hObject) {
		if (hObject) {
			return _GlobalGdiObjectList[hObject];
		} else {
			return null;
		}
	}
	
	var _getClass = function(lpClassName) {
		return _GlobalClassList[lpClassName];
	}
	
	var _closeAllPopupWindows = function() {
		for (var i = _GlobalWindowCount - 1; i >= 0; i--) {
			var w = _GlobalWindowsInZOrder[i];
			if (w._isPopup) {
				_closeWindow(w);
			}
		}
	}
	
	var _enterMenuLoop = function() {
		_inMenuLoop = true;
	}
	
	var _exitMenuLoop = function() {
		_clearActiveMenuSequence();
		_closeAllPopupWindows();
		_inMenuLoop = false;
	}
	
	SendMessage = function(hWnd, Msg, wParam, lParam) {
		var win = _getWindow(hWnd);
		if (win && win._lpfnWndProc) {
			return win._lpfnWndProc(hWnd, Msg, wParam, lParam);
		}
		return 0;
	}
	
	var _ncActivateWindow = function(win) {
		_applyTheme(win, _GlobalTheme, true);
		return 0;
	}

	var _ncDeactivateWindow = function(win) {
		_applyTheme(win, _GlobalTheme, false);
		return 0;
	}

	var _ncMdiActivateWindow = _ncActivateWindow;
	var _ncMdiDeactivateWindow = _ncDeactivateWindow;
	
	var _activateWindow = function(win) {
		if (!win) {
			return;
		}
		
		if (!win._isPopup) {
			_exitMenuLoop();
		}
		
		var z = parseInt(win.style.zIndex);
		for (var i = z; i < _GlobalWindowCount; i++) {
			var w = _GlobalWindowsInZOrder[i];
			w.style.zIndex = i;
			_GlobalWindowsInZOrder[i - 1] = w;
		}
		
		win.style.zIndex = _GlobalWindowCount;
		_GlobalWindowsInZOrder[_GlobalWindowCount - 1] = win;
		document.title = win._lpWindowName;
		SendMessage(win.hwnd, WM_NCACTIVATE, WA_ACTIVE, 0);
		return 0;
	}

	var _deactivateWindow = function(win) {
		if (!win) {
			return;
		}
		SendMessage(win.hwnd, WM_NCACTIVATE, WA_INACTIVE, 0);
	}

	var _activateMdiWindow = function(win) {
		if (!win) {
			return;
		}

		// Alter z-order.  WM_NCACTIVATE is sent separately (this function differs from _activateWindow in that regard).
		var z = parseInt(win.style.zIndex);
		var hwndMdiClient = win._hwndParent;
		var gotOne = false;
		var uz;
		var j;
		for (var i = z; i < _GlobalWindowCount; i++) {
			var w = _GlobalWindowsInZOrder[i];
			if (w._hwndParent==hwndMdiClient) {
				var wz = w.style.zIndex;
				if (gotOne) {
					w.style.zIndex = uz;
					_GlobalWindowsInZOrder[j] = w;
				} else {
					w.style.zIndex = z;
					/* if (_GlobalWindowsInZOrder[z-1]===win){
						alert("seems legit");
					} else {
						alert("isn't right");
					} */
					_GlobalWindowsInZOrder[z-1] = w;
				}
				gotOne = true;
				uz = wz;
				j = i;
			}
		}
		if (gotOne) {
			win.style.zIndex = uz;
			_GlobalWindowsInZOrder[j] = win;
		}
		
		return 0;
	}
	
	GetWindowLong = function(hWnd, nIndex) {
		var win = _getWindow(hWnd);
		switch (nIndex) {
			case GWL_WNDPROC:
				return win._lpfnWndProc;
			case GWL_USERDATA:
				if (win._lUserData) {
					return win._lUserData;
				}
				return 0;
		}
	}
	
	SetWindowLong = function(hWnd, nIndex, dwNewLong) {
		var win = _getWindow(hWnd);
		switch (nIndex) {
			case GWL_WNDPROC:
				win._lpfnWndProc = dwNewLong;
                break;
			case GWL_USERDATA:
                win._lUserData = dwNewLong;
				break;
		}
	}
	
	RegisterClass = function(lpWndClass) {
		_GlobalClassList[lpWndClass.lpszClassName] = lpWndClass;
		return lpWndClass.lpszClassName;
	}
	
	PostQuitMessage = function(nExitCode) {
		// For now, do nothing, as we don't have concept of a Process.
	}
	
	
	var _moveWindow = function(win, x, y) {
		var logx = x, logy = y;
		var winParent = _getParent(win);
		win.style.left = x;
		win.style.top = y;
		// Send WM_MOVE message using the supplied logical coordinates (not the coordinates that were adjusted above).
		var lParam = logy * (0x10000) + logx;
		SendMessage(win.hwnd, WM_MOVE, 0, lParam);
	}
	
	var _sizeWindow = function(win, sizeType, nWidth, nHeight) {
		// Resize a window to the specified dimensions.
		if (!(win && win.clientArea)) {
			return;
		}
		var clientWidth = nWidth - win._ncWidth;
		var clientHeight = nHeight - win._ncHeight;
		clientWidth -= win._bsClientBorder;
		clientHeight -= win._bsClientBorder-1;
		var newHeight = clientHeight + "px";
		win.clientArea.style.width = clientWidth + "px";
		win.clientArea.style.height = newHeight;
		if (win._middle) {
			win._middle.style.height = newHeight;
		}
		if (win._menuRow) {
			win._menuRow.style.width = clientWidth + "px";
			win._menuDiv.style.width = clientWidth + "px";
		}
		var lParam = clientHeight * (0x10000) + clientWidth;
		SendMessage(win.hwnd, WM_SIZE, sizeType, lParam);
	}
	
	var _sizeWindowClient = function(win, sizeType, nWidth, nHeight) {
		// Resize a window so that its client area matches the specified dimensions.
		var newWidth = nWidth + "px";
		win.clientArea.style.width = newWidth;
		var newHeight = nHeight + "px";
		win.clientArea.style.height = newHeight;
		if (win._middle) {
			win._middle.style.height = newHeight;
		}
		if (win._menuRow) {
			win._menuRow.style.width = newWidth;
			win._menuDiv.style.width = newWidth;
		}
		var netWidth = nWidth + win._ncWidth;
		var netHeight = nHeight + win._ncHeight;
		win.style.width = netWidth + "px";
		win.table.style.width = netWidth + "px";
		
		var lParam = nHeight * (0x10000) + nWidth;
		SendMessage(win.hwnd, WM_SIZE, sizeType, lParam);
	}
	
	MoveWindow = function(hWnd, X, Y, nWidth, nHeight, bRepaint) {
		var win = _getWindow(hWnd);
		_moveWindow(win, X, Y);
		_sizeWindow(win, SIZE_RESTORED, nWidth, nHeight);
	}
	
	SetWindowPos = function(hWnd, hWndInsertAfter, X, Y, cx, cy, uFlags) {
		// TODO
	}
	
	var _popupMenuWinProc = function(hWnd, Msg, wParam, lParam) {
		return DefWindowProc(hWnd, Msg, wParam, lParam);
	}

	var _getActiveWindow = function() {
		return _GlobalActiveWindow;
	}
	
	GetActiveWindow = function() {
		var r = _getActiveWindow();
		if (r) {
			return r.hwnd;
		}
		return 0;
	}

	DefWindowProc = function(hWnd, Msg, wParam, lParam) {
		var win = _getWindow(hWnd);
    
		if (win) {
			if (win._class) {
				if (win._isPopup) {
					return _DefaultWindowProc_Popup(hWnd, Msg, wParam, lParam);
				}
				else 
					if (_isSet(WS_OVERLAPPEDWINDOW, win._class.style)) {
						return _DefaultWindowProc_Overlapped(hWnd, Msg, wParam, lParam);
					}
			}
		}
		return true;
	}
	
	var _getDlgItem = function(winDialog, idChild) {
		if (!(winDialog && winDialog.clientArea)) {
			return null;
		}
		var ca = winDialog.clientArea;
		for (var i = ca.childNodes.length - 1; i >= 0; i--) {
			var cw = ca.childNodes[i];
			if (cw.hwnd && cw._hMenu == idChild) {
				return cw;
			}
		}
		return null;
	}
	
	GetDlgItem = function(hDlg, nIDDlgItem) {
		// hDlg can be an hwnd.  nIDDlgItem is the id of a child window, passed as the hMenu parameter of a prior call to CreateWindow.
		var r = _getDlgItem(_getWindow(hDlg), nIDDlgItem);
		if (r && r.hwnd) {
			return r.hwnd;
		}
		else {
			return 0;
		}
	}
	
	var _getEventTarget = function(e, expectedProperty){
		var targ;
		if (e) {
			if (e.target) {
				//e.preventDefault();
				targ = e.target;
				if (e.stopPropagation) {
					e.stopPropagation();
				}
			}
			else { // IE
				e.cancelBubble = true;
				targ = e.srcElement;
			}
			if (targ.nodeType == 3) { // defeat Safari bug http://www.quirksmode.org/js/events_properties.html#target
				targ = targ.parentNode;
			}
		}
		else { // Old IE versions; untested.
			e = window.event;
			e.cancelBubble = true;
			targ = e.srcElement;
		}
		if (expectedProperty) {
			while (targ && !targ[expectedProperty] && targ.parentNode) {
				targ = targ.parentNode;
			}
		}
		return targ;
	}
	
	var _getWindowFromEventArgs = function(e) {
		var targ = _getEventTarget(e, "hwnd");
		var hwnd = targ.hwnd;
		if (!hwnd) {
			return;
		}
		return _getWindow(hwnd);
	}
	
	var _getHitTestFromEventArgs = function(e) {
		var targ = _getEventTarget(e, "ht");
		return targ.ht;
	}
	
	var _menuItemIsSelected = function(li) {
		for (var i = 0; i < _activeMenuSequence.length; i++) {
			if (li === _activeMenuSequence[i]) {
				return true;
			}
		}
		return false;
	}
	
	var _highlightMenuItem = function(li, highlight) {
		var textColor;
		if (highlight) {
			li.style.backgroundColor = GetSysColor(COLOR_HIGHLIGHT);
			textColor = GetSysColor(COLOR_HIGHLIGHTTEXT);
		}
		else {
			if (li.parentNode._orientation == "h") {
				li.style.backgroundColor = "";
			}
			else {
				li.style.backgroundColor = GetSysColor(COLOR_MENU);
			}
			textColor = GetSysColor(COLOR_MENUTEXT);
		}
		li.style.Color = textColor;
		li.childNodes[0].style.color = textColor;
		if (li.childNodes[0].childNodes[0].style) {
			li.childNodes[0].childNodes[0].style.color = textColor;
		}
	}
	
	var _clearActiveMenuSequence = function() {
		for (var i = 0; i < _activeMenuSequence.length; i++) {
			_highlightMenuItem(_activeMenuSequence[i], false);
		}
		_activeMenuSequence = [];
	}
	
	var _onmenumousedown = function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		var targ = _getEventTarget(e, "item");
		var win = _getWindowFromEventArgs(e);
		if (!targ) {
			return;
		}
		var win = _getWindowFromEventArgs(e);
		_setActiveWindow(win.hwnd, true);
		var item = targ.item;
		if (item && item.menu) {
			_clearActiveMenuSequence();
			_activeMenuSequence = [targ];
			_highlightMenuItem(targ, true);
			_showPopupMenu(win.hwnd, item.menu, _getAbsoluteX(targ) - 4, _getAbsoluteY(targ) + 20);
		}
		return false;
	}
	
	var _onmenuclick = function(e) {
		var targ = _getEventTarget(e, "item");
		if (!targ) {
			return;
		}
		var item = targ.item;
		if (!item || !item.id) {
			return;
		}
		_exitMenuLoop();
		var win = _getWindowFromEventArgs(e);
		SendMessage(win.hwnd, WM_COMMAND, item.id, 0);
		return false;
	}
	
	var _onmenumouseenter = function(e) {
		if (!_inMenuLoop) {
			return;
		}
		var targ = _getEventTarget(e, "item");
		if (!targ) {
			return;
		}
		
		_highlightMenuItem(targ, true);
		
		var item = targ.item;
		if (item && item.menu) {
			_clearActiveMenuSequence();
			_activeMenuSequence = [targ];
			_highlightMenuItem(targ, true);
			var win = _getWindowFromEventArgs(e);
			_showPopupMenu(win.hwnd, item.menu, _getAbsoluteX(targ) - 4, _getAbsoluteY(targ) + 20);
		}
	}
	
	var _onmenumouseleave = function(e) {
		if (!_inMenuLoop) {
			return;
		}
		var targ = _getEventTarget(e, "item");
		if (!targ) {
			return;
		}
		
		if (!_menuItemIsSelected(targ)) {
			_highlightMenuItem(targ, false);
		}
	}
	
	var _renderHorizontalMenuItems = function(hwnd, items) {
		var ItemHeight = 22;
		var strItemHeight = ItemHeight + "px";
		var r = createElement("ul");
		r.ht = HTMENU;
		r.hwnd = hwnd;
		var s = r.style;
		s.position = "relative";
		s.listStyleType = "none";
		s.padding = 0;
		s.paddingLeft = 4;
		s.paddingTop = 2;
		s.fontFamily = "Helvetica,Arial,Verdana,sans-serif";
		s.fontSize = "10pt";
		s.width = "auto";
		s.height = strItemHeight;
		s.display = "block";
		s.margin = 0;
		s.position = "relative";
		s.background = "url(" + themeRoot + themeBlue.active.nc_menu + ") repeat-x top left";
		r._orientation = "h";
		for (var i = 0; i < items.length; i++) {
			(function(item){
				var link = _createLink("#", item.text);
				link.onclick = _dontEven;
				s = link.style;
				s.textDecoration = "none";
				s.color = GetSysColor(COLOR_MENUTEXT);
				s.display = "inline";
				s.cursor = "default";
				s.padding = 0;
				s.paddingLeft = 6;
				s.paddingRight = 6;
				s.paddingTop = 0;
				s.paddingBottom = 0;
				s.height = strItemHeight;
				var li = r.appendChild(_createListItem(link));
				s = li.style;
				s.display = "inline";
				s.margin = 0;
				s.padding = 0;
				s.height = strItemHeight;
				s.padding = 0;
				s.paddingLeft = 2;
				s.paddingRight = 2;
				s.paddingTop = 0;
				s.paddingBottom = 2; // This may take up space in the client area in IE.  Improves appearance of menu highlighting in firefox.
				li.item = item;
				if (item.menu) {
					_attachWindowEventHandler(li, "mousedown", _onmenumousedown);
				}
				else {
					_attachWindowEventHandler(li, "click", _onmenuclick);
				}
				_attachWindowEventHandler(li, "mouseover", _onmenumouseenter);
				_attachWindowEventHandler(li, "mouseout", _onmenumouseleave);
			})(items[i]);
		}
		return r;
	}
	
	var _makeVerticalList = function(hwndParent) {
		// Create an empty ul for either a menu or a ListBox.
		var r = createElement("ul");
		r.hwnd = hwndParent;
		r._orientation = "v";
		var s = r.style;
		s.listStyleType = "none";
		s.padding = 0;
		s.paddingLeft = 0;
		s.paddingRight = 0;
		s.paddingTop = 0;
		s.paddingBottom = 0;
		s.fontFamily = "Helvetica,Arial,Verdana,sans-serif";
		s.fontSize = "10pt";
		s.display = "block";
		s.margin = 0;
		s.position = "relative";
		s.textIndent = 0;
		s.borderWidth = "1px";
		return r;
	}
	
	var _appendVerticalListItem = function(list, text, color, paddingLeft, paddingRight, paddingTop, paddingBottom) {
		var link = _createLink("#", text);
		link.onclick = _dontEven;
		s = link.style;
		s.textDecoration = "none";
		s.color = color;
		s.display = "block";
		s.cursor = "default";
		s.padding = 0;
		s.paddingLeft = paddingLeft;
		s.paddingRight = paddingRight;
		s.paddingTop = paddingTop;
		s.paddingBottom = paddingBottom;
		var span = createElement("span");
		span.appendChild(link);
		span.style.margin = 0;
		span.style.padding = 0;
		var li = list.appendChild(_createListItem(span));
		s = li.style;
		s.textIndent = 0;
		s.display = "block";
		s.margin = 0;
		s.padding = 0;
		s.height = "18px";
		s.padding = 0;
		s.paddingLeft = 0;
		s.paddingRight = 0;
		s.paddingTop = 0;
		s.paddingBottom = 0;
		s.overflow = "hidden";
		return li;
	}
	
	var _renderVerticalMenuItems = function(hwnd, items) {
		var r = _makeVerticalList(hwnd);
		r.ht = HTMENU;
		var s = r.style;
		s.borderStyle = "outset";
		s.backgroundColor = GetSysColor(COLOR_MENU);
		s.borderColor = s.backgroundColor;
		s.color = GetSysColor(COLOR_MENUTEXT);
		for (var i = 0; i < items.length; i++) {
			(function(item){
				var li = _appendVerticalListItem(r, item.text, GetSysColor(COLOR_MENUTEXT), 12, 12, 2, 0);
				li.style.height = "22px";
				li.item = item;
				if (item.menu) {
					_attachWindowEventHandler(li, "mousedown", _onmenumousedown);
				} else {
					_attachWindowEventHandler(li, "click", _onmenuclick);
				}
				_attachWindowEventHandler(li, "mouseover", _onmenumouseenter);
				_attachWindowEventHandler(li, "mouseout", _onmenumouseleave);
			})(items[i]);
		}
		return r;
	}

/*  Doesn't appear to be being used.  Use _getNcParent.
	var _getTopLevelParent = function(win) {
		while (win && win._hwndParent) {
			win = _getWindow(win._hwndParent);
		}
		return win;
	}
*/
	var _getNcParent = function(win) {
		// Navigate up the window hierarchy and stop at the first window that has an non-client area.
		if (win._ncWidth>0 || win._ncHeight>0) {
			return win;
		}
		while (win && win._hwndParent) {
			if (win._ncWidth>0 || win._ncHeight>0) {
				return win;
			}
			win = _getWindow(win._hwndParent);
		}
		if (win._ncWidth>0 || win._ncHeight>0) {
			return win;
		}
	}
	
	var _setActiveMdiWindow = function(hwndMdiClient, hwndMdiChild) {
		if (!(hwndMdiClient && hwndMdiChild)) {
			return 0;
		}
		var winMdiClient = _getWindow(hwndMdiClient);
		var winMdiHost = _getNcParent(winMdiClient);
		var winPreviousActive = winMdiClient._activeWindow;
		var hwndPreviousActive = winPreviousActive?winPreviousActive.hwnd:0;
		if (hwndPreviousActive == hwndMdiChild) {
			return 0;
		}
		var r = 0;
		if (hwndPreviousActive) {
			SendMessage(hwndPreviousActive, WM_MDIACTIVATE, hwndPreviousActive, hwndMdiChild);
		}
		if (hwndMdiChild) {
			SendMessage(hwndMdiChild, WM_MDIACTIVATE, hwndPreviousActive, hwndMdiChild);
			winMdiClient._activeWindow = _getWindow(hwndMdiChild);
		} else {
			winMdiClient._activeWindow = null;
		}
		// TODO: Check if we're sending this message in the right order or whether WM_NCACTIVATE should be sent before WM_MDIACTIVATE.
		if (_GlobalActiveWindow && _GlobalActiveWindow === winMdiHost) {
			if (hwndPreviousActive) {
				SendMessage(hwndPreviousActive, WM_NCACTIVATE, WA_INACTIVE, 0);
			}
			if (hwndMdiChild) {
				SendMessage(hwndMdiChild, WM_NCACTIVATE, WA_ACTIVE, 0);
			}
		}
		return 0;
	}

	var _getActiveMdiWindow = function(hwndMdiClient){
		var win = _getWindow(hwndMdiClient);
		return win._activeWindow;
	}
	
	var _isMdiChild = function(win) {
		var winParent = _getParent(win);
		if (!(winParent && winParent._class)) {
			return false;
		}
		return (winParent._class.lpszClassName == "MDIClient");
	}

	var _setActiveWindow = function(hwnd, isClick) {
		// Called from onmousedown (via _setActiveWindow), onmenumousedown, and ShowWindow (via SetActiveWindow).
		if (!hwnd) {
			return 0;
		}
		var win = _getWindow(hwnd);
		if (_isMdiChild(win)) {
			_setActiveMdiWindow(win._hwndParent, hwnd);
			var winMdiClient = _getWindow(win._hwndParent);
			var winMdiHost = _getNcParent(winMdiClient);
			return _setActiveWindow(winMdiHost.hwnd, isClick);
		}	
		var r;
		var hwndPreviousActive = GetActiveWindow();
		if (hwndPreviousActive == hwnd && !!_GlobalActiveWindow) {
			return hwnd;
		}
		if (hwndPreviousActive != hwnd) {
			r = SendMessage(hwndPreviousActive, WM_ACTIVATE, WA_INACTIVE, hwnd);
			if (r) {
				return 0;
			}
		}
		var wParam = WA_ACTIVE;
		if (isClick) {
			wParam = WA_CLICKACTIVE;
		}
		r = SendMessage(hwnd, WM_ACTIVATE, wParam, hwndPreviousActive);
		if (r) {
			return 0;
		}
		return hwndPreviousActive;
	}
	
	var SetActiveWindow = function(hWnd) {
		return _setActiveWindow(hWnd, false);
	}

	var _mdiClientWinProc = function(hWnd, Msg, wParam, lParam) {
		switch (Msg) {
			case WM_MDIACTIVATE:
				var r = _setActiveMdiWindow(hWnd, wParam);
			case WM_MDIGETACTIVE:
				return _getActiveMdiWindow(hWnd);
			case WM_ACTIVATE:
				// TODO send WM_NCACTIVATE to active child window.
				var winActiveMdiChild = _getActiveMdiWindow(hWnd);
				if (winActiveMdiChild) {
					SendMessage(winActiveMdiChild.hwnd, WM_NCACTIVATE, wParam, 0);
				}
		}

		return DefWindowProc(hWnd, Msg, wParam, lParam);
	}
	
	var _registerPopupMenuWinClass = function() {
		var PopupWindowClass = new WNDCLASS();
		PopupWindowClass.style = WS_POPUP;
		PopupWindowClass.lpfnWndProc = _popupMenuWinProc;
		PopupWindowClass.cbClsExtra = 0;
		PopupWindowClass.cbWndExtra = 0;
		PopupWindowClass.hInstance = 0;
		PopupWindowClass.hIcon = "";
		PopupWindowClass.hCursor = "";
		PopupWindowClass.hbrBackground = 1 + COLOR_BTNFACE;
		PopupWindowClass.lpszMenuName = "";
		PopupWindowClass.lpszClassName = "_popupMenu";
		RegisterClass(PopupWindowClass);
	}
	
	var _registerMDIClientWinClass = function() {
		var PopupWindowClass = new WNDCLASS();
		PopupWindowClass.style = WS_CHILD;
		PopupWindowClass.lpfnWndProc = _mdiClientWinProc;
		PopupWindowClass.cbClsExtra = 0;
		PopupWindowClass.cbWndExtra = 0;
		PopupWindowClass.hInstance = 0;
		PopupWindowClass.hIcon = "";
		PopupWindowClass.hCursor = "";
		PopupWindowClass.hbrBackground = 1 + COLOR_APPWORKSPACE;
		PopupWindowClass.lpszMenuName = "";
		PopupWindowClass.lpszClassName = "MDIClient";
		RegisterClass(PopupWindowClass);
	}
	
	var _registerStandardWinClasses = function() {
		_registerPopupMenuWinClass();
		_registerSystemMessageBoxClass();
		_registerMDIClientWinClass();
	}
	
	var _onmouseup = function(e) {
		var win = _getWindowFromEventArgs(e);
		if (_hwndWindowBeingDragged) {
			win = _getWindow(_hwndWindowBeingDragged);
		}
		_hwndWindowBeingDragged = 0;
		document.body.style.cursor = _GlobalCursorBeforeDrag;
		_DragMode = HTNOWHERE;
		if (_GlobalActiveButton && win!==_GlobalActiveButton) {
			var s = _GlobalActiveButton.style;
			s.borderStyle = "outset";
			_GlobalActiveButton = null; // If win is _GlobalActiveButton, _GlobalActiveButton will be outset in _buttonWinProc.
		}
		// TODO: We currently don't allow window implementors to eat the WM_LBUTTONDOWN message before doing the above.  Why would anyone want to do that?
		if (win) {
			SendMessage(win.hwnd, WM_LBUTTONUP, 0, 0)
		}
	}
	
	var _onmousemove = function(e) {
		if (!e) {
			e = window.event; // IE
			e.cancelBubble = true;
		}
		else {
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			e.preventDefault();
		}
		
		if (_hwndWindowBeingDragged) {
			var win = _getWindow(_hwndWindowBeingDragged);
			if (win) {
				var dX = e.clientX - _MousePreviousPositionX;
				var dY = e.clientY - _MousePreviousPositionY;
				switch (_DragMode) {
					case HTCAPTION:
						var newX1 = parseInt(win.style.left) + dX;
						var newY1 = parseInt(win.style.top) + dY;
						if (newY1>=16-win._ncHeight){ // Arbitrary test to prevent dragging window above top of parent's client area.  TODO: prevent dragging off any of the other three edges.
							_moveWindow(win, newX1, newY1);
						}
						break;
					case HTBOTTOMRIGHT:
						document.body.style.cursor = "se-resize";
						var newX1 = parseInt(win.clientArea.style.width) + dX;
						var newY1 = parseInt(win.clientArea.style.height) + dY;
						if (newY1 > 0 || newX1 > win._ncControlsWidth - win._ncWidth) {
							_sizeWindowClient(win, SIZE_RESTORED, newX1, newY1);
						}
						break;
					case HTRIGHT:
						document.body.style.cursor = "e-resize";
						var newX1 = parseInt(win.clientArea.style.width) + dX;
						var newY1 = parseInt(win.clientArea.style.height);
						if (newX1 > win._ncControlsWidth - win._ncWidth) {
							_sizeWindowClient(win, SIZE_RESTORED, newX1, newY1);
						}
						break;
					case HTBOTTOM:
						document.body.style.cursor = "s-resize";
						var newX1 = parseInt(win.clientArea.style.width);
						var newY1 = parseInt(win.clientArea.style.height) + dY;
						if (newY1 > 0) {
							_sizeWindowClient(win, SIZE_RESTORED, newX1, newY1);
						}
						break;
				}
			}
			_MousePreviousPositionX = e.clientX;
			_MousePreviousPositionY = e.clientY;
		}
	}
	
	var _attachWindowEventHandler = function(win, eventName, eventHandler) {
		if (win.addEventListener) { // DOM Level 2 Event model
			win.addEventListener(eventName, eventHandler, false);
			if (win.clientArea) {
				win.clientArea.addEventListener(eventName, eventHandler, false);
			}
		} else {
			if (win.attachEvent) { // IE 5+ Event model
				win.attachEvent("on" + eventName, eventHandler);
			}
			else { // IE 4 Event model
				win["on" + eventName] = eventHandler;
			}
		}
	}
	
	var _attachBrowserEventHandler = function(eventName, eventHandler) {
		document["on" + eventName] = eventHandler;
	}

	var _onkeydown = function(e) {
		var win = _getWindowFromEventArgs(e);
		var ht = _getHitTestFromEventArgs(e);
		if (!win || !win.hwnd) {
			return true;
		}
		if (ht == HTMENU) {
			//return _onmenukeydown(e);
		}
		if (SendMessage(win.hwnd, WM_KEYDOWN, e.keyCode, 0)) {
			return true;
		} else {
			if (e.preventDefault) {
				e.preventDefault();
			}
			return false;
		}
	}
  
	var _onmousedown = function(e) {
		var win = _getWindowFromEventArgs(e);
		var ht = _getHitTestFromEventArgs(e);
		if (!win || !win.hwnd) {
			return true;
		}
		if (ht == HTMENU) {
			return _onmenumousedown(e);
		}
		var winActive = _getNcParent(win);
		var hwndActive = winActive ? winActive.hwnd : 0;
		_MousePreviousPositionX = e.clientX;
		_MousePreviousPositionY = e.clientY;
		if (!win._isPopup) {
			_exitMenuLoop();
			_setActiveWindow(hwndActive, true);
			if (ht == HTCAPTION || ht == HTBOTTOM || ht == HTLEFT || ht == HTRIGHT || ht == HTBOTTOMLEFT || ht == HTBOTTOMRIGHT || ht == HTTOPLEFT || ht == HTTOPRIGHT || ht == HTTOP) {
				_hwndWindowBeingDragged = hwndActive;
				_GlobalCursorBeforeDrag = document.body.style.cursor;
				_DragMode = ht;
			}
		}
		_attachBrowserEventHandler("mousemove", _onmousemove);
		_attachBrowserEventHandler("mouseup", _onmouseup);
		
		if (ht == HTCLIENT) {
			if (SendMessage(win.hwnd, WM_LBUTTONDOWN, 0, 0)) {
				return true;
			} else {
				if (e.preventDefault) {
					e.preventDefault();
				}
				return false;
			}			
		}
		
		if (e.preventDefault) {
			e.preventDefault();
		}
		
		return false;
	}
	
	var _nextWindow = function() {
		// This function is called when the currently active window is closed.
		// This function returns the next available window for activation.
		if (_GlobalWindowCount > 1 && _GlobalWindowsInZOrder.length > 1) {
			var winNextActive = null;
			var i = _GlobalWindowCount - 2;
			while (i >= 0 && !winNextActive) {
				var candidate = _GlobalWindowsInZOrder[i];
				if (candidate && candidate.hwnd && candidate.style.display != "none" && !candidate._isPopup) {
					return candidate;
				}
				i--;
			}
		}
		return null;
	}
	
	var _reallyDestroyWindow = function(win) {
		var z = parseInt(win.style.zIndex);
		var wasActiveWindow = false;
		var winNextActive = _GlobalActiveWindow;
		if (_GlobalActiveWindow === win) {
			wasActiveWindow = true;
			winNextActive = _nextWindow();
			if (winNextActive) {
				SendMessage(win.hwnd, WM_ACTIVATE, WA_INACTIVE, winNextActive.hwnd);
			}
		}
		win.parentNode.removeChild(win);
		win.hwnd = null;
		_GlobalWindowsInZOrder.splice(z - 1, 1);
		_GlobalWindowCount--;
		for (var i = z - 1; i < _GlobalWindowCount; i++) {
			var w = _GlobalWindowsInZOrder[i];
			w.style.zIndex = i;
			_GlobalWindowsInZOrder[i - 1] = w;
		}
		if (winNextActive) {
			if (winNextActive != _GlobalActiveWindow) {
				SendMessage(winNextActive.hwnd, WM_ACTIVATE, WA_ACTIVE, win.hwnd);
			}
		}
		else {
			_GlobalActiveWindow = null;
		}
		return 0;
	}
	
	var _destroyWindow = function(win) {
		return SendMessage(win.hwnd, WM_DESTROY, 0, 0);
	}
	
	var _closeWindow = function(win) {
		if (win && win.hwnd) {
			return SendMessage(win.hwnd, WM_CLOSE, 0, 0);
		}
	}
	
	var _showWindow = function(win, nCmdShow) {
		switch (nCmdShow) {
			case SW_HIDE:
				win.style.display = "none";
				break;
			case SW_MINIMIZE:
				alert("minimize");
				win._isMinimized = true;
				win._isMaximized = false;
				break;
			case SW_MAXIMIZE:
				win._isMaximized = true;
				win._isMinimized = false;
				var clientArea = win.clientArea;
				clientArea.parentNode.removeChild(clientArea);
				win.parentNode.appendChild(clientArea);
				clientArea.style.position = "absolute";
				clientArea.style.top = "0px";
				clientArea.style.left = "0px";
				clientArea.style.width = "100%";
				clientArea.style.height = "100%";
				clientArea.style.zIndex = win.style.zIndex;
				win.style.display = "none";
				break;
			case SW_SHOW:
				SetActiveWindow(win.hwnd);
				win.style.display = "block";
				break;
			case SW_SHOWNOACTIVATE:
				win.style.zIndex = 100;
				win.style.display = "block";
				break;
		}
	}
	
	ShowWindow = function(hWnd, nCmdShow) {
		var win = _getWindow(hWnd);
		return _showWindow(win, nCmdShow);
	}
	
	var _onclick = function(e) {
		var win = _getWindowFromEventArgs(e);
		var ht = _getHitTestFromEventArgs(e);
		if (!win || !win.hwnd) {
			return true;
		}
		switch (ht) {
			case HTCLOSE:
				_closeWindow(win);
				break;
			case HTMINBUTTON:
				if (!win._isMinimized) {
					return _showWindow(win, SW_MINIMIZE);
				}
				break;
			case HTMAXBUTTON:
				if (!win._isMaximized) {
					return _showWindow(win, SW_MAXIMIZE);
				}
				break;
		}
	
		return false;
	}
	
	var _menuItem = function(flags, id, item) {
		this.flags = flags;
		this.text = item;
		if (_isSet(MF_POPUP, flags)) {
			this.id = 0;
			this.hMenu = id;
			this.menu = _getMenu(id);
		}
		else {
			this.id = id;
			this.hMenu = 0;
			this.menu = null;
		}
	}
	
	var _appendMenuItem = function(menu, uFlags, uIDNewItem, lpNewItem) {
		var r = new _menuItem(uFlags, uIDNewItem, lpNewItem);
		menu.append(r);
		return r;
	}
	
	AppendMenu = function(hMenu, uFlags, uIDNewItem, lpNewItem) {
		var menu = _getMenu(hMenu);
		if (menu) {
			_appendMenuItem(menu, uFlags, uIDNewItem, lpNewItem);
		}
		
		return 1;
	}
	
	var _createMenu = function() {
		return {
			items: [],
			numItems: 0,
			append: function(item){
				this.items[this.numItems] = item;
				this.numItems++;
			}
		}
	}
	
	var _getMenuItemPosition = function(hMenu, uPosition, uFlags) {
		if (_isSet(MF_BYPOSITION, uFlags)) {
			return uPosition;
		} else {
			var menu = _getMenu(hMenu);
			for (i=0; i!=menu.numItems; i++) {
				if (menu.items[i].hMenu == hMenu) {
					return i;
				}
			}
		}
		return -1;
	}

	RemoveMenu = function(hMenu, uPosition, uFlags) {
		var i = _getMenuItemPosition(hMenu, uPosition, uFlags);
		if (i<0) {
			return false;
		}
		var menu = _getMenu(hMenu);
		menu.items.splice(i, 1);
		menu.numItems--;
		return true;
	}

	CreateMenu = function() {
		var id = _GlobalMenuCount;
		var menu = _createMenu();
		_GlobalMenuCount++;
		menu.hMenu = _GlobalMenuCount;
		_GlobalMenuList[menu.hMenu] = menu;
		return menu.hMenu;
	}
	
	DestroyMenu = function(hMenu) {
		_GlobalMenuList[hMenu] = null;
		return true;
	}

	var _getMenuItem = function(hMenu, uPosition, uFlags) {
		var i = _getMenuItemPosition(hMenu, uPosition, uFlags);
		if (i<0) {
			return false;
		}
		var menu = _getMenu(hMenu);
		return menu.items[i];
	}

	DeleteMenu = function(hMenu, uPosition, uFlags) {
		var item = _getMenuItem(hMenu, uPosition, uFlags);
		RemoveMenu(hMenu, uPosition, uFlags);
		if (item.hMenu) {
			DestroyMenu(item.hMenu);
		}
	}

	ModifyMenu = function(hMenu, uPosition, uFlags, uIDNewItem, lpNewItem) {
		var item = _getMenuItem(hMenu, uPosition, uFlags);
		item.text = lpNewItem;
		var oldSubmenu = item.hMenu;
		var newSubmenu = (_isSet(MF_POPUP, uFlags))?uIDNewItem:0;
		if (oldSubmenu!=newSubmenu) {
			if (oldSubmenu) {
				DestroyMenu(oldSubmenu);
			}
			item.hMenu = newSubmenu;
		}
		return true;
	}
	
	var _setMenu = function(win, menu) {
		var SendResize = function(win){
			var nWidth = parseInt(win.clientArea.style.width);
			var nHeight = parseInt(win.clientArea.style.height);
			var lParam = nHeight * (0x10000) + nWidth;
			SendMessage(win.hwnd, WM_SIZE, SIZE_RESTORED, lParam);
		}
		var s = win.clientArea.style;
		if (!menu) {
			if (win._menu) {
				var newHeight = (parseInt(s.height) + 24) + "px";
				s.height = newHeight;
				if (win._middle) {
					win._middle.style.height = newHeight;
				}
				s.top = parseInt(s.top) - 21;
				win._ncHeight -= 21;
				SendResize(win);
			}
			win._menuRow.style.display = "none";
			win._menu = null;
			return 1;
		}
		var insertBefore = win._menu;
		if (!insertBefore) {
			var newHeight = (parseInt(win.clientArea.style.height) - 24) + "px";
			s.height = newHeight;
			if (win._middle) {
				win._middle.style.height = newHeight;
			}
			s.top = parseInt(s.top) + 21;
			win._ncHeight += 21;
			SendResize(win);
		}
		win._menuDiv.appendChild(_renderHorizontalMenuItems(win.hwnd, menu.items));
		win._menuRow.style.display = "";
		return 1;
	}
	
	SetMenu = function(hWnd, hMenu) {
		var win = _getWindow(hWnd);
		var menu = _getMenu(hMenu);
		if (win) {
			return _setMenu(win, menu);
		}
		return 0;
	}
	
	DestroyWindow = function(hwnd) {
		var win = _getWindow(hwnd);
		return _destroyWindow(win);
	}
	
	var _DefaultWindowProc_Overlapped = function(hwnd, uMsg, wParam, lParam) {
		var win = _getWindow(hwnd);
		
		switch (uMsg) {
			case WM_ACTIVATE:
				if (_isMdiChild(win)) {
					return 0;
				}
				if (wParam) {
					return _activateWindow(win);
				}
				return _deactivateWindow(win);
			case WM_MDIACTIVATE:
				if (!_isMdiChild(win)) {
					return 0;
				}
				if (lParam==hwnd) {
					// We're the window being activated.
					return _activateMdiWindow(win);
				}
				break;
			case WM_CLOSE:
				if (win._hwndParent)
				{
					SendMessage(win._hwndParent, WM_COMMAND, MAKEWPARAM(win._hMenu, WM_CLOSE), win.hwnd);
				}
				_destroyWindow(win);
				break;
			case WM_CREATE:
				break;
			case WM_DESTROY:
				_reallyDestroyWindow(win);
				break;
			case WM_GETMINMAXINFO:
				break;
			case WM_LBUTTONDOWN:
				break;
			case WM_LBUTTONUP:
				break;
			case WM_MOVE:
				break;
			case WM_MOUSELEAVE:
				break;
			case WM_MOUSEMOVE:
				break;
			case WM_NCACTIVATE:
				if (_isMdiChild(win)) {
					if (wParam) {
						return _ncMdiActivateWindow(win);
					}
					return _ncMdiDeactivateWindow(win);
				}
				if (wParam) {
					return _ncActivateWindow(win);
				}
				return _ncDeactivateWindow(win);
				break;
			case WM_NCLBUTTONDOWN:
				break;
			case WM_NCLBUTTONUP:
				break;
			case WM_SETTEXT:
				if (win.caption) {
					win.caption.nodeValue = lParam; 
				}
				break;
			case WM_SIZING:
				break;
			case WM_SIZE:
				break;
		}
		
		return 0;
	}
	
	var _DefaultWindowProc_Popup = function(hwnd, uMsg, wParam, lParam) {
		return _DefaultWindowProc_Overlapped(hwnd, uMsg, wParam, lParam);
	}
	
	var _applyTheme = function(win, theme, active) {
		if (win._isPopup) {
			return;
		}
		var themestate;
		var tbody = win.table.childNodes[0];
		var caption = tbody.childNodes[0].childNodes[3].childNodes[0];
		if (active) {
			_GlobalActiveWindow = win;
			themestate = theme.active;
			caption.style.color = GetSysColor(COLOR_CAPTIONTEXT);
		}
		else {
			themestate = theme.inactive;
			caption.style.color = GetSysColor(COLOR_INACTIVECAPTIONTEXT);
		}
		var iNumRows = tbody.childNodes.length;
		var bottomRow = tbody.childNodes[iNumRows - 1];
		tbody.childNodes[0].childNodes[0].childNodes[0].src = themeRoot + themestate.nc_border_top_left_0;
		tbody.childNodes[0].childNodes[1].childNodes[0].src = themeRoot + themestate.nc_border_top_left_1;
		tbody.childNodes[0].childNodes[2].style.background = "url(" + themeRoot + themestate.nc_border_top + ")";
		tbody.childNodes[0].childNodes[3].style.background = "url(" + themeRoot + themestate.nc_border_top + ")";
		tbody.childNodes[0].childNodes[4].style.background = "url(" + themeRoot + themestate.nc_border_top + ")";
		tbody.childNodes[0].childNodes[4].childNodes[0].childNodes[0].src = themeRoot + themestate.nc_button_min;
		tbody.childNodes[0].childNodes[4].childNodes[0].childNodes[1].src = themeRoot + themestate.nc_button_max;
		tbody.childNodes[0].childNodes[4].childNodes[0].childNodes[2].src = themeRoot + themestate.nc_button_close;
		tbody.childNodes[0].childNodes[5].childNodes[0].src = themeRoot + themestate.nc_border_top_right_1;
		tbody.childNodes[0].childNodes[6].childNodes[0].src = themeRoot + themestate.nc_border_top_right_0;
		for (var i = 1; i < iNumRows; i++) {
			tbody.childNodes[i].childNodes[0].style.background = "url(" + themeRoot + themestate.nc_border_left + ")";
			tbody.childNodes[i].childNodes[2].style.background = "url(" + themeRoot + themestate.nc_border_right + ")";
		}
		bottomRow.childNodes[0].childNodes[0].src = themeRoot + themestate.nc_border_bottom_left;
		bottomRow.childNodes[1].style.background = "url(" + themeRoot + themestate.nc_border_bottom + ")";
		bottomRow.childNodes[2].childNodes[0].src = themeRoot + themestate.nc_border_bottom_right;
		if (win._menuDiv) {
			//win._menuDiv.style.background = "url("+themeRoot+themestate.nc_menu+")";
			//win._menuDiv.style.fontFamily = "sans-serif";
			//win._menuDiv.style.font = "10pt Tahoma";
		}
	}
    
	LOGBRUSH = function() {
		this.lbStyle = BS_SOLID;
		this.lbColor = "black";
		this.lbHatch = 0; 
	}

	LOGPEN = function() {
		this.lopnStyle = PS_SOLID;
		this.lopnWidth = 1;
		this.lopnColor = "black";
	}

	CreatePen = function(fnPenStyle, nWidth, crColor) {
		var r = _hNextGdiObject;
		_hNextGdiObject++;
		var pen = new LOGPEN();
		pen.lopnStyle = fnPenStyle;
		pen.lopnWidth = nWidth;
		pen.lopnColor = crColor;
		_GlobalGdiObjectList[r] = pen;
		return r;
	}

	CreateBrushIndirect = function(lplb) {
		var r = _hNextGdiObject;
		_hNextGdiObject++;
		_GlobalGdiObjectList[r] = lplb;
		return r;
	}

	CreateSolidBrush = function(crColor) {
		var brush = new LOGBRUSH();
		brush.lbStyle = BS_SOLID;
		brush.lbColor = crColor;
		return CreateBrushIndirect(brush);
	}
  
	var _initStockObjects = function() {
		_StockObjects[WHITE_BRUSH] = CreateSolidBrush("white");
		_StockObjects[GRAY_BRUSH] = CreateSolidBrush("gray");
		_StockObjects[BLACK_BRUSH] = CreateSolidBrush("black");
		_StockObjects[WHITE_PEN] = CreatePen("white");
		_StockObjects[BLACK_PEN] = CreatePen("black");
		
		var nullBrush = new LOGBRUSH();
		nullBrush.lbStyle = BS_NULL;
		_StockObjects[NULL_BRUSH] = CreateBrushIndirect(nullBrush);
		
		var nullPen = new LOGPEN();
		nullPen.lopnStyle = PS_NULL;
		_StockObjects[NULL_PEN] = _hNextGdiObject;
		_hNextGdiObject++;    
	}
  
	GetStockObject = function(fnObject) {
		return _StockObjects[fnObject];
	}
	
	WNDCLASS = function() {
		this.style = 0;
		this.lpfnWndProc = _DefaultWindowProc_Overlapped;
		this.cbClsExtra = 0;
		this.cbWndExtra = 0;
		this.hInstance = 0;
		this.hIcon = "";
		this.hCursor = "";
		this.hbrBackground = 0;
		this.lpszMenuName = "";
		this.lpszClassName = "";
	}
	
	CREATESTRUCT = function() {
		this.lpCreateParams = 0;
		this.hInstance = 0;
		this.hMenu = 0;
		this.hwndParent = 0;
		this.cy = 0;
		this.cx = 0;
		this.y = 0;
		this.x = 0;
		this.style = 0;
		this.lpszName = "";
		this.lpszClass = "";
		this.dwExStyle = 0;
	}

    var _makeUnselectable = function(element) {
		element.onselectstart = _dontEven; // Partly fixes issue in IE, but caption is still selectable if selection starts in another element.
		element.onselect = _dontEven; // Partly fixes issue in IE, but caption is still selectable if selection starts in another element.
		element.setAttribute('unselectable', 'on', 0);		
	}
	
	CreateWindow = function(lpClassName, lpWindowName, dwStyle, x, y, nWidth, nHeight, hWndParent, hMenu, hInstance, lpParam) {
		var createStruct = new CREATESTRUCT(); // TODO: Currently we only populate some properties below.
		createStruct.hMenu = hMenu;
		createStruct.hwndParent = hWndParent;
		createStruct.lpszClass = lpClassName;
		return CreateWindowEx(0, lpClassName, lpWindowName, dwStyle, x, y, nWidth, nHeight, hWndParent, hMenu, hInstance, lpParam);
	}
	
	CreateWindowEx = function(dwExStyle, lpClassName, lpWindowName, dwStyle, x, y, nWidth, nHeight, hWndParent, hMenu, hInstance, lpParam) {
		// lpParam should be a CREATESTRUCT.
		var theme = _GlobalTheme.inactive;
		var hwnd = _hwndNextWindow;
		_hwndNextWindow++;
		var appendChild = function(x, y, ht) {
			if (y.nodeType != 3 && ht) {
				y.hwnd = hwnd;
				y.ht = ht;
			}
			return x.appendChild(y);
		};
		var createMiddleRow = function(win, content, ht) {
			var r = createElement("tr");
			var nc_border_left = createElement("td");
			nc_border_left.style.width = 4;
			nc_border_left.style.cursor = "w-resize";
			nc_border_left.style.background = "url(" + themeRoot + theme.nc_border_left + ")";
			var clientCell = createElement("td");
			var s = clientCell.style;
			s.width = nWidth - win._ncWidth;
			if (ht==HTCLIENT) {
				//s.height = nHeight - win._ncHeight;
			} else { // HTMENU
			}
			clientCell.colSpan = 5;
			s.backgroundColor = backgroundColor;
			s.color = GetSysColor(COLOR_WINDOWTEXT);
			s.verticalAlign = "top";
			s.overflow = "hidden";
			//s.whiteSpace = "nowrap";
			appendChild(clientCell, content, ht);
			var nc_border_right = createElement("td");
			nc_border_right.style.width = 4;
			nc_border_right.style.cursor = "e-resize";
			nc_border_right.style.background = "url(" + themeRoot + theme.nc_border_right + ")";
			appendChild(r, nc_border_left, HTLEFT);
			appendChild(r, clientCell, HTCLIENT);
			appendChild(r, nc_border_right, HTRIGHT);
			return r;
		}
	
		var hWndMessageParent = hWndParent;
		var win = createElement("div");
		win.className = lpClassName;
		
		var hasBorder = true; // hasBorder refers to non-client border.
		var wsPopUp = WS_POPUP; // Workaround for odd problem.
		if ((wsPopUp & WS_POPUP) == (dwStyle & WS_POPUP)) {
			win._isPopup = true;
			hasBorder = false;
			hWndParent = 0;
		} else if (_isSet(WS_CHILD, dwStyle)) {
			if (!_isSet(WS_THICKFRAME, dwStyle)) {
				hasBorder = false;
			}
		} else if (!_isSet(WS_THICKFRAME, dwStyle)) {
			hasBorder = false;
		}		
		win._hasBorder = hasBorder;
        var hasSolidBorder = !hasBorder && _isSet(WS_BORDER, dwStyle) && !_isSet(WS_EX_CLIENTEDGE, dwExStyle); // hasSolidBorder refers to 1px border.
		
		var winParent = _getWindow(hWndParent);

		var s = win.style;
		s.color = GetSysColor(COLOR_WINDOWTEXT);
		s.position = "absolute";
		s.display = "none";
		var clientBorderAllowance = (_isSet(WS_EX_DLGMODALFRAME, dwExStyle) || _isSet(WS_EX_CLIENTEDGE, dwExStyle))?4:(hasSolidBorder?1:0);
		var borderAllowance = hasBorder?0:clientBorderAllowance;
		win._clientBorder = clientBorderAllowance;
        if (document.defaultView) { // Using non-ie property "document.defaultView"
			win._bsClientBorder = clientBorderAllowance;
			win._pixelHack = 0;
		} else {
			win._bsClientBorder = 0;
			win._pixelHack = 1;
		}
		if (nWidth != "auto") {
			s.width = nWidth - borderAllowance;			
		}
		if (nHeight != "auto") {
			s.height = nHeight - borderAllowance;
		}
		//if (document.defaultView && winParent._ncHeight) { // Using non-ie property "document.defaultView".
			//var parentCaptionHeight = winParent._ncHeight - (winParent._ncWidth/2);
			//s.top = y + parentCaptionHeight;
			//s.left = x + winParent._ncWidth/2;
		//} else {
        	//s.top = y;
			//s.left = x;
		//}
		s.top = y;
		s.left = x;
		s.zIndex = _GlobalWindowCount + 1;
		var winclass = _getClass(lpClassName);
		// TODO: Should fail if !winclass.
		win._class = winclass;
		win._lpfnWndProc = winclass.lpfnWndProc;
		win.hwnd = hwnd;
		win._dwStyle = dwStyle;
		
		var backgroundColor = GetSysColor(COLOR_WINDOW);
		if (winclass.hbrBackground != 0) {
			if (winclass.hbrBackground <= 32) {
				backgroundColor = GetSysColor(winclass.hbrBackground - 1);
			} else {
				var brush = _getGdiObject(winclass.hbrBackground);
				backgroundColor = brush.lbColor;
			}
		}
		
		if (hasBorder) {
			win._ncHeight = 34;
			win._ncWidth = 8;
			win._ncControlsWidth = 94; // Width of left & right borders + nc buttons + app icon.
			var winTable = _createTable(nWidth);
			winTable.style.tableLayout = "fixed";
			var winTitleBar = createElement("tr");
			winTitleBar.style.height = 30;
			
			var nc_border_top_left_0 = createElement("td");
			nc_border_top_left_0.style.width = 4;
			nc_border_top_left_0.style.height = 30;
			appendChild(nc_border_top_left_0, _createImg(themeRoot + theme.nc_border_top_left_0, 4, 30), HTTOPLEFT);
			
			var nc_border_top_left_1 = createElement("td");
			nc_border_top_left_1.style.width = 4;
			nc_border_top_left_1.style.height = 30;
			appendChild(nc_border_top_left_1, _createImg(themeRoot + theme.nc_border_top_left_1, 4, 30), HTCAPTION);
			
			var nc_border_top_left_2 = createElement("td");
			nc_border_top_left_2.style.width = "18px";
			nc_border_top_left_2.style.height = "30px";
			nc_border_top_left_2.style.background = "url(" + themeRoot + theme.nc_border_top + ")";
			//nc_border_top_left_2.appendChild(_createImg("ApplicationIcon.gif", 15, 16));
			
			var nc_border_top_0 = createElement("td");
			nc_border_top_0.style.height = 30;
			nc_border_top_0.style.background = "url(" + themeRoot + theme.nc_border_top + ")";
			
			var nc_caption = createElement("div");
			var nc_caption_style = nc_caption.style;
			nc_caption_style.overflow = "hidden"; // Hiding overflow and setting height works in ie but not firefox.
			nc_caption_style.height = 18;
			nc_caption_style.color = GetSysColor(COLOR_CAPTIONTEXT);
			nc_caption_style.fontFamily = "sans-serif";
			nc_caption_style.font = "10pt Trebuchet MS";
			nc_caption_style.fontWeight = "bold";
			nc_caption_style.cursor = "default";
			document.body.onselectstart = _onlyForInput;
			var caption = _createTextNode(lpWindowName);
			appendChild(nc_caption, caption, HTCAPTION);
			appendChild(nc_border_top_0, nc_caption, HTCAPTION);
			_makeUnselectable(nc_caption);
			win.caption = caption;
			
			var nc_border_top_1 = createElement("td");
			nc_border_top_1.vAlign = "middle";
			nc_border_top_1.align = "right";
			nc_border_top_1.style.width = 63;
			nc_border_top_1.style.height = 30;
			nc_border_top_1.style.background = "url(" + themeRoot + theme.nc_border_top + ")";
			
			var nc_min_max_close = createElement("div");
			nc_min_max_close.style.align = "right";
			nc_min_max_close.style.width = 63;
			appendChild(nc_min_max_close, _createImg(themeRoot + theme.nc_button_min, 21, 24), HTMINBUTTON);
			appendChild(nc_min_max_close, _createImg(themeRoot + theme.nc_button_max, 21, 24), HTMAXBUTTON);
			appendChild(nc_min_max_close, _createImg(themeRoot + theme.nc_button_close, 21, 24), HTCLOSE);
			appendChild(nc_border_top_1, nc_min_max_close, HTCAPTION);
			
			var nc_border_top_right_1 = createElement("td");
			nc_border_top_right_1.style.width = 2;
			nc_border_top_right_1.style.height = 30;
			appendChild(nc_border_top_right_1, _createImg(themeRoot + theme.nc_border_top_right_1, 2, 30), HTCAPTION);
			
			var nc_border_top_right_0 = createElement("td");
			nc_border_top_right_0.style.width = 4;
			nc_border_top_right_0.style.height = 30;
			appendChild(nc_border_top_right_0, _createImg(themeRoot + theme.nc_border_top_right_0, 4, 30), HTTOPRIGHT);
			
			appendChild(winTitleBar, nc_border_top_left_0, HTCAPTION);
			appendChild(winTitleBar, nc_border_top_left_1, HTCAPTION);
			appendChild(winTitleBar, nc_border_top_left_2, HTCAPTION);
			appendChild(winTitleBar, nc_border_top_0, HTCAPTION);
			appendChild(winTitleBar, nc_border_top_1, HTCAPTION);
			appendChild(winTitleBar, nc_border_top_right_1, HTCAPTION);
			appendChild(winTitleBar, nc_border_top_right_0, HTCAPTION);
			
			var menuDiv = createElement("div");
			var menuDiv_style = menuDiv.style;
			menuDiv_style.padding = 0;
			menuDiv_style.margin = 0;
			menuDiv_style.overflow = "hidden";
			menuDiv_style.display = "block";
			menuDiv_style.height = 22;
			
			var menuRow = createMiddleRow(win, menuDiv, HTMENU);
			menuRow.style.display = "none";
			
			var clientArea = createElement("div");
			s = clientArea.style;
			s.display = "block";
			s.backgroundColor = backgroundColor;
			s.color = GetSysColor(COLOR_WINDOWTEXT);
			s.verticalAlign = "top";
			s.position = "absolute";
			s.top = win._ncHeight + (clientBorderAllowance-win._ncWidth)/2;
			s.left = (win._ncWidth + clientBorderAllowance)/2;
			s.height = nHeight - win._ncHeight - clientBorderAllowance;
			s.width = nWidth - win._ncWidth - clientBorderAllowance;
			s.overflow = "hidden";
			var winMiddle = createMiddleRow(win, clientArea, HTCLIENT);
			winMiddle.style.height = nHeight - win._ncHeight;
			win._middle = winMiddle;
			
			var winBottom = createElement("tr");
			winBottom.style.height = 4;
			var nc_border_bottom_left = createElement("td");
			nc_border_bottom_left.style.width = 4;
			nc_border_bottom_left.style.height = 4;
			nc_border_bottom_left.style.cursor = "sw-resize";
			appendChild(nc_border_bottom_left, _createImg(themeRoot + theme.nc_border_bottom_left, 4, 4), HTBOTTOMLEFT);
			var nc_border_bottom = createElement("td");
			nc_border_bottom.style.height = 4;
			nc_border_bottom.colSpan = 5;
			nc_border_bottom.style.cursor = "s-resize";
			nc_border_bottom.style.background = "url(" + themeRoot + theme.nc_border_bottom + ")";
			var nc_border_bottom_right = createElement("td");
			nc_border_bottom_right.style.width = 4;
			nc_border_bottom_right.style.height = 4;
			nc_border_bottom_right.style.cursor = "se-resize";
			var nc_border_bottom_right_img = _createImg(themeRoot + theme.nc_border_bottom_right, 4, 4);
			nc_border_bottom_right_img.onselectstart = _dontEven;
			nc_border_bottom_right_img.onselect = _dontEven;
			nc_border_bottom_right_img.ondragstart = _dontEven;
			appendChild(nc_border_bottom_right, nc_border_bottom_right_img, HTBOTTOMRIGHT);
			appendChild(winBottom, nc_border_bottom_left, HTBOTTOMLEFT);
			appendChild(winBottom, nc_border_bottom, HTBOTTOM);
			appendChild(winBottom, nc_border_bottom_right, HTBOTTOMRIGHT);
			
			var tbody = createElement("tbody");
			appendChild(tbody, winTitleBar, HTNOWHERE);
			appendChild(tbody, menuRow, HTNOWHERE);
			appendChild(tbody, winMiddle, HTNOWHERE);
			appendChild(tbody, winBottom, HTNOWHERE);
			appendChild(winTable, tbody, HTNOWHERE);
			appendChild(win, winTable, HTNOWHERE);
			
			win._menuDiv = menuDiv;
			win._menuRow = menuRow;
			win.clientArea = clientArea;
			win.table = winTable;
			win._hMenu = null;
		} else { // !hasBorder
			win._ncHeight = 0;
			win._ncWidth = 0;
			win._ncControlsWidth = 0;
			
			if (lpClassName == "BUTTON") {
				// TODO: Should use registered window class, once RegisterWindowClassEx is implemented.
				s.backgroundColor = GetSysColor(COLOR_BTNFACE);
				s.align = "center";
				s.vAlign = "middle";
				s.textAlign = "center";
				s.borderWidth = 2;
				s.borderStyle = "outset";
				s.borderColor = GetSysColor(COLOR_BTNFACE);
				s.fontFamily = "sans-serif";
				s.cursor = "default";
				_makeUnselectable(win);
			} else {
				s.backgroundColor = backgroundColor;
			}
			win.clientArea = win;
			win.ht = HTCLIENT;
			s.overflow = "hidden";
			win.caption = win;
			if (lpWindowName && lpWindowName.length) {
				_appendTextNode(win, lpWindowName);
			}
			win._hMenu = hMenu;
		}
		
		win._lpWindowName = lpWindowName;
		win._menu = null;
		
		if (win.clientArea) {			
			var s = win.clientArea.style;
			if (_isSet(WS_EX_DLGMODALFRAME, dwExStyle)) {
				s.borderWidth = "2px";
				s.borderStyle = "outset";
				s.borderColor = GetSysColor(COLOR_BTNFACE);
			} else if (_isSet(WS_EX_CLIENTEDGE, dwExStyle)) {
				s.borderWidth = "2px";
				s.borderStyle = "inset";
				s.borderColor = GetSysColor(COLOR_BTNFACE);
			} else if (hasSolidBorder) {
				s.borderWidth = "1px";
				s.borderStyle = "solid";
				s.borderColor = "black";
			}
		}
		
		_attachWindowEventHandler(win, "mousedown", _onmousedown);
		_attachWindowEventHandler(win, "click", _onclick);
		_attachWindowEventHandler(win, "keydown", _onkeydown);
		
		_GlobalWindowList[hwnd] = win;
		_GlobalWindowsInZOrder[_GlobalWindowCount] = win;
		_GlobalWindowCount++;
		
		win._hwndParent = hWndMessageParent;
		if (winParent && winParent.clientArea) {
			appendChild(winParent.clientArea, win, HTNOWHERE);
		}
		else {
			winParent.style.overflow = "hidden"; // Just in case winParent is the root/desktop window.
			appendChild(winParent, win, HTNOWHERE);
		}
		
		if (!lpParam) {
			lpParam = new CREATESTRUCT();
		}
				
		lpParam.hMenu = hMenu;
		lpParam.hwndParent = hWndParent;
		lpParam.lpszClass = lpClassName;
		lpParam.style = dwStyle;
		SendMessage(hwnd, WM_CREATE, 0, lpParam);
		
		if (dwStyle & WS_VISIBLE) {
			_showWindow(win, SW_SHOW);
		}
		
		if (hMenu && hasBorder && hWndParent) {
			SetMenu(hwnd, hMenu);
		} else {
			var sizeType = SIZE_RESTORED; // TODO: Change this when we start handling maximized & minimized window states in CreateWindow.
			//var clientWidth = nWidth - win._ncWidth
			//var clientHeight = nHeight - win._ncHeight
			var clientWidth = parseInt(win.clientArea.style.width);
			var clientHeight = parseInt(win.clientArea.style.height);			
			var lParam = clientHeight * (0x10000) + clientWidth;
			SendMessage(hwnd, WM_SIZE, sizeType, lParam);
		}
		
		return hwnd;
	}
	
	var _showPopupMenu = function(hwnd, menu, x, y) {
		_closeAllPopupWindows();
		_enterMenuLoop();
		var hwndPopup = CreateWindow("_popupMenu", "", WS_POPUP, x, y, "auto", "auto", 0, 0, 0, 0);
		var winPopup = _getWindow(hwndPopup);
		var items = _renderVerticalMenuItems(hwnd, menu.items);
		winPopup.appendChild(items);
		ShowWindow(hwndPopup, SW_SHOWNOACTIVATE);
		
		// For IE, it is necessary to calculate the width of the widest menu item and resize the menu accordingly.
		var allowForPadding = false;
		var widest = 0;
		for (var i = 0; i < items.childNodes.length; i++) {
			var li = items.childNodes[i];
			var span = li.childNodes[0];
			if (span.offsetWidth > widest) {
				widest = span.offsetWidth;
			}
			var link = span.childNodes[0];
			if (link.offsetWidth > span.offsetWidth) {
				// User is probably running ie.
				allowForPadding = true;
			}
		}
		var padding = 0; // Firefox.
		if (allowForPadding) {
			padding = 24; // IE.
		}
		if (widest>0) { // In Chrome, widest==0, but the menu items will be the correct width already.
			items.style.width = widest + padding;
		
			// Resize each item to be the same width as the widest item.
			for (var i = 0; i < items.childNodes.length; i++) {
				var li = items.childNodes[i];
				var span = li.childNodes[0];
				var link = span.childNodes[0];
				li.style.width = (widest + padding) + "px";
			}
		}
	}
	
	ShowPopupMenu = function(hWnd, hMenu, x, y) {
		var menu = _getMenu(hMenu, x, y);
		return _showPopupMenu(hWnd, menu, x, y);
	}

    var _SystemMessageBoxWinProc = function(hWnd, Msg, wParam, lParam) {
		// We need an ID for each control on the dialog.
		// We'll use the control ID when we call CreateWindow, and later to find the control using GetDlgItem.
		var ID_OK = 1;
		var ID_CANCEL = 2;
		var buttonWidth = 80;
		var buttonHeight = 21;
		var buttonSpacing = 6;

        var win = _getWindow(hWnd);
        if (!win) {
            return 0;
        }
        switch (Msg) {
            case WM_CREATE:
	            // Create dialog controls.
	            // The 10th parameter of CreateWindowEx is a handle to the menu when creating a top level window, and the control's ID when creating a child window, which is what we are doing here.
				var dwStyle = WS_CHILD | WS_VISIBLE;
				var hwndOk = CreateWindowEx(0, "BUTTON", "", dwStyle, 60, 130, buttonWidth, buttonHeight, hWnd, ID_OK, 0, 0);
				SendMessage(hwndOk, WM_SETTEXT, 0, "OK");
                break;
            case WM_ACTIVATE:
                break;
            case WM_SIZE:
                var nWidth = LOWORD(lParam);
                var nHeight = HIWORD(lParam);
				var hwndOk = GetDlgItem(hWnd, ID_OK);
				var winOk = _getWindow(hwndOk);
				var winBorder = 4; // TODO: The win should know this value.
				_moveWindow(winOk, nWidth-buttonWidth-winBorder-buttonSpacing, nHeight-buttonHeight-winBorder-buttonSpacing);
                break;
			case WM_COMMAND:
				var wmId = LOWORD(wParam);
				var wmEvent = HIWORD(wParam);
				switch (wmEvent) {
					case WM_LBUTTONUP:
						switch (wmId) {
							case ID_OK:
								SendMessage(hWnd, WM_CLOSE, 0, 0);
								break;
							case ID_CANCEL:
								SendMessage(hWnd, WM_CLOSE, 0, 0);
								break;
						}
						break;
				}
				break;
		}
        return DefWindowProc(hWnd, Msg, wParam, lParam);
    }

	var _registerSystemMessageBoxClass = function() {
		var DlgClass = new WNDCLASS();
		//DlgClass.style = WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU;
		// TODO: Above line not working for some reason.  Message boxes shouldn't have min & maximize buttons.
		DlgClass.style = WS_OVERLAPPEDWINDOW;
		DlgClass.lpfnWndProc = _SystemMessageBoxWinProc;
		DlgClass.cbClsExtra = 0;
		DlgClass.cbWndExtra = 0;
		DlgClass.hInstance = 0;
		DlgClass.hIcon = "";
		DlgClass.hCursor = "";
		DlgClass.hbrBackground = 1+COLOR_BTNFACE;
		DlgClass.lpszMenuName = "";
		DlgClass.lpszClassName = "SystemMessageBox";
		RegisterClass(DlgClass);
	}
	
	var _createMessageBox = function(hwnd, lpText, lpCaption, uType) {
		lpCaption = lpCaption?lpCaption:"Error";
		hwnd = 0;
		//var dwStyle = WS_VISIBLE | WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU;
		var dwStyle = WS_VISIBLE | WS_OVERLAPPEDWINDOW;
		var hwndMessageBox = CreateWindow("SystemMessageBox", lpCaption, dwStyle, 100, 100, 200, 200, hwnd, 0, 0, 0);
		var win = _getWindow(hwndMessageBox);
		var ca = win.clientArea;
		ca.vAlign = "middle";
		ca.align = "center";
		_appendTextNode(ca, lpText);
		
		return hwndMessageBox;
	}
	
	MessageBox = function(hwnd, lpText, lpCaption, uType) {
		var hwndMessageBox = _createMessageBox(hwnd, lpText, lpCaption, uType);
	}

    
    // ***********************
    // File System
    // ***********************

    var _GlobalFindList = [];
    var _NextFindHandle = 0;

    MAX_PATH = 260;
    INVALID_HANDLE_VALUE = -1;

    FILE_ATTRIBUTE_READONLY = 0x00000001;  
    FILE_ATTRIBUTE_HIDDEN = 0x00000002; 
    FILE_ATTRIBUTE_SYSTEM = 0x00000004;
    FILE_ATTRIBUTE_DIRECTORY = 0x00000010; 
    FILE_ATTRIBUTE_ARCHIVE = 0x00000020; 
    FILE_ATTRIBUTE_DEVICE = 0x00000040; 
    FILE_ATTRIBUTE_NORMAL = 0x00000080; 
    FILE_ATTRIBUTE_TEMPORARY = 0x00000100; 

    WIN32_FIND_DATA = function() {
		var _that = this;
        _that.dwFileAttributes=0; 
        _that.ftCreationTime=0;
        _that.ftLastAccessTime=0; 
        _that.ftLastWriteTime=0; 
        _that.nFileSizeHigh=0; 
        _that.nFileSizeLow=0; 
        _that.dwReserved0=0; 
        _that.dwReserved1=0; 
        _that.cFileName = ""; // MAX_PATH chars. 
        _that.cAlternateFileName = ""; // 14 chars.      
    }

    //_SECURITY_ATTRIBUTES = function() {
    //  this.nLength = 12;
    //  this.lpSecurityDescriptor = null;
    //  this.bInheritHandle = false; 
    //};

	// Values for dwDesiredAccess parameter of CreategFile.
	GENERIC_READ = 0x80000000;
	GENERIC_WRITE = 0x40000000;
	
	// Values for dwShareMode parameter of CreateFile.
	FILE_SHARE_READ = 0x1;
	FILE_SHARE_WRITE = 0x2;
	
	// Values for dwCreationDisposition parameter of CreateFile.
	CREATE_NEW = 1;
	CREATE_ALWAYS = 2;
	OPEN_EXISTING = 3;
	OPEN_ALWAYS = 4;
	TRUNCATE_EXISTING = 5;
	

    var _fs; // Initialized in _initfs.

	_isFolder = function(info) {
	    return (FILE_ATTRIBUTE_DIRECTORY == (info.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY));
	}
    		
    _trimLeading = function(str, ch) {
        if (str) {
            if (ch==str.substr(0, ch.length)) {
                return str.substring(ch.length, str.length);
            }
            return str;
        }
		return str;
    }
    
    _trimTrailing = function(str, ch) {
        if (str) {
            if (ch==str.substr(str.length-ch.length, ch.length)) {
                return str.substring(0, str.length-ch.length)
            }
            return str;
        }
		return str;
    }
	
	var _string = function(number, character) {
		var r = "";		
		if (number > 10) {
			var tmp = _string(10, character);
			while (number > 10) {
				r += tmp;
				number -= 10;
			}
		}
		while (number) {
			r += character;
			number--;
		}
		return r;
	}
	
    _getParentPath = function(path) {
        path = _trimTrailing(path, "\\");
        var pos = path.lastIndexOf("\\");
        if (0>=pos) {
            return "";
        }
        return path.substr(0, pos);
    }

	_combinePath = function(part1, part2) {
	    if (part1) {
	        if ("\\"==part1.charAt(part1.length-1)) {
	            part1 = part1.substr(0, part1.length-1);
	        }
	    }
	    while (part2 && ".."==part2.substr(0, 2)) {
	        if ("..\\"==part2.substr(0, 3)) {
	            part2 = part2.substr(3, part2.length-3);
	        } else {
	            part2 = part2.substr(2, part2.length-2);
	        }
			if (part1.indexOf("\\")<part1.length-1) {
                part1 = _getParentPath(part1);				
			} else {
				// TODO: Should throw something.
			}
	    }
	    if (part2) {
	        if ("\\" == part2.charAt(0)) {
	            return part1 + part2;
	        } else {
	            return part1 + "\\" + part2;
	        }
	    }
	    return part1;
	}
    
    _getTopFolderName = function(path) {
        var pos = path.indexOf("\\");
        if (0 == pos) {
            return "";
        }
        if (0>pos) {
            return path;
        }
        return path.substr(0, pos);
    }
    
    var _getFileName = function(path) {
        var pos = path.lastIndexOf("\\");
        if (0 > pos) {
            return path;
        }
        return path.substring(pos+1, path.length);
    }

    _driveLetterFromPath = function(path) {
        var driveLetter = _getTopFolderName(path);
        if (driveLetter.length!=2 || driveLetter.charAt(1)!=":") {
            return null; // Expected absolute path.  Got path without drive letter.
        }
		driveLetter = driveLetter.charAt(0);
		return driveLetter;
    }
        
    var RamFs = function(name) {
		var RamFile = function(name) {
			var _that = this;
			var _info = new WIN32_FIND_DATA();
	        _info.cFileName = name;
	        _info.dwFileAttributes = FILE_ATTRIBUTE_NORMAL;
			var _blockLength = 256;
			var _blocks = [];
			
	        this.Data = function() {
	            return _info;
	        }
			
			var blockIndexFromPos = function(pos) {
				return Math.floor(pos/_blockLength);
			}
			
			this.write = function(pos, str) {
				var index = blockIndexFromPos(pos);
				var firstPosInBlock = _blockLength*index;
				var firstPosInNextBlock = firstPosInBlock+_blockLength;
				var r = 0;
				while (str) {
					var numCharsToWriteInThisBlock = firstPosInNextBlock - pos;
					if (numCharsToWriteInThisBlock<str.length) {
						numCharsToWriteInThisBlock = str.length;
					}
					var block = _blocks[index];
					if (block) {
						if (block.length==pos) {
							_blocks[index] = block + str.substr(0, numCharsToWriteInThisBlock);
						} else {
							if (pos>block.length) {
								var numCharsToZeroOut = pos - block.length;
								_blocks[index] = block + _string(numCharsToZeroOut, "\0") + str.substr(0, numCharsToWriteInThisBlock);
							} else {
								_blocks[index] = block.substring(0, pos) + str.substr(0, numCharsToWriteInThisBlock);
							}
						}
					} else {
						if (firstPosInBlock==pos) {
							// numCharsToWriteInThisBlock should be equal to blockLength.
							_blocks[index] = str.substr(0, _blockLength);							
						} else {
							var numCharsToZeroOut = pos - firstPosInBlock;
							_blocks[index] = _string(numCharsToZeroOut, "\0") + str.substr(0, numCharsToWriteInThisBlock);
						}
					}
					pos += numCharsToWriteInThisBlock;
					r+=numCharsToWriteInThisBlock;
					str = str.substr(numCharsToWriteInThisBlock);
					index++;
					firstPosInBlock += _blockLength;
					firstPosInNextBlock += _blockLength;
				}
				return r;
			}
			
			this.read = function(pos, numCharsToRead) {
				var index = blockIndexFromPos(pos);
				var firstPosInBlock = _blockLength*index;
				var firstPosInNextBlock = firstPosInBlock+_blockLength;
				var r = "";
				while (numCharsToRead>0) {
					var numCharsToReadFromThisBlock = firstPosInNextBlock - pos;
					if (numCharsToReadFromThisBlock>numCharsToRead) {
						numCharsToReadFromThisBlock = numCharsToRead;							
					}
					var block = _blocks[index];
					if (block) {
						if (numCharsToReadFromThisBlock>block.length+firstPosInBlock-pos) {
							numCharsToReadFromThisBlock = block.length+firstPosInBlock-pos;
							numCharsToRead = numCharsToReadFromThisBlock;
						}
						r = r + block.substr(pos-firstPosInBlock, numCharsToReadFromThisBlock);
					} else {
						// TODO: If we're going to allow sparse files then we need to check whether we are past the last block.
						//r = r + _string(numCharsToReadFromThisBlock, "\0");
						numCharsToRead = numCharsToReadFromThisBlock;
					}
					pos += numCharsToReadFromThisBlock;
					numCharsToRead -= numCharsToReadFromThisBlock;					
					index++;
					firstPosInBlock += _blockLength;
					firstPosInNextBlock += _blockLength;
				}
				return r;
			}
		}

		var RamHead = function(file, dwDesiredAccess, dwShareMode) {
			var _that = this;
			var _file = file;
			var _access = dwDesiredAccess;
			var _shareMode = dwShareMode;
			var _pos = 0;
			var _canRead = _isSet(GENERIC_READ, _access);
			var _canWrite = _isSet(GENERIC_WRITE, _access);
			
			this.get_Pos = function() {
				return _pos;
			}
			
			this.put_Pos = function(value) {
				_pos = value;
			}
			
			this.skip = function(value) {
				_that.put_Pos(pos+value);
			}
			
			this.write = function(str) {
				var r = _file.write(_pos, str);
				_that.put_Pos(_pos+r);
				return r;
			}
			
			this.read = function(numCharsToRead) {
				var r = _file.read(_pos, numCharsToRead);
				_that.put_Pos(_pos+r.length);
				return r;
			}
		}
		
	    var RamFolder = function(path) {
			var _that = this;
	        var _info = new WIN32_FIND_DATA();
	        var _items = [];
			var _path = path;
			var _name = _getFileName(path);
	        _info.cFileName = _name;
	        _info.dwFileAttributes = FILE_ATTRIBUTE_DIRECTORY;
	
	        this.GetItems = function() {
	            var r = [];
				for (var i in _items) {
					r.push(_items[i].Data());
				}
	            return r;
	        }

            this.GetItemsSorted = function() {
                var r = [];
                for (var i in _items) {
					r.push(_items[i].Data());
                }
				r.sort(function(a,b) { return a.cFileName>b.cFileName });
                return r;
            }
	        
	        this.Data = function() {
	            return _info;
	        }
	        
	        this.IsFolder = function() {
				return _isSet(FILE_ATTRIBUTE_DIRECTORY, _info.dwFileAttributes);
	        }
	
	        this.GetFolder = function(path) { // Return a RamFolder.
				path = _trimLeading(path, "\\");
	            var name = _getTopFolderName(path);
	            if (name) {
	                var restOfPath = "";
	                var r = _items[name.toLowerCase()];
	                if (r && r.IsFolder()) {
	                    if (name.length + 1 < path.length) {
	                        restOfPath = path.substring(name.length + 1, path.length);
	                        r = r.GetFolder(restOfPath);
	                    }
	                    if (r && r.IsFolder()) {
	                        return r;
	                    }
	                }
	                return null; // Path is not a directory.
	            } else {
	                return _that;
	            }
	        }
	        
	        this.CreateDirectory = function(path, lpSecurityAttributes) { // Create a RamFolder
	            var r = new RamFolder(path);
				var name = _getFileName(path).toLowerCase();
	            if (_items[name]) {
	                return false; // Folder already exists.
	            }
	            _items[name] = r;
	            return true;
	        }
						
			this.CreateFile = function(name, dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile){
				var lcName = name.toLowerCase();
				var file = _items[lcName];
				if (file) {
					if (CREATE_NEW==dwCreationDisposition) {
						return false; // File already exists.  TODO: Set last error.						
					}
				} else {
					if ((OPEN_EXISTING==dwCreationDisposition) || (TRUNCATE_EXISTING==dwCreationDisposition)) {
						return false; // File doesn't exist.  TODO: Set last error.						
					}
					if (CREATE_NEW == dwCreationDisposition) {
						file = new RamFile(name);
						_items[lcName] = file;
					}
					// TODO: Define other cases for dwDesiredAccess+dwCreationDisposition.
				}
				return new RamHead(file, dwDesiredAccess, dwShareMode);
			}
			
	    }; // RamFolder        
		
        var _topFolder = new RamFolder("\\");
        var _that = this;
		
        this.GetFolder = function(path) {
			return _topFolder.GetFolder(path);
		}
					
        this.CreateDirectory = function(lpPathName, lpSecurityAttributes) {
            if (!lpPathName) {
                return false;
            }
            if ("\\" != lpPathName.charAt(0)) {
                // Absolute path expected.  Relative path received.
                return false;
            }
            lpPathName = _trimLeading(lpPathName, "\\");
            var parentFolder = _that.GetFolder(_getParentPath(lpPathName));
            if (!parentFolder) {
                return false;
            }
            return parentFolder.CreateDirectory(lpPathName);
        }
		
		this.CreateFile = function(lpFileName, dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile) {
			if (!lpFileName) {
				return 0;
			}
			lpFileName = _trimLeading(lpFileName, "\\");
			var parentFolder = _that.GetFolder(_getParentPath(lpFileName));
			if (!parentFolder) {
				return false;
			}
			var name = _getFileName(lpFileName);
			return parentFolder.CreateFile(name, dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile);
		}

    }; // RamFs

    var WebFs = function(name) {
		var WebFile = function(name) {
			var _that = this;
			var _info = new WIN32_FIND_DATA();
	        _info.cFileName = name;
	        _info.dwFileAttributes = FILE_ATTRIBUTE_NORMAL;
			var _blockLength = 256;
			var _blocks = [];
			
	        this.Data = function() {
	            return _info;
	        }
			
			var blockIndexFromPos = function(pos) {
				return Math.floor(pos/_blockLength);
			}
			
			this.write = function(pos, str) {
				var index = blockIndexFromPos(pos);
				var firstPosInBlock = _blockLength*index;
				var firstPosInNextBlock = firstPosInBlock+_blockLength;
				var r = 0;
				while (str) {
					var numCharsToWriteInThisBlock = firstPosInNextBlock - pos;
					if (numCharsToWriteInThisBlock<str.length) {
						numCharsToWriteInThisBlock = str.length;
					}
					var block = _blocks[index];
					if (block) {
						if (block.length==pos) {
							_blocks[index] = block + str.substr(0, numCharsToWriteInThisBlock);
						} else {
							if (pos>block.length) {
								var numCharsToZeroOut = pos - block.length;
								_blocks[index] = block + _string(numCharsToZeroOut, "\0") + str.substr(0, numCharsToWriteInThisBlock);
							} else {
								_blocks[index] = block.substring(0, pos) + str.substr(0, numCharsToWriteInThisBlock);
							}
						}
					} else {
						if (firstPosInBlock==pos) {
							// numCharsToWriteInThisBlock should be equal to blockLength.
							_blocks[index] = str.substr(0, _blockLength);							
						} else {
							var numCharsToZeroOut = pos - firstPosInBlock;
							_blocks[index] = _string(numCharsToZeroOut, "\0") + str.substr(0, numCharsToWriteInThisBlock);
						}
					}
					pos += numCharsToWriteInThisBlock;
					r+=numCharsToWriteInThisBlock;
					str = str.substr(numCharsToWriteInThisBlock);
					index++;
					firstPosInBlock += _blockLength;
					firstPosInNextBlock += _blockLength;
				}
				return r;
			}
			
			this.read = function(pos, numCharsToRead) {
				var index = blockIndexFromPos(pos);
				var firstPosInBlock = _blockLength*index;
				var firstPosInNextBlock = firstPosInBlock+_blockLength;
				var r = "";
				while (numCharsToRead>0) {
					var numCharsToReadFromThisBlock = firstPosInNextBlock - pos;
					if (numCharsToReadFromThisBlock>numCharsToRead) {
						numCharsToReadFromThisBlock = numCharsToRead;							
					}
					var block = _blocks[index];
					if (block) {
						if (numCharsToReadFromThisBlock>block.length+firstPosInBlock-pos) {
							numCharsToReadFromThisBlock = block.length+firstPosInBlock-pos;
							numCharsToRead = numCharsToReadFromThisBlock;
						}
						r = r + block.substr(pos-firstPosInBlock, numCharsToReadFromThisBlock);
					} else {
						// TODO: If we're going to allow sparse files then we need to check whether we are past the last block.
						//r = r + _string(numCharsToReadFromThisBlock, "\0");
						numCharsToRead = numCharsToReadFromThisBlock;
					}
					pos += numCharsToReadFromThisBlock;
					numCharsToRead -= numCharsToReadFromThisBlock;					
					index++;
					firstPosInBlock += _blockLength;
					firstPosInNextBlock += _blockLength;
				}
				return r;
			}
		}

		var WebHead = function(file, dwDesiredAccess, dwShareMode) {
			var _that = this;
			var _file = file;
			var _access = dwDesiredAccess;
			var _shareMode = dwShareMode;
			var _pos = 0;
			var _canRead = _isSet(GENERIC_READ, _access);
			var _canWrite = _isSet(GENERIC_WRITE, _access);
			
			this.get_Pos = function() {
				return _pos;
			}
			
			this.put_Pos = function(value) {
				_pos = value;
			}
			
			this.skip = function(value) {
				_that.put_Pos(pos+value);
			}
			
			this.write = function(str) {
				var r = _file.write(_pos, str);
				_that.put_Pos(_pos+r);
				return r;
			}
			
			this.read = function(numCharsToRead) {
				var r = _file.read(_pos, numCharsToRead);
				_that.put_Pos(_pos+r.length);
				return r;
			}
		}
		
	    var WebFolder = function(path) {
			var _that = this;
	        var _info = new WIN32_FIND_DATA();
			var _gotItems = false;
	        var _items = [];
			var _path = path;
			var _name = _getFileName(path);
	        _info.cFileName = _name;
	        _info.dwFileAttributes = FILE_ATTRIBUTE_DIRECTORY;

			_getItems = function() {
				if (_gotItems)
				{
					return _items;
				}
	        	var IsFolder = function() {
					return _isSet(FILE_ATTRIBUTE_DIRECTORY, this.dwFileAttributes);
	        	}
				var url = "/jwin0/service/fs/readdir/" + _path.replace("\\", "/");
				var dr = new DataRequest(url, false, null);
				var rs = dr.toArray();
				for (var i in rs) {
					var record = rs[i];
					record.IsFolder = IsFolder;
					var item = record.IsFolder()?new WebFolder(record.cFileName):new WebFile(record.cFileName);
					for (var PropertyName in record) {
						item[PropertyName] = record[PropertyName];
					}
					_items[i] = item;
				}
				return _items;
			}
	
	        this.GetItems = function() {
				_getItems();
	            var r = [];
				for (var i in _items) {
					r.push(_items[i]);
				}
	            return r;
	        }

            this.GetItemsSorted = function() {
				_getItems();
                var r = [];
                for (var i in _items) {
					r.push(_items[i]);
                }
				r.sort(function(a,b) { return a.cFileName>b.cFileName });
                return r;
            }
	        
	        this.Data = function() {
	            return _info;
	        }
	        
	        this.IsFolder = function() {
				return _isSet(FILE_ATTRIBUTE_DIRECTORY, _info.dwFileAttributes);
	        }
		        
	        this.CreateDirectory = function(path, lpSecurityAttributes) {
	            var r = new WebFolder(path);
				var name = _getFileName(path).toLowerCase();
	            if (_items[name]) {
	                return false; // Folder already exists.
	            }
	            _items[name] = r;
	            return true;
	        }
						
			this.CreateFile = function(name, dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile){
				var lcName = name.toLowerCase();
				var file = _items[lcName];
				if (file) {
					if (CREATE_NEW==dwCreationDisposition) {
						return false; // File already exists.  TODO: Set last error.						
					}
				} else {
					if ((OPEN_EXISTING==dwCreationDisposition) || (TRUNCATE_EXISTING==dwCreationDisposition)) {
						return false; // File doesn't exist.  TODO: Set last error.						
					}
					if (CREATE_NEW == dwCreationDisposition) {
						file = new WebFile(name);
						_items[lcName] = file;
					}
					// TODO: Define other cases for dwDesiredAccess+dwCreationDisposition.
				}
				return new WebHead(file, dwDesiredAccess, dwShareMode);
			}
			
	    }; // WebFolder        
		
        var _topFolder = new WebFolder("\\");
        var _that = this;
		
		this.GetFolder = function(path) { // Return a WebFolder
			path = _trimLeading(path, "\\");
			return new WebFolder(path);
		}
					
        this.CreateDirectory = function(lpPathName, lpSecurityAttributes) {
            if (!lpPathName) {
                return false;
            }
            if ("\\" != lpPathName.charAt(0)) {
                // Absolute path expected.  Relative path received.
                return false;
            }
            lpPathName = _trimLeading(lpPathName, "\\");
            var parentFolder = _that.GetFolder(_getParentPath(lpPathName));
            if (!parentFolder) {
                return false;
            }
            return parentFolder.CreateDirectory(lpPathName);
        }
		
		this.CreateFile = function(lpFileName, dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile) {
			if (!lpFileName) {
				return 0;
			}
			lpFileName = _trimLeading(lpFileName, "\\");
			var parentFolder = _that.GetFolder(_getParentPath(lpFileName));
			if (!parentFolder) {
				return false;
			}
			var name = _getFileName(lpFileName);
			return parentFolder.CreateFile(name, dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile);
		}

    }; // WebFs
    
    var _fileSystem = function() {
        var _drives = [];
        this.Drive = function(letter) {
            letter = _trimTrailing(letter, ":");
            return _drives[letter.toUpperCase()];
        };
        this.Mount = function(letter, fs) {
			letter = _trimTrailing(letter, ":");
			_currentFolderPath[letter] = "\\";
            _drives[letter.toUpperCase()] = fs;
        };
    }

	var _splitDriveFromRestOfPath = function(path) {
		var r = {};
        r.driveLetter = _getTopFolderName(path);
        if (r.driveLetter.length!=2 || r.driveLetter.charAt(1)!=":") {
            return false; // Expected absolute path.  Got path without drive letter.
        }
		r.restOfPath = path.substring(2, path.length)
        r.drive = _fs.Drive(r.driveLetter);
		return r.drive?r:false;
	}

    GetFolder = function(path) {
		var tmp = _splitDriveFromRestOfPath(lpPathName);
		return tmp?tmp.drive.GetFolder(tmp.restOfPath):false;
	}
        
    CreateDirectory = function(lpPathName, lpSecurityAttributes) {
		var tmp = _splitDriveFromRestOfPath(lpPathName);
		return tmp?tmp.drive.CreateDirectory(tmp.restOfPath, lpSecurityAttributes):false;
    }

	CreateFile = function(lpFileName, dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile) {
		var tmp = _splitDriveFromRestOfPath(lpFileName);
		return tmp?tmp.drive.CreateFile(tmp.restOfPath, dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile):false;
	}

	WriteFile = function(hFile, lpBuffer, nNumberOfBytesToWrite, lpOverlapped) {
		// This function returns the number of bytes written.  In the Windows function of the same name, nNumberOfBytesWritten is an [out] parameter and the function returns a boolean.
		return hFile.write(lpBuffer.substr(0, nNumberOfBytesToWrite));
	}
	
	ReadFile = function(hFile, nNumberOfBytesToRead, lpOverlapped) {
		// The signature of this function differs from the Windows function of the same name.
		// This function returns a string.  The number of bytes read is implicit from the length of the returned string.
		return hFile.read(nNumberOfBytesToRead);
	}
	
	CloseHandle = function(hObject) {
		// TODO: Should probably do something here.
	}

    FindNextFile = function(hFindFile, lpFindFileData) {
		var op = _GlobalFindList[hFindFile];
		if (!op || 0==op.items.length) {
			return false;
		}
				
		op.currentItem = op.items[0];
		for (var i in lpFindFileData) {
			lpFindFileData[i] = op.currentItem[i];
		}
		op.items = op.items.slice(1);		
		return true;
    };
    
    FindFirstFile = function(lpFileName, lpFindFileData) {
		var tmp = _splitDriveFromRestOfPath(lpFileName);
		var folder = tmp.drive.GetFolder(tmp.restOfPath);
		
        var FINDHANDLE = function(lpFileName, lpFindFileData, folder) {
            this.lpFileName = lpFileName;
			if (folder) {
				this.items = folder.GetItemsSorted();
			} else {
				// TODO: filename or wildcard search.
				this.items = [];
			}
			if (this.items.length) {
				this.currentItem = this.items[0];
				for (var i in lpFindFileData) {
					lpFindFileData[i] = this.currentItem[i];
				}
				this.items = this.items.slice(1);
			}
        };
        var r = new FINDHANDLE(lpFileName, lpFindFileData, folder);
		if (r.currentItem) {
			_NextFindHandle++;
			_GlobalFindList[_NextFindHandle] = r;
			return _NextFindHandle;
		}
		return INVALID_HANDLE_VALUE;
    };
        
    FindClose = function(hFindFile) {
        _GlobalFindList[hFindFile] = null;
		while (_GlobalFindList.length>_NextFindHandle && !_GlobalFindList[_NextFindHandle]) {
			_NextFindHandle--;
			_GlobalFindList = _GlobalFindList.slice(0, _NextFindHandle);		
		}
    };
	
    var _initfs = function(){
		if (_fs) {
			return;
		}
		_fs = new _fileSystem();
		_fs.Mount("W", new WebFs());
		_fs.Mount("R", new RamFs());
		//CreateDirectory("W:\\Windows", null);
		//CreateDirectory("W:\\Windows\\System32", null);
		//CreateDirectory("W:\\Windows\\System32\\Drivers", null);
		//CreateDirectory("W:\\Windows\\System32\\Drivers\\etc", null);
		//CreateDirectory("W:\\Users", null);
		//CreateDirectory("W:\\Users\\Guest", null);
		//CreateDirectory("W:\\Users\\All Users", null);
		//CreateDirectory("W:\\Users\\Administrator", null);
		//CreateDirectory("W:\\Program Files", null);
		CreateDirectory("R:\\Temp", null);
    }

    // Some stuff that should be per-process but is currently global.
    var _currentDrive;
    var _currentFolderPath = [];

    var _initProcess = function() {
		_initfs();
		_currentDriveLetter = "W";
		_chdir("W:\\Users\\guest");
	}

	_getdrive = function() {
		return _currentDriveLetter.charCodeAt(0) - 64;
	}
	
	_getdcwd = function(driveNumber) {
		var driveLetter = String.fromCharCode(64+driveNumber);
		return driveLetter + ":" + _currentFolderPath[driveLetter];
	}
	
	_getcwd = function() {
		return _currentDriveLetter + ":" + _currentFolderPath[_currentDriveLetter];
	}
	
	_chdrive = function(driveNumber) {
		var driveLetter = String.fromCharCode(64+driveNumber);
		if (_fs.Drive(driveLetter)) {
			_currentDriveLetter = driveLetter;
			return 0;
		}
		return -1;
	}
	
	_chdir = function(dirname) {
        var driveLetter = _driveLetterFromPath(dirname);
		var restOfPath = dirname.substring(2, dirname.length);
		var drive = _fs.Drive(driveLetter);
		if (drive) {
	        var folder  = drive.GetFolder(restOfPath);
	        if (folder) {
	            _currentDriveLetter = driveLetter;
	            _currentFolderPath[driveLetter] = restOfPath; // TODO: Need to recase the current path to match the actual case of the folder names which may be different from dirname.
	            return 0;
	        }
		}
		return -1;
	}

    // ***********************
    // Main Initialization.
    // ***********************
	
	Main = function() {
		// Add global initialization here.
		_initfs();
		_initSysColors();
		_initStockObjects();
		document.body.style.backgroundColor = GetSysColor(COLOR_DESKTOP);		
		_registerStandardWinClasses();

        _initProcess();		
		WinMain();
	}
	
	onload = function() {
		Main();
	};

	
	// ***********************
	// Common controls.
	// ***********************
	
	// Edit Control Styles
	ES_LEFT = 0x0000;
	ES_CENTER = 0x0001;
	ES_RIGHT = 0x0002;
	ES_MULTILINE = 0x0004;
	ES_UPPERCASE = 0x0008;
	ES_LOWERCASE = 0x0010;
	ES_PASSWORD = 0x0020;
	ES_AUTOVSCROLL = 0x0040;
	ES_AUTOHSCROLL = 0x0080;
	ES_NOHIDESEL = 0x0100;
	ES_OEMCONVERT = 0x0400;
	ES_READONLY = 0x0800;
	ES_WANTRETURN = 0x1000;
	ES_NUMBER = 0x2000;
	
	// List Box Styles
	LBS_NOTIFY = 0x0001;
	LBS_SORT = 0x0002;
	LBS_NOREDRAW = 0x0004;
	LBS_MULTIPLESEL = 0x0008;
	LBS_OWNERDRAWFIXED = 0x0010;
	LBS_OWNERDRAWVARIABLE = 0x0020;
	LBS_HASSTRINGS = 0x0040;
	LBS_USETABSTOPS = 0x0080;
	LBS_NOINTEGRALHEIGHT = 0x0100;
	LBS_MULTICOLUMN = 0x0200;
	LBS_WANTKEYBOARDINPUT = 0x0400;
	LBS_EXTENDEDSEL = 0x0800;
	LBS_DISABLENOSCROLL = 0x1000;
	LBS_NODATA = 0x2000;
	LBS_NOSEL = 0x4000;
	LBS_COMBOBOX = 0x8000;
	LBS_STANDARD = (LBS_NOTIFY | LBS_SORT | WS_VSCROLL | WS_BORDER);
	
	// ListBox messages
	LB_ADDSTRING = 0x0180;
	LB_INSERTSTRING = 0x0181;
	LB_DELETESTRING = 0x0182;
	LB_SELITEMRANGEEX = 0x0183;
	LB_RESETCONTENT = 0x0184;
	LB_SETSEL = 0x0185;
	LB_SETCURSEL = 0x0186;
	LB_GETSEL = 0x0187;
	LB_GETCURSEL = 0x0188;
	LB_GETTEXT = 0x0189;
	LB_GETTEXTLEN = 0x018A;
	LB_GETCOUNT = 0x018B;
	LB_SELECTSTRING = 0x018C;
	LB_DIR = 0x018D;
	LB_GETTOPINDEX = 0x018E;
	LB_FINDSTRING = 0x018F;
	LB_GETSELCOUNT = 0x0190;
	LB_GETSELITEMS = 0x0191;
	LB_SETTABSTOPS = 0x0192;
	LB_GETHORIZONTALEXTENT = 0x0193;
	LB_SETHORIZONTALEXTENT = 0x0194;
	LB_SETCOLUMNWIDTH = 0x0195;
	LB_ADDFILE = 0x0196;
	LB_SETTOPINDEX = 0x0197;
	LB_GETITEMRECT = 0x0198;
	LB_GETITEMDATA = 0x0199;
	LB_SETITEMDATA = 0x019A;
	LB_SELITEMRANGE = 0x019B;
	LB_SETANCHORINDEX = 0x019C;
	LB_GETANCHORINDEX = 0x019D;
	LB_SETCARETINDEX = 0x019E;
	LB_GETCARETINDEX = 0x019F;
	LB_SETITEMHEIGHT = 0x01A0;
	LB_GETITEMHEIGHT = 0x01A1;
	LB_FINDSTRINGEXACT = 0x01A2;
	LB_SETLOCALE = 0x01A5;
	LB_GETLOCALE = 0x01A6;
	LB_SETCOUNT = 0x01A7;
	LB_INITSTORAGE = 0x01A8;
	LB_ITEMFROMPOINT = 0x01A9;
	LB_MULTIPLEADDSTRING = 0x01B1;
	
	// Listbox Notification Codes passed via high word of wParam of WM_COMMAND.
	LBN_ERRSPACE = -2;
	LBN_SELCHANGE = 1;
	LBN_DBLCLK = 2;
	LBN_SELCANCEL = 3;
	LBN_SETFOCUS = 4;
	LBN_KILLFOCUS = 5;

    // Combobox styles
	CBS_SIMPLE = 0x0001;
	CBS_DROPDOWN = 0x0002;
	CBS_DROPDOWNLIST = 0x0003;
	CBS_OWNERDRAWFIXED = 0x0010;
	CBS_OWNERDRAWVARIABLE = 0x0020;
	CBS_AUTOHSCROLL = 0x0040;
	CBS_SORT = 0x0100;
	CBS_HASSTRINGS = 0x0200;
	CBS_NOINTEGRALHEIGHT = 0x0400;
	CBS_DISABLENOSCROLL = 0x0800;
	CBS_UPPERCASE = 0x2000;
	CBS_LOWERCASE = 0x4000;	

    // Combobox messages
	CB_GETEDITSEL = 0x0140;
	CB_LIMITTEXT = 0x0141;
	CB_SETEDITSEL = 0x0142;
	CB_ADDSTRING = 0x0143;
	CB_DELETESTRING = 0x0144;
	CB_DIR = 0x0145;
	CB_GETCOUNT = 0x0146;
	CB_GETCURSEL = 0x0147;
	CB_GETLBTEXT = 0x0148;
	CB_GETLBTEXTLEN = 0x0149;
	CB_INSERTSTRING = 0x014A;
	CB_RESETCONTENT = 0x014B;
	CB_FINDSTRING = 0x014C;
	CB_SELECTSTRING = 0x014D;
	CB_SETCURSEL = 0x014E;
	CB_SHOWDROPDOWN = 0x014F;
	CB_GETITEMDATA = 0x0150;
	CB_SETITEMDATA = 0x0151;
	CB_GETDROPPEDCONTROLRECT = 0x0152;
	CB_SETITEMHEIGHT = 0x0153;
	CB_GETITEMHEIGHT = 0x0154;
	CB_SETEXTENDEDUI = 0x0155;
	CB_GETEXTENDEDUI = 0x0156;
	CB_GETDROPPEDSTATE = 0x0157;
	CB_FINDSTRINGEXACT = 0x0158;
	CB_SETLOCALE = 0x0159;
	CB_GETLOCALE = 0x015A;
	CB_GETTOPINDEX = 0x015B;
	CB_SETTOPINDEX = 0x015C;
	CB_GETHORIZONTALEXTENT = 0x015D;
	CB_SETHORIZONTALEXTENT = 0x015E;
	CB_GETDROPPEDWIDTH = 0x015F;
	CB_SETDROPPEDWIDTH = 0x0160;
	CB_INITSTORAGE = 0x0161;
	// CB_MULTIPLEADDSTRING =  0x0163; // Apparently undocumented message.  Windows CE only?	

    // Combobox notifications
	CBN_ERRSPACE = (-1);
	CBN_SELCHANGE = 1;
	CBN_DBLCLK = 2;
	CBN_SETFOCUS = 3;
	CBN_KILLFOCUS = 4;
	CBN_EDITCHANGE = 5;
	CBN_EDITUPDATE = 6;
	CBN_DROPDOWN = 7;
	CBN_CLOSEUP = 8;
	CBN_SELENDOK = 9;
	CBN_SELENDCANCEL = 10;	
	
    // Constants for DlgDirList.
	DDL_ARCHIVE = 0x20;
	DDL_DIRECTORY = 0x10;
	DDL_DRIVES = 0x4000;
	DDL_EXCLUSIVE = 0x8000;
	DDL_HIDDEN = 0x2;
	DDL_READONLY = 0x1;
	DDL_READWRITE = 0x0;
	DDL_SYSTEM = 0x4;

	TOOLBARCLASSNAME = "ToolbarWindow32";
	TB_ENABLEBUTTON = WM_USER + 1;
	TB_CHECKBUTTON = WM_USER + 2;
	TB_PRESSBUTTON = WM_USER + 3;
	TB_HIDEBUTTON = WM_USER + 4;
	TB_INDETERMINATE = WM_USER + 5;
	TB_MARKBUTTON = WM_USER + 6;
	TB_ISBUTTONENABLED = WM_USER + 9;
	TB_ISBUTTONCHECKED = WM_USER + 10;
	TB_ISBUTTONPRESSED = WM_USER + 11;
	TB_ISBUTTONHIDDEN = WM_USER + 12;
	TB_ISBUTTONINDETERMINATE = WM_USER + 13;
	TB_ISBUTTONHIGHLIGHTED = WM_USER + 14;
	TB_SETSTATE = WM_USER + 17;
	TB_GETSTATE = WM_USER + 18;
	TB_ADDBITMAP = WM_USER + 19;
	TB_ADDBUTTONSA = WM_USER + 20;
	TB_INSERTBUTTONA = WM_USER + 21;
	TB_DELETEBUTTON = WM_USER + 22;
	TB_GETBUTTON = WM_USER + 23;
	TB_COMMANDTOINDEX = WM_USER + 25;
	TB_SAVERESTOREA = WM_USER + 26;
	TB_SAVERESTOREW = WM_USER + 76;
	TB_CUSTOMIZE = WM_USER + 27;
	TB_ADDSTRINGA = WM_USER + 28;
	TB_ADDSTRINGW = WM_USER + 77;
	TB_GETITEMRECT = WM_USER + 29;
	TB_SETBUTTONSIZE = WM_USER + 31;
	TB_SETBITMAPSIZE = WM_USER + 32;
	TB_AUTOSIZE = WM_USER + 33;
	TB_GETTOOLTIPS = WM_USER + 35;
	TB_SETTOOLTIPS = WM_USER + 36;
	TB_SETPARENT = WM_USER + 37;
	TB_SETROWS = WM_USER + 39;
	TB_GETROWS = WM_USER + 40;
	TB_SETCMDID = WM_USER + 42;
	TB_CHANGEBITMAP = WM_USER + 43;
	TB_GETBITMAP = WM_USER + 44;
	TB_GETBUTTONTEXTA = WM_USER + 45;
	TB_GETBUTTONTEXTW = WM_USER + 75;
	TB_REPLACEBITMAP = WM_USER + 46;
	TB_SETINDENT = WM_USER + 47;
	TB_SETIMAGELIST = WM_USER + 48;
	TB_GETIMAGELIST = WM_USER + 49;
	TB_LOADIMAGES = WM_USER + 50;
	TB_GETRECT = WM_USER + 51;
	TB_SETHOTIMAGELIST = WM_USER + 52;
	TB_GETHOTIMAGELIST = WM_USER + 53;
	TB_SETDISABLEDIMAGELIST = WM_USER + 54;
	TB_GETDISABLEDIMAGELIST = WM_USER + 55;
	TB_SETSTYLE = WM_USER + 56;
	TB_GETSTYLE = WM_USER + 57;
	TB_GETBUTTONSIZE = WM_USER + 58;
	TB_SETBUTTONWIDTH = WM_USER + 59;
	TB_SETMAXTEXTROWS = WM_USER + 60;
	TB_GETTEXTROWS = WM_USER + 61;
	TB_GETBUTTONTEXT = TB_GETBUTTONTEXTW;
	TB_SAVERESTORE = TB_SAVERESTOREW;
	TB_ADDSTRING = TB_ADDSTRINGW;
	TB_GETOBJECT = WM_USER + 62;
	TB_GETHOTITEM = WM_USER + 71;
	TB_SETHOTITEM = WM_USER + 72;
	TB_SETANCHORHIGHLIGHT = WM_USER + 73;
	TB_GETANCHORHIGHLIGHT = WM_USER + 74;
	TB_MAPACCELERATORA = WM_USER + 78;
	TB_GETINSERTMARK = WM_USER + 79;
	TB_SETINSERTMARK = WM_USER + 80;
	TB_INSERTMARKHITTEST = WM_USER + 81;
	TB_MOVEBUTTON = WM_USER + 82;
	TB_GETMAXSIZE = WM_USER + 83;
	TB_SETEXTENDEDSTYLE = WM_USER + 84;
	TB_GETEXTENDEDSTYLE = WM_USER + 85;
	TB_GETPADDING = WM_USER + 86;
	TB_SETPADDING = WM_USER + 87;
	TB_SETINSERTMARKCOLOR = WM_USER + 88;
	TB_GETINSERTMARKCOLOR = WM_USER + 89;
	TB_MAPACCELERATORW = WM_USER + 90;
	TB_MAPACCELERATOR = TB_MAPACCELERATORW;

	TB_GETBITMAPFLAGS = WM_USER + 41;
	TB_INSERTBUTTONW = WM_USER + 67;
	TB_ADDBUTTONSW = WM_USER + 68;
	TB_HITTEST = WM_USER + 69;
	TB_INSERTBUTTON = TB_INSERTBUTTONW;
	TB_ADDBUTTONS = TB_ADDBUTTONSW;
	TB_SETDRAWTEXTFLAGS = WM_USER + 70;
	TB_GETSTRINGW = WM_USER + 91;
	TB_GETSTRINGA = WM_USER + 92;
	TB_GETSTRING = TB_GETSTRINGW;
	TB_GETMETRICS = WM_USER + 101;
	TB_SETMETRICS = WM_USER + 102;

	TBIMHT_AFTER = 1;
	TBIMHT_BACKGROUND = 2;

	TBBF_LARGE = 1;

	TBIF_IMAGE = 0x00000001;
	TBIF_TEXT = 0x00000002;
	TBIF_STATE = 0x00000004;
	TBIF_STYLE = 0x00000008;
	TBIF_LPARAM = 0x00000010;
	TBIF_COMMAND = 0x00000020;
	TBIF_SIZE = 0x00000040;
	TBIF_BYINDEX = 0x80000000;

	TBMF_PAD = 0x00000001;
	TBMF_BARPAD = 0x00000002;
	TBMF_BUTTONSPACING = 0x00000004;

	HINST_COMMCTRL = -1;
	
	// Icon indices for standard bitmaps identified by IDB_STD_*
	STD_CUT = 0;
	STD_COPY = 1;
	STD_PASTE = 2;
	STD_UNDO = 3;
	STD_REDOW = 4;
	STD_DELETE = 5;
	STD_FILENEW = 6;
	STD_FILEOPEN = 7;
	STD_FILESAVE = 8;
	STD_PRINTPRE = 9;
	STD_PROPERTIES = 10;
	STD_HELP = 11;
	STD_FIND = 12;
	STD_REPLACE = 13;
	STD_PRINT = 14;

	// Icon indices for standard bitmaps identified by IDB_VIEW_*
	VIEW_LARGEICONS = 0;
	VIEW_SMALLICONS = 1;
	VIEW_LIST = 2;
	VIEW_DETAILS = 3;
	VIEW_SORTNAME = 4;
	VIEW_SORTSIZE = 5;
	VIEW_SORTDATE = 6;
	VIEW_SORTTYPE = 7;
	VIEW_PARENTFOLDER = 8;
	VIEW_NETCONNECT = 9;
	VIEW_NETDISCONNECT = 10;
	VIEW_NEWFOLDER = 11;
	VIEW_VIEWMENU = 12;

	// Icon indices for standard bitmaps identified by IDB_HIST_*
	HIST_BACK = 0;
	HIST_FORWARD = 1;
	HIST_FAVORITES = 2;
	HIST_ADDTOFAVORITES = 3;
	HIST_VIEWTREE = 4;

	// Toolbar styles
	TBSTYLE_TOOLTIPS = 0x0100;
	TBSTYLE_WRAPABLE = 0x0200;
	TBSTYLE_ALTDRAG = 0x0400;
	TBSTYLE_FLAT = 0x0800;
	TBSTYLE_LIST = 0x1000;
	TBSTYLE_CUSTOMERASE = 0x2000;
	TBSTYLE_REGISTERDROP = 0x4000;
	TBSTYLE_TRANSPARENT = 0x8000;
	TBSTYLE_EX_DRAWDDARROWS = 0x00000001;

	TBSTYLE_BUTTON = 0x0000; // obsolete; use BTNS_BUTTON instead
	TBSTYLE_SEP = 0x0001; // obsolete; use BTNS_SEP instead
	TBSTYLE_CHECK = 0x0002; // obsolete; use BTNS_CHECK instead
	TBSTYLE_GROUP = 0x0004; // obsolete; use BTNS_GROUP instead
	TBSTYLE_CHECKGROUP = (TBSTYLE_GROUP | TBSTYLE_CHECK); // obsolete; use BTNS_CHECKGROUP instead
	TBSTYLE_DROPDOWN = 0x0008; // obsolete; use BTNS_DROPDOWN instead
	TBSTYLE_AUTOSIZE = 0x0010; // obsolete; use BTNS_AUTOSIZE instead
	TBSTYLE_NOPREFIX = 0x0020; // obsolete; use BTNS_NOPREFIX instead

	BTNS_BUTTON = TBSTYLE_BUTTON;
	BTNS_SEP = TBSTYLE_SEP;
	BTNS_CHECK = TBSTYLE_CHECK;
	BTNS_GROUP = TBSTYLE_GROUP;
	BTNS_CHECKGROUP = TBSTYLE_CHECKGROUP
	BTNS_DROPDOWN = TBSTYLE_DROPDOWN;
	BTNS_AUTOSIZE = TBSTYLE_AUTOSIZE;
	BTNS_NOPREFIX = TBSTYLE_NOPREFIX;
	BTNS_SHOWTEXT = 0x0040;
	BTNS_WHOLEDROPDOWN = 0x0080;

	CMB_MASKED = 0x02;
	TBSTATE_CHECKED = 0x01;
	TBSTATE_PRESSED = 0x02;
	TBSTATE_ENABLED = 0x04;
	TBSTATE_HIDDEN = 0x08;
	TBSTATE_INDETERMINATE = 0x10;
	TBSTATE_WRAP = 0x20;
	TBSTATE_ELLIPSES = 0x40;
	TBSTATE_MARKED = 0x80;

	// ListView	
	WC_LISTVIEW = "SysListView32";
	LVS_ICON = 0x0000;
	LVS_REPORT = 0x0001;
	LVS_SMALLICON = 0x0002;
	LVS_LIST = 0x0003;
	LVS_TYPEMASK = 0x0003;
	LVS_SINGLESEL = 0x0004;
	LVS_SHOWSELALWAYS = 0x0008;
	LVS_SORTASCENDING = 0x0010;
	LVS_SORTDESCENDING = 0x0020;
	LVS_SHAREIMAGELISTS = 0x0040;
	LVS_NOLABELWRAP = 0x0080;
	LVS_AUTOARRANGE = 0x0100;
	LVS_EDITLABELS = 0x0200;
	LVS_OWNERDATA = 0x1000;
	LVS_NOSCROLL = 0x2000;
	LVS_TYPESTYLEMASK = 0xfc00;
	LVS_ALIGNTOP = 0x0000;
	LVS_ALIGNLEFT = 0x0800;
	LVS_ALIGNMASK = 0x0c00;
	LVS_OWNERDRAWFIXED = 0x0400;
	LVS_NOCOLUMNHEADER = 0x4000;
	LVS_NOSORTHEADER = 0x8000;
	//LVM_SETUNICODEFORMAT = CCM_SETUNICODEFORMAT;
	//LVM_GETUNICODEFORMAT = CCM_GETUNICODEFORMAT;

	LVM_FIRST = 0x1000;
	LVM_GETBKCOLOR = LVM_FIRST;
	LVM_SETBKCOLOR = LVM_FIRST + 1;
	LVM_GETIMAGELIST = LVM_FIRST + 2;
	LVM_SETIMAGELIST = LVM_FIRST + 3;
	LVM_GETITEMCOUNT = LVM_FIRST + 4;
	LVM_GETITEMA = (LVM_FIRST + 5);
	LVM_GETITEMW = (LVM_FIRST + 75);
	LVM_GETITEM = LVM_GETITEMW;
	LVM_SETITEMA = (LVM_FIRST + 6);
	LVM_SETITEMW = (LVM_FIRST + 76);
	LVM_SETITEM = LVM_SETITEMW;
	LVM_INSERTITEMA = (LVM_FIRST + 7);
	LVM_INSERTITEMW = (LVM_FIRST + 77);
	LVM_INSERTITEM = LVM_INSERTITEMW;
	LVM_DELETEITEM = (LVM_FIRST + 8);
	LVM_DELETEALLITEMS = (LVM_FIRST + 9);
	LVM_GETCALLBACKMASK = (LVM_FIRST + 10);
	LVM_SETCALLBACKMASK = (LVM_FIRST + 11);
	LVM_GETNEXTITEM = (LVM_FIRST + 12);
	LVM_FINDITEMA = (LVM_FIRST + 13);
	LVM_FINDITEMW = (LVM_FIRST + 83);
	LVM_FINDITEM = LVM_FINDITEMW;
	LVM_GETITEMRECT = (LVM_FIRST + 14);
	LVM_SETITEMPOSITION = (LVM_FIRST + 15);
	LVM_GETITEMPOSITION = (LVM_FIRST + 16);
	LVM_GETSTRINGWIDTHA = (LVM_FIRST + 17);
	LVM_GETSTRINGWIDTHW = (LVM_FIRST + 87);
	LVM_GETSTRINGWIDTH = LVM_GETSTRINGWIDTHW;
	LVM_HITTEST = (LVM_FIRST + 18);
	LVM_ENSUREVISIBLE = (LVM_FIRST + 19);
	LVM_SCROLL = (LVM_FIRST + 20);
	LVM_REDRAWITEMS = (LVM_FIRST + 21);
	LVM_ARRANGE = (LVM_FIRST + 22);
	LVM_EDITLABELA = (LVM_FIRST + 23);
	LVM_EDITLABELW = (LVM_FIRST + 118);
	LVM_EDITLABEL = LVM_EDITLABELW;
	LVM_GETEDITCONTROL = (LVM_FIRST + 24);
	LVM_GETCOLUMNA = (LVM_FIRST + 25);
	LVM_GETCOLUMNW = (LVM_FIRST + 95);
	LVM_GETCOLUMN = LVM_GETCOLUMNW;
	LVM_SETCOLUMNA = (LVM_FIRST + 26);
	LVM_SETCOLUMNW = (LVM_FIRST + 96);
	LVM_SETCOLUMN = LVM_SETCOLUMNW;
	LVM_INSERTCOLUMNA = (LVM_FIRST + 27);
	LVM_INSERTCOLUMNW = (LVM_FIRST + 97);
	LVM_INSERTCOLUMN = LVM_INSERTCOLUMNW;
	LVM_DELETECOLUMN = (LVM_FIRST + 28);
	LVM_GETCOLUMNWIDTH = (LVM_FIRST + 29);
	LVM_SETCOLUMNWIDTH = (LVM_FIRST + 30);
	LVM_GETHEADER = (LVM_FIRST + 31);
	LVM_CREATEDRAGIMAGE = (LVM_FIRST + 33);
	LVM_GETVIEWRECT = (LVM_FIRST + 34);
	LVM_GETTEXTCOLOR = (LVM_FIRST + 35);
	LVM_SETTEXTCOLOR = (LVM_FIRST + 36);
	LVM_GETTEXTBKCOLOR = (LVM_FIRST + 37);
	LVM_SETTEXTBKCOLOR = (LVM_FIRST + 38);
	LVM_GETTOPINDEX = (LVM_FIRST + 39);
	LVM_GETCOUNTPERPAGE = (LVM_FIRST + 40);
	LVM_GETORIGIN = (LVM_FIRST + 41);
	LVM_UPDATE = (LVM_FIRST + 42);
	LVM_SETITEMSTATE = (LVM_FIRST + 43);
	LVM_GETITEMSTATE = (LVM_FIRST + 44);
	LVM_GETITEMTEXTA = (LVM_FIRST + 45);
	LVM_GETITEMTEXTW = (LVM_FIRST + 115);
	LVM_GETITEMTEXT = LVM_GETITEMTEXTW;
	LVM_GETITEMTEXT = LVM_GETITEMTEXTA;
	LVM_SETITEMTEXTA = (LVM_FIRST + 46);
	LVM_SETITEMTEXTW = (LVM_FIRST + 116);
	LVM_SETITEMTEXT = LVM_SETITEMTEXTW;
	LVM_SETITEMCOUNT = (LVM_FIRST + 47);
	LVM_SORTITEMS = (LVM_FIRST + 48);
	LVM_SETITEMPOSITION32 = (LVM_FIRST + 49);
	LVM_GETSELECTEDCOUNT = (LVM_FIRST + 50);
	LVM_GETITEMSPACING = (LVM_FIRST + 51);
	LVM_GETISEARCHSTRINGA = (LVM_FIRST + 52);
	LVM_GETISEARCHSTRINGW = (LVM_FIRST + 117);
	LVM_SUBITEMHITTEST = (LVM_FIRST + 57);
	LVM_SETCOLUMNORDERARRAY = (LVM_FIRST + 58);
	LVM_GETISEARCHSTRING = LVM_GETISEARCHSTRINGW;
	LVM_SETICONSPACING = (LVM_FIRST + 53);
	LVM_SETEXTENDEDLISTVIEWSTYLE = (LVM_FIRST + 54);
	LVM_GETEXTENDEDLISTVIEWSTYLE = (LVM_FIRST + 55);
	LVM_GETSUBITEMRECT = (LVM_FIRST + 56);
	LVM_GETCOLUMNORDERARRAY = (LVM_FIRST + 59);
	LVM_SETHOTITEM = (LVM_FIRST + 60);
	LVM_GETHOTITEM = (LVM_FIRST + 61);
	LVM_SETHOTCURSOR = (LVM_FIRST + 62);
	LVM_GETHOTCURSOR = (LVM_FIRST + 63);
	LVM_APPROXIMATEVIEWRECT = (LVM_FIRST + 64);
	LV_MAX_WORKAREAS = 16;
	LVM_SETWORKAREAS = (LVM_FIRST + 65);
	LVM_GETWORKAREAS = (LVM_FIRST + 70);
	LVM_GETNUMBEROFWORKAREAS = (LVM_FIRST + 73);
	LVM_GETSELECTIONMARK = (LVM_FIRST + 66);
	LVM_SETSELECTIONMARK = (LVM_FIRST + 67);
	LVM_SETHOVERTIME = (LVM_FIRST + 71);
	LVM_GETHOVERTIME = (LVM_FIRST + 72);
	LVM_SETTOOLTIPS = (LVM_FIRST + 74);
	LVM_GETTOOLTIPS = (LVM_FIRST + 78);
	LVM_SORTITEMSEX = (LVM_FIRST + 81);
	LVM_SETBKIMAGEA = (LVM_FIRST + 68);
	LVM_SETBKIMAGEW = (LVM_FIRST + 138);
	LVM_GETBKIMAGEA = (LVM_FIRST + 69);
	LVM_GETBKIMAGEW = (LVM_FIRST + 139);
	LVM_SETSELECTEDCOLUMN = (LVM_FIRST + 140);
	LVM_SETTILEWIDTH = (LVM_FIRST + 141);
	LVM_SETVIEW = (LVM_FIRST + 142);
	LVM_GETVIEW = (LVM_FIRST + 143);
	LVM_INSERTGROUP = (LVM_FIRST + 145);
	LVM_SETGROUPINFO = (LVM_FIRST + 147);
	LVM_GETGROUPINFO = (LVM_FIRST + 149);
	LVM_REMOVEGROUP = (LVM_FIRST + 150);
	LVM_MOVEGROUP = (LVM_FIRST + 151);
	LVM_MOVEITEMTOGROUP = (LVM_FIRST + 154);
	LVGMF_NONE = 0x00000000;
	LVGMF_BORDERSIZE = 0x00000001;
	LVGMF_BORDERCOLOR = 0x00000002;
	LVGMF_TEXTCOLOR = 0x00000004;
	LVM_SETGROUPMETRICS = (LVM_FIRST + 155);
	LVM_GETGROUPMETRICS = (LVM_FIRST + 156);
	LVM_ENABLEGROUPVIEW = (LVM_FIRST + 157);
	LVM_SORTGROUPS = (LVM_FIRST + 158);
	LVM_INSERTGROUPSORTED = (LVM_FIRST + 159);
	LVM_REMOVEALLGROUPS = (LVM_FIRST + 160);
	LVM_HASGROUP = (LVM_FIRST + 161);
	LVM_SETTILEVIEWINFO = (LVM_FIRST + 162);
	LVM_GETTILEVIEWINFO = (LVM_FIRST + 163);
	LVM_SETTILEINFO = (LVM_FIRST + 164);
	LVM_GETTILEINFO = (LVM_FIRST + 165);
	LVM_SETINSERTMARK = (LVM_FIRST + 166);
	LVM_GETINSERTMARK = (LVM_FIRST + 167);
	LVM_INSERTMARKHITTEST = (LVM_FIRST + 168);
	LVM_GETINSERTMARKRECT = (LVM_FIRST + 169);
	LVM_SETINSERTMARKCOLOR = (LVM_FIRST + 170);
	LVM_GETINSERTMARKCOLOR = (LVM_FIRST + 171);
	LVM_SETINFOTIP = (LVM_FIRST + 173);
	LVM_GETSELECTEDCOLUMN = (LVM_FIRST + 174);
	LVM_ISGROUPVIEWENABLED = (LVM_FIRST + 175);
	LVM_GETOUTLINECOLOR = (LVM_FIRST + 176);
	LVM_SETOUTLINECOLOR = (LVM_FIRST + 177);
	LVM_CANCELEDITLABEL = (LVM_FIRST + 179);
	LVM_MAPINDEXTOID = (LVM_FIRST + 180);
	LVM_MAPIDTOINDEX = (LVM_FIRST + 181);
	//LVBKIMAGE = LVBKIMAGEW;
	//LPLVBKIMAGE = LPLVBKIMAGEW;
	LVM_SETBKIMAGE = LVM_SETBKIMAGEW;
	LVM_GETBKIMAGE = LVM_GETBKIMAGEW;

	// Notifications
	LVN_FIRST = -100; // TODO: Check this value.  Should be unsigned?
	LVN_ITEMCHANGING = (LVN_FIRST-0);
	LVN_ITEMCHANGED = (LVN_FIRST-1);
	LVN_INSERTITEM = (LVN_FIRST-2);
	LVN_DELETEITEM = (LVN_FIRST-3);
	LVN_DELETEALLITEMS = (LVN_FIRST-4);
	LVN_BEGINLABELEDITA = (LVN_FIRST-5);
	LVN_BEGINLABELEDITW = (LVN_FIRST-75);
	LVN_ENDLABELEDITA = (LVN_FIRST-6);
	LVN_ENDLABELEDITW = (LVN_FIRST-76);
	LVN_COLUMNCLICK = (LVN_FIRST-8);
	LVN_BEGINDRAG = (LVN_FIRST-9);
	LVN_BEGINRDRAG = (LVN_FIRST-11);
	LVN_ODCACHEHINT = (LVN_FIRST-13);
	LVN_ODFINDITEMA = (LVN_FIRST-52);
	LVN_ODFINDITEMW = (LVN_FIRST-79);
	LVN_ITEMACTIVATE = (LVN_FIRST-14);
	LVN_ODSTATECHANGED = (LVN_FIRST-15);
	LVN_ODFINDITEM = LVN_ODFINDITEMW;
	LVN_HOTTRACK = (LVN_FIRST-21);
	LVN_GETDISPINFOA = (LVN_FIRST-50);
	LVN_GETDISPINFOW = (LVN_FIRST-77);
	LVN_SETDISPINFOA = (LVN_FIRST-51);
	LVN_SETDISPINFOW = (LVN_FIRST-78);
	LVN_BEGINLABELEDIT = LVN_BEGINLABELEDITW;
	LVN_ENDLABELEDIT = LVN_ENDLABELEDITW;
	LVN_GETDISPINFO = LVN_GETDISPINFOW;
	LVN_SETDISPINFO = LVN_SETDISPINFOW;
	LVN_GETINFOTIPA = (LVN_FIRST-57);
	LVN_GETINFOTIPW = (LVN_FIRST-58);
	LVN_GETINFOTIP = LVN_GETINFOTIPW;
	//NMLVGETINFOTIP = NMLVGETINFOTIPW;
	//LPNMLVGETINFOTIP = LPNMLVGETINFOTIPW;
	LVN_BEGINSCROLL = (LVN_FIRST-80);          
	LVN_ENDSCROLL = (LVN_FIRST-81);

	LVNI_FOCUSED = 0x0001;
	LVNI_SELECTED = 0x0002;
	LVNI_CUT = 0x0004;
	LVNI_DROPHILITED = 0x0008;

	LVNI_ABOVE = 0x0100;
	LVNI_BELOW = 0x0200;
	LVNI_TOLEFT = 0x0400;
	LVNI_TORIGHT = 0x0800;

	LVSIL_NORMAL = 0;
	LVSIL_SMALL = 1;
	LVSIL_STATE = 2;

	LVIF_TEXT = 0x0001;
	LVIF_IMAGE = 0x0002;
	LVIF_PARAM = 0x0004;
	LVIF_STATE = 0x0008;
	LVIF_INDENT = 0x0010;
	LVIF_NORECOMPUTE = 0x0800;

	LVIS_FOCUSED = 0x0001;
	LVIS_SELECTED = 0x0002;
	LVIS_CUT = 0x0004;
	LVIS_DROPHILITED = 0x0008;
	LVIS_GLOW = 0x0010;
	LVIS_ACTIVATING = 0x0020;
	LVIS_OVERLAYMASK = 0x0F00;
	LVIS_STATEIMAGEMASK = 0xF000;
	I_INDENTCALLBACK = -1;

	LVFI_PARAM = 0x0001;
	LVFI_STRING = 0x0002;
	LVFI_PARTIAL = 0x0008;
	LVFI_WRAP = 0x0020;
	LVFI_NEARESTXY = 0x0040;

	LVIR_BOUNDS = 0;
	LVIR_ICON = 1;
	LVIR_LABEL = 2;
	LVIR_SELECTBOUNDS = 3;

	LVHT_NOWHERE = 0x0001;
	LVHT_ONITEMICON = 0x0002;
	LVHT_ONITEMLABEL = 0x0004;
	LVHT_ONITEMSTATEICON = 0x0008;
	LVHT_ONITEM = (LVHT_ONITEMICON | LVHT_ONITEMLABEL | LVHT_ONITEMSTATEICON);

	LVHT_ABOVE = 0x0008;
	LVHT_BELOW = 0x0010;
	LVHT_TORIGHT = 0x0020;
	LVHT_TOLEFT = 0x0040;

	LVA_DEFAULT = 0x0000;
	LVA_ALIGNLEFT = 0x0001;
	LVA_ALIGNTOP = 0x0002;
	LVA_SNAPTOGRID = 0x0005;

	LVCF_FMT = 0x0001;
	LVCF_WIDTH = 0x0002;
	LVCF_TEXT = 0x0004;
	LVCF_SUBITEM = 0x0008;
	LVCF_IMAGE = 0x0010;
	LVCF_ORDER = 0x0020;

	LVCFMT_LEFT = 0x0000;
	LVCFMT_RIGHT = 0x0001;
	LVCFMT_CENTER = 0x0002;
	LVCFMT_JUSTIFYMASK = 0x0003;

	LVCFMT_IMAGE = 0x0800;
	LVCFMT_BITMAP_ON_RIGHT = 0x1000;
	LVCFMT_COL_HAS_IMAGES = 0x8000;

	LVSCW_AUTOSIZE = -1;
	LVSCW_AUTOSIZE_USEHEADER = -2;

	// Flags for virtual (LVS_OWNERDATA) ListView in report or list mode only.
	LVSICF_NOINVALIDATEALL = 0x00000001;
	LVSICF_NOSCROLL = 0x00000002;

	LVS_EX_GRIDLINES = 0x00000001;
	LVS_EX_SUBITEMIMAGES = 0x00000002;
	LVS_EX_CHECKBOXES = 0x00000004;
	LVS_EX_TRACKSELECT = 0x00000008;
	LVS_EX_HEADERDRAGDROP = 0x00000010;
	LVS_EX_FULLROWSELECT = 0x00000020;
	LVS_EX_ONECLICKACTIVATE = 0x00000040;
	LVS_EX_TWOCLICKACTIVATE = 0x00000080;
	LVS_EX_FLATSB = 0x00000100;
	LVS_EX_REGIONAL = 0x00000200;
	LVS_EX_INFOTIP = 0x00000400;
	LVS_EX_UNDERLINEHOT = 0x00000800;
	LVS_EX_UNDERLINECOLD = 0x00001000;
	LVS_EX_MULTIWORKAREAS = 0x00002000;
	LVS_EX_LABELTIP = 0x00004000;
	LVS_EX_BORDERSELECT = 0x00008000;

	LVBKIF_SOURCE_NONE = 0x00000000;
	LVBKIF_SOURCE_HBITMAP = 0x00000001;
	LVBKIF_SOURCE_URL = 0x00000002;
	LVBKIF_SOURCE_MASK = 0x00000003;
	LVBKIF_STYLE_NORMAL = 0x00000000;
	LVBKIF_STYLE_TILE = 0x00000010;
	LVBKIF_STYLE_MASK = 0x00000010;

	LV_VIEW_ICON = 0x0000;
	LV_VIEW_DETAILS = 0x0001;
	LV_VIEW_SMALLICON = 0x0002;
	LV_VIEW_LIST = 0x0003;
	LV_VIEW_TILE = 0x0004;
	LV_VIEW_MAX = 0x0004;

	LVGF_NONE = 0x00000000;
	LVGF_HEADER = 0x00000001;
	LVGF_FOOTER = 0x00000002;
	LVGF_STATE = 0x00000004;
	LVGF_ALIGN = 0x00000008;
	LVGF_GROUPID = 0x00000010;

	LVGS_NORMAL = 0x00000000;
	LVGS_COLLAPSED = 0x00000001;
	LVGS_HIDDEN = 0x00000002;

	LVGA_HEADER_LEFT = 0x00000001;
	LVGA_HEADER_CENTER = 0x00000002;
	LVGA_HEADER_RIGHT = 0x00000004;
	LVGA_FOOTER_LEFT = 0x00000008;
	LVGA_FOOTER_CENTER = 0x00000010;
	LVGA_FOOTER_RIGHT = 0x00000020;

	LVTVIF_AUTOSIZE = 0x00000000;
	LVTVIF_FIXEDWIDTH = 0x00000001;
	LVTVIF_FIXEDHEIGHT = 0x00000002;
	LVTVIF_FIXEDSIZE = 0x00000003;

	LVTVIM_TILESIZE = 0x00000001;
	LVTVIM_COLUMNS = 0x00000002;
	LVTVIM_LABELMARGIN = 0x00000004;

	LVIM_AFTER = 0x00000001;

	LVKF_ALT = 0x0001;
	LVKF_CONTROL = 0x0002;
	LVKF_SHIFT = 0x0004;

	LVCDI_ITEM = 0x00000000;
	LVCDI_GROUP = 0x00000001;

	LVCDRF_NOSELECT = 0x00010000;
	LVCDRF_NOGROUPFRAME = 0x00020000;  

	LVIF_DI_SETITEM = 0x1000;

	LVGIT_UNFOLDED = 0x0001;

	
	// Global State
	var _GlobalImageListList = [];
	var _hNextImageList = 16;

	var _ShortListEnumerator = function(list, start) {
		this._list = list;
		this._pos = start;

		this.clone = function() {
			return new _ShortListEnumerator(this._list, this._pos);
		};

		this.next = function(numItemsToFetch) {
			r = [];
			var i=0;
			while (i<numItemsToFetch && this._pos<this._list.count()) {
				r[i] = this._list.item(this._pos);
				i++;
				this._pos++;	
			}
			return r;
		}
	}

	var _ShortList = function(items) {
		if (items) {
			this._items = items;
		} else {
			this._items = [];
		}

		this.add = function(item) {
			this._items.push(item);
		};

		this.getEnumerator = function() {
			return new _ShortListEnumerator(this, 0);
		};

		this.item = function(index) {
			return this._items[index];
		};

		this.count = function() {
			return this._items.length;
		}
	}

	_getImageList = function(hImageList) {
		return _GlobalImageListList[hImageList];
	}

	var _getListItemIndex = function(li) {
		var items = li.parentNode.parentNode.childNodes;
		var foundMatch = false;
		for (var i = 0; i < items.length; i++) {
			if (items[i].childNodes[0] === li) {
				foundMatch = true;
				break;
			}
		}
		if (foundMatch) {
			return i;
		}
		else {
			return -1;
		}
	}
	
	var _getComboItemIndex = function(li) {
		var items = li.parentNode.childNodes;
		var foundMatch = false;
		for (var i = 0; i < items.length; i++) {
			if (items[i].childNodes[0].parentNode === li) {
				foundMatch = true;
				break;
			}
		}
		if (foundMatch) {
			return i;
		}
		else {
			return -1;
		}
	}
	
	var _getListItem = function(list, index) {
		return list.childNodes[index];
	}
	
	var _getListCount = function(list) {
		return list.childNodes.length;
	}
	
	var _highlightListItem = function(listitem, highlight, focus) {
		if (listitem) {
			var link = listitem.childNodes[0].childNodes[0]
			var s = link.style;
			if (highlight) {
				s.backgroundColor = GetSysColor(COLOR_HIGHLIGHT);
				s.color = GetSysColor(COLOR_HIGHLIGHTTEXT);
				if (focus) {
					link.focus();
				}
			}
			else {
				s.backgroundColor = GetSysColor(COLOR_WINDOW);
				s.color = GetSysColor(COLOR_WINDOWTEXT);
			}
		}
	}
	
	var _setListBoxIndex = function(win, index, focus) {
		if (!win._listbox) {
			return;
		}
		var list = win._listbox;
		var previousSelection = list._selectedIndex;
		var highlight = _highlightListItem;
		if (index >= 0 && index != previousSelection && index < _getListCount(list)) {
			if (previousSelection >= 0) {
				highlight(_getListItem(list, previousSelection), false, false);
			}
			highlight(_getListItem(list, index), true, focus);
			list._selectedIndex = index;
			SendMessage(win._hwndParent, WM_COMMAND, MAKEWPARAM(win._hMenu, LBN_SELCHANGE), win.hwnd);
		}
	}
	
	var _onlistitemclick = function(e) {
	}
	
	var _onlistitemmousedown = function(e) {
		var targ = _getEventTarget(e, "data");
		if (!targ) {
			return;
		}
		var win = _getWindowFromEventArgs(e);
		if (!win._listbox) {
			return;
		}
		var nItem = null;
		if (win._isPopup) {
			nItem = _getComboItemIndex(targ);
		} else {
			nItem = _getListItemIndex(targ);
		}
		_setListBoxIndex(win, nItem, true);
	}
	
	var _onlistitemmouseenter = function(e) {
	}
	
	var _onlistitemmouseleave = function(e) {
	}
	
	var _onlistitemkeydown = function(e) {
		var win = _getWindowFromEventArgs(e);
		if (!win._listbox) {
			return;
		}
		var selectedIndex = win._listbox._selectedIndex;
		switch (e.keyCode) {
			case 38:
				selectedIndex--;
				_setListBoxIndex(win, selectedIndex, true);
				break;
			case 40:
				selectedIndex++;
				_setListBoxIndex(win, selectedIndex, true);
				break;
		}
	}
	
	var _listboxAddString = function(listbox, str) {
		var li = _appendVerticalListItem(listbox, str, GetSysColor(COLOR_WINDOWTEXT), 2, 2, 0, 0);
		var attachEventHandler = _attachWindowEventHandler;
		attachEventHandler(li, "click", _onlistitemclick);
		attachEventHandler(li, "mousedown", _onlistitemmousedown);
		attachEventHandler(li, "mouseover", _onlistitemmouseenter);
		attachEventHandler(li, "mouseout", _onlistitemmouseleave);
		attachEventHandler(li, "keydown", _onlistitemkeydown);
		li.data = 1;
	}
	

	// ImageList
	
	var _ImageList = function(cx, cy, flags, cInitial, cGrow) {
		var that = this;
		this.cx = cx;
		this.cy = cy;
		this.flags = flags;
		this.cInitial = cInitial;
		this.cGrow = cGrow;
		this.imageCount = 0;
		this.images = [];
		this.Add = function(hbmImage, hbmMask) {
			var bm = _getBitmap(hbmImage);
			this.images[this.imageCount] = bm;
			this.imageCount++;
			return this.imageCount;
		}
	}
	
	ImageList_Create = function(cx, cy, flags, cInitial, cGrow) {
		var imageList = new _ImageList(cx, cy, flags, cInitial, cGrow);
		var hImageList = _hNextImageList;
		_hNextImageList++;
		_GlobalImageList[hImageList] = imageList;
		return hImageList;
	}
	
	ImageList_Destroy = function(himl) {
		if (hImageList) {
			_GlobalImageListList[himl] = null;
			return TRUE;
		}
		return FALSE;
	}

	ImageList_GetImageCount = function(himl) {
		var iml = _getImageList(himl);
		if (iml) {
			return iml.imageCount;
		}
	}

/* Why would one even use this?	
	ImageList_SetImageCount = function(himl, uNewCount) {
		var iml = _getImageList(himl);
		if (iml) {
			iml.imageCount = uNewCount;
			return TRUE;
		}
	}
*/
	
	ImageList_Add = function(himl, hbmImage, hbmMask) {
		var iml = _getImageList(himl);
		if (iml) {
			return iml.Add(hbmImage, hbmMask);
		}
		return 0;
	}
/*
	ImageList_ReplaceIcon = function(HIMAGELIST himl, int i, HICON hicon) {
		// TODO
		// Return int
	}

	ImageList_SetBkColor = function(HIMAGELIST himl, COLORREF clrBk) {
		// TODO
		// Return COLORREF
	}
	
	ImageList_GetBkColor = function(HIMAGELIST himl) {
		// TODO
		// Return COLORREF
	}

	ImageList_SetOverlayImage = function(HIMAGELIST himl, int iImage, int iOverlay) {
		// TODO
		// Return BOOL
	}

	ImageList_AddIcon = function(himl, hicon) {
		return ImageList_ReplaceIcon(himl, -1, hicon);
	}
*/	

	var _imageList_InitFromUrl = function(iml, url, nImages, cx, cy, startx, starty) {
		// Slice image at url into individual icons and add them to the ImageList.
		var y = starty;
		for (var i=0; i!=nImages; i++) {
			var x = startx + i*cx;
			var hbmButton = _Bitmap_LoadFromUrl(url, cx, cy, x, y);
			iml.Add(hbmButton, null);
		}
	}

	var _initStandardImageLists = function() {
		var cx = 16;
		var cy = 16;
		var flags = 0;
		var cInitial = 0;
		var cGrow = TRUE;
		var iml = new _ImageList(cx, cy, flags, cInitial, cGrow);
		_GlobalImageListList[IDB_STD_SMALL_COLOR] = iml;
		var urlToolbar = _GlobalTheme.toolbars[IDB_STD_SMALL_COLOR];
		_imageList_InitFromUrl(iml, urlToolbar, 16, cx, cy, 0, 0);
	}

    DlgDirList = function(hDlg, lpPathSpec, nIDListBox, nIDStaticPath, uFileType) {
		var hwndListBox = GetDlgItem(hDlg, nIDListBox);
		if (lpPathSpec) {
			var includeFolders = _isSet(DDL_DIRECTORY, uFileType);
			var includeNonFolders = !_isSet(DDL_DIRECTORY | DDL_EXCLUSIVE, uFileType);
			var d = new WIN32_FIND_DATA();
			var h = FindFirstFile(lpPathSpec, d);
			var index = 0;
			var more = INVALID_HANDLE_VALUE != h;
			while (more) {
				var includeThisFile = _isFolder(d)?includeFolders:includeNonFolders;
				if (includeThisFile) {
					SendMessage(hwndListBox, LB_ADDSTRING, 0, d.cFileName);
					SendMessage(hwndListBox, LB_SETITEMDATA, index, d.cFileName);
					++index;
				}
				more = FindNextFile(h, d);
			}
			return 1;
		}
		// No path specified.  uFileType must include DDL_DRIVES.
		if (_isSet(DDL_DRIVES, uFileType)) {
			var index=0;
			for (var i=65; i!=91;++i) {
				var driveLetter = String.fromCharCode(i);
				if (_fs.Drive(driveLetter)) {
                    SendMessage(hwndListBox, LB_ADDSTRING, 0, "[-"+driveLetter.toLowerCase()+"-]");					
                    SendMessage(hwndListBox, LB_SETITEMDATA, index, driveLetter+":");
					++index;
				}
			}
		}
	}

    DlgDirSelectEx = function(hDlg, nIDListBox) {		
		var hwndListBox = GetDlgItem(hDlg, nIDListBox);
        var nItem = SendMessage(hwndListBox, LB_GETCURSEL, 0, 0);
        return SendMessage(hwndListBox, LB_GETITEMDATA, nItem, 0); 		
	}
	
	var _buttonWinProc = function(hWnd, Msg, wParam, lParam) {
		var win = _getWindow(hWnd);
		switch (Msg) {
			case WM_ACTIVATE:
				break;
			case WM_SIZE:
				var nWidth = LOWORD(lParam);
				var nHeight = HIWORD(lParam);
				break;
			case WM_SETTEXT:
                var ca = win.clientArea;
                var html = _escapeHtml(lParam);
                if (lParam != ca.innerHTML) {
                    ca.innerHTML = html;
                }
				break;
			case WM_LBUTTONDOWN:
				_GlobalActiveButton = win;
			case WM_LBUTTONUP:
				var sendCommand = (_GlobalActiveButton && win===_GlobalActiveButton && win._hwndParent);
				if (_GlobalActiveButton) {
					var s = _GlobalActiveButton.style;
					s.borderStyle = (Msg==WM_LBUTTONDOWN)?"inset":"outset";
					if (Msg==WM_LBUTTONDOWN) {
						s.borderStyle = "inset";
					} else {
						s.borderStyle = "outset";
						_GlobalActiveButton = null;
					}
				}
				if (sendCommand) {
					SendMessage(win._hwndParent, WM_COMMAND, MAKEWPARAM(win._hMenu, Msg), hWnd);
				}
				return false;
		}
		return DefWindowProc(hWnd, Msg, wParam, lParam);
	}
  
	_editWinProc = function(hWnd, Msg, wParam, lParam) {
		var win = _getWindow(hWnd);
		switch (Msg) {
			case WM_CREATE:
				if (win && win.clientArea) {
					var elementType = "text";
					if (_isSet(ES_MULTILINE, lParam.style)) {
						elementType = "textarea";
					}
					var inputBox = createElement(elementType);
					inputBox.name = "txt";
					inputBox.id = "txt";
					inputBox.style.width = win.clientArea.style.width;
					inputBox.style.height = win.clientArea.style.height;
					inputBox.style.position = "absolute";
					inputBox.value = "";
					inputBox._inputStyle = "x"; // Used by _getEventTarget
					inputBox.style.border = 0;
					win.clientArea.appendChild(inputBox);
					win._inputBox = inputBox;
					setTimeout(function(){
						inputBox.focus();
					}, 100);
				}
				break;
			case WM_ACTIVATE:
				win.display = "";
				if (win._inputBox) {
				//win._inputBox.focus();
				}
				break;
			case WM_SIZE:
				var nWidth = LOWORD(lParam);
				var nHeight = HIWORD(lParam);
				if (win._inputBox) {					
					win._inputBox.style.width = (nWidth-win._clientBorder) + "px";
					win._inputBox.style.height = (nHeight-win._clientBorder) + "px";
				}
				break;
			case WM_COPY:
				var ta = win._inputBox;
				if (ta.createTextRange) {
					ta.focus();
					var tr = document.selection.createRange();
					tr.execCommand("Copy");
				} else { //if (Components && Components.classes["@mozilla.org/supports-string;1"])
					var selectedText = ta.value.substring(ta.selectionStart, ta.selectionEnd);
					SetClipboardData(CF_UNICODETEXT, selectedText);
				//const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].  
				//alert (selectedText);
				//getService(Components.interfaces.nsIClipboardHelper);  
				//gClipboardHelper.copyString("Put me on the clipboard, please.");
				//return; 
				//var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				//str.data = selectedText;
				//var transferable = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);  
				//transferable.addDataFlavor("text/unicode");  
				//transferable.setTransferData("text/unicode", str, selectedText.length * 2);
				//var idClipboard = Components.interfaces.nsIClipboard;  
				//var clipboard = Components.classes["@mozilla.org/widget/clipboard;1"].getService(idClipboard);  
				//clipboard.setData(transferable, null, idClipboard.kGlobalClipboard);
				}
				break;
			case WM_PASTE:
				var ta = win._inputBox;
				if (ta.createTextRange) {
					ta.focus();
					var tr = document.selection.createRange();
					tr.execCommand("Paste");
				} else {
					var selStart = ta.selectionStart;
					var before = ta.value.substring(0, ta.selectionStart);
					var after = ta.value.substring(ta.selectionEnd, ta.value.length);
					var clip = GetClipboardData(CF_UNICODETEXT);
					ta.value = before + clip + after;
					// Move caret to just after the newly pasted text.
					ta.selectionStart = selStart + clip.length;
					ta.selectionEnd = selStart + clip.length;
				}
				break;
			case WM_SETTEXT:
				var ta = win._inputBox;
				if (ta.value != lParam) {
					// TODO: check what Windows does to selection in response to this message.
					ta.value = lParam; // This one works in Iceweasel 3.6.
					//ta.innerHTML = "<p>" + lParam + "</p>";
				}
				break;
		}
		return DefWindowProc(hWnd, Msg, wParam, lParam);
	}
	
	var _listboxWinProc = function(hWnd, Msg, wParam, lParam) {
		var win = _getWindow(hWnd);
		if (!win) {
			return 0;
		}
		switch (Msg) {
			case LB_ADDSTRING:
				if (win._listbox) {
					_listboxAddString(win._listbox, lParam);
				}
				break;
			case LB_SETITEMDATA:
				win._listbox.childNodes[wParam].childNodes[0].data = lParam;
				break;
			case LB_GETITEMDATA:
				return win._listbox.childNodes[wParam].childNodes[0].data;
				break;
			case LB_GETCURSEL:
				return win._listbox._selectedIndex;
				break;
			case WM_CREATE:
				var listbox = _makeVerticalList(hWnd);
				win._listbox = listbox;
				listbox._selectedIndex = -1;
				var s = listbox.style;
				s.backgroundColor = GetSysColor(COLOR_WINDOW);
				s.color = GetSysColor(COLOR_WINDOWTEXT);
				s.position = "absolute";
				if (_isSet(WS_BORDER, lParam.style)) {
					// IE8 sometimes doesn't paint the border on the containing div.
					// So, we'll remove the border on the window's client area and put a border on the Listbox.
					s.borderWidth="1px";
					s.borderStyle="solid";
					s.borderColor="black";
					s = win.clientArea.style;
					s.borderColor="";
					s.borderStyle="";
					s.borderWidth="";
				}
				win.clientArea.appendChild(listbox);
				break;
			case LB_RESETCONTENT:
				while (win._listbox.childNodes.length) {
					win._listbox.removeChild(win._listbox.childNodes[0]);
				}
				break;
			case WM_ACTIVATE:
				break;
			case WM_SIZE:
				var nWidth = LOWORD(lParam);
				var nHeight = HIWORD(lParam);
				break;
			case WM_COPY:
				break;
		}
		return DefWindowProc(hWnd, Msg, wParam, lParam);
	}

    var _comboboxWinProc = function(hWnd, Msg, wParam, lParam) {
        var win = _getWindow(hWnd);
        if (!win) {
            return 0;
        }
        switch (Msg) {
			case LB_ADDSTRING:
            case CB_ADDSTRING:
				win._items.push(lParam);
                if (win._listbox) {
					SendMessage(win._listbox.hwnd, LB_ADDSTRING, wParam, lParam);
                }
                break;
            case CB_SETITEMDATA:
                //win._listbox.childNodes[wParam].childNodes[0].data = lParam;
                break;
            case CB_GETITEMDATA:
                //return win._listbox.childNodes[wParam].childNodes[0].data;
                break;
            case CB_GETCURSEL:
                //return win._listbox._selectedIndex;
                break;
            case WM_CREATE:
				var onDropDownMouseDown = function(e) {
					if (!e) {
						e = window.event; // IE
					}
					e.cancelBubble = true;
					// TODO: Check whether this is actually how it should work.
					if (!SendMessage(win._hwndParent, WM_COMMAND, MAKEWPARAM(win._hMenu, CB_SHOWDROPDOWN), hWnd)) {
						SendMessage(hWnd, CB_SHOWDROPDOWN, true, 0);
					}
				}
				var theme = _GlobalTheme.inactive;
                //win._listbox = _makeVerticalList(hWnd);
                //win._listbox._selectedIndex = -1;
                //win._listbox.style.backgroundColor = GetSysColor(COLOR_WINDOW);
                //win._listbox.style.color = GetSysColor(COLOR_WINDOWTEXT);
				var drop_down_button = _createImg(themeRoot + theme.drop_down, 17, 17);
				var div = createElement("div");
				div.appendChild(drop_down_button);				
				_attachWindowEventHandler(drop_down_button, "mousedown", onDropDownMouseDown);
				var s = div.style;
				s.textAlign = "right";				
				win.clientArea.appendChild(div);
				win._dropDownButton = div;
                s.position ="absolute";
				win.style.height = 21-win._bsClientBorder;
				win._items = [];
				
            	var dwStyle = WS_CHILD | WS_VISIBLE | ES_LEFT;
            	//win._hwndEdit = CreateWindow("EDIT", "", dwStyle, 0, 0, 90, 17, hWnd, 1, 0, 0);
				var inputBox = createElement("input");
				inputBox.type = "text";
				inputBox.name = "txt";
				inputBox.id = "txt";
				s = inputBox.style;
				//inputBox.style.width = win.clientArea.style.width-21;
				//inputBox.style.height = win.clientArea.style.height-win._bsClientBorder;					
				s.position = "absolute";
				inputBox.value = "";
				inputBox._inputStyle = "x"; // Used by _getEventTarget
				s.border = 0;
				win.clientArea.appendChild(inputBox);
				win._inputBox = inputBox;
				setTimeout(function(){
					inputBox.focus();
				}, 100);
				
                break;
            case WM_ACTIVATE:
                break;
            case WM_SIZE:
                var nWidth = LOWORD(lParam);
                var nHeight = HIWORD(lParam);
				var drop_down_button = win._dropDownButton;
				var s = drop_down_button.style;
				var vborderAllowance = win._clientBorder-win._bsClientBorder;
				var hborderAllowance = win._bsClientBorder;				
                s.left = nWidth-21+hborderAllowance;
				var inputBox = win._inputBox;
				s = inputBox.style;
				s.width = nWidth-21-hborderAllowance;
				s.height = nHeight-vborderAllowance+1-2*win._pixelHack;
                break;
            case WM_COPY:
                break;
			case CB_SHOWDROPDOWN:
				var hwndList = win._hwndList;
				var winList = null;
				if (hwndList) {
					winList = _getWindow(hwndList);
				}
				if (!winList) {
					hwndList = CreateWindow("LISTBOX", "", WS_POPUP+LBS_STANDARD, 50, 50, win.offsetWidth-2, "auto", hWnd, win._hMenu, 0, 0);
					for (i in win._items) {
						SendMessage(hwndList, LB_ADDSTRING, 0, win._items[i]);
					}
					win._hwndList = hwndList;
					winList = _getWindow(hwndList);
				}
	
				_moveWindow(winList, _getAbsoluteX(win), _getAbsoluteY(win)+win.offsetHeight-win._pixelHack);
				_sizeWindow(winList, SIZE_RESTORED, win.offsetWidth, winList.offsetHeight);
				
				ShowWindow(hwndList, SW_SHOWNOACTIVATE);				
				break;
			case WM_COMMAND:
				var hwndList = win._hwndList;
				var wmEvent = HIWORD(wParam);
				switch (wmEvent) {
					case LBN_SELCHANGE:
						var index = SendMessage(hwndList, LB_GETCURSEL, 0, 0);
						var text = win._items[index];
						win._inputBox.value = text;
						SendMessage(hwndList, WM_CLOSE, 0, 0);
						break;
					case WM_CLOSE:
						win._hwndList = null;
				}
				break;
        }
        return DefWindowProc(hWnd, Msg, wParam, lParam);
    }

	var _listViewImp = function(ul) {
		this.ul = ul;
		var s = ul.style;
		s.listStyleType = "none";
		var top = 2;

		this.appendItem = function(itemInfo) {
			var str = itemInfo.pszText;
			var iml = _GlobalImageListList[IDB_STD_SMALL_COLOR];
			var iBitmap = STD_FILEOPEN;
			var bm = iml.images[iBitmap];
			var li = createElement("li");
			var link = _createLink("#");
			var s = link.style;
			s.textDecoration = "none";
			s.color = GetSysColor(COLOR_WINDOWTEXT);
			s.display = "inline";
			s.cursor = "default";
			var img = _createImgFromBitmap(bm);
			s = img.style;
			s.cssFloat = "left";
			s.display = "inline";
			link.appendChild(img);
			var div = createElement("div");
			s = div.style;
			s.display = "inline";
			s.cssFloat = "left";
			s.position = "relative";
			s.paddingLeft = 4;
			s.top = -2;
			link.appendChild(div);
			var txt = _appendTextNode(div, str);
			li.appendChild(link);
			s = li.style;
			s.paddingLeft = 6;
			s.paddingTop = 2;
			s.paddingBottom = 2;
			s.cssFloat = "none";
			s.position = "absolute";
			s.overflow = "hidden";
			s.left = 0;
			s.top = top;
			s.width = "100%";
			top += bm.cy + 4;
			this.ul.appendChild(li);
		};

		this.useShortList = function(shortList) {
			this.shortList = shortList;
			var enumerator = shortList.getEnumerator();
			var items = enumerator.next(1); // Fetch 1st item.
			while (items.length) {
				this.appendItem(items[0]);
				items = enumerator.next(1); // Continue to fetch items 1 at a time.
			}
		};

	}

	var _listViewWinProc = function(hWnd, Msg, wParam, lParam) {
		var win = _getWindow(hWnd);
		switch (Msg) {
			case WM_CREATE:
				if (win && win.clientArea) {
					var iframe = createElement("iframe");
					iframe.style.backgroundColor = win.clientArea.style.backgroundColor;
					iframe.style.border = "none";
					win._iframe = iframe;
					win.clientArea.appendChild(iframe);
					var doc = iframe.contentWindow.document;
					doc.write("<html><body></body></html>");
					var body = doc.body;
					body.style.backgroundColor = GetSysColor(COLOR_WINDOW);
					body.style.color = GetSysColor(COLOR_WINDOWTEXT);

					// TODO: Finish implementing ListViews.  Specifically, it'd be nice if we didn't have to subclass this control to be able to populate it (which is how fileListView does it).
					var artistNamesArray = ["Aerosmith", "Beatles", "Cat Stevens", "David Bowie", "Enya", "Fairport Convention", "George Benson", "Hawkwind", "Icehouse", "Judy Small", "Kate Bush", "Little River Band", "Manfred Mann", "New Order", "Orchestral Maneouvres in the Dark", "Pallas", "Queen", "Rod Stewart", "Soul II Soul", "Tina Turner", "U2", "Vangelis"];
					var shortList = new _ShortList();
					for (var i=0; i<artistNamesArray.length; i++) {
						var artistInfo = {
						    pszText   : artistNamesArray[i]
						  , mask      : LVIF_TEXT | LVIF_IMAGE | LVIF_STATE
						  , stateMask : 0
						  , iSubItem  : 0
						  , state     : 0
						  , iItem     : i
						  , iImage    : STD_FILEOPEN
						}
						shortList.add(artistInfo);
					}

					var ul = createElement("ul");
					var imp = new _listViewImp(ul);
					win._imp = imp;
					imp.useShortList(shortList);
					body.appendChild(ul);
				}
			case WM_ACTIVATE:
				break;
			case WM_SIZE:
				var nWidth = LOWORD(lParam);
				var nHeight = HIWORD(lParam);
				var iframe = win._iframe;
				iframe.style.width = nWidth;
				iframe.style.height = nHeight;
				break;
			case WM_SETTEXT:
                var ca = win.clientArea;
                var html = _escapeHtml(lParam);
                if (lParam != ca.innerHTML) {
                    ca.innerHTML = html;
                }
				break;
			case WM_LBUTTONDOWN:
			case WM_LBUTTONUP:
				var s = win.style;
				s.borderStyle = (Msg==WM_LBUTTONDOWN)?"inset":"outset";
				if (win._hwndParent) {
					SendMessage(win._hwndParent, WM_COMMAND, MAKEWPARAM(win._hMenu, Msg), hWnd);
				}
				return false;
			case LVM_GETBKCOLOR:
			case LVM_SETBKCOLOR:
			case LVM_GETIMAGELIST:
			case LVM_SETIMAGELIST:
			case LVM_GETITEMCOUNT:
			case LVM_GETITEMA:
			case LVM_GETITEMW:
			case LVM_SETITEMA:
			case LVM_SETITEMW:
			case LVM_INSERTITEMA:
			case LVM_INSERTITEMW:
			case LVM_DELETEITEM:
			case LVM_DELETEALLITEMS:
			case LVM_GETCALLBACKMASK:
			case LVM_SETCALLBACKMASK:
			case LVM_GETNEXTITEM:
			case LVM_FINDITEMA:
			case LVM_FINDITEMW:
			case LVM_GETITEMRECT:
			case LVM_SETITEMPOSITION:
			case LVM_GETITEMPOSITION:
			case LVM_GETSTRINGWIDTHA:
			case LVM_GETSTRINGWIDTHW:
			case LVM_HITTEST:
			case LVM_ENSUREVISIBLE:
			case LVM_SCROLL:
			case LVM_REDRAWITEMS:
			case LVM_ARRANGE:
			case LVM_EDITLABELA:
			case LVM_EDITLABELW:
			case LVM_GETEDITCONTROL:
			case LVM_GETCOLUMNA:
			case LVM_GETCOLUMNW:
			case LVM_SETCOLUMNA:
			case LVM_SETCOLUMNW:
			case LVM_INSERTCOLUMNA:
			case LVM_INSERTCOLUMNW:
			case LVM_DELETECOLUMN:
			case LVM_GETCOLUMNWIDTH:
			case LVM_SETCOLUMNWIDTH:
			case LVM_GETHEADER:
			case LVM_CREATEDRAGIMAGE:
			case LVM_GETVIEWRECT:
			case LVM_GETTEXTCOLOR:
			case LVM_SETTEXTCOLOR:
			case LVM_GETTEXTBKCOLOR:
			case LVM_SETTEXTBKCOLOR:
			case LVM_GETTOPINDEX:
			case LVM_GETCOUNTPERPAGE:
			case LVM_GETORIGIN:
			case LVM_UPDATE:
			case LVM_SETITEMSTATE:
			case LVM_GETITEMSTATE:
			case LVM_GETITEMTEXTA:
			case LVM_GETITEMTEXTW:
			case LVM_SETITEMTEXTA:
			case LVM_SETITEMTEXTW:
			case LVM_SETITEMCOUNT:
			case LVM_SORTITEMS:
			case LVM_SETITEMPOSITION32:
			case LVM_GETSELECTEDCOUNT:
			case LVM_GETITEMSPACING:
			case LVM_GETISEARCHSTRINGA:
			case LVM_GETISEARCHSTRINGW:
			case LVM_SUBITEMHITTEST:
			case LVM_SETCOLUMNORDERARRAY:
			case LVM_SETICONSPACING:
			case LVM_SETEXTENDEDLISTVIEWSTYLE:
			case LVM_GETEXTENDEDLISTVIEWSTYLE:
			case LVM_GETSUBITEMRECT:
			case LVM_GETCOLUMNORDERARRAY:
			case LVM_SETHOTITEM:
			case LVM_GETHOTITEM:
			case LVM_SETHOTCURSOR:
			case LVM_GETHOTCURSOR:
			case LVM_APPROXIMATEVIEWRECT:
			case LVM_SETWORKAREAS:
			case LVM_GETWORKAREAS:
			case LVM_GETNUMBEROFWORKAREAS:
			case LVM_GETSELECTIONMARK:
			case LVM_SETSELECTIONMARK:
			case LVM_SETHOVERTIME:
			case LVM_GETHOVERTIME:
			case LVM_SETTOOLTIPS:
			case LVM_GETTOOLTIPS:
			case LVM_SORTITEMSEX:
			case LVM_SETBKIMAGEA:
			case LVM_SETBKIMAGEW:
			case LVM_GETBKIMAGEA:
			case LVM_GETBKIMAGEW:
			case LVM_SETSELECTEDCOLUMN:
			case LVM_SETTILEWIDTH:
			case LVM_SETVIEW:
			case LVM_GETVIEW:
			case LVM_INSERTGROUP:
			case LVM_SETGROUPINFO:
			case LVM_GETGROUPINFO:
			case LVM_REMOVEGROUP:
			case LVM_MOVEGROUP:
			case LVM_MOVEITEMTOGROUP:
			case LVM_SETGROUPMETRICS:
			case LVM_GETGROUPMETRICS:
			case LVM_ENABLEGROUPVIEW:
			case LVM_SORTGROUPS:
			case LVM_INSERTGROUPSORTED:
			case LVM_REMOVEALLGROUPS:
			case LVM_HASGROUP:
			case LVM_SETTILEVIEWINFO:
			case LVM_GETTILEVIEWINFO:
			case LVM_SETTILEINFO:
			case LVM_GETTILEINFO:
			case LVM_SETINSERTMARK:
			case LVM_GETINSERTMARK:
			case LVM_INSERTMARKHITTEST:
			case LVM_GETINSERTMARKRECT:
			case LVM_SETINSERTMARKCOLOR:
			case LVM_GETINSERTMARKCOLOR:
			case LVM_SETINFOTIP:
			case LVM_GETSELECTEDCOLUMN:
			case LVM_ISGROUPVIEWENABLED:
			case LVM_GETOUTLINECOLOR:
			case LVM_SETOUTLINECOLOR:
			case LVM_CANCELEDITLABEL:
			case LVM_MAPINDEXTOID:
			case LVM_MAPIDTOINDEX:
		}
		return DefWindowProc(hWnd, Msg, wParam, lParam);
	}
	
	var _createToolbarButton = function(toolbar, buttonInfo) {
		var iImageList = HIWORD(buttonInfo.iBitmap);
		var iBitmap = LOWORD(buttonInfo.iBitmap);
		var iml = toolbar.imageLists[iImageList];
		var bm = iml.images[iBitmap];
		var img = _createImgFromBitmap(bm);
		return img;
	}
	
	var _toolbarWinProc = function(hWnd, Msg, wParam, lParam) {
		var win = _getWindow(hWnd);
		var tb = win._toolbar;
		if (Msg>=WM_USER && !tb) {
			// All the TB_* messages are >= WM_USER and we expect to have toolbar before we can process such messages.
			return FALSE;
		}
		switch (Msg) {
			case WM_ACTIVATE:
				break;
			case WM_SIZE:
				var nWidth = LOWORD(lParam);
				var nHeight = HIWORD(lParam);
				break;
			case WM_SETTEXT:
                var ca = win.clientArea;
                var html = _escapeHtml(lParam);
                if (lParam != ca.innerHTML) {
                    ca.innerHTML = html;
                }
				break;
			case WM_LBUTTONDOWN:
			case WM_LBUTTONUP:
				var s = win.style;
				s.borderStyle = (Msg==WM_LBUTTONDOWN)?"inset":"outset";
				if (win._hwndParent) {
					SendMessage(win._hwndParent, WM_COMMAND, MAKEWPARAM(win._hMenu, Msg), hWnd);
				}
				return false;
			case TB_ENABLEBUTTON:
			case TB_CHECKBUTTON:
			case TB_PRESSBUTTON:
			case TB_HIDEBUTTON:
			case TB_INDETERMINATE:
			case TB_MARKBUTTON:
			case TB_ISBUTTONENABLED:
			case TB_ISBUTTONCHECKED:
			case TB_ISBUTTONPRESSED:
			case TB_ISBUTTONHIDDEN:
			case TB_ISBUTTONINDETERMINATE:
			case TB_ISBUTTONHIGHLIGHTED:
			case TB_SETSTATE:
			case TB_GETSTATE:
			case TB_ADDBITMAP:
			case TB_ADDBUTTONSA:
			case TB_INSERTBUTTONA:
			case TB_DELETEBUTTON:
			case TB_GETBUTTON:
			case TB_COMMANDTOINDEX:
			case TB_SAVERESTOREA:
			case TB_SAVERESTOREW:
			case TB_CUSTOMIZE:
			case TB_ADDSTRINGA:
			case TB_ADDSTRINGW:
			case TB_GETITEMRECT:
			case TB_SETBUTTONSIZE:
			case TB_SETBITMAPSIZE:
			case TB_AUTOSIZE:
			case TB_GETTOOLTIPS:
			case TB_SETTOOLTIPS:
			case TB_SETPARENT:
			case TB_SETROWS:
			case TB_GETROWS:
			case TB_SETCMDID:
			case TB_CHANGEBITMAP:
			case TB_GETBITMAP:
			case TB_GETBUTTONTEXTA:
			case TB_GETBUTTONTEXTW:
			case TB_REPLACEBITMAP:
			case TB_SETINDENT:
				break;
			case TB_SETIMAGELIST:
				tb.imageLists[wParam] = _getImageList(lParam);
				return 0;
			case TB_GETIMAGELIST:
				var r = tb.imageLists[wParam];
				if (r) {
					return r;
				}
				return 0;
			case TB_LOADIMAGES:
			case TB_GETRECT:
			case TB_SETHOTIMAGELIST:
			case TB_GETHOTIMAGELIST:
			case TB_SETDISABLEDIMAGELIST:
			case TB_GETDISABLEDIMAGELIST:
			case TB_SETSTYLE:
			case TB_GETSTYLE:
			case TB_GETBUTTONSIZE:
			case TB_SETBUTTONWIDTH:
			case TB_SETMAXTEXTROWS:
			case TB_GETTEXTROWS:
			case TB_GETBUTTONTEXT:
			case TB_SAVERESTORE:
			case TB_ADDSTRING:
			case TB_GETOBJECT:
			case TB_GETHOTITEM:
			case TB_SETHOTITEM:
			case TB_SETANCHORHIGHLIGHT:
			case TB_GETANCHORHIGHLIGHT:
			case TB_MAPACCELERATORA:
			case TB_GETINSERTMARK:
			case TB_SETINSERTMARK:
			case TB_INSERTMARKHITTEST:
			case TB_MOVEBUTTON:
			case TB_GETMAXSIZE:
			case TB_SETEXTENDEDSTYLE:
			case TB_GETEXTENDEDSTYLE:
			case TB_GETPADDING:
			case TB_SETPADDING:
			case TB_SETINSERTMARKCOLOR:
			case TB_GETINSERTMARKCOLOR:
			case TB_MAPACCELERATORW:
			case TB_MAPACCELERATOR:
			case TB_GETBITMAPFLAGS:
			case TB_INSERTBUTTONW:
			case TB_HITTEST:
			case TB_INSERTBUTTON:
				break;
			case TB_ADDBUTTONS:
				var iNumButtons = wParam;
				var lpButtons = lParam;
				if (iNumButtons > lpButtons.length) {
					iNumButtons = lpButtons.length;
				}
				for (var i=0; i<iNumButtons; i++) {
					var buttonInfo = lpButtons[i];
					var iml = tb.imageLists[HIWORD(buttonInfo.iBitmap)];
					var button = _createToolbarButton(tb, buttonInfo);
					var s = button.style;
					s.position = "absolute";
					s.left = i*iml.cx;
					s.top = 0;
					win.clientArea.appendChild(button);
				}
				break;
			case TB_SETDRAWTEXTFLAGS:
			case TB_GETSTRINGW:
			case TB_GETSTRINGA:
			case TB_GETSTRING:
			case TB_GETMETRICS:
			case TB_SETMETRICS:
				break;
		}
		return DefWindowProc(hWnd, Msg, wParam, lParam);
	}
	
    var _registerButtonClass = function() {
        var ButtonClass = new WNDCLASS();
        ButtonClass.style = WS_CHILD;
        ButtonClass.lpfnWndProc = _buttonWinProc;
        ButtonClass.cbClsExtra = 0;
        ButtonClass.cbWndExtra = 0;
        ButtonClass.hInstance = 0;
        ButtonClass.hIcon = "";
        ButtonClass.hCursor = "";
        ButtonClass.hbrBackground = 1 + COLOR_BTNFACE;
        ButtonClass.lpszMenuName = "";
        ButtonClass.lpszClassName = "BUTTON";
        RegisterClass(ButtonClass);
    }
		
	var _registerEditClass = function() {
		var EditClass = new WNDCLASS();
		EditClass.style = WS_CHILD;
		EditClass.lpfnWndProc = _editWinProc;
		EditClass.cbClsExtra = 0;
		EditClass.cbWndExtra = 0;
		EditClass.hInstance = 0;
		EditClass.hIcon = "";
		EditClass.hCursor = "";
		EditClass.hbrBackground = 1 + COLOR_WINDOW;
		EditClass.lpszMenuName = "";
		EditClass.lpszClassName = "EDIT";
		RegisterClass(EditClass);
	}
	
	var _registerListBoxClass = function() {
		var ListBoxClass = new WNDCLASS();
		ListBoxClass.style = WS_CHILD;
		ListBoxClass.lpfnWndProc = _listboxWinProc;
		ListBoxClass.cbClsExtra = 0;
		ListBoxClass.cbWndExtra = 0;
		ListBoxClass.hInstance = 0;
		ListBoxClass.hIcon = "";
		ListBoxClass.hCursor = "";
		ListBoxClass.hbrBackground = 1 + COLOR_WINDOW;
		ListBoxClass.lpszMenuName = "";
		ListBoxClass.lpszClassName = "LISTBOX";
		RegisterClass(ListBoxClass);
	}

    var _registerComboBoxClass = function() {
        var ComboBoxClass = new WNDCLASS();
        ComboBoxClass.style = WS_CHILD;
        ComboBoxClass.lpfnWndProc = _comboboxWinProc;
        ComboBoxClass.cbClsExtra = 0;
        ComboBoxClass.cbWndExtra = 0;
        ComboBoxClass.hInstance = 0;
        ComboBoxClass.hIcon = "";
        ComboBoxClass.hCursor = "";
        ComboBoxClass.hbrBackground = 1 + COLOR_WINDOW;
        ComboBoxClass.lpszMenuName = "";
        ComboBoxClass.lpszClassName = "COMBOBOX";
        RegisterClass(ComboBoxClass);
    }

    var _registerListViewClass = function() {
        var ListViewClass = new WNDCLASS();
        ListViewClass.style = WS_CHILD;
        ListViewClass.lpfnWndProc = _listViewWinProc;
        ListViewClass.cbClsExtra = 0;
        ListViewClass.cbWndExtra = 0;
        ListViewClass.hInstance = 0;
        ListViewClass.hIcon = "";
        ListViewClass.hCursor = "";
        ListViewClass.hbrBackground = 1 + COLOR_WINDOW;
        ListViewClass.lpszMenuName = "";
        ListViewClass.lpszClassName = WC_LISTVIEW;
        RegisterClass(ListViewClass);
    }
	
    var _registerToolbarClass = function() {
        var ToolbarClass = new WNDCLASS();
        ToolbarClass.style = WS_CHILD;
        ToolbarClass.lpfnWndProc = _toolbarWinProc;
        ToolbarClass.cbClsExtra = 0;
        ToolbarClass.cbWndExtra = 0;
        ToolbarClass.hInstance = 0;
        ToolbarClass.hIcon = "";
        ToolbarClass.hCursor = "";
        ToolbarClass.hbrBackground = 1 + COLOR_BTNFACE;
        ToolbarClass.lpszMenuName = "";
        ToolbarClass.lpszClassName = TOOLBARCLASSNAME;
        RegisterClass(ToolbarClass);
    }
	
	var _toolbar = function(hwnd, ws, wID, nBitmaps, hBMInst, wBMID, lpButtons, iNumButtons, dxButton, dyButton, dxBitmap, dyBitmap, uStructSize) {
		this.imageLists = [];
	}

	CreateToolbarEx = function(hwnd, ws, wID, nBitmaps, hBMInst, wBMID, lpButtons, iNumButtons, dxButton, dyButton, dxBitmap, dyBitmap, uStructSize) {
		var r = CreateWindowEx(0, TOOLBARCLASSNAME, "", ws, 60, 60, 130, 21, hwnd, wID, 0, 0);
		var win = _getWindow(r);
		win._toolbar = new _toolbar(hwnd, ws, wID, nBitmaps, hBMInst, wBMID, lpButtons, iNumButtons, dxButton, dyButton, dxBitmap, dyBitmap, uStructSize);
		// It seems that any toolbar created using CreateToolbarEx will be based on one of the standard toolbars.
		var iml = _getImageList(wBMID);
		if (iml) {
			SendMessage(r, TB_SETIMAGELIST, 0, wBMID);
			if (lpButtons && iNumButtons) {
				SendMessage(r, TB_ADDBUTTONS, iNumButtons, lpButtons);
			}
		}
		return r;
	}
/*
	ListView_GetBkColor = function(hwnd) {
		return SendMessage(hwnd, LVM_GETBKCOLOR, 0, 0);
	}

	ListView_SetBkColor = function(hwnd, clrBk) {
		return SendMessage(hwnd, LVM_SETBKCOLOR, 0, clrBk);
	}
	
	ListView_GetImageList = function(hwnd, iImageList) {
		return SendMessage(hwnd, LVM_GETIMAGELIST, iImageList, 0);
	}

	ListView_SetImageList = function(hwnd, himl, iImageList) {
		return SendMessage(hwnd, LVM_SETIMAGELIST, iImageList, himl);
	}
	
	ListView_GetItemCount = function(hwnd) {
		return SendMessage(hwnd, LVM_GETITEMCOUNT, 0, 0);
	}

	ListView_GetItem = function(hwnd, pitem) {
    	return SendMessage(hwnd, LVM_GETITEM, 0, pitem);
	}

	ListView_SetItem = function(hwnd, pitem) {
    	return SendMessage(hwnd, LVM_SETITEM, 0, pitem);
	}

	ListView_InsertItem = function(hwnd, pitem) {
    	return SendMessage(hwnd, LVM_INSERTITEM, 0, pitem);
	}

	ListView_DeleteItem = function(hwnd, i) {
    	return SendMessage(hwnd, LVM_DELETEITEM, i, 0);
	}

	ListView_DeleteAllItems = function(hwnd) {
    	return SendMessage(hwnd, LVM_DELETEALLITEMS, 0, 0);
	}

	ListView_GetCallbackMask = function(hwnd) {
    	return SendMessage(hwnd, LVM_GETCALLBACKMASK, 0, 0);
	}

	ListView_SetCallbackMask = function(hwnd, mask) {
    	return SendMessage(hwnd, LVM_SETCALLBACKMASK, mask, 0);
	}

	ListView_GetNextItem = function(hwnd, i, flags) {
    	return SendMessage(hwnd, LVM_GETNEXTITEM, i, MAKELPARAM((flags), 0));
	}

	ListView_FindItem = function(hwnd, iStart, plvfi) {
    	return SendMessage(hwnd, LVM_FINDITEM, iStart, plvfi);
	}

	//ListView_GetItemRect(hwnd, i, prc, code) {
	//	return SendMessage(hwnd, LVM_GETITEMRECT, i, \
    //       ((prc) ? (((RECT *)(prc))->left = (code),(LPARAM)(RECT *)(prc)) : (LPARAM)(RECT *)NULL));
	//}

	ListView_SetItemPosition = function(hwndLV, i, x, y) {
    	return SendMessage(hwndLV, LVM_SETITEMPOSITION, i, MAKELPARAM((x), (y)));
	}

	ListView_GetItemPosition = function(hwndLV, i, ppt) {
    	return SendMessage(hwndLV, LVM_GETITEMPOSITION, i, ppt);
	}

	ListView_GetStringWidth = function(hwndLV, psz) {
		return SendMessage(hwndLV, LVM_GETSTRINGWIDTH, 0, psz);
	}

	ListView_HitTest = function(hwndLV, pinfo) {
    	return SendMessage(hwndLV, LVM_HITTEST, 0, pinfo);
	}

	ListView_EnsureVisible = function(hwndLV, i, fPartialOK) {
    	return SendMessage(hwndLV, LVM_ENSUREVISIBLE, i, MAKELPARAM((fPartialOK), 0));
	}

	ListView_Scroll = function(hwndLV, dx, dy) {
		return SendMessage(hwndLV, LVM_SCROLL, dx, dy);
	}

	ListView_RedrawItems = function(hwndLV, iFirst, iLast) {
		return SendMessage(hwndLV, LVM_REDRAWITEMS, iFirst, iLast);
	}

	ListView_Arrange = function(hwndLV, code) {
    	return SendMessage(hwndLV, LVM_ARRANGE, code, 0);
	}

	ListView_EditLabel = function(hwndLV, i) {
    	return SendMessage(hwndLV, LVM_EDITLABEL, i, 0);
	}

	ListView_GetEditControl = function(hwndLV) {
    	return SendMessage(hwndLV, LVM_GETEDITCONTROL, 0, 0);
	}

	ListView_GetColumn = function(hwnd, iCol, pcol) {
		return SendMessage(hwnd, LVM_GETCOLUMN, iCol, pcol);
	}

	ListView_SetColumn = function(hwnd, iCol, pcol) {
		return SendMessage(hwnd, LVM_SETCOLUMN, iCol, pcol);
	}

	ListView_InsertColumn = function(hwnd, iCol, pcol) {
    	return SendMessage(hwnd, LVM_INSERTCOLUMN, iCol, pcol);
	}

	ListView_DeleteColumn = function(hwnd, iCol) {
    	return SendMessage(hwnd, LVM_DELETECOLUMN, iCol, 0);
	}

	ListView_GetColumnWidth = function(hwnd, iCol) {
    	return SendMessage(hwnd, LVM_GETCOLUMNWIDTH, iCol, 0);
	}

	ListView_SetColumnWidth = function(hwnd, iCol, cx) {
		return SendMessage(hwnd, LVM_SETCOLUMNWIDTH, iCol, MAKELPARAM((cx), 0));
	}

	ListView_GetHeader = function(hwnd) {
    	return SendMessage(hwnd, LVM_GETHEADER, 0, 0);
	}

	ListView_CreateDragImage = function(hwnd, i, lpptUpLeft) {
    	return SendMessage(hwnd, LVM_CREATEDRAGIMAGE, i, lpptUpLeft);
	}

	ListView_GetViewRect = function(hwnd, prc) {
    	return SendMessage(hwnd, LVM_GETVIEWRECT, 0, prc);
	}

	ListView_GetTextColor = function(hwnd) {
    	return SendMessage(hwnd, LVM_GETTEXTCOLOR, 0, 0);
	}

	ListView_SetTextColor = function(hwnd, clrText) {
    	return SendMessage(hwnd, LVM_SETTEXTCOLOR, 0, clrText);
	}

	ListView_GetTextBkColor = function(hwnd) {
    	return SendMessage(hwnd, LVM_GETTEXTBKCOLOR, 0, 0);
	}

	ListView_SetTextBkColor = function(hwnd, clrTextBk) {
    	return SendMessage(hwnd, LVM_SETTEXTBKCOLOR, 0, clrTextBk);
	}

	ListView_GetTopIndex = function(hwndLV) {
    	return SendMessage(hwndLV, LVM_GETTOPINDEX, 0, 0);
	}

	ListView_GetCountPerPage = function(hwndLV) {
    	return SendMessage(hwndLV, LVM_GETCOUNTPERPAGE, 0, 0);
	}

	ListView_GetOrigin = function(hwndLV, ppt) {
    	return SendMessage(hwndLV, LVM_GETORIGIN, 0, ppt);
	}

	ListView_Update = function(hwndLV, i) {
    	return SendMessage(hwndLV, LVM_UPDATE, i, 0);
	}

	ListView_SetItemState = function(hwndLV, i, data, mask) {
		var _ms_lvi = new LV_ITEM();
		var _ms_lvi = {
  			  stateMask: mask
  			, state: data
		};
  		return SendMessage(hwndLV, LVM_SETITEMSTATE, i, _ms_lvi);
	}

	//ListView_SetCheckState = function(hwndLV, i, fCheck) {
  	//	return ListView_SetItemState(hwndLV, i, INDEXTOSTATEIMAGEMASK((fCheck)?2:1), LVIS_STATEIMAGEMASK);
	//}

	ListView_GetItemState = function(hwndLV, i, mask) {
		return SendMessage(hwndLV, LVM_GETITEMSTATE, i, mask);
	}

	//ListView_GetCheckState = function(hwndLV, i) {
	//	return SendMessage(hwndLV, LVM_GETITEMSTATE, i, (LVIS_STATEIMAGEMASK >> 12) -1);
	//}

	ListView_GetItemText = function(hwndLV, i, iSubItem_, pszText_, cchTextMax_) {
		var _ms_lvi = {
			  iSubItem : iSubItem_
			, cchTextMax : cchTextMax_
		};
		return SendMessage(hwndLV, LVM_GETITEMTEXT, i, _ms_lvi);
	}

	ListView_SetItemText = function(hwndLV, i, iSubItem_, pszText_) {
		var _ms_lvi = {
			  iSubItem : iSubItem_
			, pszText : pszText_
		};
		return SendMessage(hwndLV, LVM_SETITEMTEXT, i, _ms_lvi);
	}

	ListView_SetItemCount = function(hwndLV, cItems) {
		return SendMessage(hwndLV, LVM_SETITEMCOUNT, cItems, 0);
	}

	ListView_SetItemCountEx = function(hwndLV, cItems, dwFlags) {
		return SendMessage(hwndLV, LVM_SETITEMCOUNT, cItems, dwFlags);
	}

	ListView_GetSelectedCount = function(hwndLV) {
		return SendMessage(hwndLV, LVM_GETSELECTEDCOUNT, 0, 0);
	}

	ListView_GetItemSpacing = function(hwndLV, fSmall) {
		return SendMessage(hwndLV, LVM_GETITEMSPACING, fSmall, 0);
	}

	ListView_GetISearchString = function(hwndLV, lpsz) {
		return SendMessage(hwndLV, LVM_GETISEARCHSTRING, 0, lpsz);
	}

	ListView_SetIconSpacing = function(hwndLV, cx, cy) {
        return SendMessage(hwndLV, LVM_SETICONSPACING, 0, MAKELONG(cx,cy));
	}

	ListView_SetExtendedListViewStyle = function(hwndLV, dw) {
		return SendMessage(hwndLV, LVM_SETEXTENDEDLISTVIEWSTYLE, 0, dw);
	}

	ListView_SetExtendedListViewStyleEx = function(hwndLV, dwMask, dw) {
		return SendMessage(hwndLV, LVM_SETEXTENDEDLISTVIEWSTYLE, dwMask, dw);
	}

	ListView_GetExtendedListViewStyle = function(hwndLV) {
		return SendMessage(hwndLV, LVM_GETEXTENDEDLISTVIEWSTYLE, 0, 0);
	}

	ListView_SetWorkAreas = function(hwnd, nWorkAreas, prc) {
		return SendMessage(hwnd, LVM_SETWORKAREAS, nWorkAreas, prc);
	}

	ListView_GetWorkAreas = function(hwnd, nWorkAreas, prc) {
		return SendMessage(hwnd, LVM_GETWORKAREAS, nWorkAreas, prc);
	}

	ListView_GetNumberOfWorkAreas = function(hwnd, pnWorkAreas) {
		return SendMessage(hwnd, LVM_GETNUMBEROFWORKAREAS, 0, pnWorkAreas);
	}

	ListView_GetSelectionMark = function(hwnd) {
    	return SendMessage(hwnd, LVM_GETSELECTIONMARK, 0, 0);
	}

	ListView_SetSelectionMark = function(hwnd, i) {
		return SendMessage(hwnd, LVM_SETSELECTIONMARK, 0, i);
	}

	ListView_SetHoverTime = function(hwndLV, dwHoverTimeMs) {
		return SendMessage(hwndLV, LVM_SETHOVERTIME, 0, dwHoverTimeMs);
	}

	ListView_GetHoverTime = function(hwndLV) {
		return SendMessage(hwndLV, LVM_GETHOVERTIME, 0, 0);
	}

	ListView_SetToolTips = function(hwndLV, hwndNewHwnd) {
		return SendMessage(hwndLV, LVM_SETTOOLTIPS, hwndNewHwnd, 0);
	}

	ListView_GetToolTips = function(hwndLV) {
		return SendMessage(hwndLV, LVM_GETTOOLTIPS, 0, 0);
	}

	ListView_SortItemsEx = function(hwndLV, _pfnCompare, _lPrm) {
		return SendMessage(hwndLV, LVM_SORTITEMSEX, _lPrm, _pfnCompare);
	}

	ListView_SetSelectedColumn = function(hwnd, iCol) {
		return SendMessage(hwnd, LVM_SETSELECTEDCOLUMN, iCol, 0);
	}

	ListView_SetTileWidth = function(hwnd, cpWidth) {
		return SendMessage(hwnd, LVM_SETTILEWIDTH, cpWidth, 0);
	}

	ListView_SetView = function(hwnd, iView) {
		return SendMessage(hwnd, LVM_SETVIEW, iView, 0);
	}

	ListView_GetView = function(hwnd) {
		return SendMessage(hwnd, LVM_GETVIEW, 0, 0);
	}

	ListView_InsertGroup = function(hwnd, index, pgrp) {
		return SendMessage(hwnd, LVM_INSERTGROUP, index, pgrp);
	}

	ListView_SetGroupInfo = function(hwnd, iGroupId, pgrp) {
		return SendMessage(hwnd, LVM_SETGROUPINFO, iGroupId, pgrp);
	}

	ListView_GetGroupInfo = function(hwnd, iGroupId, pgrp) {
		return SendMessage(hwnd, LVM_GETGROUPINFO, iGroupId, pgrp);
	}

	ListView_RemoveGroup = function(hwnd, iGroupId) {
		return SendMessage(hwnd, LVM_REMOVEGROUP, iGroupId, 0);
	}

	ListView_MoveGroup = function(hwnd, iGroupId, toIndex) {
		return SendMessage(hwnd, LVM_MOVEGROUP, iGroupId, toIndex);
	}

	ListView_MoveItemToGroup = function(hwnd, idItemFrom, idGroupTo) {
		return SendMessage(hwnd, LVM_MOVEITEMTOGROUP, idItemFrom, idGroupTo);
	}

	ListView_SetGroupMetrics = function(hwnd, pGroupMetrics) {
		return SendMessage(hwnd, LVM_SETGROUPMETRICS, 0, pGroupMetrics);
	}

	ListView_GetGroupMetrics = function(hwnd, pGroupMetrics) {
		return SendMessage(hwnd, LVM_GETGROUPMETRICS, 0, pGroupMetrics);
	}

	ListView_EnableGroupView = function(hwnd, fEnable) {
		return SendMessage(hwnd, LVM_ENABLEGROUPVIEW, fEnable, 0);
	}

	ListView_SortGroups = function(hwnd, _pfnGroupCompate, _plv) {
		return SendMessage(hwnd, LVM_SORTGROUPS, _pfnGroupCompate, _plv);
	}

	ListView_InsertGroupSorted = function(hwnd, structInsert) {
		return SendMessage(hwnd, LVM_INSERTGROUPSORTED, structInsert, 0);
	}

	ListView_RemoveAllGroups = function(hwnd) {
		return SendMessage(hwnd, LVM_REMOVEALLGROUPS, 0, 0);
	}

	ListView_HasGroup = function(hwnd, dwGroupId) {
		return SendMessage(hwnd, LVM_HASGROUP, dwGroupId, 0);
	}

	ListView_SetTileViewInfo = function(hwnd, ptvi) {
		return SendMessage(hwnd, LVM_SETTILEVIEWINFO, 0, ptvi);
	}

	ListView_GetTileViewInfo = function(hwnd, ptvi) {
		return SendMessage(hwnd, LVM_GETTILEVIEWINFO, 0, ptvi);
	}

	ListView_SetTileInfo = function(hwnd, pti) {
		return SendMessage(hwnd, LVM_SETTILEINFO, 0, pti);
	}

	ListView_GetTileInfo = function(hwnd, pti) {
		return SendMessage(hwnd, LVM_GETTILEINFO, 0, pti);
	}

	ListView_SetInsertMark = function(hwnd, lvim) {
		return SendMessage(hwnd, LVM_SETINSERTMARK, 0, lvim);
	}

	ListView_GetInsertMark = function(hwnd, lvim) {
		return SendMessage(hwnd, LVM_GETINSERTMARK, 0, lvim);
	}

	ListView_InsertMarkHitTest = function(hwnd, point, lvim) {
		return SendMessage(hwnd, LVM_INSERTMARKHITTEST, point, lvim);
	}

	ListView_GetInsertMarkRect = function(hwnd, rc) {
		return SendMessage(hwnd, LVM_GETINSERTMARKRECT, 0, rc);
	}

	ListView_SetInsertMarkColor = function(hwnd, color) {
		return SendMessage(hwnd, LVM_SETINSERTMARKCOLOR, 0, color);
	}

	ListView_GetInsertMarkColor = function(hwnd) {
		return SendMessage(hwnd, LVM_GETINSERTMARKCOLOR, 0, 0);
	}

	ListView_SetInfoTip = function(hwndLV, plvInfoTip) {
		return SendMessage(hwndLV, LVM_SETINFOTIP, 0, plvInfoTip);
	}

	ListView_GetSelectedColumn = function(hwnd) {
		return SendMessage(hwnd, LVM_GETSELECTEDCOLUMN, 0, 0);
	}

	ListView_IsGroupViewEnabled = function(hwnd) {
		return SendMessage(hwnd, LVM_ISGROUPVIEWENABLED, 0, 0);
	}

	ListView_GetOutlineColor = function(hwnd) {
		return SendMessage(hwnd, LVM_GETOUTLINECOLOR, 0, 0);
	}

	ListView_SetOutlineColor = function(hwnd, color) {
		return SendMessage(hwnd, LVM_SETOUTLINECOLOR, 0, color);
	}

	ListView_CancelEditLabel = function(hwnd) {
		return SendMessage(hwnd, LVM_CANCELEDITLABEL, 0, 0);
	}

	ListView_MapIndexToID = function(hwnd, index) {
		return SendMessage(hwnd, LVM_MAPINDEXTOID, index, 0);
	}

	ListView_MapIDToIndex = function(hwnd, id) {
		return SendMessage(hwnd, LVM_MAPIDTOINDEX, id, 0);
	}

	ListView_SetBkImage = function(hwnd, plvbki) {
		return SendMessage(hwnd, LVM_SETBKIMAGE, 0, plvbki);
	}

	ListView_GetBkImage = function(hwnd, plvbki) {
		return SendMessage(hwnd, LVM_GETBKIMAGE, 0, plvbki);
	}

	ListView_SortItems = function(hwndLV, _pfnCompare, _lPrm) {
		return SendMessage(hwndLV, LVM_SORTITEMS, _lPrm, _pfnCompare);
	}

	ListView_SetItemPosition32 = function(hwndLV, i, x0, y0) {
		var ptNewPos = {
			  x: x0
			, y: y0
		};
		return SendMessage(hwndLV, LVM_SETITEMPOSITION32, i, ptNewPos);
	}

	//ListView_GetSubItemRect = function(hwnd, iItem, iSubItem, code, prc) {
	//	return SendMessage(hwnd, LVM_GETSUBITEMRECT, iItem,
    //            ((prc) ? ((((LPRECT)(prc))->top = iSubItem), (((LPRECT)(prc))->left = code), (LPARAM)(prc)) : (LPARAM)(LPRECT)NULL));
	//}

	ListView_SubItemHitTest = function(hwnd, plvhti) {
		return SendMessage(hwnd, LVM_SUBITEMHITTEST, 0, plvhti);
	}

	ListView_SetColumnOrderArray = function(hwnd, iCount, pi) {
		return SendMessage(hwnd, LVM_SETCOLUMNORDERARRAY, iCount, pi);
	}

	ListView_GetColumnOrderArray = function(hwnd, iCount, pi) {
		return SendMessage(hwnd, LVM_GETCOLUMNORDERARRAY, iCount, pi);
	}

	ListView_SetHotItem = function(hwnd, i) {
		return SendMessage(hwnd, LVM_SETHOTITEM, i, 0);
	}

	ListView_GetHotItem = function(hwnd) {
		return SendMessage(hwnd, LVM_GETHOTITEM, 0, 0);
	}

	ListView_SetHotCursor = function(hwnd, hcur) {
		return SendMessage(hwnd, LVM_SETHOTCURSOR, 0, hcur);
	}

	ListView_GetHotCursor = function(hwnd) {
		return SendMessage(hwnd, LVM_GETHOTCURSOR, 0, 0);
	}

	ListView_ApproximateViewRect = function(hwnd, iWidth, iHeight, iCount) {
		return SendMessage(hwnd, LVM_APPROXIMATEVIEWRECT, iCount, MAKELPARAM(iWidth, iHeight));
	}
*/
	
	var _registerCommonControlClasses = function() {
		_registerButtonClass();
		_registerEditClass();
		_registerListBoxClass();
		_registerComboBoxClass();
		_registerListBoxClass();
		_registerToolbarClass();
		_registerListViewClass();
	}
	
	var _initializedCommonControls = false;
	InitCommonControlsEx = function() {
		if (_initializedCommonControls) {
			return;
		}
		_registerCommonControlClasses();
		_initStandardImageLists();
		_initializedCommonControls = true;
	}


	// ***********************
	// Common Dialogs
	// ***********************

    OPENFILENAME = function() {
		var _that = this;
		_that.lStructSize = 0;
		_that.hwndOwner = 0;
		_that.hInstance = 0; 
		_that.lpstrFilter = ""; 
		_that.lpstrCustomFilter = ""; 
		_that.nMaxCustFilter = 0; 
		_that.nFilterIndex = 0; 
		_that.lpstrFile = ""; 
		_that.nMaxFile = 0; 
		_that.lpstrFileTitle = ""; 
		_that.nMaxFileTitle = 0; 
		_that.lpstrInitialDir = ""; 
		_that.lpstrTitle = ""; 
		_that.Flags = 0; 
		_that.nFileOffset = 0; 
		_that.nFileExtension = 0; 
		_that.lpstrDefExt = ""; 
		_that.lCustData = null; 
		_that.lpfnHook = null; 
		_that.lpTemplateName = "";
	}

    var _commonFileDlgWinProc = function(hWnd, Msg, wParam, lParam) {
		// We need an ID for each control on the dialog.
		// We'll use the control ID when we call CreateWindow, and later to find the control using GetDlgItem.
		var ID_OK = 1;
		var ID_CANCEL = 2;
		var ID_DRIVES = 3;
		var ID_FOLDERS = 4;
		var ID_FILES = 5;

        var win = _getWindow(hWnd);
        if (!win) {
            return 0;
        }
        switch (Msg) {
            case WM_CREATE:
	            // Create dialog controls.
	            // The 10th parameter of CreateWindowEx is a handle to the menu when creating a top level window, and the control's ID when creating a child window, which is what we are doing here.
				var dwStyle = WS_CHILD | WS_VISIBLE;
				var hWndCancel = CreateWindowEx(0, "BUTTON", "", dwStyle, 60, 130, 130, 21, hWnd, ID_CANCEL, 0, 0);
				SendMessage(hWndCancel, WM_SETTEXT, 0, "Cancel");
	            dwStyle = WS_CHILD | WS_VISIBLE | LBS_NOTIFY;
	            var hWndListBox = CreateWindowEx(WS_EX_CLIENTEDGE, "COMBOBOX", "", dwStyle, 10, 10, 190, 21, hWnd, ID_DRIVES, 0, 0);
				DlgDirList(hWnd, "", ID_DRIVES, 0, DDL_DRIVES);
                break;
            case WM_ACTIVATE:
                break;
            case WM_SIZE:
                var nWidth = LOWORD(lParam);
                var nHeight = HIWORD(lParam);
                break;
			case WM_COMMAND:
				var wmId = LOWORD(wParam);
				var wmEvent = HIWORD(wParam);
				switch (wmId) {
					case ID_CANCEL:
						switch (wmEvent) {
							case WM_LBUTTONUP:
								SendMessage(hWnd, WM_CLOSE, 0, 0);
								break;
						}
						break;
					case ID_DRIVES:
						break;
					}
				}
/*					case ID_DRIVES:
						switch (wmEvent) {
							case CB_SHOWDROPDOWN:

								var winComboBox = _getDlgItem(win, ID_DRIVES);
								var hwndList = CreateWindow("LISTBOX", "", WS_POPUP+LBS_STANDARD, 50, 50, winComboBox.offsetWidth-2, "auto", 0, 0, 0, 0);
								//DlgDirList(hwndList, "", ID_DRIVES, 0, DDL_DRIVES);
        		SendMessage(hwndList, LB_ADDSTRING, 0, "Yellow"); 
        		SendMessage(hwndList, LB_ADDSTRING, 0, "Blue"); 
								winList = _getWindow(hwndList);
								_moveWindow(winList, _getAbsoluteX(winComboBox), _getAbsoluteY(winComboBox)+winComboBox.offsetHeight-winComboBox._pixelHack);
								_sizeWindow(winList, SIZE_RESTORED, winComboBox.offsetWidth, winList.offsetHeight);
								ShowWindow(hwndList, SW_SHOWNOACTIVATE);
								return TRUE;				
								break;
						}
						break;
				}
*/
        return DefWindowProc(hWnd, Msg, wParam, lParam);
    }

	var _registerCommonFileDlgClass = function() {
		var DlgClass = new WNDCLASS();
		DlgClass.style = WS_OVERLAPPEDWINDOW;
		DlgClass.lpfnWndProc = _commonFileDlgWinProc;
		DlgClass.cbClsExtra = 0;
		DlgClass.cbWndExtra = 0;
		DlgClass.hInstance = 0;
		DlgClass.hIcon = "";
		DlgClass.hCursor = "";
		DlgClass.hbrBackground = 1+COLOR_BTNFACE;
		DlgClass.lpszMenuName = "";
		DlgClass.lpszClassName = "#32770";
		RegisterClass(DlgClass);
	}

	var _initializedCommonDialogs = false;
	var _initCommonDialogs = function() {
		if (_initializedCommonDialogs) {
			return;
		}
		InitCommonControlsEx();
		_registerCommonFileDlgClass();
		_initializedCommonDialogs = true;
	}
	
	GetOpenFileName = function(lpofn) {
		_initCommonDialogs();
		var szTitle = lpofn.lpstrTitle;
		szTitle = szTitle?szTitle:"Open File";
		var hwnd = CreateWindow("#32770", szTitle, WS_VISIBLE | WS_OVERLAPPEDWINDOW, 20, 10, 400, 420, 0, 0, 0, 0);
	}
	
	
	// ***********************
	// COM & OLE
	// ***********************

    // HRESULT constants
	S_OK = 0x00000000;
	S_FALSE = 0x00000001;
	E_FAIL = 0x80004005;
	E_UNEXPECTED = 0x8000FFFF;
	E_NOTIMPL = 0x80004001;
	E_OUTOFMEMORY = 0x8007000E;
	E_INVALIDARG = 0x80070057;
	E_NOINTERFACE = 0x80004002;
	E_POINTER = 0x80004003;
	REGDB_E_CLASSNOTREG = 0x80040154;

 	var COINIT_SINGLETHREADED = 0x3; // Internal constant recognized by our implementation of CoInitializeEx.
	COINIT_APARTMENTTHREADED = 0x2;
	COINIT_MULTITHREADED = 0x0;
	COINIT_SPEED_OVER_MEMORY = 0x8;  // We probably won't do anything with this, but no harm in accepting and ignoring it.

    CLSCTX_INPROC_SERVER = 1;
    CLSCTX_INPROC_HANDLER = 2; 
    CLSCTX_LOCAL_SERVER = 4;
    CLSCTX_REMOTE_SERVER = 16;

    // Registry hives
	HKEY_CLASSES_ROOT = 0x80000000;
	HKEY_CURRENT_USER = 0x80000001;
	HKEY_LOCAL_MACHINE = 0x80000002;

    var _registry_t = function() {
		var ClsIdsByProgId = [];
		var ProgIdsByClsId = [];
		
		this.RegisterClass = function(ProgId, ClsId) {
			ClsIdsByProgId[ProgId] = ClsId;
			ProgIdsByClsId[ClsId] = ProgId;
		}

		this.CLSIDFromProgID = function(lpszProgID) {
			return ClsIdsByProgId[lpszProgID];
		}
	
		this.ProgIDFromCLSID = function(clsid) {
			return ProgIdsByClsId[clsid];
		}
		
		this.CreateInstanceFromProgId = function(ProgId) {
			return eval("new " + ProgId + '()');
		}
		
		this.CreateInstanceFromClsId = function(ClsId) {
			return CreateInstanceFromProgId(ProgIdFromCLSID(ClsId));
		}
	}

	var _loadedClasses = new _registry_t();
	
	CoInitializeEx = function(pvReserved, dwCoInit) {
		return S_OK;
	}

	CoInitialize = function(pvReserved) {
		return CoInitializeEx(pvReserved, COINIT_SINGLETHREADED);
	}	 
	
	CLSIDFromProgID = function(lpszProgID,  pclsid) {
		
	}

	ProgIDFromCLSID = function(clsid, lplpszProgID) {
		
	}
	
	CoCreateInstanceEx = function(rclsid, punkOuter, dwClsCtx, pServerInfo, cmq, pResults) {
		
	}

	CoCreateInstance = function(rclsid, pUnkOuter, dwClsContext, riid, ppv) {
		
	}

	CreateInstanceFromProgId = function(ProgId) {
		return eval("new " + ProgId + '()');
	}


	// ***********************
	// jwin
	// ***********************  
  
	var _fileListViewWinProc = function(hWnd, Msg, wParam, lParam) {
		var win = _getWindow(hWnd);
		switch (Msg) {
			case WM_CREATE:
				if (win && win.clientArea) {
					var iframe = createElement("iframe");
					iframe.style.backgroundColor = win.clientArea.style.backgroundColor;
					iframe.style.border = "none";
					win._iframe = iframe;
					win.clientArea.appendChild(iframe);
					var doc = iframe.contentWindow.document;
					doc.write("<html><body></body></html>");
					var body = doc.body;
					body.style.backgroundColor = GetSysColor(COLOR_WINDOW);
					body.style.color = GetSysColor(COLOR_WINDOWTEXT);

					var artistNamesArray = ["Web (W:)", "RAM (R:)"];
					var shortList = new _ShortList();
					for (var i=0; i<artistNamesArray.length; i++) {
						var artistInfo = {
						    pszText   : artistNamesArray[i]
						  , mask      : LVIF_TEXT | LVIF_IMAGE | LVIF_STATE
						  , stateMask : 0
						  , iSubItem  : 0
						  , state     : 0
						  , iItem     : i
						  , iImage    : STD_FILEOPEN
						}
						shortList.add(artistInfo);
					}

					var ul = createElement("ul");
					var imp = new _listViewImp(ul);
					win._imp = imp;
					imp.useShortList(shortList);
					body.appendChild(ul);
					return true;
				}
		}
		return _listViewWinProc(hWnd, Msg, wParam, lParam);
	}

	var _RegisterFileListViewWindowClass = function() {
		var windowClass = new WNDCLASS();
		windowClass.style = WS_CHILD;
		windowClass.lpfnWndProc = _fileListViewWinProc;
		windowClass.cbClsExtra = 0;
		windowClass.cbWndExtra = 0;
		windowClass.hInstance = 0;
		windowClass.hIcon = "";
		windowClass.hCursor = "";
		windowClass.hbrBackground = 1 + COLOR_WINDOW;
		windowClass.lpszMenuName = "";
		windowClass.lpszClassName = "_jwin_fileListView";
		RegisterClass(windowClass);
	}

	var _consoleWinProc = function(hWnd, Msg, wParam, lParam) {
		var WM_ECHO = WM_USER+1;
		var win = _getWindow(hWnd);
		switch (Msg) {
 			case WM_CREATE:
				/*
				var win = _getWindow(hWnd);
				if (win && win.clientArea) {
					var appendChild = function(x, y, ht) {
						if (y.nodeType != 3 && ht) {
							y.hwnd = hWnd;
							y.ht = ht;
						}
						return x.appendChild(y);
					};
					//appendChild(win.clientArea, _createImg("cursor.gif", 16, 16), HTCLIENT);
					var iframe = createElement("iframe");
					iframe.style.backgroundColor = win.clientArea.style.backgroundColor;
					win._iframe = appendChild(win.clientArea, iframe, HTCLIENT);
				}
				*/        
				if (win && win.clientArea) {
					var inputBox = createElement("textarea");
					inputBox.name = "txt";
					inputBox.id = "txt";
					inputBox.style.width = win.clientArea.style.width;
					inputBox.style.height = win.clientArea.style.height;
					inputBox.style.backgroundColor = win.clientArea.style.backgroundColor;
					inputBox.style.color = "white";
					inputBox.value = "";
					if (inputBox.spellcheck) {
						inputBox.spellcheck = false;
					}
					inputBox._inputStyle = "x"; // Used by _getEventTarget
					win.clientArea.appendChild(inputBox);
					win._inputBox = inputBox;
					setTimeout(function(){
						inputBox.focus();
					}, 100);
				}
				break;
			case WM_SIZE:
				// Obtain the new dimensions of the client area.
				var nWidth = LOWORD(lParam);
				var nHeight = HIWORD(lParam);
				if (win._inputBox) {
					win._inputBox.style.width = nWidth + "px";
					win._inputBox.style.height = nHeight + "px";
				}
				break;
			case WM_ECHO:
				if (win._inputBox) {
					var ta = win._inputBox;
					ta.value = ta.value + lParam;
					ta._backStop = ta.value.length;
					ta.selectionStart = ta.value.length;
					ta.selectionEnd = ta.value.length;
					ta.scrollTop = ta.scrollHeight;
				}
				break;
			case WM_KEYDOWN:
				//SendMessage(hWnd, WM_USER, 0, wParam);
				if (win._inputBox) {
					var ta = win._inputBox;
					if (8 == wParam && (ta.selectionStart<ta._backStop-1 || ta.value.length<=ta._backStop)) {
						return 0;
					}
					if (38 == wParam) {
						// Up
						return 0;
					}
					if (40 ==wParam) {
						// Down
						return 0;
					}					
					if (13 == wParam) {
						var cmd = ta.value.substr(ta._backStop, ta.value.length);
						SendMessage(hWnd, WM_USER, 0, cmd);
						return 0;
					}
					return 1;
				}
				break;
			case WM_LBUTTONDOWN:
			case WM_LBUTTONUP:
				return 0;
				break;
		}
		return DefWindowProc(hWnd, Msg, wParam, lParam);
	}

	var _RegisterConsoleWindowClass = function() {
		var ConsoleWindowClass = new WNDCLASS();
		ConsoleWindowClass.style = WS_CHILD;
		ConsoleWindowClass.lpfnWndProc = _consoleWinProc;
		ConsoleWindowClass.cbClsExtra = 0;
		ConsoleWindowClass.cbWndExtra = 0;
		ConsoleWindowClass.hInstance = 0;
		ConsoleWindowClass.hIcon = "";
		ConsoleWindowClass.hCursor = "";
		ConsoleWindowClass.hbrBackground = GetStockObject(BLACK_BRUSH);
		ConsoleWindowClass.lpszMenuName = "";
		ConsoleWindowClass.lpszClassName = "jwin_console";
		RegisterClass(ConsoleWindowClass);
	}

	var _registerJwinControls = function() {
		_RegisterConsoleWindowClass();
		_RegisterFileListViewWindowClass();
	}

	InitJwinControls = function() {
		_registerJwinControls();
	}  
		
	return this;
}(); // jwin

var OleDbRest = function() {	
	this.RestCommand = function(Session, CommandString, Params) {
		this.Session = Session;
		this.CommandString = CommandString;
		this.Params = Params;
		this.Execute = function() {
			var xmlhttp = MakeXmlHttpRequest();
			if (xmlhttp) {
				var url = "http://"+this.Session.Host+CommandString;
			  	xmlhttp.open("GET", url, false);
			  	xmlhttp.send(null);
				var r = eval(xmlhttp.responseText);
				return r;
			}
		}
	}

	var RestSession = function(Host) {
		this.Host = Host;
		this.CreateCommand = function(CommandString, Params) {
			return new RestCommand(this, CommandString, Params);
		}
	}
	
	this.RestProvider = function() {
		var _splitParams = function(ConnectionString) {
			// TODO - return array of param/value pairs; key should be lower-case.
		}
		
		this.CreateSession = function(params) {
			return new RestSession(params["host"]);
		}
	}
	
	return this;
}();

var ADODB = function() {
	var _splitParams = function(ConnectionString) {
		var assignments = ConnectionString.split(";");
		var r = [];
		for (var i=0;  i<assignments.length; i++) {
			var assignment = assignments[i];
			var iPos = assignment.indexOf("=");
			if (iPos<0) {
				r[assignment.toLowerCase()] = "";
			} else {
				var key = assignment.substr(0, iPos).toLowerCase();
				var value = assignment.substr(iPos+1, assignment.length-1-key.length);
				r[key] = value;
			}
		}
		return r;
	}
	
	this.Connection = function() {
		this.ConnectionString = "";
		var _provider = null;
		var _session = null;
		var _params = null;

		var _initSession = function(context) {
			if (!_session) {
				_params = _splitParams(context.ConnectionString);
				var providerProgId = _params["provider"];
				_provider = jwin.CreateInstanceFromProgId(providerProgId);
				_session = _provider.CreateSession(_params);	
			}
		}
		
		this.Open = function() {
			_initSession(this);
		}
		
		this.Execute = function(CommandString) {
			if (!_session) {
				return null;
			}
			var command = _session.CreateCommand(CommandString, []);
			return command.Execute();
		}
	}
	
	this.Recordset = function() {
		this.Connection = null;
  }
	
	return this;
}();

