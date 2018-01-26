var menudetail = "/love_kitchenC/menudetail";
$(document).ready(function(){
	var id = getRequest("id");
    if(id==null||id==""){//新增
        $("#description").html("");
        $('.summernote').summernote();

        $('.input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true
        });
        $('.id').hide();
    }else{//修改
        var data = {"username":"hongww","id":id}
        $.ajax({
            type: "post",
            url:  menudetail,
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
    }
	
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
	$("#id").val(id);
	$("#menuName").val(menuName);
	$("#description").html(description);
	$("#note").val(note);
	$("#menuOrder").val(menuOrder);
	$("#status").val(status);
	$.each(imgList,function(index,dataTmp){
		$("#love_kitchen_edit_tbody").append('\
			<tr>\
				<td class="id">'+dataTmp.id+'</td>\
                <td>\
                    <img src="'+dataTmp.imgUrl+'" class="imgUrl">\
                </td>\
                <td>\
                    <input type="text" class="form-control imgOrder" value="'+dataTmp.imgOrder+'">\
                </td>\
                <td>\
                    <button class="btn btn-white del-bt"><i class="fa fa-trash"></i> </button>\
                </td>\
            </tr>\
			');
    });
    $('.summernote').summernote();

    $('.input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true
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