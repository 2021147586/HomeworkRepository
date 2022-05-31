let count = 1;

fetch('product.json')
.then(response => response.json())
.then(json => init(json))
.catch(error => {
	console.log('Error: ' + error)
});

window.onscroll = () => {
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
		load();
	}
}

	
let categoryGroup = [];
let filterGroup = [];


const category = document.querySelector('#category');
const searchTerm = document.querySelector('#searchTerm');
const buttonCheck = document.querySelector('#searchResult');
const main = document.querySelector('#mainPart');

function init (product) {
	let recentCategory = category.value;
	let recentSearch = '';

	filterGroup = product;
	update();
	
	buttonCheck.addEventListener('click', selectTerm)

	if (category.value === recentCategory && searchTerm.value.trim() === recentSearch) {
		return;
	} 
	else {
		recentCategory = category.value;
		recentSearch = searchTerm.value.trim();
		if (category.value === 'All') {
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
	

function selectTerm() {
	if (searchTerm.value.trim() !== '') {
		let lower_term = searchTerm.value.trim().toLowerCase();
		filterGroup = categoryGroup.filter(product => product.name.includes(lower_term));
		/*
		for (let i = 0; i < categoryGroup.length; i++) {
			if (categoryGroup[i].name.indexOf(lower_term) !== -1) {
				filterGroup.push(categoryGroup[i]);
			}
		}
		*/
	} else {
		filterGroup = categoryGroup;
	}
	
	update();
}

function update() {
	while (main.firstChild == true) {
		main.removeChild(main.firstChild);
	}
	
	if (filterGroup.length === 0) {
		const msg = document.createElement('p');
		msg.innerHTML = 'No results to display';
		main.appendChild(msg);
	} else {
		console.log(filterGroup.length);
		load();
	}
}

function load () {
	for (let i = (count - 1) * 6; i < count * 6; i++) {
		if (i >= filterGroup.length) {
			break;
		}
		fetchBlob(filterGroup[i]);
	}
	
	if ((count - 1) * 6 >= filterGroup.length) {
		count = filterGroup.length;
	} else {
		count = count + 1;
	}
}

function fetchBlob(product) {
	const url =`image/${product.image}`;
	
	fetch(url)
	.then(response => {
		if (!response.ok) {
			throw new Error('HTTP error: $(response.status)');
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


function show (imageURL, productname, productprice, productinfo) {
	const p = document.createElement('p');
	const img = document.createElement('img');
	
	p.className = 'item_display';
	p.id = productname + '/' + productprice + '/' + productinfo;
	p.addEventListener('click', explain);
	
	img.src = imageURL;
	img.alt = productname;
	img.className = 'newitem';
	
	main.appendChild(p);
	p.appendChild(img);
}

function explain (e) {
	let targetID = e.target.parentNode.id;
	let detaillist = targetID.split('/');
	
	if (targetID.indexOf('explain-') === -1) {
		e.target.parentNode.id = 'explain-' + targetID;
		
		const detail = document.createElement('p');
		detail.className = 'item_detail';
		let str = '<br>이름: &nbsp;' + detaillist[0] + '<br><br>가격: &nbsp;' + detaillist[1] + ' 원<br><br>설명: &nbsp;' + detaillist[2];
		detail.innerHTML = str;
		document.getElementById(e.target.parentNode.id).appendChild(detail);
	} else {
		e.target.parentNode.id = targetID.substring(8);
		let check = document.getElementById(e.target.parentNode.id);
		check.removeChild(check.childNodes[1]);
	}
}