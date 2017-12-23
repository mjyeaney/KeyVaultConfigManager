//
// Main entry point for client-side app. Based on jQuery patterns.
//

$(function(){
    //
    // UI Event handlers
    //
    const routeLocation = function(){
        
        ViewModel.ResetView();
        
        // TODO: state manager should handle this
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
                ViewModel.SetBusyState();
                ViewModel.SetTitle("Vaults");
                ServiceClient.GetVaults(ViewModel.RenderVaults, ViewModel.SetErrorState);
                break;
            case "settings":
                ViewModel.SetBusyState();
                ViewModel.SetTitle("Settings")
                StateManager.CurrentVault = param;
                StateManager.CurrentSetting = "";
                ServiceClient.GetSettings(ViewModel.RenderSettings, ViewModel.SetErrorState);
                break;
            case "setting":
                ViewModel.SetBusyState();
                ViewModel.SetTitle("Edit Setting");
                StateManager.CurrentSetting = param;
                ServiceClient.GetSettingValue(ViewModel.RenderSetting, ViewModel.SetErrorState);
                break;
            case "logStream":
                ViewModel.SetBusyState();
                ViewModel.SetTitle("LogStream");
                ServiceClient.GetLogStream(ViewModel.RenderLogStream, ViewModel.SetErrorState);
                break;
            case "cacheStats":
                ViewModel.SetBusyState();
                ViewModel.SetTitle("Cache Stats");
                ServiceClient.GetCacheStats(ViewModel.RenderCacheStats, ViewModel.SetErrorState);
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