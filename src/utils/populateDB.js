import axios from "axios";

import { youtube } from "../services/db.js";
import { youtubeApiKey } from "../config.js";

const youtubeApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  params: { 'key': youtubeApiKey }
});

const youtubeChannel = 'UCJaHTyjOkFEcHFPbywErwjg';
const channelUploads = 'UUJaHTyjOkFEcHFPbywErwjg';
let nextPageToken;

const videos = [];
// await youtubeApi.get(`channels?part=contentDetails&id=${youtubeChannel}`).then(({ data }) => console.log(data.items[0].contentDetails.relatedPlaylists.uploads))
do {
  await youtubeApi.get(`playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${channelUploads}${nextPageToken ? '&pageToken='+nextPageToken : ""}`,)
    .then(({ data }) => {
      data['items'].forEach(video => videos.push(video));
      nextPageToken = data['nextPageToken'];
  });
} while (nextPageToken)

for (const video of videos) {
  await youtube.create({
    "id": video['contentDetails']['videoId'],
    "channel": video['snippet']['channelTitle'],
    "title": video['snippet']['title'],
    "descr": video['snippet']['description'],
    "thumb": video['snippet']['thumbnails']['high']['url'],
    "channelId": video['snippet']['channelId'],
    "createdAt": video['snippet']['publishedAt']
  });
}