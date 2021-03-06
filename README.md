# Sztuczna inteligencja

## Temat: Rozpoznawanie i katalogowanie odpadów do poszczególnych sekcji recyklingowych za pomocą sieci neuronowych.


## Quickstart:

Requirements:
* Python
* Node.js

## Prerequisites
### imagenet
pip install -U flask-cors flask flask_uploads

### test-data server
npm install

### client
npm install

### agent
npm install

## Running services

### imagenet
npm run server

### test-data server
npm run server

### client
npm start

### agent
npm start

### Architektura rozwiązania:
* Serwer napisany w języku Python który wyprowadza dwa endpointy, jeden do przesyłania obrazów i drugi do przesyłania URL do obrazka. Następnie dla podanych danych wejściowych próbuje zakwalifikować dany obiekt do jednego z typów odpadów. Katalogowanie prowadzone jest z wykorzystaniem biblioteki TensorFlow wraz z modelem Inception-v3 

* Agent napisany w języku JavaScript z wykorzystaniem biblioteki Puppeteer którego zadaniem jest poruszanie się po mapie, przesyłanie zdjęć do serwera oraz wybieranie konkretnych odpowiedzi na podstawie danych odebranych z serwera.

* Środowisko agenta napisane w języku JavaScript z wykorzystaniem biblioteki React. Agent porusza się po planszy która skonstruowana jest z domów i dróg między nimi dzielącymi się na autostrady oraz zwykłe drogi. 

* Serwer zbierający dane testowe/uczące dla modelu. Pobiera zdefiniowaną ilość obrazów w poszczególnych kategoriach według których algorytm ma rozróżniać obrazy. Zdjęcia pobierane są z serwisu Google Images, następnie zasoby które maja znaleźć się w zbiorze testowym wystawiane są na serwerze HTTP. Server udostepnia dwa endpointy - /upload ktory przyjmuje URL do obrazka oraz /upload-file który przyjmuje obraz.



### Czesci indywidualne
Implementacja rozpoznawania obrazow - Mikołaj Kozakiewicz

### Implementacja:
W rozwiązaniu wykorzystany jest model oparty na konwulsyjnej sieci neuronowej - Inception V3.
Jest on pretrenowany do detekcji treści znajdujących się na przesłanych obrazach.

Architektura modelu Inception: 
![Inception architecture](https://hackathonprojects.files.wordpress.com/2016/09/v3.png)

Schemat pojedynczej warstwy: 
![Inception layers](https://cdn-images-1.medium.com/max/1440/1*acUVChT9lBW4vKaAKQhOOw.png)

Konwulsyjna sieć neuronowa oparta jest na wielu neuronom złożonych w warstwy. Pojedynczy neuron to konkretny zestaw informacji które chcemy pobrać z obrazka i zareagować. Jeżeli wszystkie z nich zostaną spełnione aktywowany zostaje dany neuron. 

Model został ponownie wytrenowany na zbiorze uczącym który zawierał po około 300-400 zdjęć dla każdej kategorii.

##### Rozpoznawane kategorie:
* Papier
* Plastik
* Szkło

