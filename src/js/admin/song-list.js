{
    let view = {
        el: `#songList-container`,
        template:`
        <ul class="songList">
                
        </ul>
        `,
        render(data){
            let $el = $(this.el);
            $el.html(this.template);
            let {songs, selectedSongId} = data;
            let liList = songs.map((song) => {
                let $li = $('<li></li>').text(song.name).attr('data-song-id',song.id)
                if(song.id === selectedSongId){
                    $li.addClass('active');
                }
                return $li;
            });
            $el.find('ul').empty();  //把ul清空
            liList.map((domLi)=>{
                $el.find('ul').append(domLi);
            });
            },
        clearActive(){
            $(this.el).find('.active').removeClass('active');
        }

    };
    let model = {
        data:{
            songs:[],
            selectedSongId: undefined
        },
        find(){
            let query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song)=>{
                    return {id: song.id, ...song.attributes};
                });
                return songs;
            })
        }
    };
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.bindEvents();
            this.bindEventHub();
            this.getAllSongs();
        },
        getAllSongs(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data);
            })
        },
        bindEvents(){   //绑定事件
            $(this.view.el).on('click','li',(e)=>{  //事件委托，el是'li'的父元素'ol'，委托'ol'监听他的所有儿子'li'
                let songId = e.currentTarget.getAttribute('data-song-id');

                this.model.data.selectedSongId = songId;    //记录激活的Item是哪个
                this.view.render(this.model.data)   //每次更新的时候激活它

                let data;
                let songs = this.model.data.songs;
                for(let i=0; i < songs.length; i++){
                    if(songs[i].id === songId){
                        data = songs[i];
                        break;
                    }
                }
                window.eventHub.emit('select',JSON.parse(JSON.stringify(data)));
            })
        },
        bindEventHub(){
            window.eventHub.on('create',(songData)=>{
                this.model.data.songs.push(songData);
                this.view.render(this.model.data);
            })
            window.eventHub.on('new',()=>{
                this.view.clearActive();
            });
            window.eventHub.on('update',(song)=>{
                let songs = this.model.data.songs;
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id === song.id){
                        Object.assign(songs[i],song)
                    }
                }
                this.view.render(this.model.data);
                alert('保存成功')
            })
        }
    }
    controller.init(view,model);

}