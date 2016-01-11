/**
 * Created by Administrator on 2015/11/30.
 */
$(function () {
    function setCookie(cname, cvalue, exdays, path) {
        var expires = '';
        if(exdays){
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            expires = "expires=" + d.toUTCString();
        }
        var p = "path=" + (path || '/');
        document.cookie = cname.trim() + "=" + cvalue + "; " + expires + ";" + p;
    }
    $('#js_login_btn').click(function () {
        var $user = $('#js_user_name'),
            $pwd = $('#js_pwd'),
            $code = $('#js_code'),
            $codeImg = $('.valid-code-img');
        if($.trim($user.val()) == ''){
            $user.next().addClass('show');
            return false;
        }else{
            $user.next().removeClass('show');
        }
        if($.trim($pwd.val()) == ''){
            $pwd.next().addClass('show');
            return false;
        }else{
            $pwd.next().removeClass('show');
        }
        if($.trim($code.val()) == ''){
            $codeImg.next().addClass('show');
            return false;
        }else{
            $codeImg.next().removeClass('show');
        }
        $.ajax({
            type: 'post',
            url: 'api/user/login',
            data: {
                userName: $user.val(),
                password: $pwd.val(),
                validate_code: $code.val()
            },
            dataType: 'json',
            success: function(data){
                if(data.status){
                    setCookie('VALIDATE-TOKEN', data.data.token, { path: '/'});
                    setCookie('userName', data.data.userName, { path: '/'});
                    setCookie('userType', data.data.userType, { path: '/'});
                    window.location.href = 'index.html';
                }else{
                    alert(data.msg);
                }
            },
            error: function(){
                alert('服务器出问题了,请联系管理员!');
            }
        });
        return false;
    });
    $('.valid-code-img').click(function () {
        var path = $(this).attr('src'),
            date = new Date();
        if(path.indexOf('?') !== -1){
            path = path.substr(0, path.indexOf('?') + 1);
        }else{
            path += '?';
        }
        path += date.getTime();
        $(this).attr('src', path);
    });
});