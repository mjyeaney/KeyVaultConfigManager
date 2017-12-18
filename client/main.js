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

    var listSettings = function(){
        $.ajax({
            url: '/vaultSettings',
            success: function(data){
                renderSettings(data);
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

    var renderSettings = function(list){
        let j = 0;
        let buffer = [];

        for (j = 0; j < list.length; j++){
            buffer.push(`<li class="setting" data-id="${list[j].id}"><b>${list[j].name}</b><span>${list[j].vaule}</span></li>`)
        }

        $('#content ul').append(buffer.join(''));
    };

    $(document).on("click", "#content ul li", function(e){
        let resId = e.target.dataset["id"];
        location.hash = "#/settings" + resId;
    });
    
    $(window).bind('hashchange', function(e) { 
        $("p.waterMark").hide();
        $('#content ul li').remove();
        
        let hash = location.hash;
        let cmd = hash.split('/')[1];

        switch (cmd){
            case 'listVaults':
                listVaults();
                break;
            case 'settings':
                listSettings();
                break;
            default:
                $("p.waterMark").show();
                break;
        }
    });
});