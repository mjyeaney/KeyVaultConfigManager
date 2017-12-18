//
// Main entry point for client-side app. Based on jQuery patterns.
//

$(function(){
    var listVaults = function(){
        $.ajax({
            url: '/vaults',
            success: function(data){
                renderVaults(data);
            }
        });
    };

    var renderVaults = function(list){
        let j = 0;
        let buffer = [];

        for (j = 0; j < list.length; j++){
            buffer.push(`<li class="vault" data-id="${list[j].id}"><b>${list[j].name}</b><span>${list[j].location}</span></li>`)
        }

        $('#content ul').append(buffer.join(''));
    };
    
    $(window).bind( 'hashchange', function(e) { 
        var hash = location.hash;
        $("p.waterMark").hide();
        $('#content ul li').remove();

        switch (hash){
            case '#/listVaults':
                listVaults();
                break;
            default:
                $("p.waterMark").show();
                break;
        }
    });
});