var fs=require("fs");
module.exports=function(){


	function writeFile(name,cb){
		fs.writeFile(name,'this is test file',function(err,done){
			if(err){
				cb(err);
			}
			else{
				cb(null,done);
			}
			
		});

	}
	

	function readFile(name,cb){
		fs.readFile(name,'utf-8',function(err,done){
			if (err){

				cb(err);
			}
			else{
				cb(null,done);
			}

		});
	}


		
	function renameFile(oldName,newName,cb)
	{
		fs.rename(oldName,newName,function(err,done){
			if(err){
				cb(err);
			}
			else{
				cb(null,done);
			}
		});
	}
	return{
	  write:writeFile,
	 read:readFile,
	 rename:renameFile
}
}
