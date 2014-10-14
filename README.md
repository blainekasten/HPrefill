# HPrefill

The HonestPolicy Prefill service allows you to gather data for your
users when they consent to it. 

## Getting Started

We recommend using Bower to install the script to your local server.

`bower install hp-prefill`

Then simply include the script in your page:

    <head>
        <script src="/path/to/hp-prefill.js"></script>
    </head>

## API - HPrefill()
    @params {Object}
    @returns {Promise}

The HPrefill object returns a Promise which you would follow normal Promise implementations to use. For example:

`HPrefill(userData).then(successFn, errorFn)['catch'](errorFn)`

#### successFn
    @params {Object}

The Promise will pass the users data to the successFn. So its in this function that you'll want to fill in any input fields for the user and give them visual queue's that it was a success.

#### errorFn

The Promise will call this if the service doesn't find any information for the person, or an error occurs. It does not pass any data to the function. So it'll simply be a place where you inform the user the service was not successful for them and they need to enter information themselves.

## IE8 ['catch']

`catch` is a reserved keyword in IE8 but it is part of the Promise spec. So if you are developing for IE8. Make sure you call catch from the object accessing fashion. `HPrefill()['catch'](errorFn)`
