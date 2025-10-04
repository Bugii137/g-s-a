from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Simple test server is working!"})

@app.route('/api/test')
def test():
    return jsonify({"status": "success", "data": "Backend is connected!"})

if __name__ == '__main__':
    print("🚀 Starting SIMPLE test server...")
    app.run(debug=True, host='127.0.0.1', port=5000, use_reloader=False)