from flask import Blueprint, render_template, request, jsonify
from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad
import base64
import os

des_bp = Blueprint('des', __name__, template_folder='templates')

# Función para generar una clave DES válida (8 bytes)
def generate_valid_des_key():
    return os.urandom(8)

# Función para cifrar con DES
def des_encrypt(plaintext, key):
    try:
        # Asegurarse de que la clave tenga 8 bytes
        if len(key) != 8:
            key = key.ljust(8)[:8].encode('utf-8')
        else:
            key = key.encode('utf-8')
        
        cipher = DES.new(key, DES.MODE_ECB)
        padded_text = pad(plaintext.encode('utf-8'), DES.block_size)
        encrypted_text = cipher.encrypt(padded_text)
        return base64.b64encode(encrypted_text).decode('utf-8')
    except Exception as e:
        return str(e)

# Función para descifrar con DES
def des_decrypt(ciphertext, key):
    try:
        # Asegurarse de que la clave tenga 8 bytes
        if len(key) != 8:
            key = key.ljust(8)[:8].encode('utf-8')
        else:
            key = key.encode('utf-8')
            
        cipher = DES.new(key, DES.MODE_ECB)
        decrypted_text = cipher.decrypt(base64.b64decode(ciphertext))
        return unpad(decrypted_text, DES.block_size).decode('utf-8')
    except Exception as e:
        return str(e)

@des_bp.route('/cifrado_des')
def index():
    return render_template('cifradodes.html')

@des_bp.route('/cifrado_des/encrypt', methods=['POST'])
def encrypt():
    data = request.get_json()
    plaintext = data['plaintext']
    key = data['key']
    
    if not key:
        key = generate_valid_des_key().hex()
    
    ciphertext = des_encrypt(plaintext, key)
    return jsonify({
        'ciphertext': ciphertext,
        'key': key
    })

@des_bp.route('/cifrado_des/decrypt', methods=['POST'])
def decrypt():
    data = request.get_json()
    ciphertext = data['ciphertext']
    key = data['key']
    
    plaintext = des_decrypt(ciphertext, key)
    return jsonify({
        'plaintext': plaintext
    })