var itemsGlobal
var tableDataGlobal
var draggingID

//fetching menu list
$.getJSON('data/menuList.json', function (menuDish){
    	
    console.log(menuDish);
	itemsGlobal = menuDish;;

	$.each(menuDish,function(i,f){
    	$('.rightColumn').append(
    		'<div class="menuCard" draggable="true" ondragstart="drag(event,'+f.itemID+
    		')" id="item-'+f.itemID+
    		'"><h3>'+f.Name+
    		'</h3><p>'+ f.Course +
    		'</p><p>Price: '+ f.Price +
    		'</p></div>'
    	);
    });
});

//fetching table list
$.getJSON('data/tableData.json', function (tableData){
	// return getTables(tableData);
	tableDataGlobal = tableData;
    $.each(tableData,function(i,f){

    	itemsCount = getItemsCount(f.items);
    	f.Cost = getTableCost(f.items);
    	$('.leftColumn').append(
    		'<div class="tableCard" id="Table-'+f.ID+
    		'" ondrop="drop(event,'+f.ID+
    		')"onclick="showForm('+ f.ID+')" ondragover="allowDrop(event)" oncl><h3>Table-'+f.ID+
    		'</h3><p>Total items: '+ itemsCount +
    		'</p><p>Total Cost: '+f.Cost+
    		'</p></div>'
    	);
		// return home to home page function
    	$("body").append('<div id="formId'+f.ID+'" style="display: none;">'+
    			'<div class="form_heading"><strong>Table-'+f.ID+'</strong><div class="close" onclick="returnHome('+f.ID+')">X</div></div><br>'+
        		'<form id="orderUpdate'+ f.ID+'" method="post" onsubmit="changeOrder(event,'+f.ID+')">'+
          			'<table>'+
            			'<tr>'+
              				'<td><strong>S. NO</strong></td>'+
              				'<td><strong>Price </strong></td>'+
              				'<td><strong>Quantity</strong></td>'+
            			'</tr>'+
        		'</form>'+

    		'</div>');

    	$.each(f.items,function(j,k){
		// showing data
    		$("#orderUpdate"+f.ID).append('<table><tr><td>'+(j+1)+
    			'</td><td>'+itemsGlobal[j].Name+
    			'</td><td><input name="item-'+(j+1)+
    			'_Count" type="text" value="'+k+'"/></td></tr></table><br>');
    	});

		//generate bill
    	$("#orderUpdate"+f.ID).append('<input style="float:right;float:bottom;" type="submit" value="Generate Bill">');
    });
});

// calculates the total items in table list
function getItemsCount(orderList)
{
	totalCount = 0;
	$.each(orderList,function(index,itemCount){
		totalCount = totalCount+itemCount;
	});
	return totalCount;
}

// calculates the total cost of the items in table list
function getTableCost(itemList)
{
	var totalCost = 0;
	$.each(itemList,function(index,itemCount){
		var i = itemsGlobal[index].Price;
		totalCost = totalCost + itemCount*i;
	});
	return totalCost;
}


// Table form funcitonality
function showForm(id){

	var i = 0;
	for(i = 0; i < tableDataGlobal[id-1].items.length; i++)
	{
		document.forms["orderUpdate"+id]['item-'+(i+1)+'_Count'].value = tableDataGlobal[id-1].items[i].toString();
	}
	
	// show table detail popup form 
	$("#formId"+id).css({
		'border' :'black',
		'background-color' : 'white',
		// 'visibility' : 'visible',
		'display' : 'block',
		'position' : 'absolute',
		'width': '400px',
		'height': '500px',
		'top': '100px',
		'left': '400px',
		'box-shadow': '800 160px 800px 0 rgba(1, 0.2, 0, 0.2)'
	});

	$('#orderUpdate'+id).css({'padding-left':'10px'});
	$("formId"+id).fadeIn(500);
	$('#container').fadeTo(500,0.5);
	alert("Go ahead");
}

function changeOrder(ev,id){
	ev.preventDefault();
	var table = tableDataGlobal[id-1];
	var i;

	for(i=0;i<table.items.length;i++)
	{
		table.items[i] = parseInt(document.forms["orderUpdate"+id]['item-'+(i+1)+'_Count'].value);
	}

	table.Cost = getTableCost(table.items);
	var tableID = "Table-" + (''+id);
	var tableHTML = getTableHTML(id);
	(document).getElementById(tableID).innerHTML = tableHTML;
	returnHome(id);
}

function returnHome(id)
{
	$("formId"+id).fadeOut(500);
	$('#container').fadeTo(500,1);

	$('#container').css({
		'visibility': 'visible'
	});

	$('body').css({
		'background-color' : 'white'
	})

	$("#formId"+id).css({
		'visibility': 'hidden'
	});
}

    
// Search functionality 
function searchTable(){
	var input,i,filter,a,txtValue;
	
	input = document.getElementById("tableInp");
	filter = input.value.toUpperCase();
	tables = document.getElementsByClassName("tableCard");
	console.log(tables);
	for(i = 0; i < tables.length; i++){
		a = tables[i].getElementsByTagName("h3")[0];
		txtValue = a.innerText || a.textContent;

		if(txtValue.toUpperCase().indexOf(filter) > -1)
		{
			tables[i].style.display = "";
		}
		else
		{
			tables[i].style.display = "none";
		}
	}

}

function searchMenu()
{
	var input,i,filter,a,txtvalue;
	input = document.getElementById("itemInp");
	filter = input.value.toUpperCase();
	items = document.getElementsByClassName("menuCard");
	for(i = 0; i< items.length; i++)
	{
		var dishNameElement = items[i].getElementsByTagName("h3")[0];
		dishName = dishNameElement.innerText || dishNameElement.textContent;
		
		
		var dishCourseElement = items[i].getElementsByTagName("p")[0];
		dishCourse = dishCourseElement.innerText || dishCourseElement.textContent;
		if(dishName.toUpperCase().indexOf(filter)>-1 || dishCourse.toUpperCase().indexOf(filter)>-1)
		{
			items[i].style.display = "";
		}
		else{
			items[i].style.display = "none";
		}
	}

}


// Drag and Drop functions

function allowDrop(ev) 
{
	ev.preventDefault();
}
function drag(ev,id) 
{
	//storing the reff on the dragged id
	ev.dataTransfer.setData("text", ev.target.id);
	draggingID = id;
	//console.log(draggingID);
}

function drop(ev,id) 
{
	ev.preventDefault();
	alert("Dropped!");
	//console.log(id);
	updateorder(draggingID,id);
	changeDivcontent(id);
	// ev.target.appendChild(document.getElementById(data));
}

// function to update order after droping it
function updateorder(drpItemID, drpzoneID)
{
	$.each(tableDataGlobal,function(i,f){
		if(parseInt(f.ID) == drpzoneID)
		{
			f.items[drpItemID-1] = f.items[drpItemID-1]+1;
			f.Cost = getTableCost(f.items);
		}
	});
}
// to show the updated data 
function changeDivcontent(tableid){
	var tableID = "Table-" + (''+tableid);
	var tableHTML = getTableHTML(tableid);
	(document).getElementById(tableID).innerHTML = tableHTML;
}

function getTableHTML(id){
	var table = tableDataGlobal[id-1];
	var tablecontent = '<h3>Table-'+table.ID+
	'</h3><p>Total items: '+getItemsCount(table.items)+
	'</p><p>Total Cost:'+ table.Cost+'</p>';
	return tablecontent;
}

