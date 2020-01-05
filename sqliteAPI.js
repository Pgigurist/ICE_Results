const sqlite3   = require('sqlite3').verbose()
const db        = new sqlite3.Database('./../../ICE_DBase/ResultsDB')
//const db        = new sqlite3.Database('../../../ICE_DBase/ResultsDB')


////////
//EVENT
function insertEvent(event){
    db.serialize(function(){
        event.ID = parseInt(event.ID)
        event.ExtDt = parseInt(event.ExtDt)
        console.log(event)
        let stms = db.prepare('INSERT INTO events VALUES (?,?,?,?,?,?,?,?,?)')
        stms.run(Object.values(event))
        stms.finalize()
    })
}

function updateEvent(event){
    db.serialize(function(){
        event.ID = parseInt(event.ID)
        event.ExtDt = parseInt(event.ExtDt)
        let stmt = db.prepare(`UPDATE events SET name=?, abbreviation=?, type=?, cmptype=?, date_start=?, date_end=?, place=? WHERE extdt=${event.ExtDt} AND id=${event.ID}`)
        stmt.run([event.Name, event.Abbreviation, event.Type, event.CmpType, event.Date_Start, event.Date_End, event.Place])
        stmt.finalize()
    })
}

function selectEvent(extdt){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM events WHERE extdt=${parseInt(extdt)}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}



function addEvent(event){
    selectEvent(event.ExtDt, event.ID)
    .then(function(row){
        if(row.length != 0){
            console.log('already exist')
            updateEvent(event)
        }else{    
            insertEvent(event)
        }
    }).catch((err)=>{
        console.log(err)
    })
}

///TESTS
//selectEvent('1')
//updateEvent(tevent)
//addEvent(tevent)


exports.addEvent = addEvent
exports.selectEvent = selectEvent
///////////////////
//CATEGORY

let tcategory = {"id":"1","tec_id":"1","name":"Men","level":"SEN","gender":"M","type":"SGL","extdt":"1","typename":"Men"}

function insertCategory(category){
    db.serialize(function(){
        category.ID = parseInt(category.ID)
        category.Tec_Id = parseInt(category.Tec_Id)
        category.ExtDt = parseInt(category.ExtDt)
        //console.log(category)
        
        let stms = db.prepare('INSERT INTO categories VALUES (?,?,?,?,?,?,?,?,?)')
        //stms.run(Object.values(category))
        stms.run([category.ID, category.Tec_Id, category.Name, category.Level, category.Gender, category.Type, category.ExtDt, category.TypeName])
        stms.finalize()
    })
}

function updateCategory(category){
    db.serialize(function(){
        category.ID = parseInt(category.ID)
        category.Tec_Id = parseInt(category.Tec_Id)
        category.ExtDt = parseInt(category.ExtDt)
        let stmt = db.prepare(`UPDATE categories SET tec_id=?, name=?, level=?, gender=?, type=?, typename=? WHERE extdt=${category.ExtDt} AND id=${category.ID}`)
        stmt.run([category.Tec_Id ,category.Name, category.Level, category.Gender, category.Type, category.TypeName])
        stmt.finalize()
    })
}

function selectCategory(extdt, id){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM categories WHERE extdt=${extdt} AND id=${id}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}

function selectEventCategories(extdt){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM categories WHERE extdt=${extdt}`, (err, row)=>{
                if(!err){
                    console.log('sec')
                    //console.log(row)
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}

function addCategory(category){
    selectCategory(parseInt(category.ExtDt), parseInt(category.ID))
    .then((row)=>{
        //console.log(row)
        if(row.length != 0){
            console.log('already exist')
            updateCategory(category)
        }else{
            console.log('insert category')
            insertCategory(category)
        }
    }).catch((err)=>{
        console.log(err)
    })
}


/////TESTS
//addCategory(tcategory)
//updateCategory(tcategory)
//selectCategory(1, 1)
exports.selectEventCategories = selectEventCategories
exports.addCategory = addCategory
exports.selectCategory = selectCategory
/////////////////////
let tsegment = {id:"6", name : "Произвольная программа test", abbreviation : "FS", extdt:"1", cat_id:'1'}


function insertSegment(segment){
    console.log('insert seg')
    segment.ID = parseInt(segment.ID)
    segment.ExtDt = parseInt(segment.ExtDt)
    segment.cat_id = parseInt(segment.cat_id)
    db.serialize(function(){
        //console.log(segment)
        let stms = db.prepare('INSERT INTO segments VALUES (?,?,?,?,?,?)')
        stms.run([segment.ID, segment.Name, segment.Abbreviation, segment.ExtDt, segment.cat_id])
        stms.finalize()
    })
}

function updateSegment(segment){
    db.serialize(function(){
        
        segment.ID = parseInt(segment.ID)
        segment.Tec_Id = parseInt(segment.Tec_Id)
        segment.ExtDt = parseInt(segment.ExtDt)
        let stmt = db.prepare(`UPDATE segments SET name=?, abbreviation=? WHERE extdt=${segment.ExtDt} AND id=${segment.ID}`)
        stmt.run([segment.Name, segment.Abbreviation])
        stmt.finalize()
    })
}

function selectSegment(extdt, id, cat_id){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM segments WHERE extdt=${parseInt(extdt)} AND id=${parseInt(id)} AND cat_id=${parseInt(cat_id)}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}


function selectSegments(extdt, cat_id){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM segments WHERE extdt=${parseInt(extdt)} AND cat_id=${parseInt(cat_id)}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}

function addSegment(segment){
    selectSegment(segment.ExtDt, segment.ID, segment.cat_id)
    .then((row)=>{
        if(row.length != 0){
            console.log('already exist')
            updateSegment(segment)
        }else{
            insertSegment(segment)
        }
    }).catch((err)=>{
        console.log(err)
    })
}

function selectSegmentsFromEvent(extdt){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM segments WHERE extdt=${parseInt(extdt)}`, (err, row)=>{
                if(!err){
                    resolve()
                    //console.log(row)
                }
                reject()
            })
        })
    })
}
////TESTS
//addSegment(tsegment)
//updateSegment(tsegment)
//selectSegment(1,6)
//selectSegmentsFromCategory(1,1)
exports.selectSegments = selectSegments
exports.addSegment = addSegment
exports.selectSegment = selectSegment
exports.selectSegmentsFromEvent = selectSegmentsFromEvent
////////////


//PARTICIPANTS
function insertParticipants(data){
 
    db.serialize(function(){
        //console.log(data)
        let stms = db.prepare(`
    INSERT INTO participants
    (id, status, type, full_name, short_name, tv_long_name, tv_short_name, scbname1, scbname2, scbname3, scbname4, gender, nation, club, music, coach, regnum, teamname, teamnation, status_changed, cat_id, extdt)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        console.log(1)
        for(let i = 0; i<data.length; i++){
            console.log('1.'+i)
            console.log(data[i])
            stms.run([data[i].ID, data[i].Status, data[i].Type, data[i].Full_Name, data[i].Short_Name, data[i].TV_Long_Name, data[i].TV_Short_Name, data[i].ScbName1, data[i].ScbName2, data[i].ScbName3, data[i].ScbName4, data[i].Gender, data[i].Nation, data[i].Club, data[i].Music, data[i].Coach, data[i].RegNum, data[i].TeamName, data[i].TeamNation, data[i].Status_Changed, data[i].cat_id, data[i].ExtDt])
        }
        stms.finalize()
    })
}

exports.insertParticipants = insertParticipants

function updateParticipant(data){
    db.serialize(function(){
        /*
        segment.ID = parseInt(segment.ID)
        segment.Tec_Id = parseInt(segment.Tec_Id)
        segment.ExtDt = parseInt(segment.ExtDt)
        */
        //console.log(data)
        let stmt = db.prepare(`UPDATE participants SET status=?, type=?,  full_name=?, short_name=?, tv_long_name=?, tv_short_name=?, scbname1=?, scbname2=?, scbname3=?, scbname4=?, gender=?, nation=?, coach=?, regnum=?, teamname=?, teamnation=?, status_changed=? WHERE extdt=${parseInt(data.ExtDt)} AND id=${parseInt(data.ID)}`)
        stmt.run([data.Status, data.Type, data.Full_Name, data.Short_Name, data.TV_Long_Name, data.TV_Short_Name, data.ScbName1, data.ScbName2, data.ScbName3, data.ScbName4, data.Gender, data.Nation, data.Club, data.Music, data.Coach, data.RegNum, data.TeamName, data.TeamNation, data.Status_Changed, data.cat_id])
        stmt.finalize()
    })
}

function selectParticipant(extdt, id, cat_id){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM participants WHERE extdt=${parseInt(extdt)} AND id=${parseInt(id)} AND cat_id=${parseInt(cat_id)}`, (err, row)=>{
                if(!err){
                    //console.log(row)
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}
exports.selectParticipant = selectParticipant

function addParticipant(data){
    console.log('add part')
    console.log(data)
    selectParticipant(data.ExtDt, data.ID, data.cat_id)
    .then((row)=>{
        if(row.length != 0){
            console.log('already exist')
            //console.dir(data)
            updateParticipant(data)
        }else{
            insertParticipant(data)
        }
    }).catch((err)=>{
        console.log(err)
    })
}
exports.addParticipant = addParticipant

function selectParticipantsFromCategory(extdt, cat_id){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM participants WHERE extdt=${parseInt(extdt)} AND cat_id=${parseInt(cat_id)}`, (err, row)=>{
                if(!err){
                    //console.log(row)
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}
exports.selectParticipantsFromCategory = selectParticipantsFromCategory

///////
//OFFICIALS
function insertOfficial(data){
    return new Promise((resolve, reject)=>{
        //segment.ID = parseInt(data.ID)
        //segment.ExtDt = parseInt(data.ExtDt)
        //segment.cat_id = parseInt(segment.cat_id)
        db.serialize(function(){
            let stms = db.prepare('INSERT INTO officials VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
            stms.run([data.Index, data.ID, data.Full_Name, data.Title, data.Family_Name, data.Given_Name, data.Initial, data.ScbName1, data.ScbName4, data.Gender, data.Nation, data.Club, data.Function, data.extdt, data.seg_id])
            stms.finalize()
            resolve()
        })
    })
}

exports.insertOfficial = insertOfficial

function updateOfficial(data){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            let stmt = db.prepare(`UPDATE officials SET index=?, full_name=?, title=?, family_name=?, given_name=?, initial=?, scbname1=?, scbname4=?, gender=?, nation=?, club=?, function=? WHERE extdt=${data.ExtDt} AND id=${data.ID} AND seg.id=${data.seg.id}`)
            stmt.run([data.Index, data.Full_Name, data.Title, data.Family_Name, data.Given_Name, data.Initial, data.ScbName1, data.ScbName4, data.Gender, data.Nation, data.Club, data.Function])
            stmt.finalize()
            resolve()
        })
    })
}
exports.updateOfficial = updateOfficial

function selectOfficial(extdt, id, seg_id){
    
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            console.log('official')
            db.all(`SELECT * FROM officials WHERE extdt=${extdt} AND id=${id} AND seg_id=${seg_id}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}

function addOfficial(data){
    //console.log(data)
    selectOfficial(data.extdt, data.ID, data.seg_id)
    .then((row)=>{
        if(row.length != 0){
            console.log('official already exist')
            updateOfficial(data)
        }else{
            insertOfficial(data)
        }
    }).catch((err)=>{
        console.log(err)
    })
}
exports.addOfficial = addOfficial

function selectSegmentOfficials(extdt, seg_id){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM officials WHERE extdt=${extdt} AND seg_id=${seg_id}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}
exports.selectSegmentOfficials = selectSegmentOfficials
////////
//PERFORMANCES


////////
//PARTICIPANTS
function insertParticipant(data){
 
    db.serialize(function(){
        //console.log(data)
        let stms = db.prepare('INSERT INTO participants VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
        stms.run([data.ID, data.Status, data.Type, data.Full_Name, data.Short_Name, data.TV_Long_Name, data.TV_Short_Name, data.ScbName1, data.ScbName2, data.ScbName3, data.ScbName4, data.Gender, data.Nation, data.Club, data.Music, data.Coach, data.RegNum, data.TeamName, data.TeamNation, data.Status_Changed, data.cat_id, data.extdt])
        stms.finalize()
    })
}

function updateParticipant(data){
    db.serialize(function(){
        /*
        segment.ID = parseInt(segment.ID)
        segment.Tec_Id = parseInt(segment.Tec_Id)
        segment.ExtDt = parseInt(segment.ExtDt)
        */
        let stmt = db.prepare(`UPDATE participants SET status=?, type=?,  full_name=?, short_name=?, tv_long_name=?, tv_short_name=?, scbname1=?, scbname2=?, scbname3=?, scbname4=?, gender=?, nation=?, club=?, music=?, coach=?, regnum=?, teamname=?, teamnation=?, status_changed=?, cat_id=? WHERE extdt=${data.extdt} AND id=${data.ID}`)
        stmt.run([data.Status, data.Type, data.Full_Name, data.Short_Name, data.TV_Long_Name, data.TV_Short_Name, data.ScbName1, data.ScbName2, data.ScbName3, data.ScbName4, data.Gender, data.Nation, data.Club, data.Music, data.Coach, data.RegNum, data.TeamName, data.TeamNation, data.Status_Changed, data.cat_id])
        stmt.finalize()
    })
}

function selectParticipant(extdt, id, cat_id){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM participants WHERE extdt=${parseInt(extdt)} AND id=${parseInt(id)} AND cat_id=${parseInt(cat_id)}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}
exports.selectParticipant = selectParticipant

function addParticipant(data){
    selectParticipant(data.extdt, data.ID, data.cat_id)
    .then((row)=>{
        if(row.length != 0){
            console.log('participant already exist')
            updateParticipant(data)
        }else{
            insertParticipant(data)
        }
    }).catch((err)=>{
        console.log(err)
    })
}
exports.addParticipant = addParticipant

function selectParticipantsFromCategory(extdt, cat_id){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM participants WHERE extdt=${parseInt(extdt)} AND cat_id=${parseInt(cat_id)}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}
exports.selectParticipantsFromCategory = selectParticipantsFromCategory


///////////
//PREFORMANCE

function insertPerformance(data){
    db.serialize(function(){
        console.log('insert perf')
        let stms = db.prepare('INSERT INTO performances VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
        stms.run([data.ID, data.Start_Number, data.Start_Group_Number, data.PElmScore, data.Personal_Best, data.Personal_Best_Tot, data.Status, data.Season_Best, data.Season_Best_Tot, data.Season_Best_Rank, data.Season_Best_Index, data.StartTime, data.Prf_ID, data.seg_id, data.cat_id, data.extdt])
        stms.finalize()
    })
}

function insertPerformances(data){
    db.serialize(function(){
        //console.log('insert perf')
        let stms = db.prepare(`
                INSERT INTO performances 
                (id, start_number, start_group_number, pelmscore, personal_best, personal_best_tot, status, season_best, season_best_tot, season_best_rank, season_best_index, starttime, prf_id, seg_id, cat_id, extdt, rank, points)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        for(let i=0; i < data.length; i++){
            stms.run([data[i].ID, data[i].Start_Number, data[i].Start_Group_Number, data[i].PElmScore, data[i].Personal_Best, data[i].Personal_Best_Tot, data[i].Status, data[i].Season_Best, data[i].Season_Best_Tot, data[i].Season_Best_Rank, data[i].Season_Best_Index, data[i].StartTime, data[i].Prf_ID, data[i].seg_id, data[i].cat_id, data[i].extdt, data[i].Rank, data[i].points])
        }
        //stms.run([data.ID, data.Start_Number, data.Start_Group_Number, data.PElmScore, data.Personal_Best, data.Personal_Best_Tot, data.Status, data.Season_Best, data.Season_Best_Tot, data.Season_Best_Rank, data.Season_Best_Index, data.StartTime, data.Prf_ID, data.seg_id, data.cat_id, data.extdt])
        stms.finalize()
    })
}

exports.insertPerformances = insertPerformances

function updatePerformance(data){
    db.serialize(function(){
        
        let stmt = db.prepare(`UPDATE performances SET status=?, rank=?, points=? WHERE extdt=${data.extdt} AND id=${data.ID} AND seg_id=${data.seg_id} AND cat_id=${data.cat_id}`)
        console.log('update perf')
        console.log(data)
        stmt.run([data.Status, data.Rank, data.Points])
        stmt.finalize()
    })
}
exports.updatePerformance = updatePerformance

function selectPerformance(extdt, cat_id, seg_id, id){
    return new Promise((resolve, reject)=>{
        console.log('select perf')
        db.serialize(function(){
            db.all(`SELECT * FROM performances WHERE extdt=${extdt} AND id=${id} AND seg_id=${seg_id} AND cat_id=${cat_id}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject()
            })
        })
    })
}

exports.selectPerformance = selectPerformance

function addPerformance(data){
    //console.log('add perf')
    selectPerformance(data.extdt, data.cat_id, data.seg_id, data.ID)
    .then(function(row){
        if(row.length != 0){
            console.log('performance already exist')
            updatePerformance(data)
        }else{    
            insertPerformance(data)
        }
    }).catch((err)=>{
        console.log(err)
    })
}
exports.addPerformance = addPerformance

function selectSegmentPerformances(extdt, cat_id, seg_id){
    return new Promise((resolve, reject)=>{
        db.all(`
                SELECT performances.points, performances.rank, participants.full_name, performances.start_number, participants.nation FROM performances, participants
                WHERE 
                    performances.id = participants.id
                    AND performances.extdt=${extdt}
                    AND participants.extdt=${extdt}
                    AND performances.seg_id=${seg_id}
                    AND participants.cat_id=${cat_id}
                    AND performances.cat_id=${cat_id}
                    AND performances.prf_id IS NOT NULL
                ORDER BY performances.rank
            `, (err, row)=>{
            if(!err){
                resolve(row)
            }
            reject(err)
        })
    })
}
exports.selectSegmentPerformances = selectSegmentPerformances