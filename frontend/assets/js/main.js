
async function getDevice(ip) {
    let request = {
        ip: ip
    };

    let response = await fetch('http://localhost:5000/single', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(request)
    });

    let result = await response.json();
    if (result.sysName){
        console.log(result);
        return result;
        /*
        let $table = $('#device-table-body')

        element = "<tr>" +
            "                  <td>" + result.ip + "</td>\n" +
            "                  <td>" + result.sysName + "</td>\n" +
            "                  <td>" + result.sysDescr + "</td>\n" +
            "                  <td>" + result.sysLocation + "</td>\n" +
            "                  <td>" + convertTimestamp(result.sysUpTime) + "</td>\n" +
            "                </tr>"

        $table.append(element);

         */
    }



}

function convertTimestamp(timestamp){
    var totalSeconds = timestamp/100;
    days = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    minutes = Math.floor(totalSeconds / 60);
    seconds = totalSeconds % 60;

    return days + "d " + hours + "h " + minutes + "min " + seconds + "s";



}





$(document).ready(function() {
    let postData = [{ ip: "10.10.30.1"}]
    $('#device-table').DataTable( {
        'ajax': {
            'url': "http://localhost:5000/single",
            'type': 'POST',
            "data" : postData,

            'beforeSend': function (request) {
                request.setRequestHeader("Content-Type", "application/json");
            }
        },
        "columns": [
            { "data": "ip" },
            { "data": "sysName" },
            { "data": "sysDescr" },
            { "data": "sysLocation" },
            { "data": "sysUpTime" }
        ]
    } );
} );





