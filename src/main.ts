import './style.css';

let MAX_TRY_COUNT = 15;

let nameElement = null;
let jobView: any = null;

let timeout = setInterval(() => {
	nameElement = document.querySelector(
		'.c-companyHeader__name'
	) as HTMLDivElement;
	jobView = document.querySelector('.c-jobView') as HTMLDivElement;

	MAX_TRY_COUNT -= 1;

	if ((nameElement && jobView) || MAX_TRY_COUNT < 0) {
		clearInterval(timeout);
	}

	if (nameElement && jobView) {
		const newEl = document.createElement('div');
		const companyName = nameElement.innerText.split('|')[0];
		getData(companyName).then((res) => {
			console.log({ res });
			newEl.classList.add('experience-container');
			newEl.innerHTML = `<h2 class="experience-title">تجربه های کاری</h2>`;
			newEl.innerHTML += generateExperienceList(res);
			jobView.after(newEl);
		});
	}
}, 1000);

const getData = async (companyName: string) => {
	const response = await fetch(
		`https://jobinja-tajrobe.liara.run/company?name=${companyName.trim()}`
	);
	const json = await response.json();
	return json;
};

function generateExperienceList(data: any) {
	let listHtml = '<ul class="experience-list">';

	data.forEach((item: any) => {
		listHtml += `
					<li class="experience-item">
							<h3 class='title'>${item.title}</h3>
							<p class='date'>${item.date}</p>
							<p class='content'>${item.body}</p>
					</li>
			`;
	});

	listHtml += '</ul>';
	return listHtml;
}
