import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const client = new S3Client({region: "eu-west-2"});

export async function fetch (bucket: string, key: string):Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });
  const response = await client.send(command);
  const data = await streamToString(response.Body);
  return data;
}
async function streamToString (stream):Promise<string> {
  return  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => {
      resolve(chunks.toString());
    });
  });
}

