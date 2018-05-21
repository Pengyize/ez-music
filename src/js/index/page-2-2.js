{
    let view = {
        el: 'ul.song-list',
        template: `
        <li>
                 <span>{{song.order}}</span>
                 <div class="hotSongWrapper">
                    <h3>{{song.name}}</h3>
                    <p>
                        <svg class="icon icon-sq">
                            <use xlink:href="#icon-sq"></use>
                        </svg>
                        {{song.singer}}
                    </p>
                    <a class="playButton" href="./song.html?id={{song.id}}">
                        <svg class="icon icon-play">
                            <use xlink:href="#icon-play"></use>
                        </svg>
                    </a>
                 </div>
         </li>  
        
        `,

        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {songs} = data;
            songs.map((song)=>{
                let $li = $(this.template
                    .replace('{{song.name}}',song.name)
                    .replace('{{song.singer}}',song.singer)
                    .replace('{{song.id}}',song.id)
                    .replace('{{song.order}}',song.order))
                this.$el.append($li);
            })
            $('#lastestMusicLoading-2').remove()
        }
    }
    let model = {
        data: {
            songs: []
        },
        find(){
            let query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song)=>{
                    return Object.assign({id: song.id}, song.attributes);
                });
                return songs;
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.view.init();
            this.model = model;
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}