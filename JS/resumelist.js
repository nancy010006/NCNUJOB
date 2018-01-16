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
	var ResumeList = getResume();
    var now = 0;
    var total = ResumeList.length;
    $("#total").html(total);
    // console.log(ResumeList);
    // console.log(ResumeList.length);
    $("input").attr("disabled",true);
    $("textarea").attr("disabled",true);
    $("select").attr("disabled",true);
  //       $("#submit").remove();
	if(ResumeList.length!=0){
        setContent(ResumeList,now);
    }else{
        alert("還沒有人應徵喔");
    }
    $("#next").click(function(){
        if(now<total-1){
            now+=1;
            $("#now").html(now+1);
        }
        else
            alert("這是最後一份了");
        setContent(ResumeList,now);
    })
    $("#prev").click(function(){
        if(now>0){
            $("#now").html(now);
            now-=1;
        }
        else
            alert("這是第一份了");
        setContent(ResumeList,now);
    })
	// $("#resume").submit(function(e){
	// 	e.preventDefault();
	// 	var data = objectifyForm($(this).serializeArray(),"addResume");
	// 	$.ajax({
 //            url:'../API/controller/user.php',
 //            data:JSON.stringify(data),
 //            // data:JSON.stringify(postdata),
 //            type: 'POST',
 //            // async:false,
 //            success:function(r){
 //                    result=JSON.parse(r);
 //                    alert(result.msg);
 //                    // alert(result[0].messege);
 //            },
 //            error:function(err){
 //                    console.log(err);
 //            }
 //        });
	// })
})
function getResume(){
	var returnValue;
	$.ajax({
        url:'../API/controller/ncnucase.php?act=getResumeList&id='+getParameterName("id"),
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
function getParameterName(skey) {
    var s = location.search.replace(/^\?/, '');
    if (s == '' || skey == null || skey == '') return unescape(s);
    var re = new RegExp('(&|^)' + skey + '=([^&]*)(&|$)');
    var a = re.exec(s);
    return unescape(a ? a[2] : '');
}
function setContent(ResumeList,now){
    $("#name").val(ResumeList[now].name);
    $("#birthday").val(ResumeList[now].birthday);
    $("#email").val(ResumeList[now].email);
    $("#phone").val(ResumeList[now].phone);
    $("#autobiography").val(ResumeList[now].autobiography);
    $("#exp").val(ResumeList[now].exp);
    $("#department").val(ResumeList[now].department);
    $("input[name='sex'][value='"+ResumeList[now].sex+"']").attr("checked",true);
}