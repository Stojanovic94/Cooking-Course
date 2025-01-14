document.addEventListener('DOMContentLoaded', ucitajKuhinje);

function ucitajKuhinje() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'kuhinje.json', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);
            let select = document.getElementById('vrsta-kuhinje');
            data.vrste.forEach(vrsta => {
                let option = document.createElement('option');
                option.value = vrsta.cena;
                option.textContent = vrsta.naziv;
                select.appendChild(option);
            });
        } else if (xhr.readyState === 4) {
            console.log('Greška pri učitavanju kuhinja:', xhr.statusText);
        }
    };
    xhr.send();
}

function izracunajCenu() {
    let brojUcesnika = parseInt(document.getElementById('broj-ucenika').value) || 0;
    let vrstaKuhinjeCena = parseInt(document.getElementById('vrsta-kuhinje').value) || 0;
    let trajanje = document.querySelector('input[name="trajanje"]:checked')?.value || 0;

    const CENE_USLUGA = {
        prevoz: 2500,
        smestaj: 2000,
        materijali: 3500
    };

    let dodatneUslugeCena = Array.from(document.querySelectorAll('input[name="usluge"]:checked'))
        .reduce((acc, usluga) => acc + parseInt(usluga.value), 0);

    let ukupnaCena = brojUcesnika * (vrstaKuhinjeCena * trajanje + dodatneUslugeCena);
    document.getElementById('cena').textContent = ukupnaCena;
}

document.getElementById('kurs-forma').addEventListener('input', izracunajCenu);

function validacijaPodataka() {
    let ime = document.getElementById('ime').value.trim();
    let prezime = document.getElementById('prezime').value.trim();
    let kontakt = document.getElementById('telefon').value.trim();
    let brojUcesnika = parseInt(document.getElementById('broj-ucenika').value);
    let datum = document.getElementById('datum').value;
    let vrstaKuhinje = document.getElementById('vrsta-kuhinje').value;
    let trajanje = document.querySelector('input[name="trajanje"]:checked');

    if (!ime || !prezime || !/^\d+$/.test(kontakt) || isNaN(brojUcesnika) || brojUcesnika < 1 || brojUcesnika > 5 || !datum || !vrstaKuhinje || !trajanje) {
        alert("Molimo popunite sva polja ispravno.");
        return false;
    }
    return true;
}

function preuzmiDodatneUsluge() {
    return Array.from(document.querySelectorAll('input[name="usluge"]:checked')).map(usluga => ({
        naziv: usluga.getAttribute('data-naziv'),
        cena: parseInt(usluga.value)
    }));
}

function posaljiPodatke() {
    if (validacijaPodataka()) {
        let trajanje = document.querySelector('input[name="trajanje"]:checked');
        let formData = {
            ime: document.getElementById('ime').value,
            prezime: document.getElementById('prezime').value,
            kontakt: document.getElementById('telefon').value,
            brojUcesnika: document.getElementById('broj-ucenika').value,
            datum: document.getElementById('datum').value,
            vrstaKuhinje: document.getElementById('vrsta-kuhinje').selectedOptions[0].text,
            dodatneUsluge: preuzmiDodatneUsluge(),
            trajanje: trajanje.value,
            cena: document.getElementById('cena').textContent
        };
        
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'api/rezervacija', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                alert('Uspešno rezervisano!');
            } else if (xhr.readyState === 4) {
                console.log('Greška pri slanju podataka:', xhr.statusText);
            }
        };
        xhr.send(JSON.stringify(formData));
    }
    return false;
}
