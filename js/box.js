function TheBox(container) {
    this.container = container;
    this.boxName = 'TheBox' + new Date().getTime()
    this.container.append('<div class="'+this.boxName+'"></div>');
    this.intervalo;
    this.scrollPos = 0;
    this.fps = 300;
    this.maxScroll = 0;
}

TheBox.prototype.open = function(url) {
    var s = this;
    $.get(url,function(r){
        var box = s.container.find('.' + s.boxName).empty().html(r);
        s.run(box);
    },'html');
};

TheBox.prototype.run = function(box) {
    var s = this;
    var scrollController = box.find('.scroller:eq(0)').hide();
    var conteudoWrap = box.find('.box-conteudo-wrap:eq(0)');
    var conteudoScroll;
    if(conteudoWrap.length > 0)
    {
        conteudoScroll = conteudoWrap.find('> .box-conteudo-scroll:eq(0)');
        if(conteudoScroll.length > 0)
        {
            if(conteudoScroll.height() > conteudoWrap.height())
            {
                s.maxScroll = conteudoWrap.get(0).scrollHeight - conteudoWrap.get(0).clientHeight;
                scrollController.show();
                var navs = scrollController.find('.navs');
                navs.off('click.navs').on('click.navs', function(ev){
                    ev.preventDefault();
                });
                navs.off('mousedown.navs').on('mousedown.navs', function(ev){
                    var dir = this.getAttribute('data-dir');
                    s.intervalo = setInterval(function() { s.scrolla(dir,conteudoWrap); }, 1000 / s.fps);
                });
                navs.off('mouseup.navs').on('mouseup.navs', function(ev){
                    clearInterval(s.intervalo);
                });
            }
        }
    }
    box.find('.box-close:eq(0)').off('click').on('click', function(ev){
        ev.preventDefault();
        s.container.find('.' + s.boxName).remove();
    });
};

TheBox.prototype.scrolla = function(dir,conteudoWrap) {
    this.scrollPos = (dir == 'up') ? this.scrollPos - 1 : this.scrollPos + 1;
    this.scrollPos = (this.scrollPos < 0) ? 0 : this.scrollPos;
    this.scrollPos = (this.scrollPos >= this.maxScroll) ? this.maxScroll : this.scrollPos;
    conteudoWrap.scrollTop(this.scrollPos);
};

