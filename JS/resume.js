function objectifyForm(formArray,actvalue) {//serialize data function
        var formObject = {};
        for (var i = 0; i < formArray.length; i++){
        		if(formArray[i]['name']!=tmp)
                	formObject[formArray[i]['name']] = formArray[i]['value'];
                else
                	formObject[formArray[i]['name']] += "，"+formArray[i]['value'];
            	var tmp =formArray[i]['name'];
        }
        formObject.act = actvalue;
        return formObject;
}
$(document).ready(function(){
	var myResume = getResume();
	if(myResume.length!=0){
		$("input").attr("disabled",true);
		$("textarea").attr("disabled",true);
		$("select").attr("disabled",true);
		console.log(myResume);
		$("#name").val(myResume[0].name);
		$("#birthday").val(myResume[0].birthday);
		$("#email").val(myResume[0].email);
		$("#phone").val(myResume[0].phone);
		$("#autobiography").val(myResume[0].autobiography);
		$("#exp").val(myResume[0].exp);
		$("#department").val(myResume[0].department);
		$("input[name='sex'][value='"+myResume[0].sex+"']").attr("checked",true);
        $("#submit").remove();
	}else{
		console.log(2);
	}
	$("#resume").submit(function(e){
		e.preventDefault();
		var data = objectifyForm($(this).serializeArray(),"addResume");
		$.ajax({
            url:'../API/controller/user.php',
            data:JSON.stringify(data),
            // data:JSON.stringify(postdata),
            type: 'POST',
            // async:false,
            success:function(r){
                    result=JSON.parse(r);
                    alert(result.msg);
                    // alert(result[0].messege);
            },
            error:function(err){
                    console.log(err);
            }
        });
	})
})
function getResume(){
	var returnValue;
	$.ajax({
        url:'../API/controller/user.php?act=getOneResume',
        // data:JSON.stringify(postdata),
        type: 'GET',
        async:false,
        success:function(r){
                result=JSON.parse(r);
                returnValue = result;
                // console.log(result);
                // alert(result[0].messege);
        },
        error:function(err){
                console.log(err);
        }
    });
    return returnValue;
}