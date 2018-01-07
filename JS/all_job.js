function objectifyForm(formArray) {//serialize data function
        var returnArray=[];
        var formObject = {};
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
	setTag();
	var start = 0;
	var len = 10;
	var totalPages = getCase(start,len);
	makePage(totalPages,len);
	$("#len").change(function(){
		var tag = objectifyForm($("#tags").serializeArray());
		var len = $("#len").val();
		var totalPages = getCase(start,len,tag);
		makePage(totalPages,len);
	})
})
function like(t){
	if(user=="訪客"){
		alert("請登入以使用收藏功能");
	}else{
		var id=t.id.replace(/UNLIKE/,"LIKE");
		var cid = t.id.replace(/UNLIKE/,"");
		$(t).attr("src","../img/like.png");
		$(t).attr("id",id);
		$(t).attr("onclick","unlike(this)");
		var act = {"act":"likeCase","cid":cid};
		console.log(act);
		$.ajax({
			url:"../API/controller/ncnucase.php",
			data:JSON.stringify(act),
			type:"POST",
			async:false,
			success:function(r){
			}
		})
	}
	
}
function unlike(t){
	var id=t.id.replace(/LIKE/,"UNLIKE");
	var cid = t.id.replace(/LIKE/,"");
	$(t).attr("src","../img/unlike.png");
	$(t).attr("id",id);
	$(t).attr("onclick","like(this)");
	var act = {"act":"unLikeCase","cid":cid};
	console.log(act);
	$.ajax({
		url:"../API/controller/ncnucase.php",
		data:JSON.stringify(act),
		type:"POST",
		async:false,
		success:function(r){
		}
	})
}
function getCase(start,len,tag){
	var act = {"act":"getSomeCase","start":start,"len":len};
	if(tag){
		var keys = Object.keys(tag);
		for (var i = 0; i < keys.length; i++) {
			// console.log(tag[keys[i]]);
			// console.log(tag.keys[i]);
			act[keys[i]]=tag[keys[i]];
		}
		console.log(act);
	}
	var totalPages = 0 ;
	$.ajax({
		url:"../API/controller/ncnucase.php",
		data:JSON.stringify(act),
		type:"POST",
		async:false,
		success:function(r){
			// console.log(r);
			result=JSON.parse(r);
			console.log(result);
			data=result.data;
			$("#casearea").empty();
			//所有職缺文章讀入
			for (var i = 0; i < data.length; i++) {
				var updatetime = data[i].updatetime.substr(0,10);
				if(data[i].like==-1)
					$("#casearea").append("<tr ><td class='caseTitle' id='caseID"+data[i].id+"'>"+data[i].title+"</td><td>"+data[i].salary+"</td><td><img onclick='like(this)' src='../img/unlike.png' id='UNLIKE"+data[i].id+"' value='"+data[i].like+"'/></td><td><img src='../img/email.png' value='"+data[i].email+"' value='"+data[i].email+"'</td><td>"+updatetime+"</td><td>"+data[i].views+"</td>");
				else if(data[i].like==0)
					$("#casearea").append("<tr ><td class='caseTitle' id='caseID"+data[i].id+"'>"+data[i].title+"</td><td>"+data[i].salary+"</td><td><img onclick='like(this)' src='../img/unlike.png' id='UNLIKE"+data[i].id+"' value='"+data[i].like+"'/></td><td><img src='../img/email.png' value='"+data[i].email+"' value='"+data[i].email+"'</td><td>"+updatetime+"</td><td>"+data[i].views+"</td>");
				else
					$("#casearea").append("<tr ><td class='caseTitle' id='caseID"+data[i].id+"'>"+data[i].title+"</td><td>"+data[i].salary+"</td><td><img onclick='unlike(this)' src='../img/like.png' id='LIKE"+data[i].id+"' value='"+data[i].like+"'/></td><td><img src='../img/email.png' value='"+data[i].email+"' value='"+data[i].email+"'</td><td>"+updatetime+"</td><td>"+data[i].views+"</td>");
				$("#casearea").append("<tr><td colspan='6' id='caseContent"+data[i].id+"' class='content' style='display:none'><table class='job_detail'><tr><td>工作內容</td><td><pre>"+data[i].content+"</pre></td></tr><tr><td>分類</td><td>"+data[i].type+"</td></tr><tr><td>屬性</td><td>"+data[i].property+"</td></tr><tr><td>時段</td><td>"+data[i].time+"</td></tr><tr><td>條件</td><td>"+data[i].level+"</td></tr><tr><td>聯絡方式</td><td><p>電話："+data[i].phone+"</p><p>電子信箱："+data[i].email+"</p></td></tr><tr><td>工作地點</td><td>"+data[i].position+"</td></tr></table></tr>");
			}
			//工作詳細內容
			$("td[id^='caseID']").click(function(){
				var id = this.id.replace(/caseID/,"");
				$("#caseContent"+id).fadeToggle();
			})
			totalPages = parseInt(result.num/len);
			if((result.num/len)-parseInt(result.num/len)>0)
				totalPages++;
		}
	})
	return totalPages;
}
function makePage(totalPages,len){
	var tag = objectifyForm($("#tags").serializeArray());
	//做分頁頁數鈕
	$(".pagination").empty();
	$(".pagination").append('<li><a href="#" id="prev">«</a></li>');
		$(".pagination").append('<li><a class="active" href="#" name="page" value="1">1</a></li>');
	for (var i = 1; i < totalPages; i++) {
		$(".pagination").append('<li><a href="#" name="page" value="'+(1+i)+'">'+(1+i)+'</a></li>');
	}
	$(".pagination").append('<li><a href="#" id="next">»</a></li>');
	$(".pagination a[name='page']").click(function(){
		$(".pagination a").attr("class","");
		$(this).toggleClass("active");
		var nowpage = $(this).html();
		// console.log(len);
		// var len = $("#len").val();
		// console.error((nowpage-1)*len);
		getCase((nowpage-1)*len,len,tag);
		// console.error($(".pagination a[value='"+nowpage+"']").html());
		$(".pagination a[value='"+nowpage+"']").attr("class","active");
	})
	$("#prev").click(function(){
		var prev = $("a[class='active']").html()-1;
		if(prev!=0){
			$(".pagination a").attr("class","");
			getCase((prev-1)*len,len,tag);
			$(".pagination a[value='"+prev+"']").attr("class","active");
		}
	})
	$("#next").click(function(){
		var next = parseInt($("a[class='active']").html())+1;
		if(next!=totalPages+1){
			$(".pagination a").attr("class","");
			getCase((next-1)*len,len,tag);
			$(".pagination a[value='"+next+"']").attr("class","active");
		}
	})
}
function setTag(){
	$(".tagsbutton").click(function(){
		var tag = objectifyForm($("#tags").serializeArray());
		var len = $("#len").val();
		var totalPages = getCase(0,len,tag);
		makePage(totalPages,len);
	})
}