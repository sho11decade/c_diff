from flask import Flask
from flask import render_template
from flask import request, redirect, url_for
app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    # アップロード処理
    file = request.files['file']
    if file:
        filename = file.filename
        # ファイルの拡張子を取得
        file_ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        # 画像ファイルの拡張子リスト
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
        # 画像ファイルかどうかを判定
        if file_ext not in allowed_extensions:
            return '画像ファイルのみアップロード可能です'
        # ファイルを保存する処理
        return 'アップロード完了'
    return 'ファイルが選択されていません'


    return 'アップロード完了'

@app.route('/config_info', methods=['POST'])
def config_info():
    difficulty = request.form.get('difficulty', default=5, type=int)
    return {'difficulty': difficulty}

@app.route('/help')
def help():
    return render_template('help.html')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)