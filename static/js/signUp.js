// //배너에 버튼 숨기기
// window.addEventListener('load', function () {
//     let sign_page = '/signUp';
//     let now_href = location.pathname;
//     let hide_header_btn = document.querySelector('.header-btn');
//     let logo_center = document.querySelector('.logo a');
//     if (now_href === sign_page) {
//         hide_header_btn.style.display = 'none';
//         logo_center.style.justifyContent = 'center';
//     }
// });

//회원가입 페이지로 이동
function signUp() {
    window.location.href = '/signUp';
}

//아이디 및 닉네임 형식 확인
function is_nickname(asValue) {
    var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue);
}

//비밀번호 형식 확인
function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

//아이디 중복 확인
function check_id() {
    let userid = $("#input-id").val()
    console.log(userid)
    if (userid == "") {
        alert("아이디를 입력해주세요.")
        $("#input-id").focus()
        return;
    }
    if (!is_nickname(userid)) {
        alert("아이디는 2-10자의 영문과 숫자와 일부 특수문자(._-)만 입력 가능합니다.")
        $("#input-id").focus()
        return;
    }
    $.ajax({
        type: "POST",
        url: "/signUp/check_id",
        data: {
            userid_give: userid
        },
        success: function (response) {

            if (response["exists"]) {
                alert("이미 존재하는 아이디입니다.")
                $("#input-id").focus()
            } else {
                alert("사용할 수 있는 아이디입니다.")
                $("#input-id").focus()
            }
        }
    });
}

//닉네임 중복 확인
function check_name() {
    let username = $("#input-name").val()
    console.log(username)
    if (username == "") {
        alert("닉네임 입력해주세요.")
        $("#input-name").focus()
        return;
    }
    if (!is_nickname(username)) {
        alert("닉네임은 2-10자의 영문과 숫자와 일부 특수문자(._-)만 입력 가능합니다.")
        $("#input-name").focus()
        return;
    }
    $.ajax({
        type: "POST",
        url: "/signUp/check_name",
        data: {
            username_give: username
        },
        success: function (response) {

            if (response["exists"]) {
                alert("이미 존재하는 닉네임입니다.")
                $("#input-name").focus()
            } else {
                alert("사용할 수 있는 닉네임입니다.")
                $("#input-name").focus()
            }
        }
    });
}

//회원가입
function sign_up() {
    let userid = $("#input-id").val()
    let username = $("#input-name").val()
    let password = $("#password1").val()
    let password2 = $("#password2").val()
    console.log(userid, username, password, password2)

    // if ($("#help-id").hasClass("is-danger")) {
    //     alert("아이디를 다시 확인해주세요.")
    //     return;
    // } else if (!$("#help-id").hasClass("is-success")) {
    //     alert("아이디 중복확인을 해주세요.")
    //     return;
    // }

    if (password == "") {
        alert("비밀번호를 입력해주세요.")
        $("#password1").focus()
        return;
    } else if (!is_password(password)) {
        alert("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자")
        $("#password1").focus()
        return
    } else {
        alert("사용할 수 있는 비밀번호입니다.")
    }
    if (password2 == "") {
        alert("비밀번호를 입력해주세요.")
        $("#password2").focus()
        return;
    } else if (password2 != password) {
        alert("비밀번호가 일치하지 않습니다.")
        $("#password2").focus()
        return;
    } else {
        alert("비밀번호가 일치합니다.")
    }
    $.ajax({
        type: "POST",
        url: "/signUp/save",
        data: {
            userid_give: userid,
            username_give: username,
            password_give: password
        },
        success: function (response) {
            alert("회원가입을 축하드립니다!")
            window.location.replace("/login")
        }
    });

}
