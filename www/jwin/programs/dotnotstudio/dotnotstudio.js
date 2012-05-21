var rt = new dnrt();

var dotnotstudio = function() {
	var _DnsCodeWinClass = "DotNotStudioCodeWindow";
	var GlobalNewWindowX = 0;
	var GlobalNewWindowY = 0;

	var CMD_NEW_PROJECT = 1;
	var CMD_EXIT = 2;
	var CMD_CUT = 3;
	var CMD_COPY = 4;
	var CMD_PASTE = 5;
	var CMD_VIEW_SOLUTION_EXPLORER = 6;
	var CMD_VIEW_TOOLBOX = 7;
	var CMD_VIEW_REFERENCES = 8;
	var CMD_ADD_MODULE = 9;
	var CMD_ADD_CLASS = 10;
	var CMD_ADD_FORM = 11;

    var _DnsCodeWinProc = function(hWnd, Msg, wParam, lParam) {
		var ID_SCIWIN = 1;
        switch (Msg) {
            case WM_CREATE:
	            // Create dialog controls.
	            // The 10th parameter of CreateWindowEx is a handle to the menu when creating a top level window, and the control's ID when creating a child window, which is what we are doing here.
				//var dwStyle = WS_CHILD | WS_VISIBLE;
				var dwStyle = WS_CHILD | WS_VISIBLE | WS_VSCROLL | ES_LEFT | ES_MULTILINE | ES_AUTOVSCROLL;
				//var hwndCodeWindow = CreateWindowEx(WS_EX_CLIENTEDGE, "SciWin", "", dwStyle, 0, 0, 500, 380, hWnd, 0, 0, 0);
				var hwndSci = CreateWindowEx(0, "SciWin", "", dwStyle, 0, 0, 500, 380, hWnd, ID_SCIWIN, 0, 0);
				//SendMessage(hwndCodeWindow, WM_SETTEXT, 0, "Option Explicit\n\n");
                break;
            case WM_ACTIVATE:
                break;
            case WM_SIZE:
				// Obtain the new dimensions of the client area.
                var nWidth = LOWORD(lParam);
                var nHeight = HIWORD(lParam);
				var hwndSci = GetDlgItem(hWnd, ID_SCIWIN);
				var winBorder = 4; // TOOD: The win should know this value.
				MoveWindow(hwndSci, 0, 0, nWidth, nHeight);
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
    }
	
	var _registerDotNotCodeWindow = function() {
		var winclass = new WNDCLASS();
		winclass.style = WS_OVERLAPPEDWINDOW | WS_CHILD;
		winclass.lpfnWndProc = _DnsCodeWinProc;
		winclass.cbClsExtra = 0;
		winclass.cbWndExtra = 0;
		winclass.hInstance = 0;
		winclass.hIcon = "";
		winclass.hCursor = "";
		winclass.hbrBackground = 1 + COLOR_WINDOW;
		winclass.lpszMenuName = "";
		winclass.lpszClassName = _DnsCodeWinClass;
		RegisterClass(winclass);
	}

	var ID_MDI_CLIENT = 1;
	
    var _DnsMainWinProc = function(hWnd, Msg, wParam, lParam) {
		// TODO: This proc currently not being called because we haven't subclassed the window.
		var hwndMdiClient = GetDlgItem(hWnd, ID_MDI_CLIENT);

        switch (Msg) {
            case WM_CREATE:
				// Create the MDIClient window.
				var dwStyle = WS_CHILD | WS_VISIBLE;
				hwndMdiClient = CreateWindowEx(WS_EX_CLIENTEDGE, "MDIClient", "", dwStyle, 0, 0, 100, 100, hWnd, ID_MDI_CLIENT, 0, 0);
	            // Create dialog controls.
				var DockingPane0 = new rt.DockingPane();
				DockingPane0.Initialize(hWnd, 0);
                break;
            case WM_SIZE:
                var nWidth = LOWORD(lParam);
                var nHeight = HIWORD(lParam);
				MoveWindow(hwndMdiClient, 0, 0, nWidth, nHeight, true);
                break;
		}
        return DefWindowProc(hWnd, Msg, wParam, lParam);
    }

	var DnsMainWindow = function() {
		DnsMainWindow.base.constructor.call(this);
		this.___DocumentCount = [];
		this.___DocumentCount["Module"] = 0;
		this.___DocumentCount["Class"] = 0;
		this.___DocumentCount["Form"] = 0;

		// Form event wiring.
		var sink_Form = {};
		sink_Form.___parent = this;
		sink_Form.raw_Load = this.raw_Form_Load;
		this.raw__Advise(sink_Form);
	}

	rt._specialize(rt.MDIForm, DnsMainWindow, {
		raw_Form_Load: function() {
			var Me = this.___parent;
			Me.put_Caption("Dot Not Studio");
		},

		raw_MenuAddModule_OnClick: function() {
			var Me = this.___parent;
			var hwnd = Me.get_hWnd()._r;
			var hwndMdiClient = GetDlgItem(hwnd, ID_MDI_CLIENT);
			dwStyle = WS_OVERLAPPEDWINDOW | WS_CHILD | WS_VISIBLE | WS_THICKFRAME;
			Me.___DocumentCount["Module"]++;
			caption = "Module" + Me.___DocumentCount["Module"];
			var hwndCodeWindow = CreateWindowEx(0, _DnsCodeWinClass, caption, dwStyle, 40, 30, 500, 380, hwndMdiClient, 0, 0, 0);
			return rt._OK();
		}
	});

	var NewMainWindow = function() {
		GlobalNewWindowX = GlobalNewWindowX + 20;
		GlobalNewWindowY = GlobalNewWindowY + 20;
		var MainWindow = new DnsMainWindow(); 
		var MainWindowControls = MainWindow.get_Controls()._r;

		var MainMenu = new rt.Menu();
		MainWindowControls.raw_Add(MainMenu, "_Menu");

		var FileMenu = MainMenu.raw_AppendPopupMenu("File")._r;
		FileMenu.raw_AppendItem("New Project");
		FileMenu.raw_AppendItem("Exit");

		var EditMenu = MainMenu.raw_AppendPopupMenu("Edit")._r;
		EditMenu.raw_AppendItem("Cut");
		EditMenu.raw_AppendItem("Copy");
		EditMenu.raw_AppendItem("Paste");

		var ViewMenu = MainMenu.raw_AppendPopupMenu("View")._r;
		ViewMenu.raw_AppendItem("Solution Explorer");
		ViewMenu.raw_AppendItem("Toolbox");

		var ProjectMenu = MainMenu.raw_AppendPopupMenu("Project")._r;
		ProjectMenu.raw_AppendItem("References");
		MainWindowControls.raw_Add(ProjectMenu.raw_AppendItem("Add Module")._r, "MenuAddModule");
		ProjectMenu.raw_AppendItem("Add Class");
		ProjectMenu.raw_AppendItem("Add Form");

		MainWindow.putref_Menu(MainMenu);

		// Event wiring.
		var sink_MenuAddModule = {};
		sink_MenuAddModule.___parent = MainWindow;
		sink_MenuAddModule.raw_Click = MainWindow.raw_MenuAddModule_OnClick;
		MainWindow.get_MenuAddModule()._r.raw__Advise(sink_MenuAddModule);

		return MainWindow;
	}
	
	WinMain = function() {
		InitCommonControlsEx();
		InitJwinControls();
		InitScintillaControl();
		
		_registerDotNotCodeWindow();
		
		NewMainWindow();
	}
	
}();
