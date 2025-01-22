import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Request } from 'express';

require('dotenv').config();

// Connection string with DefaultEndpointsProtocol
const connectionString: string = process.env.AZURE_CONNECTION_STRING || '';
// Name of the container where you want to store the files
const containerName: string = process.env.CONTAINER_NAME || '';

/**
 * Saves a file to Azure Blob Storage
 * @param file The file to be saved
 * @returns The URL of the uploaded file
 */
async function saveFileToBlobStorage(file: Express.Multer.File): Promise<string> {
    if (!connectionString) {
        throw new Error('Azure connection string is missing.');
    }

    if (!containerName) {
        throw new Error('Container name is missing.');
    }

    // Create a BlobServiceClient object using the connection string
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

    // Get a reference to the container where you want to store the file
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create a new block blob with a unique name
    const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(file.originalname);

    // Upload the file to Azure Blob Storage
    await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
            blobContentType: file.mimetype
        }
    });

    // Return the URL of the uploaded file
    return blockBlobClient.url;
}

export { saveFileToBlobStorage };
