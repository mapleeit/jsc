define(function(require, exports, module) {

    /*
     * Copyright (c) 2010-2012 Per Cederberg. All rights Reserved.
     *
     * This program is free software: you can redistribute it and/or
     * modify it under the terms of the BSD license.
     *
     * This program is distributed in the hope that it will be useful,
     * but WITHOUT ANY WARRANTY; without even the implied warranty of
     * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
     *
     * copy from http://www.percederberg.net/tools/text_converter.html by hibincheng  进行了一些删减，保留一些可能会用到的，如果有其它转换需求请到该网站copy代码
     */


// Module declaration
    var Convert = {};

// Module implementation
    (function (module) {

        // Splits a string into lines of a maximum length
        function splitLines(str, maxLen) {
            var lines = [];
            while (str.length > maxLen) {
                lines.push(str.substring(0, maxLen));
                str = str.substring(maxLen);
            }
            if (str.length > 0) {
                lines.push(str);
            }
            return lines.join("\n");
        }

        // Translates a string with a character handler function
        function translateString(str, handler, joinChr) {
            var res = [];
            for (var i = 0; i < str.length; i++) {
                res.push(handler(str.charAt(i), str.charCodeAt(i)));
            }
            return res.join(joinChr || "");
        }

        // Returns an array of bytes corresponding to the character codes
        function stringBytes(str) {
            var bytes = [];
            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                if (c >= 0x100) {
                    bytes.push((c >> 8) & 0xFF);
                }
                bytes.push(c & 0xFF);
            }
            return bytes;
        }

        // Returns an hexadecimal string from a number
        function hexString(value, length) {
            length = length || 4;
            var hex = value.toString(16).toUpperCase();
            while (hex.length < length) {
                hex = "0" + hex;
            }
            return hex;
        }

        // Checks if a string only contains printable ASCII characters
        function isAscii(str) {
            return /^[\x09\x0A\x0D\x20-\x7E]*$/.test(str);
        }

        // Converts a string to printable ASCII, replacing unknown chars with ?
        function toAscii(str) {
            function toChar(chr, code) {
                return isAscii(chr) ? chr : "?";
            }
            return translateString(str, toChar);
        }

        // Checks if a string is encoded in UTF-8
        function isUtf8(str) {
            return /^([\x09\x0A\x0D\x20-\x7E]|[\xC2-\xDF][\x80-\xBF]|\xE0[\xA0-\xBF][\x80-\xBF]|[\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}|\xED[\x80-\x9F][\x80-\xBF])*$/.test(str);
        }

        // Decodes an UTF-8 encoded string, invalid chars are replaced with \uFFFD
        function fromUtf8(str) {
            var res = [];
            var bytes = stringBytes(str);
            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                if (c >= 0x00C0 && c <= 0x00DF) {
                    var c2 = bytes[++i];
                    c = ((c & 0x1F) << 6) | (c2 & 0x3F);
                } else if (c >= 0x00E0 && c <= 0x00EF) {
                    var c2 = bytes[++i];
                    var c3 = bytes[++i];
                    c = ((c & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
                } else if (c >= 0x0080) {
                    c = 0xFFFD; // Invalid encoding, unprintable character
                }
                res.push(String.fromCharCode(c));
            }
            return res.join("");
        }

        // The set of Base64 characters
        var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        // Checks if a string is encoded in Base64, using heuristics
        function isBase64(str) {
            var invalid = str.replace(/[A-Za-z0-9\+\/\=]/g, "");
            return str.length > 0 &&
                /^\s*$/.test(invalid) &&
                (invalid.length / str.length <= 0.05);
        }

        // Decodes a Base64 encoded string, using raw character codes
        function fromBase64(str) {
            var res = [];
            str = str+''.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            var i = 0;
            while (i < str.length) {
                var enc1 = base64Chars.indexOf(str.charAt(i++));
                var enc2 = base64Chars.indexOf(str.charAt(i++));
                var enc3 = base64Chars.indexOf(str.charAt(i++));
                var enc4 = base64Chars.indexOf(str.charAt(i++));
                var b1 = (enc1 << 2) | (enc2 >> 4);
                var b2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                var b3 = ((enc3 & 3) << 6) | enc4;
                res.push(String.fromCharCode(b1));
                if (enc3 != 64) {
                    res.push(String.fromCharCode(b2));
                }
                if (enc4 != 64) {
                    res.push(String.fromCharCode(b3));
                }
            }
            return res.join("");
        }

        // Encodes a string to Base64, using raw character codes
        function toBase64(str) {
            var res = [];
            var bytes = stringBytes(str);
            var i = 0;
            while (i < bytes.length) {
                var b1 = bytes[i++];
                var b2 = bytes[i++];
                var b3 = bytes[i++];
                var enc1 = b1 >> 2;
                var enc2 = ((b1 & 3) << 4) | (b2 >> 4);
                var enc3 = ((b2 & 15) << 2) | (b3 >> 6);
                var enc4 = b3 & 63;
                if (isNaN(b2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(b3)) {
                    enc4 = 64;
                }
                res.push(base64Chars.charAt(enc1));
                res.push(base64Chars.charAt(enc2));
                res.push(base64Chars.charAt(enc3));
                res.push(base64Chars.charAt(enc4));
            }
            return splitLines(res.join(""), 64);
        }

        // Checks if a string is encoded in hexadecimal
        function isHex(str) {
            var invalid = str.replace(/[0-9a-fA-F\s]/g, "");
            return str.length > 0 && invalid.length == 0;
        }

        // Decodes a hexadecimal string, using raw character codes
        function fromHex(str) {
            var res = [];
            str = str+''.replace(/[^0-9a-fA-F]/g, "");
            for (var i = 0; i < str.length; i += 2) {
                var b = parseInt(str.substr(i, 2), 16);
                res.push(String.fromCharCode(b));
            }
            return res.join("");
        }

        // Encodes a string to hexadecimal, using raw character codes
        function toHex(str) {
            var res = [];
            var bytes = stringBytes(str);
            for (var i = 0; i < bytes.length; i++) {
                res.push(hexString(bytes[i], 2));
            }
            return splitLines(res.join("").toLowerCase(), 60);
        }


        // Export module symbols
        module.isAscii = isAscii;
        module.toAscii = toAscii;
        module.isUtf8 = isUtf8;
        module.fromUtf8 = fromUtf8;
        module.isBase64 = isBase64;
        module.fromBase64 = fromBase64;
        module.toBase64 = toBase64;
        module.isHex = isHex;
        module.fromHex = fromHex;
        module.toHex = toHex;
    })(Convert);

    return Convert;

});