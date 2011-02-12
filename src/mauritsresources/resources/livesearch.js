
/* - livesearch.js - */
/*
// +----------------------------------------------------------------------+
// | Copyright (c) 2004 Bitflux GmbH                                      |
// +----------------------------------------------------------------------+
// | Licensed under the Apache License, Version 2.0 (the "License");      |
// | you may not use this file except in compliance with the License.     |
// | You may obtain a copy of the License at                              |
// | http://www.apache.org/licenses/LICENSE-2.0                           |
// | Unless required by applicable law or agreed to in writing, software  |
// | distributed under the License is distributed on an "AS IS" BASIS,    |
// | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or      |
// | implied. See the License for the specific language governing         |
// | permissions and limitations under the License.                       |
// +----------------------------------------------------------------------+
// | Author: Bitflux GmbH <devel@bitflux.ch>                              |
// +----------------------------------------------------------------------+
*/

var liveSearchReq = false;
var t = null;
var liveSearchLast = "";
var queryTarget = "livesearch_reply?q=";

var searchForm = null;
var searchInput = null;

var isIE = false;

var _cache = new Object();

var widthOffset = 1;

function calculateWidth() {
}

function getElementDimensions(elemID) {
    var base = document.getElementById(elemID);
    var offsetTrail = base;
    var offsetLeft = 0;
    var offsetTop = 0;
    var width = 0;

    while (offsetTrail) {
        offsetLeft += offsetTrail.offsetLeft;
        offsetTop += offsetTrail.offsetTop;
        offsetTrail = offsetTrail.offsetParent;
    }
    if (navigator.userAgent.indexOf("Mac") != -1 &&
        typeof document.body.leftMargin != "undefined") {
        offsetLeft += document.body.leftMargin;
        offsetTop += document.body.topMargin;
    }
    if (!isIE)
        width = searchInput.offsetWidth-widthOffset*2;
    else
        width = searchInput.offsetWidth;
    return { left: offsetLeft,
             top: offsetTop,
             width: width,
             height: base.offsetHeight,
             bottom: offsetTop + base.offsetHeight,
             right: offsetLeft + width};
}

function liveSearchInit() {
    searchInput = document.getElementById('searchGadget');
    if (searchInput == null || searchInput == undefined)
        return
    // Only keypress catches repeats in moz/FF but keydown is needed for
    // khtml based browsers.
    if (navigator.userAgent.indexOf("KHTML") > 0) {
        searchInput.addEventListener("keydown",liveSearchKeyPress,false);
        searchInput.addEventListener("focus",liveSearchDoSearch,false);
        searchInput.addEventListener("keydown",liveSearchStart, false);
        searchInput.addEventListener("blur",liveSearchHideDelayed,false);
    } else if (searchInput.addEventListener) {
        searchInput.addEventListener("keypress",liveSearchKeyPress,false);
        searchInput.addEventListener("blur",liveSearchHideDelayed,false);
        searchInput.addEventListener("keypress",liveSearchStart, false);
    } else {
        searchInput.attachEvent("onkeydown",liveSearchKeyPress);
        searchInput.attachEvent("onkeydown",liveSearchStart);
        searchInput.attachEvent("onblur",liveSearchHideDelayed);
        isIE = true;
    }

    // Why doesn't this work in konq, setting it inline does.
    searchInput.setAttribute("autocomplete", "off");
    var pos = getElementDimensions('searchGadget');
    result = document.getElementById('LSResult');
    if ((typeof result.offsetParent != 'undefined') && (result.offsetParent != null)) {
        pos.left = pos.left - result.offsetParent.offsetLeft + pos.width;
    } else {
        pos.left = pos.left + pos.width;
    }
    result.style.display = 'none';
}


function liveSearchHideDelayed() {
    window.setTimeout("liveSearchHide()", 400);
}

function liveSearchHide() {
    document.getElementById("LSResult").style.display = "none";
    var highlight = document.getElementById("LSHighlight");
    if (highlight)
        highlight.removeAttribute("id");
}

function getFirstHighlight() {
    var set = getHits();
    return set[0];
}

function getLastHighlight() {
    var set = getHits();
    return set[set.length-1];
}

function getHits() {
    var res = document.getElementById("LSShadow");
    var set = res.getElementsByTagName('li');
    return set;
}

function findChild(object, specifier) {
    var cur = object.firstChild;
    try {
        while (cur != undefined) {
            cur = cur.nextSibling;
            if (specifier(cur) == true)
                return cur;
        }
    } catch(e) {};
    return null;
}

function findNext(object, specifier) {
    var cur = object;
    try {
        while (cur != undefined) {
            cur = cur.nextSibling;
            if (cur.nodeType==3)
                cur=cur.nextSibling;
            if (cur != undefined) {
                if (specifier(cur) == true)
                    return cur;
            } else { break; }
        }
    } catch(e) {};
    return null;
}

function findPrev(object, specifier) {
    var cur = object;
    try {
        cur = cur.previousSibling;
        if (cur.nodeType == 3)
            cur = cur.previousSibling;
        if (cur != undefined) {
            if (specifier(cur) == true)
                return cur;
        }
    } catch(e) {};
    return null;
}

function liveSearchKeyPress(event) {
    var highlight = document.getElementById("LSHighlight");
    if (event.keyCode == 40 )
    //KEY DOWN
    {
        if (!highlight) {
            highlight = getFirstHighlight();
        } else {
            highlight.removeAttribute("id");
            highlight = findNext(highlight, function (o) {return o.className =="LSRow";});
        }
        if (highlight)
            highlight.setAttribute("id","LSHighlight");
        if (!isIE)
            event.preventDefault();
    }
    //KEY UP
    else if (event.keyCode == 38 ) {
        if (!highlight) {
            highlight = getLastHighlight();
        }
        else {
            highlight.removeAttribute("id");
            highlight = findPrev(highlight, function (o) {return o.className=='LSRow';});
        }
        if (highlight)
            highlight.setAttribute("id","LSHighlight");
        if (!isIE)
            event.preventDefault();
    }
    //ESC
    else if (event.keyCode == 27) {
        if (highlight)
            highlight.removeAttribute("id");
        document.getElementById("LSResult").style.display = "none";
    }
}

function liveSearchStart(event) {
    if (t) {
        window.clearTimeout(t);
    }
    var code = event.keyCode;
    if (code!=40 && code!=38 && code!=27 && code!=37 && code!=39) {
        t = window.setTimeout("liveSearchDoSearch()", 200);
    }
}

function liveSearchDoSearch() {
    if (typeof liveSearchRoot == "undefined") {
        if (typeof portal_url == "undefined") {
            liveSearchRoot = "";
        } else {
            if (portal_url[portal_url.length-1] == '/') {
                liveSearchRoot = portal_url;
            } else {
                liveSearchRoot = portal_url + '/';
            }
        }
    }
    if (typeof liveSearchRootSubDir == "undefined") {
        liveSearchRootSubDir = "";
    }
    if (liveSearchLast != searchInput.value) {
        if (liveSearchReq && liveSearchReq.readyState < 4) {
            liveSearchReq.abort();
        }
        if ( searchInput.value == "") {
            liveSearchHide();
            return false;
        }
        // Do nothing as long as we have less then two characters -
        // the search results makes no sense, and it's harder on the server.
        if ( searchInput.value.length < 2) {
            liveSearchHide();
            return false;
        }
        // Do we have cached results
        var result = _cache[searchInput.value];
        if (result) {
            showResult(result);
            return;
        }
        liveSearchReq = new XMLHttpRequest();
        liveSearchReq.onreadystatechange = liveSearchProcessReqChange;
        // Need to use encodeURIComponent instead of encodeURI, to escape +
        liveSearchReq.open("GET", liveSearchRoot + queryTarget + encodeURIComponent(searchInput.value));
        liveSearchLast = searchInput.value;
        liveSearchReq.send(null);
    }
}

function showResult(result) {
    var res = document.getElementById("LSResult");
    res.style.display = "block";
    var sh = document.getElementById("LSShadow");
    sh.innerHTML = result;
}

function liveSearchProcessReqChange() {
    if (liveSearchReq.readyState == 4) {
        try {
            if (liveSearchReq.status > 299 || liveSearchReq.status < 200  ||
                liveSearchReq.responseText.length < 10)
                return;
        } catch(e) {
            return;
        }
        showResult(liveSearchReq.responseText);
        _cache[liveSearchLast] = liveSearchReq.responseText;
    }
}

function liveSearchSubmit() {
    var highlight = document.getElementById("LSHighlight");
    if (highlight) {
        var targets = highlight.getElementsByTagName('a');
        if (targets.length == 0)
            return true;
        var target = targets[0].href;
        if (!target)
            return true;
        if ((liveSearchRoot.length > 0) && (target.substring(0, liveSearchRoot.length) != liveSearchRoot)) {
            window.location = liveSearchRoot + liveSearchRootSubDir + target;
        } else {
            window.location = target;
        }
        return false;
    } else {
        return true;
    }
}

if (window.addEventListener)
    window.addEventListener("load", liveSearchInit, false);
else if (window.attachEvent)
    window.attachEvent("onload", liveSearchInit);

