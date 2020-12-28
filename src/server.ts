import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURLAsync, deleteAllTempFiles, requireAuth} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  /**************************************************************************** */
  app.get("/filteredimage", requireAuth, async (req, res) => {
    const url = req.query.image_url;
    let path : string = ""
    try {
      path = await filterImageFromURLAsync(url);  
    } catch (error) {
      console.log("ERROR",error);
      console.log("URL",url);
      deleteAllTempFiles();
      res.status(422).send('Sorry. Something went wrong. Please recheck the input URL');
      return;
    }
    if(path==""){
      deleteAllTempFiles();
      res.status(422).send('Sorry. Something went wrong. Please recheck the input URL');
      return;
    }
    res.sendFile(path, (error) => {
      if(error) {
        res.sendStatus(500);
        return;
      } else {
        deleteAllTempFiles(); //Clear out temp directory 
      }
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();