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
* params: Object

The HPrefill function requires an object of a specific structure. The
following are the options for the object.


### Input bindings
#### firstName - HTMLInputElement
#### lastName - HTMLInputElement
#### address - HTMLInputElement
#### city - HTMLInputElement
#### state - HTMLSelectElement

### API handlers
#### success - function
#### error - function
