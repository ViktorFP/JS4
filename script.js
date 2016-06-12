window.FuncKit=(function(){
	var xhr = new XMLHttpRequest();
	var url='http://localhost:3000/docs.svc';
	var arrayParagrahps=[];//[id:{data:{content:'',name:''},flag:false/true}]
	var dataObject;//dataObject{id:{fragments:[idx:{id:0,name:''}],id:0,name:''}}
	//document{name:'',fragments:[idx:{content:'',name:''}]}
	var tempDataObject=[];//tempDataObject[idx:{docId:docId,name:paragraphName,text:paragraphData}]
	var tempClassPrefix='t_';
	var dataCount=-1;
	var emptyTitle='(No name)';
	var fontSizeFragment=16;
	var nameDoc='doc_name';
	var newDataClass='data';
	var currentDocId=-1;
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
					currentDocId=0;
					setCurrentDocTitle(currentDocId);
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
			case 'newPar':
			scrWidth=400;
			scrHeight=300;			
			x -= scrWidth/2;
			y -= scrHeight/2;			
			dHTML='<!DOCTYPE html><html><head>'+
			'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">'+
			'<title>Paragraph title</title></head><body><div>New paragraph<div>'+
			'<div><input class="'+newDataClass+'" type="text"></div>'+
			'<div>Paragraph text<div>'+
			'<textarea style="height:'+(scrHeight-140)+'px; width:'+(scrWidth-20)+'px"'+
			' class="'+newDataClass+'"></textarea></div><div><input type="button" value="Create"'+
			'onclick="window.opener.FuncKit.newParagraph(window)">'+
			'</div></div></body></html>';
			break;
			case 'save':			
			create=false;
			saveDocument();
			//refresh view
			data();
			break;
			default:create=false;
		}
		if(create){
			dWindow=window.open('', '', 'width='+scrWidth+',height='+scrHeight+',left='+x+',top='+y);
			dWindow.document.write(dHTML);		
		}
	}
	
	function saveDocument(){
		//arrayParagrahps[id:{data:{content:'',name:''},flag:false/true}] => id='idDoc_idFr'
		//currentDocId
		//dataObject{id:{fragments:[idx:{id:0,name:''}],id:0,name:''}}			
		//document{name:'',fragments:[idx:{content:'',name:''}]}
		var doc=dataObject[currentDocId];
		var size=[doc.fragments.length];
		var tempDoc={name:doc.name,fragments:[]};
		for(var i=0;i<size;i++){
			var className=currentDocId+'_'+i;
			if(!arrayParagrahps[className]){
				xhr.open('GET', url+'/getDocumentFragment?docId='+currentDocId+'&fragmentId='+i,false);
				xhr.onreadystatechange = function() {				
					if (xhr.readyState == 4) {
						if(xhr.status == 200) {
							var newFragment=JSON.parse(xhr.responseText);
							var objData={flag:false,data:newFragment};
							arrayParagrahps[className]=objData;					
						}
					}
				};
				xhr.send(); 				
			}
			var data=arrayParagrahps[className].data;
			tempDoc.fragments[i]={content:data.content,name:data.name};
		}
		//add new
		//tempDataObject[idx:{docId:docId,name:paragraphName,text:paragraphData}]
		for(var j=0;j<tempDataObject.length;j++){
			var tempObj=tempDataObject[j];
			if(tempObj.docId===currentDocId){
				tempDoc.fragments.push({name:tempObj.name,content:tempObj.text});
			}				
		}
		//save all
		if(size!=tempDoc.fragments.length){
			xhr.open('POST', url+'/saveDocument');
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');					
			xhr.send('document='+JSON.stringify(tempDoc));  
		}
	}
	
	function createParagraph(win){
		var fields=win.document.getElementsByClassName(newDataClass);
		var paragraphName=fields[0].value;
		var paragraphData=fields[1].value;
		win.close();		
		arrayParagrahps[tempClassPrefix+currentDocId+'_'+tempDataObject.length]=
		{data:{content:paragraphData,name:paragraphName},flag:false};
		tempDataObject.push({docId:currentDocId,name:paragraphName,text:paragraphData});
		createContext(currentDocId);
	}
	
	function createDocument(win){
		var docTitle=win.document.getElementsByClassName(newDataClass)[0].value;
		win.close();
		dataObject[++dataCount]={fragments:[],id:dataCount,name:docTitle};
		var contentList=document.getElementsByClassName('content_list')[0];
		var dataList=contentList.innerHTML;
		dataList=addDocToList(dataList,dataObject[dataCount],dataCount);
		contentList.innerHTML =dataList;
		currentDocId=dataCount;
		setCurrentDocTitle(currentDocId);
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
	
	function setCurrentDocTitle(idDoc){
		document.getElementsByClassName('doc_name')[0].innerHTML=dataObject[idDoc].name;
	}
	
	function createContext(idDoc){
		currentDocId=idDoc;
		setCurrentDocTitle(idDoc);					
		//create context					
		var fragments=dataObject[idDoc].fragments;
		var fragmentsBlock='';
		for(var k=0;k<fragments.length;k++){							
			fragmentsBlock=addFragmentView(fragments[k].name,idDoc,k,fragmentsBlock);
		}
		fragmentsBlock=getTempFragmentsViev(idDoc,fragmentsBlock);
		document.getElementsByClassName('content_view')[0].innerHTML=fragmentsBlock;		
	}
	
	function addFragmentView(name,idDoc,idFragm,fragmentsBlock){
		var idF=idDoc+'_'+idFragm;			
		return fragmentsBlock+='<div id="'+idF+'a" class="paragraph"><span class="paragraphName">'+
		getTitle(name)+'</span><span class="hide"><input class="'+idF+
		'" type="button" value="&#8657;" onclick="FuncKit.hideText(this)"></span></div><div class="'+idF+'"></div>';
	}
	
	function getTempFragmentsViev(idDoc,fragmentsBlock){
		for(var k=0;k<tempDataObject.length;k++){							
			if(tempDataObject[k].docId===idDoc){
				fragmentsBlock=addFragmentView(tempDataObject[k].name,tempClassPrefix+idDoc,k,fragmentsBlock); 
			}
		}
		
		
		return fragmentsBlock;
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
		newDocument:createDocument,
		newParagraph:createParagraph
	};
})();		