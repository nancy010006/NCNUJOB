$(document).ready(function(){
    var act ={"act":"getUser"};
    user = "";
    $.ajax({
        url:"../API/controller/user.php",
        data:JSON.stringify(act),
        type:"POST",
        async:false,
        success:function(r){
            user = r;
        }
    })
})