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
        'plastic',
    ],
    "glass": [
        'glass',
    ],
    "paper": [
        "paper"
    ]
}

def cleanup():
    # os.remove(app.config['UPLOADED_PHOTOS_DEST'] + "/" + currentfilename)
    os.remove('logger.txt')

def find_el_in_log():
    found_element = 'no found elements'
    with open('logger.txt') as f:
        suggestion = f.readline()

    for filetype in fileTypes:
        for element in fileTypes[filetype]:
            print('Found element to be', suggestion, '\n')
            if element in suggestion:
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
        os.system("python label_image.py --graph=/tmp/output_graph.pb --labels=/tmp/output_labels.txt --input_layer=Placeholder --output_layer=final_result --image {} >> logger.txt".format(currentfilename))

        return find_el_in_log()

@app.route('/upload-file', methods=['GET', 'POST'])
def uploadFile():
    if request.method == 'POST' and 'photo' in request.files:
        print("FILENAME ******** /n/n/n", request.files['photo'])
        currentfilename = photos.save(request.files['photo'])
        print('here')
        os.system("python label_image.py --graph=/tmp/output_graph.pb --labels=/tmp/output_labels.txt --input_layer=Placeholder --output_layer=final_result --image {} >> logger.txt".format(app.config['UPLOADED_PHOTOS_DEST'] + "/" + currentfilename))
        

        return find_el_in_log()

if __name__ == '__main__':
    app.run(debug=True)