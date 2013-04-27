#pragma strict
// 
//  fjGUIBox.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-05-16.
//  Copyright 2012 fayju. All rights reserved.
// 
// 
//  fjWaveStrip.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-02-22.
//  Copyright 2012 fayju. All rights reserved.
// 


class fjGUIBox extends MonoBehaviour{
	private var meshRenderer:MeshRenderer;
	private var meshFilter:MeshFilter;
	protected var mesh:Mesh;
	
	protected var displayVertices:Vector3[];
	protected var displayUV:Vector2[];
	protected var displayUV2:Vector2[];
	protected var displaytriangles:int[];
	protected var normals:Vector3[];
	
 	var material:Material;

	var pixelInset:fjGUIBoxDefinition;
	var marginScale:float = 0.1;
	var margin:fjGUIBoxDefinition;
	var worldSize:Rect;
 	var uvScale:float = 2.0;
	var xVect:Vector3 = Vector3(1,0,0);
	var zVect:Vector3 = Vector3(0,0,1);
	var upVector:Vector3 = Vector3(0,1,0);
	var useUV2:boolean = true;
	function Start(){
		
		initialize();	
		
	}
	function initialize(){
			if(gameObject.GetComponent("MeshRenderer") == null){
				meshRenderer =  gameObject.AddComponent("MeshRenderer");
			}else{
					meshRenderer =  gameObject.GetComponent("MeshRenderer");
			}
			if(gameObject.GetComponent("MeshFilter") == null){
				meshFilter =  gameObject.AddComponent("MeshFilter");
			}else{
				meshFilter =  gameObject.GetComponent("MeshFilter");
			}
		 
			mesh = new Mesh ();
			meshFilter.mesh = mesh;
		 
			//
		 	populateMesh();

	}

	function populateMesh():void{
	 
		var texture : Texture;
		if(material){
			texture = material.mainTexture;
		}
			var textureWidth:int = 1;// texture.width;
			var textureHeight:int = 1;//texture.height;
		if(texture){
				textureWidth = texture.width;
				textureHeight = texture.height;
		}
	
		if(textureHeight < 1){
			textureHeight = 1;
		}
		if(textureWidth < 1){
			textureWidth = 1;
		}
		
		//generate a 3*3 square 

			var vertCount:int =16;
			var incr:int = 0;
			var cent:Vector3 = Vector3(0,0,0);
		 
			
			displayVertices = new Vector3[vertCount];
			displayUV = new Vector2[vertCount];
			displayUV2 = new Vector2[vertCount];
			normals = new Vector3[vertCount];
			
			var triangleCount:int = 9*2*3;
			var displayTriangles:int[] = new int[triangleCount];
			var i:int = 0;
			var d:int = 0;
			var t:int = 0;
	 		var regLoc:Vector3 = Vector3(0,0,0);
			var uvLoc:Vector2 = Vector2(0,0);

			var worldWidths:float[] = new float[3];
			var worldHeights:float[] = new float[3];
			worldWidths[0] = (margin.left*marginScale);
			worldWidths[1] = worldSize.width - (margin.left + margin.right)*marginScale;
			worldWidths[2] = (margin.right*marginScale);
			
			worldHeights[0] = (margin.top*marginScale);
			worldHeights[1] = worldSize.height - (margin.top + margin.bottom)*marginScale;
			worldHeights[2] = (margin.bottom*marginScale);
			 
			
			var uvWidths:float[] = new float[3];
			var uvHeights:float[] = new float[3];
			
			uvWidths[0] = (pixelInset.left)/textureWidth;
			uvWidths[1] = (textureWidth - pixelInset.left  - pixelInset.right)/textureWidth ;
			uvWidths[2] = (pixelInset.right)/textureWidth;
			
			
			uvHeights[0] = (pixelInset.top)/textureHeight;
			uvHeights[1] = (textureHeight - pixelInset.top -  pixelInset.bottom)/textureHeight ;
			uvHeights[2] = (pixelInset.bottom)/textureHeight;
			var uvLoc2 = Vector2(0,0);
			
				var uv2Widths:float[] = new float[3];
				var uv2Heights:float[] = new float[3];

				uv2Widths[0] = (margin.left*marginScale)/(uvScale);
				uv2Widths[1] = (worldSize.width - (margin.left + margin.right)*marginScale)/uvScale ;
				uv2Widths[2] = (margin.right*marginScale)/uvScale;


				uv2Heights[0] = (margin.top*marginScale)/uvScale;
				uv2Heights[1] = (worldSize.height - (margin.top + margin.bottom)*marginScale)/uvScale ;
				uv2Heights[2] = (margin.bottom*marginScale)/uvScale;
				
				for( var r:int = 0; r < 3; r++){
						regLoc.x = 0;
						uvLoc.x = 0;
						uvLoc2.x = 0;
					for( var c:int = 0; c < 3; c++){
					
						
						
						//each square defined
						
						var A:int = ((r)*4) + (c);
						var B:int = ((r)*4) + (c) + 1;
						var C:int = ((r + 1)*4 ) + (c);
					  	var D:int = ((r + 1)*4 ) + (c) + 1;
	
						/*
						A-------B
						|		|
						|		|
						C-------D
						*/
			 	 
						normals[A] = zVect;
						normals[B] = zVect;
						normals[C] = zVect;
						normals[D] = zVect;
						var unitWidth:float = worldWidths[c];
						var unitHeight:float = worldHeights[r];
						
						var uvWidth:float = uvWidths[c];
						var uvHeight:float = uvHeights[r];
						
						var uv2Width:float = uv2Widths[c];
						var uv2Height:float = uv2Heights[r];
						
						displayVertices[A] =  	regLoc ;
						displayVertices[B] = 	regLoc + xVect*unitWidth;  
				
						displayVertices[C] = 	regLoc + upVector*unitHeight;
						displayVertices[D] = 	regLoc + xVect*unitWidth + upVector*unitHeight; 
					 
						displayUV[A] = uvLoc ;
						displayUV[B] = uvLoc +  Vector2(1,0)*uvWidth;  
						displayUV[C] = uvLoc +  Vector2(0,1)*uvHeight;
						displayUV[D] = uvLoc +  Vector2(1,0)*uvWidth +  Vector2(0,1)*uvHeight; 
						
						
						displayUV2[A] = uvLoc2 ;
						displayUV2[B] = uvLoc2 +  Vector2(1,0)*uv2Width;  
						displayUV2[C] = uvLoc2 +  Vector2(0,1)*uv2Height;
						displayUV2[D] = uvLoc2 +  Vector2(1,0)*uv2Width +  Vector2(0,1)*uv2Height;

						displayTriangles[t] = B; 
						t++;                  
						displayTriangles[t] = A; 
						t++;                  
						displayTriangles[t] = D; 
						t++;                  
						displayTriangles[t] = D; 
						t++;                  
						displayTriangles[t] = A; 
						t++;                  
						displayTriangles[t] = C; 
						t++;

						uvLoc.x = uvLoc.x + uvWidths[c]; 
						uvLoc2.x = uvLoc2.x + uv2Widths[c];  
						regLoc = regLoc + xVect*worldWidths[c];
				
					}
						 uvLoc.y = uvLoc.y +  uvHeights[r];  
						 uvLoc2.y = uvLoc2.y +  uv2Heights[r];  
						regLoc = regLoc + upVector*worldHeights[r];
				}

			var colors:Color[] = new Color[vertCount];
			for(i= 0; i < vertCount; i++){
					colors[i] = Color.white;
			}
			 
			mesh.Clear();
			mesh.vertices = displayVertices;
		 	mesh.uv = displayUV;
			if(useUV2)
			mesh.uv2 = displayUV2;
			
			mesh.triangles = displayTriangles;
			mesh.normals = normals;
			mesh.colors = colors;
			mesh.RecalculateBounds();

//				Debug.Log("material here "+material.name);
			if(material != null){
				meshRenderer.material = material;
			}
			meshFilter.mesh = mesh;
	}
	

	
}
class fjGUIBoxDefinition{
	var left:float = 5;
	var right:float =  5;
	var top:float = 5;
	var bottom:float = 5;

}

