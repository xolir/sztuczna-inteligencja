from google_images_download import google_images_download

response = google_images_download.googleimagesdownload()

dataTypes = {
    'plastic': [
        'plastic bottle',
        'plastic bag'
    ],
    'paper': [
        'paper',
        'pizza box'
    ],
    'glass': [
        'glass'
    ]
}

images = {
    'plastic': [],
    'paper': [],
    'glass': [],
}

for garbageType in dataTypes:
    for subType in dataTypes[garbageType]:
        images[garbageType].append(response.download({
            'keywords': subType,
            'limit': 5,
            'format': 'jpg'
        }))

print(images)   