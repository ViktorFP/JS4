window.FuncKit=(function(){
	var arrayParagrahps=[];
	var dataObject;
	
	function data(){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://localhost:3000/docs.svc/getDocumentsList');
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if(xhr.status == 200) {
					dataObject=JSON.parse(xhr.responseText);
					document.getElementsByClassName("doc_name")[0].innerHTML=dataObject[0].name;
					var body='';
					for(var i=0;dataObject[i];i++){
						var obj=dataObject[i];
						console.log(obj);
						body+='<div id="'+obj.id+'" class=doc_name">'+obj.name+'</div><ul>';
						
						var fragments=obj.fragments;
						for(var j=0;j<fragments.length;j++){
							var name=fragments[j].name;
							body+='<li id="'+i+'_'+j+'"><a href=#'+name+'">'+name+'</a></li> ';
						}
						body+='</ul>'; 
					}
					var contentList=document.getElementsByClassName('content_list');
					contentList[0].innerHTML =body;
					/* 	var name="Document Name";
					docName(name); */
				}
			}
		};
		xhr.send(null);
	}
	
	/* function docName(name){
		var arrayElements=document.getElementsByClassName("doc_name");	
		for(var i=0;i<arrayElements.length;i++){
		arrayElements[i].innerHTML = name;
		}
	} */
	
	function hide(field){
		var currentClass=field.getAttribute("class");
		var current=arrayParagrahps[currentClass];
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
	
	return {
		getData:data,
	hideText:hide};
})();