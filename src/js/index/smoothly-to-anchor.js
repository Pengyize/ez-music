!function () {
    let view  = document.querySelector('#anchor');
    let controller ={
        view: null,
        aTags: null,
        init: function (view) {
            this.view = view;
            this.initAnimation();
            this.bindEvents();
        },
        initAnimation: function () {
            function animate(time) {
                requestAnimationFrame(animate);
                TWEEN.update(time);
            }
            requestAnimationFrame(animate);
        },
        bindEvents: function () {
            let aTags = document.querySelectorAll('.anchor');
            for (let i = 0; i < aTags.length; i++) {
                aTags[i].onclick =  (x) => {
                    x.preventDefault();
                    let a = x.currentTarget;
                    let href = a.getAttribute('href');
                    let element = document.querySelector(href);         //'#siteAbout'
                    this.scrollToElement(element);
                }
            }
        },
        scrollToElement: function (element) {
            let top = element.offsetTop;
            let currentTop = window.scrollY;  //当前位置
            let targetTop = top-200;    //目标位置
            let coords = { y: currentTop};
            let tween = new TWEEN.Tween(coords)
                .to({ y: targetTop}, 600)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function() {
                    window.scrollTo(0,coords.y);
                    })
                .start();
        }
    };
    controller.init(view);
}();
