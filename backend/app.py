from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Verifica si el archivo tiene un tipo válido
    if not file.filename.endswith('.zip'):
        return jsonify({'error': 'Invalid file type'}), 400  # Cambia esto según tu lógica

    # Guardar el archivo (puedes agregar la lógica aquí)
    return jsonify({'message': 'File uploaded successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
