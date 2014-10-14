;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory();
    });
  } else if (typeof exports !== 'undefined') {
    module.exports = factory();
  } else {
    root.HPrefill = factory();
  }

}(this, function () {
  // Hard Mode
  'use strict';

  var HPrefill, _requestPrefillData, _prefillResponse;



  /*
   * Implementors entrance.
   * As long as a persons firstname, lastname, address, city, state, zip are passed into this as
   * an object, HonestPolicy will attempt to provide as much data as possible to help you know your
   * user.
   *
   * @params {Object} options
   * @returns {Promise}
   */

  HPrefill = function(options) {
    // Reject if `options` is not an object
    //
    // IE 8 not working
    //
    //if ('Object' !== options.constructor.name || options !== Object(options)) {
      //return new Promise(function(){});
    //}

    // Return Promise 
    return new Promise(function(resolve, reject) {
      _requestPrefillData(options, resolve, reject);
    });
  };



  _prefillResponse = function(xhr, resolve, reject) {
    var data, _respondWithData; 

    _respondWithData = function(){
      data = JSON.parse(xhr.response);

      // reject if server returns an error
      if (data.error) {
        reject(data);
      } else {
        resolve(data);
      }
    };

    // if we dont have a readyState, this is an XDomainRequest
    // object. and we should be using responseText
    if (undefined === xhr.readyState) {
      _respondWithData();

    // if xhr has a readyState it must be 4 to move on
    // readyState: 4 means DONE
    } else if (xhr.readyState == 4) {

      // 200 responses are what we want
      if(xhr.status == 200) { _respondWithData(); }

      // reject anything else
      else { reject(xhr); }
    }

  };


  /*
   * This function makes the cross domain GET request to the HP
   * server that handles the data retrieval
   *
   * @params {Object} options
   * @returns {XMLHTTPRequest}
   *
   */

  _requestPrefillData = function(options, resolve, reject) {
    var xhr, params = '';

    if (window.XDomainRequest) {
      xhr = new XDomainRequest();
    } else {
      xhr = new XMLHttpRequest();

    }

    // format our url params
    params += 'first_name=' + options.firstName;
    params += '&last_name=' + options.lastName;
    params += '&address=' + options.address;
    params += '&city=' + options.city;
    params += '&state=' + options.state;
    params += '&zip=' + options.zip;

    // Open request
    xhr.open("GET", "http://integral.dev/api/v1/prefill?" + params, true);

    // IE 9 fix
    xhr.onprogress = function() {};

    // Wait for response. 
    xhr.onreadystatechange = function() { _prefillResponse(xhr, resolve, reject); };
    xhr.onload = function() { _prefillResponse(xhr, resolve, reject); };

    // reject any errors
    xhr.onerror   = function() { reject(xhr); };
    xhr.ontimeout = function() { reject(xhr); };

    // make request
    xhr.send();
  };


  return HPrefill;
}));
