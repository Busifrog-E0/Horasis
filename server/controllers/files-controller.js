import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import ENV from '../Env.js';

const fileFormats = {
    document: {
        extensions: [
            'pdf'],
        size: 5242880 //5mb
    },
    image: {
        extensions: [
            'jpeg', 'jpg', 'png'],
        size: 3397152 //2mb
    },
    video: {
        extensions: [
            'mp4'],
        size: 52428800 //20mb
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
import moment from 'moment';
//const fs = readFileSync('./signature.jpg')
const s3 = new S3({
    // forcePathStyle: true, // Configures to use subdomain/virtual calling format.
    endpoint: ENV.DO_SPACES_ENDPOINT || "",
    region: "us-east-2",
    credentials: {
        accessKeyId: ENV.DO_SPACES_KEY || "",
        secretAccessKey: ENV.DO_SPACES_SECRET || "",
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
        "Bucket": ENV.DO_SPACES_NAME,
        "Key": `${FirstFolderName}/${FilePath}`,
        "Body": new Uint8Array(FileData),
        "ContentType": ContentType,
    }, (err, data) => {
        if (Response) {
            if (err) {
                return Response.status(400).json(false);
            }
            return Response.json({ "FileUrl": `${ENV.DO_SPACES_FILEURL}/${FirstFolderName}/${FilePath}?${Date.now()}${Math.floor(Math.random() * 10000) + 1}` });
        }
        if (err) {
            console.log("An error", err)
            return false;
        }
        return `${ENV.DO_SPACES_FILEURL}/${FirstFolderName}/${FilePath}?${Date.now()}${Math.floor(Math.random() * 10000) + 1}`;
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
            "Bucket": ENV.DO_SPACES_NAME,
            "Key": `${FirstFolderName}/${FilePath}`,
            "Body": new Uint8Array(FileData),
            "ContentType": ContentType,
        }, (err, data) => {

            if (err) {
                console.log("An error", err)
                reject(false);
            }
            resolve(`${ENV.DO_SPACES_FILEURL}/${FirstFolderName}/${FilePath}?${Date.now()}${Math.floor(Math.random() * 10000) + 1}`);
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
    let FilePath = `${req.user.UserId}`;
    if (req.body.Type) {
        FilePath = FilePath + `/${req.body.Type}/${Math.floor(Math.random() * 1000000000000) + 1}`
    }
    SaveFileToSpaces("Users", FilePath + `/${req.body.FileFieldName}${moment().valueOf()}`, req.body.FileData, FileType, res)
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
