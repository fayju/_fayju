#pragma strict
// 
//  TrackQuad.js
//  Assets
//  
//  Created by Gareth Bushell on 2013-02-27.
//  Copyright 2013 fayju. All rights reserved.
// 

class TrackQuad{
	//depends on winding
	var A:Vector2 = Vector2(0,0);
	var B:Vector2 = Vector2(0,0);
	var C:Vector2 = Vector2(0,0);
	var D:Vector2 = Vector2(0,0);
	var width:float = 0;
	var height:float= 0;
	/*
		A-----B
		|	  |
		|	  |
		C-----D
	*/
 
	function TrackQuad(){
		
	}
	function updateQuadFromUV(ax,ay,w,h):void{
		A.x = 0;
		A.y = 0;
		
		B.x =1;
		B.y =0;
		
		C.x = 0;
		C.y = 1;
		
		D.x = 1;
		D.y = 1; 
		
	 
		
	}
	function updateQuadFromRect(rt:Rect, textureSize:float):void{
		A.x = (rt.x  + rt.width)/textureSize;
		A.y =   (textureSize -(rt.y + rt.height))/textureSize;
		
		B.x = (rt.x)/textureSize;
		B.y =(textureSize -(rt.y + rt.height))/textureSize;
		
		C.x = (rt.x+ rt.width)/textureSize;
		C.y = (textureSize -rt.y)/textureSize;
		
		D.x = (rt.x )/textureSize;
		D.y = (textureSize -rt.y)/textureSize; 
		
		width = B.x - A.x;
		height = C.x - A.x;
		
	}
	
}

class SegmentDefinition {
		/*
		A-------B
		|		|
		|		|
		C-------D
		*/
		var normalids:int[];
		var A:int = 0;
		var B:int = 1;
		var C:int = 2;
		var D:int = 3;
		//if bill board
		var UVA:Vector2 = Vector2(0,0);
		var UVB:Vector2 = Vector2(1,0);
		var UVC:Vector2 = Vector2(0,1);
		var UVD:Vector2 = Vector2(1,1);
	 
 		var letterController:fjLetterController;

 

}