import numpy as np
import pandas as pd
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from PIL import Image
import PIL.ImageOps

X = np.load('image.npz')['arr_0']
Y = pd.read_csv("labels.csv")["labels"]

classes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
nclasses = len(classes)

X_train,X_test,Y_train,Y_test = train_test_split(X,Y,random_state = 9,train_size = 3500,test_size = 500)
X_train_scaled = X_train/255.0
X_test_scaled = X_test/255.0

clf = LogisticRegression(solver = 'saga',multi_class='multinomial').fit(X_train_scaled,Y_train)

def get_prediction(image):
    image_pil = Image.open(image)
    #converting to a grayscale image. If 'P' then colorful
    image_bw = image_pil.convert('L')
    #resizing to 22 by 30 size
    image_bw_resized = image_bw.resize((22,30),Image.ANTIALIAS)
    #defining the minimum and maximum pixel range
    pixel_filter = 20
    #specifying minimum range
    min_pixels = np.percentile(image_bw_resized, pixel_filter)
    #clipping the image to give the minimum color value
    image_bw_resized__inverted_scaled = np.clip(image_bw_resized-min_pixels,0,255)
    #specifying max range
    max_pixels = np.max(image_bw_resized)
    #creating an array to give the pixels with maximum color value
    image_bw_resized_inverted_scaled = np.asarray(image_bw_resized_inverted_scaled)/(max_pixels)
    test_sample = np.array(image_bw_resized_inverted_scaled).reshape(1,660)
    test_pred = clf.predict(test_sample)
    return test_pred[0]