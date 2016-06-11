window.FuncKit=(function(){
	var xhr = new XMLHttpRequest();
	var url='http://localhost:3000/docs.svc';
	var arrayParagrahps=[];
	var dataObject;
	var emptyTitle='(No name)';
	var fontSizeFragment=16;
	
	function data(){
		xhr.open('GET', url+'/getDocumentsList');
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if(xhr.status == 200) {
					dataObject=JSON.parse(xhr.responseText);
					var body='';
					for(var i=0;dataObject[i];i++){
						//create block for document name
						var obj=dataObject[i];
						body+='<div id="'+obj.id+'" class=doc_name">'+(i+1)+' '+
						obj.name+'</div><ul onclick="FuncKit.getContext('+obj.id+')">';
						//create fragments list
						var fragments=obj.fragments;
						for(var j=0;j<fragments.length;j++){
							var id=i+'_'+j;							
							body+='<li id="'+id+'"><a href="#'+id+'a">'+
							getTitle(fragments[j].name)+'</a></li> ';							
						}
						body+='</ul>'; 						
					}
					var contentList=document.getElementsByClassName('content_list');
					contentList[0].innerHTML =body;
				}
			}
		};
		xhr.send();
	}
	
	function getTitle(title){
		var ref='</a>';
		var repl='replace';
		var protocol='http://';
		if(title.includes(ref)){			
			if(title.includes(repl) && !title.includes(protocol)){
				var idx=title.indexOf(repl)+9;
				var end=title.slice(idx);
				title=title.substring(0,idx)+protocol+end;
			}		
			title=title.substring(0,title.length-4);
			title+='reference'+ref;
		}
		return title===''?title=emptyTitle:title;
	}
	
	function animate(element){
		var opacity=element.style.opacity;
		var h,id;
		if(opacity==='1'){
			h=100;
			id = setInterval(frame, 1);
			function frame() {
				if (h === 0) {
					clearInterval(id);
					element.innerHTML ='';
					element.removeAttribute('style');
					} else {
					h-=2; 
					element.style.fontSize=fontSizeFragment*h/100+'px';
					element.style.opacity = h*0.01; 			
				}
			}
			}else{
			h=0;
			id = setInterval(frame, 1);
			function frame() {
				if (h === 100) {
					clearInterval(id);
					} else {
					h+=2; 
					element.style.fontSize=fontSizeFragment*h/100+'px';
					element.style.opacity = h*0.01; 
				}
			}
		} 
	}
	
	function createContext(idDoc){
		document.getElementsByClassName('doc_name')[0].innerHTML=dataObject[idDoc].name;					
		//create context					
		var fragments=dataObject[idDoc].fragments;
		var fragmentsBlock='';
		for(var k=0;k<fragments.length;k++){							
			var idF=idDoc+'_'+k;			
			fragmentsBlock+='<div id="'+idF+'a" class="paragraph"><span class="paragraphName">'+
			getTitle(fragments[k].name)+'</span><span class="hide"><input class="'+idF+
			'" type="button" value="&#8657;" onclick="FuncKit.hideText(this)"></span></div><div class="'+idF+'"></div>';
		}
		document.getElementsByClassName('content_view')[0].innerHTML=fragmentsBlock;
	}
	
	function hide(field){
		var currentClass=field.getAttribute('class');
		var current=arrayParagrahps[currentClass];
		var objData;
		if(current){
			changeView(currentClass,current);
			}else{
			var ids=currentClass.split(/_/);
			xhr.open('GET', url+'/getDocumentFragment?docId='+ids[0]+'&fragmentId='+ids[1]);
			xhr.onreadystatechange = function() {				
				if (xhr.readyState == 4) {
					if(xhr.status == 200) {
						objData={flag:false,data:JSON.parse(xhr.responseText)};
						arrayParagrahps[currentClass]=objData; 
						changeView(currentClass,objData);
					}
				}
			};
			xhr.send();
		}		
	}
	
	function changeView(currentClass,objData){
		var arrayElements=document.getElementsByClassName(currentClass);
		for(var i=0;i<arrayElements.length;i++){
			changer(arrayElements[i],objData);
		}  
		objData.flag=!objData.flag;
	}
	
	function changer(element,obj){
		var tag=element.tagName;
		var flag=obj.flag;
		switch(tag){
			case 'INPUT':
			if(!flag){
			element.setAttribute('value', '\u21D3');}else{element.setAttribute('value', '\u21D1');}
			break;
			case 'DIV':
			if(flag){								
				animate(element);
				}else{
				animate(element);				
				element.innerHTML =obj.data.content;
				element.setAttribute('style', 'font-size:'+fontSizeFragment+
				'px; margin:5px 0; border:solid 2px #B1C7D3; padding:5px; height:100%; opacity:1');
				} 			
			break;
		}
	}
	
	return {
		getData:data,
		hideText:hide,
		getContext:createContext
	};
})();