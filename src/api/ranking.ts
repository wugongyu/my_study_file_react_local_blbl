import fetch from "cross-fetch";
import { URL_RANKING } from "./url";

export function getRankingsById(rId: number){
  return fetch(URL_RANKING + `/${rId}`);
}