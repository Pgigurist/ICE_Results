////PARSER
const xml2js = require('xml2js')
const sql = require('../sqliteAPI.js')
const parser = new xml2js.Parser()
//
const fs = require('fs')

fs.readFile('./MK2019.xml', (err, data)=>{
    if(!err){
        startParse(data)
    }
})

//
//////variables

//////
function startParse(body){
    //let extdt = ''
    //let cat_id = ''
    parser.parseStringPromise(body).then((result)=>{
        let event = result.ISUCalcFS.Event[0]
        extdt = event.$.EVT_EXTDT
        let ev = {
            ID : event.$.EVT_ID,
            Name: event.$.EVT_NAME,
            ExtDt: event.$.EVT_EXTDT,
            Abbreviation: event.$.EVT_SNAME,
            Place: event.$.EVT_PLACE,
            Date_Start: event.$.EVT_BEGDAT,
            Date_End: event.$.EVT_ENDDAT,
        }
        
        sql.addEvent(ev)
        //console.dir(result.ISUCalcFS.Event[0])
        let categories = event.Categories_List[0].Category
        //console.dir(categories)
        for(let i=0; i<categories.length; i++){
            //console.dir(categories[i].$)
            let category = {         
                ID : categories[i].$.CAT_ID,
                Tec_Id : 0,
                Name: categories[i].$.CAT_NAME,
                Level : categories[i].$.CAT_LEVEL,
                Gender : categories[i].$.CAT_GENDER,
                Type : '',
                ExtDt : extdt,
                TypeName: '',
            }
            //console.dir(category)
            sql.addCategory(category)
            
            
            segments = categories[i].Segments_List[0].Segment
            for(let s = 0; s < segments.length; s++){
                //console.dir(segments[s])
                let seg = segments[s]
                
                
                let segment = {
                    ID : segments[s].$.SCP_ID,
                    Name : segments[s].$.SCP_NAME,
                    Abbreviation: segments[s].$.SCP_SNAM,
                    ExtDt : extdt,
                    cat_id : category.ID
                }
                //тут должен быть еще обработчик судей
                sql.addSegment(segment)
                
            
            //console.log(segments[s].Participants_List[0].Participant)
                
                participants = segments[s].Participants_List[0].Participant
                //console.log(participants[0].Person_Couple_Team)
                
                
                let pct = new Array()
                let prf = new Array()
                
                for(let p=0; p < participants.length; p++){
                    
                    let participant = participants[p].Person_Couple_Team[0].$
                    //console.log(participant)
                    
                    
                    
                    
                    let part = {
                        //'seg_id' : segment.ID,
                        'ID' : parseInt(participants[p].$.PAR_ID),
                        'Status' : participant.PCT_STAT,
                        'Type' : participant.PCT_TYPE,
                        'Full_Name': participant.PCT_PLNAME,
                        'Short_Name': participant.PCT_PSNAME,
                        'TV_Long_Name': participant.PCT_TLNAME,
                        'TV_Short_Name': participant.PCT_TSNAME,
                        'ScbName1': participant.PCT_S1NAME,
                        'ScbName2': participant.PCT_S2NAME,
                        'ScbName3': participant.PCT_S3NAME,
                        'ScbName4': participant.PCT_S4NAME,
                        'Gender': participant.PCT_GENDER,
                        'Nation': participant.PCT_NAT,
                        'Club': 'null',
                        'Music': 'null',
                        'Coach': 'null',
                        'RegNum': 0,
                        'TeamName': 'null',
                        'TeamNation': 'null',
                        'Status_Changed': 0,
                        'cat_id': parseInt(participants[p].$.CAT_ID),
                        ExtDt: parseInt(event.$.EVT_EXTDT)
                    }
                    //console.log(part)
                    //sql.addParticipant(part)
                    pct.push(part)
                }
                //sql.insertParticipants(pct)
                
                //Performance_List
                
                if(segments[s].Performance_List != undefined){
                  
                    let pl = segments[s].Performance_List[0].Performance
                    //console.log(segments[i])


                    
                    //let res = 

                    for(let r = 0; r < pl.length; r++){
                        
                        let string = pl[r].$.PRF_POINTS
                        let point = string.length-2
                        let bp = pl[r].$.PRF_POINTS.slice(0, point)
                        let ap = pl[r].$.PRF_POINTS.slice(point, pl[r].$.PRF_POINTS.length)
                        //console.log(pl[r])
                        let performance ={
                            ID: pl[r].$.PRF_ID,
                            Start_Number : pl[r].$.PRF_STNUM,
                            StartGroup_Number: pl[r].$.PRF_STGNUM,
                            PELmScore: null,
                            Personal_Best: null,
                            Personal_Best_Tot: null,
                            Status: pl[r].$.PRF_STAT,
                            Season_Best: null,
                            Seson_Best_Tot: null,
                            Season_Best_Rank: null,
                            Season_Best_Index: null,
                            StartTime: null,
                            Prf_ID: pl[r].$.PRF_ID,
                            Rank: pl[r].$.PRF_PLACE,
                            points: `${bp}.${ap}`,
                            seg_id: segment.ID,
                            cat_id: category.ID,
                            extdt: extdt
                        }
                        prf.push(performance)
                    }
                    console.log(prf)
                    sql.insertPerformances(prf)
                }
            }
        }
    }).catch((err)=>{
        console.log(err)
    })
}
