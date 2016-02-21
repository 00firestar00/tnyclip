"use strict";

// needed to retrieve things from the system clipboard
var clip_area = document.createElement("textarea");
document.body.appendChild(clip_area);

var last_clip = "";

function getContentFromClipboard() {
    // clear the element
    clip_area.value = "";
    // set focus so we can paste into it
    clip_area.focus();
    if (document.execCommand("paste") && clip_area.value != "" && clip_area.value != last_clip) {
        last_clip = clip_area.value;
        if (last_clip && last_clip != "undefined") {
            console.log("got value from clipboard:");
            console.log(last_clip);
            return last_clip;
        }
    }
    return false;
}

function copyToClipboard(text) {
    // add text
    clip_area.value = text;
    // select it
    clip_area.select();
    last_clip = clip_area.value;
    // call copy
    document.execCommand("copy");
    console.log("added value to clipboard:");
    console.log(last_clip);
}

function minifyURL(url) {
    var i, base_url, params_arr, params_str;
    if (url.includes("newegg.com/Product/Product.aspx")) {
        console.log("found newegg url");
        var url_arr = url.split("?");
        base_url = url_arr[0];
        params_str = url_arr[1];
        params_arr = params_str.split("&");

        for (i = 0; i < params_arr.length; i++) {
            if (params_arr[i].startsWith("Item")) {
                base_url = "http://newegg.com/Product/Product.aspx" + "?" + params_arr[i];
                break;
            }
        }
        copyToClipboard(base_url);
    }
    else if (url.includes("amazon.com")) {
        console.log("found amazon url");
        base_url = url.split("?")[0];
        params_arr = base_url.split("/");

        var check;
        for (i = 0; i < params_arr.length; i++) {
            check = params_arr[i];
            if (check === "product" || check === "dp" ) {
                base_url = "http://amazon.com/dp/" + params_arr[i+1];
                break;
            }
        }
        copyToClipboard(base_url);
    }
}

function checkClipboard(wait) {
    setTimeout(function () {
        var clip = getContentFromClipboard();
        if (clip) {
            minifyURL(clip);
        }
        checkClipboard(3000); //3 seconds, should be enough time
    }, wait);
}

// START HERE //
checkClipboard();