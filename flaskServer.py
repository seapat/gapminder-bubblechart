# Sean Klein 5575709
from flask import Flask, render_template, redirect, url_for, request
import pandas as pd

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/')
def index():
    return redirect(url_for('base'))

@app.route('/base' , methods=["POST", "GET"])
def base():
    return render_template('base.html')

@app.route('/bubblechart', methods=["POST", "GET"])
def bubblechart():

    # load data into pandas in order to write into a variable contianing json-format
    values =  "static/data.csv"
    values = pd.read_csv(values)

    # "records" creates a similar variable to d3.csv(); an array of objects
    values = values.to_json(orient = "records")

    # pass variable to html-page of chart
    return render_template('bubblechart.html', data = values )

@app.route('/sources')
def sources():
    return render_template('sources.html')

if __name__ == '__main__':
    app.run(debug=True, port=6002)
