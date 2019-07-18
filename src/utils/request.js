import fetch from 'dva/fetch';
import ErrorMessage from './errorMessage';


function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function customOptions(options) {
  let newOptions = '';
  for (var key in options) {
    newOptions += `${key}=${options[key]}&`
  }
  return newOptions.slice(0, newOptions.length - 1);
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {

  // let formData = new FormData();
  // return fetch(url, options)
  //   .then(checkStatus)
  //   .then(parseJSON)
  //   .then(data => ({ data }))
  //   .catch(err => ({ err }));

  if (!options.headers) {
    // formData.append('page',1)
    options.body = customOptions(options.body)
  }

  options.method = options.method ? options.method : 'POST'
  options.headers = options.headers ? options.headers : {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }



  const response = await fetch(url, {
    headers: options.headers,
    method: options.method,
    body: options.body
  });
  checkStatus(response);
  const res = await response.json();
  if (res.success) {
    return res;
  } else {
    ErrorMessage(res);
    return {}
  }
}
