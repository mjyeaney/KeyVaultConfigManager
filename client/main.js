//
// Main entry point for client-side app. Based on jQuery patterns.
//

$(function(){
    //
    // Remote data access calls
    //
    const getVaults = function(onComplete, onError){
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

    const getSettings = function(onComplete, onError){
        $.ajax({
            url: `/vaultSettings/${StateManager.CurrentVault}`,
            success: function(data){
                onComplete(data);
            },
            error: function(e){
                let msg = `${e.status}: ${e.statusText}`;
                onError(msg);
            }
        });
    };

    const getSettingValue = function(onComplete, onError){
        $.ajax({
            url: `/vaultSetting/${StateManager.CurrentVault}/${StateManager.CurrentSetting}`,
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
            let id = list[j].id.split('/').slice(-1)[0];
            let name = list[j].name;
            let location = list[j].location;
            buffer.push(`<li class="vault" data-id="${id}"><b>${name}</b><span>Location: ${location}</span></li>`)
        }

        $("#content ul li").remove();
        $("#content ul").append(buffer.join(""));
        $("p.progress").hide();
    };

    const renderSettings = function(list){
        let j = 0;
        let buffer = [];

        for (j = 0; j < list.length; j++){
            let id = list[j].id.split('/').slice(-1)[0];
            let name = id; 
            let details = new Date(list[j].attributes.updated).toDateString();
            buffer.push(`<li class="setting" data-id="${id}"><b>${name}</b><span>Last Updated: ${details}</span></li>`)
        }

        $("#content ul li").remove();
        $("#content ul").append(buffer.join(""));
        $("p.progress").hide();
    };

    const renderSetting = function(data){
        $("#secretEditor #txtSecretName").val(data.id);
        $("#secretEditor #txtSecretValue").val(data.value);
        $("#secretEditor").show();
        $("p.progress").hide();
    };

    const renderLogStream = function(logStream){
        $("p.progress").hide();
        $("pre.logViewer").show();
        $("#content ul li").remove();
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
        $("#secretEditor").hide();
        
        let hash = location.hash;
        let cmd = "";
        let param = "";
        
        if (hash !== ""){
            let parts = hash.split('/');
            cmd = parts[1];
            param = parts[2];
        }

        switch (cmd){
            case "listVaults":
                $("p.progress").show();
                getVaults(renderVaults, setupErrorState);
                break;
            case "settings":
                $("p.progress").show();
                StateManager.CurrentVault = param;
                StateManager.CurrentSetting = "";
                getSettings(renderSettings, setupErrorState);
                break;
            case "setting":
                $("p.progress").show();
                StateManager.CurrentSetting = param;
                getSettingValue(renderSetting, setupErrorState);
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
    };

    $(document).on("click", "#content ul li.vault", function(e){
        let resId = e.target.dataset["id"];
        location.hash = "#/settings/" + resId;
    });
    
    $(document).on("click", "#content ul li.setting", function(e){
        let resId = e.target.dataset["id"];
        location.hash = "#/setting/" + resId;
    });

    $(document).on("click", "#secretEditor a.close", function(e){
        history.go(-1);
    });
    
    $(window).bind("hashchange", function(e) { 
        routeLocation();
    });

    //
    // Initial UI state/setup
    //
    routeLocation();
});