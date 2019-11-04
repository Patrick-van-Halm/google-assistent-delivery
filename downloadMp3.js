const ytdl = require('ytdl-core');
const YS = require("youtube-search")
const fs = require("fs")
var songsDownloaded = []

function downloadMp3(){

}

downloadMp3.prototype.status = function(songname){
    return new Promise((resolves, rejects) => {
        console.log(songname + " Trying to lookup")
        YS(songname, {
            maxResults: 1,
            key: "AIzaSyBlpkp9pSFNk8SVQt9KxEzzAqMyyt0nnTk",
            type: "video",
            videoCategoryId: "10"
        }, (err, result) => {
            if(err){
                rejects(err)
            }
            else{
                console.log(songname + " found: " + result[0].title)
                if(fs.existsSync("./public/music/" + result[0].id + ".mp3")){
                    if(songsDownloaded.indexOf(result[0].id) > -1){
                        resolves(1)
                    }
                    else{
                        resolves("music/" + result[0].id + ".mp3")
                    }
                }
                else{
                    resolves(0)
                }
            }
        })
    })
}

downloadMp3.prototype.download = function(songname){
    return new Promise((resolves, rejects) => {
        YS(songname, {
            maxResults: 1,
            key: "AIzaSyBlpkp9pSFNk8SVQt9KxEzzAqMyyt0nnTk",
            type: "video",
            videoCategoryId: "10"
        }, (err, result) => {
            if(err){
                rejects(err)
            }
            else{
                console.log(songname + " found: " + result[0].title)
                if(fs.existsSync("./public/music/" + result[0].id + ".mp3")){
                    resolves("music/" + result[0].id + ".mp3")
                }
                else{
                    console.log(songname + " Trying to download")
                    songsDownloaded.push(result[0].id)
                    ytdl(result[0].link).pipe(fs.createWriteStream("./public/music/" + result[0].id + ".mp3")).on("close", () => {
                        songsDownloaded.splice(songsDownloaded.indexOf(result[0].id), 1);
                        console.log("./public/music/" + result[0].id + ".mp3 has finished")
                    })
                    resolves(1)
                }
            }
        })
    })
}

module.exports = downloadMp3