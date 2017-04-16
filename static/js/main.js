/**
 * Created by kingdee on 2017/3/26.
 */
window.onload = function() {
    var oSrc = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg", "img6.jpg", "img7.jpg", "img8.jpg", "img9.jpg"],
        oWrap = document.getElementById("wrap"),
        oMinus = document.getElementById("s_minus"),
        oAdd = document.getElementById("s_add"),
        oSize = document.getElementById("percent"),
        oRatio = document.getElementById("ratio"),
        oPrev = document.getElementById("prev"),
        oNext = document.getElementById("next"),
        oOrigin = document.getElementById("origin"),
        oFit = document.getElementById("fit");

    function imageView(oSrc, options) {
        this.oImg = null;
        this.oDiv = null;
        this.num = 0;
        this.scaleSize = [];
        var _this = this;
        this.init(oSrc);
        window.onresize = function () {
            oWrap.style.transition = "left 0s";
            _this.setPosW();
            //_this.fit();
        }
        oPrev.onclick = function () {
            _this.slide(this);
        }
        oNext.onclick = function () {
            _this.slide(this);
        }
        oMinus.onclick = function () {
            _this.scale(this);
        }
        oAdd.onclick = function () {
            _this.scale(this);
        }
        oOrigin.onclick = function () {
            _this.origin();
        }
        oFit.onclick = function () {
            _this.fit();
        }
        document.onmousewheel = function (e) {
            var ev = e || event;
            ev.wheelDelta > 0 ? _this.scale(oAdd) : _this.scale(oMinus);
        }
    }

    imageView.prototype.init = function (oSrc, options) {
        var _this = this;
        var str = "";
        for (var i = 0; i < oSrc.length; i++) {
            str += "<div><img src='static/images/" + oSrc[i] + "'/></div>";
        }
        oWrap.innerHTML = str;
        oWrap.style.width = oSrc.length * document.documentElement.clientWidth + "px";
        this.oImg = oWrap.getElementsByTagName("img");
        this.oDiv = oWrap.getElementsByTagName("div");
        for (var k = 0; k < this.oDiv.length; k++) {
            this.oDiv[k].style.width = document.documentElement.clientWidth + "px";
        }
        for (var i = 0; i < this.oImg.length; i++) {
            this.scaleSize.push(1);
            this.oImg[i].onload = function () {
                _this.fit();
                this.style.left = (this.parentNode.offsetWidth - this.offsetWidth) / 2 + "px";
                this.style.top = (this.parentNode.offsetHeight - this.offsetHeight) / 2 + "px";
                this.onmousedown = function(e){
                    _this.drag(this,e);
                    return false;
                };
            }
            if (i >= 1) {
                this.oImg[i].style.opacity = 0;
            }
        }
        oRatio.innerHTML = 1 + "/" + oSrc.length;
    }
    imageView.prototype.setPosW = function () {
        oWrap.style.width = oSrc.length * document.documentElement.clientWidth + "px";
        oWrap.style.left = -this.num * document.documentElement.clientWidth + "px";
        for (var i = 0; i < this.oImg.length; i++) {
            this.oDiv[i].style.width = document.documentElement.clientWidth + "px";
            this.oImg[i].style.left = ( this.oImg[i].parentNode.offsetWidth - this.oImg[i].offsetWidth) / 2 + "px";
            this.oImg[i].style.top = ( this.oImg[i].parentNode.offsetHeight - this.oImg[i].offsetHeight) / 2 + "px";
        }
    }
    imageView.prototype.slide = function (obj) {
        oWrap.style.transition = "left 1s";
        if (obj.id == "prev") {
            if (this.num == 0) {
                alert("已经是第一张图片！");
            }
            else {
                this.num--;
            }
        }
        if (obj.id == "next") {
            if (this.num == oSrc.length - 1) {
                alert("已经是最后一张了！");
            }
            else {
                this.num++;
            }
        }
        this.fit();
        oWrap.style.left = -this.num * this.oDiv[0].offsetWidth + "px";
        this.oImg[this.num].style.opacity = 1;
        oRatio.innerHTML = this.num + 1 + "/" + oSrc.length;
        oSize.innerHTML = Math.round(this.scaleSize[this.num] * 100) + "%";
    }
    imageView.prototype.scale = function (obj) {
        var currentImg = this.oImg[this.num];
        if (obj.id == "s_minus"){
            if(this.scaleSize[this.num] > 0.5){
                this.scaleSize[this.num] -= 0.5;
            }
            else if(this.scaleSize[this.num] <= 0.5&&Math.floor(currentImg.offsetWidth*this.scaleSize[this.num])>300&&Math.floor(currentImg.offsetHeight*this.scaleSize[this.num])>300){
                this.scaleSize[this.num] -= 0.1;
            }
        }
        if (obj.id == "s_add") {
            if(this.scaleSize[this.num] >= 0.5&&this.scaleSize[this.num]<22){
                this.scaleSize[this.num] += 0.5;
            }
            else if(this.scaleSize[this.num]<0.5){
                this.scaleSize[this.num] += 0.1;
            }

        }
        currentImg.style.transform = "scale(" + this.scaleSize[this.num] + ")";
        oSize.innerHTML = Math.round(this.scaleSize[this.num] * 100) + "%";
    }
    imageView.prototype.origin = function () {
        this.oImg[this.num].style.transform = "scale(1)";
        this.scaleSize[this.num] = 1;
        oSize.innerHTML = 100 + "%";
    }
    imageView.prototype.fit = function () {
        var obj = this.oImg[this.num];
        if (obj.offsetWidth >=  document.documentElement.clientWidth) {
            console.log("lalal");
            console.log(obj.offsetWidth);
            console.log(document.documentElement.clientWidth);
            this.scaleSize[this.num] = 1-(obj.offsetWidth - document.documentElement.clientWidth*0.8) / obj.offsetWidth;
        }
        else if(obj.offsetWidth*this.scaleSize[this.num]>=document.documentElement.clientWidth){
            this.scaleSize[this.num] = 1;
        }
        obj.style.transform = "scale(" + this.scaleSize[this.num] + ")";
        oSize.innerHTML = Math.round(this.scaleSize[this.num]*100)+"%";
        this.setPosW();
    }
    imageView.prototype.drag = function(obj,e){ //自定义的函数，没有默认事件
        obj.className = "grab";
        var ev = e||window.event;
        var disX = ev.clientX - obj.offsetLeft;
        var disY = ev.clientY - obj.offsetTop;
        var _this = this;
        document.onmousemove = function(e2){
            var en = e2||window.event;
            obj.style.left = en.clientX-disX+"px";
            obj.style.top = en.clientY-disY+"px";
            //var scaleW = (obj.offsetWidth*_this.scaleSize[_this.num]-obj.offsetWidth)/2;  //一边放大了多少(现在的宽度减去原来的宽度）
            //var scaleH = (obj.offsetHeight*_this.scaleSize[_this.num]-obj.offsetHeight)/2;
            //var leftL = obj.offsetWidth+scaleW-20;//除以2是因为缩放的点在中心，如果没有缩放，scaleW就是0;
            //var rightL = document.documentElement.clientWidth+scaleW-50;
            //var topT = obj.offsetHeight+scaleH-20;
            //var bottomT = document.documentElement.clientHeight+scaleH-20;
            //if(obj.offsetLeft<0&&obj.offsetLeft<=-leftL){
            //    obj.style.left = -leftL+"px";
            //    console.log(obj.style.left);
            //    obj.style.transformOrigin = "right center";
            //}
            //if(obj.offsetLeft>0&&obj.offsetLeft>=rightL){
            //    obj.style.left = rightL + "px";
            //    obj.style.transformOrigin = "left center";
            //}
            //if(obj.offsetTop<0&&obj.offsetTop<=-topT){
            //    obj.style.top = -topT+"px";
            //    obj.style.transformOrigin = "bottom center";
            //}
            //if(obj.offsetTop>0&&obj.offsetTop>=bottomT){
            //    obj.style.top = bottomT + "px";
            //    obj.style.transformOrigin = "top center";
            //}
            //if(obj.offsetLeft!=-leftL&&obj.offsetLeft!=rightL&&obj.offsetTop!=-topT&&obj.offsetTop!=bottomT){
            //    obj.style.transformOrigin = "center center";
            //}
        }
        document.onmouseup = function(){
            obj.className = "";
            document.onmousedown = null;
            document.onmousemove = null;
        }
    }
    var v = new imageView(oSrc);
}