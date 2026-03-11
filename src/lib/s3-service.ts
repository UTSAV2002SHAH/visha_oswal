import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS Credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) are missing in environment variables.");
}

const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export const S3Service = {
    async generateUploadUrl(key: string, contentType: string) {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        // URL expires in 60 seconds
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
        return signedUrl;
    },

    async deleteObject(key: string) {
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
        });

        return await s3Client.send(command);
    }
};
