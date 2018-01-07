function objectifyForm(formArray,actvalue) {//serialize data function
        var returnArray=[];
        var actObject = {};
        actObject.act=actvalue;
        var formObject = {};
        for (var i = 0; i < formArray.length; i++){
        		if(formArray[i]['name']!=tmp)
                	formObject[formArray[i]['name']] = formArray[i]['value'];
                else
                	formObject[formArray[i]['name']] += "，"+formArray[i]['value'];
            	var tmp =formArray[i]['name'];
        }
        actObject.data = formObject;
        return actObject;
}
$(document).ready(function(){
	$("#loginform").submit(function(event){
		event.preventDefault();
		console.log(this);
		console.log($(this).serializeArray());
		console.log(objectifyForm($(this).serializeArray(),"test"));
		$.ajax({
            url:'../API/controller/user.php',
            data:objectifyForm($(this).serializeArray(),"login"),
            // data:JSON.stringify(postdata),
            type: 'POST',
            // async:false,
            success:function(r){
                    result=JSON.parse(r);
                    console.log(result);
                    if(result.status==200){
                        location.href = "all_job.html";
                    }else{
                        alert(result.msg);
                    }
                    // alert(result[0].messege);
            },
            error:function(err){
                    console.log(err);
            }
        });
	})
})
function start(){
  location.href='all_job.html';
}