// 
//  TextDisplay.js
//  Assets
//  
//  Created by Gareth Bushell on 2010-10-28.
//  Copyright 2010 fayju. All rights reserved.
// 
#pragma strict
public enum TextChunkAlign{CENTER,LEFT,RIGHT}	
class TextDisplay extends MonoBehaviour{
 	 

	private var textModel:TextModel;
	
	
	var align:TextChunkAlign = TextChunkAlign.LEFT;
	var material:Material;// the spritesheet
	var displayText:String = "text";
	var drawScale:float = 1.0;
	var kerning:float = 0.0;
	var relativeLoc:Vector3 = Vector3(0,0,0);	
	
	var resourceDefinition:GameObject;
	
	
	var drawOnAwake:boolean = false;
	private var xVect:Vector3 = Vector3(1,0,0);
	private var yVect:Vector3 = Vector3(0,1,0);
	private var zVect:Vector3 = Vector3(0,0,1);
	

	private var isStarted:boolean = false;
	private var drawnText:String = "";
	function Awake():void{
	
		/*if(drawScale < 0.09){
			drawScale = drawScale*180.0;
		}*/
		if(!material)
			return;
		if(!resourceDefinition){
			switch(material.name){
				case "MyriadPro":
				case "MyriadGoldMaterial":
				resourceDefinition = Resources.Load("_textDisplayMyriadPro");
				break;
				case "bombasticMaterial":
				resourceDefinition = Resources.Load("_textDisplayBombastic");
				break;
				case "ScoreNumberMaterial":
				resourceDefinition = Resources.Load("_textDisplayScoreNumbers");
				break;
				case "monsterTokenText":
				resourceDefinition = Resources.Load("_textDisplayTokens");
				break;
				case "appleNumbersMat":
				resourceDefinition = Resources.Load("_textDisplayAppleNumbers");
				break;
			}
				return;
		}
		drawnText = "";
	
		makeTextModel();
	}
	function makeTextModel():void{
			if(gameObject.GetComponent(TextModel) == null){
				textModel = gameObject.AddComponent(TextModel);
			}else{
				textModel = gameObject.GetComponent(TextModel) ;	
			}

			textModel.resourceGameObject = resourceDefinition;
			drawnText = "";
	}
	function Start():void{
		 	
		//	DrawText("world");
		 
			if(drawOnAwake){
				init();
				DrawText(displayText);
			}else{
				if(textModel == null){
					makeTextModel();
				}
				if(!textModel.hasMesh()){
						init();
						DrawText(displayText);
				
				}
			}
		
	}
	function resetModel () {
			isStarted = false;
		if(!resourceDefinition)
			return;
		if(!material)
			return;
		if(gameObject.GetComponent(TextModel) != null){
			var tm:TextManager =resourceDefinition.GetComponent(TextManager) as TextManager;
			tm.unMakeRects();
			//Debug.Log("wiped model");
			textModel = gameObject.GetComponent(TextModel) ;
			textModel.DestroyObjects();
			DestroyImmediate(textModel);	
		}
		makeTextModel();
		init();
	}
	
	function init():void{
		//if(!isStarted){
			drawnText = "";
			if(textModel != null){
				textModel.init();
				textModel.setMaterial(material);
			
			}else{
			
			}
	/*
		}
			isStarted = true;*/
	
	}
	function setLightUV(arect:Rect){
		if(textModel.letters != null){
			var letter:SpriteDefinition = textModel.letters[0];
			//for(var letter:SpriteDefinition in textModel.letters){
			 
				textModel.updateLightMap(letter, arect, true);
		//	}
		
		}	
	
	}
	function DrawTextEditor(text:String):void{
		drawnText = "";//override
		DrawText(text);
	}
	function GetWordWidth(word:String, scale:float):float{
		var wid:float = 0;
		var leng:int = word.length;
			for(var i:int = 0; i < leng; i++){
				var entry:String = ""+word[i];
				if(i != 0 && i != leng - 1){
					//wid = wid + getSpaceWidth(scale);
				
				}
					wid = wid + kerning;
				wid = wid + scale*textModel.getWidth(entry);
			}
			
		return wid;
	}
	function getSpaceWidth(scale:float):float{
		return scale*textModel.getSpaceWidth() + kerning;
	}
	function DrawText(text:String):void{
			if(!resourceDefinition){
				Debug.Log("WARNING NO resourcedefinition");
				return;
			}
			if(!material){
				Debug.Log("WARNING NO material");
				return;
			}
			if(textModel == null){
				makeTextModel();
			}
			if(!textModel.quadManager){
				Debug.Log("WARNING NO quadmanger");
				return;
			}	
		
			drawOnAwake = false;
			init();
			displayText = text;
			if(displayText != drawnText || drawnText == ""){//lets not draw it twice
			
//  		Debug.Log(displayText);
			var leng:int = displayText.length;
			var str:int = 0;
			for(var s:int = 0; s < leng; s++){
					if(""+displayText[s] != " "){
						str++;
					}
			}
			//abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>?+=',.
							//0.76|0.7|0.66|0.7|0.68|0.66|0.68|0.7|0.38|0.6|0.68|0.54|0.84|0.72|0.84|0.68|0.86|0.68|0.68|0.64|0.72|0.76|1.04|0.68|0.66|0.74|0.76|0.7|0.66|0.7|0.68|0.66|0.68|0.7|0.38|0.6|0.68|0.54|0.84|0.72|0.84|0.68|0.86|0.68|0.68|0.64|0.72|0.76|1.00|0.68|0.66|0.74|0.74|0.48|0.74|0.7|0.7|0.74|0.72|0.68|0.72|0.72|0.38|0.9|0.9|0.72|0.66|0.66|0.32|0.36|0.36
			var firstLetter:String = "i";
			var lastLetter:String = "i";
			var drawMag:float = 0;
			textModel.letters = new SpriteDefinition[str];
			var startLoc:Vector3 =  relativeLoc ;//+ zVect*0.01;
			startLoc = startLoc  - drawScale*xVect*0.5*textModel.quadManager.getDisplayWidth();
			var n:int = 0;
			for(var i:int = 0; i < leng; i++){
				var entry:String = ""+displayText[i];
				if(i == 0){
					firstLetter = entry;
				}
				
				
				var kernAdd:float =kerning;
				if(i == 0 && leng <= 1){
					kernAdd = 0;
					
				}
				if(i == leng -1){
					 
						kernAdd = 0;
				 
					lastLetter = entry;
				}
				if(entry == " "){
					startLoc = startLoc - xVect*drawScale*textModel.getSpaceWidth() - xVect*kernAdd;
					drawMag = drawMag +(drawScale*textModel.getSpaceWidth() + kernAdd);
				}else{
					var letterHalf:float = textModel.getLetterShift(entry)*drawScale;
					textModel.letters[n] = textModel.createLetterSprite(entry ,startLoc , drawScale);//- letterHalf*xVect
					startLoc = startLoc - (xVect*drawScale*textModel.getWidth(entry)) - xVect*kernAdd;
				 
					drawMag = drawMag + (drawScale*textModel.getWidth(entry) + kernAdd);
				 
					n++;
				}
			}
			
					switch(align){
						case TextChunkAlign.LEFT:
								//leave it this is default
						 //for(n = 0; n < textModel.letters.length; n++){
									//	textModel.letters[n].position = textModel.letters[n].position  - xVect*drawScale/2.0 ;
							//	}
						break;
						case TextChunkAlign.RIGHT:
								for(n = 0; n < textModel.letters.length; n++){
									textModel.letters[n].position = textModel.letters[n].position + (drawMag  )*xVect  ;
								}
						break;
						case TextChunkAlign.CENTER:

							for(n = 0; n < textModel.letters.length; n++){
								 textModel.letters[n].position = textModel.letters[n].position + (drawMag  )*xVect*0.5;   
							}
						break;
					}
	 
			textModel.populateMesh();
			drawnText = displayText;
			}
			
	}

}