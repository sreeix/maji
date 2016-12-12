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
        path: "/foo",
        proxy: "http://localhost:8000/users/1/tokens",
        method: 'post',
        delay: false,
        random: false,
        fail: function () {
            return _.random(1,3)=== 1; // fail 33% of the requests.
        }
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

// tcp only
var ports = [
    {
        local: 5555,
        proxy: "localhost:6379",
        delay:1000,
        delayConnect: 1000
    }
];


module.exports = { http: urls, tcp: ports};
