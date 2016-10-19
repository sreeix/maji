### Maji Proxy

An annoying service that provides a way of testing how an upstream service will behave when the down stream service misbehaves, But a life saver on those bad days.


Allows users to set

* How much to delay the downstream service
  * true: to do the default delay (1000 ms)
  * false: to not introduce any delay(simple proxy)
  * provide a function to provide custom delay


* What status code to respond with
  * true: Randomize the status code response to upstream
  * false: send the same response code as downstream(simple proxy)
  * custom function: use the downstream response to provide a specific status code

* Fail the request
  * false: Don't fail, always proxy
  * true: send a failure status code and a random json body
  * custom function: to provide failure status/body based on the proxied response

#### Configuration

Is via a javascript file called `urls.js`

The below are mandatory.

`path`: the path to listen on this proxy service
`proxy`: the downstream endpoint to invoked


Following are optional and default values are applied
`method`: Can be a string or an array of HTTP methods. Default is to proxy only GET, POST, PUT, DELETE
`delay`: Time in milliseconds to delay the downstream function. It can be a boolean, a numeric value(time to delay in ms), or a function. The default is false.
`random`: Allows for random status code. It will override the downstream response code. It can be a boolean, a numeric value, or a function. The default is false.
`fail`: Failure response for the downstream service.



All of them (delay, random, fail) can be used in conjunction with each other.



#### Others
* Also supported are express regex based param matchers for flexible url matching and forwarding. see example urls.js
* Forwards all headers and query parameters downstream and upstream
* Does not forward cookies downstream/upstream
