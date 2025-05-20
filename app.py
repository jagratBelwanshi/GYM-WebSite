from flask import Flask, render_template, request, redirect, url_for, jsonify
from datetime import datetime
import json
import os

app = Flask(__name__)

# Ensure the uploads directory exists
if not os.path.exists('enrollments'):
    os.makedirs('enrollments')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/enroll', methods=['POST'])
def enroll():
    if request.method == 'POST':
        # Get form data
        form_data = {
            'email': request.form.get('email'),
            'name': request.form.get('name'),
            'phone': request.form.get('phone'),
            'height_weight': request.form.get('height_weight'),
            'age': request.form.get('age'),
            'time_period': request.form.get('Time'),
            'time_slot': request.form.get('clock'),
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Save to a JSON file (in a real app, you'd use a database)
        filename = f"enrollments/enrollment_{form_data['timestamp'].replace(' ', '_').replace(':', '-')}.json"
        with open(filename, 'w') as f:
            json.dump(form_data, f, indent=2)
            
        return jsonify({
            'status': 'success',
            'message': 'Enrollment submitted successfully! We will contact you soon.'
        })
    
    return jsonify({'status': 'error', 'message': 'Invalid request'}), 400

@app.route('/get_enrollments')
def get_enrollments():
    try:
        enrollments = []
        for filename in os.listdir('enrollments'):
            if filename.endswith('.json'):
                with open(os.path.join('enrollments', filename), 'r') as f:
                    enrollments.append(json.load(f))
        return jsonify(enrollments)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)