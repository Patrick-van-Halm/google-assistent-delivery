const {
    dialogflow,
    MediaObject,
    SimpleResponse,
    Suggestions,
    Image
} = require('actions-on-google')
const dialog = dialogflow()
const db = require("./database")
const database = new db()
var brain = []
function dialogFlowApp(){

}

dialog.intent("order_something_product_process", (conv, params) => {
    if(brain.find(d => d.device === conv.user._id)){
        brain.find(d => d.device === conv.user._id).product = null
        brain.find(d => d.device === conv.user._id).classroom = null
    }
    else{
        brain.push({
            device: conv.user._id,
            product: null,
            classroom: null
        })
    }
    //console.log(params.productname)
    return new Promise((res, rej) => {
        database.prepare("SELECT * FROM Producten WHERE ProductNaam LIKE ?", ["%" + params.productname + "%"]).then(results => {
            res(results)
        }).catch(err => {
            console.log(err)
            rej()
        })
    }).then((results) => {
        //console.log(results)
        if(results.length > 1){
            conv.close("Er zijn meerdere mogelijkheden. Wees specifieker.")
        }
        else if(results.length === 1){
            conv.ask("Okay! In welk lokaal bevind je je?")
            brain.filter(d => d.device === conv.user._id)[0].product = results[0]
            //console.log(brain)
        }
        else{
            conv.close("Er is geen " + params.productname + " beschikbaar.")
        }
    }).catch(() => {
        conv.close("Het ging fout!")
    })
})

dialog.intent("order_something_location_process", (conv, params) => {
    return new Promise((res, rej) => {
        console.log(brain)
        database.prepare("SELECT * FROM Bezorglocaties WHERE Lokaal = ?", [params.classroom]).then(results => {
            res(results)
        }).catch(err => {
            console.log(err)
            rej()
        })
    }).then((results) => {
        //console.log(brain)
        //console.log(conv.user)
        //console.log(results.length)
        if(results.length === 1){
            
            brain.filter(d => d.device == conv.user._id)[0].classroom = results[0]
            let device = brain.filter(d => d.device === conv.user._id)[0]
            return new Promise((res, rej) => {
                database.prepare("INSERT INTO Bestellingen (Product, Winkel, Locatie) VALUES (?, ?, ?)", [device.product.ProductNr, device.product.Winkel, device.classroom.BezorglocatieID]).then(() => {
                    res()
                }).catch(err => {
                    console.log(err)
                    rej()
                })
            }).then(()=>{
                conv.close("Okay ik zal een drone sturen met deze aanvraag!")
            }).catch(()=>{
                conv.close("Er ging iets fout tijdens deze aanvraag.")
            })
        }
        else{
            conv.close("lokaal " + params.classroom + " bestaat niet.")
        }
    }).catch(() => {
        //console.log(brain)
        conv.close("Het ging fout!")
    })
})

dialogFlowApp.prototype.dialog = dialog

module.exports = dialogFlowApp