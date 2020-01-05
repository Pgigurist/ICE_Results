const net = require('net')
///////
const Datastore = require('nedb')
const db = {}
db.events = new Datastore({filename:'events'})
db.categories = new Datastore({filename:'categories'})
db.segments = new Datastore({filename:'segments'})
db.participants = new Datastore({filename:'participants'})
db.performances = new Datastore({filename:'performances'})
db.officials = new Datastore({filename: 'officials'})
db.events.loadDatabase()
db.categories.loadDatabase()
db.segments.loadDatabase()
db.participants.loadDatabase()
db.performances.loadDatabase()
db.officials.loadDatabase()
///////

const osis_server = net.createServer((socket)=>{
    socket.on('connect', function(){
        console.log('osis connected')
        let msg = {connection: 'true'}
        socket.write(JSON.stringify(msg))
    })
    socket.on('data', function(data){
        d = JSON.parse(data)
        globalSetData(d)
    })
})
osis_server.listen(9090, '127.0.0.1')
    
function setValue(db, value){
    /*
        строка db.update({id: docs[0].id}, docs[0]) (worked version)
    */
   db.find(value, function(err, docs){
        if(!err){
            if(docs.length == 0){
                console.log('insert new value')
                db.insert(value)
            }else if(docs.length === 1){
                console.log(docs)
                db.update({_id: docs[0]._id}, docs[0])
            }
        }
   })
}
    
function checkValue(db, row){
    row.forEach(function(item){
        setValue(db, item)
    })
}
    
function globalSetData(data){
    switch(data.type){
        case 'events':
            checkValue(db.events, data.row)
            break
        case 'categories':
            checkValue(db.categories, data.row)
            break
        case 'segments':
            checkValue(db.segments, data.row)
            break
        case 'participants':
            checkValue(db.participants, data.row)
            break
        case 'performances':
            checkValue(db.performances, data.row)
            break
        case 'officials':
            checkValue(db.events, data.row)
            break
        default:
            break
    }
}