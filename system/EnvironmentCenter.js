// 
//  EnvironmentCenter.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-01-12.
//  Copyright 2012 fayju. All rights reserved.
// 
#pragma strict
private static var defaultCenter : EnvironmentCenter;
static function DefaultCenter () : EnvironmentCenter {
    // If the defaultCenter doesn't already exist, we need to create it
    if (!defaultCenter) {
        // Because the NotificationCenter is a component, we have to create a GameObject to attach it to.
        var qualityObject: GameObject = new GameObject("Device Center");
        // Add the NotificationCenter component, and set it as the defaultCenter
        defaultCenter = qualityObject.AddComponent(EnvironmentCenter);
    } 
    return defaultCenter;
}
function setUpEnvironment():void{

	     	Screen.sleepTimeout = 0.0;
			Screen.autorotateToLandscapeLeft = false;;;
			Screen.autorotateToLandscapeRight = false;

			Screen.autorotateToPortraitUpsideDown = false;
			Screen.autorotateToPortrait = false;
 
	 		//	Screen.orientation = ScreenOrientation.LandscapeLeft;

	#if UNITY_ANDROID
	//	modelName = iPhoneSettings.model;
	#endif
}

//function OnGUI():void {
	//GUI.Label(Rect(10, 60, 500, 200), "system:" + iPhoneSettings.systemName);
//}

//EnvironmentCenter.DefaultCenter().RateTheGame(); -- the next button
/*function RateTheGame():void{
	#if UNITY_IPHONE
		var rates:int = PlayerPrefs.GetInt("rateCalls", 0);
		rates++;
	 	PlayerPrefs.SetInt("rateCalls", rates);
		var hours:int = 0;
		if(rates > 12){
			hours = 3;
		}
		//http://itunes.apple.com/no/app/a-monster-ate-my-homework/id403505094?mt=8
	 	var rateId:String = "403505094";
//		EtceteraBinding.askForReview(11,hours, "Like the game?", "If you want more levels and features, please help us by rating A Monster Ate My Homework", "itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id="+rateId );
	#endif
}*/
//EnvironmentCenter.DefaultCenter().allowMenuRotate();
function allowMenuRotate():void{
 
		Screen.autorotateToLandscapeLeft = true;;;
		Screen.autorotateToLandscapeRight = true;
		Screen.autorotateToPortraitUpsideDown = true;
		Screen.autorotateToPortrait = true;
   
}

//EnvironmentCenter.DefaultCenter().stopMenuRotate();
function stopMenuRotate():void{
 
		Screen.autorotateToLandscapeLeft = false;;;
		Screen.autorotateToLandscapeRight = false;
		Screen.autorotateToPortraitUpsideDown = false;
		Screen.autorotateToPortrait = false;
   
}

function checkOrientateDevice():void{
	//are we using ad + mobclix
 	//this is going to change 
	//ORIENTATION
	var isUpdate:boolean = false;
 	isUpdate = true;
 	orientateDevice();
  


}
function orientateDevice():void {
	var orientationUpdated:boolean = false;
	
	switch(Input.deviceOrientation){
		case DeviceOrientation.Portrait:
			if(Screen.orientation != ScreenOrientation.Portrait){
				Screen.orientation = ScreenOrientation.Portrait;
				orientationUpdated = true;
				//AdvertizingCenter.DefaultCenter().setOrientationVisibility(false);
			}
		break;
		case DeviceOrientation.PortraitUpsideDown:
			if(Screen.orientation != ScreenOrientation.PortraitUpsideDown){ 
				Screen.orientation = ScreenOrientation.PortraitUpsideDown;
				//AdvertizingCenter.DefaultCenter().setOrientationVisibility(false);
				orientationUpdated = true;
			}
		break;
		/*case DeviceOrientation.LandscapeRight:
			if(Screen.orientation != ScreenOrientation.LandscapeRight){
				Screen.orientation = ScreenOrientation.LandscapeRight;
				//AdvertizingCenter.DefaultCenter().setOrientationVisibility(true);
				orientationUpdated = true;
			}
		break;
		case DeviceOrientation.LandscapeLeft:
			if(Screen.orientation != ScreenOrientation.LandscapeLeft){
				Screen.orientation = ScreenOrientation.LandscapeLeft;
				//AdvertizingCenter.DefaultCenter().setOrientationVisibility(true);
				orientationUpdated = true;
			}
		break;*/
 
	}
	#if UNITY_IPHONE
	//iAds tapjoy?
		 
	#endif
	if(orientationUpdated){
		 //	NotificationCenter.DefaultCenter().PostNotification(gameObject, "OnUpdateOrientation");
	}
}
function forcePhone():boolean{
	return !Application.isEditor;
}
function hasGCAccess():boolean {

//	var bool:boolean = false;
	#if UNITY_IPHONE
	var bool:boolean =  (iPhone.generation == iPhoneGeneration.iPhone || iPhone.generation == iPhoneGeneration.iPhone3G  ||  iPhone.generation == iPhoneGeneration.iPodTouch1Gen ); 
	if(!bool){
		return true;
	}

	#endif
	return false;
	}