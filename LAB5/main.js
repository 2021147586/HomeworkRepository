let count = 1;

fetch('product.json')
.then(response => response.json())
.then(json => init(json))
.catch(error => {
	console.log('Error: ' + error)
});

window.onscroll = () => {
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
		loader();
	}
}
	
let categoryGroup = [];
let searchGroup = [];


const category = document.querySelector('#categoryChoose');
const searchTerm = document.querySelector('#searchTermChoose');
const buttonCheck = document.querySelector('#searchResult');
const main = document.querySelector('#mainPart');

function init(product) {
	let recentCategory = category.value;
	let recentSearch = '';

	searchGroup = product;
	updater();
	
	buttonCheck.addEventListener('click', categoryFiltering);
	
	function categoryFiltering (e) {
		e.preventDefault();
		
		count = 1;
		categoryGroup = [];
		searchGroup = [];
		
		if (category.value === recentCategory && searchTerm.value.trim() === recentSearch) {
			return;
		} 
		else {
			recentCategory = category.value;
			recentSearch = searchTerm.value.trim();
			if (category.value == 'All') {
				  categoryGroup = product;
				  selectTerm();
			} 
			else {
				const lowerCaseType = category.value.toLowerCase();
        		categoryGroup = product.filter( product => product.type === lowerCaseType );
				selectTerm();
			}
		}
	}
}
	

function selectTerm() {
	if (searchTerm.value.trim() === '') {
		searchGroup = categoryGroup;
	} 
	else {
		let lower_term = searchTerm.value.trim().toLowerCase();
		searchGroup = categoryGroup.filter(product => product.name.includes(lower_term));
	}	
	updater();
}

function updater() {
	while (main.firstChild) {
		main.removeChild(main.firstChild);
	}
	
	if (searchGroup.length === 0) {
		const msg = document.createElement('div');
		msg.className = 'msg';
		msg.innerHTML = 'No results to display';
		main.appendChild(msg);
	} 
	else {
		for (const product of searchGroup) {
			fetchBlob(product);
		}
	}
}

function loader () {
	for (let y=8*(count - 1); y<count*8; y++) {
		if (y >= searchGroup.length) {
			break;
		}
		fetchBlob(searchGroup[y]);
	}
	
	if (8*(count - 1) >= searchGroup.length) {
		count = searchGroup.length;
	} else {
		count += 1;
	}
}


function fetchBlob(product) {
	const url = product.image;
	
	fetch(url)
	.then(response => {
		if (response.ok == false) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		return response.blob();
	})
	.then(blob => {
		show(URL.createObjectURL(blob), product.name, product.price, product.info);
	})
	.catch(error => {
		console.log('Error: ' + error);
	});
}


function show(imageURL, pname, pprice, pinfo) {
	const div = document.createElement('div');
	const img = document.createElement('img');
	
	div.className = 'displayedItem';
	div.id = pname + '/' + pprice + '/' + pinfo;
	div.addEventListener('click', explain);
	
	img.src = imageURL;
	img.alt = pname;
	img.className = 'newitem';
	
	main.appendChild(div);
	div.appendChild(img);
}

function explain(e) {
	let targetID = e.target.parentNode.id;
	let splitList = targetID.split('/');
	
	if (targetID.indexOf('explain-') === -1) {
		e.target.parentNode.id = 'explain-' + targetID;
		
		const detailed = document.createElement('div');
		detailed.className = 'item_detailed';
		let str = '<br>이름: &nbsp;' + splitList[0] + '<br><br>가격: &nbsp;' + splitList[1] + ' 원<br><br>설명: &nbsp;' + splitList[2];
		detailed.innerHTML = str;
		document.getElementById(e.target.parentNode.id).appendChild(detailed);
	} 
	else {
		e.target.parentNode.id = targetID.substring(8);
		let check = document.getElementById(e.target.parentNode.id);
		check.removeChild(check.childNodes[1]);
	}
}