// 
//  TextDisplayParagraph.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-09-27.
//  Copyright 2012 fayju. All rights reserved.
// 

#pragma strict
 	
class TextDisplayParagraph extends MonoBehaviour{
 	 

	var myText:TextDisplay;
	 
	var bottomLeft:Transform;
	var topRight:Transform;
	var maxDrawSize:float = 0.2;
	var minDrawSize:float = 0.1;
	var maxLines:int = 3;
	var lineSpacing:float = 1.6;
	private var maximumWidth:float;
	private var cropWidth:float = 11.0;
	var drawScale:float = 0.035;
	var maxCropWidth:float = 21;
	//var minScale:float
	var displayText:String = "some example text that is descriptive about something";
 	var lineWidth:float = 1;
 	var scaleTarget:Transform;
var forceDraw:boolean = false;
	function Start(){
		 maximumWidth = 1.8*Vector3.Distance(Vector3(bottomLeft.position.x, 0, bottomLeft.position.z), Vector3(topRight.position.x, 0, topRight.position.z) );
	/*	if(Random.Range(0,12) < 6){

		}else{
				updateText("get dunerider now");
		}*/
	
		if(forceDraw){
				updateText(displayText);
		}
	 
	}
 
	function updateText(txt:String){
		 	maximumWidth = 1.8*Vector3.Distance(Vector3(bottomLeft.position.x, 0, bottomLeft.position.z), Vector3(topRight.position.x, 0, topRight.position.z) );
			SplitToLines(txt, 3);
	}
	//0.73|0.7|0.66|0.7|0.68|0.66|0.65|0.7|0.4|0.58|0.68|0.59|0.8|0.7|0.81|0.72|0.82|0.66|0.64|0.64|0.72|0.74|0.95|0.66|0.66|0.72|0.73|0.7|0.66|0.7|0.68|0.66|0.65|0.7|0.4|0.58|0.68|0.59|0.8|0.7|0.81|0.66|0.82|0.66|0.64|0.64|0.72|0.6|0.3|0.5|0.6|0.3|0.74|0.48|0.72|0.7|0.68|0.72|0.7|0.68|0.7|0.7|0.4|1|1|1|0.66|1.0|1|1|1
 	function SplitToLines(text:String, lines:int){
//	text = GameSettingsData.GetInstance().MonsterSafe(text);
	
		var words = text.Split(" "[0]);
		Debug.Log("words here are "+words.length);
			if(lines > words.length - 1 ){
				lines = words.length - 1;
			}
			if(lines < 1){
				return;
			}
		var phraseWidth:float = 0;
		for(var i:int = 0; i < words.length; i++){
			Debug.Log("words "+i+" "+words[i]);
			phraseWidth = phraseWidth+ myText.GetWordWidth(words[i], drawScale) + myText.getSpaceWidth(drawScale);
		}
		cropWidth =phraseWidth/3.0;
		if(cropWidth > maxCropWidth){
			cropWidth = maxCropWidth;
		}
		Debug.Log("crop width "+cropWidth);
			myText.transform.localScale = Vector3(1,1,1);
			Debug.Log(phraseWidth+" phrase width");
			var maxPhraseWidth:float = phraseWidth;
			var numberOfLines:int = Mathf.Ceil(phraseWidth/cropWidth);
			//this is how many to break it down to 
			//nearest space to phraseWidth/numberOfLines
			var estimateDivide:float = phraseWidth/(numberOfLines*1.0);
			var cWord:int = 0;
			var cPhraseWidth:float = 0;
			var currentLine:int = 1;
			var cPhrase:String = "";
			var  lineTexts:String[] = new String[numberOfLines];
				for(i = 0; i < numberOfLines; i++){
					lineTexts[i] = "";
				}
		
			maxPhraseWidth = 0;
			//for(var l:int = 0; l < numberOfLines; l++){
			for(i = 0; i < words.length; i++){
				var cWordWidth:float = myText.GetWordWidth(words[i], drawScale);
				 //duplicate the textfield and move it down the right amount
				if(cPhraseWidth +cWordWidth > (cropWidth*1.2 ) && currentLine != numberOfLines ){
					cPhrase = "";
					currentLine++;
					//draw to text
					cPhraseWidth = 0 ;
				}		
				cPhrase = cPhrase + words[i]+" ";
				lineTexts[currentLine - 1] = cPhrase;
				cPhraseWidth = cPhraseWidth + cWordWidth + myText.getSpaceWidth(drawScale);
				if(cPhraseWidth > maxPhraseWidth){
					maxPhraseWidth = cPhraseWidth ;
				}		
			}
			for(i = 0; i < numberOfLines; i++){
				
				var txtDisplay:TextDisplay;
				if(i != 0){
					var go:GameObject = Instantiate(myText.gameObject, myText.gameObject.transform.position + Vector3(0,-i*lineSpacing,0),  myText.gameObject.transform.rotation);
					go.name = myText.gameObject.name;
					go.transform.parent = myText.gameObject.transform.parent;
			 
					txtDisplay = go.GetComponent(TextDisplay);
				
					txtDisplay.displayText = lineTexts[i];
					txtDisplay.init();
				}else{
					txtDisplay = myText;
				}
				txtDisplay.DrawText(lineTexts[i]);
			}
		if(maxPhraseWidth > maximumWidth){
			//how much to scale down by?
			var nscale:float = maximumWidth/maxPhraseWidth;
			scaleTarget.localScale = Vector3(nscale,nscale,nscale);
		}
 //	myText.DrawText(text);
	 
	}

}
