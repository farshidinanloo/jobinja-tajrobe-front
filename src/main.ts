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
		newEl.classList.add('experience-container');
		newEl.innerHTML = `<h2 class="experience-title">تجربه های کاری</h2>`;
		newEl.innerHTML += `<div id="experience-list" class="experience-list experience-list--loading">...لطفا صبر کنید</div>`;
		jobView.after(newEl);

		getData(companyName)
			.then((res) => {
				console.log({ res });
				const loadingElement = document.getElementById(
					'experience-list'
				) as HTMLDivElement;
				loadingElement.remove();
				if (res.length > 0) {
					newEl.innerHTML += generateExperienceList(res);
				} else {
					newEl.innerHTML += `<div class="experience-list">موردی یافت نشد</div>`;
				}
				jobView.after(newEl);
			})
			.catch((err) => {
				const loadingElement = document.getElementById(
					'experience-list'
				) as HTMLDivElement;
				loadingElement.remove();
				newEl.innerHTML += `<div class="experience-item">
				<h3 class='title'>خطا</h3>
				<p>${err.message}</p>
			</div>`;
				jobView.after(newEl);
			});
	}
}, 1000);

const getData = async (companyName: string) => {
	const response = await fetch(
		`https://jobinja-tajrobe.liara.run/company?name=${companyName.trim()}`
		// `http://localhost:3000/company?name=${companyName.trim()}`
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
							  <p>${item.body
									.split('\n')
									.map((bodyItem: string) => `<div>${bodyItem}</div>`)
									.join('')}
									</p>
					</li>
			`;
	});

	listHtml += '</ul>';
	return listHtml;
}
