from flask import Blueprint, render_template, request, jsonify
import heapq
import json
from collections import defaultdict

huffman_bp = Blueprint('huffman', __name__, template_folder='templates')

class HuffmanNode:
    def __init__(self, char=None, freq=0, left=None, right=None):
        self.char = char
        self.freq = freq
        self.left = left
        self.right = right
    
    def __lt__(self, other):
        return self.freq < other.freq

def build_frequency_table(text):
    frequency = defaultdict(int)
    for char in text:
        frequency[char] += 1
    return frequency

def build_huffman_tree(frequency):
    priority_queue = []
    for char, freq in frequency.items():
        heapq.heappush(priority_queue, HuffmanNode(char=char, freq=freq))
    
    while len(priority_queue) > 1:
        left = heapq.heappop(priority_queue)
        right = heapq.heappop(priority_queue)
        merged = HuffmanNode(freq=left.freq + right.freq, left=left, right=right)
        heapq.heappush(priority_queue, merged)
    
    return heapq.heappop(priority_queue) if priority_queue else None

def build_codes(root, current_code="", codes=None):
    if codes is None:
        codes = {}
    
    if root is None:
        return
    
    if root.char is not None:
        codes[root.char] = current_code
        return
    
    build_codes(root.left, current_code + "0", codes)
    build_codes(root.right, current_code + "1", codes)
    
    return codes

def huffman_encoding(text):
    if not text:
        return {"encoded_text": "", "codes": {}, "tree": None, "frequency": {}}
    
    frequency = build_frequency_table(text)
    tree = build_huffman_tree(frequency)
    codes = build_codes(tree)
    
    encoded_text = ''.join([codes[char] for char in text])
    
    return {
        "encoded_text": encoded_text,
        "codes": codes,
        "tree": serialize_tree(tree),
        "frequency": frequency,
        "original_size": len(text) * 8,  # Tamaño original en bits (asumiendo 8 bits por carácter)
        "compressed_size": len(encoded_text),
        "compression_ratio": (len(text) * 8) / len(encoded_text) if encoded_text else 0
    }

def serialize_tree(node):
    if node is None:
        return None
    
    if node.char is not None:
        return {
            "type": "leaf",
            "char": node.char,
            "freq": node.freq
        }
    
    return {
        "type": "node",
        "freq": node.freq,
        "left": serialize_tree(node.left),
        "right": serialize_tree(node.right)
    }

@huffman_bp.route('/codificador_huffman')
def index():
    return render_template('huffman.html')

@huffman_bp.route('/codificador_huffman/encode', methods=['POST'])
def encode():
    data = request.get_json()
    text = data['text']
    result = huffman_encoding(text)
    return jsonify(result)