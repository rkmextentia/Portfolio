#!/usr/bin/env bash
# ==============================================================================
# Oracle Cloud Infrastructure (OCI) Static Website Deployment Script
# Uploads compiled /dist folder to an OCI Object Storage bucket configured for web hosting.
# ==============================================================================

set -e

BUCKET_NAME="${OCI_BUCKET_NAME:-grc-portfolio-website}"
NAMESPACE="${OCI_NAMESPACE:-your_tenancy_namespace}"
DIST_DIR="./dist"

echo "==> Building static Astro website..."
npm run build

echo "==> Verifying build output in $DIST_DIR..."
if [ ! -d "$DIST_DIR" ]; then
  echo "Error: $DIST_DIR does not exist. Build failed."
  exit 1
fi

echo "==> Uploading static files to OCI Object Storage bucket: $BUCKET_NAME..."
# Uses OCI CLI bulk-upload with overwrite
oci os object bulk-upload \
  --bucket-name "$BUCKET_NAME" \
  --src-dir "$DIST_DIR" \
  --overwrite \
  --content-type auto

echo "==> Deployment complete! Your site is live on Oracle Cloud."
