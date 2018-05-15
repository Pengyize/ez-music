{
    let view = {
        el: `.page > main`,
        init(){
            this.$el = $(this.el)
        },
        template: `
        <form action="" class="form">
            <div class="row">
                <label for="">
                    歌名
                </label>
                <input name="name" type="text" value="__name__">
            </div>
            <div class="row">
                <label for="">
                    歌手
                </label>
                <input name="singer" type="text" value="__singer__">
            </div>
            <div class="row">
                <label for="">
                    外链
                </label>
                <input name="url" type="text" value="__url__">
            </div>
            <div class="row action">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        render(data = {}){  //若没有传data或data是undefined，就默认等于空对象
            let placeholders = ['name', 'url', 'singer', 'id'];
            let html = this.template;
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html);
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset(){
            this.render({});
        }

    }
    let model = {
        data: {name: '',singer: '', url: '', id: ''},
        create(data){
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name',data.name);
            song.set('singer',data.singer);
            song.set('url',data.url);
            return song.save().then((newSong) => {
                let {id , attributes} = newSong;
                Object.assign(this.data,{id,...attributes})
            }, (error) => {
                console.error(error);
            });
        },
        update(data){
            var song = AV.Object.createWithoutData('Song', this.data.id);
            // 修改属性
            song.set('name',data.name);
            song.set('singer',data.singer);
            song.set('url',data.url);
            // 保存到云端
            return song.save().then((response)=>{
                Object.assign(this.data, data)
                return response
            })
        }
     };
    let controller = {
        init(view,model){
            this.view = view;
            this.view.init();
            this.model = model;
            this.view.render(this.model.data);
            this.bindEvents();
            window.eventHub.on('select',(data)=>{
                this.model.data = data;
                this.view.render(this.model.data)
            });
            window.eventHub.on('new',(data)=>{
                if(this.model.data.id){
                    this.model.data = {
                        name: '', url: '', id: '', singer: ''
                    };
                }else{
                    Object.assign(this.model.data,data);
                }

                this.view.render(this.model.data)
            })
        },
        create(){
            let  needs = 'name singer url'.split(' ');
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name = "${string}"]`).val();
            })
            this.model.create(data) //一旦create，moel就会拿到最新的数据
                .then(()=>{
                    this.view.reset();
                    window.eventHub.emit('create', JSON.parse(JSON.stringify(this.model.data)));
                })
        },
        update(){
            let  needs = 'name singer url'.split(' ');
            let data = {};
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name = "${string}"]`).val();
            });
            this.model.update(data)
                .then(()=>{
                    window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
                })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{ //事件委托，委托main监听form的提交事件
                e.preventDefault()
                if(this.model.data.id){
                    this.update();
                }else{
                    this.create();
                }
                return;
            })
        }
    };
    controller.init(view,model);
}