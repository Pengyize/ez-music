{
    let view = {
        el: '.page-3',
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        },
        template:`
        <li>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-sousou"></use>
            </svg>
            <a id="search-a" href="/ez-music/src/song.html?id={{id}}">{{name}}</a>
        </li>
        
        `,
        render(inputVal){
            $('#search-h2').html(`搜索"${inputVal}"`);
        },
        searchResult(name,id){
            let $li = $(this.template
                .replace('{{id}}',id)
                .replace('{{name}}',name))
            $('#search-list').prepend($li)
        }
    }
    let model = {
        data: {
            name: '',
            id: ''
        },
        search(name){
            let query = new AV.SearchQuery('Song');
            query.queryString(name);
            return query.find().then(function(results) {
                return results;
            }).catch(function(err){
                //处理 err
            });
        },
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.init();
            this.bindEventHub();
            this.bindEvents();
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName === 'page-3'){
                    this.view.show();
                }else{
                    this.view.hide()
                }
            })
        },
        bindEvents(){
            this.onInput();
            this.clear();
        },
        onInput(){
            this.view.$el.on('input','#search',()=>{
                if($('#search').val() === ''){
                    $('#top-search-result').addClass('hide')
                    $('.top-search').removeClass('hide')
                    $('.clear-button').addClass('hide')
                }else{
                    $('.top-search').addClass('hide')
                    $('#top-search-result').removeClass('hide')
                    $('.clear-button').removeClass('hide')

                    this.view.render($('#search').val());

                    this.model.search($('#search').val())
                        .then((results)=>{
                            this.model.data.name = results[0].attributes.name
                            this.view.searchResult(this.model.data.name,results[0].id);
                        });
                }
            })
        },
        clear(){
            this.view.$el.on('click','.clear-button',()=>{
                $('#search').val('');
                $('#top-search-result').addClass('hide')
                $('.top-search').removeClass('hide')
                $('.clear-button').addClass('hide')
            })
            this.view.$el.on('click','#search-list',()=>{
                $('#search').val('');
            })
        }

    }
    controller.init(view,model)
}