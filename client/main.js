//
// Main entry point for client-side app. Based on jQuery patterns.
//

$(function(){
    //
    // Remote data access calls
    //
    const listVaults = function(){
        $.ajax({
            url: "/vaults",
            success: function(data){
                renderVaults(data);
            },
            error: function(e){
                let msg = `${e.status} - ${e.statusText}`;
                setupErrorState(msg);
            }
        });
    };

    const listSettings = function(){
        $.ajax({
            url: "/vaultSettings",
            success: function(data){
                renderSettings(data);
            },
            error: function(e){
                let msg = `${e.status} - ${e.statusText}`;
                setupErrorState(msg);
            }
        });
    };

    const getLogStream = function(){
        $.ajax({
            url: "/logStream",
            success: function(data){
                renderLogStream(data);
            },
            error: function(e){
                let msg = `${e.status} - ${e.statusText}`;
                setupErrorState(msg);
            }
        });
    };

    //
    // Render functions 
    //
    const setupErrorState = function(err){
        $("p.getStarted").hide();
        $("p.error").show().find('span').text(err);
        $("p.unknown").hide();
        $("p.progress").hide();
        $("#content ul li").remove();
    };

    const renderVaults = function(list){
        let j = 0;
        let buffer = [];

        for (j = 0; j < list.length; j++){
            buffer.push(`<li class="vault" data-id="${list[j].id}"><b>${list[j].name}</b><span>${list[j].location}</span></li>`)
        }

        $("#content ul").append(buffer.join(""));
        $("p.progress").hide();
    };

    const renderSettings = function(list){
        let j = 0;
        let buffer = [];

        for (j = 0; j < list.length; j++){
            buffer.push(`<li class="setting" data-id="${list[j].id}"><b>${list[j].name}</b><span>${list[j].vaule}</span></li>`)
        }

        $("#content ul").append(buffer.join(""));
        $("p.progress").hide();
    };

    const renderLogStream = function(logStream){
        $("p.progress").hide();
        $("pre.logViewer").show();
        $("#content pre").html(logStream);
    };

    //
    // UI Event handlers
    //
    const routeLocation = function(){
        $("p.getStarted").hide();
        $("p.error").hide();
        $("p.unknown").hide();
        $("p.progress").hide();
        $("pre.logViewer").hide();
        $("#content ul li").remove();
        
        let hash = location.hash;
        let cmd = "";
        
        if (hash !== ""){
            cmd = hash.split('/')[1];
        }

        switch (cmd){
            case "listVaults":
                $("p.progress").show();
                listVaults();
                break;
            case "settings":
                $("p.progress").show();
                listSettings();
                break;
            case "logStream":
                $("p.progress").show();
                getLogStream();
                break;
            case "":
                $("p.getStarted").show();
                break;            
            default:
                $("p.unknown").show();
                break;
        }
    }

    $(document).on("click", "#content ul li.vault", function(e){
        let resId = e.target.dataset["id"];
        location.hash = "#/settings" + resId;
    });
    
    $(window).bind("hashchange", function(e) { 
        routeLocation();
    });

    //
    // Initial UI state/setup
    //
    routeLocation();
});