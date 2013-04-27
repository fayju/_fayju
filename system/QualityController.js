// 
//  QualityController.js
//  Assets
//  
//  Created by Gareth Bushell on 2011-01-07.
//  Copyright 2011 fayju. All rights reserved.
// 


var interfaceOn:boolean = false;

 
function Start () {
		//toggleProjectors();
		
	 
			//	interfaceOn = true;
}
 
function OnGUI () 
{

	if(interfaceOn){
    	var names = QualitySettings.names;
 		GUILayout.BeginHorizontal ("box");
    	GUILayout.BeginVertical ();
    	for (var i = 0; i < names.Length; i++)
	    {
	        if (GUILayout.Button (names[i],   GUILayout.Height(50)))
	            QualitySettings.SetQualityLevel (i, true);
	    }
	
				
				
    	GUILayout.EndVertical ();

		GUILayout.BeginVertical();
		 	if (GUILayout.Button ("interface",   GUILayout.Height(50)))
					toggleInterface();
			

		GUILayout.EndVertical();
    	GUILayout.EndHorizontal();;
	}else{
		//its being made elsewhere
		/*if(Input.touchCount >= 6){
			//interfaceOn = true;
		}*/
	}
}
 
function toggleInterface(){

//	interfaceOn = !interfaceOn;
}


enum DisplayQuality{HIGH,MEDIUM,LOW}
private static var defaultController : QualityController;
static function DefaultController () : QualityController {
    // If the defaultCenter doesn't already exist, we need to create it
    if (!defaultController) {
        // Because the NotificationCenter is a component, we have to create a GameObject to attach it to.
        var qualityObject: GameObject = new GameObject("Quality Controller");
        // Add the NotificationCenter component, and set it as the defaultCenter
        defaultController = qualityObject.AddComponent(QualityController);
		defaultController.initQuality(false);
		DontDestroyOnLoad(qualityObject);
    }
    
    return defaultController;
}
private var displayQuality:DisplayQuality = DisplayQuality.LOW;
private var textureQuality:DisplayQuality = DisplayQuality.LOW;
private var textureQualitySet:boolean = false;
private var qualitySet:boolean = false;
private var antialiasing:int = 0;
private var isInited:boolean = false;
private var isIpad:boolean = false;
var targetQuality:int = 0;
function initQuality(){
//	yield initQuality(true);
	
}

function isUsingIpad():boolean{
	return isIpad;
}
function initQuality(useWait:boolean ){
	if(isInited)
	return;
	
	
	 var names = QualitySettings.names;
	    var totalQualities:int = names.Length;
		if(useWait && !Application.isEditor){
			if(totalQualities > 1){
			//	QualitySettings.SetQualityLevel (1, true);
			}
	 
				yield WaitForSeconds(0.5);
	 
			if(totalQualities > 3){
			//	QualitySettings.SetQualityLevel (3, true);
			}
	 
	 			yield WaitForSeconds(0.5);
		 }
		//by default leave it at 3
		
	#if UNITY_IPHONE
		targetQuality = 1;//no shadows
		
		if(Application.isEditor){
			targetQuality = QualitySettings.GetQualityLevel();
			
		}else{
			switch(iPhone.generation){
			 
		 
				case iPhoneGeneration.iPad1Gen:
					targetQuality = 2;
					isIpad = true;
		 		break;
				case iPhoneGeneration.iPad2Gen:
					targetQuality = 4;
					isIpad = true;
				break;
				case iPhoneGeneration.iPad3Gen:
					targetQuality = 5;
					isIpad= true;
				break;
				case iPhoneGeneration.iPad4Gen:
				targetQuality = 5;
				isIpad = true;
				
				break; 
				case iPhoneGeneration.iPadMini1Gen :
				targetQuality = 4;
				isIpad = true;

				break;
				case iPhoneGeneration.iPadUnknown:
				//Yet unknown iPad 
					targetQuality = 4;
					isIpad = true;
				break;
				case iPhoneGeneration.iPhone:
					targetQuality = 0;
				break;
				case iPhoneGeneration.iPhone3G:
					targetQuality = 0;
				break;
				case iPhoneGeneration.iPhone3GS: 
				 	targetQuality = 2;
				break;
				case iPhoneGeneration.iPhone4:
			 			targetQuality = 2;
				break;
				case iPhoneGeneration.iPhone4S:
						targetQuality = 5;
				break;
				case iPhoneGeneration.iPhone5:
				 	targetQuality = 5;
				break;
				case iPhoneGeneration.iPodTouch1Gen:
					targetQuality = 0;
			 	break;
				case iPhoneGeneration.iPodTouch2Gen:
					targetQuality = 0;
				break;
				case iPhoneGeneration.iPodTouch3Gen:
					targetQuality = 2;
				break;
				case iPhoneGeneration.iPodTouch4Gen :
					targetQuality = 2;
				break;
				case iPhoneGeneration.iPodTouch5Gen:
					targetQuality = 5;
				break;
				////
				case iPhoneGeneration.iPodTouchUnknown:
				targetQuality = 2;
				break;
				case iPhoneGeneration.iPhoneUnknown:
				targetQuality = 4;
				break;
			}
		
			if(targetQuality >= totalQualities){
				targetQuality = totalQualities - 1;
			}
		
		targetQuality = 5;
	
	}
	
	#endif
	
		if(targetQuality != QualitySettings.GetQualityLevel()){
	//	QualitySettings.SetQualityLevel (targetQuality, true);
		}
	isInited = true;
}

//QualityController.DefaultController().getQuality();
function getTextureQuality():DisplayQuality{
	
	if(!textureQualitySet){

		/*
		iPhone	 First generation device
		iPhone3G	 Second generation
		iPhone3GS	 Third generation
		iPodTouch1Gen	 iPod Touch, first generation
		iPodTouch2Gen	 iPod Touch, second generation
		iPodTouch3Gen	 iPod Touch, third generation
		iPad1Gen	 iPad, first generation
		iPhone4	 Fourth generation
		iPodTouch4Gen	 iPod Touch, fourth generation
		*/
			textureQuality = DisplayQuality.LOW;
		if(Screen.width > 600){
				textureQuality = DisplayQuality.HIGH;
		}
		
 #if UNITY_IPHONE
		switch(iPhone.generation){
				case iPhoneGeneration.iPhone:
					textureQuality = DisplayQuality.LOW;
				break;
				case iPhoneGeneration.iPhone3G:
					textureQuality = DisplayQuality.LOW;
				break;
				case iPhoneGeneration.iPhone3GS:
					textureQuality = DisplayQuality.LOW;
				break;
				case iPhoneGeneration.iPodTouch1Gen:
					textureQuality = DisplayQuality.LOW;
				break;
				case iPhoneGeneration.iPodTouch2Gen:
					textureQuality = DisplayQuality.LOW;
				break;
				case iPhoneGeneration.iPodTouch3Gen:
					textureQuality = DisplayQuality.LOW;
				break;
				case iPhoneGeneration.iPodTouch4Gen:
					textureQuality = DisplayQuality.HIGH;
				break;
				case iPhoneGeneration.iPhone4:
					textureQuality = DisplayQuality.HIGH;
				break;
				case iPhoneGeneration.iPad1Gen:
					textureQuality = DisplayQuality.HIGH;
				break;
			 
			}
	#endif		

	#if UNITY_ANDROID
		//sort qualty based on screen 
	#endif


	}

	if(Application.isEditor){
	 textureQuality = DisplayQuality.HIGH;
	 //textureQuality = DisplayQuality.LOW;
	}
	textureQualitySet = true;	

	return textureQuality;
	
}
function getQuality():DisplayQuality{
	if(!qualitySet){
	 
		/*
		iPhone	 First generation device
		iPhone3G	 Second generation
		iPhone3GS	 Third generation
		iPodTouch1Gen	 iPod Touch, first generation
		iPodTouch2Gen	 iPod Touch, second generation
		iPodTouch3Gen	 iPod Touch, third generation
		iPad1Gen	 iPad, first generation
		iPhone4	 Fourth generation
		iPodTouch4Gen	 iPod Touch, fourth generation
		*/
			displayQuality = DisplayQuality.HIGH;
 #if UNITY_IPHONE
		switch(iPhone.generation){
				case iPhoneGeneration.iPhone:
					displayQuality = DisplayQuality.LOW;
				break;
				case iPhoneGeneration.iPhone3G:
					displayQuality = DisplayQuality.LOW;
				break;
				case iPhoneGeneration.iPhone3GS:
					displayQuality = DisplayQuality.HIGH;
				break;
				case iPhoneGeneration.iPodTouch1Gen:
					displayQuality = DisplayQuality.LOW;
				break;
				case iPhoneGeneration.iPodTouch2Gen:
					displayQuality = DisplayQuality.LOW;
				break;
				case iPhoneGeneration.iPodTouch3Gen:
					displayQuality = DisplayQuality.HIGH;
				break;
				case iPhoneGeneration.iPodTouch4Gen:
					displayQuality = DisplayQuality.HIGH;
				break;
				case iPhoneGeneration.iPhone4:
					displayQuality = DisplayQuality.HIGH;
				break;
				case iPhoneGeneration.iPad1Gen:
					displayQuality = DisplayQuality.HIGH;
				break;
			}
	#endif		
			
	#if UNITY_ANDROID
		//sort qualty based on screen 
	#endif
		
	
	}
	
	if(Application.isEditor){
	 displayQuality = DisplayQuality.HIGH;
//	displayQuality = DisplayQuality.LOW;
	}
	qualitySet = true;
	return displayQuality;
}
//QualityController.DefaultController().getAntialiasing();
function getAntialiasing():int{
//	Debug.Log("i0s system name "+iPhoneSettings.systemName);
 antialiasing = 2;
 
	
	return antialiasing;
}
function getInGameAds():boolean{
//	Debug.Log("i0s system name "+iPhoneSettings.systemName);
	var bool:boolean = false;
	/*
	switch(iPhoneSettings.generation){
		case iPhoneGeneration.iPhone:
		 bool = false;
		break;
		case iPhoneGeneration.iPhone3G:
			bool = false;
		break;
		case iPhoneGeneration.iPhone3GS:
		bool = true;
		break;
		case iPhoneGeneration.iPodTouch1Gen:
		 bool = false;
		break;
		case iPhoneGeneration.iPodTouch2Gen:
		 	bool = false;
		break;
		case iPhoneGeneration.iPodTouch3Gen:
			bool = true;
		break;
		case iPhoneGeneration.iPodTouch4Gen:
			bool = true;
		break;
		case iPhoneGeneration.iPhone4:
		 bool = true;
		break;
		case iPhoneGeneration.iPad1Gen:
		bool = true;
		break;
	}
	*/
	
	return bool;
}