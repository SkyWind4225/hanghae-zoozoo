// 쿠키 확인으로 토큰이 있다면 글작성과 로그아웃 버튼을, 토큰이 없다면 회원가입과 로그인 보여주기
window.addEventListener('load', function () {
    let token = document.cookie
    let header1 = document.querySelector('.header-list');
    let header2 = document.querySelector('.header-list2');

    if(token != '') {
        header1.style.display = 'none';
        header2.style.display = 'flex';
    }
});

//성규님js 추가