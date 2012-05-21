/*
	This module defines the Form class which is the run-time class for forms designed
	in dot-not-studio.  The corresponding window class is "LightFormRT" whose WndProc
	is _LightFormRtProc.
	
	This module depends on jwin0.js.
	
	The convention for naming j-com members is as follows:
		prefix		meaning
		=======================
		get_		getter
		put_		setter (for primitively typed properties)
		putref_	setter (for object-type properties)
		___			private members
		raw_		public method
		fire_		fire an event (the corresponding method on the sink should be prefixed "raw_"

		j-com-visible methods always return an object which has on or more
		of the following properties:
		_hr		required		HRESULT (typically either S_OK or E_FAIL)
		_r			optional		return value (maps to the function return value in dot not studio)

	Additional conventions used in this module
		prefix		meaning
		=======================
		_			member is considered private to dnrt


*/

var libdnrt = function() {

dnrt = function() {
	var rt = this;
	var ID_MDI_CLIENT = 1;

	// Javascript inheritance technique described by Juan Medes - // http://js-bits.blogspot.com.au/2010/08/javascript-inheritance-done-right.html
	var surrogateCtor = function() {}
	rt._specialize = function(base, subclass, methods) {
		surrogateCtor.prototype = base.prototype;
		subclass.prototype = new surrogateCtor();
		subclass.prototype.constructor = subclass;
		// Add a reference to the parent's prototype
		subclass.base = base.prototype;
		// Copy the methods passed in to the prototype
		for (var name in methods) {
			subclass.prototype[name] = methods[name];
		}
		// so we can define the constructor inline
		return subclass;
	}

	rt._abstractmethod = function(name) {
		return function() {
			var prototypeName = (this.prototype && this.prototype.name)?this.prototype.name+".":"";
			throw new Error('Attempt to call abstract method "'+prototypeName+name+'".');
		};
	}

	rt.__RV = function(hr, v) {
		var r = {};
		r._hr = hr;
		r._r = v;
		return r;
	}

	rt.___rv = rt.__RV(S_OK);

	rt._RV = function(hr, v) {
		// We always return the same instance.  Totally non-thread-safe, but so is ErrObject, just like VB6.
		var r = rt.___rv;
		r._hr = hr;
		r._r = v;
		return r;
	}

	rt._OK = function(v) {
		return rt._RV(S_OK, v);
	}


	var ErrObject = function() {
		this.___ErrNumber = S_OK;
		this.___ErrDescription = "";

		this.get_ErrNumber = function() {
			return rt._OK(this.___ErrNumber);
		}

		this.get_ErrDescription = function() {
			return rt._OK(this.___ErrDescription);
		}
	}

	rt.___Err = new ErrObject();

	rt._FAIL = function(Msg) {
		rt.___Err.___ErrDescription = Msg;
		return rt._RV(E_FAIL);
	}

	rt.get_Err = function() {
		return rt._OK(rt.___Err);
	}

	rt.Unload = function(v) {
		return v._Unload();
	}

	rt.MsgBox = function(Msg) {
		var hWnd = 0;
		var uType = 0;
		MessageBox(hWnd, Msg, "Error", uType);
	}

	var ControlCollection = function() {
		this.___parent = null;
		this.___itemsByName = [];
		this.___itemsByID = [];
		this.___nextControlID = 1;

		this.get__ControlFromID = function(id) {
			return rt._OK(this.___itemsByID[id]);
		}

		this.get_Item = function(Index) {
			return rt._OK(this.___itemsByName[Index]); // TODO: Return error if Index is incorrect.
		};

		this.raw__TakeNextControlID = function() {
			var r = this.___nextControlID;
			this.___nextControlID++;
			return rt._OK(r);
		};

		this.raw_Add = function(NewItem, Index) {
			this.___itemsByName[Index] = NewItem;
			if (this.___parent) {
				NewItem.putref_Parent(this.___parent);
				this.___parent["get_"+Index] = function() { // TODO: Should check we aren't overwriting an existing member.  Also need to make sure we break the cyclic reference to NewItem when the form is unloaded.
					return rt._OK(NewItem);
				};
			} else {
				NewItem.putref_Parent(null);
			}
			var id = NewItem.get__ID()._r;
			if (!id) {
				id = this.raw__TakeNextControlID()._r;
				NewItem.put__ID(id);
			}
			// TODO: Should fail if id is already in ___itemsByID.
			this.___itemsByID[id] = NewItem;
			return rt._OK();
		};

		this.get_Parent = function() {
			return rt._OK(this.___parent);
		}

		this.putref_Parent = function(v) {
			this.___parent = v; // TODO: Should check if a Parent was previously assigned.
			return rt._OK();
		}
	
	}


	// Control

	rt.Control = function() {
		this.___id = 0;
		this.___EventSinks = [];
		this.___parent = null;
	}

	rt.Control.prototype = {
		get__ID: function() {
			return rt._OK(this.___id);
		},

		put__ID: function(NewValue) {
			this.___id = NewValue;
			return rt._OK();
		},

		raw__Advise: function(Sink) {
			this.___EventSinks[0] = Sink;
			return rt._OK();
		},

		get_Parent: function() {
			return rt._OK(this.___parent);
		},

		putref_Parent: function(v) {
			this.___parent = v; // TODO: Should check if a Parent was previously assigned.
			return rt._OK(this.___parent);
		}
	};
	rt.Control.prototype.constructor = rt.Control;


	// Menu

	rt.Menu = function(TopMenu) {
		rt.Menu.base.constructor.call(this);
		this.___hMenu = TopMenu?0:CreateMenu();
		this.___TopMenu = TopMenu;
	}

	rt._specialize(rt.Control, rt.Menu, {
		_get_hMenu: function() {
			if (!this.___hMenu) {
				this.___hMenu = CreateMenu();
			}
			return this.___hMenu;
		},

		raw_AppendItem: function(Caption) {
			var topMenu = this.___TopMenu?this.___TopMenu:this;
			if (!topMenu.___parent) {
				return rt._FAIL("Control cannot be loaded because its parent has not been set.");
			}
			var r = new rt.Menu(topMenu);
			r.___id = topMenu.___parent.get_Controls()._r.raw__TakeNextControlID()._r;
			topMenu.___NextMenuID++;
			AppendMenu(this._get_hMenu(), MF_STRING, r.___id, Caption);
			return rt._OK(r);
		},

		raw_AppendPopupMenu: function(Caption) {
			var r = new rt.Menu();
			if (this.___TopMenu) {
				r.___TopMenu = this.___TopMenu;
			} else {
				r.___TopMenu = this;
			}
			AppendMenu(this.___hMenu, MF_POPUP, r.___hMenu, Caption);
			return rt._OK(r);
		},

		fire_Click: function() { // TODO: Add more params.
			var sink = this.___EventSinks[0]; // TODO: Allow for multiple sinks.
			if (sink) {
				sink.raw_Click();
			}
		}
	});

	
	// Form

	var _LightFormRtWinClass = "LightFormRT";
	
    var _LightFormRtProc = function(hWnd, Msg, wParam, lParam) {
        switch (Msg) {
            case WM_CREATE:
	            // Create dialog controls.
	            // The 10th parameter of CreateWindowEx is a handle to the menu when creating a top level window, and the control's ID when creating a child window, which is what we are doing here.
				//var dwStyle = WS_CHILD | WS_VISIBLE;
				//var hwndOk = CreateWindowEx(0, "BUTTON", "", dwStyle, 60, 130, buttonWidth, buttonHeight, hWnd, ID_OK, 0, 0);
				//SendMessage(hwndOk, WM_SETTEXT, 0, "OK");
                break;
            case WM_ACTIVATE:
                break;
            case WM_SIZE:
                //var nWidth = LOWORD(lParam);
                //var nHeight = HIWORD(lParam);
				//var hwndOk = GetDlgItem(hWnd, ID_OK);
				//var winOk = _getWindow(hwndOk);
				//var winBorder = 4; // TOOD: The win should know this value.
				//_moveWindow(winOk, nWidth-buttonWidth-winBorder-buttonSpacing, nHeight-buttonHeight-winBorder-buttonSpacing);
                break;
			case WM_COMMAND:
				//var wmId = LOWORD(wParam);
				//var wmEvent = HIWORD(wParam);
				//switch (wmEvent) {
				//	case WM_LBUTTONUP:
				//		switch (wmId) {
				//			case ID_OK:
				//				SendMessage(hWnd, WM_CLOSE, 0, 0);
				//				break;
				//			case ID_CANCEL:
				//				SendMessage(hWnd, WM_CLOSE, 0, 0);
				//				break;
				//		}
				//		break;
				//}
				break;
		}
        return DefWindowProc(hWnd, Msg, wParam, lParam);
    };
	
	var _registerLightFormRTClass = function() {
		var winclass = new WNDCLASS();
		winclass.style = WS_OVERLAPPEDWINDOW;
		winclass.lpfnWndProc = _LightFormRtProc;
		winclass.cbClsExtra = 0;
		winclass.cbWndExtra = 0;
		winclass.hInstance = 0;
		winclass.hIcon = "";
		winclass.hCursor = "";
		winclass.hbrBackground = 1+COLOR_BTNFACE;
		winclass.lpszMenuName = "";
		winclass.lpszClassName = _LightFormRtWinClass;
		RegisterClass(winclass);
	};

	var FormBase = function() {
		this.___hWnd = 0;
		this.___EventSinks = [];
		this.___Caption = "";
		this.___Controls = new ControlCollection();
		this.___Controls.putref_Parent(this);
		this.___Menu = null;
	}

	FormBase.prototype = {
		___updateCaption: function() {
			if (this.___hWnd) {
				SendMessage(this.___hWnd, WM_SETTEXT, 0, this.___Caption);
			}
			return rt._OK();	
		},

		_Unload: function() {
			if (!this.___hWnd) {
				return rt._OK(); // Form wasn't loaded; nothing to do.
			}
			SendMessage(this.___hWnd, WM_CLOSE, 0, 0);
			fire_Unload();
			return rt._OK();
		},
		
		get_Caption: function() {
			return rt._OK(this.___Caption);
		},
		
		put_Caption: function(v) {
			if (v==this.___Caption) {
				return rt._OK();
			}

			this.___Caption = v;
			return this.___updateCaption();
		},
		
		raw_Show: function(modal) {
			// TODO: Implement modal parameter.
			this._Load();
			ShowWindow(this.___hWnd, SW_SHOW);			
		},

		get_hWnd: function() {
			this._Load();
			return rt._OK(this.___hWnd);
		},

		get_Controls: function() {
			this._Load();
			return rt._OK(this.___Controls);
		},

		get_Menu: function() {
			return rt._OK(this.___Menu);
		},

		putref_Menu: function(NewValue) {
			this._Load();
			this.___Menu = NewValue;
			SetMenu(this.___hWnd, NewValue.___hMenu);
			return rt._OK();
		},

		raw__Advise: function(Sink) {
			this.___EventSinks[0] = Sink;
			return rt._OK();
		},

		fire_Load: function() { // TODO: There's gotta be a DRYer way of defining events.
			var sink = this.___EventSinks[0]; // TODO: Allow for multiple sinks.
			if (sink) {
				sink.raw_Load();
			}
		},

		fire_Unload: function() {
			var sink = this.___EventSinks[0]; // TODO: Allow for multiple sinks.
			if (sink) {
				sink.raw_Unload();
			}
		}
	};
	FormBase.prototype._Load = rt._abstractmethod("_Load");
	FormBase.prototype.constructor = FormBase;

	rt.Form = function () {
		// Call the parent's constructor without hard coding the parent.
		rt.Form.base.constructor.call(this);
		this.___parent = null;
	}

	rt._specialize(FormBase, rt.Form, {
		_get_ParentHwnd: function() {
			var r = 0;
			if (this.___parent) {
				return this.___parent.get_hWnd();
			}
			return rt._OK(0);
		},
	
		_Load: function() {
			// Create the window unless it has already been created.
			if (this.___hWnd) {
				return;
			}
			var hwndParent = this._get_ParentHwnd()._r;
			var hwndMdiClient = 0;
			if (hwndParent) {
				hwndMdiClient = GetDlgItem(hwndParent, ID_MDI_CLIENT);
			}
			var dwStyle = WS_OVERLAPPEDWINDOW | WS_VISIBLE;
			var hwnd = CreateWindow(_LightFormRtWinClass, "", dwStyle, 100, 100, 200, 200, hwndMdiClient, 0, 0, 0);
			this.___hWnd = hwnd;
			this.fire_Load();
			this.___updateCaption();
			return rt._OK();
		},

		get_Parent: function() {
			return rt._OK(this.___parent);
		},

		putref_Parent: function(v) {
			if (v!==this.___parent) {
				if (this.___hWnd) {
					// TODO: We should actually support this.
					return rt._FAIL("Not implemented: Changing the parent of a loaded form.");
				}
				this.___parent = v;
			}
			return rt._OK();
		},

		get_MdiChild: function() {
			return rt._OK(!!this.___parent);
		}
	
	});


	// Docking 
	
	var _DockingPaneWinClass = "DockingPane";

	var _DockingPaneWinProc = function(hWnd, Msg, wParam, lParam) {
		var ctl = GetWindowLong(hWnd, GWL_USERDATA);

		return DefWindowProc(hWnd, Msg, wParam, lParam);
	};

	var _registerDockingPaneClass = function() {
		var winclass = new WNDCLASS();
		winclass.style = WS_CHILD | WS_VISIBLE;
		winclass.lpfnWndProc = _DockingPaneWinProc;
		winclass.cbClsExtra = 0;
		winclass.cbWndExtra = 0;
		winclass.hInstance = 0;
		winclass.hIcon = "";
		winclass.hCursor = "";
		winclass.hbrBackground = 1 + COLOR_WINDOW;
		winclass.lpszMenuName = "";
		winclass.lpszClassName = _DockingPaneWinClass;
		RegisterClass(winclass);
	}

	rt.DockingPane = function() {
		this.___hWnd = 0;
		this.___hWndParent = null;
		this.___side = 0;
		this.___overlapNextSide = false;

		this._Load = function() {
			// Create the window unless it has already been created.
			if (this.___hWnd) {
				return 0;
			}
			var hwndParent = this.___hWndParent;
			if (!hwndParent) {
				throw new Error("Docking pane cannot be initialized because its parent has not been set.");
			}
			var ControlID = 0;
			var dwStyle = WS_CHILD | WS_VISIBLE;
			this.___hWnd = CreateWindow(_DockingPaneWinClass, "", dwStyle, 0, 0, 100, 100, hwndParent, ControlID, 0, 0);
			return rt._OK();
		};

		this.Initialize = function(hwndParent, side, overlapNextSide) {
			this.___hWndParent = hwndParent;
			this.___side = side;
			this.___overlapNextSide = overlapNextSide;
			this._Load();
		}
	};


	// MDIForm
	
	var _LightMdiFormRtWinClass = "LightMdiFormRT";

	var _LightMdiFormRtProc = function(hWnd, Msg, wParam, lParam){
		// Obtain a handle to the MDIClient window.  We can have multiple MdiFrame windows open, so we need to find the MdiClient window within the MdiFrame window that is the recipient of the WM_SIZE message.
		var hwndMdiClient = GetDlgItem(hWnd, ID_MDI_CLIENT);
		var form = GetWindowLong(hWnd, GWL_USERDATA);

		switch (Msg)
		{
		case WM_CREATE:
				var dwStyle = WS_CHILD | WS_VISIBLE | WS_VSCROLL;
			CreateWindowEx(WS_EX_CLIENTEDGE, "MDIClient", "", dwStyle, 0, 0, 860, 540, hWnd, ID_MDI_CLIENT, 0, 0);
				break;
		case WM_SIZE:
		    // Obtain the new dimensions of the client area.
		    var nWidth = LOWORD(lParam);
		    var nHeight = HIWORD(lParam);
		    // Resize the MdiClient window to fill the client area.
		    MoveWindow(hwndMdiClient, 0, 0, nWidth, nHeight, true);
		    break;
		case WM_ACTIVATE:
			// It is up to the host window to pass this message on to the MdiClient window.
			SendMessage(hwndMdiClient, Msg, wParam, lParam);
			break;
		case WM_COMMAND:
			var wmId = LOWORD(wParam);
			var wmEvent = HIWORD(wParam);
			switch (wmEvent) {
				case 0:
					var ctl = form.get_Controls()._r.get__ControlFromID(wmId)._r;
					if (ctl && ctl["fire_Click"]) {
						ctl.fire_Click();
					}
			};
			break;
		}

	    return DefWindowProc(hWnd, Msg, wParam, lParam);
	}

	var _registerLightMdiFormRTClass = function() {
	    var OurWindowClass = new WNDCLASS();
	    OurWindowClass.style = WS_OVERLAPPEDWINDOW;
	    OurWindowClass.lpfnWndProc = _LightMdiFormRtProc;
	    OurWindowClass.cbClsExtra = 0;
	    OurWindowClass.cbWndExtra = 0;
	    OurWindowClass.hInstance = 0;
	    OurWindowClass.hIcon = "";
	    OurWindowClass.hCursor = "";
	    OurWindowClass.hbrBackground = 1+COLOR_BTNFACE; // 1+COLOR_BTNFACE;
	    OurWindowClass.lpszMenuName = "";
	    OurWindowClass.lpszClassName = _LightMdiFormRtWinClass;
	    RegisterClass(OurWindowClass);
	}

	rt.MDIForm = function () {
		// Call the parent's constructor without hard coding the parent.
		rt.MDIForm.base.constructor.call(this);
	}

	rt._specialize(FormBase, rt.MDIForm, {
		_Load: function() {
			// Create the window unless it has already been created.
			if (this.___hWnd) {
				return;
			}
			var dwStyle = WS_OVERLAPPEDWINDOW | WS_VISIBLE;
			var hwnd = CreateWindow(_LightMdiFormRtWinClass, "", dwStyle, 20, 20, 900, 560, 0, 0, 0, 0);
			this.___hWnd = hwnd;
			SetWindowLong(hwnd, GWL_USERDATA, this);
			this.fire_Load();
			this.___updateCaption();
			return rt._OK();
		}
	});

	// CommandButton
	var _LightButtonRtWinClass = "LightButtonRT";
	
    var _LightButtonRtProc = function(hWnd, Msg, wParam, lParam) {
		var ctl = GetWindowLong(hWnd, GWL_USERDATA);
        switch (Msg) {
            case WM_CREATE:
				break;
			case WM_LBUTTONDOWN:
				break;
			case WM_LBUTTONUP:
				ctl.___SuperClassWndProc(hWnd, Msg, wParam, lParam);
				ctl.fire_Click();
				return false;
		}
        //return DefWindowProc(hWnd, Msg, wParam, lParam);
		return ctl.___SuperClassWndProc(hWnd, Msg, wParam, lParam);
	};

	var _registerLightButtonRTClass = function() {
		var winclass = new WNDCLASS();
		winclass.style = WS_CHILD;
		winclass.lpfnWndProc = _LightButtonRtProc;
		winclass.cbClsExtra = 0;
		winclass.cbWndExtra = 0;
		winclass.hInstance = 0;
		winclass.hIcon = "";
		winclass.hCursor = "";
		winclass.hbrBackground = 1+COLOR_BTNFACE;
		winclass.lpszMenuName = "";
		winclass.lpszClassName = _LightButtonRtWinClass;
		RegisterClass(winclass);
	};

	rt.Button = function() {
		rt.Menu.base.constructor.call(this);
		this.___hWnd = 0;
		this.___Caption = "";
		this.___SuperClassWndProc = null;
	}

	rt._specialize(rt.Control, rt.Button, {
		_Load: function() {
			if (!this.___parent) {
				return rt._FAIL("Control cannot be loaded because its parent has not been set.");
			}

			// Create the window unless it has already been created.
			if (this.___hWnd) {
				return rt._OK();
			}

			var hwndParent = this.___parent.get_hWnd()._r;
			var dwStyle = WS_CHILD | WS_VISIBLE;
			//var hwnd = CreateWindow(_LightButtonRtWinClass, "", dwStyle, 100, 100, 200, 200, 0, 0, 0, 0);
			var hwnd = CreateWindow("BUTTON", "", dwStyle, 50, 60, 80, 30, hwndParent, this.___id, 0, 0);
			this.___hWnd = hwnd;

			// Subclass the window (TODO: Should we have GetClassLong rather than obtaining this proc each time we create a button).
			this.___SuperClassWndProc = GetWindowLong(hwnd, GWL_WNDPROC);
			SetWindowLong(hwnd, GWL_WNDPROC, _LightButtonRtProc);
			SetWindowLong(hwnd, GWL_USERDATA, this);

			return rt._OK();
		},
		
		get_Caption: function() {
			return rt._OK(this.___Caption);
		},
		
		put_Caption: function(v) {
			this._Load();
			this.___Caption = v;
			SendMessage(this.___hWnd, WM_SETTEXT, 0, v);
			return rt._OK();
		},
	
		raw_Show: function(modal) {
			// TODO: Implement modal parameter.
			this._Load();
			ShowWindow(this.___hWnd, SW_SHOW);
			return rt._OK();			
		},

		fire_Click: function() { // TODO: Add more params.
			var sink = this.___EventSinks[0]; // TODO: Allow for multiple sinks.
			if (sink) {
				sink.raw_Click();
			}
		}
	});


	var Initialize = function() {
		InitCommonControlsEx();
		_registerLightFormRTClass();
		_registerLightMdiFormRTClass();
		_registerLightButtonRTClass();
		_registerDockingPaneClass();
	};

	Initialize();
	
};

}();


