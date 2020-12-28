import fs from 'fs';
import Jimp = require('jimp');
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { NextFunction } from 'connect';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
        await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname+outpath, (img)=>{
            resolve(__dirname+outpath);
        });
    });
}

export async function filterImageFromURLAsync(inputURL: string): Promise<string>{
    let photo;
    try {
        photo = await Jimp.read(inputURL);  
        const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
        await  photo.resize(256, 256).quality(60).greyscale().writeAsync(__dirname+outpath);
        return __dirname+outpath;      
    } catch (error) {
        throw error;
    }
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}

//helper function which deletes all files in tmp directory
export async function deleteAllTempFiles() {
    const temp = fs.readdirSync(__dirname+'/tmp'); // Get all files in temp directory 
    deleteLocalFiles(temp.map(x => __dirname+'/tmp/'+x)); //Clear out temp directory 
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers || !req.headers.authorization){
        return res.status(401).send({ message: 'No authorization headers.' });
    }
    const token_bearer = req.headers.authorization.split(' ');
    if(token_bearer.length != 2){
        return res.status(401).send({ message: 'Malformed token.' });
    }

    const token = token_bearer[1];

    return jwt.verify(token, process.env.JWT_SECRET , (err, decoded) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
      }
      console.log(`Requested by ${decoded.email}`); //Get who the request is from.
      return next();
    });
}