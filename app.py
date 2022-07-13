from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, request, jsonify, redirect, url_for
from datetime import datetime, timedelta
import certifi

app = Flask(__name__)

SECRET_KEY = 'ZOOZOO'

ca = certifi.where()
client = MongoClient('mongodb+srv://test:sparta@cluster0.bglkk.mongodb.net/Cluster0?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.dbsparta

@app.route('/')
def home():
    try:
        token_receive = request.cookies.get('mytoken')
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({'userid': payload['id']})
        nickname = user_info['username']
        return render_template('mainpage.html', nickname = nickname)

    except jwt.ExpiredSignatureError:
        return render_template('mainpage.html')

    except jwt.exceptions.DecodeError:
        return render_template('mainpage.html')

# 로그인 화면으로 이동
@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)

# 회원 가입 화면으로 이동
@app.route('/signUp')
def signUp():
    return render_template('signUp.html')

# 글작성 화면으로 이동
@app.route('/posting')
def go_posting():
    token_receive = request.cookies.get('mytoken')
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    user_info = db.users.find_one({'userid': payload['id']})
    nickname = user_info['username']
    return render_template('posting.html', nickname = nickname)

# 아이디 중복확인
@app.route('/signUp/check_id', methods=['POST'])
def check_id():
    userid_receive = request.form['userid_give']
    exists = bool(db.users.find_one({"userid": userid_receive}))
    return jsonify({'result': 'success', 'exists': exists})

# 닉네임 중복확인
@app.route('/signUp/check_name', methods=['POST'])
def check_name():
    username_receive = request.form['username_give']
    exists = bool(db.users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists})

# 회원가입
@app.route('/signUp/save', methods=['POST'])
def sign_up():
    userid_receive = request.form['userid_give']
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "userid": userid_receive,                               # 아이디
        "username": username_receive,                           # 닉네임
        "password": password_hash,                              # 비밀번호
    }
    db.users.insert_one(doc)

    return jsonify({'result': 'success'})

# 로그인
@app.route('/signIn', methods=['POST'])
def sign_in():
    # 로그인
    userid_receive = request.form['userid_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'userid': userid_receive, 'password': pw_hash})

    if result is not None:
        payload = {
         'id': userid_receive,
         'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

# 글작성 Post
@app.route('/card', methods=['POST'])
def save_card():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"userid": payload["id"]})
        content_receive = request.form['content_give']

        # 요건
        file = request.files["file_give"]
        extension = file.filename.split('.')[-1]
        # 파일 확장자 명 바꾸기

        today = datetime.now()
        mytime = today.strftime('%Y-%m-%d-%H%M%S')

        filename = f'file-{mytime}'

        save_to = f'static/img/{filename}.{extension}'
        file.save(save_to)
        # 파일 업로드 준비~서버쪽 코드

        doc = {
            'userid': user_info["userid"],
            'username': user_info["username"],
            'content': content_receive,
            'file': f'{filename}.{extension}'
        }
        db.card.insert_one(doc)
        return jsonify({"result": "success", 'msg': '등록 완료!'})
        # 포스팅하기
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

# 글작성 Get
@app.route('/card', methods=['GET'])
def show_card():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        cards = list(db.card.find({}).sort("date", -1).limit(20))
        for card in cards:
            card["_id"] = str(card["_id"])
            card["count_heart"] = db.likes.count_documents({"card_id": card["_id"], "type": "heart"})
            card["heart_by_me"] = bool(db.likes.find_one({"card_id": card["_id"], "type": "heart", "userid": payload['id']}))
        return jsonify({"result": "success", 'all_card': cards})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        cards = list(db.card.find({}).sort("date", -1).limit(20))
        for card in cards:
            card["_id"] = str(card["_id"])
            card["count_heart"] = db.likes.count_documents({"card_id": card["_id"], "type": "heart"})
        return jsonify({"result": "success", 'all_card': cards})

# 좋아요 업데이트
@app.route('/update_like', methods=['POST'])
def update_like():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"userid": payload["id"]})
        card_id_receive = request.form["card_id_give"]
        type_receive = request.form["type_give"]
        action_receive = request.form["action_give"]
        doc = {
            "card_id": card_id_receive,
            "userid": user_info["userid"],
            "type": type_receive
        }
        if action_receive == "like":
            db.likes.insert_one(doc)
        else:
            db.likes.delete_one(doc)
        count = db.likes.count_documents({"card_id": card_id_receive, "type": type_receive})
        return jsonify({"result": "success", 'msg': 'updated', "count": count})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)