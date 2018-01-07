    function objectifyForm(formArray,actvalue) {//serialize data function
        var returnArray=[];
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
function getNowTime(){
    var timeDate= new Date();
    var tMonth = (timeDate.getMonth()+1) > 9 ? (timeDate.getMonth()+1) : '0'+(timeDate.getMonth()+1);
    var tDate = timeDate.getDate() > 9 ? timeDate.getDate() : '0'+timeDate.getDate();
    var tHours = timeDate.getHours() > 9 ? timeDate.getHours() : '0'+timeDate.getHours();
    var tMinutes = timeDate.getMinutes() > 9 ? timeDate.getMinutes() : '0'+timeDate.getMinutes();
    var tSeconds = timeDate.getSeconds() > 9 ? timeDate.getSeconds() : '0'+timeDate.getSeconds();
    return timeDate= timeDate.getFullYear()+'/'+ tMonth +'/'+ tDate +' '+ tHours +':'+ tMinutes +':'+ tSeconds;
}
$(document).ready(function(){
	$("#releaseJob").submit(function(event){
		event.preventDefault();
		console.log(this);
		console.log($(this).serializeArray());
        console.log(objectifyForm($(this).serializeArray(),"addCase"));
        var data =  objectifyForm($(this).serializeArray(),"addCase");
        console.error(JSON.stringify(data));
        data.releasetime = getNowTime();
        data.updatetime = getNowTime();
		$.ajax({
            url:'../API/controller/ncnucase.php',
            data:JSON.stringify(data),
            // data:JSON.stringify(postdata),
            type: 'POST',
            // async:false,
            success:function(r){
                    result=JSON.parse(r);
                    console.log(result);
                    alert(result.msg);
                    history.go(0);
                    // alert(result[0].messege);
            },
            error:function(err){
                    console.log(err);
            }
        });
	})
})