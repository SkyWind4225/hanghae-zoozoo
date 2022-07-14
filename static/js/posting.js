// 글작성 화면에서 회원 헤더 보여주기
window.addEventListener('load', function () {
    let token = document.cookie
    let header1 = document.querySelector('.header-list');
    let header2 = document.querySelector('.header-list2');
    let header3 = document.querySelector('.header-list3');

    if(token != '') {
        header1.style.display = 'none';
        header2.style.display = 'none';
        header3.style.display = 'flex';
    }
});

//글작성 페이지로 이동
function go_posting() {
    window.location.href = '/posting';

}

//글작성 Post
function posting() {
    let content = $("#content").val()
    let file = $('#file')[0].files[0]
    let form_data = new FormData()
    form_data.append("file_give", file)
    form_data.append("content_give", content)
    //file을 보낼려면 form_data에 content도 같이 태워 줘야함
    $.ajax({
        type: "POST",
        url: "/card",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}