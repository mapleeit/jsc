
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        Module = common.get('./module'),

        exif = require('./exif'),

        undefined;

    var file_exif = new Module('file_exif', {
        take_time: 0,

	    get_exif_by_file: function(file, callback) {
		    this.take_time = file['lastModified'];
		    var me = this;
		    exif.fileExif(file, function(exif_obj) {
			    var exif_info;
			    if(exif_obj) {
				    exif_info = me.get_exif(exif_obj);
				    if(!exif_info.take_time) {
					    exif_info.take_time = me.take_time;
				    }
			    } else{
				    exif_info = me.get_default_exif();
			    }
			    callback(exif_info);
		    });
	    },
        get_default_exif: function() {
            var default_exif = {'take_time': this.take_time};
            return default_exif;
        },
        get_exif: function(obj) {
            var exif_info = {},
                gps_ref = this.get_gps_ref(obj);
            exif_info.take_time = this.get_take_time(obj);
            if(obj.GPSLongitude && !!this.get_gps(obj.GPSLongitude[0], obj.GPSLongitude[1], obj.GPSLongitude[2])){
                exif_info.longitude = this.get_gps(obj.GPSLongitude[0], obj.GPSLongitude[1], obj.GPSLongitude[2]);
                if(!gps_ref.GPSLongitude){
                    exif_info.longitude = -exif_info.longitude;
                }
            }
            if(obj.GPSLatitude && !!this.get_gps(obj.GPSLatitude[0], obj.GPSLatitude[1], obj.GPSLatitude[2])){
                exif_info.latitude = this.get_gps(obj.GPSLatitude[0], obj.GPSLatitude[1], obj.GPSLatitude[2]);
                if(!gps_ref.GPSLatitude){
                    exif_info.latitude = -exif_info.latitude;
                }
            }
            exif_info.width = obj.PixelXDimension;
            exif_info.height = obj.PixelYDimension;
            return exif_info;
        },

        get_take_time: function(obj) {
            var time = obj.DateTimeOriginal || obj.DateTime,
                time_str,
                take_time;
            if(!time){
                return this.take_time;
            } else{
                time_str = time.replace(':','/').replace(':','/');
                take_time = new Date(time_str).getTime();
            }
            return take_time;
        },
        get_gps_ref: function(obj) {
            var ref = {};
            if(obj.GPSLongitudeRef && obj.GPSLongitudeRef.toLowerCase() == 'e') {
                ref.GPSLongitude = true;
            } else {
                ref.GPSLongitude = false;
            }
            if(obj.GPSLatitudeRef && obj.GPSLatitudeRef.toLowerCase() == 'n') {
                ref.GPSLatitude = true;
            } else {
                ref.GPSLatitude = false;
            }
            return ref;
        },
        get_gps: function(degree, min, second) {
            var gps;
            if (Math.abs(degree)>180.0 || Math.abs(min)>60.0 || Math.abs(second)>60.0) {
                return;
            }
            gps = degree;
            gps += min / 60;
            gps += second / 3600;
            return gps;
        }
    });

    return file_exif;
});