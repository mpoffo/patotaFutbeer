class Database {
    constructor($http) {
        this.$http = $http;
    }

    load() {
        return this.$http({
            method: 'GET',
            url: "https://patotafutbeer-b498.restdb.io/rest/patotas",
            headers: {
                "x-apikey": "6514a864688854751c0c01b0",
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            return response.data.filter(row=>row._id=="651566a2077f951400004920")[0].patotafutbeer;
        });
    }

    update(data) {
        this.$http.put("https://patotafutbeer-b498.restdb.io/rest/patotas/651566a2077f951400004920", 
        { "patotafutbeer": data }, {
            headers: {
                "x-apikey": "6514a864688854751c0c01b0"
            }
        });
    }
}