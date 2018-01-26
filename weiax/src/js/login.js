var loginUrl = "/weiaxC/login";
/*点击登录按钮*/
$('.loginbtnCase').click(function(){
    var loginDatas = "username="+$("#username").val()+"&password="+$("#password").val();
	sendDataAjax(loginUrl,'post',loginDatas);
})

function sendDataAjax(url,type,data){
	$.ajax({
        type: type,
        url: url,
        //contentType: "application/json",
        data: data,
        success: function (res) {
            if (res.code == 0) {
                window.location.replace('index.html')
            } else if (res.code == -100) {
                alert(res.message);
            } else {                
                alert('登录异常，请稍后再试');
            }
        },
        error: function () {            
            alert('请求错误')
            //return
        }
    });
}