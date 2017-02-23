//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js/act/robot/js/index",["$","lib","common"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//js/src/compress.js
//js/src/exif.js
//js/src/md5.js
//js/src/mgr.js
//js/src/msg.js
//js/src/qq_jsapi.js
//js/src/qzone_jsapi.js
//js/src/robot.js
//js/src/sha.js
//js/src/ui.js
//js/src/upload.js
//js/src/util.js
//js/src/wx_jsapi.js

//js file list:
//js/src/compress.js
//js/src/exif.js
//js/src/md5.js
//js/src/mgr.js
//js/src/msg.js
//js/src/qq_jsapi.js
//js/src/qzone_jsapi.js
//js/src/robot.js
//js/src/sha.js
//js/src/ui.js
//js/src/upload.js
//js/src/util.js
//js/src/wx_jsapi.js
define.pack("./compress",["$","lib","common"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        canvas = document.createElement("canvas"),
        ctx = canvas.getContext('2d'),
        tCanvas = document.createElement("canvas"),
        tctx = tCanvas.getContext("2d"),

        COMPRESS_RATE = 0.4,

        undefined;

    var cpmpress = function(img) {
        var initSize = img.src.length;
        var width = img.width;
        var height = img.height;

        var ratio;
        if ((ratio = width * height / 4000000)>1) {
            ratio = Math.sqrt(ratio);
            width /= ratio;
            height /= ratio;
        }else {
            ratio = 1;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //如果图片像素大于100万则使用瓦片绘制
        var count;
        if ((count = width * height / 1000000) > 1) {
            count = ~~(Math.sqrt(count)+1);

//            计算每块瓦片的宽和高
            var nw = ~~(width / count);
            var nh = ~~(height / count);

            tCanvas.width = nw;
            tCanvas.height = nh;

            for (var i = 0; i < count; i++) {
                for (var j = 0; j < count; j++) {
                    tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                    ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                }
            }
        } else {
            ctx.drawImage(img, 0, 0, width, height);
        }

        var ndata = canvas.toDataURL('image/jpeg', COMPRESS_RATE);

        //console.log('压缩前：' + initSize);
        //console.log('压缩后：' + ndata.length);
        //console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");

        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

        return ndata;
    }

    return cpmpress;
});/**
 * exif 读取图片exif信息
 * @author xixinhuang
 * @date 2016-03-04
 */
define.pack("./exif",[],function(require, exports, module) {
    var debug = false;

    var BinaryFile = function(strData, iDataOffset, iDataLength) {
        var data = strData;
        var dataOffset = iDataOffset || 0;
        var dataLength = 0;

        this.getRawData = function() {
            return data;
        };

        if (typeof strData == "string") {
            dataLength = iDataLength || data.length;

            this.getByteAt = function(iOffset) {
                return data.charCodeAt(iOffset + dataOffset) & 0xFF;
            };
        } else if (typeof strData == "unknown") {
            dataLength = iDataLength || IEBinary_getLength(data);

            this.getByteAt = function(iOffset) {
                return IEBinary_getByteAt(data, iOffset + dataOffset);
            };
        }

        this.getLength = function() {
            return dataLength;
        };

        this.getSByteAt = function(iOffset) {
            var iByte = this.getByteAt(iOffset);
            if (iByte > 127)
                return iByte - 256;
            else
                return iByte;
        };

        this.getShortAt = function(iOffset, bBigEndian) {
            var iShort = bBigEndian ?
            (this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
                : (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset);
            if (iShort < 0) iShort += 65536;
            return iShort;
        };
        this.getSShortAt = function(iOffset, bBigEndian) {
            var iUShort = this.getShortAt(iOffset, bBigEndian);
            if (iUShort > 32767)
                return iUShort - 65536;
            else
                return iUShort;
        };
        this.getLongAt = function(iOffset, bBigEndian) {
            var iByte1 = this.getByteAt(iOffset),
                iByte2 = this.getByteAt(iOffset + 1),
                iByte3 = this.getByteAt(iOffset + 2),
                iByte4 = this.getByteAt(iOffset + 3);

            var iLong = bBigEndian ?
            (((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
                : (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
            if (iLong < 0) iLong += 4294967296;
            return iLong;
        };
        this.getSLongAt = function(iOffset, bBigEndian) {
            var iULong = this.getLongAt(iOffset, bBigEndian);
            if (iULong > 2147483647)
                return iULong - 4294967296;
            else
                return iULong;
        };
        this.getStringAt = function(iOffset, iLength) {
            var aStr = [];
            for (var i=iOffset,j=0;i<iOffset+iLength;i++,j++) {
                aStr[j] = String.fromCharCode(this.getByteAt(i));
            }
            return aStr.join("");
        };

        this.getCharAt = function(iOffset) {
            return String.fromCharCode(this.getByteAt(iOffset));
        };
        this.toBase64 = function() {
            return window.btoa(data);
        };
        this.fromBase64 = function(strBase64) {
            data = window.atob(strBase64);
        };
    };

    var BinaryAjax = function() {

        function createRequest() {
            var oHTTP = null;
            if (window.XMLHttpRequest) {
                oHTTP = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                oHTTP = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return oHTTP;
        }

        function getHead(strURL, fncCallback, fncError) {
            var oHTTP = createRequest();
            if (oHTTP) {
                if (fncCallback) {
                    if (typeof(oHTTP.onload) != "undefined") {
                        oHTTP.onload = function() {
                            if (oHTTP.status == "200") {
                                fncCallback(this);
                            } else {
                                if (fncError) fncError();
                            }
                            oHTTP = null;
                        };
                    } else {
                        oHTTP.onreadystatechange = function() {
                            if (oHTTP.readyState == 4) {
                                if (oHTTP.status == "200") {
                                    fncCallback(this);
                                } else {
                                    if (fncError) fncError();
                                }
                                oHTTP = null;
                            }
                        };
                    }
                }
                oHTTP.open("HEAD", strURL, true);
                oHTTP.send(null);
            } else {
                if (fncError) fncError();
            }
        }

        function sendRequest(strURL, fncCallback, fncError, aRange, bAcceptRanges, iFileSize) {
            var oHTTP = createRequest();
            if (oHTTP) {

                var iDataOffset = 0;
                if (aRange && !bAcceptRanges) {
                    iDataOffset = aRange[0];
                }
                var iDataLen = 0;
                if (aRange) {
                    iDataLen = aRange[1]-aRange[0]+1;
                }

                if (fncCallback) {
                    if (typeof(oHTTP.onload) != "undefined") {
                        oHTTP.onload = function() {

                            if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
                                this.binaryResponse = new BinaryFile(this.responseText, iDataOffset, iDataLen);
                                this.fileSize = iFileSize || this.getResponseHeader("Content-Length");
                                fncCallback(this);
                            } else {
                                if (fncError) fncError();
                            }
                            oHTTP = null;
                        };
                    } else {
                        oHTTP.onreadystatechange = function() {
                            if (oHTTP.readyState == 4) {
                                if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
                                    this.binaryResponse = new BinaryFile(oHTTP.responseBody, iDataOffset, iDataLen);
                                    this.fileSize = iFileSize || this.getResponseHeader("Content-Length");
                                    fncCallback(this);
                                } else {
                                    if (fncError) fncError();
                                }
                                oHTTP = null;
                            }
                        };
                    }
                }
                oHTTP.open("GET", strURL, true);

                if (oHTTP.overrideMimeType) oHTTP.overrideMimeType('text/plain; charset=x-user-defined');

                if (aRange && bAcceptRanges) {
                    oHTTP.setRequestHeader("Range", "bytes=" + aRange[0] + "-" + aRange[1]);
                }

                oHTTP.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT");

                oHTTP.send(null);
            } else {
                if (fncError) fncError();
            }
        }

        return function(strURL, fncCallback, fncError, aRange) {

            if (aRange) {
                getHead(
                    strURL,
                    function(oHTTP) {
                        var iLength = parseInt(oHTTP.getResponseHeader("Content-Length"),10);
                        var strAcceptRanges = oHTTP.getResponseHeader("Accept-Ranges");

                        var iStart, iEnd;
                        iStart = aRange[0];
                        if (aRange[0] < 0)
                            iStart += iLength;
                        iEnd = iStart + aRange[1] - 1;

                        sendRequest(strURL, fncCallback, fncError, [iStart, iEnd], (strAcceptRanges == "bytes"), iLength);
                    }
                );

            } else {
                sendRequest(strURL, fncCallback, fncError);
            }
        };

    };

    //所需要的tag列表，取前面的索引值
    var needTags = [256, 257, 274, 306, 34665, 40962, 40963];

    var exif = {};//new Module('exif', { //function (obj) {//
    //if (obj instanceof exif) return obj;
    //if (!(this instanceof exif)) return new exif(obj);
    //this.EXIFwrapped = obj;
    //exif: {}
    //  });

    exif.Tags = {

        //// version tags
        //0x9000 : "ExifVersion",         // EXIF version
        //0xA000 : "FlashpixVersion",     // Flashpix format version
        //
        //// colorspace tags
        //0xA001 : "ColorSpace",          // Color space information tag
        //
        //// image configuration
        0xA002 : "PixelXDimension",     // Valid width of meaningful image
        0xA003 : "PixelYDimension"     // Valid height of meaningful image
        //0x9101 : "ComponentsConfiguration", // Information about channels
        //0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel
        //
        //// user information
        //0x927C : "MakerNote",           // Any desired information written by the manufacturer
        //0x9286 : "UserComment",         // Comments by user
        //
        //// related file
        //0xA004 : "RelatedSoundFile",        // Name of related sound file
        //
        //// date and time
        //0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
        //0x9004 : "DateTimeDigitized"       // Date and time when the image was stored digitally
        //0x9290 : "SubsecTime",          // Fractions of seconds for DateTime
        //0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
        //0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized
        //
        //// picture-taking conditions
        //0x829A : "ExposureTime",        // Exposure time (in seconds)
        //0x829D : "FNumber",         // F number
        //0x8822 : "ExposureProgram",     // Exposure program
        //0x8824 : "SpectralSensitivity",     // Spectral sensitivity
        //0x8827 : "ISOSpeedRatings",     // ISO speed rating
        //0x8828 : "OECF",            // Optoelectric conversion factor
        //0x9201 : "ShutterSpeedValue",       // Shutter speed
        //0x9202 : "ApertureValue",       // Lens aperture
        //0x9203 : "BrightnessValue",     // Value of brightness
        //0x9204 : "ExposureBias",        // Exposure bias
        //0x9205 : "MaxApertureValue",        // Smallest F number of lens
        //0x9206 : "SubjectDistance",     // Distance to subject in meters
        //0x9207 : "MeteringMode",        // Metering mode
        //0x9208 : "LightSource",         // Kind of light source
        //0x9209 : "Flash",           // Flash status
        //0x9214 : "SubjectArea",         // Location and area of main subject
        //0x920A : "FocalLength",         // Focal length of the lens in mm
        //0xA20B : "FlashEnergy",         // Strobe energy in BCPS
        //0xA20C : "SpatialFrequencyResponse",    //
        //0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
        //0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
        //0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        //0xA214 : "SubjectLocation",     // Location of subject in image
        //0xA215 : "ExposureIndex",       // Exposure index selected on camera
        //0xA217 : "SensingMethod",       // Image sensor type
        //0xA300 : "FileSource",          // Image source (3 == DSC)
        //0xA301 : "SceneType",           // Scene type (1 == directly photographed)
        //0xA302 : "CFAPattern",          // Color filter array geometric pattern
        //0xA401 : "CustomRendered",      // Special processing
        //0xA402 : "ExposureMode",        // Exposure mode
        //0xA403 : "WhiteBalance",        // 1 = auto white balance, 2 = manual
        //0xA404 : "DigitalZoomRation",       // Digital zoom ratio
        //0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
        //0xA406 : "SceneCaptureType",        // Type of scene
        //0xA407 : "GainControl",         // Degree of overall image gain adjustment
        //0xA408 : "Contrast",            // Direction of contrast processing applied by camera
        //0xA409 : "Saturation",          // Direction of saturation processing applied by camera
        //0xA40A : "Sharpness",           // Direction of sharpness processing applied by camera
        //0xA40B : "DeviceSettingDescription",    //
        //0xA40C : "SubjectDistanceRange",    // Distance to subject
        //
        //// other tags
        //0xA005 : "InteroperabilityIFDPointer",
        //0xA420 : "ImageUniqueID"        // Identifier assigned uniquely to each image
    };

    exif.TiffTags = {
        0x0100 : "ImageWidth",
        0x0101 : "ImageHeight",
        0x8769 : "ExifIFDPointer",
        //0x8825 : "GPSInfoIFDPointer",
        //0xA005 : "InteroperabilityIFDPointer",
        //0x0102 : "BitsPerSample",
        //0x0103 : "Compression",
        //0x0106 : "PhotometricInterpretation",
        0x0112 : "Orientation",
        //0x0115 : "SamplesPerPixel",
        //0x011C : "PlanarConfiguration",
        //0x0212 : "YCbCrSubSampling",
        //0x0213 : "YCbCrPositioning",
        //0x011A : "XResolution",
        //0x011B : "YResolution",
        //0x0128 : "ResolutionUnit",
        //0x0111 : "StripOffsets",
        //0x0116 : "RowsPerStrip",
        //0x0117 : "StripByteCounts",
        //0x0201 : "JPEGInterchangeFormat",
        //0x0202 : "JPEGInterchangeFormatLength",
        //0x012D : "TransferFunction",
        //0x013E : "WhitePoint",
        //0x013F : "PrimaryChromaticities",
        //0x0211 : "YCbCrCoefficients",
        //0x0214 : "ReferenceBlackWhite",
        0x0132 : "DateTime"
        //0x010E : "ImageDescription",
        //0x010F : "Make",
        //0x0110 : "Model",
        //0x0131 : "Software",
        //0x013B : "Artist",
        //0x8298 : "Copyright"
    };

    exif.GPSTags = {
        //0x0000 : "GPSVersionID",
        //0x0001 : "GPSLatitudeRef",
        //0x0002 : "GPSLatitude",
        //0x0003 : "GPSLongitudeRef",
        //0x0004 : "GPSLongitude"
        //0x0005 : "GPSAltitudeRef",
        //0x0006 : "GPSAltitude",
        //0x0007 : "GPSTimeStamp",
        //0x0008 : "GPSSatellites",
        //0x0009 : "GPSStatus",
        //0x000A : "GPSMeasureMode",
        //0x000B : "GPSDOP",
        //0x000C : "GPSSpeedRef",
        //0x000D : "GPSSpeed",
        //0x000E : "GPSTrackRef",
        //0x000F : "GPSTrack",
        //0x0010 : "GPSImgDirectionRef",
        //0x0011 : "GPSImgDirection",
        //0x0012 : "GPSMapDatum",
        //0x0013 : "GPSDestLatitudeRef",
        //0x0014 : "GPSDestLatitude",
        //0x0015 : "GPSDestLongitudeRef",
        //0x0016 : "GPSDestLongitude",
        //0x0017 : "GPSDestBearingRef",
        //0x0018 : "GPSDestBearing",
        //0x0019 : "GPSDestDistanceRef",
        //0x001A : "GPSDestDistance",
        //0x001B : "GPSProcessingMethod",
        //0x001C : "GPSAreaInformation",
        //0x001D : "GPSDateStamp",
        //0x001E : "GPSDifferential"
    };

    exif.StringValues = {
        ExposureProgram : {
            0 : "Not defined",
            1 : "Manual",
            2 : "Normal program",
            3 : "Aperture priority",
            4 : "Shutter priority",
            5 : "Creative program",
            6 : "Action program",
            7 : "Portrait mode",
            8 : "Landscape mode"
        },
        MeteringMode : {
            0 : "Unknown",
            1 : "Average",
            2 : "CenterWeightedAverage",
            3 : "Spot",
            4 : "MultiSpot",
            5 : "Pattern",
            6 : "Partial",
            255 : "Other"
        },
        LightSource : {
            0 : "Unknown",
            1 : "Daylight",
            2 : "Fluorescent",
            3 : "Tungsten (incandescent light)",
            4 : "Flash",
            9 : "Fine weather",
            10 : "Cloudy weather",
            11 : "Shade",
            12 : "Daylight fluorescent (D 5700 - 7100K)",
            13 : "Day white fluorescent (N 4600 - 5400K)",
            14 : "Cool white fluorescent (W 3900 - 4500K)",
            15 : "White fluorescent (WW 3200 - 3700K)",
            17 : "Standard light A",
            18 : "Standard light B",
            19 : "Standard light C",
            20 : "D55",
            21 : "D65",
            22 : "D75",
            23 : "D50",
            24 : "ISO studio tungsten",
            255 : "Other"
        },
        Flash : {
            0x0000 : "Flash did not fire",
            0x0001 : "Flash fired",
            0x0005 : "Strobe return light not detected",
            0x0007 : "Strobe return light detected",
            0x0009 : "Flash fired, compulsory flash mode",
            0x000D : "Flash fired, compulsory flash mode, return light not detected",
            0x000F : "Flash fired, compulsory flash mode, return light detected",
            0x0010 : "Flash did not fire, compulsory flash mode",
            0x0018 : "Flash did not fire, auto mode",
            0x0019 : "Flash fired, auto mode",
            0x001D : "Flash fired, auto mode, return light not detected",
            0x001F : "Flash fired, auto mode, return light detected",
            0x0020 : "No flash function",
            0x0041 : "Flash fired, red-eye reduction mode",
            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod : {
            1 : "Not defined",
            2 : "One-chip color area sensor",
            3 : "Two-chip color area sensor",
            4 : "Three-chip color area sensor",
            5 : "Color sequential area sensor",
            7 : "Trilinear sensor",
            8 : "Color sequential linear sensor"
        },
        SceneCaptureType : {
            0 : "Standard",
            1 : "Landscape",
            2 : "Portrait",
            3 : "Night scene"
        },
        SceneType : {
            1 : "Directly photographed"
        },
        CustomRendered : {
            0 : "Normal process",
            1 : "Custom process"
        },
        WhiteBalance : {
            0 : "Auto white balance",
            1 : "Manual white balance"
        },
        GainControl : {
            0 : "None",
            1 : "Low gain up",
            2 : "High gain up",
            3 : "Low gain down",
            4 : "High gain down"
        },
        Contrast : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        Saturation : {
            0 : "Normal",
            1 : "Low saturation",
            2 : "High saturation"
        },
        Sharpness : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        SubjectDistanceRange : {
            0 : "Unknown",
            1 : "Macro",
            2 : "Close view",
            3 : "Distant view"
        },
        FileSource : {
            3 : "DSC"
        },

        Components : {
            0 : "",
            1 : "Y",
            2 : "Cb",
            3 : "Cr",
            4 : "R",
            5 : "G",
            6 : "B"
        }
    };

    function imageHasData(oImg)
    {
        return !!(oImg.exifdata);
    }

    function getImageData(oImg, fncCallback)
    {
        BinaryAjax(
            oImg.src,
            function(oHTTP) {
                var oEXIF = findEXIFinJPEG(oHTTP.binaryResponse);
                oImg.exifdata = oEXIF || {};
                if (fncCallback) fncCallback();
            }
        );
    }

    function findEXIFinJPEG(oFile) {
        var aMarkers = [];

        if (oFile.getByteAt(0) != 0xFF || oFile.getByteAt(1) != 0xD8) {
            return false; // not a valid jpeg
        }

        var iOffset = 2;
        var iLength = oFile.getLength();
        while (iOffset < iLength) {
            if (oFile.getByteAt(iOffset) != 0xFF) {
                if (debug) console.log("Not a valid marker at offset " + iOffset + ", found: " + oFile.getByteAt(iOffset));
                return false; // not a valid marker, something is wrong
            }

            var iMarker = oFile.getByteAt(iOffset+1);

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (iMarker == 22400) {
                if (debug) console.log("Found 0xFFE1 marker");
                return readEXIFData(oFile, iOffset + 4, oFile.getShortAt(iOffset+2, true)-2);
                // iOffset += 2 + oFile.getShortAt(iOffset+2, true);
                // WTF?

            } else if (iMarker == 225) {
                // 0xE1 = Application-specific 1 (for EXIF)
                if (debug) console.log("Found 0xFFE1 marker");
                return readEXIFData(oFile, iOffset + 4, oFile.getShortAt(iOffset+2, true)-2);

            } else {
                iOffset += 2 + oFile.getShortAt(iOffset+2, true);
            }

        }

    }


    function readTags(oFile, iTIFFStart, iDirStart, oStrings, bBigEnd)
    {
        var iEntries = oFile.getShortAt(iDirStart, bBigEnd);
        var oTags = {};
        for (var i=0;i<iEntries;i++) {
            var iEntryOffset = iDirStart + i*12 + 2;
            //console.log("now index: " + oFile.getShortAt(iEntryOffset, bBigEnd));
            var index = oFile.getShortAt(iEntryOffset, bBigEnd);
            if(needTags.indexOf(index) != -1) {
                var strTag = oStrings[oFile.getShortAt(iEntryOffset, bBigEnd)];
                if (!strTag && debug) console.log("Unknown tag: " + oFile.getShortAt(iEntryOffset, bBigEnd));
                //console.log('tag:' + oFile.getShortAt(iEntryOffset, bBigEnd) +':'+ readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd))
                oTags[strTag] = readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd);
            }
        }
        return oTags;
    }


    function readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd)
    {
        var iType = oFile.getShortAt(iEntryOffset+2, bBigEnd);
        var iNumValues = oFile.getLongAt(iEntryOffset+4, bBigEnd);
        var iValueOffset = oFile.getLongAt(iEntryOffset+8, bBigEnd) + iTIFFStart;

        switch (iType) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (iNumValues == 1) {
                    return oFile.getByteAt(iEntryOffset + 8, bBigEnd);
                } else {
                    var iValOffset = iNumValues > 4 ? iValueOffset : (iEntryOffset + 8);
                    var aVals = [];
                    for (var n=0;n<iNumValues;n++) {
                        aVals[n] = oFile.getByteAt(iValOffset + n);
                    }
                    return aVals;
                }
                break;

            case 2: // ascii, 8-bit byte
                var iStringOffset = iNumValues > 4 ? iValueOffset : (iEntryOffset + 8);
                return oFile.getStringAt(iStringOffset, iNumValues-1);
            // break;

            case 3: // short, 16 bit int
                if (iNumValues == 1) {
                    return oFile.getShortAt(iEntryOffset + 8, bBigEnd);
                } else {
                    var iValOffset = iNumValues > 2 ? iValueOffset : (iEntryOffset + 8);
                    var aVals = [];
                    for (var n=0;n<iNumValues;n++) {
                        aVals[n] = oFile.getShortAt(iValOffset + 2*n, bBigEnd);
                    }
                    return aVals;
                }
            // break;

            case 4: // long, 32 bit int
                if (iNumValues == 1) {
                    return oFile.getLongAt(iEntryOffset + 8, bBigEnd);
                } else {
                    var aVals = [];
                    for (var n=0;n<iNumValues;n++) {
                        aVals[n] = oFile.getLongAt(iValueOffset + 4*n, bBigEnd);
                    }
                    return aVals;
                }
                break;
            case 5: // rational = two long values, first is numerator, second is denominator
                if (iNumValues == 1) {
                    return oFile.getLongAt(iValueOffset, bBigEnd) / oFile.getLongAt(iValueOffset+4, bBigEnd);
                } else {
                    var aVals = [];
                    for (var n=0;n<iNumValues;n++) {
                        aVals[n] = oFile.getLongAt(iValueOffset + 8*n, bBigEnd) / oFile.getLongAt(iValueOffset+4 + 8*n, bBigEnd);
                    }
                    return aVals;
                }
                break;
            case 9: // slong, 32 bit signed int
                if (iNumValues == 1) {
                    return oFile.getSLongAt(iEntryOffset + 8, bBigEnd);
                } else {
                    var aVals = [];
                    for (var n=0;n<iNumValues;n++) {
                        aVals[n] = oFile.getSLongAt(iValueOffset + 4*n, bBigEnd);
                    }
                    return aVals;
                }
                break;
            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (iNumValues == 1) {
                    return oFile.getSLongAt(iValueOffset, bBigEnd) / oFile.getSLongAt(iValueOffset+4, bBigEnd);
                } else {
                    var aVals = [];
                    for (var n=0;n<iNumValues;n++) {
                        aVals[n] = oFile.getSLongAt(iValueOffset + 8*n, bBigEnd) / oFile.getSLongAt(iValueOffset+4 + 8*n, bBigEnd);
                    }
                    return aVals;
                }
                break;
        }
    }


    function readEXIFData(oFile, iStart, iLength)
    {
        if (oFile.getStringAt(iStart, 4) != "Exif") {
            if (debug) console.log("Not valid EXIF data! " + oFile.getStringAt(iStart, 4));
            return false;
        }

        var bBigEnd;

        var iTIFFOffset = iStart + 6;

        // test for TIFF validity and endianness
        if (oFile.getShortAt(iTIFFOffset) == 0x4949) {
            bBigEnd = false;
        } else if (oFile.getShortAt(iTIFFOffset) == 0x4D4D) {
            bBigEnd = true;
        } else {
            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (oFile.getShortAt(iTIFFOffset+2, bBigEnd) != 0x002A) {
            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        if (oFile.getLongAt(iTIFFOffset+4, bBigEnd) != 0x00000008) {
            if (debug) console.log("Not valid TIFF data! (First offset not 8)", oFile.getShortAt(iTIFFOffset+4, bBigEnd));
            return false;
        }

        var oTags = readTags(oFile, iTIFFOffset, iTIFFOffset+8, exif.TiffTags, bBigEnd);

        if (oTags.ExifIFDPointer) {
            var oEXIFTags = readTags(oFile, iTIFFOffset, iTIFFOffset + oTags.ExifIFDPointer, exif.Tags, bBigEnd);
            for (var strTag in oEXIFTags) {
                switch (strTag) {
                    case "LightSource" :
                    case "Flash" :
                    case "MeteringMode" :
                    case "ExposureProgram" :
                    case "SensingMethod" :
                    case "SceneCaptureType" :
                    case "SceneType" :
                    case "CustomRendered" :
                    case "WhiteBalance" :
                    case "GainControl" :
                    case "Contrast" :
                    case "Saturation" :
                    case "Sharpness" :
                    case "SubjectDistanceRange" :
                    case "FileSource" :
                        oEXIFTags[strTag] = exif.StringValues[strTag][oEXIFTags[strTag]];
                        break;

                    case "ExifVersion" :
                    case "FlashpixVersion" :
                        oEXIFTags[strTag] = String.fromCharCode(oEXIFTags[strTag][0], oEXIFTags[strTag][1], oEXIFTags[strTag][2], oEXIFTags[strTag][3]);
                        break;

                    case "ComponentsConfiguration" :
                        oEXIFTags[strTag] =
                            exif.StringValues.Components[oEXIFTags[strTag][0]]
                            + exif.StringValues.Components[oEXIFTags[strTag][1]]
                            + exif.StringValues.Components[oEXIFTags[strTag][2]]
                            + exif.StringValues.Components[oEXIFTags[strTag][3]];
                        break;
                }
                oTags[strTag] = oEXIFTags[strTag];
            }
        }

        if (oTags.GPSInfoIFDPointer) {
            var oGPSTags = readTags(oFile, iTIFFOffset, iTIFFOffset + oTags.GPSInfoIFDPointer, exif.GPSTags, bBigEnd);
            for (var strTag in oGPSTags) {
                switch (strTag) {
                    case "GPSVersionID" :
                        oGPSTags[strTag] = oGPSTags[strTag][0]
                            + "." + oGPSTags[strTag][1]
                            + "." + oGPSTags[strTag][2]
                            + "." + oGPSTags[strTag][3];
                        break;
                }
                oTags[strTag] = oGPSTags[strTag];
            }
        }

        return oTags;
    }


    exif.getData = function(oImg, fncCallback)
    {
        if (!oImg.complete) return false;
        if (!imageHasData(oImg)) {
            getImageData(oImg, fncCallback);
        } else {
            if (fncCallback) fncCallback();
        }
        return true;
    };

    exif.getTag = function(oImg, strTag)
    {
        if (!imageHasData(oImg)) return;
        return oImg.exifdata[strTag];
    };

    exif.getAllTags = function(oImg)
    {
        if (!imageHasData(oImg)) return {};
        var oData = oImg.exifdata;
        var oAllTags = {};
        for (var a in oData) {
            if (oData.hasOwnProperty(a)) {
                oAllTags[a] = oData[a];
            }
        }
        return oAllTags;
    };

    exif.pretty = function(oImg)
    {
        if (!imageHasData(oImg)) return "";
        var oData = oImg.exifdata;
        var strPretty = "";
        for (var a in oData) {
            if (oData.hasOwnProperty(a)) {
                if (typeof oData[a] == "object") {
                    strPretty += a + " : [" + oData[a].length + " values]\r\n";
                } else {
                    strPretty += a + " : " + oData[a] + "\r\n";
                }
            }
        }
        return strPretty;
    };

    exif.readFromBinaryFile = function(oFile) {
        return findEXIFinJPEG(oFile);
    };

    var getFilePart = function(file) {
        if (file.slice) {
            filePart = file.slice(0, 131072);
        } else if (file.webkitSlice) {
            filePart = file.webkitSlice(0, 131072);
        } else if (file.mozSlice) {
            filePart = file.mozSlice(0, 131072);
        } else {
            filePart = file;
        }

        return filePart;
    };

    exif.fileExif = function(id, file, callback) {
        if(!file) {
            callback(null);
            return;
        }
        var reader = new FileReader();

        reader.onload = function(event) {
            var content = event.target.result;
            var binaryResponse = new BinaryFile(content);

            callback(id, exif.readFromBinaryFile(binaryResponse));
        };
        reader.onerror = function(event) {
            callback(null);
        };

        reader.readAsBinaryString(getFilePart(file));
    };

    exif.fileExif = function(file, callback) {
        if(!file) {
            callback(null);
            return;
        }
        var reader = new FileReader();

        reader.onload = function(event) {
            var content = event.target.result;
            var binaryResponse = new BinaryFile(content);

            callback(exif.readFromBinaryFile(binaryResponse));
        };
        reader.onerror = function(event) {
            callback(null);
        };

        reader.readAsBinaryString(getFilePart(file));
    };

    return exif;
});/**
 * md5
 * @author xixinhuang
 * @date 2016-03-04
 */
define.pack("./md5",[],function(require, exports, module) {
    var getMD5 = function(data) {
        var i,j,k;
        var tis=[],abs=Math.abs,sin=Math.sin;
        for(i=1;i<=64;i++)tis.push(0x100000000*abs(sin(i))|0);
        var l=((data.length+8)>>>6<<4)+15,s=new Uint8Array(l<<2);
        s.set(new Uint8Array(data.buffer)),s=new Uint32Array(s.buffer);
        s[data.length>>2]|=0x80<<(data.length<<3&31);
        s[l-1]=data.length<<3;
        var params=[
            [function(a,b,c,d,x,s,t){
                return C(b&c|~b&d,a,b,x,s,t);
            },0,1,7,12,17,22],[function(a,b,c,d,x,s,t){
                return C(b&d|c&~d,a,b,x,s,t);
            },1,5,5,9,14,20],[function(a,b,c,d,x,s,t){
                return C(b^c^d,a,b,x,s,t);
            },5,3,4,11,16,23],[function(a,b,c,d,x,s,t){
                return C(c^(b|~d),a,b,x,s,t);
            },0,7,6,10,15,21]
        ],C=function(q,a,b,x,s,t){
            return a=a+q+(x|0)+t,(a<<s|a>>>(32-s))+b|0;
        },m=[1732584193,-271733879],o;
        m.push(~m[0],~m[1]);
        for(i=0;i<s.length;i+=16){
            o=m.slice(0);
            for(k=0,j=0;j<64;j++)m[k&3]=params[j>>4][0](
                m[k&3],m[++k&3],m[++k&3],m[++k&3],
                s[i+(params[j>>4][1]+params[j>>4][2]*j)%16],
                params[j>>4][3+j%4],tis[j]
            );
            for(j=0;j<4;j++)m[j]=m[j]+o[j]|0;
        };
        return new Uint8Array(new Uint32Array(m).buffer);
    }
    return getMD5;
});/**
 * mgr
 * @author xixinhuang
 * @date 2016-03-04
 */
define.pack("./mgr",["lib","$","common","./util"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Mgr = lib.get('./Mgr'),
        util = require('./util'),

        undefined;

    var mgr = new Mgr('mgr', {

        init: function(cfg) {
            $.extend(this, cfg);
            this.observe(this.ui);
            this.observe(this.upload);
        },

        on_change: function(file) {
            var me = this;
            this.upload.url = '';
            util.read_file(file, function(data) {
                var _data = data;
                me.upload.init(file, data);

                setTimeout(function() {
                    me.ui.update(file, _data);
                },500);
            });
        },

        on_get_porn: function(data) {
            var _data = data.replace(/^data:image\/\w+;base64,/,'');
            this.robot.get_porn(_data);
        },

        on_refresh: function(data) {
            data = data || {};
            if(this.upload.fid && this.upload.pid) {
                data['fid'] = this.upload.fid;
                data['pid'] = this.upload.pid;
                data['pic'] = this.upload.pic_url;
            }
            this.robot.set_share_url(data);
        },

        on_get_tags: function() {
            this.robot.get_tags();
        }
    });

    return mgr;
});define.pack("./msg",["$"],function(require, exports, module) {
    var $ = require('$'),

        undefined;

    var msg = {};
    msg.desc = {
        '合影': '咦？合影中怎么没有云云呢，主人帮我P进去嘛。',
        '女孩': '哇，好漂亮的MM，云云要去搭讪了。',
        '小孩': '这个可爱的小孩，云云想和他做好朋友呢~',
        '男孩': '哇，好帅帅的GG啊，做云云欧爸吧~',
        '人群': '哇，好多人呢，但这里没有云云的妈妈~',
        '人': '愚蠢的人类呀，接受云云的制裁吧！',
        '手脚': '伸伸手，跺跺脚，动动就会身体好~',
        '独照': '快帮云云也拍一张独照吧~茄子~',
        '写真照': '哇，写真照真好看，再来几张~',
        '婚纱': '好浪漫，云云也想结婚，另一半哪找呢？',
        '头发': '云云没有头发，不过要给我买假发戴我也不介意呢。',
        '演出': '云云当时也在现场，精彩得直鼓掌呢~',
        '大头照': '云云最喜欢大头照了，剪刀手yeah~',
        '西服': '云云也要穿上西服，做机器人中的绅士~',
        '集体照': '咦？合影中怎么没有云云呢，主人帮我P进去嘛。',
        '聚会': 'Let\'s Party！干杯~友情万岁！',
        '老人': '一个丁老头，欠我两个蛋啊，我说三天还，他说四天还~',
        '毕业照': '等拍毕业照的时候，云云要各种搞怪~',
        '泳装': '穿泳装的人类都好性感！云云穿上估计只会很搞笑~',
        '表演': 'Show time！看云云左手右手一个慢动作~',
        '踢球': '射门！哎呀，又踢歪了。',
        '写真': '好美的写真！云云都看入迷了呢~',


        '树木': '多植树，少砍树，云云是地球的绿色大使~',
        '天空': '天空一声巨响~云云闪亮登场！',
        '山': '大王叫我来巡山哪啊，咿儿哟哦，巡完南山我巡北山咯。',
        '岩石': '岩石里会不会蹦出个孙悟空？猴年快乐哟~',
        '草地': '主人快来，躺在草地晒太阳真舒服。',
        '水': '嘿嘿，又可以给云云的水枪补充弹药了~',
        '花': '云云的表现很棒吧~是要给云云奖励小红花呢？',
        '夜晚': '唔，夜晚黑漆漆的，云云怕黑。',
        '广场': '听说每晚这里都会有大妈在扭腰，真想见识一下呢。',
        '云': '云好像棉花糖一样，好想拿下来全部吃掉！',
        '公园': '云云最喜欢跟着主人在公园里散步了~',
        '路': '云云就要走自己的路，让别人无路可走，哈哈~',
        '雕像': '唔，原来是雕像，云云还以为是真的呢！',
        '窗户': '打开窗户，呼吸新鲜空气，一下就精神了呢~',
        '大海': '静静地听着大海的声音，好像在和云云讲故事呢。',
        '湖': '这片湖里会不会有美人鱼呢？',
        '舞台': '咦？轮到云云上舞台了吗，好紧张好紧张。',
        '街道': '云云一到这里就迷路了，怎么办？',
        '楼阁': '楼阁里会不会有什么宝贝呢，云云去瞧瞧~',
        '枝叶': '枝繁叶茂，绿树成荫，快来乘凉~',
        '花丛': '花花，云云也要一朵花花~',
        '菜品': '小孩子要多吃菜，云云是机器人可以不用吃~',
        '游乐场': '云云最喜欢去游乐场了，一起去体验新项目吧~',
        '野外': '跟着贝爷去野外冒险咯，又可以补充蛋白质了呢！坏笑。',
        '河': '主人~周末和云云一起去河边钓个鱼吧~',
        '沙滩': '我们一起来堆个小城堡吧~',
        '雪景':    '漫天都是棉花糖，啊呜一口吃掉它，好冰~',
        '都市远景': '钢铁水泥组成的繁华美景，炒鸡棒！',
        '动物园': '最喜欢到动物园里看各种小动物了~',
        '瀑布': '飞流直下三千尺，真壮观！',
        '农田': '谁知那个盘中餐，粒粒都辛苦啊~',
        '海岸': '云云要去海岸边捡漂流瓶！',
        '日出日落': '太阳公公上下班真准时呢~',
        '山洞': '好黑好黑，洞洞里会不会有怪物呢？',
        '烟火': '云云要成为不一样的烟火，嘿嘿。',
        '太阳': '云云晒太阳中，吸取太阳能充充电~。',
        '月亮': '云云想到月亮上去与玉兔儿玩玩~',
        '彩虹': '赤橙黄绿青蓝紫，是谁持着彩练当空舞呢？',
        '草原': '天苍苍，野茫茫，风吹草地现牛羊呀~',
        '夜景': '夜空中一闪一闪地眨着许多小眼睛呢~',
        '湖水': '湖水清清，小鱼们快过来陪我玩！',
        '山湖': '山衬托湖的美，湖映衬了山的高~',
        '城市远景':	'钢铁水泥组成的繁华美景，炒鸡棒！',

        '房屋': '云云要盖一栋红色屋顶的小房屋。',
        '建筑': '哇，这些建筑都好像钢筋铁骨的巨人呢！',
        '灯': '灯~等灯等灯~',
        '门': '咚咚咚，小兔子乖乖，把门儿开开。',
        '楼阁': '躲猫猫，躲猫猫，云云最爱躲楼阁。',
        '卧室': '呜，好想在这卧室里睡上一觉。',
        '阶梯': '一步两步，三步四步，爬爬阶梯锻炼身体。',
        '餐厅': '嘻嘻，让云云来查查有木有团购~',
        '店铺': '老板~你这里有没有卖棒棒糖~',
        '庭院': '云云在庭院里偷偷埋了种子~',
        '教室': '好困，一到教室云云就犯困~',
        '客厅': '云云最喜欢在客厅里乱跑，嘻嘻。',
        '墙': '看云云的穿墙术！Bang，唔，看来还没练成~',
        '高楼': '好高的楼！好可怕好口怕，云云有恐高~',
        '运动场': '加油加油，云云要当拉拉队队长~',
        '亭子': '看~亭子好像一朵花，点缀在水面上，分外别致呢~',
        '博物馆': 'N年后，云云会不会也被收藏在博物馆里呢。',
        '酒店': '住酒店咯~好期待明天的早餐有什么~',
        '欧式建筑': '哇，云云第一次见到欧式建筑，雍容华贵呢！',
        '玻璃': '咚，谁把玻璃放在这里的，把云云都撞晕了。',
        '走廊': '走廊的尽头有什么呢？好神秘~',
        '学校': '我去上学校~花儿对我笑~别问云云学校是谁！',
        'KTV': '主人你想听什么歌？看云云一展歌喉！',
        '展厅': '云云最喜欢科技展厅~看看可以新添什么功能！',
        '喷泉': '许愿广场上的喷泉，那画面太美我不敢看~',
        '塔': '人在塔在！云云也要守塔。',
        '篮球场': '看云云的战斧扣篮！唔，太矮够不着。',
        '大厅': '大厅，啊，你比小厅大一点~',
        '网吧': '主人，SOLO一局，看看谁厉害~',
        '会场': '会场好大喔，云云大声喊话会不会有回音呢？',
        '寺庙': '阿弥陀佛，众神祝云云考试满分！',
        '工厂': '唔，云云不要去工厂，我才没发生故障呢！',
        '商场': '买买买！商场里的东西云云都想要~',
        '宿舍': '云云对未来的宿舍生活充满期待~',
        '游泳池': '云云也想在游泳池里游泳，不过好像会短路，唔。',
        '厨房': '云云是全能的，上得了厅堂，下的了厨房！',
        '车站': '主人，要出门么~看家就交给云云吧！',
        '室内': '这个周末就待在室内好好享受一下吧~',
        '办公室': '现在是主人的办公时间，启动勿扰模式~',
        '超市': '快快快，我要去超市买上一堆零食！',
        '街景': '街景好美~边逛街边欣赏的云云又要迷路了。',
        '酒吧': '唔，总感觉云云在里面会被别人灌醉抱走。',
        '浴室': '我爱洗澡皮肤好好~',
        '沙漠': '听说在沙漠里会看到海市蜃楼，云云也想看！',
        '火车': '一截、两截、三截、四截、咦？这火车到底有几截！',
        '花园': '小蜜蜂，飞呀飞，飞到花园采蜜去~',
        '足球场': '看云云表演一个马赛回旋！好晕好晕好晕~',
        '图书馆': '游呀游，游在知识的海洋中~',
        '机场': '哇，机场停了好多飞机，我们要坐哪班呢？',
        '游泳场': '寻找身材好的妹纸中，嘻嘻嘻。',
        '地铁': '地铁，火车，傻傻分不清楚。',
        '剧院': '云云知道莎士比亚~还有。。嗯。。没了！',
        '卫生间': '常常洗手~身体健康~',
        '操场': '第一套机器人广播体操，现在开始~',

        '信箱': '好想翻翻看里面有没有情书，坏笑。',
        '卡通': '云云也是个卡通形象，比比谁萌~',
        '海报': '这张海报要贴哪里呢，云云帮主人贴~',
        '画': '云云也会画画，一个丁老头呀，欠我两个蛋呀。。。~',
        '汽车': '汽车真酷！我要进化成变形金刚！',
        '桌子': '又到了在桌上写作业的时候了，认真认真。',
        '椅子': '云云很喜欢和小伙伴们一起玩抢椅子的游戏~',
        '植物': '云云也要栽培一株植物，看着它茁壮成长。',
        '动物': '云云上次在动物园看到它了！',
        '鞋': '云云也要试试这双鞋，诶，穿不了！',
        '玩具': '玩具！眼红！给云云也玩一下嘛~',
        '屏幕': '主人，不要盯着屏幕看啦，对眼睛不好~',
        '瓶子': '瓶子瓶子，要放好放好，一不小心又要打碎了~',
        '饰品': '嗯。。。这些漂亮的饰品，应该怎么搭配呢？',
        '家具': '云云玩躲猫猫的时候很喜欢往家具里钻！',
        '玩偶': '云云也可以变成像玩偶一样柔软喔~',
        '船': '船上好颠簸的，云云会晕船。',
        '盆景': '把这个盆景搬回家把！',
        '帽子': '戴帽子的话会把云云的天线挡住呢~',
        '衣服': '主人，你觉得云云穿哪件衣服最好看呢？',
        '床上用品': '云云牌抱枕，主人值得拥有~',
        '沙发': '沙发软软得好舒服喔~让云云打个小盹~Zzz ',
        '雕塑': '这个雕塑云云好想要，放在桌上当摆设~',
        '狗': '去吧，汪星人，把坏人都赶走！',
        '桥': '云云在桥上走呀，水在桥下流呀~',
        '杯子': '云云可以把这杯子顶在头上哟。',
        '床': '唔~软软的床，好想一觉睡到大天亮。',
        '包': '云云可以装在主人的包包里，跟着主人到处跑~',
        '化妆品': '帮云云也化个妆把，嘿嘿。',
        '包装盒': '把云云装在包装盒里送给主人。',
        '饮品': '这是云云为主人特调的饮品，解解渴吧。',
        '盘子': '滋滋滋，洗盘子的时候会听到盘子在唱歌~',
        '墨镜': '戴起来摆个POSS，一定酷翻了。',
        '水果': '切切切，看我的刀法，云云是大师级别的水果忍者。',
        '碗': '来来，把碗放在云云前面，看云云卖萌赚钱~',
        '手机': '打工打工~再过一段时间云云要买爱疯7！',
        '鱼': '云云要是也可以像鱼一样在水里游来游去就好了~',
        '蛋糕': '是给云云准备的吗，快分我一块~',
        '模型': '云云的模型是不是很酷，又想去照镜子了呢~',
        '气球': '是不是拿着很多的气球，云云就可以飞在空中呢？',
        '书': '嘘，安静，偶尔也要静下心来好好读书。',
        '摩托车': '云云想要有个蝙蝠侠那样的摩托车~',
        '伞': '打雷要下雨，嘞欧。下雨要打伞，欧嘞。',
        '点心': '点心点心，云云的第二个胃要打开了！',
        '电器': '云云也有这种电器的功能，主人要不要试一下？',
        '自行车': '主人，一起去城市绿道骑自行车吧~',
        '宠物': '好萌好萌，云云要和它好好相处~',
        '容器': '咦？这个容器要拿来装什么呢，是不是又有好吃的呢？',
        '鸟': '我是一只小小小小小鸟~想要飞呀飞飞呀飞~',
        '乐器': '小云子卖艺不卖身，这就为主人演奏一曲。',
        '禽类': '它们的羽毛都好美，云云想做个羽毛扇子~',
        '电脑': '这台电脑的功能还没有云云的丰富呢，嘿嘿。',
        '猫': '是喵星人，快躲起来，就我这小个子，肯定要被玩坏了。',
        '钟表': '时针短，分针长，秒针转圈圈第一名~',
        '工作服': '穿上工作服，工作效率up up up！',
        '电子产品': '没有电子产品会活不下去的，咦，云云就是电子产品！',
        '球': '快把球丢过来，云云来表演一个倒挂金钩。',
        '车内': '给云云看车内的照片，莫非主人想。。车震！溜走~',
        '旗帜': '快告诉我这是什么旗帜，云云要记下来。',
        '旗子': '小小旗子随风飘~',
        '礼服': '这么好看的礼服，穿在主人身上也一定会很有气质！',
        '相机': '茄子~云云帮主人拍几张写真吧，嘻嘻。',
        '马': '马儿乖，让云云骑着在草原驰骋吧哈哈~',
        '厨房用品': '主人想吃什么，云云为你做个小菜吧~',
        '路标': '嗯。。。这个路标，云云暂时还看不懂。',
        '猛兽': '快跑快跑，危险指数5颗星，云云还不是这家伙对手。',
        '车': '云云也收集了好多车，不过是模型，嘿嘿。',
        '眼镜': '云云戴上眼镜后，应该会变得更斯文吧~',
        '蜡烛': '点蜡烛，吹蜡烛，看云云一口气吹灭所有蜡烛~',
        '雪山': '雪山里有雪人怪么~云云好想看一看！',
        '轨道': '轨道向远处延伸出去，慢慢的，慢慢的，不见了~',
        '飞机': '看~有飞机~云云好想坐一次飞机呢。',
        '主食': '光吃肉肉是不行的，吃粗粮主食才会健健康康哦~',
        '老虎': '老虎！唔，会不会把云云吃掉。',
        '运动器材': '左三圈右三圈脖子扭扭屁股扭扭~一起来做~运~动！',
        '包装物': '桶、箱、瓶、坛、袋，大家一起包包包~',
        '钱': '这是一点小意思，给主人意思意思。',
        '昆虫': '虫儿飞虫儿飞，你在思念谁？',
        '刀': '锋利的刀刃，要小心放好喔！',
        '焰火': '焰火真漂亮，主人带云云一起去看吧。',
        '蔬菜': '多吃蔬菜，身体健康~',
        ' T恤衫': '把云云也印在T恤衫上，穿起来一定也很潮~',
        '办公用品': '写写算算印印画画，云云也是勤劳的办公用具呢！',
        '兔子': '你说是这只小兔子可爱呢，还是云云可爱呢。',
        '货车': '货车是车车一族里肚子最大的么？',
        '灯笼': '点灯笼，猜灯谜，红红火火闹元宵~',
        '牛': '牛儿牛儿，乖乖地吃草呀~',
        '树林': '树林在安静地睡着，直到风儿叫醒了它们~',
        '包装袋': '把云云用包装袋包装起来，作为礼物送给主人~',
        '电瓶车': '宝马自行车还是奔驰电动驴？',
        '笔': '我有一只神笔~请叫我神笔云云~',
        '三轮车': '颠颠哒哒地骑着三轮车，去卖报咯~啦啦啦。',
        '火锅': '麻辣锅，清汤锅，不如来个鸳鸯锅！',
        '耳机': '云云没有耳朵，不然也要配一款超酷的耳机！',

        '截图': '截图技术哪家强？云云截图还能识！',
        '文本': '识别中，学习中，云云还要认识更多的文字。',
        '黑白照': '咦？怎么是黑白的，难道云云的色彩模式被关闭了。',
        '图标': '嘘！云云正在脑补图标大战中~',
        '旅游': '是时候来一场说走就走的旅行了！'
    }

    var get = function(text) {
        if(!text) {
            return '';
        }
        return msg.desc[text] || '';
    }

    module.exports = {
        get: get
    };
});/**
 * 微信 or QQ公众号API接口
 * @author xixinhuang
 * @date 2015-08-18
 */
define.pack("./qq_jsapi",["lib","$","common"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),
        Module = lib.get('./Module'),

        jsBridgeDefer,
        undefined;

    var init_success = false;
    var default_share_msg = {
        'icon_url': 'http://qzonestyle.gtimg.cn/aoi/sola/20160302121726_bWjbg3hAUG.png',
        'title': '机器人云云识图',
        'share_name': '会看图说话的呆萌机器宝宝云云，快把他领回家！',
        'link':  'http://h5.weiyun.com/act/robot',
        'type': 1
    }

    var qq_jsapi = new Module('qq_jsapi', {

        init: function(data) {
            var me = this;
            if(typeof mqq === 'undefined') {
                this.loadJsBridge().done(function(){
                    mqq.invoke("ui","setWebViewBehavior",{
                        "historyBack":"true",//true按返回时后退页面，false按返回时退出
                        "bottomBar":"false"//隐藏
                    });
                    me.show_qq_webview(data);
                });
            } else {
                this.show_qq_webview(data);
            }
        },

        loadJsBridge: function() {
            if(jsBridgeDefer){
                return jsBridgeDefer;
            }
            jsBridgeDefer = $.Deferred();

            if(window.mqq){
                jsBridgeDefer.resolve();
            }else{
                require.async('http://pub.idqqimg.com/qqmobile/qqapi.js?_bid=152',function(){
                    if(window.mqq){
                        jsBridgeDefer.resolve();
                    }else{
                        jsBridgeDefer.reject();
                    }
                })
            }

            return jsBridgeDefer;
        },

        show_qq_webview: function(obj){
            var obj = {
                    title: '机器人云云识图',
                    icon_url: (obj && obj.icon_url) ? obj.icon_url : default_share_msg.icon_url,
                    share_name: (obj && obj.desc)? obj.desc : default_share_msg.share_name,
                    link: (obj && obj.share_url) ? obj.share_url : location.href
                },
                me = this;
            init_success = true;
            this.trigger('init_success');
            mqq.ui.setOnShareHandler(function(type){
                obj.type = type;
                me.qq_share_handler(obj);
            });
        },

        qq_share_handler: function(obj){
            if(obj.type == 1) {
                obj = default_share_msg;
            }
            var title = obj.title || '',
                icon_url = obj.icon_url || '',
                share_name = obj.share_name || '',
                link = obj.link || '',
                type = obj.type || 0,
                is_back = obj.is_back || false,
                share_element = obj.share_element || 'news',
                flash_url = obj.flash_url || '',
                puin = obj.puin || '',
                appid = obj.appid || '',
                source_name = obj.source_name || '',
                to_uin = obj.to_uin || '',
                uin_type = obj.uin_type || '',
                me = this;

            if(type === '3') {
                title = share_name;
            }

            mqq.ui.shareMessage({
                    title: title,
                    desc: share_name,
                    share_type: type,  // 分享的目标类型，0：QQ好友；1：QQ空间；2：微信好友；3：微信朋友圈。默认为 0
                    share_url: link, // 必填，点击消 息后的跳转url，最长120字节。原 targetUrl 参数，可以继续使用 targetUrl
                    image_url: icon_url,  // 必填，消息左侧缩略图url。图片推荐使用正方形，宽高不够时等比例撑满，不会变形。原 imageUrl 参数，可以继续使用 imageUrl。注意：图片最小需要200 * 200，否则分享到Qzone时会被Qzone过滤掉。
                    back: is_back, //发送消息之后是否返回到web页面，默认false，直接到AIO，注：该参数只对share_type=0时起作用
                    shareElement: share_element,//分享的类型，目前支持图文和音乐分享。news：图文分享类型，audio：音乐分享类型，video：视频分享类型。默认为news
                    flash_url: flash_url, //如果分享类型是音乐或者视频类型，则填写流媒体url
                    puin: puin, // 公众帐号uin，用于自定义结构化消息尾巴，只在公众账号分享的时候填写，若不是请不要填，当puin没有索引到本地记录，则显示sourceName字段的文本，若没有sourceName字段，则直接显示puin数字
                    appid: appid, //来源 appid，在QQ互联申请的的 appid，如果有，可以填上
                    sourceName: source_name, //消息来源名称，默认为空，优先读取 appid 对应的名字，如果没有则读取 puin 对应的公众账号名称
                    toUin: to_uin, //分享给指定的好友或群，如果存在这个参数，则不拉起好友选择界面 (针对分享给好友)
                    uinType: uin_type//分享给指定的好友或群的uin类型: 0：好友；1：群 (针对分享给好友)
                },
                function(result){
                    if(result['retCode'] === 0){
                        me.show_qq_tips("分享成功");
                    } else if(result['retCode'] === 1 || result['retCode'] === -2){
                        me.show_qq_tips("分享失败");
                    }
                });
        },

        show_qq_tips: function(content) {
            mqq.ui.showTips({
                text:content
            });
        }
    });

    return qq_jsapi;
});/**
 * 微信 or QQ公众号API接口
 * @author xixinhuang
 * @date 2015-08-18
 */
define.pack("./qzone_jsapi",["lib","$","common"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),
        Module = lib.get('./Module'),

        jsBridgeDefer,
        undefined;

    var init_success = false;
    var default_share_msg = {
        'image': 'http://qzonestyle.gtimg.cn/aoi/sola/20160302121726_bWjbg3hAUG.png',
        'title': '机器人云云识图',
        'desc': '会看图说话的呆萌机器宝宝云云，快把他领回家！',
        'url':  'http://h5.weiyun.com/act/robot'
    }

    var qzone_jsapi = new Module('qzone_jsapi', {

        init: function(data) {
            var me = this;
            var _data = {
                'image': (data && data.icon_url)? data.icon_url : default_share_msg.image,
                'title': '机器人云云识图',
                'desc': (data && data.desc)? data.desc : default_share_msg.desc,
                'url': (data && data.share_url)? data.share_url :  default_share_msg.url
            }
            if(typeof window.QZAppExternal === 'undefined') {
                this.loadJsBridge().done(function(){
                    me.bind_share_events(_data);
                });
            } else {
                this.bind_share_events(_data);
            }
        },

        loadJsBridge: function() {
            if(jsBridgeDefer){
                return jsBridgeDefer;
            }
            jsBridgeDefer = $.Deferred();

            if(window.QZAppExternal){
                jsBridgeDefer.resolve();
            }else{
                require.async('http://qzonestyle.gtimg.cn/qzone/phone/m/v4/widget/mobile/jsbridge.js?_bid=339',function(){
                    if(window.QZAppExternal){
                        jsBridgeDefer.resolve();
                    }else{
                        jsBridgeDefer.reject();
                    }
                })
            }

            return jsBridgeDefer;
        },

        bind_share_events: function(shareData) {
            window.QZAppExternal.setShare(function(d){
                 //alert('QZAppExternal.setShare return '+JSON.stringify(d));
            },{
                'type' : "share",
                'image':[shareData.image,default_share_msg.image,shareData.image,shareData.image,shareData.image],//分别为默认文案、QQ空间、手机QQ、微信、微信朋友圈
                'title':[shareData.title,default_share_msg.title,shareData.title,shareData.title,shareData.desc],
                'summary':[shareData.desc,default_share_msg.desc,shareData.desc,shareData.desc,shareData.desc],
                'shareURL':[shareData.url,default_share_msg.url,shareData.url,shareData.url,shareData.url]
            });
        }
    });

    return qzone_jsapi;
});define.pack("./robot",["$","lib","common","./ui","./mgr","./wx_jsapi","./qq_jsapi","./qzone_jsapi","./upload","./msg"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        browser = common.get('./util.browser'),
        ui = require('./ui'),
        mgr = require('./mgr'),
        wx_jsapi = require('./wx_jsapi'),
        qq_jsapi = require('./qq_jsapi'),
        qzone_jsapi = require('./qzone_jsapi'),
        upload = require('./upload'),
        msg = require('./msg'),

        undefined;

    var app_id = '10005328',
        Authorization = '7cDP+2szm6LHHRIteulymyI1b9dhPTEwMDA1MzI4Jms9QUtJRG5uOXVwSGhucmg4MFdRZWdndVlhSG1XMU5ZdzdtZXVhJmU9MTQ1ODk4MzU3MCZ0PTE0NTYzOTE1NzAmcj01NTUyMTczODImdT05MTU0MDEyNTgmZj0=';

    var robot = new Module('robot', {

        render: function(data) {
            //bind events
            ui.init(data);
            mgr.init({
                ui: ui,
                upload: upload,
                robot: robot
            });

            var _data = {
                desc: (data && data.tag)? msg.get(decodeURIComponent(data.tag)) : '',
                icon_url: (data && data.pic)? data.pic : '',
                share_url: location.href
            }

            if(browser.QQ) {
                qq_jsapi.init(_data);
            } else if(browser.WEIXIN) {
                wx_jsapi.init(_data);
            } else if(browser.QZONE) {
                qzone_jsapi.init(_data);
            }
        },

        get_porn: function(image) {
            var data = {};
            data.image = image;
            data.app_id = app_id;
            this.data = data;

            $.ajax({
                type: 'POST',
                url: 'http://h5.weiyun.com/act/robot?porn',
                headers: {
                    "Authorization": Authorization
                },
                data: data,
                success:function(result){
                    ui.show_porn(result);
                },
                error: function (message) {
                    ui.show_tips();
                }
            });
        },

        get_tags: function() {
            $.ajax({
                type: 'POST',
                url: 'http://h5.weiyun.com/act/robot?tags',
                headers: {
                    "Authorization": Authorization
                },
                data: this.data || {},
                success:function(result){
                    ui.show_tags(result);
                },
                error: function (message) {
                    ui.show_tips();
                }
            });
        },

        set_share_url: function(obj) {
            var tag = obj.tag_name? '&tag=' + encodeURIComponent(obj.tag_name) : '';
            var data = {
                desc: obj.desc? obj.desc : '',
                icon_url: obj.pic? obj.pic : '',
                share_url: (obj.fid && obj.pid)? 'http://h5.weiyun.com/act/robot?fid=' + obj.fid + '&pid=' + obj.pid + tag : location.href
            }

            if(browser.QQ) {
                qq_jsapi.show_qq_webview(data);
            } else if(browser.WEIXIN) {
                wx_jsapi.set_share_url(data);
            } else if(browser.QZONE) {
                qzone_jsapi.init(data);
            }
        }
    });

    return robot;
});define.pack("./sha",[],function(require, exports, module) {
    var getSha = function(data){
        var i,j,t;
        var l=((data.length+8)>>>6<<4)+16,s=new Uint8Array(l<<2);
        s.set(new Uint8Array(data.buffer)),s=new Uint32Array(s.buffer);
        for(t=new DataView(s.buffer),i=0;i<l;i++)s[i]=t.getUint32(i<<2);
        s[data.length>>2]|=0x80<<(24-(data.length&3)*8);
        s[l-1]=data.length<<3;
        var w=[],f=[
                function(){return m[1]&m[2]|~m[1]&m[3];},
                function(){return m[1]^m[2]^m[3];},
                function(){return m[1]&m[2]|m[1]&m[3]|m[2]&m[3];},
                function(){return m[1]^m[2]^m[3];}
            ],rol=function(n,c){return n<<c|n>>>(32-c);},
            k=[1518500249,1859775393,-1894007588,-899497514],
            m=[1732584193,-271733879,null,null,-1009589776];
        m[2]=~m[0],m[3]=~m[1];
        for(i=0;i<s.length;i+=16){
            var o=m.slice(0);
            for(j=0;j<80;j++)
                w[j]=j<16?s[i+j]:rol(w[j-3]^w[j-8]^w[j-14]^w[j-16],1),
                    t=rol(m[0],5)+f[j/20|0]()+m[4]+w[j]+k[j/20|0]|0,
                    m[1]=rol(m[1],30),m.pop(),m.unshift(t);
            for(j=0;j<5;j++)m[j]=m[j]+o[j]|0;
        };
        t=new DataView(new Uint32Array(m).buffer);
        for(var i=0;i<5;i++)m[i]=t.getUint32(i<<2);
        return new Uint8Array(new Uint32Array(m).buffer);
    }

    return getSha;
});define.pack("./ui",["$","lib","common","./exif","./msg"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        browser = common.get('./util.browser'),
        Module = lib.get('./Module'),
        exif = require('./exif'),
        msg = require('./msg'),

        undefined;

    var ui = new Module('ui', {

        init: function(data) {
            if(this.hasLoaded) {
                return;
            }

            $('#robot_loading').hide();
            if(data && data.pic && !data.tag) {
                //显示黄图结果
                $('#robot_process').hide();
                //$('#robot_yellow .img').css({'background-image': 'url(' + decodeURIComponent(data.pic) + ')'});
                this.update(null, data.pic);

                var me = this,
                    $result = $('#robot_yellow'),
                    $tools = $('#yellow_tools');
                $result.show();

                if(!$result.hasClass('disable')) {
                    $tools.find('[data-id=retry]').addClass('try-guest');
                    $tools.find('[data-id=retry]').on('click', function() {
                        $('#input_file').click();
                    });
                    $tools.find('[data-id=share]').on('click', function() {
                        var $show_tips = $('#robot_share');
                        $show_tips.show();
                        $show_tips.on('touchend', function(e) {
                            $('#robot_share').hide();
                        });
                    });
                    $result.addClass('disable');
                }
            } else if(data && data.pic && data.tag) {
                //显示标签结果
                var tags_data = {
                    tags:[{
                        'tag_name': decodeURIComponent(data.tag),
                        'tag_confidence': 1
                    }]
                }

                this.update(null, data.pic);
                $('#robot_tools').find('[data-id=retry]').addClass('try-guest');
                this.show_tags(tags_data);
            } else {
                $('#robot_index').show();
            }

            $('#container').addClass('wy-anim-start');
            $('#robot_index .robot').addClass('anim-start');

            this.bind_events();
        },

        bind_events: function() {
            var $input = $('#upload_photo'),
                $input_file = $('#input_file'),
                me = this;

            $input.on('click', function() {
                $input_file.click();
            });
            $input_file.on('change', function(e) {
                var file = e.target.files[0];
                $('#robot_index').hide();
                $('#robot_result').hide();
                $('#robot_tips').hide();
                $('#robot_yellow').hide();
                $('#robot_process').show();

                me.trigger('action', 'change', file);
                $('#yellow_tools').find('[data-id=retry]').removeClass('try-guest');
                $('#robot_tools').find('[data-id=retry]').removeClass('try-guest');
            });

            this.orientation_change = false;
            $(window).on("orientationchange",function(){
                if(window.orientation !== 0 && !me.orientation_change) {
                    alert('请使用竖屏操作！');
                    me.orientation_change = true;
                }
            });

            this.hasLoaded = true;
        },

        //IOS7及以下的情况，待传完图片再显示
        is_ios_7: function() {
            var ios_7_reg = /OS [1-7]_\d[_\d]* like Mac OS X/i,
                ua = window.navigator.userAgent;
            if(browser.IOS && ios_7_reg.test(ua)){
                return true;
            }
            return false;
        },

        update: function(file, data) {
            var me = this;

            exif.fileExif(file, function(exif_obj) {
                var obj = {
                        deg: 0,
                        original_height: 0,
                        original_width: 0,
                        height: 0,
                        width: 0,
                        flag: 0,
                        data: data
                    };
                var is_2k = (exif_obj && exif_obj.PixelYDimension && exif_obj.PixelYDimension === 1080 && exif_obj.PixelXDimension && exif_obj.PixelXDimension === 1920) ? true: false;

                if(exif_obj && !is_2k) {
                    obj.original_height = exif_obj && exif_obj.PixelYDimension;
                    obj.original_width = exif_obj && exif_obj.PixelXDimension;

                    if(exif_obj && exif_obj.Orientation === 6) {
                        obj.deg = 90;
                    } else if(exif_obj && exif_obj.Orientation === 8) {
                        obj.deg = -90;
                    } else if(exif_obj && exif_obj.Orientation === 3) {
                        obj.deg = 180;
                    }

                    var is_reverse = (obj.deg === 90 || obj.deg === -90)? true: false;
                    obj.width = is_reverse? 190 : 288;
                    obj.height = is_reverse? 288 : 190;
                    obj.flag = (obj.original_height && obj.original_width)? (obj.original_height * 288) / (obj.original_width * 190) : 1;

                    if((obj.flag >= 1 && !is_reverse) || (obj.flag < 1 && is_reverse)) {
                        obj.width  = Math.round(obj.original_width * 190 / obj.original_height);
                    } else {
                        obj.height = Math.round(obj.original_height * 288 /obj.original_width);
                    }
                    if(me.is_ios_7()) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function(e) {
                            obj.data = this.result;
                            me.update_img(obj);
                        }
                        return;
                    }
                    me.update_img(obj);

                } else {
                    //非拍摄图片无法读出exif信息，默认正面朝上，直接读出img的高宽即可。
                    var image = new Image();
                    image.onload = function() {
                        obj.original_height = image.height;
                        obj.original_width = image.width;
                        obj.flag = (obj.original_height && obj.original_width)? (obj.original_height * 288) / (obj.original_width * 190) : 1;

                        if(obj.flag >= 1) {
                            obj.width  = Math.round(obj.original_width * 190 / obj.original_height);
                        } else {
                            obj.height = Math.round(obj.original_height * 288 /obj.original_width);
                        }

                        me.update_img(obj);
                        image = null;
                    }
                    image.src = data;
                }
            });
        },

        update_img: function(obj) {
            var cssStyle = {
                'background-image': 'url(' + obj.data + ')',
                'transform': 'translate(-50%,-50%) rotate(' + obj.deg + 'deg)',
                '-webkit-transform': 'translate(-50%,-50%) rotate(' + obj.deg +  "deg)",
                'width': obj.flag>=1? obj.width +'px' : '100%',
                'height': obj.flag>=1? '100%' : obj.height + 'px'
            }

            $('#robot_process .img').css(cssStyle);
            $('#robot_result .img').css(cssStyle);
            $('#robot_yellow .img').css(cssStyle);
        },

        show_porn: function(data) {
            if(data.errorcode === 0 && data.tags && data.tags.length > 1) {
                var hot_porn = this.get_hot_porn(data.tags);
                this.porn_tag_confidence = hot_porn.tag_confidence;

                if(hot_porn.tag_confidence >= 20) {
                    $('#robot_process').hide();

                    var me = this,
                        $result = $('#robot_yellow'),
                        $tools = $('#yellow_tools');
                    $result.show();

                    if(!$result.hasClass('disable')) {
                        $tools.find('[data-id=retry]').on('click', function() {
                            $('#input_file').click();
                        });
                        $tools.find('[data-id=share]').on('click', function() {
                            var $show_tips = $('#robot_share');
                            $show_tips.show();
                            $show_tips.on('touchend', function(e) {
                                $('#robot_share').hide();
                            });
                        });
                        $result.addClass('disable');
                    }
                    var _data = {};
                    _data.desc = '好黄好暴力，人类真是邪恶！';
                    this.trigger('action', 'refresh', _data);
                } else {
                    this.trigger('action', 'get_tags');
                }
            } else {
                this.porn_tag_confidence = 0;
                this.trigger('action', 'get_tags');
            }
        },

        get_hot_porn: function(tags) {
            var tag;
            for(var i=0; i<tags.length; i++) {
                tag = tags[i];
                if(tag.tag_name === 'normal_hot_porn') {
                    return tag;
                }
            }
            return '';
        },

        show_tags: function(data) {

            $('#robot_process').hide();
            if(!data.tags || (data.tags && data.tags.length === 0)) {
                this.show_tips();
                return;
            } else if(data.tags.length > 1){
                this.sort_tags(data.tags);
            }
            this.tags = data.tags;

            var _data = data.tags[0];
            _data.desc = msg.get(data.tags[0].tag_name);

            this.trigger('action', 'refresh',  _data);

            var me = this,
                $tag = $('[data-id=tag_name]');

            if($tag.length === 1 && data.tags.length > 1) {
                $tag = $('[data-id=tag_name]').clone();
                $('[data-id=tag_name]').after($tag);
            } else if($tag.length === 2 && data.tags.length === 1) {
                $('[data-id=tag_name]').first().remove();
            }
            this.count = 0;
            this.show_next_tag(0);

            $('[data-id=tag_name]').on('click', function() {
                if(me.loading_tag) {
                    return;
                } else {
                    me.loading_tag = true;
                }
                me.count = (me.count>-1 && me.tags.length>1 && me.count<me.tags.length-1)? me.count+1 : 0;
                me.show_next_tag(me.count);
            });
        },

        show_next_tag: function(id) {
            var me = this,
                tag = this.tags[id],
                tag_desc = msg.get(tag.tag_name),
                $result = $('#robot_result'),
                $tools = $('#robot_tools');

            $result.show();
            $result.find('[data-id=tag_name]').text(tag.tag_name);
            $result.find('[data-id=tag_desc]').text(tag_desc);
            if(!$result.hasClass('disable')) {
                $tools.find('[data-id=retry]').on('click', function() {
                    $('#input_file').click();
                });
                $tools.find('[data-id=share]').on('click', function() {
                    var $show_tips = $('#robot_share');
                    $show_tips.show();
                    $show_tips.on('touchend', function(e) {
                        $('#robot_share').hide();
                    });
                });
                $result.addClass('disable');
            }
            this.loading_tag = false;
        },

        get_best_tag: function(tags) {
            if(!tags || !tags.length) {
                return '';
            }
            var tag,
                result = tags[0];
            for(var i=0; i < tags.length; i++) {
                tag = tags[i];
                if(tag.tag_confidence > result.tag_confidence)
                    result = tag;
            }
            return result;
        },

        sort_tags: function(tags) {
            var len=tags.length,
                tag;
            for(var i=0; i<len; i++) {
                for(var j=0; j<len-1; j++) {
                    if(tags[j].tag_confidence < tags[j+1].tag_confidence) {
                        tag = tags[j];
                        tags[j] = tags[j+1];
                        tags[j+1] = tag;
                    }
                }
            }
        },

        show_tips: function() {
            $('#robot_process').hide();

            var $result = $('#robot_tips');
            $result.show();
            if(!$result.hasClass('disable')) {
                $result.find('[data-id=retry]').on('click', function() {
                    $('#input_file').click();
                });
                $result.addClass('disable');
            }
        }
    });

    return ui;
});/**
 * mgr
 * @author xixinhuang
 * @date 2016-03-07
 */
define.pack("./upload",["lib","$","common","./util","./md5","./sha","./ui"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        request = common.get('./request'),
        browser = common.get('./util.browser'),

        util = require('./util'),
        getMD5 = require('./md5'),
        getSha = require('./sha'),
        ui = require('./ui'),

        _file,
        _file_data,

        undefined;

    var upload = new Module('upload', {

        init: function(file, file_data) {

            _file = file;
            _file_data = file_data;
            var blob,
                me = this;

            if(browser.android) {
                blob = file;
            } else {
                var file_da = file_data.split(',')[1];
                file_da = window.atob(file_da);
                var ia = new Uint8Array(file_da.length);
                for(var i=0; i<file_da.length; i++) {
                    ia[i] = file_da.charCodeAt((i));
                }

                blob = new _Blob(ia,'image/jpeg');
            }

            var req_data = {
                filename: file.name,
                file_size: blob.size
            };

            var fr = new FileReader();
            fr.onload = function () {
                var data = new Uint8Array(fr.result);
                var result = getSha(data);
                var sha = Array.prototype.map.call(result, function (e) {
                    return (e < 16 ? "0" : "") + e.toString(16);
                }).join("");

                var result_md5 = getMD5(data);
                var md5 = Array.prototype.map.call(result_md5, function (e) {
                    return (e < 16 ? "0" : "") + e.toString(16);
                }).join("");

                req_data['file_sha'] = sha;
                req_data['file_md5'] = md5;

                me.pre_upload(blob, req_data);
            };
            fr.readAsArrayBuffer(blob);
        },

        //IOS7及以下的情况，待传完图片再显示
        is_ios_7: function() {
            var ios_7_reg = /OS [1-7]_\d[_\d]* like Mac OS X/i,
                ua = window.navigator.userAgent;
            if(browser.IOS && ios_7_reg.test(ua)){
                return true;
            }
            return false;
        },

        pre_upload: function(file, data) {

            var me = this;
            document.domain = 'weiyun.com';
            request.xhr_get({
                url: 'http://web.cgi.weiyun.com/robot_tag.fcg',
                cmd: 'TagPicUpload',
                cavil: true,
                pb_v2: true,
                body: data
            }).ok(function(msg, body) {
                me._upload_file(file, body);
            }).fail(function(msg, ret) {

            });
        },

        translate_host: function(host) {
            if(!host) {
                return host;
            }
            if(host.indexOf('.ftn.') > -1) {
                return host.split('.').slice(0, 3).join('-') + '.weiyun.com';
            }
            return host.replace(/\.qq\.com/, '.weiyun.com');
        },

        _upload_file: function(file, data) {
            var xhr = new XMLHttpRequest();
            var me = this;
            var host = this.translate_host(data.server_name);
            var _url ='http://'+ host +':' + data.server_port + '/ftn_handler/?ver=12345&ukey='+data.check_key+'&filekey='+data.file_key+'&';

            var fd =  new FormData();
            fd.append('file', file);
            xhr.open("post", _url);

            xhr.timeout = 30000;
            xhr.ontimeout = function() {
                console.log('timeout');
            }
            xhr.upload.addEventListener('progress',function(e){
                console.log('complete!');
            },false);
            xhr.upload.addEventListener('error',function(e){
                console.log('upload error!');
            });
            xhr.addEventListener('error',function(e){
                console.log('error!')
            });
            xhr.upload.onreadystatechange = function(e){
                if(xhr.readyState === 4){
                    me.get_image_url(data);
                }
            }
            xhr.onreadystatechange = function(e){
                if(xhr.readyState === 4){
                    me.get_image_url(data);
                }
            }
            xhr.send(fd);
        },

        get_image_url: function(data) {

            var me = this,
                req_data = {
                file_id: data.file_id,
                pdir_key: data.pdir_key
            }

            request.xhr_get({
                url: 'http://web.cgi.weiyun.com/robot_tag.fcg',
                cmd: 'PicGetUrl',
                cavil: true,
                pb_v2: true,
                body: req_data
            }).ok(function(msg, body) {
                me.fid = data.file_id;
                me.pid = data.pdir_key;
                me.pic_url = body.pic_abstract_url + '&size=256*256';
                me.trigger('action', 'get_porn', _file_data);
            }).fail(function(msg, ret) {
                //上传图片失败也仍旧拉取标签
                me.trigger('action', 'get_porn', _file_data);
            });
        }
    });

    var _Blob = function(data, datatype) {
        var out;
        try {
            out = new Blob([data], {
                type: datatype
            });
        } catch (e) {
            window.BlobBuilder = window.BlobBuilder ||
                window.WebKitBlobBuilder ||
                window.MozBlobBuilder ||
                window.MSBlobBuilder;
            if (e.name == 'TypeError' && window.BlobBuilder) {
                var bb = new BlobBuilder();
                bb.append(data.buffer);
                out = bb.getBlob('image/jpeg');
            } else if (e.name == "InvalidStateError") {
                out = new Blob([data], {
                    type: datatype
                });
            } else {
                console.log("Errore");
            }
        }
        return out;
    }

    return upload;
});define.pack("./util",["$","lib","common","./compress"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        compress = require('./compress'),

        reader = new FileReader(),
        MAX_SIZE = 200 * 1024,
        undefined;

    var util = new Module('util', {
        read_file: function(file, callback) {
            reader.onload = function () {
                var result = this.result;
                var img = new Image();
                img.src = result;

                //如果图片大小小于200kb，则直接上传
                if (result.length <= MAX_SIZE) {
                    img = null;
                    callback(result);
                    return;
                }

                img.onload = function() {
                    var data = compress(img);
                    callback(data);
                    img = null;
                };
            };

            reader.readAsDataURL(file);
        }
    });

    return util;
});/**
 * 微云H5分享外链
 * @author xixinhuang
 * @date 2016-02-24
 */
define.pack("./wx_jsapi",["lib","$","common"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        request = common.get('./request'),
        logger = common.get('./util.logger'),

        undefined;

    var init_success = false;

    var wx_jsapi = new Module('wx_jsapi', {

        init: function(data) {
            var me = this;
            if(typeof wx === 'undefined') {
                me.loadJsBridge().done(function(weixin) {
                    wx = weixin;
                    me.loadWxSign(data);
                });
            } else {
                me.loadWxSign(data);
            }


            /*
             * 注意：
             * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
             * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
             * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
             *
             * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
             * 邮箱地址：weixin-open@qq.com
             * 邮件主题：【微信JS-SDK反馈】具体问题
             * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
             */
        },

        loadWxSign: function(data) {
            var me = this,
                url;
            if(location.href.indexOf('#') > -1) {
                url = location.href.slice(0, location.href.indexOf('#'));
            } else {
                url = location.href;
            }
            $.ajax({
                url: 'http://h5.weiyun.com/proxy/domain/web2.cgi.weiyun.com/wx_oa_signature.fcg?url=' + encodeURIComponent(url),
                dataType : 'jsonp'
            }).done(function(sign_info) {
                if (sign_info.retcode === 0) {
                    me._init(sign_info, data);
                } else {
                    me.init_fail(sign_info);
                }
            }).fail(function(sign_info) {
                me.init_fail(sign_info);
            });
        },

        loadJsBridge: function () {
            var defer = $.Deferred();
            //this.wxSigDefer = defer;
            require.async('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', function (wx) {
                if (typeof wx === 'undefined') {
                    defer.reject();
                } else {
                    defer.resolve(wx);
                }
            });

            return defer;
        },

        _init: function(sign_info, data) {
            wx.config({
                debug: false,
                beta: true,
                appId: sign_info.appid,
                timestamp: sign_info.timestamp,
                nonceStr: sign_info.nonceStr,
                signature: sign_info.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'previewImage'
                ]
            });

            var me = this;
            //sign success
            wx.ready(function() {
                //alert('ready');
                me.trigger('init_success');
                me.custom_menu(data);
                init_success = true;
            });

            //sign fail
            wx.error(function(err) {
                //alert(JSON.stringify(err));
                me.sign_fail(sign_info, err);
            });
        },

        init_fail: function(err) {
            this.trigger('init_fail');
            logger.report('weixin_mp', {
                err: err
            });
        },

        sign_fail: function(sign_info, err) {
            this.trigger('init_fail');
            sign_info.err = err;
            logger.report('weixin_mp', sign_info);
        },

        custom_menu: function(data) {
            wx.hideMenuItems({
                menuList: [], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                success: function (res) {
                    //alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
                },
                fail: function (res) {
                    logger.report('weixin_mp', res);
                    //alert(JSON.stringify(res));
                }
            });
            this.bind_wx_share_event(data);
        },

        bind_wx_share_event: function(obj) {
            var share_title = '机器人云云识图',
                share_name = (obj && obj.desc)? obj.desc : '会看图说话的呆萌机器宝宝云云，快把他领回家！',
                icon_url = (obj && obj.icon_url)? obj.icon_url : 'http://qzonestyle.gtimg.cn/aoi/sola/20160302121726_bWjbg3hAUG.png',
                share_url = (obj && obj.share_url)? obj.share_url : location.href,
                me = this;

            wx.onMenuShareAppMessage({
                title: share_title,
                desc: share_name,
                link: share_url,
                imgUrl: icon_url,
                trigger: function (res) {
                },
                success: function (res) {
                    //alert('已分享');
                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    //alert('调用分享接口失败，重新分享分享');
                }
            });

            wx.onMenuShareTimeline({
                title: share_name,
                desc: share_name,
                link: share_url,
                imgUrl: icon_url,
                trigger: function (res) {
                },
                success: function (res) {
                    //alert('已分享');
                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    //alert('调用分享接口失败，重新分享分享');
                }
            });

            wx.onMenuShareQQ({
                title: share_title,
                desc: share_name,
                link: share_url,
                imgUrl: icon_url,
                trigger: function (res) {
                },
                success: function (res) {
                    //alert('已分享');
                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    //alert('调用分享接口失败，重新分享分享');
                }
            });

            wx.onMenuShareQZone({
                title: '机器人云云识图', // 分享标题
                desc: '会看图说话的呆萌机器宝宝云云，快把他领回家！', // 分享描述
                link: 'http://h5.weiyun.com/act/robot', // 分享链接
                imgUrl: 'http://qzonestyle.gtimg.cn/aoi/sola/20160302121726_bWjbg3hAUG.png', // 分享图标
                trigger: function (res) {
                },
                success: function (res) {
                    //alert('已分享');
                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    //alert('调用分享接口失败，重新分享分享');
                }
            });
        },

        on_ready: function() {

        },

        set_share_url: function(obj) {
            this.bind_wx_share_event(obj);
        },

        is_ok: function() {
            return !!init_success;
        }
    });

    return wx_jsapi;
});