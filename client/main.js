//
// Main entry point for client-side app. Based on jQuery patterns.
//

$(function(){
    //
    // Remote data access calls
    //
    const getVaultData = function(onComplete, onError){
        $.ajax({
            url: "/vaults",
            success: function(data){
                onComplete(data);
            },
            error: function(e){
                let msg = `${e.status}: ${e.statusText}`;
                onError(msg);
            }
        });
    };

    const getSettingsData = function(onComplete, onError){
        $.ajax({
            url: "/vaultSettings",
            success: function(data){
                onComplete(data);
            },
            error: function(e){
                let msg = `${e.status}: ${e.statusText}`;
                onError(msg);
            }
        });
    };

    const getLogStream = function(onComplete, onError){
        $.ajax({
            url: "/logStream",
            success: function(data){
                onComplete(data);
            },
            error: function(e){
                let msg = `${e.status}: ${e.statusText}`;
                onError(msg);
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
            let id = list[j].id;
            let name = list[j].name;
            let location = list[j].location;
            buffer.push(`<li class="vault" data-id="${id}"><b>${name}</b><span>${location}</span></li>`)
        }

        $("#content ul").append(buffer.join(""));
        $("p.progress").hide();
    };

    const renderSettings = function(list){
        let j = 0;
        let buffer = [];

        for (j = 0; j < list.length; j++){
            let id = list[j].id;
            let name = id.split('/').slice(-1)[0];
            buffer.push(`<li class="setting" data-id="${id}"><b>${name}</b><span></span></li>`)
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
                getVaultData(renderVaults, setupErrorState);
                break;
            case "settings":
                $("p.progress").show();
                getSettingsData(renderSettings, setupErrorState);
                break;
            case "logStream":
                $("p.progress").show();
                getLogStream(renderLogStream, setupErrorState);
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