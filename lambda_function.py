import snmp_rewrite
import json

def lambda_handler(event, context):
    ip = event["ip"]
    return {
        'statusCode': 200,
        'body': snmp_rewrite.request_wrapper(user_data)
    }
