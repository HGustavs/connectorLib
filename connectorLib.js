/*

  --------===============###################===============--------
                            ConnectorLib
  --------===============###################===============--------

	Connects randomly positioned boxes through html and css2 (straight lines) css3 (angled lines)
	
	Use:
			Class of one element is the id of other. If we wish to connect <div id="foo"> with another div we use <div class="foo">
			Class color (i.e. red or green at the moment) decides the color of the line
	
	Bugs:
			Vertical lines use half height (hh) - which means they are not centered
			Only fixed sizes work at the moment. This can be fixed by sending dom elements to makeConnector instead of coordinates
			Vertical straight-line boxes cross the target element at one end - this needs to be split into two boxes
	
			If there ever is a second version it will feature dynamic box sizes.
*/

//---------------------------------------------------------------------------------------------------------------
// makeBox
//
// Creates a floating box at a certain coordinate
//---------------------------------------------------------------------------------------------------------------

function makeBox(bid,stl,textt,x1,y1,x2,y2)
{
		var str="";
		str+="<div id='"+bid+"' style='pointer-events:none;position:absolute;left:"+x1+"px;top:"+y1+"px;width:"+(x2-x1)+"px;height:"+(y2-y1)+"px;border:1px dotted black;"+stl+"'>"+textt+"</div>";
		return str;
}

function makeBoxC(kind,widt,stl,color,x1,y1,x2,y2)
{
		var str="";
		var w=Math.round((x2-x1)*0.5);

		if(kind=="O"){
				str+="<div style='pointer-events:none;position:absolute;left:"+x1+"px;top:"+y1+"px;width:"+(x2-x1)+"px;height:"+(y2-y1)+"px;";
				str+="border-top:"+widt+" "+stl+" "+color+";border-bottom:"+widt+" "+stl+" "+color+";border-right:"+widt+" "+stl+" "+color+";'></div>";
		}else if(kind=="F"){
				str+="<div style='pointer-events:none;position:absolute;left:"+x1+"px;top:"+y1+"px;width:"+(w)+"px;height:"+(y2-y1)+"px;";
				str+="border-bottom:"+widt+" "+stl+" "+color+";border-right:"+widt+" "+stl+" "+color+";'></div>";
				str+="<div style='pointer-events:none;position:absolute;left:"+(x1+w)+"px;top:"+y1+"px;width:"+(w)+"px;height:"+(y2-y1)+"px;";
				str+="border-top:"+widt+" "+stl+" "+color+";'></div>";					
		}else{
				str+="<div style='pointer-events:none;position:absolute;left:"+x1+"px;top:"+y1+"px;width:"+(w)+"px;height:"+(y2-y1)+"px;";
				str+="border-top:"+widt+" "+stl+" "+color+";border-right:"+widt+" "+stl+" "+color+";'></div>";
				str+="<div style='pointer-events:none;position:absolute;left:"+(x1+w)+"px;top:"+y1+"px;width:"+(w)+"px;height:"+(y2-y1)+"px;";
				str+="border-bottom:"+widt+" "+stl+" "+color+";'></div>";										
		}
						
		return str;
}
			
//---------------------------------------------------------------------------------------------------------------
// makeLine
//
// Creates an angled line a certain coordinate
//---------------------------------------------------------------------------------------------------------------

function makeLine(p1x,p1y,p2x,p2y,widt,stl,color)
{
		a=p1x-p2x;
		b=p1y-p2y;
	
		var len=Math.sqrt((a*a)+(b*b));
		var ang=Math.atan2(b,a)+3.14;
	
		var str="";				
		str+="<div style='position:absolute;width:"+len+"px;height:1px;left:"+p1x+"px;top:"+p1y+"px;border-top:"+widt+" "+stl+" "+color+";transform-origin: 0% 0%;transform:rotate("+ang+"rad);'></div>"
									
		return str;
}
			
//---------------------------------------------------------------------------------------------------------------
// makeConnector
//
// Creates the cornered-line-connector
//---------------------------------------------------------------------------------------------------------------

function makeConnector(b1x1,b1y1,b1x2,b1y2,b2x1,b2y1,b2x2,b2y2,hh,widt,stl,color,mode)
{
		str="";
		
		// Indicator boxes
		str+=makeBox("S","","Start",b1x1,b1y1,b1x2,b1y2);
		str+=makeBox("E","","End",b2x1,b2y1,b2x2,b2y2);
		
		if(mode=="A"){
				
				if(b1x1>b2x2){
						//Major
						str+=makeLine(b1x1,b1y1+hh,b2x2,b2y1+hh,widt,stl,color);
				}else if(b1x2<b2x1){
						// Minor
						str+=makeLine(b1x2,b1y1+hh,b2x1,b2y1+hh,widt,stl,color);
				}else{
						if(b1y1>b2y2){
								str+=makeLine(b1x1+hh,b1y1,b2x1+hh,b2y2,widt,stl,color);
						}else if(b1y2<b2y1){
								str+=makeLine(b1x1+hh,b1y2,b2x1+hh,b2y1,widt,stl,color);
						}else{
								// Complete overlap!
						}
				}
				
		}else{
				if(b1x1>b2x2){
						//Major
						if(b2y1<b1y1){
								str+=makeBoxC("E",widt,stl,color,b2x2,b2y1+hh,b1x1,b1y1+hh);
						}else{
								str+=makeBoxC("F",widt,stl,color,b2x2,b1y1+hh,b1x1,b2y1+hh);
						}
				}else if(b1x2<b2x1){
						// Minor
						if(b2y1<b1y1){
								str+=makeBoxC("F",widt,stl,color,b1x2,b2y1+hh,b2x1,b1y1+hh);
						}else{
								str+=makeBoxC("E",widt,stl,color,b1x2,b1y1+hh,b2x1,b2y1+hh);
						}
				}else{
						// Overlap
						if(b1x2>b2x2){
								// B1 is to the right
								if(b2y1>b1y1){
										str+=makeBoxC("O",widt,stl,color,b2x2,b1y1+hh,b1x2+20,b2y1+hh);
								}else{
										str+=makeBoxC("O",widt,stl,color,b2x2,b2y1+hh,b1x2+20,b1y1+hh);
								}
						}else{
								// B2 is to the right
								if(b2y1>b1y1){
										str+=makeBoxC("O",widt,stl,color,b1x2,b1y1+hh,b2x2+20,b2y1+hh);
								}else{
										str+=makeBoxC("O",widt,stl,color,b1x2,b2y1+hh,b2x2+20,b1y1+hh);
								}
						}
				}
		}
							
		return str;
}

//---------------------------------------------------------------------------------------------------------------
// hoverCourse
//
// One to Many Hover from ID to Class
//---------------------------------------------------------------------------------------------------------------


function hoverCourse(ethis,cid)
{
		var dpos=$("#"+ethis.id).position();

		var hh=17;		// Half height!			
		var bw=90;
		var bh=35;
		
		var str="";
		$("."+ethis.id).each(function(i){ 
				cpos=$("#"+this.id).position();
				if($("#"+this.id).hasClass("red")){
						str+=makeConnector(cpos.left,cpos.top,cpos.left+bw,cpos.top+bh,dpos.left,dpos.top,dpos.left+bw,dpos.top+bh,hh,"3px","ridge","red","A");
				}else{
						str+=makeConnector(cpos.left,cpos.top,cpos.left+bw,cpos.top+bh,dpos.left,dpos.top,dpos.left+bw,dpos.top+bh,hh,"3px","ridge","green","A");
				}
		});
		document.getElementById("content").innerHTML=str;		
}
			
//---------------------------------------------------------------------------------------------------------------
// hoverReq
//
// One to One Hover from Class to ID
//---------------------------------------------------------------------------------------------------------------

function hoverReq(ethis,cid)
{
		var cpos=$("#"+cid).position();
		var dpos=$("#"+ethis.id).position();
		var hh=17;		// Half height!			
		var bw=90;
		var bh=35;
		
		var str="";
		if($("#"+ethis.id).hasClass("red")){
				str+=makeConnector(cpos.left,cpos.top,cpos.left+bw,cpos.top+bh,dpos.left,dpos.top,dpos.left+bw,dpos.top+bh,hh,"3px","ridge","red","A");					
		}else{
				str+=makeConnector(cpos.left,cpos.top,cpos.left+bw,cpos.top+bh,dpos.left,dpos.top,dpos.left+bw,dpos.top+bh,hh,"3px","ridge","green","A");					
		}
		
		document.getElementById("content").innerHTML=str;		
}

//---------------------------------------------------------------------------------------------------------------
// clearHover
//
// Clears the Hover
//---------------------------------------------------------------------------------------------------------------

function clearHover()
{
		document.getElementById("content").innerHTML="";	
}
