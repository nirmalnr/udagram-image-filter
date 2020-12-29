# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

In this project submission the following have been implemented :

## Endpoint /filteredimage
### GET /filteredimage?image_url={{URL}}

This get endpoint uses query parameter to download an image from a public URL, filter the image, and return the result. 

## Endpoint /downloadAndFilterImage
### GET /downloadAndFilterImage
request body : 
{ "image_url" : "{{URL}}" }

This get endpoint accepts the input url in its request body to explicitly download the image to the server, filter the image, and return the result.
Created to work with S3 bucket signed URL of images since directly passing the URL to Jimp was not working. This can be used in the main udagram app after getting the signed URLs from S3.

## Authentication

Uses the same secret used in main udagram application to check if the authorization token can be verified. If verified logs the user that made the request. An override option of this functionality has been provided based on process property value.

Endpoint : http://udagram-filter-dev-dev.us-east-2.elasticbeanstalk.com/
