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
						//create block for document name
						var obj=dataObject[i];
						console.log(obj);/////////////////////
						body+='<div id="'+obj.id+'" class=doc_name">'+(i+1)+' '+obj.name+'</div><ul>';
						//create fragments list
						var fragments=obj.fragments;
						for(var j=0;j<fragments.length;j++){
							var id=i+'_'+j;
							body+='<li id="'+id+'"><a href="#'+id+'a">'+fragments[j].name+'</a></li> ';							
						}
						body+='</ul>'; 
						//create context for first
						if(i===0){
							var fragmentsBlock='';
							for(var k=0;k<fragments.length;k++){							
								var idF=i+'_'+k;
								fragmentsBlock+='<div id="'+idF+'a" class="paragraph"><span class="paragraphName">'+
								fragments[k].name+'</span><span class="hide"><input class="'+idF+
								'" type="button" value="&#8657;" onclick="FuncKit.hideText(this)"></span></div><div class="'+idF+'"></div>';
							}
							document.getElementsByClassName("content_view")[0].innerHTML=fragmentsBlock;							
						}
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
			element.innerHTML ='NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText NewText ';
			element.setAttribute("style", "margin:5px 0; border:solid 2px #B1C7D3; padding:5px; height:100%"); 			
			break;
		}
	}
	
	return {
		getData:data,
	hideText:hide};
})();