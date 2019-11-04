const {
    dialogflow,
    MediaObject,
    SimpleResponse,
    Suggestions,
    Image
} = require('actions-on-google')
const dialog = dialogflow()
const downloadMp3 = require("./downloadMp3")
const dl = new downloadMp3()

dialog.intent("play_song_followup_custom", (conv, params) => {
    if (!conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO')) {
        conv.ask('Sorry, this device does not support audio playback.');
        return;
    } else {
        return new Promise((res, error) => {
            dl.status(params.songname).then(e => {
                if(e === 1){
                    res(2)
                }
                else if(e === 0){
                    dl.download(params.songname).then((e) => {
                        res(e)
                    }).catch(err => {
                        console.log(err)
                        error()
                    })
                }
                else{
                    res(e)
                }
            })
        }).then((e) => {
            if (e === 1) {
                conv.ask(new SimpleResponse("Helaas stond deze niet in mijn geheugen en word nu speciaal voor jou gedownload. Probeer het zo nog eens."));
            }
            else if(e === 2){
                conv.ask(new SimpleResponse("Dit nummer wordt al gedownload!"));
            }
            else {
                conv.ask(new SimpleResponse("Alsjeblieft."));
                conv.ask(new MediaObject({
                    name: params.songname,
                    url: "https://8c281184.ngrok.io/static/" + e
                }))
                conv.ask(new Suggestions("cancel"));
            }
        }).catch(() => {
            conv.ask(new SimpleResponse("Helaas kan ik nu niks afspelen."));
        })
    }
})

module.exports = dialog