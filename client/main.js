//
// Main entry point for client-side app. Based on jQuery patterns.
//

$(function(){
    var listVaults = function(){
        $("p.watermark").hide();

        $.ajax({
            url: '/vaults',
            success: function(data){
                renderVaults(data);
            }
        });
    };

    var renderVaults = function(list){
        let j = 0;

        for (j = 0; j < list.length; j++){

        }
    };
    
    $(window).bind( 'hashchange', function(e) { 
        var hash = location.hash;

        switch (hash){
            case '#/listVaults':
                listVaults();
                break;
        }
    });
});