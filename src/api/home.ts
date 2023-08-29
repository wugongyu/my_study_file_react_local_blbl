import { getJSON } from "./fetch";
import { URL_INDEX, URL_ROUND_SOWING } from "./url";

export function getHomeContent(){
  return getJSON(URL_INDEX);
}

export function getHomeBanner(){
  return getJSON(URL_ROUND_SOWING);
}

