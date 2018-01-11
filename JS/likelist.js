$(document).ready(function(){
	// console.log();
	var start = 0;
	var len = 10;
	var totalPages = getCase(start,len);
	makePage(totalPages,len);
	$("#len").change(function(){
		var len = $("#len").val();
		var totalPages = getCase(start,len);
		makePage(totalPages,len);
	})
})
function getCase(start,len){
	var act = {"act":"getLikeList","start":start,"len":len};
	var totalPages = 0 ;
	$.ajax({
		url:"../API/controller/ncnucase.php",
		data:JSON.stringify(act),
		type:"POST",
		async:false,
		success:function(r){
			// console.log(r);
			result=JSON.parse(r);
			// console.log(result);
			data=result.data;
			$("#casearea").empty();
			for (var i = 0; i < data.length; i++) {
				$("#casearea").append("<tr ><td class='caseTitle' id='caseID"+data[i].id+"'>"+data[i].title+"</td><td>"+data[i].salary+"</td><td onclick='unlike(this)'><i id='UNLIKE"+data[i].id+"' value='"+data[i].like+"' class='fa fa-heart'></i></td><td><i class='fa fa-envelope-open-o' aria-hidden='true' value='"+data[i].email+"'</i></td><td>"+updatetime+"</td><td>"+data[i].views+"</td></tr>");
				$("#casearea").append("<tr id='caseContent"+data[i].id+"' class='content' style='display:none'><td colspan=5>"+data[i].content+"</td></tr>");
			}
			totalPages = parseInt(result.num/len);
			if((result.num/len)-parseInt(result.num/len)>0)
				totalPages++;
			// console.error(len);
			//秀詳細內容
			$("tr[id^='caseID']").click(function(){
				var id = this.id.replace(/caseID/,"");
				$("#caseContent"+id).fadeToggle();
			})
		}
	})
	return totalPages;
}
function makePage(totalPages,len){
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
		getCase((nowpage-1)*len,len);
		// console.error($(".pagination a[value='"+nowpage+"']").html());
		$(".pagination a[value='"+nowpage+"']").attr("class","active");
	})
	$("#prev").click(function(){
		var prev = $("a[class='active']").html()-1;
		if(prev!=0){
			$(".pagination a").attr("class","");
			getCase((prev-1)*len,len);
			$(".pagination a[value='"+prev+"']").attr("class","active");
		}
	})
	$("#next").click(function(){
		var next = parseInt($("a[class='active']").html())+1;
		if(next!=totalPages+1){
			$(".pagination a").attr("class","");
			getCase((next-1)*len,len);
			$(".pagination a[value='"+next+"']").attr("class","active");
		}
	})
}