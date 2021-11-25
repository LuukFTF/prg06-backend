let Song = require("/models/songModel.js");

let routes = () => {
    let songsRouter = express.Router();

    songsRouter.route("/song")

    .get( (req, res) => {
        let songs = Song.find({}, (err, notes) => {
            if (err) {
                res.status(500);
            } else {
                res.send(notes);
            }
        });
    });
}