import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import dotenv from 'dotenv';
dotenv.config();

const fileFormats = {
    document: {
        extensions: [
            'pdf'],
        size: 123456789
    },
    image: {
        extensions: [
            'jpeg', 'jpg','png'],
        size: 1234556789
    },
    video: {
        extensions: [
            'mp4'],
        size: 123456789
    }
}
/**
 * Converts a byte array to a file and saves it to the specified file path.
 * @param {ArrayBufferView} byteArray - The byte array to be converted to a file.
 * @param {string} filePath - The file path where the converted file will be saved.
 * @returns {void}
 */
const byteArrayToFile = (byteArray, filePath) => {
    // @ts-ignore
    writeFileSync(filePath, byteArray);
}

import { S3 } from "@aws-sdk/client-s3";
import e from 'express';
//const fs = readFileSync('./signature.jpg')
const s3 = new S3({
    forcePathStyle: true, // Configures to use subdomain/virtual calling format.
    endpoint: process.env.DO_SPACES_ENDPOINT || "",
    region: "blr1",
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY || "",
        secretAccessKey: process.env.DO_SPACES_SECRET || "",
    }
});


/**
 * 
 * @param {string} FirstFolderName 
 * @param {string} FilePath 
 * @param {*} FileData 
 */
const SaveFileToSpaces = async (FirstFolderName, FilePath, FileData, ContentType, Response) => {

    s3.putObject({
        "Bucket": FirstFolderName,
        "Key": FilePath,
        "Body": new Uint8Array(FileData),
        "ACL": "public-read",
        "ContentType": ContentType,
    }, (err, data) => {
        if (Response) {
            if (err) {
                return Response.status(400).json(false);
            }
            return Response.json({ "FileUrl": `${process.env.DO_SPACES_FILEURL}/${FirstFolderName}/${FilePath}` });
        }
        if (err) {
            console.log("An error", err)
            return false;
        }
        // https://oxydebug.sgp1.cdn.digitaloceanspaces.com/Users/idName/input.pdf
        return `${process.env.DO_SPACES_FILEURL}/${FirstFolderName}/${FilePath}`;
    });

}


/**
 * 
 * @param {string} FirstFolderName 
 * @param {string} FilePath 
 * @param {*} FileData 
 */
const AsyncSaveFileToSpaces = async (FirstFolderName, FilePath, FileData, ContentType) => {

    return new Promise(async (resolve, reject) => {
        s3.putObject({
            "Bucket": FirstFolderName,
            "Key": FilePath,
            "Body": new Uint8Array(FileData),
            "ACL": "public-read",
            "ContentType": ContentType,
        }, (err, data) => {

            if (err) {
                console.log("An error", err)
                reject(false);
            }
            // https://oxydebug.sgp1.cdn.digitaloceanspaces.com/Users/idName/input.pdf
            resolve(`${process.env.DO_SPACES_FILEURL}/${FirstFolderName}/${FilePath}`);
        });
    })

}


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 */
const PostFilesUsers = async (req, res) => {
    const FileData8Array = new Uint8Array(req.body.FileData);
    //@ts-ignore
    const { mime: FileType } = await fileTypeFromBuffer(FileData8Array);
    // @ts-ignore
    const FilePath = `${req.user.UserId}/${req.body.FileFieldName}`;
    SaveFileToSpaces("Users", FilePath, req.body.FileData, FileType, res)
}




/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 */
const PostFilesAdmin = async (req, res) => {

    const FileData8Array = new Uint8Array(req.body.FileData);
    //@ts-ignore
    const { mime: FileType } = await fileTypeFromBuffer(FileData8Array);
    // @ts-ignore
    const FilePath = `${Date.now()}${req.body.FileName}`;
    SaveFileToSpaces("Admin", FilePath, req.body.FileData, FileType, res)
}

/**
 * 
 * @param {*} filePath 
 * @returns 
 */
function getFileArrayBuffer(filePath) {
    // Read the PDF file as a buffer
    const pdfBuffer = readFileSync(filePath);
    return pdfBuffer;
}

/**
 * 
 * @param {string} filePath 
 * @returns 
 */
const FileDelete = (filePath) => {
    return unlinkSync(filePath);
}

export {
    byteArrayToFile,
    SaveFileToSpaces,
    PostFilesUsers,
    PostFilesAdmin,
    AsyncSaveFileToSpaces,
    getFileArrayBuffer,
    FileDelete,
    fileFormats
}