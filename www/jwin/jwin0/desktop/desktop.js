var desktop = function() {
	var themeRoot = "/jwin/themes"; // Duplicates local variable in jwin.
	var backgroundsFolder = themeRoot + "/Backgrounds/";
	var defaultDesktopBackgroundPath = backgroundsFolder + "SydneyPark.jpg";
	var desktopBackgroundPath = defaultDesktopBackgroundPath;

	var CMD_STARMENU = 1;

	// We need an ID for each control on the dialog.
	// We'll use the control ID when we call CreateWindow, and later to find the control using GetDlgItem.
	var ID_TASKBAR = 1;
	var ID_STARBUTTON = 2;

	var GlobalNewWindowX = 0;
	var GlobalNewWindowY = 0;

	var hmenuStar = 0;
	var hwndDesktop = 0;

	var winW = 0, winH = 0;

var getInnerDimensions = function() {
// http://www.javascripter.net/faq/browserw.htm
// The following code sets the variables winW and winH to the inner width and height of the browser window, and outputs the width and height values. If the user has a very old browser, then winW and winH are set to 630 and 460, respectively. 
// TODO: Put this functionality in jwin0.js

winW = 630;
winH = 460;
if (document.body && document.body.offsetWidth) {
 winW = document.body.offsetWidth;
 winH = document.body.offsetHeight;
}
if (document.compatMode=='CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetWidth ) {
 winW = document.documentElement.offsetWidth;
 winH = document.documentElement.offsetHeight;
}
if (window.innerWidth && window.innerHeight) {
 winW = window.innerWidth;
 winH = window.innerHeight;
}
}

	var CreateFileForTesting = function() {
		var hFile = CreateFile("R:\\ReadMe.txt", GENERIC_WRITE, 0, null, CREATE_NEW, FILE_ATTRIBUTE_NORMAL, null);
		var content = "Welcome to JWin.";
	WriteFile(hFile, content, content.length, null);
	CloseHandle(hFile);
	
		var hFile = CreateFile("R:\\ReadMe.txt", GENERIC_READ, 0, null, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, null);
	if (hFile) {
			var str = ReadFile(hFile, 150, null);
			while (str) {
				//alert(str);
				var str = ReadFile(hFile, 150, null);			
			}
		}
	}

	var GetCurrentDriveLetter = function() {
		return String.fromCharCode(_getdrive()+64);
	}

	var getImpliedPath = function(specifiedPath) {
		if (specifiedPath) {
			if (specifiedPath.length >= 2 && ":" == specifiedPath.charAt(1)) {
				if (specifiedPath.length >= 3) {
					return specifiedPath; // specifiedPath is absolute.
				} else {
					// Current directory on specified drive.
                	var driveLetter = specifiedPath.charAt(0);
                	return _getdcwd(driveLetter.charCodeAt(0) - 64);
				}
			}
			if ("\\" == specifiedPath.charAt(0)) {
				return GetCurrentDriveLetter() + ":" + specifiedPath;
			}
			return _combinePath(_getcwd(), specifiedPath);
		} else {
			return _getcwd();
		}
	}

	TaskbarWinProc = function(hWnd, Msg, wParam, lParam) {
		if (hwndDesktop && (Msg==WM_COMMAND)) {
			// TODO: We shouldn't need to forward these messages ourselves.
			return SendMessage(hwndDesktop, Msg, wParam, lParam);
		}
    	return DefWindowProc(hWnd, Msg, wParam, lParam);
	}

	var RegisterTaskbarWindowClass = function() {
		var TaskbarWindowClass = new WNDCLASS();
		TaskbarWindowClass.style = 0;
		TaskbarWindowClass.lpfnWndProc = TaskbarWinProc;
		TaskbarWindowClass.cbClsExtra = 0;
		TaskbarWindowClass.cbWndExtra = 0;
		TaskbarWindowClass.hInstance = 0;
		TaskbarWindowClass.hIcon = "";
		TaskbarWindowClass.hCursor = "";
		TaskbarWindowClass.hbrBackground = 1+COLOR_BTNFACE;
		TaskbarWindowClass.lpszMenuName = "";
		TaskbarWindowClass.lpszClassName = "Taskbar";
		RegisterClass(TaskbarWindowClass);
	}

	var DesktopWindowProc = function(hWnd, Msg, wParam, lParam) {
		var cxStarButton = 30;
		var cyStarButton = 21;
		var cyTaskbar = cyStarButton+8;
		var cxTaskbar = winW;
		var y = winH - cyTaskbar;

		switch (Msg) {
			case WM_COMMAND:
				var id = LOWORD(wParam);
				switch (id) {
					case ID_STARBUTTON:
						// TODO: Fix ShowPopupMenu to point menu up or down depending on position and overlap with edge of browser window.
						ShowPopupMenu(hWnd, hmenuStar, 0, winH-100);
						break;
					case 99:
						RunJwinApp("/jwin/jwin0/file_manager_lite/file_manager_lite.js");
						break;
					case 100:
						RunJwinApp("/jwin/jwin0/notpad/notpad.js");
						break;
					case 101:
						RunJwinApp("/jwin/jwin0/console/console.js");
						break;
					case 102:
						// TODO: The application should call _LoadLibrary for itself.
						//_LoadLibrary("/jwin/dnrt0.js");
						_LoadLibrary("/jwin/jwin0/lib/scintilla.js");
						RunJwinApp("/jwin/programs/dotnotstudio/dotnotstudio.js");
						break;
				}
				return 0;
				break;
			case WM_CREATE:
				// Create Taskbar Control.
				var dwStyle = WS_CHILD | WS_VISIBLE | ES_LEFT;
				// The 9th parameter is a handle to the menu when creating a top level window, and the control's ID when creating a child window, which is what we are doing here.
				var hwndTaskbar = CreateWindow("Taskbar", "", dwStyle, 0, y, cxTaskbar, cyTaskbar, hWnd, ID_TASKBAR, 0, 0);
				var hwndStarButton = CreateWindow("BUTTON", "*", dwStyle, 2, 4, cxStarButton, cyStarButton, hwndTaskbar, ID_STARBUTTON, 0, 0);
				var win = _GetWindow(hWnd);
				if (win && win.clientArea) {
					var desktopBackgroundImg = _CreateImg(desktopBackgroundPath, winW, winH);
					win.clientArea.appendChild(desktopBackgroundImg);
				}
				break;
			case WM_SIZE:
				// TODO: Send this message when browser window is resized.
				// Obtain the new dimensions of the client area.
				var nWidth = LOWORD(lParam);
				var nHeight = HIWORD(lParam);
				//var hwndStarButton = GetDlgItem(hWnd, ID_STARBUTTON);
				MoveWindow(hwndStarButton, 0, nHeight-cyTaskbar, nWidth, cyTaskbar, true);
				break;
    	}
    	return DefWindowProc(hWnd, Msg, wParam, lParam);
	}

	var RegisterDesktopWindowClass = function() {
		var DesktopWindowClass = new WNDCLASS();
		DesktopWindowClass.style = 0;
		DesktopWindowClass.lpfnWndProc = DesktopWindowProc;
		DesktopWindowClass.cbClsExtra = 0;
		DesktopWindowClass.cbWndExtra = 0;
		DesktopWindowClass.hInstance = 0;
		DesktopWindowClass.hIcon = "";
		DesktopWindowClass.hCursor = "";
		DesktopWindowClass.hbrBackground = 1+COLOR_DESKTOP;
		DesktopWindowClass.lpszMenuName = "";
		DesktopWindowClass.lpszClassName = "Desktop";
		RegisterClass(DesktopWindowClass);
	}

	var RegisterDesktopWindowClasses = function() {
		RegisterTaskbarWindowClass();
		RegisterDesktopWindowClass();
	}

	var InitStarMenu = function() {
		var r = CreateMenu();
		AppendMenu(r, MF_STRING, 99, "File Manager Lite");
		AppendMenu(r, MF_STRING, 100, "Notpad");
		AppendMenu(r, MF_STRING, 101, "Console");
		AppendMenu(r, MF_STRING, 102, "Dot Not Studio");
		//AppendMenu(r, MF_STRING, 102, "Log out of JWin");
		return r;
	}

	WinMain = function() {
    	InitCommonControlsEx();
    	InitJwinControls();
    	RegisterDesktopWindowClasses();
		CreateFileForTesting();

		hmenuStar = InitStarMenu();
		getInnerDimensions();
		var cx = winW;
		var cy = winH;
		hwndDesktop = CreateWindow("Desktop", "", WS_VISIBLE, 0, 0, cx, cy, 0, 0, 0, 0);    
	}

}();


