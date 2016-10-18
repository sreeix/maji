'use strict'
var _ = require('underscore');
var urls =  [
    {
        path: "/foo",
        proxy: "http://localhost:8000/users/1/tokens",
        method: 'get',
        delay: false,
        random: false,
        fail: false
    },
    {
        path: "/bar",
        proxy: "http://localhost:8000/users/1/tokens",
        method: ['get', 'post'],
        delay: function () {
            return _.random(1,5000);
        },
        random: false,
        fail: false
    },
    {
        path: "/users/:id/tokens",
        proxy: "http://localhost:8000/users/:id/tokens",
        method: ['get'],
        delay: 1000,
        random: true,
        fail: false
    }
];


module.exports = urls;
