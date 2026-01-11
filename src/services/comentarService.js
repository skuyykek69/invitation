// snippet: replace or update bagian initialComentar() dan form submit handling
    const initialComentar = async () => {
        containerComentar.innerHTML = `<h1 style="font-size: 1rem; margin: auto">Loading...</h1>`;
        peopleComentar.textContent = '...';

        try {
            const response = await comentarService.getComentar();

            // jika service mengembalikan error, tampilkan pesan
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
                return;
            }

            lengthComentar = comentar.length;
            comentar.reverse();

            if (comentar.length > 0) {
                peopleComentar.textContent = `${comentar.length} Orang telah mengucapkan`;
            } else {
                peopleComentar.textContent = `Belum ada yang mengucapkan`;
            }

            pageNumber.textContent = '1';
            renderElement(comentar.slice(startIndex, endIndex), containerComentar, listItemComentar);
        } catch (error) {
            containerComentar.innerHTML = `<p style="text-align:center">Gagal memuat komentar: ${error.message}</p>`;
            peopleComentar.textContent = '—';
            console.error(error);
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
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

            // jika server mengembalikan sukses, reload komentar
            await initialComentar();
            form.reset();
            buttonForm.textContent = 'Kirim';
        } catch (error) {
            console.error('submit error:', error);
            buttonForm.textContent = 'Kirim';
            alert('Gagal mengirim ucapan: ' + error.message);
        }
    });
