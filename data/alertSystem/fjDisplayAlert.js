#pragma strict
// 
//  fjDisplayAlert.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-10-27.
//  Copyright 2012 fayju. All rights reserved.
// 
var alertLocation:String = "gameOverAll";
function Start () {
	yield WaitForSeconds(1.0);
	AlertsHandler.GetInstance().checkAlert(alertLocation);
}

 