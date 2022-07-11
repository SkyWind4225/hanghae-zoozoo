// //배너에 버튼 숨기기
// window.addEventListener('load', function () {
//     let sign_page = '/login';
//     let now_href = location.pathname;
//     let hide_header_btn = document.querySelector('.header-btn');
//     let logo_center = document.querySelector('.logo a');
//     if (now_href === sign_page) {
//         hide_header_btn.style.display = 'none';
//         logo_center.style.justifyContent = 'center';
//     }
// });

//로그인 페이지로 이동
function login() {
    window.location.href = '/login';
}