// 
//  ChildrenAssignment.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-04-26.
//  Copyright 2012 fayju. All rights reserved.
// 
#pragma strict
var children:Transform[];
function Awake () {
	for(var t:Transform in children){
		t.parent = transform;
	}
}