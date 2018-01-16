$(document).ready(function(){
	var id = getParameterName("id");
	var refresh = preventRefesh(id);
	$.ajax({
		url:"../API/controller/ncnucase.php?act=getCaseDetail&id="+id+"&refresh="+refresh,
		type:"GET",
		async:false,
		success:function(r){
			var result = JSON.parse(r);
			$.each(result, function(i, item) {
				$("#"+i).html(item);
			});
			if(result.uid){
				$("#apply").html("撤除履歷");
				$("#apply").removeClass("btn-success");
				$("#apply").addClass("btn-danger");
				$("#apply").attr("onclick","resumeDeliverCancel()");
			}
		}
	})
})
function getParameterName(skey) {
    var s = location.search.replace(/^\?/, '');
    if (s == '' || skey == null || skey == '') return unescape(s);
    var re = new RegExp('(&|^)' + skey + '=([^&]*)(&|$)');
    var a = re.exec(s);
    return unescape(a ? a[2] : '');
}
function resumeDeliver(t){
	var check = confirm("確認後會將履歷送出 確定要發送履歷嗎?");
	if(check){
		var id = getParameterName("id");
		if(user=="訪客"){
			alert("請登入以使用功能");
		}else{
			var act = {"act":"caseConnect","cid":id};
			console.log(act);
			$.ajax({
				url:"../API/controller/ncnucase.php",
				data:JSON.stringify(act),
				type:"POST",
				async:false,
				success:function(r){
					var result = JSON.parse(r);
					if(result.status==200){
						alert("發送成功 請靜候佳音");
					}
					history.go(0);
				}
			})
		}
	}
}
function resumeDeliverCancel(t){
	var check = confirm("確定要撤除履歷嗎?");
	if(check){
		var id = getParameterName("id");
		if(user=="訪客"){
			alert("請登入以使用功能");
		}else{
			var act = {"act":"caseUnConnect","cid":id};
			console.log(act);
			$.ajax({
				url:"../API/controller/ncnucase.php",
				data:JSON.stringify(act),
				type:"POST",
				async:false,
				success:function(r){
					var result = JSON.parse(r);
						if(result.status==200){
							alert("撤除成功");
						}
						history.go(0);
				}
			})
		}
	}
}
function setCookie(cookieName, cookieValue, exdays) {
  if (document.cookie.indexOf(cookieName) >= 0) {
    var expD = new Date();
    expD.setTime(expD.getTime() + (-1*24*60*60*1000));
    var uexpires = "expires="+expD.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + "; " + uexpires; 
  } 
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + "; " + expires;  
}
function getCookie(cookieName) {
  var name = cookieName + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  }
  return "";
}
function preventRefesh(id){
	// console.log(document.cookie);
	if(!getCookie(id)){
		setCookie(id,new Date(),"1");
		return 1;
	}
	var nowTime = new Date();
	// document.cookie = ;
	var cookieTime = new Date(getCookie(id));
	delta = (nowTime-cookieTime)/1000/60;
	console.log(delta);
	//大於幾分鐘可再刷新
	if(delta>60){
		setCookie(id,new Date(),"1");
		return 1;
	}
	else
		return 0;
	// if(<0)
	// 	console.log(1);
	// else
	// 	console.log(2);
}