var express = require('express');
const fs = require('fs')
const sqlite = require('../sqliteAPI.js')
var router = express.Router();
//const redis = require('redis')
//const client = redis.createClient()
//////
/*
const Datastore = require('nedb')
const db = {}


//////
*/
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ICE_Results' });
});

router.get('/competitions/lukoyanovTraditional', function(req, res){
    //console.log('get')
    res.redirect('http://localhost:3000/competitions/html/index.htm')
})

router.get('/event/:ext_id', function(req, res){
    //console.log(req.params.ext_id)
    let id = req.params.ext_id
    let data = new Object()
    
    sqlite.selectEvent(id)
    .then((Event)=>{
        data.event = Event[0]
        return sqlite.selectEventCategories(id)
    })
    .then((cats)=>{
        data.categories = cats 
        let list = cats.map((obj)=>{
            return sqlite.selectSegments(obj.extdt, obj.id)
        })
        return Promise.all(list)       
    })
    .then((segments)=>{
        //console.log(segments)
        data.categories.map((obj, n)=>{
            obj.segments = segments[n]
        })
        res.render('event', data)
    })
    .catch((err)=>{
        console.log(err)
        res.render('404')
    })
})

router.get('/entries/:ev_id/:cat_id', function(req, res){
    //console.log(req.params)
    let result = new Object()
    
    sqlite.selectParticipantsFromCategory(req.params.ev_id, req.params.cat_id)
    .then((row)=>{
        result.participants = row
        return sqlite.selectCategory(req.params.ev_id, req.params.cat_id)
    })
    .then((row)=>{
        result.category = row[0]
        res.render('entries', result)
    }).catch((err)=>{
        console.log(err)
        res.render('404')
    })
})


                         
router.get('/starding_order/:ev_id/:cat_id/:seg_id', function(req, res){
    let result = new Object()
    sqlite.selectSegmentPerformances(req.params.ev_id, req.params.cat_id, req.params.seg_id)
    .then((row)=>{
        result.start_list = row
        return sqlite.selectEvent(req.params.ev_id)
    })
    .then((row)=>{
        result.event = row[0]
        return sqlite.selectSegment(req.params.ev_id, req.params.seg_id, req.params.cat_id)
    })
    .then((row)=>{
        result.segment = row[0]
        return sqlite.selectCategory(req.params.ev_id, req.params.cat_id)
    })
    .then((row)=>{
        result.category = row[0]
        console.log(result)
        res.render('starding_order', result)
    })
    .catch((err)=>{
        console.log(err)
        res.render('404')
    })
})

router.get('/officials/:extdt/:cat_id/:seg_id', function(req, res){
    let result = new Object()
    sqlite.selectSegmentOfficials(req.params.extdt, req.params.seg_id)
    .then((row)=>{
        result.officials = row
        return sqlite.selectCategory(req.params.extdt, req.params.cat_id)
    })
    .then((row)=>{
        result.category = row[0]
        return sqlite.selectSegment(req.params.extdt, req.params.seg_id, req.params.cat_id)
    })
    .then((row)=>{
        result.segment = row[0]
        res.render('officials', result)
    })
})

router.post('/createDir', function(req, res){
    console.log(`creating new dir`)
    let dirName = req.body.name
    fs.mkdir(`public/competitions/${dirName}`, function(){
        client.hmset('folders',[dirName, `/competitions/${dirName}/index.htm`])
        console.log(`dir ${dirName} created`)
        res.write(`dir ${dirName} created`)
        res.end()
    })
})

//return active folders
router.get('/ajax/getFolders', function(req, res, next){
    client.hgetall('folders', function(err, obj){
        if(!err){
            res.json(JSON.stringify(obj))
            res.end()
        }
    })
})

router.get('/dirAdmin', function(req, res, next){
    //let folders = new Array()
    client.hgetall('folders', function(err, obj){
        if(!err){
            console.log(obj)
            //folders.push(obj)
            res.render('folders', {'dirs': obj})
        }
    })
})

module.exports = router;
