from flask import Flask, render_template
import os
from cifrado_des.DES import des_bp
from codificador_huffman.huffman import huffman_bp

app = Flask(__name__, template_folder='templates', static_folder='static')

# Configura las rutas de templates adicionales
app.jinja_loader.searchpath.append(os.path.join(os.path.dirname(__file__), 'cifrado_des/templates'))
app.jinja_loader.searchpath.append(os.path.join(os.path.dirname(__file__), 'codificador_huffman/templates'))

# Registra los blueprints
app.register_blueprint(des_bp)
app.register_blueprint(huffman_bp)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)