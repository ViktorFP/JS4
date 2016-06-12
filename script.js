window.FuncKit=(function(){
	var xhr = new XMLHttpRequest();
	var url='http://localhost:3000/docs.svc';
	var arrayParagrahps=[];
	var dataObject;
	var dataCount=-1;
	var emptyTitle='(No name)';
	var fontSizeFragment=16;
	var nameDoc='doc_name';
	var newDataClass='data';
	//------------------------
	function data(){
		xhr.open('GET', url+'/getDocumentsList');
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if(xhr.status == 200) {
					dataObject=JSON.parse(xhr.responseText);
					var body='';
					for(var i=0;dataObject[i];i++){
						dataCount++;
						//create block for document name
						var obj=dataObject[i];
						body=addDocToList(body,obj,i);						
					}
					var contentList=document.getElementsByClassName('content_list');
					contentList[0].innerHTML =body;
					//--
					var headerButtons=document.getElementsByClassName('header');
					for(var k=0;k<headerButtons.length;k++){
						headerButtons[k].setAttribute('onclick',
						't=event.target||event.srcElement; FuncKit.displayDialog(t.id)');
					}
				}
			}
		};
		xhr.send();
	}
	
	function addDocToList(body,obj,pos){
		body+='<div id="'+obj.id+'" class='+nameDoc+'">'+(pos+1)+' '+
		obj.name+'</div><ul onclick="FuncKit.getContext('+obj.id+')">';
		//create fragments list
		var fragments=obj.fragments;
		for(var j=0;j<fragments.length;j++){
			var id=pos+'_'+j;							
			body+='<li id="'+id+'"><a href="#'+id+'a">'+
			getTitle(fragments[j].name)+'</a></li> ';							
		}
		body+='</ul>'; 
		return body;
	}
	
	function createDialog(idButton){
		var x = screen.width/2,y = screen.height/2,dWindow;
		var scrWidth, scrHeight,dHTML;
		var create=true;		
		
		switch(idButton){
			case 'newDoc':
			scrWidth=200;
			scrHeight=150;			
			x -= scrWidth/2;
			y -= scrHeight/2;			
			dHTML='<!DOCTYPE html><html><head>'+
			'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">'+
			'<title>New document</title></head><body><div>New document<div>'+
			'<input class="'+newDataClass+'" type="text"></div><div><input type="button" value="Create"'+
			'onclick="window.opener.FuncKit.newDocument(window)">'+
			'</div></div></body></html>';			
			break;
			
			default:create=false;
		}
		if(create){
			dWindow=window.open('', '', 'width='+scrWidth+',height='+scrHeight+',left='+x+',top='+y);
			dWindow.document.write(dHTML);		
		}
	}
	
	function createDocument(win){
		var docTitle=win.document.getElementsByClassName(newDataClass)[0].value;
		win.close();
		dataObject[++dataCount]={fragments:[],id:dataCount,name:docTitle};
		var contentList=document.getElementsByClassName('content_list')[0];
		var dataList=contentList.innerHTML;
		dataList=addDocToList(dataList,dataObject[dataCount],dataCount);
		contentList.innerHTML =dataList;
	}
	
	function getTitle(title){
		var ref='</a>';
		var repl='replace';
		var protocol='http://';
		if(title.indexOf(ref)!==-1){			
			if(title.indexOf(repl)!==-1 && title.indexOf(protocol)<0){
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
			id = setInterval(function() {
				if (h === 0) {
					clearInterval(id);
					element.innerHTML ='';
					element.removeAttribute('style');
					} else {
					h-=2; 
					element.style.fontSize=fontSizeFragment*h/100+'px';
					element.style.opacity = h*0.01; 			
				}
			}, 1);			
			}else{
			h=0;
			id = setInterval(function () {
				if (h === 100) {
					clearInterval(id);
					} else {
					h+=2; 
					element.style.fontSize=fontSizeFragment*h/100+'px';
					element.style.opacity = h*0.01; 
				}
			}, 1);			
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
		getContext:createContext,
		displayDialog:createDialog,
		newDocument:createDocument
	};
})();		