'use strict';

(function () {
    //缓动函数
    window.requestAnimFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    }();

    var can = document.getElementById('canvas'); //取到画布
    var cxt = can.getContext('2d'); //绘制环境

    var w = window.innerWidth;
    var h = window.innerHeight;

    //定义画布的大小
    can.width = w;
    can.height = h;

    //雪花数量
    var snumber = 100;
    //雪花坐标
    var arr = [];

    //雪花坐标
    for (var i = 0; i < snumber; i++) {
        arr.push({
            x: Math.random() * w, //画布范围内X坐标随机出现
            y: Math.random() * h, //画布范围内y坐标随机出现
            r: Math.random() * 3 + 1 //随机半径坐标
        });
    }

    function drawnow() {
        cxt.shadowColor = randomcolor();
        cxt.shadowOffsetX = 1;
        cxt.shadowOffsetY = 1;
        cxt.shadowBlur = 15;
        cxt.clearRect(0, 0, w, h);
        cxt.beginPath();
        for (var i = 0; i < snumber; i++) {
            var p = arr[i];
            cxt.moveTo(p.x, p.y);
            cxt.arc(p.x, p.y, p.r, 0, 360, false);
        }
        cxt.fillStyle = "#fff";
        cxt.fill();
        cxt.closePath();
        snowdown();
        requestAnimFrame(drawnow);
    }
    drawnow();

    function snowdown() {
        for (var i = 0; i < snumber; i++) {
            var p = arr[i];
            p.y += Math.random();
            if (p.y > h) {
                p.y = 0;
            }
            if (i > 80) {
                p.x += Math.random() * 0.6;
                if (p.x > w) {
                    p.x = 0;
                }
            } else if (i < 60) {
                p.x += Math.random() * 0.6;
                if (p.x < 0) {
                    p.x = w;
                }
            }
        }
    }

    //美化雪花
    function randomcolor() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        var a = Math.random();
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
})();

(function () {
    var heart3d = document.querySelector(".heart3d");
    for (var i = 0; i < 36; i++) {
        var oDiv = document.createElement("div");
        heart3d.appendChild(oDiv);
        oDiv.className = "heart" + (i + 1);
        oDiv.style.transform = "rotateY(" + 10 * i + "deg) rotateZ(45deg) translateX(30px)";
        oDiv.style.borderColor = randomcolor();
    }

    function randomcolor() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        var a = Math.random();
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
})();