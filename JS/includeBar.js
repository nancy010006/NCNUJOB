$(document).ready(function(){
	var act ={"act":"getUser"};
	var user = "";
	$.ajax({
		url:"../API/controller/user.php",
		data:JSON.stringify(act),
		type:"POST",
		async:false,
		success:function(r){
			user = r;
		}
	})
	// alert(user);
	$.get("bar.html",function(data){
		$("#nav").html(data);
		$("#user").append("歡迎，"+user);
		if(user!="訪客")
			$("#user").append("<a href='#' onclick='logout()'>登出</a>");
		else
			$("#user").append("<a href='login.html'>登入</a>");
	});
})
function logout(){
	var check = confirm("確定要登出嗎?");
	if(check){
		$.ajax({
			url:"../API/controller/user.php?act=logout",
			type:"GET",
			async:false,
			success:function(r){
				deleteAllCookies();
				location.href="index.html";
			}
		})
	}
}
function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}