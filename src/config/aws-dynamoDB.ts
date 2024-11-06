import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "your-access-key-id",
  secretAccessKey: "your-secret-access-key",
  region: "your-region",
});

export const dynamoDB = new AWS.DynamoDB.DocumentClient();
