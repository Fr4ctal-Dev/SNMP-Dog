from backend import snmp
from flask import Flask, request

app = Flask(__name__)


@app.route('/range', methods=["POST"])
def get_all():
    user_data = request.get_json()
    ip = user_data["network"]
    mask = user_data["mask"]
    response_data = snmp.get_devices(ip, mask)
    return response_data


@app.route('/single', methods=["POST"])
def get_single():
    user_data = request.get_json()
    ip = user_data["ip"]
    response_data = snmp.get_devices(ip, "32")
    return response_data


@app.route('/value', methods=["POST"])
def get_value():
    user_data = request.get_json()
    ip = user_data["ip"]
    value = user_data["value"]
    community = "public"
    try:
        community = user_data["community"]
    except KeyError:
        pass
    response_data = snmp.get_device_value(ip, value, community_string=community)
    return response_data


@app.route('/oid', methods=["POST"])
def get_value_oid():
    user_data = request.get_json()
    ip = user_data["ip"]
    oid = user_data["oid"]
    community = "public"
    try:
        community = user_data["community"]
    except KeyError:
        pass
    response_data = snmp.get_device_value_oid(ip, oid, community_string=community)
    return response_data



app.run()
