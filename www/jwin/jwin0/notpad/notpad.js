var notpad = function() {

	var CMD_NEW_WINDOW = 1;
	var CMD_CLOSE = 2;
	var CMD_CUT = 3;
	var CMD_COPY = 4;
	var CMD_PASTE = 5;
	var CMD_ABOUT = 6;

	// We need an ID for each control on the dialog.
	// We'll use the control ID when we call CreateWindow, and later to find the control using GetDlgItem.
	var ID_EDIT = 1;

	var GlobalNewWindowX = 0;
	var GlobalNewWindowY = 60;
	var hMenu = 0;

	var InitOurMenu = function() {
		// Create the drop-down menus.
		var hFileMenu = CreateMenu();
		AppendMenu(hFileMenu, MF_STRING, CMD_NEW_WINDOW, "New Window");
		AppendMenu(hFileMenu, MF_STRING, CMD_CLOSE, "Close");

		var hEditMenu = CreateMenu();
		AppendMenu(hEditMenu, MF_STRING, CMD_CUT, "Cut");
		AppendMenu(hEditMenu, MF_STRING, CMD_COPY, "Copy");
		AppendMenu(hEditMenu, MF_STRING, CMD_PASTE, "Paste");

		var hHelpMenu = CreateMenu();
		AppendMenu(hHelpMenu, MF_STRING, CMD_ABOUT, "About");

		// Create the top-level menu, and store a handle to it in a global variable.
		hMenu = CreateMenu();
		AppendMenu(hMenu, MF_POPUP, hFileMenu, "File");
		AppendMenu(hMenu, MF_POPUP, hEditMenu, "Edit");
		AppendMenu(hMenu, MF_POPUP, hHelpMenu, "Help");
	};

	var NewWindow = function() {
		GlobalNewWindowX = GlobalNewWindowX + 20;
		GlobalNewWindowY = GlobalNewWindowY + 20; 
		var hWnd = CreateWindow("OurWindowClass", "Notpad", WS_VISIBLE | WS_OVERLAPPEDWINDOW, GlobalNewWindowX, GlobalNewWindowY, 500, 340, 0, hMenu, 0, 0);
		SetMenu(hWnd, hMenu);
		return hWnd;	
	};

	var OnMenuCommand = function(hWnd, id) {
		switch (id) {
			case CMD_NEW_WINDOW:
				NewWindow();
				break;
			case CMD_CLOSE:
				SendMessage(hWnd, WM_CLOSE, 0, 0);
				break;
			case CMD_CUT:
				// Obtain a handle to the edit control (we can have multiple notepad windows open, so we need to find the edit control within the notepad window that is the recipient of the WM_SIZE message).
				var hwndEdit = GetDlgItem(hWnd, ID_EDIT);
				SendMessage(hwndEdit, WM_CUT, 0,0);
				break;
			case CMD_COPY:
				// Obtain a handle to the edit control (we can have multiple notepad windows open, so we need to find the edit control within the notepad window that is the recipient of the WM_SIZE message).
				var hwndEdit = GetDlgItem(hWnd, ID_EDIT);
				SendMessage(hwndEdit, WM_COPY, 0,0);
				break;
			case CMD_PASTE:
				// Obtain a handle to the edit control (we can have multiple notepad windows open, so we need to find the edit control within the notepad window that is the recipient of the WM_SIZE message).
				var hwndEdit = GetDlgItem(hWnd, ID_EDIT);
				SendMessage(hwndEdit, WM_PASTE, 0,0);
				break;
			case CMD_ABOUT:
				MessageBox(hWnd, "JWin is a product of the fevered imagination of a homeless coder.", "About JWin", 0);
				break;
		}
	};

	function OurWindowProc(hWnd, Msg, wParam, lParam) {
		switch (Msg) {
			case WM_COMMAND:
				OnMenuCommand(hWnd, LOWORD(wParam));
				return 0;
				break;
			case WM_CREATE:
				// Create Edit Control.
				var dwStyle = WS_CHILD | WS_VISIBLE | WS_VSCROLL | ES_LEFT | ES_MULTILINE | ES_AUTOVSCROLL;
				// The initial dimensions of the edit control are arbitrary - we'll be resizing it when we receive a WM_SIZE event, shortly after we finish handling WM_CREATE.
				// The 9th parameter is a handle to the menu when creating a top level window, and the control's ID when creating a child window, which is what we are doing here.
				CreateWindowEx(WS_EX_CLIENTEDGE, "EDIT", "", dwStyle, 20, 10, 170, 120, hWnd, ID_EDIT, 0, 0);
				break;
			case WM_SIZE:
				// Obtain the new dimensions of the client area.
				var nWidth = LOWORD(lParam);
				var nHeight = HIWORD(lParam);
				// Obtain a handle to the edit control (we can have multiple notepad windows open, so we need to find the edit control within the notepad window that is the recipient of the WM_SIZE message).
				var hwndEdit = GetDlgItem(hWnd, ID_EDIT);
				// Resize the edit control to fill the client area.
				MoveWindow(hwndEdit, 0, 0, nWidth, nHeight, true);
				break;
		}
		return DefWindowProc(hWnd, Msg, wParam, lParam);
	};

	var RegisterOurWindowClass = function() {
		var OurWindowClass = new WNDCLASS();
		OurWindowClass.style = WS_OVERLAPPEDWINDOW;
		OurWindowClass.lpfnWndProc = OurWindowProc;
		OurWindowClass.cbClsExtra = 0;
		OurWindowClass.cbWndExtra = 0;
		OurWindowClass.hInstance = 0;
		OurWindowClass.hIcon = "";
		OurWindowClass.hCursor = "";
		OurWindowClass.hbrBackground = 1+COLOR_BTNFACE;
		OurWindowClass.lpszMenuName = "";
		OurWindowClass.lpszClassName = "OurWindowClass";
		RegisterClass(OurWindowClass);
	};

	WinMain = function() {
		InitCommonControlsEx();
		InitOurMenu();
		RegisterOurWindowClass();
		NewWindow();
	}

}();
