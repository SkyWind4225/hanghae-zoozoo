//배너 버튼 숨기기
window.addEventListener('load', function () {
    let sign_page = '/login';
    let now_href = location.pathname;
    let hide_list = document.querySelector('.header-list');
    let logo_center = document.querySelector('.wrap-header');
    if (now_href === sign_page) {
        hide_list.style.display = 'none';
        logo_center.style.justifyContent = 'center';
    }
});

//로그인 페이지로 이동
function login() {
    window.location.href = '/login';
}

//로그인하기
function sign_in() {
    let userid = $("#login-id").val()
    let password = $("#login-password").val()

    if (userid == "") {
        $("#help-id-login").text("아이디를 입력해주세요.")
        $("#login-id").focus()
        return;
    } else {
        $("#help-id-login").text("")
    }

    if (password == "") {
        $("#help-password-login").text("비밀번호를 입력해주세요.")
        $("#login-password").focus()
        return;
    } else {
        $("#help-password-login").text("")
    }
    $.ajax({
        type: "POST",
        url: "/signIn",
        data: {
            userid_give: userid,
            password_give: password
        },
        success: function (response) {
            if (response['result'] == 'success') {
                $.cookie('mytoken', response['token'], {path: '/'});
                window.location.replace("/")
            } else {
                alert(response['msg'])
            }
        }
    });
}

//로그아웃하기
function sign_out() {
    $.removeCookie('mytoken', {path: '/'});
    window.location.href = "/"
}

//엔터 버튼 눌러서 로그인하기
$(document).keyup(function(e) {
   // focus 되고 enter눌렀을 경우
   if ($(".enter-login").is(":focus") && e.key == "Enter") {
      sign_in()
   }
});