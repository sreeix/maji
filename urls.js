'use strict'
var urls =  [
    {
        path: "/foo",
        proxy: "http://localhost:9000/foo",
        method: 'get',
        delay: true,
        random: false,
        fail: false
    }
];


module.exports = urls;
