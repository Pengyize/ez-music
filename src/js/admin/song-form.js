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
            <div class="row">
                <label for="">
                    封面
                </label>
                <input name="cover" type="text" value="__cover__">
            </div>
            <div class="row">
                <label for="">
                    序号
                </label>
                <input name="order" type="text" value="__order__">
            </div>
            <div class="row textArea">
                <label>
                    歌词
                </label>
                <textarea name="lyrics" cols="52" rows="10" >__lyrics__</textarea>
            </div>
            <div class="row action">
                <button type="submit">保存</button>
                <button id="delete" type="button">删除</button>
            </div>
        </form>
        `,
        render(data = {}){  //若没有传data或data是undefined，就默认等于空对象
            let placeholders = ['name', 'url', 'singer', 'id', 'cover', 'lyrics', 'order'];
            let html = this.template;
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html);
        },
        reset(){
            this.render({});
        }
    }
    let model = {
        data: {name: '',singer: '', url: '', id: '', cover:'', lyrics:'', order:''},
        create(data){
            let singer = $('input[name=singer]').val();
            let name = $('input[name=name]').val();
            let url = $('input[name=url]').val();
            let cover = $('input[name=cover]').val();
            if (!name && !singer && !url && !cover){
                alert('请输入内容~')
            }else if(!name){
                alert('你没有输入歌名哦~')
            }else if(!singer) {
                alert('你没有输入歌手哦~')
            }else if(!url) {
                alert('你没有输入歌曲外链哦~')
            }else if(!cover) {
                alert('你没有输入封面url哦~')
            }else {
                // 声明类型
                var Song = AV.Object.extend('Song');
                // 新建对象
                var song = new Song();
                // 设置名称
                song.set('name', data.name);
                song.set('singer', data.singer);
                song.set('url', data.url);
                song.set('cover', data.cover);
                song.set('lyrics', data.lyrics);
                song.set('order', data.order);
                return song.save().then((newSong) => {
                    let {id, attributes} = newSong;
                    Object.assign(this.data, {id, ...attributes})
                }, (error) => {
                    console.error(error);
                });
            }
        },
        update(data){
            let singer = $('input[name=singer]').val();
            let name = $('input[name=name]').val()
            let url = $('input[name=url]').val()
            let cover = $('input[name=cover]').val()
            if (!name && !singer && !url && !cover){
                alert('请输入内容~')
            }else if(!name){
                alert('你没有输入歌名哦~')
            }else if(!singer) {
                alert('你没有输入歌手哦~')
            }else if(!url) {
                alert('你没有输入外链哦~')
            }else if(!cover) {
                alert('你没有输入封面url哦~')
            }else {
                var song = AV.Object.createWithoutData('Song', this.data.id);
                // 修改属性
                song.set('name', data.name);
                song.set('singer', data.singer);
                song.set('url', data.url);
                song.set('cover', data.cover);
                song.set('lyrics', data.lyrics);
                song.set('order', data.order);
                // 保存到云端
                return song.save().then((response) => {
                    Object.assign(this.data, data)
                    return response
                })
            }
        },
        delete(id){
            let song = AV.Object.createWithoutData('Song', id);
            return song.destroy().then(function (success) {
                // 删除成功
                return success
            }, function (error) {
                // 删除失败
            });
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
                        name: '', url: '', id: '', singer: '', cover: '', lyrics: '', order:''
                    };
                }else{
                    Object.assign(this.model.data,data);
                }
                this.view.render(this.model.data)
            })
        },
        create(){
            let  needs = 'name singer url cover lyrics order'.split(' ');
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name = "${string}"]`).val();
            })
            this.model.create(data) //一旦create，model就会拿到最新的数据
                .then(()=>{
                    this.view.reset();
                    window.eventHub.emit('create', JSON.parse(JSON.stringify(this.model.data)));
                })
        },
        update(){
            let  needs = 'name singer url cover lyrics order'.split(' ');
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
                    e.preventDefault()  //阻止页面刷新
                    if(this.model.data.id){
                        this.update();
                    }else{
                        this.create();
                    }
                return;
            })
            this.view.$el.on('click','#delete',()=>{
                console.log(this.model.data.id)
                this.model.delete(this.model.data.id)
                    .then(()=>{
                        alert('删除成功');
                        location.reload()
                    })
            })
        }
    };
    controller.init(view,model);
}
