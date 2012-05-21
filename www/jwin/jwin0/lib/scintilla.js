/*! Inspired by Scintilla by Neil Hodgson - see http://scintilla.org */

var scintilla = function() {
	// A syntax-highlighting code-editor control inspired by scintilla
	var _SciWinClass = "SciWin";

	SCI_STYLECLEARALL = 2050;
	SCI_STYLESETFORE = 2051;
	SCI_STYLESETBACK = 2052;
	SCI_STYLESETBOLD = 2053;
	SCI_STYLESETITALIC = 2054;
	SCI_STYLESETSIZE = 2055;
	SCI_STYLESETFONT = 2056;
	SCI_STYLESETEOLFILLED = 2057;
	SCI_STYLERESETDEFAULT = 2058;
	SCI_STYLESETUNDERLINE = 2059;
	SCI_AUTOCSETFILLUPS = 2112;
	SCI_GETLENGTH = 2006;
	SCI_CLEAR = 2180;
	SCI_SETTEXT = 2181;
	SCI_GETTEXT = 2182;
	SCI_SELECTALL = 2013;
	SCI_SETSAVEPOINT = 2014;
	SCI_STYLEGETFORE = 2481;
	SCI_STYLEGETBACK = 2482;
	SCI_STYLEGETBOLD = 2483;
	SCI_STYLEGETITALIC = 2484;
	SCI_STYLEGETSIZE = 2485;
	SCI_STYLEGETFONT = 2486;
	SCI_STYLEGETEOLFILLED = 2487;
	SCI_STYLEGETUNDERLINE = 2488;
	SCI_GETCHARAT = 2007;
	SCI_GETCURRENTPOS = 2008;
	SCI_GETANCHOR = 2009;
	SCI_GETSTYLEAT = 2010;
	SCI_GETVIEWWS = 2020;
	SCI_SETVIEWWS = 2021;
	SCI_GOTOLINE = 2024;
	SCI_GOTOPOS = 2025;
	SCI_SETANCHOR = 2026;
	SCI_GETCURLINE = 2027;
	SCI_GETENDSTYLED = 2028;
	SCI_STARTSTYLING = 2032;
	SCI_SETSTYLING = 2033;
	SCI_SETSTYLEBITS = 2090;
	SCI_GETSTYLEBITS = 2091;
	SCI_SETLINESTATE = 2092;
	SCI_GETLINESTATE = 2093;
	SCI_GETMAXLINESTATE = 2094;
	SCI_APPENDTEXT = 2282;
	SCI_GETTEXTLENGTH = 2183;
	SCI_GETFIRSTVISIBLELINE = 2152;
	SCI_GETLINE = 2153;
	SCI_GETLINECOUNT = 2154;
	SCI_SETFIRSTVISIBLELINE = 2613;
	SCI_LINESONSCREEN = 2370;
	SCI_GETMODIFY = 2159;
	SCI_SETSEL = 2160;
	SCI_SETCURRENTPOS = 2141;
	SCI_SETSELECTIONSTART = 2142;
	SCI_GETSELECTIONSTART = 2143;
	SCI_SETSELECTIONEND = 2144;
	SCI_GETSELECTIONEND = 2145;
	SCI_LINEFROMPOSITION = 2166;
	SCI_POSITIONFROMLINE = 2167;
	SCI_REPLACESEL = 2170;
	SCI_GETREADONLY = 2140;
	SCI_SETREADONLY = 2171;
	SCI_GETTEXTRANGE = 2162;
	SCI_ADDTEXT = 2001;
	SCI_INSERTTEXT = 2003;
	SCI_SETLEXER = 4001;
	SCI_GETLEXER = 4002;
	SCI_SETLEXERLANGUAGE = 4006;
	SCI_GETLEXERLANGUAGE = 4012;
	SCI_LOADLEXERLIBRARY = 4007;
	SCI_COLOURISE = 4003;
	SCI_SETTABWIDTH = 2036;
	SCI_GETTABWIDTH = 2121;
	SCI_SETINDENT = 2122;
	SCI_GETINDENT = 2123;
	SCI_SETUSETABS = 2124;
	SCI_GETUSETABS = 2125;
	SCI_SETTABINDENTS = 2260;
	SCI_GETTABINDENTS = 2261;
	SCI_SETBACKSPACEUNINDENTS = 2262;
	SCI_GETBACKSPACEUNINDENTS = 2263;
	SCI_SETINDENTATIONGUIDES = 2132;
	SCI_GETINDENTATIONGUIDES = 2133;
	SCI_SETHIGHLIGHTGUIDE = 2134;
	SCI_GETHIGHLIGHTGUIDE = 2135;
	SCI_GETLINEENDPOSITION = 2136;
	
	var createElement = function(x) {
		return document.createElement(x);
	}
	
    var _SciWinProc = function(hWnd, Msg, wParam, lParam) {
        var win = _GetWindow(hWnd);
        if (!win) {
            return 0;
        }
        switch (Msg) {
			case WM_CREATE:
				if (win && win.clientArea) {
					var container = createElement("div");
					container.className = "code";
					var container1 = createElement("div");
					container1.className = "VisualBasic";
					var container2 = createElement("code");
					var container3 = createElement("pre");
					container.appendChild(container1);
					container1.appendChild(container2);
					container2.appendChild(container3);
					var s = container3.style;
					s.margin = "0px";
					s.padding = "0px";
					
					var s = container2.style;
					s.margin = "0px";
					s.padding = "0px";
					var s = container1.style;
					s.margin = "0px";
					s.padding = "0px";
					var s = container.style;
					s.margin = "0px";					
					s.padding = "0px";
					s.width = "100%";
					s.height = "100%";
					s.position = "absolute";
					s.overflow = "auto";
					//s.marginLeft = 8;
					//s.marginTop = 8;
					
					var content = createElement("div");
					content.name = "txt";
					content.id = "txt";
					//content.innerHTML = '<div class="code"><div class="VisualBasic"><code><pre><div class="blockLevel0"><span class="keyword">Option Explicit\n<span class="comment">\' This is a comment.</span>\n';
					content.innerHTML = '<span class="keyword">Option Explicit\n<span class="comment">\' This is a comment.</span>\n';
					content.contentEditable = true;
					s = content.style;
					//s.width = win.clientArea.style.width;
					//s.height = win.clientArea.style.height;
					s.width = "auto";
					s.height = "auto";
					s.position = "absolute";
					content._inputStyle = "x"; // Used by _getEventTarget
					s.border = 0;
					container3.appendChild(content);
					win.clientArea.appendChild(container);
					win._inputBox = content;
					setTimeout(function(){
						content.focus();
					}, 100);
				}
				return true;
				break;
            case WM_ACTIVATE:
                break;
            case WM_SIZE:
                //var nWidth = LOWORD(lParam);
                //var nHeight = HIWORD(lParam);
				//var hwndOk = GetDlgItem(hWnd, ID_OK);
				//var winOk = _GetWindow(hwndOk);
				//var winBorder = 4; // TODO: The win should know this value.
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
			case SCI_STYLECLEARALL:
				break;
			case SCI_STYLESETFORE:
				break;
			case SCI_STYLESETBACK:
				break;
			case SCI_STYLESETBOLD:
				break;
			case SCI_STYLESETITALIC:
				break;
			case SCI_STYLESETSIZE:
				break;
			case SCI_STYLESETFONT:
				break;
			case SCI_STYLESETEOLFILLED:
				break;
			case SCI_STYLERESETDEFAULT:
				break;
			case SCI_STYLESETUNDERLINE:
				break;
			case SCI_AUTOCSETFILLUPS:
				break;
			case SCI_GETLENGTH:
				break;
			case SCI_CLEAR:
				break;
			case SCI_SETTEXT:
				break;
			case SCI_GETTEXT:
				break;
			case SCI_SELECTALL:
				break;
			case SCI_SETSAVEPOINT:
				break;
			case SCI_STYLEGETFORE:
				break;
			case SCI_STYLEGETBACK:
				break;
			case SCI_STYLEGETBOLD:
				break;
			case SCI_STYLEGETITALIC:
				break;
			case SCI_STYLEGETSIZE:
				break;
			case SCI_STYLEGETFONT:
				break;
			case SCI_STYLEGETEOLFILLED:
				break;
			case SCI_STYLEGETUNDERLINE:
				break;
			case SCI_GETCHARAT:
				break;
			case SCI_GETCURRENTPOS:
				break;
			case SCI_GETANCHOR:
				break;
			case SCI_GETSTYLEAT:
				break;
			case SCI_GETVIEWWS:
				break;
			case SCI_SETVIEWWS:
				break;
			case SCI_GOTOLINE:
				break;
			case SCI_GOTOPOS:
				break;
			case SCI_SETANCHOR:
				break;
			case SCI_GETCURLINE:
				break;
			case SCI_GETENDSTYLED:
				break;
			case SCI_STARTSTYLING:
				break;
			case SCI_SETSTYLING:
				break;
			case SCI_SETSTYLEBITS:
				break;
			case SCI_GETSTYLEBITS:
				break;
			case SCI_SETLINESTATE:
				break;
			case SCI_GETLINESTATE:
				break;
			case SCI_GETMAXLINESTATE:
				break;
			case SCI_APPENDTEXT:
				break;
			case SCI_GETTEXTLENGTH:
				break;
			case SCI_GETFIRSTVISIBLELINE:
				break;
			case SCI_GETLINE:
				break;
			case SCI_GETLINECOUNT:
				break;
			case SCI_SETFIRSTVISIBLELINE:
				break;
			case SCI_LINESONSCREEN:
				break;
			case SCI_GETMODIFY:
				break;
			case SCI_SETSEL:
				break;
			case SCI_SETCURRENTPOS:
				break;
			case SCI_SETSELECTIONSTART:
				break;
			case SCI_GETSELECTIONSTART:
				break;
			case SCI_SETSELECTIONEND:
				break;
			case SCI_GETSELECTIONEND:
				break;
			case SCI_LINEFROMPOSITION:
				break;
			case SCI_POSITIONFROMLINE:
				break;
			case SCI_REPLACESEL:
				break;
			case SCI_GETREADONLY:
				break;
			case SCI_SETREADONLY:
				break;
			case SCI_GETTEXTRANGE:
				break;
			case SCI_ADDTEXT:
				break;
			case SCI_INSERTTEXT:
				break;
			case SCI_SETLEXER:
				break;
			case SCI_GETLEXER:
				break;
			case SCI_SETLEXERLANGUAGE:
				break;
			case SCI_GETLEXERLANGUAGE:
				break;
			case SCI_LOADLEXERLIBRARY:
				break;
			case SCI_COLOURISE:
				break;
			case SCI_SETTABWIDTH:
				break;
			case SCI_GETTABWIDTH:
				break;
			case SCI_SETINDENT:
				break;
			case SCI_GETINDENT:
				break;
			case SCI_SETUSETABS:
				break;
			case SCI_GETUSETABS:
				break;
			case SCI_SETTABINDENTS:
				break;
			case SCI_GETTABINDENTS:
				break;
			case SCI_SETBACKSPACEUNINDENTS:
				break;
			case SCI_GETBACKSPACEUNINDENTS:
				break;
			case SCI_SETINDENTATIONGUIDES:
				break;
			case SCI_GETINDENTATIONGUIDES:
				break;
			case SCI_SETHIGHLIGHTGUIDE:
				break;
			case SCI_GETHIGHLIGHTGUIDE:
				break;
			case SCI_GETLINEENDPOSITION:
				break;
		}
		return _editWinProc(hWnd, Msg, wParam, lParam);
        //return DefWindowProc(hWnd, Msg, wParam, lParam);
    }
	
	InitScintillaControl = function() {
		var winclass = new WNDCLASS();
		winclass.style = WS_CHILD;
		winclass.lpfnWndProc = _SciWinProc;
		winclass.cbClsExtra = 0;
		winclass.cbWndExtra = 0;
		winclass.hInstance = 0;
		winclass.hIcon = "";
		winclass.hCursor = "";
		winclass.hbrBackground = 1 + COLOR_WINDOW;
		winclass.lpszMenuName = "";
		winclass.lpszClassName = _SciWinClass;
		RegisterClass(winclass);
	}
	
	
}();
