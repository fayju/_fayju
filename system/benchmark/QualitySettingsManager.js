#pragma strict
// 
//  QualitySettingsManager.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-06-30.
//  Copyright 2012 fayju. All rights reserved.
// 

class QualitySettingsManager extends MonoBehaviour{
	var interfaceOn:boolean = true;
 var mainCamera:Camera;
	 var clouds:Renderer[];
	function Start () {
			//toggleProjectors();
	 /*
			//lower spec - hide clouds 
			var spec:int = 2;
				switch(iPhone.generation){
						case iPhoneGeneration.iPhone:
							 spec = 0;
						break;
						case iPhoneGeneration.iPhone3G:
						 	 spec = 0;
						break;
						case iPhoneGeneration.iPhone3GS:
						 	 spec = 0;
						break;
						case iPhoneGeneration.iPodTouch1Gen:
						 	 spec = 0;
						break;
						case iPhoneGeneration.iPodTouch2Gen:
						 	 spec = 0;
						break;
						case iPhoneGeneration.iPodTouch3Gen:
						 	 spec = 0;
						break;
						case iPhoneGeneration.iPodTouch4Gen:
						 	 spec = 0;
						break;
						case iPhoneGeneration.iPhone4:
						 	 spec = 0;
						break;
						case iPhoneGeneration.iPad1Gen:
							 	 spec = 0;
						break;

					}
					if(spec < 1){
						QualitySettings.SetQualityLevel (1, true);
						//hideClouds();
					}else{
						//showClouds();
							QualitySettings.SetQualityLevel (3, true);
					}
					interfaceOn = false;
					
					*/
	}

	function OnGUI () 
	{

		if(interfaceOn){
			var buttonHeight:int = 50;
	    	var names = QualitySettings.names;
     		GUILayout.BeginHorizontal ("box");
	    	GUILayout.BeginVertical ();
	    	for (var i = 0; i < names.Length; i++)
		    {
		        if (GUILayout.Button (names[i],   GUILayout.Height(buttonHeight)))
		            QualitySettings.SetQualityLevel (i, true);
		    }
			if (GUILayout.Button ("interface",   GUILayout.Height(buttonHeight)))
					toggleInterface();
					
					
	    	GUILayout.EndVertical ();
	/*
			GUILayout.BeginVertical();
			if (GUILayout.Button ("clouds on",   GUILayout.Height(buttonHeight)))
					showClouds();
			if (GUILayout.Button ("clouds off",   GUILayout.Height(buttonHeight)))
					hideClouds();
				
					if (GUILayout.Button ("short",   GUILayout.Height(buttonHeight)))
						mainCamera.farClipPlane  = 500.0;
						if (GUILayout.Button ("medium",   GUILayout.Height(buttonHeight)))
							mainCamera.farClipPlane  = 1000.0;
							
								if (GUILayout.Button ("long",   GUILayout.Height(buttonHeight)))
									mainCamera.farClipPlane  = 2000.0;
									
									
										if (GUILayout.Button ("wide",   GUILayout.Height(buttonHeight)))
											mainCamera.fieldOfView  = 40.0;
											if (GUILayout.Button ("narrow",   GUILayout.Height(buttonHeight)))
												mainCamera.fieldOfView  = 35.0;
 
				
	
			GUILayout.EndVertical();*/
	    	GUILayout.EndHorizontal();
		}else{
			if(Input.touchCount >= 4 ){
				interfaceOn = true;
			}
		}
	}
	function hideClouds(){
		for(var r:Renderer in clouds){
			r.enabled  = false;
		}
	}
	function showClouds(){
			for(var r:Renderer in clouds){
				r.enabled  = true;
			}
	}
	function toggleInterface(){
	 
 
		interfaceOn = !interfaceOn;
	}
}
