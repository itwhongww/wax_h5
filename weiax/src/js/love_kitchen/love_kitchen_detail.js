var detailUrl = "/love_kitchenC/menudetail";
$(document).ready(function(){
	var id = getRequest("id");
	var data={"id":id}
	$.ajax({
        type: "post",
        url:  detailUrl,
        data: JSON.stringify(data).toString(),
        contentType:'application/json',
        success: function (res) {
            if (res.code == 0) {
                var datas = res.data;
                init_love_kitchen_edit(datas);                
            } else if (res.code == -100) {
                alert(res.message);
            } else {
                alert('登录异常，请稍后再试');
            }
        },
        error: function () {
            alert('请求错误')
            
        }
    });
});
function init_love_kitchen_edit(data){
	var id = data.id;
	var menuName = data.menuName;
	var description = data.description;
	var note = data.note;
	var menuOrder = data.menuOrder;
	var status = data.status;
	var createUser = data.createUser;
	var createTime = data.createTime;
	var imgList = data.imgList;
	$("#id").text(id);
	$(".menuName").text(menuName);
	$("#description").html(description);
	document.getElementById("note").innerText=note;
	$.each(imgList,function(index,dataTmp){
		$(".product-images").append('\
			<div>\
                    <img src="'+dataTmp.imgUrl+'">\
            </div>\
			');
    });
    $('.product-images').slick({
        dots: true
    });
    $('.id').hide();
    
}
function getRequest(param) {
    var url = location.search; //获取url中"?"符后的字串   
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest[param] || "";
 }
 $('body').on('click','#logout',function(e){
    $.ajax({
        type: 'post',
        url: '/weiaxC/logout',
        success: function (res) {
            if (res.code == 0) {
                window.location.replace('login.html')
            } else if (res.code == -100) {
                alert(res.message);
            } else {                
                alert('退出异常，请稍后再试');
            }
        },
        error: function () {            
            alert('请求错误')
        }
    });
});