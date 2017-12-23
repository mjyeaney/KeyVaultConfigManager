//
// View model + rendering methods
//

(function(scope){
    if (!scope.ViewModel){
        scope.ViewModel = {};
    }

    const setErrorState = function(err){
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

    const renderCacheStats = function(cacheStats){
        $("p.progress").hide();
        $("pre.logViewer").show();
        $("#content ul li").remove();
        $("#content pre").html(cacheStats);
    };

    const setTitle = function(area){
        document.title = `${area} - KeyVault Config Manager`;
    };

    const setBusyState = function(){
        $("p.progress").show();
    };

    const resetView = function(){
        $("p.getStarted").hide();
        $("p.error").hide();
        $("p.unknown").hide();
        $("p.progress").hide();
        $("pre.logViewer").hide();
        $("#secretEditor").hide();
    };

    // export methods
    scope.ViewModel.SetErrorState = setErrorState;
    scope.ViewModel.RenderVaults = renderVaults;
    scope.ViewModel.RenderSettings = renderSettings
    scope.ViewModel.RenderSetting = renderSetting;
    scope.ViewModel.RenderLogStream = renderLogStream;
    scope.ViewModel.RenderCacheStats = renderCacheStats;
    scope.ViewModel.SetTitle = setTitle;
    scope.ViewModel.SetBusyState = setBusyState;
    scope.ViewModel.ResetView = resetView;
})(this);