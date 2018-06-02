import os
from flask import Flask, render_template, request
from flask_cors import CORS
from flask_uploads import UploadSet, configure_uploads, IMAGES
import urllib

from classify_image import run_inference_on_image

app = Flask(__name__)
CORS(app)


photos = UploadSet('photos', IMAGES)

app.config['UPLOADED_PHOTOS_DEST'] = 'static/img'
configure_uploads(app, photos)

currentfilename = ""

fileTypes = {
    "plastic": [
        'water bottle',
        'bottle',
        'water jug'
    ],
    "glass": [
        'goblet',
        'beer glass',
        'cocktail shaker',
    ],
    "paper": [
        "envelope",
        "paper towel",
        "carton",
    ]
}

def cleanup():
    # os.remove(app.config['UPLOADED_PHOTOS_DEST'] + "/" + currentfilename)
    os.remove('logger.txt')

def find_el_in_log():
    found_element = 'no found elements'
    with open('logger.txt') as f:
        suggestion = f.readline()
        suggestion2 = f.readline()
        suggestion3 = f.readline()

    for filetype in fileTypes:
        for element in fileTypes[filetype]:
            if element in suggestion or element in suggestion2 or element in suggestion3:
                found_element = filetype
                cleanup()
                return filetype

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    print('***************** request: \n', request.method)
    print(request.get_json()['photo'])
    print('\n')
    print('***************')
    if request.method == 'POST':
        photoURL = request.get_json()['photo']
        currentfilename = urllib.urlretrieve(photoURL, 'static/static.jpg')[0]
        # currentfilename = photos.save(request.files['photo'])
        print('\n here: ', currentfilename, ' \n \n ')
        os.system("python classify_image.py --image_file >> logger.txt {}".format(currentfilename))

        return find_el_in_log()


if __name__ == '__main__':
    app.run(debug=True)