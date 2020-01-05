const sqlite3 = require('sqlite3').verbose()
/*
const db = new sqlite3.Datbase('/Users/Alex/Documents/osis.sqlite3')
///////
const db_name = 'test_osis'
///////
db.serialize(function(){
	db.run(`CREATE TABLE test_db ${db_name}`)
	let stmt = db.prepare(`INSERT INTO ${db_name} VALUES(?)`)
	for(let i = 0; i < 10; i++){
		stmt.run(`test ${i}`)
	}
	stmt.finalize()

	db.each(`SELECT rowid AS id, info FROM ${db_name}`, function(err, row){
		console.log(`${row.id} : ${row.info}`)
	})
})
*/

const db = new sqlite3.Database('/Users/Alex/Documents/osis.sqlite3', sqlite3.OPEN_READWRITE, (err) =>{
    if(err){
        return console.error(err.message);
    }else{
    console.log('db has ready');
    }
});


function addEvent(data){
/*
    need: ext_id (external id), Name, Abbrwviation, Type, CmpType, ExtDt 
*/
    db.serialize(function(){
        db.run('INSERT INDO events VALUES (?)', data, function(err, result){
            if(!err){
                console.log(`add new event ${data.ext_id}`)
            }else{
                console.log(` can\`t insert event ${data.ext_id}`)
            }
        })
    })
    
    //db.close();
}
exports.addEvent = addEvent;



db.close()
