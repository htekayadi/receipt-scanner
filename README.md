# Receipt Scanner
Upload image and resizes them to four sizes and saves these images on Google Cloud Storage

# Geting Started

1. Replace sample config file with concrete values for projectId and bucket.
2. Add bucket using `gsutil mb gs://[YOUR-BUCKET-NAME]`
3. Set Bucket to be readable `gsutil defacl set public-read gs://[YOUR-BUCKET-NAME]`
4. Use default authentication using `gcloud beta auth application-default login`
5. `npm install`
6. `npm start`

# TODO
1. Unit Testing
2. Better error handling.
3. Resizing extracted out as jobs.
4. Home gets past images from bucket(?).
