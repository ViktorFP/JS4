window.FuncKit=(function(){
	function docName(){
		var name="Document Name";
		var arrayElements=document.getElementsByClassName("doc_name");	
		for(var i=0;i<arrayElements.length;i++){
			arrayElements[i].innerHTML = name;
		}
	}
	return {setDocName:docName};
})();