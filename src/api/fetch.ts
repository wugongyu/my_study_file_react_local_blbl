/**
 * fetch 是一种现代的 JavaScript API，用于在浏览器中进行网络请求。
 * 但是，fetch 在一些老旧的浏览器中可能不被支持。
 * 在这种情况下，可以使用 cross-fetch 包来解决这个问题。
 * */ 
import fetch from "cross-fetch";

export interface FetchDataProps {
  [key: string]: any;
}

export function getJSON(url: string, data?: FetchDataProps){
  let param = '';
  if(data){
    const dataKeyMap = [];
    for (const key in data) {
      const keyMapItem = `${key}=${data[key]}`;
      dataKeyMap.push(keyMapItem)
    }
    if(dataKeyMap.length > 0){
      param = '?' + dataKeyMap.join('&');
    }
  }
  return fetch(url+param).then((res) => {
    if(res.ok){
      return res.json();
    }
    throw new Error(res.statusText);
  })
}

export function postJSON(url: string, data: FetchDataProps){
  return fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    }
  }).then((res) => {
    if(res.ok){
      return res.json();
    }
    throw new Error(res.statusText);
  })
}

export const commonFetchSuccessCode = '1'; // 请求成功返回的code值 

