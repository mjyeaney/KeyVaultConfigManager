//
// Main entry point for client-side app. Based on jQuery patterns.
//

$(function(){

    $(document).on("click", "#content ul li.vault", function(e){
        let src = e.target;
        if (src.nodeName !== "LI"){
            src = src.parentNode;
        }
        let resId = src.dataset["id"];
        location.hash = "#/settings/" + resId;
    });
    
    $(document).on("click", "#content ul li.setting", function(e){
        let src = e.target;
        if (src.nodeName !== "LI"){
            src = src.parentNode;
        }
        let resId = src.dataset["id"];
        location.hash = "#/setting/" + resId;
    });

    $(document).on("click", "#secretEditor a.close", function(e){
        StateManager.GoPreviousState();
    });

    $(document).on("click", "#secretEditor a.update", function(e){
        StateManager.PersistSettingEdits();
    });
    
    $(window).bind("hashchange", function(e) { 
        StateManager.UpdateCurrentState(location.hash);
    });

    StateManager.UpdateCurrentState(location.hash);
});