var listUrl = "/love_kitchenC/menulist";
$(document).ready(function() {
	var data = {"username":"hongww"}
    $.ajax({
        type: "post",
        url:  listUrl,
        data: JSON.stringify(data).toString(),
        contentType:'application/json',
        success: function (res) {
            console.info(res);
            if (res.code == 0) {
                var datas = res.data;
                $.each(datas,function(index,dataTmp){
					init_love_kitchen_list_tbody(dataTmp);
                });
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
function init_love_kitchen_list_tbody(data){
	var id = data.id;
	var menuName = data.menuName;
	var description = data.description;
	var note = data.note;
	var menuOrder = data.menuOrder;
	var status = data.status;
	var createUser = data.createUser;
	var createTime = data.createTime;

	$("#love_kitchen_list_tbody").append('\
                                <tr>\
                                    <td class="id">'+id+'</td>\
                                    <td>'+menuName+'</td>\
                                    <td>'+description+'</td>\
                                    <td>'+createUser+'</td>\
                                    <td>'+createTime+'</td>\
                                    <td>\
                                        <span class="label label-primary">'+getStatus(status)+'</span>\
                                    </td>\
                                    <td class="text-right">\
                                        <div class="btn-group">\
                                            <button class="btn-white btn btn-xs ck-bt" >查看</button>\
                                            <button class="btn-white btn btn-xs bj-bt" >编辑</button>\
                                        </div>\
                                    </td>\
                                </tr>\
                                ');
	$('.footable').footable();
	$('.id').hide();
}
function getStatus(ele){
	if(ele=='0'){
		return '关闭';
	}else{
		return '活动';
	}
}
$('body').on('click','.ck-bt,.bj-bt',function(e){
	var id = $(e.target).parent().parent().siblings(".id").text();
	var type ;
	if(e.target.className == "btn-white btn btn-xs ck-bt"){
		type = "0";
	}else{
		type = "1";
	}

	window.location.replace("love_kitchen_edit.html?id="+id+"&type="+type);
});
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