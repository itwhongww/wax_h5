var clientUrl = "/love_kitchenC/menuclient";
$(document).ready(function(){
        var data = {"username":"hongww"}
        $.ajax({
            type: "post",
            url:  clientUrl,
            data: JSON.stringify(data).toString(),
            contentType:'application/json',
            success: function (res) {
                if (res.code == 0) {
                    var datas = res.data;
                    $.each(datas,function(index,dataTmp){
                        init_love_kitchen_client(index,dataTmp);
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
function init_love_kitchen_client(index,data){
    var id = data.id;
    var menuName = data.menuName;
    var description = data.description;
    var note = data.note;
    var menuOrder = data.menuOrder;
    var status = data.status;
    var createUser = data.createUser;
    var createTime = data.createTime;
    var imgUrl = data.imgUrl;

    var rowDivBegin;
    var rowDivEnd;
    if(index%4==0){
        rowDivBegin = '<div class="row">';
        rowDivEnd = '</div>';
    }else{
        rowDivBegin = '';
        rowDivEnd ='';
    }

    $("#love_kitchen_client_box").append( rowDivBegin+'\
                                    <div class="col-md-3">\
                                        <div class="ibox">\
                                            <div class="ibox-content product-box">\
                                                <div class="id">'+id+'</div>\
                                                <div class="love_kitchen_client_img">\
                                                    <img src="'+imgUrl+'" class="imgUrl">\
                                                </div>\
                                                <div class="product-desc">\
                                                    <small class="text-muted">'+createUser+'</small>\
                                                    <a href="#" class="product-name intoDetail"> '+menuName+'</a>\
                                                    <div class="small m-t-xs">\
                                                        '+note+'\
                                                    </div>\
                                                    <div class="m-t text-righ">\
                                                        <a href="#" class="btn btn-xs btn-outline btn-primary intoDetail">Info <i class="fa fa-long-arrow-right"></i> </a>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>  \
                                '+rowDivEnd);
    $('.id').hide();
}
$('body').on('click','.intoDetail',function(e){
    var id = $(e.target).parent().siblings(".id").text();
    if(id==""||id==null){
        var id = $(e.target).parent().parent().siblings(".id").text();
    }
    e.target.href="love_kitchen_detail.html?id="+id;
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