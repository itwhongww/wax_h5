var initChaterUrl = "/wechat/initChater"
var uploadUrl = "/wax_measure/upload"
var downloadUrl = "/wax_file/"
var flag_canceluser = "FLAG_CANCELUSER";
var flag_content = "FLAG_CONTENT";
var flag_freshuser = "FLAG_FRESHUSER";
var flag_upload = "FLAG_UPLOAD";
var connectflag = 0;
var uploadName = 0;
$(document).ready(function(){
    // $('.i-checks').iCheck({
    //     checkboxClass: 'icheckbox_square-green',
    //     radioClass: 'iradio_square-green',
    // });


    $('#summernote').summernote({
		height: 120,
		minHeight: null, 
		maxHeight: null, 
		focus: true,
		onImageUpload: function(files, editor, $editable) {
			sendFile(files);
		}
    });
    $("#wax_wechat_body").hide();
});
//ajax上传图片
function sendFile(files) {
    var formData = new FormData();
    formData.append("file", files[0]);
    $.ajax({
        url: uploadUrl,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (data) {
        	data = data.replace(/\\\\u/g,"\\u").replace(/\'/g,"\"");
        	data = decodeUnicode(data);
        	var returnJson = JSON.parse(data);
        	var code = returnJson.code
        	if(code == 0){
        		var fileName = returnJson.fileName;
        		uploadName = fileName;
        		sendName(flag_upload);
        	}else{
        		alert("error file")
        	}
        }
    });
}
function decodeUnicode(str) {  
    str = str.replace(/\\/g, "%");  
    return unescape(str);  
}  
// var edit = function() {
//     $('.click2edit').summernote({focus: true});
// };
// var save = function() {
//     var aHTML = $('.click2edit').code(); //save HTML If you need(aHTML: array).
//     $('.click2edit').destroy();
// };
var stompClient = null;
function setConnected(tag,connected) {
    if(connected){
    	$(tag).text("断开连接");
    	$("#wax_wechat_body").show();
    }else{
		$(tag).text("点击连接");
		$("#wax_wechat_body").hide();
    }
}
//开始连接
function connect(tag) {
	connectflag = 1;
	var tag_text = $(tag).text();
	if(tag_text == '点击连接'){
		
		var socket = new SockJS('/endpointSang');
	    stompClient = Stomp.over(socket);
	    stompClient.connect({}, function (frame) {
        	
        	stompClient.subscribe('/topic/getResponse', function (response) {
            	showResponse(JSON.parse(response.body));
	        });
            initUser();
            setConnected(tag,true);
	        sendName(flag_freshuser);
	    });
	}else{
		disconnect(tag);
	}
    
}
//断开连接
function disconnect(tag) {
	connectflag = 0
	sendName(flag_canceluser);
    if (stompClient != null) {
        stompClient.disconnect();
    }  
    clearName();
    clearShow();
    setConnected(tag,false);
    $("#wax_wechat_online").empty();
}
//发送信息
function sendName(flag) {	
	var sndData = new Object();
	var name = "";
	var summernote = $('#summernote').code();
	if(flag == flag_content){
		name = $('#myself').val()+"："+$('#summernote').code();
	    if(summernote=="<div><br></div><div><br></div>"){
	    	alert("请输入...");
	    	return;
	    }else if(summernote ==""){
			alert("请输入...");
	    	return;
	    }
	}else if(flag == flag_canceluser){
		name = $('#myself').val();
	}else if(flag == flag_freshuser){
		name = "tmp";
	}else if(flag == flag_upload){
		name = $('#myself').val()+"："+"<a href='"+downloadUrl+uploadName+"' download='"+uploadName+"' class='wax_wechat_upload_text' ><i class='fa fa-file'>"+uploadName+"</i></a>";
	}
	
    sndData.flag=flag;
    sndData.name=name;
    stompClient.send("/welcome", {}, JSON.stringify(sndData));
	$('#summernote').code('');
}
//显示回复信息
function showResponse(msg) {	
	if (msg.code == 0) {
		var data = msg.data;
        var flag = data.flag;
		var message = data.name;
		if(flag == flag_content){
			var myself = $('#myself').val();
			var splits = message.split("：");
			var className = "alert-success";
			if(splits[0]==myself){
				className = "alert-info";
			}
		    $("#wax_wechat_show").append("<div class='alert "+className+"'>"+message+"</div>");
		    add();
            var name = message.substring(1,message.indexOf("："))
            var childs = $("#wax_wechat_online").children();
            var exists = 0;
            $.each(childs,function(index,dataTmp){
                if(dataTmp.innerText.indexOf(name)>0){
                    exists = 1;
                    return;
                }
            }); 
            if(exists==0){
                $("#wax_wechat_online").append("<li><a href='#'> <i class='fa fa-tag text-danger'></i> "+name+" </a></li>");
            }
		}else if(flag == flag_freshuser){
			freshUser(data);
		}else if(flag == flag_canceluser){
			delUser(message);
		}else if(flag == flag_upload){
			var myself = $('#myself').val();
			var splits = message.split("：");
			var className = "alert-success";
			if(splits[0]==myself){
				className = "alert-info";
			}
		    $("#wax_wechat_show").append("<div class='alert "+className+"'>"+message+"</div>");
		    add();
		} 
    } else if (res.code == -100) {
        alert(res.message);
    } else {
        alert('请求错误');
    }
	
	
}
function clearName(){
	$('#summernote').code('');
	//$("#wax_wechat_send").attr('disabled',"true");
}
function clearShow(){
	$('#wax_wechat_show').empty();
	//$("#wax_wechat_send").attr('disabled',"true");
}
window.onbeforeunload = function(){
 	if($('#myself').val()==''){
 		return true;
 	}
	sendName(flag_canceluser);
    return true;
}
function initUser(){
	$.ajax({
        type: "get",
        url:  initChaterUrl,
        data: null,
        contentType:'application/json',
        success: function (res) {
            if (res.code == 0) {
                var myself = res.data.myself;
                $("#myself").val(myself);                       
            } else if (res.code == -100) {
                alert(res.message);
            } else {
                alert('请求错误');
            }
        },
        error: function () {
            alert('请求错误')
            
        }
    });
}
function delUser(name){
	var childs = $("#wax_wechat_online").children();
	var count = '';
	$.each(childs,function(index,dataTmp){
    	if(dataTmp.innerText.indexOf(name)>0){
    		$(dataTmp).remove();
    		return;
    	}
    }); 
}
function freshUser(res){
	$("#wax_wechat_online").empty();
    var onlineList = res.onlineList;
    var myself = $("#myself").val();
    var existsMyself = 0;
    $.each(onlineList,function(index,dataTmp){
    	if(myself==dataTmp){
        	$("#wax_wechat_online").append("<li><a href='#'> <i class='fa fa-tag text-danger'></i> "+dataTmp+" </a></li>");
            existsMyself = 1;
        }else{
          	$("#wax_wechat_online").append("<li><a href='#'> <i class='fa fa-circle text-navy'></i> "+dataTmp+" </a></li>");
        }        
    });
    if(existsMyself == 0){
        $("#wax_wechat_online").append("<li><a href='#'> <i class='fa fa-tag text-danger'></i> "+myself+" </a></li>");
    }
}
function add(){
	var scrollTop = $("#wax_wechat_show")[0].scrollHeight;  
    $("#wax_wechat_show").scrollTop(scrollTop);  
}
$(".wax_wechat_sendBt").bind("click", function () {
    sendName('FLAG_CONTENT');
})

