// ambil element wrapper
const wrapper = document.querySelector(`.wrapper`);
const form = document.querySelector(`.container form`);

// tampilkan cards
function loadProjects() {
  let index = 1;
  let allCardsHTML = ``;

  // proses looping
  while (true) {
    const key = `projectData-${index}`; // projectData-1, projectData-2 .. dst
    const savedProject = localStorage.getItem(key);
    if (!savedProject) break; // jika local storage ga ada, hentikan looping!

    // tampilkan semua projects yang valid, lewati yang rusak.
    let projects;
    try {
      projects = JSON.parse(savedProject);
    } catch (err) {
      console.error(`💥 Gagal parsing ${key}:`, err.message);
      index++; // akumulator gagal (skip ke data selanjutnya)
      continue;
    }
    // 💡 Bisa dianalogikan kayak lagi nyortir berkas!
    // - Kalau map-nya kosong, kamu stop nyari.
    // - Tapi kalau isinya rusak, kamu lewatin dan lanjut ke map selanjutnya.

    const { nameIN, descIN, imgDataIN, startDateIN, endDateIN, techIN } =
      getData(projects);

    const monthsIN =
      (endDateIN.getFullYear() - startDateIN.getFullYear()) * 12 +
      (endDateIN.getMonth() - startDateIN.getMonth());
    // selisih tahun -> 2025 - 2023 = 2 → 2 * 12 = 24 bulan
    // selisih bulan -> 7 - 3 = 4 bulan
    // tambahin -> 24 + 4 = 28 bulan

    const techSpan = techIN
      .map((tech) => {
        const [name, icon] = dataTech[tech.toLowerCase()] || [tech, ``];
        return icon || `<span>${name}</span>`;
      })
      .join(``);

    // PROSES LOOP!
    // 1. tech = `js` (pasti huruf kecil, karena dari checkbox)
    // 2. tech.toLowerCase() -> `js`
    // 3. dataTech[`js`] -> [JavaScript, (element icon)] -> array
    // 4. [name, icon] -> `JavaScript`, (element icon) -> data string

    // DILUAR LOOP
    // 1. join(``)
    // [</span>(element icon)</span>, ... ]  -> hasil looping (array di join)

    allCardsHTML += `
      <div class="cards">
        <div class="cover" style="background-image: url(${imgDataIN});"></div>
        <h2>${nameIN}</h2>
        <span>durasi ${monthsIN} bulan</span>
        <p class="truncate">${descIN}</p>
        <div class="techs">${techSpan}</div>
        <div class="buttons">
          <button onclick="detailProject(${index})">Detail</button>
          <button onclick="deleteProject(${index})">Delete</button>
        </div>
      </div>
    `;
    index++; // akumulator sukses
  }

  wrapper.innerHTML =
    allCardsHTML || `<p class="none">Tidak ada proyek yang tersimpan.</p>`;
}

// fungsi sorting ulang
function reindexProjects() {
  // ambil semua key yang hanya diawali `projectData-`
  // -> theme, userToken, imageCache dll ❌ BUANG
  const allKeys = Object.keys(localStorage)
    .filter((key) => key.startsWith(`projectData-`)) // ..projectData-1
    .sort((a, b) => {
      const numA = parseInt(a.split(`-`)[1]); // pecah ["projectData", "3"][1] → 3 (int)
      const numB = parseInt(b.split(`-`)[1]);
      return numA - numB;
      // - Jika negatif, a ditempatkan sebelum b
      // - Jika positif, b ditempatkan sebelum a
      // - Kalau 0, urutannya tetap
    });

  // ambil valuenya disini berdasarkan key urut
  const allProjects = allKeys.map((key) => {
    return JSON.parse(localStorage.getItem(key));
  }); // key urut -> value yang di parse dulu

  // hapus semua projectData dari localStorage
  allKeys.forEach((key) => localStorage.removeItem(key));

  // simpan ulang dengan index yang baru
  allProjects.forEach((projects, i) => {
    localStorage.setItem(`projectData-${i + 1}`, JSON.stringify(projects));
  });
}

// otomatis focus ke id
function scrollToSection(id) {
  window.location.hash = id;
}

// panggil saat halaman dimuat
function load(id) {
  form.reset();
  reindexProjects();
  loadProjects();
  scrollToSection(id);
}

load(`header`);
