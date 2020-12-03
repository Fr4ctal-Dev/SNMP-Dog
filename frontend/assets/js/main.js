async function getCard(ip) {
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
        let $table = $('#device-table')

        element = "<tr>" +
            "                  <td>" + result.ip + "</td>\n" +
            "                  <td>" + result.sysName + "</td>\n" +
            "                  <td>" + result.sysDescr + "</td>\n" +
            "                  <td>" + result.sysLocation + "</td>\n" +
            "                  <td>" + result.sysUpTime + "</td>\n" +
            "                </tr>"

        $table.append(element);
    }



}


for (let i = 0; i < 10; i++) {
    getCard("10.10.30." + i);
}





