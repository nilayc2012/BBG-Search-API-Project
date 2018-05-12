var index=0;
var selectedLink=null;

function startSearch()
{
	index=0;
	sendSearchRequest(false);
	document.getElementById("indexes").style.display="block";
}

function changePageIndex(change)
{
	if(index+change<0)
	{
		return;
	}
	
	index = index + change;
	
	sendSearchRequest(false);
}

function goToPageIndex(ind)
{	
	index = ind;
	
	if(selectedLink!=null)
	{
		selectedLink.className="link";
	}
	
	selectedLink = document.getElementById("link-"+index);
	selectedLink.className= "linkSelected";
	
	sendSearchRequest(true);
}

function deleteAllPrevImages()
{

	var element = document.getElementById("output");
	element.innerHTML="";
	
}

function deleteAllPrevLinks()
{
	var element = document.getElementById("links");
	element.innerHTML="";

}

function generatePageLinks()
{

	var mainDiv = document.getElementById("links");
	
		for(var i=index;i<index+5;i++)
		{
			if(i>=10)
			{
				return;
			}
			
			var element = document.createElement("a");
			element.href="#";
			if(i==index)
			{
				element.className = "linkSelected";
			}
			else
			{
				element.className = "link";
			}
			element.id="link-"+i;
			element.innerHTML=(i+1).toString();
			
			element.addEventListener("click", function(e){

				goToPageIndex(parseInt(e.target.id.split("-")[1]));
			});

			mainDiv.appendChild(element);
		}
	
	
}

function sendSearchRequest(flag)
{
	
	if(!flag)
	{
		deleteAllPrevLinks();
		generatePageLinks();
		
	}
	
	deleteAllPrevImages();
	
	var apiKey = 'AIzaSyBF3nB_idp7tBFEWV6stsljHsgVZ_iaUlU';
	var searchEngineId = '015819465380171236291:ujduekneehm';
	var numResultsPerPage = document.getElementById("num-of-items-per-page").value;
	var pageIndex = index * numResultsPerPage+1;

	var xhr = new XMLHttpRequest();
	var param = "key="+apiKey+"&q="+document.getElementById("query").value+"&cx="+searchEngineId+"&searchType=image&start="+pageIndex+"&num="+numResultsPerPage;
	var url = "https://www.googleapis.com/customsearch/v1?"+param;
	console.log(url);
	var mainDiv = document.getElementById("output");
					
					
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
		//console.log(xhr.responseText);
				var results = JSON.parse(xhr.responseText)["items"];
				
				if(results!=null)
				for(var i=0;i<results.length;i++)
				{
					var element = document.createElement("IMG");
					element.id="image-"+i;
					element.className = "images";
					element.src = results[i]["image"]["thumbnailLink"];
					element.width = results[i]["image"]["thumbnailWidth"];
					element.height = results[i]["image"]["thumbnailHeight"];
					mainDiv.appendChild(element);
				}
			}
		
		if (xhr.status === 403) {
			alert("Daily Search Limit Reached. Please change the searchEngineId at line 102 of the index.js file with a new one who's daily usage limit hasn't been reached");
		}
	};
					
	xhr.open("GET", url);
	xhr.send();


}