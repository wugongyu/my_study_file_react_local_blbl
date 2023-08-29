import fetch from "cross-fetch";
import { URL_PARTITIONS, URL_RANKING_PARTITIONS } from "./url";

export function getPartitions(){
  return fetch(URL_PARTITIONS);
}

export function getRankingPartitions(){
  return fetch(URL_RANKING_PARTITIONS);
}