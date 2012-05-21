var console = function() {

	var CMD_ABOUT = 1;

	// We need an ID for each control on the dialog.
	// We'll use the control ID when we call CreateWindow, and later to find the control using GetDlgItem.
	var ID_CONSOLE = 1;

	var GlobalNewWindowX = 0;
	var GlobalNewWindowY = 60;

	var BuiltInConsoleWinProc;

	var CreateFileForTesting = function() {
		var hFile = CreateFile("R:\\ReadMe.txt", GENERIC_WRITE, 0, null, CREATE_NEW, FILE_ATTRIBUTE_NORMAL, null);
		if (!hFile) {
			// There was an error; silently return.  For now, we can't be sure what the error was, but probably the file was already created.
			return;
		}
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

	var NewWindow = function() {
		GlobalNewWindowX = GlobalNewWindowX + 20;
		GlobalNewWindowY = GlobalNewWindowY + 20; 
		return CreateWindow("OurWindowClass", "Command Prompt", WS_VISIBLE | WS_OVERLAPPEDWINDOW, GlobalNewWindowX, GlobalNewWindowY, 500, 340, 0, 0, 0, 0);    
	}

	var OnMenuCommand = function(hWnd, id) {
		switch (id) {
			case CMD_ABOUT:
				alert("JWin is a product of the fevered imagination of a homeless coder.");
				break;
		}
	}

	var OurWindowProc = function(hWnd, Msg, wParam, lParam) {
		switch (Msg) {
			case WM_COMMAND:
				OnMenuCommand(hWnd, LOWORD(wParam));
				return 0;
				break;
			case WM_CREATE:
				// Create Console Control.
				var dwStyle = WS_CHILD | WS_VISIBLE | ES_LEFT;
				// The initial dimensions of the console control are arbitrary - we'll be resizing it when we receive a WM_SIZE event, shortly after we finish handling WM_CREATE.
				// The 9th parameter is a handle to the menu when creating a top level window, and the control's ID when creating a child window, which is what we are doing here.
				var hwndConsole = CreateWindow("jwin_console", "", dwStyle, 20, 10, 170, 120, hWnd, ID_CONSOLE, 0, 0);
				BuiltInConsoleWinProc = GetWindowLong(hwndConsole, GWL_WNDPROC);
				SetWindowLong(hwndConsole, GWL_WNDPROC, OurConsoleWindowProc);
				setTimeout(function() {
					SendMessage(hwndConsole, WM_USER+1, 0, "Akemi JWin [Version 0]\n(C) Copyright 2011 Akemi\n");
					SendMessage(hwndConsole, WM_USER, 0, ""); // Send an empty command to force the prompt to be displayed.
			}, 100);
				break;
			case WM_SIZE:
				// Obtain the new dimensions of the client area.
				var nWidth = LOWORD(lParam);
				var nHeight = HIWORD(lParam);
				// Obtain a handle to the console control (we can have multiple notepad windows open, so we need to find the console control within the notepad window that is the recipient of the WM_SIZE message).
				var hwndConsole = GetDlgItem(hWnd, ID_CONSOLE);
				// Resize the console control to fill the client area.
				MoveWindow(hwndConsole, 0, 0, nWidth, nHeight, true);
				break;
    	}
    	return DefWindowProc(hWnd, Msg, wParam, lParam);
	}

	var OurConsoleWindowProc = function(hWnd, Msg, wParam, lParam) {
		if (WM_USER!=Msg) {
	    	return BuiltInConsoleWinProc(hWnd, Msg, wParam, lParam);		
		}
	
		var print = function(str) {
			SendMessage(hWnd, WM_USER+1, 0, str);
		}
	
		var cd = function(cmd, params) {
			var path = getImpliedPath(params);
			_chdir(path);
		}
	
		var chdrive = function(driveLetter) {
			var driveNumber = driveLetter.toUpperCase().charCodeAt(0) - 64;
			return _chdrive(driveNumber);
		}
	
		var dir = function(cmd, params) {
			var path = getImpliedPath(params);
        	print(" Volume in drive W has no label.\n");
        	print(" Volume Serial Number is AE6F-BCC7\n");
        	print("\n");
        	print(" Directory of "+path+"\n");
        	print("\n");
        	print("<DIR>          .\n");
        	print("<DIR>          ..\n"); // TODO: This should be returned from FindFirstFile/FindNextFile.
        	var numFiles = 0;
        	var numFolders = 2;
        	var d = new WIN32_FIND_DATA();
        	var h = FindFirstFile(path, d);
        	var more = INVALID_HANDLE_VALUE!=h;
        	while (more) {
            	if (_isFolder(d)) {
                	numFolders++;
                	print("<DIR>          "+d.cFileName+"\n");
            	} else {
                	numFiles++;
                	print("               "+d.cFileName+"\n");
            	}
            	more = FindNextFile(h, d);
        	}
        	FindClose(h);	
			print("               " + numFiles + " File(s)\n");
        	print("               " + numFolders + " Dir(s)\n");
		}; // dir

		var type = function(cmd, params) {
			var path = getImpliedPath(params);
			var hFile = CreateFile(path, GENERIC_READ, 0, null, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, null);
			if (hFile) {
				var str = ReadFile(hFile, 150, null);
					while (str) {
						print(str);
						var str = ReadFile(hFile, 150, null);			
					}
			}
			print("\n");
		}

    	var mkdir = function(cmd, params) {
        	var path = getImpliedPath(params);	
			var success = CreateDirectory(path);
			if (success)  {
				return;
			}
			print(cmd + "failed for "+params);
		}
	
		SendMessage(hWnd, WM_USER+1, 0, "\n");
		var pos = lParam.indexOf(" ");
		var params = "";
		if (0 > pos) {
			pos = lParam.length;
		} else {
			params = lParam.substring(pos+1, lParam.length)
		}
		var cmd = lParam.substring(0, pos);
  		// Process command.
		if (cmd) {
			switch (cmd.toLowerCase()) {
				case "cd":
                	cd(cmd, params);
					break;
				case "dir":
					dir(cmd, params);
					break;
				case "mkdir":
                	mkdir(cmd, params);
					break;
				case "type":
					type(cmd, params);
					break;
				default:
					if (cmd.length==2 && cmd.charAt(1)==":") {
						var driveLetter = cmd.charAt(0);
						if (chdrive(driveLetter)) {
							print("Drive " + driveLetter + " does not exist!\n");
						}
						break;
					}
					var msg = "'"+cmd+"' is not recognized as an internal or external command, operable program or batch file.\n";
					print(msg);
			}
		}
    	// Display prompt for next command.
    	var prompt = _getcwd() + ">";
    	print(prompt);                      
		return BuiltInConsoleWinProc(hWnd, Msg, wParam, lParam);
	}

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
	}

	WinMain = function() {
    	InitCommonControlsEx();
    	InitJwinControls();
    	RegisterOurWindowClass();
		CreateFileForTesting();
    	NewWindow();
	}

}();


