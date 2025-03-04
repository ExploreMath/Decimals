//cArray
function cArray()
{
}

//-------------------------------------------------------------------------------------------------
cArray.fMatch = function (vArray1, vArray2) 
{ 
	var i;

	if (vArray1.length != vArray2.length)
		return false;
	for (i = 0; i < vArray1.length; i++)
		if (vArray1[i] != vArray2[i])
			return false;
	return true;
};

//-------------------------------------------------------------------------------------------------
cArray.fFind = function (vArray, vProperty, vValue) 
{ 
	var i;

	for (i = 0; i < vArray.length; i++)
		if (vArray[i][vProperty] == vValue)
			return i;
	return -1;
};

//-------------------------------------------------------------------------------------------------
cArray.fRemove = function (vArray, vItem) 
{ 
	var i;

	i = vArray.indexOf(vItem);
	if (i != -1)
		vArray.splice(i, 1);
};

//-------------------------------------------------------------------------------------------------
cArray.fSwap = function (vArray, vIndex1, vIndex2) 
{ 
	var t;

	t = vArray[vIndex1];
	vArray[vIndex1] = vArray[vIndex2];
	vArray[vIndex2] = t;
};

//-------------------------------------------------------------------------------------------------
cArray.fRandomize = function (vArray) 
{ 
	var i;
	var j;

	for (i = 0; i < vArray.length - 1; i++)
	{
		j = i + Math.floor(Math.random() * (vArray.length - i));
		if (j != i)
			cArray.fSwap(vArray, i, j);
	}
};


//-------------------------------------------------------------------------------------------------
cArray.fFindTarget = function (vArray, vTarget) 
{ 
	var i;

	for (i = 0; i < vArray.length; i++)
		if (vArray[i] == vTarget)
			return i;
	return -1;
};