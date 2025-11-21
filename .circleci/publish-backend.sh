#!/usr/bin/env bash
set -euo pipefail

# publish-backend.sh
# Requirements (set in CircleCI project env):
# AWS_REGION, AWS_ACCOUNT_ID, ECR_REPOSITORY, ECS_CLUSTER, ECS_SERVICE

if [ -z "${AWS_ACCOUNT_ID:-}" ] || [ -z "${AWS_REGION:-}" ] || [ -z "${ECR_REPOSITORY:-}" ] || [ -z "${ECS_CLUSTER:-}" ] || [ -z "${ECS_SERVICE:-}" ]; then
  echo "Missing required env vars. Please set AWS_ACCOUNT_ID, AWS_REGION, ECR_REPOSITORY, ECS_CLUSTER, ECS_SERVICE"
  exit 1
fi

SHORT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "local")
IMAGE_TAG=${SHORT_SHA}
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}"

echo "Building Docker image ${ECR_URI}"
docker build -t "${ECR_REPOSITORY}:${IMAGE_TAG}" -f apps/backend/Dockerfile .

echo "Tagging and logging into ECR"
aws --version >/dev/null 2>&1 || (echo "aws cli not found" && exit 1)
aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

docker tag "${ECR_REPOSITORY}:${IMAGE_TAG}" "${ECR_URI}"

echo "Pushing image to ECR"
aws ecr describe-repositories --repository-names "${ECR_REPOSITORY}" --region "${AWS_REGION}" >/dev/null 2>&1 || aws ecr create-repository --repository-name "${ECR_REPOSITORY}" --region "${AWS_REGION}"
docker push "${ECR_URI}"

echo "Preparing task definition"
TEMPLATE=.circleci/ecs_taskdef.template.json
TMP_TASKDEF=.circleci/ecs_taskdef.json
sed "s|IMAGE_PLACEHOLDER|${ECR_URI}|g" "${TEMPLATE}" > "${TMP_TASKDEF}"

echo "Registering task definition"
TASKDEF_ARN=$(aws ecs register-task-definition --cli-input-json file://"${TMP_TASKDEF}" --region "${AWS_REGION}" --query 'taskDefinition.taskDefinitionArn' --output text)
echo "Registered: ${TASKDEF_ARN}"

echo "Updating service to use new task definition"
aws ecs update-service --cluster "${ECS_CLUSTER}" --service "${ECS_SERVICE}" --task-definition "${TASKDEF_ARN}" --region "${AWS_REGION}"

echo "Deployment triggered. New image: ${ECR_URI}"
