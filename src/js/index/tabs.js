{
    let view = {
        el: '#tabs',
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {

    }
    let controller = {
        init(view,model){
            this.view = view;
            this.view.init();
            this.model = model;
            this.bindEvents();
        },
        bindEvents(){
            this.view.$el.on('click','.tabs-nav > li', (e)=>{
                let $li = $(e.currentTarget);
                console.log($li)
                let pageName = $li.attr('data-tab-name')
                $li.addClass('active')
                    .siblings().removeClass('active')

                window.eventHub.emit('selectTab',pageName)
            })
        }
    };
    controller.init(view,model);

}