{
    let view = {
        el: `.newSong`,
        template:`
          新建歌曲
        `,
        render(){
            $(this.el).html(this.template);
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            $(this.view.el).on('click',()=>{
                window.eventHub.emit('new');
            });
        }
    }
    controller.init(view,model)
}