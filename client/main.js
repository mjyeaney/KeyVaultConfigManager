//
// Main entry point for client-side app. Based on jQuery patterns.
//

$(function(){
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
                ViewModel.SetTitle("Vaults");
                ServiceClient.GetVaults(ViewModel.RenderVaults, ViewModel.SetupErrorState);
                break;
            case "settings":
                $("p.progress").show();
                ViewModel.SetTitle("Settings")
                StateManager.CurrentVault = param;
                StateManager.CurrentSetting = "";
                ServiceClient.GetSettings(ViewModel.RenderSettings, ViewModel.SetupErrorState);
                break;
            case "setting":
                $("p.progress").show();
                ViewModel.SetTitle("Edit Setting")
                StateManager.CurrentSetting = param;
                ServiceClient.GetSettingValue(ViewModel.RenderSetting, ViewModel.SetupErrorState);
                break;
            case "logStream":
                $("p.progress").show();
                ViewModel.SetTitle("LogStream")
                ServiceClient.GetLogStream(ViewModel.RenderLogStream, ViewModel.SetupErrorState);
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