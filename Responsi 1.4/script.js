$(document).ready(function() {
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
});

let dataPasien = [
    { nama: "Budi Santoso", usia: 30, gender: "Laki-laki", diagnosa: "Demam Ringan" },
    { nama: "Sarah Putri", usia: 22, gender: "Perempuan", diagnosa: "Alergi Debu" },
    { nama: "Doni Pratama", usia: 45, gender: "Laki-laki", diagnosa: "Hipertensi" },
    { nama: "Tiara Andini", usia: 27, gender: "Perempuan", diagnosa: "Maag" }
];

let dataJadwal = [
    { jam: "08:00", pasien: "Ahmad Dani", dokter: "Dr. Andi", status: "Selesai", tipe: "success" },
    { jam: "09:30", pasien: "Luna Maya", dokter: "Dr. Siti", status: "Sedang Diperiksa", tipe: "warning" },
    { jam: "10:15", pasien: "Raffi Ahmad", dokter: "Dr. Andi", status: "Menunggu", tipe: "secondary" },
    { jam: "13:00", pasien: "Deddy C", dokter: "Dr. Budi", status: "Terjadwal", tipe: "primary" }
];

const tabelBody = document.getElementById('tabelPasien');
const formPasien = document.getElementById('pasienForm');
const myModal = new bootstrap.Modal(document.getElementById('formModal'));
let myChart;

window.switchPage = function(pageName, element) {
    document.getElementById('view-main').classList.add('d-none');
    document.getElementById('view-jadwal').classList.add('d-none');
    document.querySelectorAll('.list-group-item').forEach(el => el.classList.remove('active'));
    
    if (pageName === 'main') {
        document.getElementById('view-main').classList.remove('d-none');
        document.getElementById('page-title').innerText = "Dashboard & Data Pasien";
        if(myChart) myChart.resize(); 
    } else if (pageName === 'jadwal') {
        document.getElementById('view-jadwal').classList.remove('d-none');
        document.getElementById('page-title').innerText = "Jadwal Pemeriksaan";
        renderJadwal(); 
    }
    
    if(element) element.classList.add('active');
}

function renderJadwal() {
    const container = document.getElementById('jadwal-container');
    container.innerHTML = '';
    
    dataJadwal.forEach(item => {
        let html = `
            <div class="timeline-item">
                <span class="time-badge"><i class="far fa-clock"></i> ${item.jam} WIB</span>
                <div class="card border-0 shadow-sm bg-light">
                    <div class="card-body p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="fw-bold mb-1">${item.pasien}</h6>
                            <small class="text-muted">Dokter: ${item.dokter}</small>
                        </div>
                        <span class="badge bg-${item.tipe} rounded-pill">${item.status}</span>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

function initChart() {
    const ctx = document.getElementById('pasienChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Laki-laki', 'Perempuan'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#4e73df', '#ff6b6b'],
                borderWidth: 0, hoverOffset: 10
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '75%',
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
        }
    });
}

function updateDashboard() {
    tabelBody.innerHTML = '';
    let countLaki = 0, countPerempuan = 0;

    dataPasien.forEach((pasien, index) => {
        if(pasien.gender === 'Laki-laki') countLaki++; else countPerempuan++;
        let badgeClass = pasien.gender === 'Laki-laki' ? 'badge-gender-l' : 'badge-gender-p';
        let iconGender = pasien.gender === 'Laki-laki' ? '<i class="fas fa-mars"></i>' : '<i class="fas fa-venus"></i>';

        let row = `
            <tr>
                <td class="text-muted fw-bold ps-4">${index + 1}</td>
                <td class="fw-bold text-dark">${pasien.nama}</td>
                <td class="text-muted">${pasien.usia} Thn</td>
                <td><span class="${badgeClass}">${iconGender} ${pasien.gender}</span></td>
                <td class="text-secondary">${pasien.diagnosa}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-light text-warning btn-action shadow-sm" onclick="editPasien(${index})"><i class="fas fa-pen-to-square"></i></button>
                    <button class="btn btn-light text-danger btn-action shadow-sm" onclick="hapusPasien(${index})"><i class="fas fa-trash-can"></i></button>
                </td>
            </tr>
        `;
        tabelBody.innerHTML += row;
    });

    document.getElementById('count-total').innerText = dataPasien.length;
    document.getElementById('count-male').innerText = countLaki;
    document.getElementById('count-female').innerText = countPerempuan;
    myChart.data.datasets[0].data = [countLaki, countPerempuan];
    myChart.update();
}

window.bukaModalTambah = function() {
    document.getElementById('formModalLabel').innerText = "Tambah Pasien Baru";
    formPasien.reset();
    document.getElementById('pasienIndex').value = "";
    myModal.show();
}

formPasien.addEventListener('submit', function(event) {
    event.preventDefault();
    let index = document.getElementById('pasienIndex').value;
    let pasienBaru = {
        nama: document.getElementById('nama').value,
        usia: document.getElementById('usia').value,
        gender: document.getElementById('gender').value,
        diagnosa: document.getElementById('diagnosa').value
    };

    if (index === "") dataPasien.push(pasienBaru);
    else dataPasien[index] = pasienBaru;

    updateDashboard();
    myModal.hide();
});

window.editPasien = function(index) {
    document.getElementById('formModalLabel').innerText = "Edit Data Pasien";
    document.getElementById('pasienIndex').value = index;
    document.getElementById('nama').value = dataPasien[index].nama;
    document.getElementById('usia').value = dataPasien[index].usia;
    document.getElementById('gender').value = dataPasien[index].gender;
    document.getElementById('diagnosa').value = dataPasien[index].diagnosa;
    myModal.show();
}

window.hapusPasien = function(index) {
    if (confirm(`Yakin hapus data pasien: ${dataPasien[index].nama}?`)) {
        dataPasien.splice(index, 1);
        updateDashboard();
    }
}

initChart();
updateDashboard();
renderJadwal();