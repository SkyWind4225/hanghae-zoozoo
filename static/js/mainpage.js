$(document).ready(function () {
    listing()
})

// 쿠키 확인으로 토큰이 있다면 글작성과 로그아웃 버튼을, 토큰이 없다면 회원가입과 로그인 보여주기
window.addEventListener('load', function () {
    let token = document.cookie
    let header1 = document.querySelector('.header-list');
    let header2 = document.querySelector('.header-list2');
    let header3 = document.querySelector('.header-list3');

    if(token != '') {
        header1.style.display = 'none';
        header2.style.display = 'flex';
        header3.style.display = 'none';
    }
});

// 좋아요 숫자 형식
function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    if (count == 0) {
        return ""
    }
    return count
}

// 글작성 Get
function listing() {
    $("#cards-box").empty()
    $.ajax({
        type: "GET",
        url: "/card",
        data: {},
        success: function (response) {
            let cards = response['all_card']
            for (let i = 0; i < cards.length; i++) {
                let card = cards[i]
                let content = cards[i]['content']
                let file = cards[i]['file']
                let class_heart = card['heart_by_me'] ? "fa-solid": "fa-regular"
                let count_heart = card["count_heart"]
                let temp_html = `<article class="column is-4" id="${card['_id']}">
                                    <div class="card">
                                        <div class="card-image">
                                            <figure class="image">
                                                <img src="../static/img/${file}" alt="">
                                            </figure>
                                        </div>
                        
                                        <div class="card-content">
                                            <div class="level">
                                                <div class="level-left">
                                                    <p class="subtitle is-5">@${card['username']}</p>
                                                </div>
                                                <div class="level-right">
                                                    <a aria-label="heart" onclick="toggle_like('${card['_id']}', 'heart')">
                                                        <span class="icon is-medium">
                                                            <i class="${class_heart} fa-heart" aria-hidden="true"></i>
                                                        </span>
                                                        <span class="like-num">${num2str(count_heart)}</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="content">
                                                ${content}
                                            </div>
                                        </div>
                                    </div>
                                </article>`
                $('#cards-box').prepend(temp_html)
            }
        }
    })

}

// 좋아요 업데이트
function toggle_like(card_id, type) {
    console.log(card_id, type)
    let $a_like = $(`#${card_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    if ($i_like.hasClass("fa-solid")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                card_id_give: card_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass("fa-regular").removeClass("fa-solid")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                card_id_give: card_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                $i_like.addClass("fa-solid").removeClass("fa-regular")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })

    }
}