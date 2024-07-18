# backend/app.py
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from google.cloud import texttospeech
import io
import ttspeech
import transcribe
import chat
app = Flask(__name__)
CORS(app)

# 音声ファイルを保存するディレクトリ
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/save', methods=['POST'])
def save_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    audio = request.files['audio']
    if audio.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    file_path = os.path.join(UPLOAD_FOLDER, audio.filename)
    audio.save(file_path)
    return jsonify({'message': f'File saved at {file_path}', 'filename': audio.filename})

# テキストを音声に変換
@app.route('/speech', methods=['POST'])
def synthesize():
    data = request.json
    if 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    try:
        audio_file_path = ttspeech.synthesize_text(text)
        return send_from_directory('voice', audio_file_path)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 音声ファイルからテキストを取得
@app.route('/synthesize/<filename>', methods=['POST'])
def get_text_from_audio(filename):
    result_text = transcribe.s_to_t("uploads/"+filename)
    return jsonify({'text': result_text})

# 音声ファイルを取得
@app.route('/get-audio/<filename>', methods=['GET'])
def get_audio(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/chat', methods=['POST'])
def chat_text():
    audio = request.files['audio']
    audio.save('uploads/audio.wav')
    result_text = transcribe.s_to_t("uploads/audio.wav")

    chat_text = chat.chat_localllm(result_text)

    response_audio = ttspeech.synthesize_text(chat_text)
    return jsonify({
        'message': 'Audio content created',
        'request_text': result_text,
        'chat_text': chat_text,
        'file_path': response_audio
    })

@app.route('/chat_fast', methods=['POST'])
def chat_text_groq():
    audio = request.files['audio']
    audio.save('uploads/audio.wav')
    result_text = transcribe.s_to_t("uploads/audio.wav")

    chat_text = chat.chat_groq(result_text)

    response_audio = ttspeech.synthesize_text(chat_text)
    return jsonify({
        'message': 'Audio content created',
        'request_text': result_text,
        'chat_text': chat_text,
        'file_path': response_audio
    })

@app.route('/voice',methods=['GET'])
def voice():
    return send_from_directory('voice', 'output.mp3')

if __name__ == '__main__':
    app.run(debug=True)