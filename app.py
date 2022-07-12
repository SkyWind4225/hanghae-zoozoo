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

if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)