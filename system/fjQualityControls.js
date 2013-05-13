#pragma strict
// 
//  fjQualityControls.js
//  «project»
//  
//  Created by Gareth Bushell on 2013-04-20.
//  Copyright 2013 __MyCompanyName__. All rights reserved.
// 
private static var instance : fjQualityControls;
static function GetInstance () : fjQualityControls {
    // If the defaultCenter doesn't already exist, we need to create it
    if (!instance) {
		  var qualityObject: GameObject = GameObject.Find("fjQualityControls");
		 if(qualityObject == null){
       	qualityObject = new GameObject("fjQualityControls");
			DontDestroyOnLoad(qualityObject);
	  }
        instance = qualityObject.GetComponent(fjQualityControls);
		  if(!instance){
		  	 instance = qualityObject.AddComponent(fjQualityControls);
		  }
    } 
	 
	 instance.startQuality();
    return instance;
}
protected var hasStarted:boolean = false;
protected var tagged : GameObject[];
protected var hideInterface:boolean = true;
var isOUYA:boolean = true;//true to use ouya settings on android
var isSuperLow:boolean = false;
var isICadeActive:boolean = false;
var displayClipping:boolean = false;
//fjQualityControls.GetInstance().getSlowQuality();
function getSlowQuality():boolean{
	if(Application.isEditor)
	return false;
	
	return isSuperLow;
}
function startQuality () {
	if(hasStarted)
	return;
	
	
	#if UNITY_IPHONE
	
		SetUpICade();
		Screen.autorotateToLandscapeLeft = true;;;
		Screen.autorotateToLandscapeRight = true;
		Screen.autorotateToPortraitUpsideDown = false;
		Screen.autorotateToPortrait = false;
	#endif
	
	
	#if UNITY_ANDROID
	
	if(!Application.isEditor){
 		//	QualitySettings.SetQualityLevel (2, true);
		//	Screen.SetResolution(1920, 1080, true);
		//	Screen.SetResolution(1280, 720, true);

	 	//Screen.SetResolution(640, 360, true);
	}
	#endif
	SetStartQuality();
	if(!Application.isEditor){
	SetStartResolution();
	}
	hasStarted = true;
}
function SetUpICade(){
	
//	iCadeBinding.setActive( true );
	isICadeActive = true;
	
}
function UpdateICade(){
	#if UNITY_IPHONE
//	iCadeBinding.updateState();
	#endif
}
function checkMemory(){

		//safe guard 
		if (Time.frameCount % 600 == 0)
		 {
		 //	Debug.Log("COllect GARBAGE");
		 	Resources.UnloadUnusedAssets();
		  	System.GC.Collect();
		}
}
function resolveOrientation () {
	
}

function Update () {
	UpdateICade();
	checkMemory();
	resolveOrientation();
}
function ForceLowQuality(){
	
}
 
 
function SetStartResolution(){
	#if UNITY_ANDROID
	if(isOUYA){
			Screen.SetResolution(960, 540, true,30);
	}else{
		//leave at default and store for res scaling
	}
	#endif
	#if UNITY_IPHONE
		//leave at default and store for res scaling
		//leave at default and store for res scaling
		switch(iPhone.generation){
		 
	 
			case iPhoneGeneration.iPad1Gen:
			case iPhoneGeneration.iPad2Gen:
			case iPhoneGeneration.iPadMini1Gen :
			case iPhoneGeneration.iPadUnknown:
				 Screen.SetResolution(1024, 768, true,30);
			break;
			case iPhoneGeneration.iPad3Gen:
			case iPhoneGeneration.iPad4Gen:
				Screen.SetResolution(1024, 768, true, 30);
			break;
			case iPhoneGeneration.iPodTouchUnknown:
			case iPhoneGeneration.iPhoneUnknown:
			case iPhoneGeneration.iPhone:
			case iPhoneGeneration.iPhone3G:
			case iPhoneGeneration.iPhone3GS: 
			case iPhoneGeneration.iPodTouch1Gen:
			case iPhoneGeneration.iPodTouch2Gen:
			case iPhoneGeneration.iPodTouch3Gen:
				Screen.SetResolution(240, 160, true, 30);
			break;
			
			
			
			case iPhoneGeneration.iPhone4:
			case iPhoneGeneration.iPodTouch4Gen :
				 Screen.SetResolution(480, 320, true, 30);
			break;
			case iPhoneGeneration.iPhone4S:
				Screen.SetResolution(960, 640, true, 30);
			break;
			case iPhoneGeneration.iPhone5:
			case iPhoneGeneration.iPodTouch5Gen:
				  Screen.SetResolution(1136, 640, true, 30);
			break;
 
		}
	#endif
}
function SetHighResolution(){
	
	#if UNITY_ANDROID
	if(isOUYA){
			Screen.SetResolution(960, 540, true,30);
	}else{
		//leave at default and store for res scaling
	}
	#endif
	#if UNITY_IPHONE
		//leave at default and store for res scaling
		//leave at default and store for res scaling
		switch(iPhone.generation){
		 
	 
			case iPhoneGeneration.iPad1Gen:
			case iPhoneGeneration.iPad2Gen:
			case iPhoneGeneration.iPadMini1Gen :
			case iPhoneGeneration.iPadUnknown:
				 Screen.SetResolution(1024, 768, true,30);
			break;
			case iPhoneGeneration.iPad3Gen:
			case iPhoneGeneration.iPad4Gen:
				Screen.SetResolution(2048, 1536, true, 30);
			break;
			case iPhoneGeneration.iPodTouchUnknown:
			case iPhoneGeneration.iPhoneUnknown:
			case iPhoneGeneration.iPhone:
			case iPhoneGeneration.iPhone3G:
			case iPhoneGeneration.iPhone3GS: 
			case iPhoneGeneration.iPodTouch1Gen:
			case iPhoneGeneration.iPodTouch2Gen:
			case iPhoneGeneration.iPodTouch3Gen:
				Screen.SetResolution(480, 320, true, 30);
			break;
			
			
			
			case iPhoneGeneration.iPhone4:
			case iPhoneGeneration.iPhone4S:
			case iPhoneGeneration.iPodTouch4Gen :
				 Screen.SetResolution(960, 640, true, 30);
			break;
			
			case iPhoneGeneration.iPhone5:
			case iPhoneGeneration.iPodTouch5Gen:
				  Screen.SetResolution(1136, 640, true, 30);
			break;
 
		}
	#endif
		
}
function SetLowResolution(){
		var isOUYA:boolean = true;
		#if UNITY_ANDROID
		if(isOUYA){
				Screen.SetResolution(640, 360, true,30);
		}else{
			//leave at default and store for res scaling
		}
		#endif
		#if UNITY_IPHONE
			//leave at default and store for res scaling
			switch(iPhone.generation){
			 
		 
				case iPhoneGeneration.iPad1Gen:
				case iPhoneGeneration.iPad2Gen:
				case iPhoneGeneration.iPadMini1Gen :
				case iPhoneGeneration.iPadUnknown:
					 Screen.SetResolution(512, 384, true,30);
				break;
				case iPhoneGeneration.iPad3Gen:
				case iPhoneGeneration.iPad4Gen:
					Screen.SetResolution(1024, 768, true, 30);
				break;
				case iPhoneGeneration.iPodTouchUnknown:
				case iPhoneGeneration.iPhoneUnknown:
				case iPhoneGeneration.iPhone:
				case iPhoneGeneration.iPhone3G:
				case iPhoneGeneration.iPhone3GS: 
				case iPhoneGeneration.iPodTouch1Gen:
				case iPhoneGeneration.iPodTouch2Gen:
				case iPhoneGeneration.iPodTouch3Gen:
					Screen.SetResolution(240, 160, true, 30);
				break;
				
				
				
				case iPhoneGeneration.iPhone4:
				case iPhoneGeneration.iPhone4S:
				case iPhoneGeneration.iPodTouch4Gen :
					 Screen.SetResolution(480, 320, true, 30);
				break;
				
				case iPhoneGeneration.iPhone5:
				case iPhoneGeneration.iPodTouch5Gen:
					  Screen.SetResolution(568, 320, true, 30);
				break;
	 
			}
			
		#endif
}
function SetStartQuality(){
	if(Application.isEditor){
		
		return;
	}
	#if UNITY_IPHONE
		//leave at default and store for res scaling
		switch(iPhone.generation){
		 
	 
			case iPhoneGeneration.iPad1Gen:
			isSuperLow = true;
			QualitySettings.SetQualityLevel (1, true);
			break;
			case iPhoneGeneration.iPad2Gen:
			case iPhoneGeneration.iPadMini1Gen :
			case iPhoneGeneration.iPadUnknown:
				QualitySettings.SetQualityLevel (2, true);
			break;
			case iPhoneGeneration.iPad3Gen:
			case iPhoneGeneration.iPad4Gen:
				QualitySettings.SetQualityLevel (2, true);
			break;
			case iPhoneGeneration.iPodTouchUnknown:
			case iPhoneGeneration.iPhoneUnknown:
			case iPhoneGeneration.iPhone:
			case iPhoneGeneration.iPhone3G:
			case iPhoneGeneration.iPhone3GS: 
			case iPhoneGeneration.iPodTouch1Gen:
			case iPhoneGeneration.iPodTouch2Gen:
			case iPhoneGeneration.iPodTouch3Gen:
				isSuperLow = true;
				QualitySettings.SetQualityLevel (1, true);
			break;
			
			
			
			case iPhoneGeneration.iPhone4:	
			case iPhoneGeneration.iPodTouch4Gen :
				isSuperLow = true;
				QualitySettings.SetQualityLevel (1, true);
			break;
			case iPhoneGeneration.iPhone4S:
			QualitySettings.SetQualityLevel (2, true);
			break;
			case iPhoneGeneration.iPhone5:
			case iPhoneGeneration.iPodTouch5Gen:
				 QualitySettings.SetQualityLevel (3, true);  
			break;
 
		}
		
	#endif
	
}
	function SetLowFPS(){
		Application.targetFrameRate = 30;
	}
	function SetHighFPS(){
		Application.targetFrameRate = -1;
	}
	function ClipCameraNear(){
		var mainCameraGameObject:GameObject = GameObject.FindWithTag ("MainCamera");	
		mainCameraGameObject.camera.farClipPlane = 800.0;
	}
	function ClipCameraFar(){
		var mainCameraGameObject:GameObject = GameObject.FindWithTag ("MainCamera");	
		mainCameraGameObject.camera.farClipPlane = 2500.0;
	}
	function ShowTagged(){
		if(!tagged)
		return;
		
		for(var g:GameObject in tagged){
			g.SetActive(true);
		}
	}
	function HideTagged(){
		tagged = GameObject.FindGameObjectsWithTag("HiResWorld");
		for(var g:GameObject in tagged){
			g.SetActive(false);
		}
	}
	//when debugging
	function OnGUI()
	{
	
			GUILayout.BeginHorizontal ("box");
	    	GUILayout.BeginVertical ();
	     if(!hideInterface){
		      /*  if (GUILayout.Button ("1 Bears",   GUILayout.Height(50))){
					PlayerPrefs.SetInt("totalBears", 1);
					Application.LoadLevel(Application.loadedLevelName);
				}
				if (GUILayout.Button ("3 Bears",   GUILayout.Height(50))){
						PlayerPrefs.SetInt("totalBears", 3);
						Application.LoadLevel(Application.loadedLevelName);
				}
				if (GUILayout.Button ("5 Bears",   GUILayout.Height(50))){
						PlayerPrefs.SetInt("totalBears", 5);
						Application.LoadLevel(Application.loadedLevelName);
				}
		        if (GUILayout.Button ("10 Bears",   GUILayout.Height(50))){
						PlayerPrefs.SetInt("totalBears", 10);
						Application.LoadLevel(Application.loadedLevelName);
				}
				if (GUILayout.Button ("15 Bears",   GUILayout.Height(50))){
						PlayerPrefs.SetInt("totalBears", 15);
						Application.LoadLevel(Application.loadedLevelName);
				}
		
				if (GUILayout.Button ("20 Bears",   GUILayout.Height(50))){
						PlayerPrefs.SetInt("totalBears", 20);
						Application.LoadLevel(Application.loadedLevelName);
				}
					if (GUILayout.Button ("25 Bears",   GUILayout.Height(50))){
							PlayerPrefs.SetInt("totalBears", 25);
							Application.LoadLevel(Application.loadedLevelName);
					}
		 	*/
													
			}else{
					if (GUILayout.Button ("show UI",   GUILayout.Height(50))){
							hideInterface = false;
					}
			}
			GUILayout.EndVertical ();
			if(!hideInterface){
	    		
				GUILayout.BeginVertical ();
				var buttonHeight:int = 40;
				var names:String[] = QualitySettings.names;
		    	for (var i:int = 0; i < names.Length; i++)
			    {
			        if (GUILayout.Button (names[i],   GUILayout.Height(buttonHeight)))
			            QualitySettings.SetQualityLevel (i, true);
			    }
			
			  
			 /*
				if (GUILayout.Button ("CCTV",   GUILayout.Height(50))){
						var go:GameObject = GameObject.FindWithTag("POVCamera");
						if(go != null){
							var cam:Camera = go.GetComponent(Camera);
							if(cam){
							cam.enabled = !cam.enabled;
							}
						}
				}
			 */
				GUILayout.EndVertical ();
			

					GUILayout.BeginVertical ();
										
										if (GUILayout.Button ("lowRes",   GUILayout.Height(buttonHeight)))
										SetLowResolution();
											
												if (GUILayout.Button ("hiRes",   GUILayout.Height(buttonHeight)))
													SetHighResolution();
													
													if (GUILayout.Button ("lowFPS",   GUILayout.Height(buttonHeight)))
														SetLowFPS();
														
														if (GUILayout.Button ("highFPS",   GUILayout.Height(buttonHeight)))
															SetHighFPS();
											
											
					GUILayout.EndVertical ();
					if(displayClipping){				
						GUILayout.BeginVertical ();
										
											if (GUILayout.Button ("hideObj",   GUILayout.Height(buttonHeight)))
												HideTagged();
											
											if (GUILayout.Button ("showObj",   GUILayout.Height(buttonHeight)))
												ShowTagged();
													
											if (GUILayout.Button ("clipnear",   GUILayout.Height(buttonHeight)))
												ClipCameraNear();
											
											if (GUILayout.Button ("clipfar",   GUILayout.Height(buttonHeight)))
												ClipCameraFar();
											
											
						GUILayout.EndVertical ();
					}
					GUILayout.BeginVertical ();
					if (GUILayout.Button ("hide UI",   GUILayout.Height(50))){
							hideInterface = true;
					}
					
					if (GUILayout.Button ("go start",   GUILayout.Height(50))){
						Application.LoadLevel("FirstScene");	 
					}
					/*
					if (GUILayout.Button ("Stick Cntl",   GUILayout.Height(50))){
						Application.LoadLevel("goldieStickLevel");	 
					}*/
					GUILayout.EndHorizontal();
			}
 	
		}
