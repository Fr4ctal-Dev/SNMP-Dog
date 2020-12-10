function longToIp (proper_address) {
    var output = false;
    if (!isNaN(proper_address) && (proper_address >= 0 || proper_address <= 4294967295)) {
        output = Math.floor(proper_address / Math.pow(256, 3)) + '.' +
            Math.floor((proper_address % Math.pow(256, 3)) / Math.pow(256, 2)) + '.' +
            Math.floor(((proper_address % Math.pow(256, 3)) % Math.pow(256, 2)) / Math.pow(256, 1)) + '.' +
            Math.floor((((proper_address % Math.pow(256, 3)) % Math.pow(256, 2)) % Math.pow(256, 1)) / Math.pow(256, 0));
    }
    return output;
}

function ipToLong (ip_address ) {
    // +   original by: Waldo Malqui Silva
    var output = false;
    var parts = [];
    if (ip_address.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
        parts  = ip_address.split('.');
        output = ( parts[0] * 16777216 +
            ( parts[1] * 65536 ) +
            ( parts[2] * 256 ) +
            ( parts[3] * 1 ) );
    }

    return output;
}


function cidrToRange(cidr) {
    let range = [];
    cidr = cidr.split('/');
    let cidr_1 = parseInt(cidr[1])
    let ipMin = ipToLong(cidr[0]) & ((-1 << (32 - cidr_1)))

    let ipMax = ipMin + Math.pow(2, (32 - cidr_1)) - 1
    for (let i = ipMin; i <= ipMax; i++) {
        range.push(longToIp(i))
    }
    return range;
}


$('#mainSearch').on("keypress", function (e) {
    if(e.which === 13){
        // Submit handler
        let searchedText = $('#mainSearch').val();
        let range = cidrToRange(searchedText)
        startCall(range)



    }
})