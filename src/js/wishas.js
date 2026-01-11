import {
    formattedDate,
    formattedName,
    generateRandomColor,
    generateRandomId,
    getCurrentDateTime,
    renderElement
} from "../utils/helper.js";
import {data} from "../assets/data/data.js";
import {comentarService} from "../services/comentarService.js";

export const wishas = () => {
    const wishasContainer = document.querySelector('.wishas');
    if (!wishasContainer) return;

    // locate DOM nodes according to repo's markup
    const [_, formWrapper] = wishasContainer.children[2].children;
    const form = formWrapper;
    const [peopleComentar, ___, containerComentar] = wishasContainer.children[3].children;
    const buttonForm = form.children[6];
    const pageNumber = wishasContainer.querySelector('.page-number');
    const [prevButton, nextButton] = wishasContainer.querySelectorAll('.button-grup button');

    const listItemBank = (data) => (
        `  <figure data-aos="zoom-in" data-aos-duration="1000">
                <img src=${data.icon} alt="bank icon animation">
                <figcaption>No. Rekening ${data.rekening.slice(0, 4)}xxxx <br>A.n ${data.name}</figcaption>
                <button data-rekening=${data.rekening} aria-label="copy rekening">Salin No. Rekening</button>
           </figure>`
    );

    const initialBank = () => {
        const wishasBank = wishasContainer.children[1];
        const [_, __, containerBank] = wishasBank.children;

        renderElement(data.bank, containerBank, listItemBank);

        containerBank.querySelectorAll('button').forEach((button) => {
            button.addEventListener('click', async (e) => {
                const rekening = e.target.dataset.rekening;
                try {
                    await navigator.clipboard.writeText(rekening);
                    button.textContent = 'Berhasil menyalin';
                } catch (error) {
                    console.log(`Error : ${error.message}`);
                } finally {
                    setTimeout(() => {
                        button.textContent = 'Salin No. Rekening';
                    }, 2000);
                }
            });
        });
    };

    const listItemComentar = (data) => {
        const name = formattedName(data.name);
        const newDate = formattedDate(data.date);
        let date = "";

        if (newDate.days < 1) {
            if (newDate.hours < 1) {
                date = `${newDate.minutes} menit yang lalu`;
            } else {
                date = `${newDate.hours} jam, ${newDate.minutes} menit yang lalu`;
            }
        } else {
            date = `${newDate.days} hari, ${newDate.hours} jam yang lalu`;
        }

        return ` <li data-aos="zoom-in" data-aos-duration="1000">
                     <div style="background-color: ${data.color}">${data.name.charAt(0).toUpperCase()}</div>
                     <div>
                         <h4>${name}</h4>
                         <p>${date} <br>${data.status}</p>
                         <p>${data.message}</p>
                     </div>
                 </li>`;
    };

    // Pagination state
    let lengthComentar;
    let itemsPerPage = 5;
    let currentPage = 1;
    let startIndex = 0;
    let endIndex = itemsPerPage;

    const initialComentar = async () => {
        containerComentar.innerHTML = `<h1 style="font-size: 1rem; margin: auto">Loading...</h1>`;
        peopleComentar.textContent = '...';
        pageNumber.textContent = '..';

        try {
            const response = await comentarService.getComentar();

            if (response.error) {
                containerComentar.innerHTML = `<p style="text-align:center">Gagal memuat komentar: ${response.error}</p>`;
                peopleComentar.textContent = '—';
                console.error('service error:', response.error);
                return;
            }

            const { comentar } = response;

            if (!Array.isArray(comentar)) {
                containerComentar.innerHTML = `<p style="text-align:center">Tidak ada data komentar.</p>`;
                peopleComentar.textContent = '0 Orang';
                lengthComentar = 0;
                return;
            }

            lengthComentar = comentar.length;
            comentar.reverse();

            if (comentar.length > 0) {
                peopleComentar.textContent = `${comentar.length} Orang telah mengucapkan`;
            } else {
                peopleComentar.textContent = `Belum ada yang mengucapkan`;
            }

            currentPage = 1;
            startIndex = 0;
            endIndex = itemsPerPage;
            pageNumber.textContent = currentPage.toString();
            renderElement(comentar.slice(startIndex, endIndex), containerComentar, listItemComentar);
        } catch (error) {
            containerComentar.innerHTML = `<p style="text-align:center">Gagal memuat komentar: ${error.message}</p>`;
            peopleComentar.textContent = '—';
            console.error(error);
        }
    };

    const updatePageContent = async () => {
        prevButton.disabled = true;
        nextButton.disabled = true;
        containerComentar.innerHTML = `<h1 style="font-size: 1rem; margin: auto">Loading...</h1>`;
        try {
            const response = await comentarService.getComentar();

            if (response.error) {
                containerComentar.innerHTML = `<p style="text-align:center">Gagal memuat komentar: ${response.error}</p>`;
                console.error('service error:', response.error);
                return;
            }

            const { comentar } = response;
            if (!Array.isArray(comentar)) {
                containerComentar.innerHTML = `<p style="text-align:center">Tidak ada data komentar.</p>`;
                return;
            }

            comentar.reverse();
            renderElement(comentar.slice(startIndex, endIndex), containerComentar, listItemComentar);
            pageNumber.textContent = currentPage.toString();
        } catch (error) {
            containerComentar.innerHTML = `<p style="text-align:center">Gagal memuat komentar: ${error.message}</p>`;
            console.error(error);
        } finally {
            prevButton.disabled = false;
            nextButton.disabled = false;
        }
    };

    nextButton.addEventListener('click', async () => {
        if (endIndex < (lengthComentar || 0)) {
            currentPage++;
            startIndex = (currentPage - 1) * itemsPerPage;
            endIndex = startIndex + itemsPerPage;
            await updatePageContent();
        }
    });

    prevButton.addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage--;
            startIndex = (currentPage - 1) * itemsPerPage;
            endIndex = startIndex + itemsPerPage;
            await updatePageContent();
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        buttonForm.disabled = true;
        const originalText = buttonForm.textContent;
        buttonForm.textContent = 'Loading...';

        const comentar = {
            id: generateRandomId(),
            name: e.target.name.value,
            status: e.target.status.value === 'y' ? 'Hadir' : 'Tidak Hadir',
            message: e.target.message.value,
            date: getCurrentDateTime(),
            color: generateRandomColor(),
        };

        try {
            const result = await comentarService.addComentar(comentar);

            if (result && result.error) {
                throw new Error(result.error);
            }
            if (result && result.status && result.status !== 200) {
                throw new Error(result.message || 'Server menolak request');
            }

            // Success: reload comments and reset form
            await initialComentar();
            form.reset();
        } catch (error) {
            console.error('submit error:', error);
            alert('Gagal mengirim ucapan: ' + error.message);
        } finally {
            buttonForm.disabled = false;
            buttonForm.textContent = originalText || 'Kirim';
        }
    });

    // initialize
    initialComentar().then();
    initialBank();
};
