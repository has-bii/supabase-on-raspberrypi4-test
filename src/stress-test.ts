import http, { BatchRequest, Params } from "k6/http";
import { sleep } from "k6";
import { Options } from "k6/options";

export const options: Options = {
  stages: [
    { duration: "10m", target: 200 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
    { duration: "30m", target: 200 }, // stay at higher 200 users for 30 minutes
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
};

export default function () {
  const url = "http://192.168.0.1:8000/rest/v1/posts";

  const headers: Params["headers"] = {
    apikey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZG55Z3R0dnhuenVxcGdnaXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxNjU3NTQsImV4cCI6MjAzMDc0MTc1NH0.ORqK9WuznqOylzkGPiTyMJ_XLVfFcv9kM9N217ZcgqM",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZG55Z3R0dnhuenVxcGdnaXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxNjU3NTQsImV4cCI6MjAzMDc0MTc1NH0.ORqK9WuznqOylzkGPiTyMJ_XLVfFcv9kM9N217ZcgqM",
  };

  const get: BatchRequest = {
    method: "GET",
    url: url + "?select=*&limit=100",
    params: {
      headers,
    },
  };

  const insert: BatchRequest = {
    method: "POST",
    url,
    body: JSON.stringify([
      {
        content:
          "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.\n\nSed ante. Vivamus tortor. Duis mattis egestas metus.",
        user_id: Math.floor(Math.random() * 1001),
        shares: Math.floor(Math.random() * 1001),
        likes: Math.floor(Math.random() * 1001),
      },
    ]),
    params: {
      headers,
    },
  };

  http.batch([get, insert]);

  sleep(1);
}
