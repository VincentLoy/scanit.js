/*!
 * Project : scanit
 * File : scanit
 * Date : 15/07/2015
 * License : MIT
 * Version : 1.0.0
 * Author : Vincent Loy <vincent.loy1@gmail.com>
 */
/*global window, document, QrCode*/
(function (exports) {
    'use strict';

    var extend,
        scanit;

    extend = function (out) {
        var i,
            obj,
            key;
        out = out || {};

        for (i = 1; i < arguments.length; i += 1) {
            obj = arguments[i];

            if (obj) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object') {
                            extend(out[key], obj[key]);
                        } else {
                            out[key] = obj[key];
                        }
                    }
                }
            }
        }

        return out;
    };

    scanit = function (elt, args) {

        var parameters = extend({
                size: 25,
                blankColor: '#fff',
                blackColor: '#000'
            }, args),
            elements = document.querySelectorAll(elt),
            stylizeSquare;

        stylizeSquare = function (elt, color) {
            elt.style.fill = color;
            elt.style.stroke = color;
            elt.style.strokeWidth = 1;
        };

        Array.prototype.forEach.call(elements, function (qrZone) {
            var data = qrZone.dataset.scanit,
                zoneSize = qrZone.clientWidth,
                svgTag = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
                qrCode = new QrCode(data),
                qrDatas = qrCode.getData(),
                squareSize = zoneSize / qrDatas.length,
                group,
                square,
                x,
                y;

            svgTag.setAttribute('width', zoneSize);
            svgTag.setAttribute('height', zoneSize);
            svgTag.setAttribute('viewBow', '0 0 ' + zoneSize + ' ' + zoneSize);
            svgTag.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');

            for (y = 0; y < qrDatas.length; y += 1) {
                group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                group.setAttribute('width', zoneSize);
                group.setAttribute('height', squareSize);

                group.setAttribute('x', 0);
                group.setAttribute('y', squareSize * (y + 1));

                for (x = 0; x < qrDatas[y].length; x += 1) {
                    square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    square.setAttribute('width', squareSize);
                    square.setAttribute('height', squareSize);
                    square.setAttribute('x', squareSize * x);
                    square.setAttribute('y', squareSize * y);

                    if (qrDatas[y][x] > 0) {
                        stylizeSquare(square, parameters.blackColor);
                    } else {
                        stylizeSquare(square, parameters.blankColor);
                    }

                    group.appendChild(square);
                }

                svgTag.appendChild(group);
            }

            qrZone.appendChild(svgTag);
        });
    };

    exports.scanit = scanit;
}(window));

/*global $, jQuery, scanit*/
if (window.jQuery) {
    (function ($, scanit) {
        'use strict';

        function scanitify(el, options) {
            scanit(el, options);
        }

        $.fn.scanit = function (options) {
            return scanitify(this.selector, options);
        };
    }(jQuery, scanit));
}
