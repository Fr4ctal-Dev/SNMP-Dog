from backend import snmp
from backend import snmp_rewrite
from flask import Flask, request, jsonify

from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/single', methods=["POST"])
def get_single():
    user_data = request.get_json()

    ip = user_data["ip"]
    print("\n" + ip + "> Request received")

    response_data = snmp_rewrite.request_wrapper(user_data)
    print(response_data)
    #if len(response_data.values()) > 1:
    #    print("\n" + ip + "> Response sent")
    return response_data


app.run()
