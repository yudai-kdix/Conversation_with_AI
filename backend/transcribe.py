import sys
import whisper
import wave


def s_to_t(audio_path):
    model = whisper.load_model("base")
    print(audio_path)
    result = model.transcribe(audio_path, language="ja")
    print(result)
    return result['text']

