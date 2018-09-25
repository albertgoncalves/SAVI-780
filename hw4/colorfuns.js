// via https://gist.github.com/mjackson/5311256
var hslToRgb = function (h, s, l) {
    var hslHelper = function (hh, ss, ll) {
        var q = ll < 0.5 ? ll * (1 + ss)
            : ll + ss - ll * ss;
        var p = 2 * ll - q;
        var rgb = [[p, q, hh + (1 / 3)] // r
            ,
            [p, q, hh] // g
            ,
            [p, q, hh - (1 / 3)] // b
        ];
        return rgb.map(function (x) { return hueToRgb(x) * 255; });
    };
    var hueToRgb = function (pqt) {
        var p = pqt[0], q = pqt[1], t = pqt[2];
        var tt = t < 0 ? t + 1
            : t > 1 ? t - 1
                : t;
        return tt < (1 / 6) ? p + (q - p) * 6 * tt
            : tt < (1 / 2) ? q
                : tt < (2 / 3) ? p + (q - p) * ((2 / 3) - tt) * 6
                    : p;
    };
    return s === 0 ? [l, l, l]
        : hslHelper(h, s, l);
};
var rgbToHex = function (r, g, b) {
    var rgbHelper = function (rgb) {
        var hex = Number(rgb).toString(16);
        return hex.length < 2 ? "0" + hex
            : hex;
    };
    var _a = [r, g, b].map(function (x) { return rgbHelper(x); }), red = _a[0], green = _a[1], blue = _a[2];
    return "#" + red + green + blue;
};
// 0 <= h, s, l <= 1
var hslToHex = function (h, s, l) {
    var _a = hslToRgb(h, s, l).map(function (x) { return Math.floor(x); }), r = _a[0], g = _a[1], b = _a[2];
    return rgbToHex(r, g, b);
};
