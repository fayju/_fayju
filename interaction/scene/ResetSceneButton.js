#pragma strict
// 
//  ResetSceneButton.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-07-31.
//  Copyright 2012 fayju. All rights reserved.
// 
class ResetSceneButton extends fjPulseButton{
 	function doAction(){
		
		super.doAction();
		  Application.LoadLevel(Application.loadedLevelName);
	}
	
}