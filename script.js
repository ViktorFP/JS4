window.FuncKit=(function(){
	var arrayPararrahps=[];
	
	function docName(){
		var name="Document Name";
		var arrayElements=document.getElementsByClassName("doc_name");	
		for(var i=0;i<arrayElements.length;i++){
			arrayElements[i].innerHTML = name;
		}
	}
	
	function hide(field){
		var currentClass=field.getAttribute("class");
		var current=arrayPararrahps[currentClass];
		if(current){
			alert(current);
			}else{
			var arrayElements=document.getElementsByClassName(currentClass);
			for(var i=0;i<arrayElements.length;i++){
				changer(arrayElements[i]);
			} 
		}
		
	}
	
	function changer(element){
		var tag=element.tagName;
		switch(tag){
			case 'INPUT':
			element.setAttribute('value', '	\u21D3');
			break;
			case 'DIV':
			element.innerHTML ='NewText';
			element.setAttribute("style", "margin:5px 0; border:solid 2px #B1C7D3; padding:5px; height:100%"); 			
			break;
		}
	}
	
	return {setDocName:docName,
	hideText:hide};
})();