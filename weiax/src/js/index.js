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