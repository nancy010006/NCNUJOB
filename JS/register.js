function objectifyForm(formArray,actvalue) {//serialize data function
        var returnArray=[];
        var actObject = {};
        var formObject = {};
        formObject.act=actvalue;
        for (var i = 0; i < formArray.length; i++){
        		if(formArray[i]['name']!=tmp)
                	formObject[formArray[i]['name']] = formArray[i]['value'];
                else
                	formObject[formArray[i]['name']] += "，"+formArray[i]['value'];
            	var tmp =formArray[i]['name'];
        }
        return formObject;
}
$(document).ready(function(){
    if(user&&user!="訪客"){
        alert("你已經是會員囉！")
        history.go(-1);
    }
	$("#registerForm").submit(function(event){
		event.preventDefault();
		console.log(this);
		console.log($(this).serializeArray());
		var data = objectifyForm($(this).serializeArray(),"adduser");
        if(data.pwdconfirm==data.pwd){
            data.permission=1;
            delete data.pwdconfirm;
            console.log(JSON.stringify(data));
            $.ajax({
                url:'../API/controller/user.php',
                data:JSON.stringify(data),
                // data:JSON.stringify(postdata),
                type: 'POST',
                // async:false,
                success:function(r){
                        result=JSON.parse(r);
                        console.log(result);
                        console.log(result.msg);
                        if(result.status==200){
                            alert(result.msg);
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
        }else{
            alert("兩次密碼輸入不一致 請重新輸入");
        }
		
	})
})